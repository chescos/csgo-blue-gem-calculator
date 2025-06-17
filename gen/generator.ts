import { readdir, writeFile } from 'fs/promises';
import sharp from 'sharp';
import { HeatTreatedClassifier } from './algorithm/classifier-heat-treated';
import { ColorType } from './algorithm/color-type';
import { items, PaintType, ImagePose, ItemKey } from './items';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import Downloader from './downloader';
import path from 'path';
import { CaseHardenedClassifier } from './algorithm/classifier-case-hardened';

type BlueGemPercentages = {
  blue: number;
  purple: number;
  gold: number;
  other: number;
};

type QueueItem = {
  itemKey: ItemKey;
  paintType: PaintType;
  imagePose: ImagePose;
  seed: number;
};

type ResultItem = QueueItem & {
  result: BlueGemPercentages;
};

type ResultFormat = {
  [itemKey: string]: {
    [paintType: string]: {
      [imagePose: string]: {
        seed: number;
        blue: number;
        purple: number;
        gold: number;
        other: number;
      }[];
    };
  };
};

export class BlueGemGenerator {
  dirname: string;
  queue: QueueItem[] = [];
  results: ResultItem[] = [];

  constructor() {
    this.dirname = dirname(fileURLToPath(import.meta.url));
  }

  public static constructImageFileNameForTypeAndSeed(
    slug: string,
    type: PaintType,
    pose: ImagePose,
    seed: number,
  ): string {
    return pose === 'default' ? `${slug}_${type}_${seed}.png` : `${slug}_${type}_${pose}_${seed}.png`;
  }

  getAllImageFiles(): string[] {
    const files: string[] = [];

    Object.values(items).forEach((item): void => {
      item.types.forEach((type): void => {
        item.images.forEach((image): void => {
          for (let seed = 0; seed <= 1000; seed++) {
            const fileName = BlueGemGenerator.constructImageFileNameForTypeAndSeed(item.slug, type, image, seed);

            files.push(fileName);
          }
        });
      });
    });

    return files;
  }

  async download(): Promise<void> {
    const folder = path.join(this.dirname, '../images');

    const files = await readdir(folder, { withFileTypes: true });

    const fileSet = new Set();

    files.forEach((file) => {
      fileSet.add(file.name);
    });

    const baseUrl: string = 'https://cdn.csgoskins.gg/public/images/gems/v1/';

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

  async calculateBlueGemPercentagesForImage(imagePath: string, paintType: PaintType): Promise<BlueGemPercentages> {
    //const startTime = Date.now();
    const { data } = await sharp(imagePath).raw().toBuffer({ resolveWithObject: true });

    const classifier = paintType === 'ht'
      ? new HeatTreatedClassifier()
      : new CaseHardenedClassifier();

    const count = [0, 0, 0, 0];
    let totalCount = 0;

    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      if (a == 0) {
        continue;
      }

      const [r, g, b] = [data[i]!, data[i + 1]!, data[i + 2]!];
      const colorType = classifier.getColorType(r, g, b);

      count[colorType]!++;
      totalCount++;
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

      item.types.forEach((paintType): void => {
        item.images.forEach((imagePose): void => {
          for (let seed = 0; seed <= 1000; seed++) {
            this.queue.push({
              itemKey,
              paintType,
              imagePose,
              seed,
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
    let queueItem: QueueItem | undefined;

    while ((queueItem = this.queue.shift()) !== undefined) {
      const imageName = BlueGemGenerator.constructImageFileNameForTypeAndSeed(
        items[queueItem.itemKey].slug,
        queueItem.paintType,
        queueItem.imagePose,
        queueItem.seed,
      );

      const imagePath = `./images/${imageName}`;

      const result = await this.calculateBlueGemPercentagesForImage(imagePath, queueItem.paintType);

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
    const grouped = this.results.reduce((acc, item) => {
      const { itemKey, paintType, imagePose, seed, result } = item;

      if (!acc[itemKey]) acc[itemKey] = {};
      if (!acc[itemKey][paintType]) acc[itemKey][paintType] = {};
      if (!acc[itemKey][paintType][imagePose]) acc[itemKey][paintType][imagePose] = [];

      acc[itemKey][paintType][imagePose].push({
        seed,
        ...result,
      });

      return acc;
    }, {} as ResultFormat);

    const sortedResult: ResultFormat = {};

    Object.keys(grouped)
      .sort()
      .forEach((itemKey) => {
        sortedResult[itemKey] = {};

        Object.keys(grouped[itemKey]!)
          .sort()
          .forEach((paintType) => {
            sortedResult[itemKey]![paintType] = {};

            Object.keys(grouped[itemKey]![paintType]!)
              .sort()
              .forEach((imagePose) => {
                sortedResult[itemKey]![paintType]![imagePose] = grouped[itemKey]![paintType]![imagePose]!.sort(
                  (a, b) => b.blue - a.blue,
                );
              });
          });
      });

    await writeFile(path.join(this.dirname, '/', 'result.json'), JSON.stringify(sortedResult, null, 2));
  }
}

const generator = new BlueGemGenerator();

await generator.download();
await generator.run();
await generator.storeResult();
