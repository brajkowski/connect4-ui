import { Constants } from '../util/constants';
import { PlayerState } from './player-state';
import { PositionAlreadyOccupiedError } from './position-already-occupied-error';

export class BitboardPlayerState implements PlayerState {
  private state: number;

  constructor();
  constructor(state: number);
  constructor(state?: number) {
    this.clearAllPositions();
    if (state != null) {
      this.state = state;
    }
  }

  clearAllPositions(): void {
    this.state = 0;
  }

  occupiesPosition(row: number, column: number): boolean {
    const mask = 1 << this.getShift(row, column);
    return this.occupiesPositionByMask(mask);
  }

  occupyPosition(row: number, column: number): void {
    const mask = 1 << this.getShift(row, column);
    if (this.occupiesPositionByMask(mask)) {
      const message = `"Row ${row} column ${column} is already occupied"`;
      throw new PositionAlreadyOccupiedError(message);
    }
    this.state = this.state | mask;
  }

  getRawState(): number {
    return this.state;
  }

  private occupiesPositionByMask(mask: number): boolean {
    return (this.state & mask) != 0;
  }

  private getShift(row: number, column: number): number {
    this.boundsCheck(row, column);
    return Constants.columns * row + column;
  }

  private boundsCheck(row: number, column: number) {
    if (row < 0 || column < 0) {
      const message = `Expected row to be > 0 but was ${row} and column to be > 0 but was ${column}`;
    }
    if (row > Constants.maxRowIndex || column > Constants.maxColumnIndex) {
      const message = `Expected row to be <= ${Constants.maxRowIndex} but was ${row} and column to be <= ${Constants.maxColumnIndex} but was ${column}`;
      throw new RangeError(message);
    }
  }
}
