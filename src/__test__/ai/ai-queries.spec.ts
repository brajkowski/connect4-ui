import { canWinOnNextTurn } from '../../ai/ai-queries';
import { BitboardLogic } from '../../logic/bitboard-logic';
import { Player } from '../../logic/logic';

const logic = new BitboardLogic();
const p1 = Player.One;
const p2 = Player.Two;

describe('ai-queries', () => {
  beforeEach(() => {
    logic.clear();
  });

  it('Should detect when players can win on next move', () => {
    const test = (player: Player, winningMove: number) => {
      const result = canWinOnNextTurn(player, logic);
      expect(result).toEqual({ result: true, move: winningMove });
    };
    logic.placeChip(p1, 0);
    logic.placeChip(p1, 0);
    logic.placeChip(p1, 0);
    logic.placeChip(p2, 2);
    logic.placeChip(p2, 2);
    logic.placeChip(p2, 2);
    test(p1, 0);
    test(p2, 2);
  });

  it('Should detect when players cannot win on next move', () => {
    const test = (player: Player) => {
      const result = canWinOnNextTurn(player, logic);
      expect(result).toEqual({ result: false, move: undefined });
    };
    logic.placeChip(p1, 2);
    logic.placeChip(p2, 2);
    test(p1);
    test(p2);
  });
});
