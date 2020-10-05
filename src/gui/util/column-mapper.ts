export class ColumnMapper {
  static getColumnFromMouseCoordinate(x: number): number {
    if (x <= 125) {
      return 0;
    }
    if (x <= 195) {
      return 1;
    }
    if (x <= 265) {
      return 2;
    }
    if (x <= 335) {
      return 3;
    }
    if (x <= 405) {
      return 4;
    }
    if (x <= 475) {
      return 5;
    }
    return 6;
  }

  static getColumnCenterPixelFromIndex(column: number): number {
    switch (column) {
      case 0:
        return 65;
      case 1:
        return 135;
      case 2:
        return 205;
      case 3:
        return 275;
      case 4:
        return 345;
      case 5:
        return 415;
      case 6:
        return 485;
      default:
        throw new RangeError();
    }
  }
}
