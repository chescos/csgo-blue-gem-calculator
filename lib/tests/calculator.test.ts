import { test, expect } from 'vitest';
import BlueGemCalculator from '../calculator';
import { FinishName, ItemName, Region } from '../../gen/items';

const calculatorTest = new BlueGemCalculator();

test('Generic getList test', () => {
  const caseHardenedList = calculatorTest.getList('Case Hardened');
  expect(caseHardenedList).to.be.an('array');
  expect(caseHardenedList.length).toBeGreaterThan(0);

  const heatTreatedList = calculatorTest.getList('Heat Treated');
  expect(heatTreatedList).to.be.an('array');
  expect(heatTreatedList.length).toBeGreaterThan(0);
});

test('Generic getAllPercentages test', () => {
  const karambit = calculatorTest.getAllPercentages('Case Hardened', 'Karambit');
  expect(karambit).to.be.an('object');
  expect(karambit.item).toBe('Karambit');
  expect(karambit.percentages.length).toBe(1001);
});

test('Generic getPercentages test', () => {
  const mac10Seed = calculatorTest.getPercentages('Case Hardened', 'MAC-10', 111);
  expect(mac10Seed).to.be.an('object');
  expect(mac10Seed.seed).toBe(111);
  expect(mac10Seed.playside).to.be.an('object');
});

test('Generic getSupportedItems test', () => {
  const supportedItems = calculatorTest.getSupportedItems('Case Hardened');
  expect(supportedItems).to.be.an('array');
  expect(supportedItems.length).toBe(23);
});

test('Specific rank test', () => {
  const data: Array<{
    item: ItemName;
    finish: FinishName;
    region: Region;
    color: 'blue' | 'purple' | 'gold' | 'other';
    rank: number;
    seed: number;
  }> = [
    // These are off so far: AK-47, MAC-10, Nomad Knife, Shadow Daggers, Navaja Knife.
    {
      item: 'Desert Eagle',
      finish: 'Heat Treated',
      region: 'playside',
      color: 'blue',
      rank: 0,
      seed: 490,
    },
    {
      item: 'Five-SeveN',
      finish: 'Heat Treated',
      region: 'playside',
      color: 'blue',
      rank: 0,
      seed: 904,
    },
    {
      item: 'Five-SeveN',
      finish: 'Case Hardened',
      region: 'playside',
      color: 'blue',
      rank: 0,
      seed: 690,
    },
    {
      item: 'Karambit',
      finish: 'Case Hardened',
      region: 'playside',
      color: 'blue',
      rank: 0,
      seed: 387,
    },
    {
      item: 'Karambit',
      finish: 'Case Hardened',
      region: 'backside',
      color: 'blue',
      rank: 0,
      seed: 417,
    },
    {
      item: 'M9 Bayonet',
      finish: 'Case Hardened',
      region: 'playside',
      color: 'blue',
      rank: 0,
      seed: 601,
    },
    {
      item: 'Butterfly Knife',
      finish: 'Case Hardened',
      region: 'playside',
      color: 'blue',
      rank: 0,
      seed: 182,
    },
    {
      item: 'Skeleton Knife',
      finish: 'Case Hardened',
      region: 'playside',
      color: 'blue',
      rank: 0,
      seed: 403,
    },
    {
      item: 'Skeleton Knife',
      finish: 'Case Hardened',
      region: 'backside',
      color: 'blue',
      rank: 0,
      seed: 468,
    },
    {
      item: 'Talon Knife',
      finish: 'Case Hardened',
      region: 'playside',
      color: 'blue',
      rank: 0,
      seed: 55,
    },
    {
      item: 'Talon Knife',
      finish: 'Case Hardened',
      region: 'backside',
      color: 'blue',
      rank: 0,
      seed: 905,
    },
    {
      item: 'Bayonet',
      finish: 'Case Hardened',
      region: 'playside',
      color: 'blue',
      rank: 0,
      seed: 555,
    },
    {
      item: 'Flip Knife',
      finish: 'Case Hardened',
      region: 'playside',
      color: 'blue',
      rank: 0,
      seed: 670,
    },
    {
      item: 'Kukri Knife',
      finish: 'Case Hardened',
      region: 'playside',
      color: 'blue',
      rank: 0,
      seed: 494,
    },
    {
      item: 'Stiletto Knife',
      finish: 'Case Hardened',
      region: 'playside',
      color: 'blue',
      rank: 0,
      seed: 182,
    },
    {
      item: 'Survival Knife',
      finish: 'Case Hardened',
      region: 'playside',
      color: 'blue',
      rank: 0,
      seed: 403,
    },
    {
      item: 'Ursus Knife',
      finish: 'Case Hardened',
      region: 'playside',
      color: 'blue',
      rank: 0,
      seed: 494,
    },
    {
      item: 'Paracord Knife',
      finish: 'Case Hardened',
      region: 'playside',
      color: 'blue',
      rank: 0,
      seed: 403,
    },
    {
      item: 'Huntsman Knife',
      finish: 'Case Hardened',
      region: 'playside',
      color: 'blue',
      rank: 0,
      seed: 618,
    },
    {
      item: 'Bowie Knife',
      finish: 'Case Hardened',
      region: 'playside',
      color: 'blue',
      rank: 0,
      seed: 182,
    },
    {
      item: 'Falchion Knife',
      finish: 'Case Hardened',
      region: 'playside',
      color: 'blue',
      rank: 0,
      seed: 494,
    },
    {
      item: 'Gut Knife',
      finish: 'Case Hardened',
      region: 'playside',
      color: 'blue',
      rank: 0,
      seed: 567,
    },
  ];

  const supportedItems = calculatorTest.getSupportedItems('Case Hardened').concat(calculatorTest.getSupportedItems('Heat Treated'));

  data.forEach((entry) => {
    if (!supportedItems.includes(entry.item)) {
      return;
    }

    const result = calculatorTest.getAllPercentages(entry.finish, entry.item);

    result.percentages.sort((a, b) => b[entry.region]![entry.color] - a[entry.region]![entry.color]);

    expect(result.percentages[entry.rank]!.seed).toBe(entry.seed);
  });
});
