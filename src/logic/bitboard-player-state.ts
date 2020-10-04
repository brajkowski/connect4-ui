import { Constants } from '../util/constants';
import { PlayerState } from './player-state';
import { PositionAlreadyOccupiedError } from './position-already-occupied-error';

export class BitboardPlayerState implements PlayerState {
  private state: bigint;

  constructor();
  constructor(state: bigint);
  constructor(state?: bigint) {
    this.clearAllPositions();
    if (state != null) {
      this.state = state;
    }
  }

  clearAllPositions(): void {
    this.state = BigInt(0x0);
  }

  occupiesPosition(row: number, column: number): boolean {
    const mask = BigInt(0x1) << this.getShift(row, column);
    return this.occupiesPositionByMask(mask);
  }

  occupyPosition(row: number, column: number): void {
    const mask = BigInt(0x1) << this.getShift(row, column);
    if (this.occupiesPositionByMask(mask)) {
      const message = `"Row ${row} column ${column} is already occupied"`;
      throw new PositionAlreadyOccupiedError(message);
    }
    this.state = this.state | mask;
  }

  getRawState(): bigint {
    return this.state;
  }

  private occupiesPositionByMask(mask: bigint): boolean {
    return (this.state & mask) != BigInt(0x0);
  }

  private getShift(row: number, column: number): bigint {
    this.boundsCheck(row, column);
    return BigInt(Constants.columns * row + column);
  }

  private boundsCheck(row: number, column: number) {
    if (row < 0 || column < 0) {
      const message = `Expected row to be > 0 but was ${row} and column to be > 0 but was ${column}`;
      throw new RangeError(message);
    }
    if (row > Constants.maxRowIndex || column > Constants.maxColumnIndex) {
      const message = `Expected row to be <= ${Constants.maxRowIndex} but was ${row} and column to be <= ${Constants.maxColumnIndex} but was ${column}`;
      throw new RangeError(message);
    }
  }
}
