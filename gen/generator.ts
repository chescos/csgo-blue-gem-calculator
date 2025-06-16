import fs from 'fs';
import { readdir } from 'fs/promises';
import sharp from 'sharp';
import { HeatTreatedClassifier } from './algorithm/classifier-heat-treated';
import { ColorType } from './algorithm/color-type';
import { items } from './items';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import Downloader from './downloader';
import path from 'path';

export class BlueGemGenerator {
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
            const fileName = image === 'default'
                ? `${item.slug}_${type}_${seed}.png`
                : `${item.slug}_${type}_${image}_${seed}.png`;

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

  public static async convertToMaskedImage(
    imagePath: string,
    outputPath: string | undefined = undefined,
  ): Promise<void> {
    const startTime = Date.now();
    const { info, data } = await sharp(imagePath).raw().toBuffer({ resolveWithObject: true });

    let blueCount = 0;
    let totalCount = 0;

    const classifier = new HeatTreatedClassifier();

    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      if (a == 0) {
        continue;
      }

      totalCount++;
      const [r, g, b] = [data[i]!, data[i + 1]!, data[i + 2]!];

      const colorType = classifier.getColorType(r, g, b);

      if (colorType === ColorType.Blue) {
        blueCount++;
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 255;
      } else if (colorType === ColorType.Purple) {
        data[i] = 255;
        data[i + 1] = 0;
        data[i + 2] = 255;
      } else if (colorType === ColorType.Gold) {
        data[i] = 255;
        data[i + 1] = 215;
        data[i + 2] = 0;
      } else if (colorType === ColorType.GrayOrUndetermined) {
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
      }
    }

    // get percentage, rounded to 2 decimal places
    const bluePercentage = Math.round((blueCount / totalCount) * 100 * 100) / 100;
    const finishedSeconds = (Date.now() - startTime) / 1000;

    console.log(`Image: ${imagePath}, Blue percentage: ${bluePercentage}%, Finished in ${finishedSeconds}s`);

    outputPath ??= imagePath.replace('.png', '.masked.png');

    await sharp(Buffer.from(data), {
      raw: {
        width: info.width,
        height: info.height,
        channels: info.channels,
      },
    }).toFile(outputPath);
  }

  *getImageFiles(filter: string): Generator<string> {
    for (const file of fs.readdirSync('images')) {
      if (file.includes(filter)) {
        yield `./images/${file}`;
      }
    }
  }

  run(): void {
    const images = this.getImageFiles('deagle_ht');
    for (const image of images) {
      if (image.includes('deagle_ht_490')) {
        BlueGemGenerator.convertToMaskedImage(image, 'gen/last_image_masked.png');
      }
    }
  }
}

const generator = new BlueGemGenerator();

generator.download();
