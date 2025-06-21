import { test } from 'vitest';
import sharp from 'sharp';
import { exec } from 'child_process';
import { HeatTreatedClassifier } from '../algorithm/classifier-heat-treated';
import { ColorType } from '../algorithm/color-type';
import { CaseHardenedClassifier } from '../algorithm/classifier-case-hardened';
import { BaseClassifier } from '../algorithm/classifier-base';

test('masking', async () => {
  const ht = new HeatTreatedClassifier();
  const ch = new CaseHardenedClassifier();

  await Promise.all([
    convertToMaskedImage(ht, 'gen/tests/images/heat_treated_blue_deagle_490.png'),
    convertToMaskedImage(ht, 'gen/tests/images/heat_treated_purple_deagle_172.png'),
    convertToMaskedImage(ht, 'gen/tests/images/heat_treated_gold_deagle_182.png'),
    convertToMaskedImage(ch, 'gen/tests/images/case_hardened_blue_bayonet_555.png'),
    convertToMaskedImage(ch, 'gen/tests/images/case_hardened_gold_bayonet_395.png'),
    convertToMaskedImage(ch, 'gen/tests/images/case_hardened_blue_ak47_661.png'),
    convertToMaskedImage(ch, 'gen/tests/images/case_hardened_purple_ak47_571.png'),
  ]);

  const diff = new Promise<void>((resolve, reject) => {
    const process = exec('git diff --name-only --exit-code gen/tests/images');

    let log = '';
    process.stdout?.on('data', (data) => {
      log += data.toString();
    });

    process.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error('Masked images differ. Please commit the files if the results are acceptable.\n' + log));
      }
    });
  });

  await diff;
});

async function convertToMaskedImage(
  classifier: BaseClassifier,
  imagePath: string,
  outputPath: string | undefined = undefined,
): Promise<void> {
  const { info, data } = await sharp(imagePath).raw().toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a == 0) {
      continue;
    }

    const [r, g, b] = [data[i]!, data[i + 1]!, data[i + 2]!];

    const colorType = classifier.getColorType(r, g, b);

    if (colorType === ColorType.Blue) {
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

  outputPath ??= imagePath.replace('.', '.masked.');

  await sharp(Buffer.from(data), {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels,
    },
  }).toFile(outputPath);
}
