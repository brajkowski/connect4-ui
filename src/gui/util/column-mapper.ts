import { globalScale } from './scale';

export class ColumnMapper {
  static getColumnFromMouseCoordinate(x: number): number {
    if (x <= globalScale(125)) {
      return 0;
    }
    if (x <= globalScale(195)) {
      return 1;
    }
    if (x <= globalScale(265)) {
      return 2;
    }
    if (x <= globalScale(335)) {
      return 3;
    }
    if (x <= globalScale(405)) {
      return 4;
    }
    if (x <= globalScale(475)) {
      return 5;
    }
    return 6;
  }

  static getColumnCenterPixelFromIndex(column: number): number {
    switch (column) {
      case 0:
        return globalScale(65);
      case 1:
        return globalScale(135);
      case 2:
        return globalScale(205);
      case 3:
        return globalScale(275);
      case 4:
        return globalScale(345);
      case 5:
        return globalScale(415);
      case 6:
        return globalScale(485);
      default:
        throw new RangeError();
    }
  }
}
