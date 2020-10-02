import { BitboardPlayerState } from '../../logic/bitboard-player-state';
import { Constants } from '../../util/constants';

describe('player-state', () => {
  it('Default constructor provides an empty initialized player state', () => {
    const expected = 0x0;
    const actual = new BitboardPlayerState().getRawState();
    expect(actual).toBe(expected);
  });

  it('State constructor initializes object with the supplied state', () => {
    const expected = 0x1 << 5;
    const actual = new BitboardPlayerState(expected).getRawState();
    expect(actual).toBe(expected);
  });

  it('Can occupy single valid positions', () => {
    function test(row: number, column: number, expected: number) {
      const player = new BitboardPlayerState();
      player.occupyPosition(row, column);
      const actual = player.getRawState();
      expect(actual).toBe(expected);
    }
    test(0, 0, 1);
    test(3, 5, 1 << 26);
    test(Constants.maxRowIndex, Constants.maxColumnIndex, 1 << 41);
  });

  it('Can occupy multiple valid positions', () => {
    const player = new BitboardPlayerState();
    player.occupyPosition(0, 0);
    player.occupyPosition(0, 1);
    player.occupyPosition(0, 2);
    player.occupyPosition(0, 3);

    const expected = 0xf;
    const actual = player.getRawState();
    expect(actual).toBe(expected);
  });

  it('Throws error when attempting to occupy already occupied position', () => {
    const player = new BitboardPlayerState(0x1);
    expect(() => player.occupyPosition(0, 0)).toThrowError();
  });

  it('Throws error when attempting to occupy out of bounds position', () => {
    function test(row: number, column: number) {
      const player = new BitboardPlayerState();
      expect(() => player.occupyPosition(row, column)).toThrowError();
    }
    test(Number.MAX_VALUE, 0);
    test(0, Number.MAX_VALUE);
    test(Constants.maxRowIndex + 1, Constants.maxColumnIndex);
    test(Constants.maxRowIndex, Constants.maxColumnIndex + 1);
  });

  it('Correctly reports if position is occupied', () => {
    function test(row: number, column: number, state: number) {
      const player = new BitboardPlayerState(state);
      expect(player.occupiesPosition(row, column)).toBe(true);
    }
    test(0, 0, 1);
    test(3, 5, 1 << 26);
    test(Constants.maxRowIndex, Constants.maxColumnIndex, 1 << 41);
  });

  it('Correctly reports if position is not occupied', () => {
    function test(row: number, column: number, state: number) {
      const player = new BitboardPlayerState(state);
      expect(player.occupiesPosition(row, column)).toBe(false);
    }
    test(0, 0, 1 << 1);
    test(3, 5, 1 << 25);
    test(Constants.maxRowIndex, Constants.maxColumnIndex, 1 << 40);
  });

  it('Throws error when attempting to check out of bounds position', () => {
    function test(row: number, column: number) {
      const player = new BitboardPlayerState();
      expect(() => player.occupiesPosition(row, column)).toThrowError();
    }
    test(Number.MAX_VALUE, 0);
    test(0, Number.MAX_VALUE);
    test(Constants.maxRowIndex + 1, Constants.maxColumnIndex);
    test(Constants.maxRowIndex, Constants.maxColumnIndex + 1);
  });
});
