import { readdir } from 'fs/promises';
import sharp from 'sharp';
import { HeatTreatedClassifier } from './algorithm/classifier-heat-treated';
import { ColorType } from './algorithm/color-type';
import { items, PaintType } from './items';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import Downloader from './downloader';
import path from 'path';

type BlueGemPercentages = {
  blue: number;
  purple: number;
  gold: number;
  other: number;
};

export class BlueGemGenerator {
  public static constructImageFileNameForTypeAndSeed(slug: string, type: PaintType, pose: string, seed: number): string {
    return pose === 'default'
      ? `${slug}_${type}_${seed}.png`
      : `${slug}_${type}_${pose}_${seed}.png`;
  }

  async download(): Promise<void> {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const folder = path.join(__dirname, '../images');

    const files = await readdir(folder, { withFileTypes: true });

    const fileSet = new Set();

    files.forEach((file) => {
      fileSet.add(file.name);
    });

    const baseUrl: string = 'https://cdn.csgoskins.gg/public/images/gems/v1/';

    const urls: string[] = [];

    Object.values(items).forEach((item): void => {
      item.types.forEach((type): void => {
        item.images.forEach((image): void => {
          for (let seed = 0; seed <= 1000; seed++) {
            const fileName = BlueGemGenerator.constructImageFileNameForTypeAndSeed(item.slug, type, image, seed);

            if (!fileSet.has(fileName)) {
              urls.push(`${baseUrl}${fileName}`);
            }
          }
        });
      });
    });

    const downloader = new Downloader(urls, folder, 100);

    await downloader.start();
  }

  async calculateBlueGemPercentagesForImage(imagePath: string): Promise<BlueGemPercentages> {
    //const startTime = Date.now();
    const { data } = await sharp(imagePath).raw().toBuffer({ resolveWithObject: true });

    const classifier = new HeatTreatedClassifier();

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
    }

    return {
      blue: toPercentage(count[ColorType.Blue]!),
      purple: toPercentage(count[ColorType.Purple]!),
      gold: toPercentage(count[ColorType.Gold]!),
      other: toPercentage(count[ColorType.GrayOrUndetermined]!),
    }
  }

  run(): void {
    const item = items['deagle']!;

    for (let seed = 0; seed <= 1000; seed++) {
      const imageName = BlueGemGenerator.constructImageFileNameForTypeAndSeed(item.slug, 'ht', 'default', seed);
      const imagePath = `./images/${imageName}`;

      // todo: is this spawning too many promises?
      this.calculateBlueGemPercentagesForImage(imagePath)
        .then((percentages: BlueGemPercentages): void => {
          console.log(`Seed: ${seed}, Blue: ${percentages.blue}%, Purple: ${percentages.purple}%, Gold: ${percentages.gold}%, Other: ${percentages.other}%`);
        })
        .catch((error: Error): void => {
          console.error(`Error processing image ${imageName}:`, error.message);
        });
    }
  }
}


const generator = new BlueGemGenerator();

await generator.download();
generator.run();
