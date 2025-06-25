import { test, expect } from 'vitest';
import { BlueGemGenerator, FullImage, SubRegion } from '../generator';

const imagePath = 'gen/tests/images/case_hardened_blue_ak47_661.png';
const akPlaysideimageDimensions = { width: 1873, height: 539 };

test('image-percentage-results', async () => {
  const result = await BlueGemGenerator.calculateBlueGemPercentagesForImage(imagePath, FullImage, 'ch');

  expect(result).toEqual({ blue: 37.66, purple: 4.48, gold: 47.7, other: 10.16 });
});

test('image-percentage-results-no-pixels', async () => {
  const area: SubRegion = { x: 0, y: 0, width: 0.001, height: 0.001 };

  const result = await BlueGemGenerator.calculateBlueGemPercentagesForImage(imagePath, area, 'ch');

  // No pixels in the area, so its fine to return NaN
  expect(result).toEqual({ blue: NaN, purple: NaN, gold: NaN, other: NaN });
});

test('image-percentage-results-661-top-area', async () => {
  // How to calculate this?
  // Go to photopea.com, add the image, create a rectangle
  // Press info button on the right side, and then click on the Properties panel

  const subRegionImageUnits = {
    x: 949,
    y: 31,
    width: 397,
    height: 48,
  };

  const topAreaFullBlue: SubRegion = {
    x: subRegionImageUnits.x / akPlaysideimageDimensions.width,
    y: subRegionImageUnits.y / akPlaysideimageDimensions.height,
    width: subRegionImageUnits.width / akPlaysideimageDimensions.width,
    height: subRegionImageUnits.height / akPlaysideimageDimensions.height,
  };

  const result = await BlueGemGenerator.calculateBlueGemPercentagesForImage(imagePath, topAreaFullBlue, 'ch');

  expect(result).toEqual({
    blue: 99.52,
    other: 0.45,
    gold: 0.03,
    purple: 0.01,
  });
});

/*
const c: SubRegion = {
  x: 943,
  y: 29,
  width: 402,
  height: 51,
};

console.log({
  x: c.x / akPlaysideimageDimensions.width,
  y: c.y / akPlaysideimageDimensions.height,
  width: c.width / akPlaysideimageDimensions.width,
  height: c.height / akPlaysideimageDimensions.height,
})
*/
