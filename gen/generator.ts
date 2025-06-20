import { readdir, readFile, writeFile } from 'fs/promises';
import sharp from 'sharp';
import { HeatTreatedClassifier } from './algorithm/classifier-heat-treated';
import { ColorType } from './algorithm/color-type';
import { items, ItemKey, FinishKey, ImagePose, PercentageNumbers } from './items';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import Downloader from './downloader';
import path from 'path';
import { CaseHardenedClassifier } from './algorithm/classifier-case-hardened';

export type SubRegion = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const FullImage: SubRegion = { x: 0, y: 0, width: 1, height: 1 };

type QueueItem = {
  itemKey: ItemKey;
  finishKey: FinishKey;
  seed: number;
  imagePose: ImagePose;
  imageRegion: SubRegion;
};

type ResultItem = QueueItem & {
  result: PercentageNumbers;
};

type ResultFormat = {
  [itemKey: string]: {
    [finishKey: string]: {
      [imagePose: string]: Array<number>;
    };
  };
};

export class BlueGemGenerator {
  dirname: string;
  queue: QueueItem[] = [];
  results: ResultItem[] = [];

  itemFilter: ItemKey | undefined;
  patternFilter: number | undefined;

  constructor(itemFilter?: ItemKey, patternFilter?: string) {
    this.dirname = dirname(fileURLToPath(import.meta.url));
    this.itemFilter = itemFilter;
    if (patternFilter) {
      this.patternFilter = parseInt(patternFilter, 10);
    }
  }

  public static constructImageFileNameForTypeAndSeed(
    key: ItemKey,
    type: FinishKey,
    pose: ImagePose,
    seed: number,
  ): string {
    return `${key}_${type}_${pose}_${seed}.avif`;
  }

  getAllImageFiles(): string[] {
    const files: string[] = [];

    for (const itemKey of Object.keys(items) as ItemKey[]) {
      const item = items[itemKey];

      item.types.forEach((type): void => {
        item.images.forEach((image): void => {
          for (let seed = 0; seed <= 1000; seed++) {
            const fileName = BlueGemGenerator.constructImageFileNameForTypeAndSeed(itemKey, type, image, seed);

            files.push(fileName);
          }
        });
      });
    }

    return files;
  }

  async download(): Promise<void> {
    const folder = path.join(this.dirname, '../images');

    const files = await readdir(folder, { withFileTypes: true });

    const fileSet = new Set();

    files.forEach((file) => {
      fileSet.add(file.name);
    });

    const baseUrl: string = 'https://cdn.csgoskins.gg/public/images/gems/v2/poses/';

    const urls: string[] = [];

    const imageFiles = this.getAllImageFiles();

    imageFiles.forEach((imageFile) => {
      if (!fileSet.has(imageFile)) {
        urls.push(`${baseUrl}${imageFile}`);
      }
    });

    if (urls.length > 0) {
      const downloader = new Downloader(urls, folder, 100);

      await downloader.start();
    }
  }

  static async calculateBlueGemPercentagesForImage(
    imagePath: string,
    imageRegion: SubRegion,
    finishKey: FinishKey,
  ): Promise<PercentageNumbers> {
    //const startTime = Date.now();
    const { info, data } = await sharp(imagePath).raw().toBuffer({ resolveWithObject: true });

    const classifier = finishKey === 'ht' ? new HeatTreatedClassifier() : new CaseHardenedClassifier();

    const count = [0, 0, 0, 0];
    let totalCount = 0;

    const minWidth = info.width * imageRegion.x;
    const minHeight = info.height * imageRegion.y;
    const maxWidth = minWidth + info.width * imageRegion.width;
    const maxHeight = minHeight + info.height * imageRegion.height;

    for (let y = minHeight; y < maxHeight; y++) {
      for (let x = minWidth; x < maxWidth; x++) {
        const i = (y * info.width + x) * 4; // 4 bytes per pixel (RGBA)

        const a = data[i + 3];
        if (a == 0) {
          continue;
        }

        const [r, g, b] = [data[i]!, data[i + 1]!, data[i + 2]!];
        const colorType = classifier.getColorType(r, g, b);

        count[colorType]!++;
        totalCount++;
      }
    }

    //const totalTime = (Date.now() - startTime) / 1000;

    if (count.reduce((a, b) => a + b, 0) !== totalCount) {
      throw new Error('Color counts do not match total count');
    }

    const toPercentage = (value: number): number => {
      return Math.round((value / totalCount) * 100 * 100) / 100;
    };

    return {
      blue: toPercentage(count[ColorType.Blue]!),
      purple: toPercentage(count[ColorType.Purple]!),
      gold: toPercentage(count[ColorType.Gold]!),
      other: toPercentage(count[ColorType.GrayOrUndetermined]!),
    };
  }

  async run(): Promise<void> {
    console.log('Calculating images...');

    for (const itemKey of Object.keys(items) as ItemKey[]) {
      const item = items[itemKey];

      if (this.itemFilter && this.itemFilter !== itemKey) {
        continue;
      }

      item.types.forEach((finishKey): void => {
        item.images.forEach((imagePose): void => {
          for (let seed = 0; seed <= 1000; seed++) {
            if (this.patternFilter && this.patternFilter !== seed) {
              continue;
            }

            this.queue.push({
              itemKey,
              finishKey,
              imagePose,
              seed,
              imageRegion: FullImage,
            });
          }
        });
      });
    }

    const concurrency = 100;

    const promises: Promise<void>[] = [];

    for (let i = 0; i < concurrency; i++) {
      promises.push(this.spawnWorker());
    }

    await Promise.all(promises);

    console.log('\nAll images calculated');
  }

  async spawnWorker(): Promise<void> {
    // TODO: Use multiple cores, not just one
    let queueItem: QueueItem | undefined;

    while ((queueItem = this.queue.shift()) !== undefined) {
      const imageName = BlueGemGenerator.constructImageFileNameForTypeAndSeed(
        queueItem.itemKey,
        queueItem.finishKey,
        queueItem.imagePose,
        queueItem.seed,
      );

      const imagePath = `./images/${imageName}`;

      const result = await BlueGemGenerator.calculateBlueGemPercentagesForImage(
        imagePath,
        queueItem.imageRegion,
        queueItem.finishKey,
      );

      this.results.push({
        ...queueItem,
        result,
      });

      this.updateStatus();
    }
  }

  updateStatus() {
    const done = this.results.length.toLocaleString('en-US');
    const total = (this.queue.length + this.results.length).toLocaleString('en-US');

    process.stdout.write(`\r${done}/${total} images calculated`);
  }

  async storeResult() {
    // TODO: We either need to compress the data a lot for out NPM package, or fetch it from a URL,
    //  so that the NPM package does not get too large.

    const jsonPath = path.join(this.dirname, '/', 'result.json');

    const existingResult = JSON.parse((await readFile(jsonPath, 'utf-8')) || '{}') as ResultFormat;

    const grouped = this.results.reduce((acc, item) => {
      const { itemKey, finishKey, imagePose, seed, result } = item;

      if (!acc[itemKey]) acc[itemKey] = {};
      if (!acc[itemKey][finishKey]) acc[itemKey][finishKey] = {};
      if (!acc[itemKey][finishKey][imagePose]) acc[itemKey][finishKey][imagePose] = [];

      const index = seed * 4;

      acc[itemKey][finishKey][imagePose][index] = result.blue;
      acc[itemKey][finishKey][imagePose][index + 1] = result.purple;
      acc[itemKey][finishKey][imagePose][index + 2] = result.gold;
      acc[itemKey][finishKey][imagePose][index + 3] = result.other;

      return acc;
    }, existingResult);

    let stringifiedJson = '';
    let indent = 0;
    const addLine = (line: string, addComma = false) =>
      (stringifiedJson += '\t'.repeat(indent) + line + (addComma ? ',' : '') + '\n');

    addLine('{');
    indent++;

    const groupEntries = Object.entries(grouped);
    let g = 0;

    for (const [itemKey, itemData] of groupEntries) {
      addLine(`"${itemKey}": {`);
      indent++;
      g++;

      const finishEntries = Object.entries(itemData);
      let f = 0;

      for (const [finishKey, finishData] of finishEntries) {
        addLine(`"${finishKey}": {`);
        indent++;
        f++;

        const regionEntries = Object.entries(finishData);
        let r = 0;
        for (const [region, percentages] of regionEntries) {
          addLine(`"${region}": [`);
          indent++;
          r++;

          for (let seed = 0; seed <= 1000; seed++) {
            const index = seed * 4;
            addLine(
              `${percentages[index]}, ${percentages[index + 1]}, ${percentages[index + 2]}, ${percentages[index + 3]}`,
              seed < 1000,
            );
          }

          addLine(']', r < regionEntries.length);
          indent--;
        }

        addLine('}', f < finishEntries.length);
        indent--;
      }

      addLine('}', g < groupEntries.length);
      indent--;
    }

    addLine('}');
    indent--;

    await writeFile(jsonPath, stringifiedJson, 'utf-8');
  }
}

if (process.argv[2] === '--generate') {
  const generator = new BlueGemGenerator(process.argv[3] as ItemKey, process.argv[4] as string);
  await generator.download();
  await generator.run();
  await generator.storeResult();
}
