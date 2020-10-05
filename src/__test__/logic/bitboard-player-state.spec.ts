import bigInt = require('big-integer');
import { BitboardPlayerState } from '../../logic/bitboard-player-state';
import { PositionAlreadyOccupiedError } from '../../logic/position-already-occupied-error';
import { Constants } from '../../util/constants';

describe('bitboard-player-state', () => {
  it('Default constructor provides an empty initialized player state', () => {
    const expected = bigInt(0x0);
    const actual = new BitboardPlayerState().getRawState();
    expect(actual.eq(expected)).toBe(true);
  });

  it('State constructor initializes object with the supplied state', () => {
    const expected = bigInt(0x1).shiftLeft(bigInt(5));
    const actual = new BitboardPlayerState(expected).getRawState();
    expect(actual === expected).toBe(true);
  });

  it('Can occupy single valid positions', () => {
    function test(row: number, column: number, expected: bigInt.BigInteger) {
      const player = new BitboardPlayerState();
      player.occupyPosition(row, column);
      const actual = player.getRawState();
      expect(actual.eq(expected)).toBe(true);
    }
    test(0, 0, bigInt(1));
    test(3, 5, bigInt(1).shiftLeft(bigInt(26)));
    test(
      Constants.maxRowIndex,
      Constants.maxColumnIndex,
      bigInt(1).shiftLeft(bigInt(41))
    );
  });

  it('Can occupy multiple valid positions', () => {
    const player = new BitboardPlayerState();
    player.occupyPosition(0, 0);
    player.occupyPosition(0, 1);
    player.occupyPosition(0, 2);
    player.occupyPosition(0, 3);

    const expected = bigInt(0xf);
    const actual = player.getRawState();
    expect(actual.eq(expected)).toBe(true);
  });

  it('Throws error when attempting to occupy already occupied position', () => {
    const player = new BitboardPlayerState(bigInt(0x1));
    expect(() => player.occupyPosition(0, 0)).toThrow(
      PositionAlreadyOccupiedError
    );
  });

  it('Throws error when attempting to occupy out of bounds position', () => {
    function test(row: number, column: number) {
      const player = new BitboardPlayerState();
      expect(() => player.occupyPosition(row, column)).toThrow(RangeError);
    }
    test(Number.MAX_VALUE, 0);
    test(0, Number.MAX_VALUE);
    test(Constants.maxRowIndex + 1, Constants.maxColumnIndex);
    test(Constants.maxRowIndex, Constants.maxColumnIndex + 1);
    test(-1, 0);
    test(0, -1);
  });

  it('Correctly reports if position is occupied', () => {
    function test(row: number, column: number, state: bigInt.BigInteger) {
      const player = new BitboardPlayerState(state);
      expect(player.occupiesPosition(row, column)).toBe(true);
    }
    test(0, 0, bigInt(1));
    test(3, 5, bigInt(1).shiftLeft(bigInt(26)));
    test(
      Constants.maxRowIndex,
      Constants.maxColumnIndex,
      bigInt(1).shiftLeft(bigInt(41))
    );
  });

  it('Correctly reports if position is not occupied', () => {
    function test(row: number, column: number, state: bigInt.BigInteger) {
      const player = new BitboardPlayerState(state);
      expect(player.occupiesPosition(row, column)).toBe(false);
    }
    test(0, 0, bigInt(1).shiftLeft(bigInt(1)));
    test(3, 5, bigInt(1).shiftLeft(bigInt(25)));
    test(
      Constants.maxRowIndex,
      Constants.maxColumnIndex,
      bigInt(1).shiftLeft(bigInt(40))
    );
  });

  it('Throws error when attempting to check out of bounds position', () => {
    function test(row: number, column: number) {
      const player = new BitboardPlayerState();
      expect(() => player.occupiesPosition(row, column)).toThrow(RangeError);
    }
    test(Number.MAX_VALUE, 0);
    test(0, Number.MAX_VALUE);
    test(Constants.maxRowIndex + 1, Constants.maxColumnIndex);
    test(Constants.maxRowIndex, Constants.maxColumnIndex + 1);
  });
});
