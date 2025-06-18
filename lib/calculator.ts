import json from './../gen/result.json';
import { PercentageNumbers, ImagePose, ItemName, ItemKey, FinishName, FinishKey, finishes, items } from '../gen/items';

type OptionalPoses = Exclude<ImagePose, 'playside'>;

interface PercentageResult extends Partial<Record<OptionalPoses, PercentageNumbers>> {
  seed: number;
  playside: PercentageNumbers;
}

interface PercentageResults {
  item: ItemName,
  percentages: Array<PercentageResult>
}

type FinishNameMap = { [finishName in FinishName]: FinishKey };
type ItemNameMap = { [itemName in ItemName]: ItemKey };

class BlueGemCalculator {
  private readonly finishNameMap: FinishNameMap;
  private readonly itemNameMap: ItemNameMap;

  constructor() {
    this.finishNameMap = Object.fromEntries(
      Object.entries(finishes).map(([k, v]) => [v, k])
    ) as FinishNameMap;

    this.itemNameMap = Object.fromEntries(
      Object.entries(items).map(([k, v]) => [v.name, k])
    ) as ItemNameMap;
  }

  getList(finishName: FinishName): Array<PercentageResults> {
    const items = this.getSupportedItems(finishName);

    return items.map((itemName) => this.getAllPercentages(finishName, itemName));
  }

  getAllPercentages(finishName: FinishName, itemName: ItemName): PercentageResults {
    return {
      item: itemName,
      percentages: Array.from(
        { length: 1001 },
        (_, seed) => this.getPercentages(finishName, itemName, seed),
      ),
    };
  }

  getPercentages(finishName: FinishName, itemName: ItemName, seed: number): PercentageResult {
    const finishKey = this.finishNameToKey(finishName);
    const itemKey = this.itemNameToKey(itemName);

    const result: Partial<PercentageResult> = {
      seed,
    };

    const index = seed * 4;

    items[itemKey].images.forEach((imagePose) => {
      result[imagePose] = {
        blue: json[itemKey][finishKey][imagePose][index],
        purple: json[itemKey][finishKey][imagePose][index + 1],
        gold: json[itemKey][finishKey][imagePose][index + 2],
        other: json[itemKey][finishKey][imagePose][index + 3],
      };
    });

    return result as PercentageResult;
  }

  getSupportedItems(finishName: FinishName): Array<ItemName> {
    const finishKey = this.finishNameToKey(finishName);

    return Object.values(items)
      .filter((item) => item.types.includes(finishKey))
      .map((item) => item.name);
  }

  private finishNameToKey(finishName: FinishName): FinishKey {
    return this.finishNameMap[finishName];
  }

  private itemNameToKey(itemName: ItemName): ItemKey {
    return this.itemNameMap[itemName];
  }
}

export default BlueGemCalculator;
