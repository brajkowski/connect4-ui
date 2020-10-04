import { BitboardPlayerState } from '../../logic/bitboard-player-state';
import { PositionAlreadyOccupiedError } from '../../logic/position-already-occupied-error';
import { Constants } from '../../util/constants';

describe('bitboard-player-state', () => {
  it('Default constructor provides an empty initialized player state', () => {
    const expected = BigInt(0x0);
    const actual = new BitboardPlayerState().getRawState();
    expect(actual === expected).toBe(true);
  });

  it('State constructor initializes object with the supplied state', () => {
    const expected = BigInt(0x1) << BigInt(5);
    const actual = new BitboardPlayerState(expected).getRawState();
    expect(actual === expected).toBe(true);
  });

  it('Can occupy single valid positions', () => {
    function test(row: number, column: number, expected: bigint) {
      const player = new BitboardPlayerState();
      player.occupyPosition(row, column);
      const actual = player.getRawState();
      expect(actual === expected).toBe(true);
    }
    test(0, 0, BigInt(1));
    test(3, 5, BigInt(1) << BigInt(26));
    test(
      Constants.maxRowIndex,
      Constants.maxColumnIndex,
      BigInt(1) << BigInt(41)
    );
  });

  it('Can occupy multiple valid positions', () => {
    const player = new BitboardPlayerState();
    player.occupyPosition(0, 0);
    player.occupyPosition(0, 1);
    player.occupyPosition(0, 2);
    player.occupyPosition(0, 3);

    const expected = BigInt(0xf);
    const actual = player.getRawState();
    expect(actual === expected).toBe(true);
  });

  it('Throws error when attempting to occupy already occupied position', () => {
    const player = new BitboardPlayerState(BigInt(0x1));
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
    function test(row: number, column: number, state: bigint) {
      const player = new BitboardPlayerState(state);
      expect(player.occupiesPosition(row, column)).toBe(true);
    }
    test(0, 0, BigInt(1));
    test(3, 5, BigInt(1) << BigInt(26));
    test(
      Constants.maxRowIndex,
      Constants.maxColumnIndex,
      BigInt(1) << BigInt(41)
    );
  });

  it('Correctly reports if position is not occupied', () => {
    function test(row: number, column: number, state: bigint) {
      const player = new BitboardPlayerState(state);
      expect(player.occupiesPosition(row, column)).toBe(false);
    }
    test(0, 0, BigInt(1) << BigInt(1));
    test(3, 5, BigInt(1) << BigInt(25));
    test(
      Constants.maxRowIndex,
      Constants.maxColumnIndex,
      BigInt(1) << BigInt(40)
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
