import {
  AiQueryOptimizer,
  AiQueryOptimizerRules,
  canWinOnNextTurn,
  canWinOnNthTurn,
} from '../../ai/ai-queries';
import { BitboardLogic } from '../../logic/bitboard-logic';
import { Player, WinType } from '../../logic/logic';

const logic = new BitboardLogic();
const p1 = Player.One;
const p2 = Player.Two;
const optimizer = new AiQueryOptimizer([
  AiQueryOptimizerRules.preferFewerMoves,
  AiQueryOptimizerRules.preferMovesNearCenter,
]);

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
    const result = canWinOnNthTurn(p1, logic, 3, null, optimizer);
    expect(result.result).toBe(true);
  });

  it('Cannot detect a winning move in 3 total moves on a blank game', () => {
    const result = canWinOnNthTurn(p1, logic, 2, null, optimizer);
    console.log(result);
    expect(result.result).toBe(false);
  });

  it('Can chain together a winning sequence of N moves', () => {
    const test = (player: Player, turns: number, moves: number[]) => {
      const result = canWinOnNthTurn(player, logic, turns, null, optimizer);
      expect(result).toEqual({ result: true, moves, type: WinType.Horizontal });
    };
    test(p1, 3, [3, 0, 1, 2]);
    logic.placeChip(p1, 3);
    logic.placeChip(p1, 4);
    test(p1, 1, [2, 1]);
  });

  it('Detects smaller winning sequences (n < N) if they exist', () => {
    logic.placeChip(p1, 3);
    logic.placeChip(p1, 3);
    const result = canWinOnNthTurn(p1, logic, 3, null, optimizer);
    expect(result).toEqual({
      result: true,
      moves: [3, 3],
      type: WinType.Vertical,
    });
  });

  it('Prefers to play equivalent winning moves nearer to the center first', () => {
    logic.placeChip(p1, 3);
    logic.placeChip(p1, 4);
    const result = canWinOnNthTurn(p1, logic, 3, null, optimizer);
    expect(result).toEqual({
      result: true,
      moves: [2, 1],
      type: WinType.Horizontal,
    });
  });

  it('Returns proper win type when querying for canWinOnNthTurn', () => {
    logic.placeChip(p1, 3);
    logic.placeChip(p1, 3);
    const result = canWinOnNthTurn(p1, logic, 1, null, optimizer);
    expect(result).toEqual({
      result: true,
      moves: [3, 3],
      type: WinType.Vertical,
    });
  });
});
