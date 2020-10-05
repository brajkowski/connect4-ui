import { Math } from 'phaser';

export class ChipPositionMapper {
  private static readonly xRef = 65;
  private static readonly yRef = 90;
  private static readonly xDelta = 70;
  private static readonly yDelta = 65;

  static map(row: number, column: number): Math.Vector2 {
    const x = this.xRef + this.xDelta * column;
    const y = this.yRef + this.yDelta * row;
    return new Math.Vector2(x, y);
  }
}
