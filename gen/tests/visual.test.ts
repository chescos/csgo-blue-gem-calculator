import { test, expect } from 'vitest';
import { BlueGemGenerator } from '../generator';

test('sample', async () => {
  await Promise.all([
    BlueGemGenerator.convertToMaskedImage('gen/tests/images/heat_treated_blue_deagle_490.png'),
    BlueGemGenerator.convertToMaskedImage('gen/tests/images/heat_treated_purple_deagle_172.png'),
    BlueGemGenerator.convertToMaskedImage('gen/tests/images/heat_treated_gold_deagle_182.png'),
  ]);

  expect(true).toBe(true);

  // todo: use git diff to ensure the image is correct`
});
