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
            const fileName =
              image === 'default' ? `${item.slug}_${type}_${seed}.png` : `${item.slug}_${type}_${image}_${seed}.png`;

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
        //BlueGemGenerator.convertToMaskedImage(image, 'gen/last_image_masked.png');
      }
    }
  }
}

const generator = new BlueGemGenerator();

generator.download();
generator.run();
