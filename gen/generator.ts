// @ts-nocheck

import fs from 'fs';
import sharp from 'sharp';
import srgbtransform from './utils/srgb-transform';

class BlueGemGenerator {
  static rgb2hsv(r: number, g: number, b: number): [number, number, number] {
    let v = Math.max(r, g, b),
      c = v - Math.min(r, g, b);
    let h =
      c && (v == r ? (g - b) / c : v == g ? 2 + (b - r) / c : 4 + (r - g) / c);
    return [60 * (h < 0 ? h + 6 : h), v && c / v, v];
  }

  static IsHeatTreatedBlueHsv(
    hue: number,
    saturation: number,
    brightness: number,
  ): boolean {
    if (hue < 200 || hue >= 250) return false;
    if (saturation < 0.3 || saturation >= 1.0) return false;
    if (brightness < 0.1 || brightness >= 1.0) return false;

    return true;
  }

  static IsHeatTreatedPurpleHsv(
    hue: number,
    saturation: number,
    brightness: number,
  ): boolean {
    if (hue < 250 || hue >= 320) return false;
    if (saturation < 0.2 || saturation >= 1.0) return false;
    if (brightness < 0.05 || brightness >= 1.0) return false;

    return true;
  }

  async analyzeImage(imagePath: string): Promise<void> {
    const startTime = Date.now();

    const { info, data } = await sharp(fs.realpathSync(imagePath))
      .raw()
      .toBuffer({ resolveWithObject: true });

    let blueCount = 0;
    let totalCount = 0;

    const WarnForDoubleClassification = false;
    const UseLinearColors = true;

    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      if (a == 0) {
        continue;
      }

      totalCount++;
      let [r, g, b] = [data[i], data[i + 1], data[i + 2]];

      if (UseLinearColors) {
        [r, g, b] = [
          srgbtransform.srgb8BitToLinear(r),
          srgbtransform.srgb8BitToLinear(g),
          srgbtransform.srgb8BitToLinear(b),
        ];
      } else {
        r /= 255;
        g /= 255;
        b /= 255;
      }

      const [h, s, v] = BlueGemGenerator.rgb2hsv(r, g, b);

      const isBlue = BlueGemGenerator.IsHeatTreatedBlueHsv(h, s, v);
      const isPurple = BlueGemGenerator.IsHeatTreatedPurpleHsv(h, s, v);

      const isGold = !isBlue && !isPurple; // todo: gold classification

      if (WarnForDoubleClassification) {
        if (isBlue && isPurple) {
          console.warn(
            `Double classification detected at pixel ${i / 4}: Blue and Purple`,
          );
        }
      }

      if (isBlue) {
        blueCount++;
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 255;
      } else if (isPurple) {
        data[i] = 255;
        data[i + 1] = 0;
        data[i + 2] = 255;
      } else if (isGold) {
        data[i] = 255;
        data[i + 1] = 215;
        data[i + 2] = 0;
      } else {
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
      }
    }

    // get percentage, rounded to 2 decimal places
    const bluePercentage =
      Math.round((blueCount / totalCount) * 100 * 100) / 100;
    const finishedSeconds = (Date.now() - startTime) / 1000;

    console.log(
      `Image: ${imagePath}, Blue percentage: ${bluePercentage}%, Finished in ${finishedSeconds}s`,
    );

    // write masked image for visualization
    await sharp(Buffer.from(data), {
      raw: {
        width: info.width,
        height: info.height,
        channels: info.channels,
      },
    }).toFile('gen/last_image_masked.png');
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
        this.analyzeImage(image);
      }
    }
  }
}

const generator = new BlueGemGenerator();

generator.run();
