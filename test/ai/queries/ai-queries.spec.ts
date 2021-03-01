import { BitboardLogic, Player, WinType } from '@brajkowski/connect4-logic';
import {
  canWinOnNextTurn,
  canWinOnNthTurn,
} from '../../../src/ai/queries/ai-queries';
import { QueryOptimizer } from '../../../src/ai/queries/optimization/query-optimizer';
import {
  preferFewerMoves,
  preferMovesNearCenter,
} from '../../../src/ai/queries/optimization/rules';

const logic = new BitboardLogic();
const p1 = Player.One;
const p2 = Player.Two;

describe('ai-queries', () => {
  beforeEach(() => {
    logic.clear();
  });

  it('Should detect when players can win on next move', () => {
    const test = (player: Player, winningMoves: number[]) => {
      const result = canWinOnNextTurn(player, logic);
      expect(result).toEqual({
        result: true,
        moves: winningMoves,
        type: WinType.Vertical,
      });
    };
    logic.placeChip(p1, 0);
    logic.placeChip(p1, 0);
    logic.placeChip(p1, 0);
    logic.placeChip(p2, 2);
    logic.placeChip(p2, 2);
    logic.placeChip(p2, 2);
    test(p1, [0]);
    test(p2, [2]);
  });

  it('Should detect when players cannot win on next move', () => {
    const test = (player: Player) => {
      const result = canWinOnNextTurn(player, logic);
      expect(result).toEqual({ result: false, moves: undefined });
    };
    logic.placeChip(p1, 2);
    logic.placeChip(p2, 2);
    test(p1);
    test(p2);
  });

  it('Can detect a winning move in 4 total moves for a blank game', () => {
    const result = canWinOnNthTurn(p1, logic, 3);
    expect(result.result).toBe(true);
  });

  it('Cannot detect a winning move in 3 total moves on a blank game', () => {
    const result = canWinOnNthTurn(p1, logic, 2);
    expect(result.result).toBe(false);
  });

  it('Returns proper win type when querying for canWinOnNthTurn', () => {
    logic.placeChip(p1, 3);
    logic.placeChip(p1, 3);
    const result = canWinOnNthTurn(p1, logic, 1);
    expect(result).toEqual({
      result: true,
      moves: [3, 3],
      type: WinType.Vertical,
    });
  });

  it('Can chain together a winning sequence of N moves', () => {
    const test = (
      player: Player,
      turns: number,
      moves: number[],
      type: WinType
    ) => {
      const result = canWinOnNthTurn(player, logic, turns);
      expect(result).toEqual({ result: true, moves, type: type });
    };
    test(p1, 3, [0, 0, 0, 0], WinType.Vertical);
    logic.placeChip(p1, 3);
    logic.placeChip(p1, 4);
    test(p1, 1, [1, 2], WinType.Horizontal);
  });

  it('Can be optimized to find smaller winning sequences (n < N) if they exist', () => {
    const optimizer = new QueryOptimizer([preferFewerMoves]);
    logic.placeChip(p1, 3);
    logic.placeChip(p1, 3);
    const result = canWinOnNthTurn(p1, logic, 3, optimizer);
    expect(result).toEqual({
      result: true,
      moves: [3, 3],
      type: WinType.Vertical,
    });
  });

  it('Can be optimized to favor equivalent winning moves nearer to the center first', () => {
    const optimizer = new QueryOptimizer([
      preferFewerMoves,
      preferMovesNearCenter,
    ]);
    logic.placeChip(p1, 3);
    logic.placeChip(p1, 4);
    const result = canWinOnNthTurn(p1, logic, 3, optimizer);
    expect(result).toEqual({
      result: true,
      moves: [2, 1],
      type: WinType.Horizontal,
    });
  });
});
