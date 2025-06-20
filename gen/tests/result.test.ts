import { test, expect} from 'vitest';
import { BlueGemGenerator, FullImage } from '../generator';

test('image-percentage-results', async () => {
  const imagePath = 'gen/tests/images/case_hardened_blue_ak47_661.png';

  const result = await BlueGemGenerator.calculateBlueGemPercentagesForImage(imagePath, FullImage, 'ch');
  const expectedResult = { blue: 37.66, purple: 4.48, gold: 47.7, other: 10.16 };

  expect(result).toEqual(expectedResult);
});

