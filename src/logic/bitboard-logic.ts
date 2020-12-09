import bigInt = require('big-integer');
import { Constants } from '../util/constants';
import { BitboardPlayerState } from './bitboard-player-state';
import { FullColumnError } from './full-column-error';
import { Logic, Player, WinType } from './logic';

export class BitboardLogic implements Logic {
  private p1: BitboardPlayerState = new BitboardPlayerState();
  private p2: BitboardPlayerState = new BitboardPlayerState();
  private chipCounts: Map<Player, number>;

  constructor() {
    this.chipCounts = new Map();
    this.chipCounts.set(Player.One, 0);
    this.chipCounts.set(Player.Two, 0);
  }

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
    this.chipCounts.set(player, this.chipCounts.get(player) + 1);
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

  didWinWithType(player: Player): { result: boolean; type?: WinType } {
    const state = this.getPlayerState(player).getRawState();
    if (this.checkVerticalWin(state)) {
      return { result: true, type: WinType.Vertical };
    }
    if (this.checkHorizontalWin(state)) {
      return { result: true, type: WinType.Horizontal };
    }
    if (this.checkDiagonalWin(state)) {
      return { result: true, type: WinType.Diagonal };
    }
    return { result: false };
  }

  boardIsFull(): boolean {
    return this.getGameState().eq(bigInt(0x3ffffffffff));
  }

  boardIsEmpty(): boolean {
    return this.getGameState().eq(bigInt(0x0));
  }

  canPlaceChip(column: number): boolean {
    const state = new BitboardPlayerState(this.getGameState());
    return !state.occupiesPosition(0, column);
  }

  clear(): void {
    this.p1.clearAllPositions();
    this.p2.clearAllPositions();
    this.chipCounts.set(Player.One, 0);
    this.chipCounts.set(Player.Two, 0);
  }

  getGameState(): bigInt.BigInteger {
    return this.p1.getRawState().or(this.p2.getRawState());
  }

  createCopy(): BitboardLogic {
    const copy = new BitboardLogic();
    copy.p1 = new BitboardPlayerState(this.p1.getRawState());
    copy.p2 = new BitboardPlayerState(this.p2.getRawState());
    copy.chipCounts.set(Player.One, this.chipCounts.get(Player.One));
    copy.chipCounts.set(Player.Two, this.chipCounts.get(Player.Two));
    return copy;
  }

  getChipsPlayed(player: Player): number {
    return this.chipCounts.get(player);
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
