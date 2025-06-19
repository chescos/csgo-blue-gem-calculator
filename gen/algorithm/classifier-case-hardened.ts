import { BaseClassifier } from './classifier-base';
import { ColorType } from './color-type';

export class CaseHardenedClassifier extends BaseClassifier {
  static isBlue(hue: number, saturation: number, brightness: number): boolean {
    if (hue < 180 || hue >= 270) return false;
    if (saturation < 0.3 || saturation >= 1.0) return false;
    if (brightness < 0.1 || brightness >= 1.0) return false;

    return true;
  }

  static isPurple(hue: number, saturation: number, brightness: number): boolean {
    if ((hue < 270 || hue >= 360) && (hue < 0 || hue >= 18)) return false;
    if (saturation < 0.2 || saturation >= 1.0) return false;
    if (brightness < 0.1 || brightness >= 1.0) return false;

    return true;
  }

  static isGold(hue: number, saturation: number, brightness: number): boolean {
    if (saturation < 0.2 && brightness > 0.5) return true;
    if (hue < 18 || hue >= 72) return false;
    if (saturation < 0.0 || saturation >= 1.0) return false;
    if (brightness < 0.3 || brightness >= 1.0) return false;

    return true;
  }

  override getColorTypeFromHsv(hue: number, saturation: number, brightness: number): ColorType {
    if (CaseHardenedClassifier.isBlue(hue, saturation, brightness)) {
      return ColorType.Blue;
    } else if (CaseHardenedClassifier.isPurple(hue, saturation, brightness)) {
      return ColorType.Purple;
    } else if (CaseHardenedClassifier.isGold(hue, saturation, brightness)) {
      return ColorType.Gold;
    }

    return ColorType.GrayOrUndetermined;
  }
}
