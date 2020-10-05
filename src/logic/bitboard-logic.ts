import bigInt = require('big-integer');
import { Constants } from '../util/constants';
import { BitboardPlayerState } from './bitboard-player-state';
import { FullColumnError } from './full-column-error';
import { Logic, Player } from './logic';

export class BitboardLogic implements Logic {
  private p1: BitboardPlayerState = new BitboardPlayerState();
  private p2: BitboardPlayerState = new BitboardPlayerState();

  getPlayerState(player: Player): BitboardPlayerState {
    switch (player) {
      case Player.One:
        return this.p1;
      case Player.Two:
        return this.p2;
    }
  }
  placeChip(player: Player, column: number): number {
    const row = this.findHighestIndexRow(column);
    this.getPlayerState(player).occupyPosition(row, column);
    return row;
  }
  didWin(player: Player): boolean {
    const state = this.getPlayerState(player).getRawState();
    return (
      this.checkVerticalWin(state) ||
      this.checkHorizontalWin(state) ||
      this.checkDiagonalWin(state)
    );
  }
  canPlaceChip(column: number): boolean {
    const state = new BitboardPlayerState(this.getGameState());
    return !state.occupiesPosition(0, column);
  }
  clear(): void {
    this.p1.clearAllPositions();
    this.p2.clearAllPositions();
  }
  getGameState(): bigInt.BigInteger {
    return this.p1.getRawState().or(this.p2.getRawState());
  }
  private findHighestIndexRow(column: number): number {
    const state = new BitboardPlayerState(this.getGameState());
    for (let i = Constants.maxRowIndex; i > 0; i--) {
      if (!state.occupiesPosition(i, column)) return i;
    }
    if (!state.occupiesPosition(0, column)) return 0;
    throw new FullColumnError(`Column ${column} is full`);
  }
  private checkVerticalWin(state: bigInt.BigInteger): boolean {
    const verticalMask = bigInt(0x204081);
    for (let i = 0; i < 21; i++) {
      const shiftedMask = verticalMask.shiftLeft(bigInt(i));
      if (state.and(shiftedMask).eq(shiftedMask)) return true;
    }
    return false;
  }
  private checkHorizontalWin(state: bigInt.BigInteger): boolean {
    const horizontalMask = bigInt(0xf);
    for (let row = 0; row < Constants.rows; row++) {
      for (let column = 0; column < 4; column++) {
        const shift = bigInt(7 * row + column);
        const shiftedMask = horizontalMask.shiftLeft(shift);
        if (state.and(shiftedMask).eq(shiftedMask)) {
          return true;
        }
      }
    }
    return false;
  }
  private checkDiagonalWin(state: bigInt.BigInteger): boolean {
    const diagonalType1Mask = bigInt(0x208208);
    const diagonalType2Mask = bigInt(0x1010101);
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 4; column++) {
        const shift = bigInt(7 * row + column);
        const shiftedType1Mask = diagonalType1Mask.shiftLeft(shift);
        const shiftedType2Mask = diagonalType2Mask.shiftLeft(shift);
        if (state.and(shiftedType1Mask).eq(shiftedType1Mask)) return true;
        if (state.and(shiftedType2Mask).eq(shiftedType2Mask)) return true;
      }
    }
    return false;
  }
}
