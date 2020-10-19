import { Math } from 'phaser';
import { globalScale } from './scale';

export class ChipPositionMapper {
  private static readonly xRef = globalScale(65);
  private static readonly yRef = globalScale(90);
  private static readonly xDelta = globalScale(70);
  private static readonly yDelta = globalScale(65);

  static map(row: number, column: number): Math.Vector2 {
    const x = this.xRef + this.xDelta * column;
    const y = this.yRef + this.yDelta * row;
    return new Math.Vector2(x, y);
  }
}
