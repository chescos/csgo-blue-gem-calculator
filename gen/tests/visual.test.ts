import { test } from 'vitest';
import sharp from 'sharp';
import { exec } from 'child_process';
import { HeatTreatedClassifier } from '../algorithm/classifier-heat-treated';
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

    classifier.maskColorForDebugVisualization(data, i);
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
