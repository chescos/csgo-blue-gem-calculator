import srgbtransform from './srgb-transform';
import { ColorType } from './color-type'

export abstract class BaseClassifier {
  abstract getColorTypeFromHsv(hue: number, saturation: number, brightness: number): ColorType;

  public getColorType(rUint8: number, gUint8: number, bUint8: number): ColorType {
    let [r, g, b] = [rUint8, gUint8, bUint8];

    // I think converting to linear before calculating hsv is more correct
    const UseLinearColors = true;

    if (UseLinearColors) {
      [r, g, b] = [
        srgbtransform.srgb8BitToLinear(r),
        srgbtransform.srgb8BitToLinear(g),
        srgbtransform.srgb8BitToLinear(b),
      ];
    } else {
      r /= 255;
      g /= 255;
      b /= 255;
    }

    const [h, s, v] = BaseClassifier.rgb2hsv(r, g, b);

    return this.getColorTypeFromHsv(h, s, v);
  }

  static rgb2hsv(r: number, g: number, b: number): [number, number, number] {
    const v = Math.max(r, g, b),
      c = v - Math.min(r, g, b);
    const h =
      c && (v == r ? (g - b) / c : v == g ? 2 + (b - r) / c : 4 + (r - g) / c);
    return [60 * (h < 0 ? h + 6 : h), v && c / v, v];
  }
}
