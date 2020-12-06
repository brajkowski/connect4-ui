import bigInt = require('big-integer');
import { BitboardLogic } from '../../logic/bitboard-logic';
import { BitboardPlayerState } from '../../logic/bitboard-player-state';
import { FullColumnError } from '../../logic/full-column-error';
import { Player } from '../../logic/logic';
import { Constants } from '../../util/constants';

const logic = new BitboardLogic();
const p1 = Player.One;
const p2 = Player.Two;
const refreshLogic = () => logic.clear();

describe('bitboard-logic', () => {
  beforeEach(() => {
    refreshLogic();
  });

  it('Player affects their own game state', () => {
    function test(player: Player) {
      logic.placeChip(player, 0);
      expect(
        logic.getPlayerState(player).getRawState().greater(bigInt(0))
      ).toBe(true);
      refreshLogic();
    }
    test(p1);
    test(p2);
  });

  it('Player does not affect other player game state', () => {
    function test(p1: Player, p2: Player) {
      logic.placeChip(p1, 0);
      const actual = logic.getPlayerState(p2).getRawState();
      expect(actual.eq(bigInt(0))).toBe(true);
      refreshLogic();
    }
    test(p1, p2);
    test(p2, p1);
  });

  it('Chips stack in a column', () => {
    function test(
      column: number,
      endingRowIndex: number,
      ...players: Player[]
    ) {
      players.forEach((p) => logic.placeChip(p, column));
      const gameState = new BitboardPlayerState(logic.getGameState());
      expect(gameState.occupiesPosition(endingRowIndex, column)).toBe(true);
      refreshLogic();
    }
    test(0, 4, p1, p2);
    test(4, 2, p1, p2, p2, p1);
    test(6, 0, p1, p1, p1, p1, p1, p1);
  });

  it('Can place chip works', () => {
    function test(column: number, stackedChips: number, expected: boolean) {
      for (let i = 0; i < stackedChips; i++) {
        logic.placeChip(p1, column);
      }
      const actual = logic.canPlaceChip(column);
      expect(actual).toBe(expected);
      refreshLogic();
    }
    test(0, 0, true);
    test(0, 6, false);
    test(6, 3, true);
    test(6, 6, false);
  });

  it('Attempting to place chip in full-column throws error', () => {
    for (let i = 0; i < Constants.rows; i++) {
      logic.placeChip(p1, 0);
    }
    expect(() => logic.placeChip(p1, 0)).toThrow(FullColumnError);
  });

  it('Detects vertical win', () => {
    function test(column: number, ...players: Player[]) {
      const playerToWin = players[players.length - 1];
      players.forEach((p) => logic.placeChip(p, column));
      expect(logic.didWin(playerToWin)).toBe(true);
      refreshLogic();
    }
    test(0, p2, p2, p1, p1, p1, p1);
    test(0, p1, p1, p1, p1);
    test(6, p1, p1, p1, p1);
    test(3, p2, p2, p2, p2);
  });

  it('Detects horizontal win', () => {
    logic.placeChip(p1, 0);
    logic.placeChip(p1, 1);
    logic.placeChip(p1, 2);
    logic.placeChip(p1, 3);
    expect(logic.didWin(p1)).toBe(true);
  });

  it('Detects diagonal win (type 1)', () => {
    logic.placeChip(p1, 0);

    logic.placeChip(p2, 1);
    logic.placeChip(p1, 1);

    logic.placeChip(p2, 2);
    logic.placeChip(p2, 2);
    logic.placeChip(p1, 2);

    logic.placeChip(p2, 3);
    logic.placeChip(p2, 3);
    logic.placeChip(p2, 3);
    logic.placeChip(p1, 3);

    expect(logic.didWin(p1)).toBe(true);
    expect(logic.didWin(p2)).toBe(false);
  });

  it('Detects diagonal win (type 2)', () => {
    logic.placeChip(p2, 3);

    logic.placeChip(p1, 2);
    logic.placeChip(p2, 2);

    logic.placeChip(p1, 1);
    logic.placeChip(p1, 1);
    logic.placeChip(p2, 1);

    logic.placeChip(p1, 0);
    logic.placeChip(p1, 0);
    logic.placeChip(p1, 0);
    logic.placeChip(p2, 0);

    expect(logic.didWin(p2)).toBe(true);
    expect(logic.didWin(p1)).toBe(false);
  });

  it('Detects when the board is full', () => {
    for (let i = 0; i < Constants.columns; i++) {
      for (let j = 0; j < Constants.rows; j++) {
        logic.placeChip(p1, i);
      }
    }
    expect(logic.boardIsFull()).toBe(true);
  });

  it('Detects when the board is not full', () => {
    logic.placeChip(p1, 0);
    expect(logic.boardIsFull()).toBe(false);
  });

  it('Detects when the board is empty', () => {
    expect(logic.boardIsEmpty()).toBe(true);
  });

  it('Detects when the board is not empty', () => {
    logic.placeChip(p1, 0);
    expect(logic.boardIsEmpty()).toBe(false);
  });

  it('Can provide a copy of itself', () => {
    logic.placeChip(p1, 0);
    logic.placeChip(p2, 1);
    const originalP1State = logic.getPlayerState(p1).getRawState();
    const originalP2State = logic.getPlayerState(p2).getRawState();
    const logicCopy = logic.createCopy();
    const copiedP1State = logicCopy.getPlayerState(p1).getRawState();
    const copiedP2State = logicCopy.getPlayerState(p2).getRawState();
    expect(copiedP1State).toEqual(originalP1State);
    expect(copiedP2State).toEqual(originalP2State);
  });

  it('Is not impacted by changes to child copies', () => {
    logic.placeChip(p1, 0);
    logic.placeChip(p2, 1);
    const originalState = logic.getGameState();
    const logicCopy = logic.createCopy();
    logicCopy.placeChip(p1, 1);
    const copiedState = logicCopy.getGameState();
    expect(originalState.compareTo(copiedState)).not.toEqual(0);
  });

  it('Returns the number of chips played by Player 1', () => {
    const expected = 2;
    logic.placeChip(p1, 0);
    logic.placeChip(p1, 1);
    logic.placeChip(p2, 0);
    expect(logic.getChipsPlayed(p1)).toEqual(expected);
  });

  it('Returns the number of chips played by Player 2', () => {
    const expected = 1;
    logic.placeChip(p1, 0);
    logic.placeChip(p1, 1);
    logic.placeChip(p2, 0);
    expect(logic.getChipsPlayed(p2)).toEqual(expected);
  });

  it('Resets chip counts after clearing game state', () => {
    const expected = 0;
    logic.placeChip(p1, 0);
    logic.placeChip(p2, 0);
    logic.clear();
    expect(logic.getChipsPlayed(p1)).toEqual(expected);
    expect(logic.getChipsPlayed(p2)).toEqual(expected);
  });

  it('Copies the chip counts to it child copies', () => {
    const expected = 1;
    logic.placeChip(p1, 0);
    logic.placeChip(p2, 1);
    const copiedLogic = logic.createCopy();
    expect(copiedLogic.getChipsPlayed(p1)).toEqual(expected);
    expect(copiedLogic.getChipsPlayed(p2)).toEqual(expected);
  });
});
