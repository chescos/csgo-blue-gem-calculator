import { BaseClassifier } from "./classifier-base"
import { ColorType } from "./color-type";

const [GoldStart, GoldEnd] = [0, 50]; // todo: also 340 to 0 ?
const [BlueStart, BlueEnd] = [200, 250];
const [PurpleStart, PurpleEnd] = [250, 320];

export class HeatTreatedClassifier extends BaseClassifier {

  static isBlue(hue: number, saturation: number, brightness: number): boolean {
    if (hue < BlueStart || hue >= BlueEnd) return false;
    if (saturation < 0.3 || saturation >= 1.0) return false;
    if (brightness < 0.1 || brightness >= 1.0) return false;

    return true;
  }

  static isPurple(hue: number, saturation: number, brightness: number): boolean {
    if (hue < PurpleStart || hue >= PurpleEnd) return false;
    if (saturation < 0.2 || saturation >= 1.0) return false;
    if (brightness < 0.05 || brightness >= 1.0) return false;

    return true;
  }

  static isGold(hue: number, saturation: number, brightness: number): boolean {
    if (hue < GoldStart || hue >= GoldEnd) return false;
    if (saturation < 0.1 || saturation >= 1.0) return false;
    if (brightness < 0.1 || brightness >= 1.0) return false;

    return true;
  }

  override getColorTypeFromHsv(hue: number, saturation: number, brightness: number): ColorType {

    if (HeatTreatedClassifier.isBlue(hue, saturation, brightness)) {
      return ColorType.Blue;
    } else if (HeatTreatedClassifier.isPurple(hue, saturation, brightness)) {
      return ColorType.Purple;
    } else if (HeatTreatedClassifier.isGold(hue, saturation, brightness)) {
      return ColorType.Gold;
    }

    return ColorType.GrayOrUndetermined;
  }
}
