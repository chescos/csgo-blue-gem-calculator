import fs from "fs";
import sharp from "sharp";

class BlueGemGenerator {
  *getImageFiles(filter: string): Generator<string> {
    for (const file of fs.readdirSync("images")) {
      if (file.includes(filter)) {
        yield `./images/${file}`;
      }
    }
  }

  async analyzeImage(imagePath: string): Promise<void> {
    let blueCount = 0;
    const startTime = Date.now();

    const { info, data } = await sharp(fs.realpathSync(imagePath))
      .raw()
      .toBuffer({ resolveWithObject: true });

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      if (a == 0) {
        continue;
      }

      if (b > 100) {
        blueCount++;
      }
    }

    console.log(`Image: ${imagePath}`);
    console.log(`Blue pixels: ${blueCount}`);
    console.log(`Finished in ${(Date.now() - startTime) / 1000} seconds`);
  }

  run(): void {
    const images = this.getImageFiles("deagle_ht");
    for (const image of images) {
      if (image.includes("deagle_ht_490")) {
        this.analyzeImage(image);
      }
    }
  }
}

const generator = new BlueGemGenerator();

generator.run();
