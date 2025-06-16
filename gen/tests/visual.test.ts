import { test, expect } from 'vitest';
import sharp from 'sharp';
import { HeatTreatedClassifier } from '../algorithm/classifier-heat-treated';
import { ColorType } from '../algorithm/color-type';

test('sample', async () => {
  await Promise.all([
    convertToMaskedImage('gen/tests/images/heat_treated_blue_deagle_490.png'),
    convertToMaskedImage('gen/tests/images/heat_treated_purple_deagle_172.png'),
    convertToMaskedImage('gen/tests/images/heat_treated_gold_deagle_182.png'),
  ]);

  expect(true).toBe(true);

  // todo: use git diff to ensure the image is correct`
});

async function convertToMaskedImage(imagePath: string, outputPath: string | undefined = undefined): Promise<void> {
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
