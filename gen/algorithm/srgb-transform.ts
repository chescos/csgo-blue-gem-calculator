/*
 * sRGB transform (TypeScript)
 *
 * Copyright (c) 2022 Project Nayuki. (MIT License)
 * https://www.nayuki.io/page/srgb-transform-library
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * - The above copyright notice and this permission notice shall be included in
 *   all copies or substantial portions of the Software.
 * - The Software is provided "as is", without warranty of any kind, express or
 *   implied, including but not limited to the warranties of merchantability,
 *   fitness for a particular purpose and noninfringement. In no event shall the
 *   authors or copyright holders be liable for any claim, damages or other
 *   liability, whether in an action of contract, tort or otherwise, arising from,
 *   out of or in connection with the Software or the use or other dealings in the
 *   Software.
 */

class SRGBTransform {
  private static readonly SRGB_8BIT_TO_LINEAR: number[] = SRGBTransform.initTable();

  private static initTable(): number[] {
    const table: number[] = [];
    for (let i = 0; i < 256; i++) {
      table.push(SRGBTransform.srgbToLinear(i / 255.0));
    }
    return table;
  }

  static srgbToLinear(x: number): number {
    if (x <= 0) return 0;
    else if (x >= 1) return 1;
    else if (x < 0.04045) return x / 12.92;
    else return Math.pow((x + 0.055) / 1.055, 2.4);
  }

  static srgb8BitToLinear(x: number): number {
    if ((x | 0) != x || x >>> 8 != 0) throw new RangeError('Value out of 8-bit range');
    return SRGBTransform.SRGB_8BIT_TO_LINEAR[x]!;
  }

  static linearToSrgb(x: number): number {
    if (x <= 0) return 0;
    else if (x >= 1) return 1;
    else if (x < 0.0031308) return x * 12.92;
    else return Math.pow(x, 1 / 2.4) * 1.055 - 0.055;
  }

  static linearToSrgb8Bit(x: number): number {
    if (x <= 0) return 0;
    const TABLE: Array<number> = SRGBTransform.SRGB_8BIT_TO_LINEAR;
    if (x >= 1) return TABLE.length - 1;
    let y: number = 0;
    for (let i = TABLE.length >>> 1; i != 0; i >>>= 1) {
      if (TABLE[y | i]! <= x) y |= i;
    }
    if (x - TABLE[y]! <= TABLE[y + 1]! - x) return y;
    else return y + 1;
  }
}

export default SRGBTransform;
