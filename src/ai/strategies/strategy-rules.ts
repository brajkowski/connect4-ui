import { Math } from 'phaser';
import { Logic, Player, WinType } from '../../logic/logic';
import { Constants } from '../../util/constants';
import { canWinOnNextTurn, canWinOnNthTurn } from '../queries/ai-queries';
import { QueryOptimizer } from '../queries/optimization/query-optimizer';
import { StrategyRule } from './strategy-rule';

const getOpponent = (player: Player): Player => {
  return player === Player.One ? Player.Two : Player.One;
};

const random = new Math.RandomDataGenerator();

export const makeWinningMove: StrategyRule = (p, l) => {
  const nextMoveWin = canWinOnNextTurn(p, l);
  if (nextMoveWin.result === true) {
    return nextMoveWin.moves[0];
  }
};

export const blockOpponentWinningMove: StrategyRule = (p, l) => {
  const opponent = getOpponent(p);
  const opponentNextMoveWin = canWinOnNextTurn(opponent, l);
  if (opponentNextMoveWin.result === true) {
    return opponentNextMoveWin.moves[0];
  }
};

export const blockOpponentWinningMoveSequence = (
  turns: number,
  optimizer: QueryOptimizer
): StrategyRule => {
  return (p, l) => {
    const opponentWin = canWinOnNthTurn(getOpponent(p), l, turns, optimizer);
    if (opponentWin.result === true) {
      // If the opponent can win with stacking two pieces, ensure the first is not required only for stacking.
      if (
        opponentWin.moves?.[0] === opponentWin.moves?.[1] &&
        opponentWin.type !== WinType.Vertical
      ) {
        return null;
      }
      return opponentWin.moves[0];
    }
  };
};

export const makeOptimalOpeningMove: StrategyRule = (p, l) => {
  if (l.getChipsPlayed(p) === 0) {
    return Constants.middleColumnIndex;
  }
};

export const makeAttackingMoveSequence = (
  turns: number,
  optimizer: QueryOptimizer
): StrategyRule => {
  return (p, l) => {
    const playerWin = canWinOnNthTurn(p, l, turns, optimizer);
    const opponentWin = canWinOnNthTurn(getOpponent(p), l, turns, optimizer);
    if (playerWin.result === true) {
      // If the opponent can win with stacking two pieces, ensure the first is not required only for stacking.
      if (
        opponentWin.result === true &&
        playerWin.moves?.[0] === opponentWin.moves?.[0] &&
        opponentWin.moves?.[0] === opponentWin.moves?.[1] &&
        opponentWin.type !== WinType.Vertical
      ) {
        return null;
      }
      return playerWin.moves[0];
    }
  };
};

export function randomFallback(
  player: Player,
  logic: Logic,
  optimizer?: QueryOptimizer
): number {
  const avoid: Set<number> = new Set();
  const opponentWin = canWinOnNthTurn(getOpponent(player), logic, 1, optimizer);
  // If the opponent can win with stacking two pieces, ensure the first is not required only for stacking.
  if (
    opponentWin.result === true &&
    opponentWin.moves?.[0] === opponentWin.moves?.[1] &&
    opponentWin.type !== WinType.Vertical
  ) {
    avoid.add(opponentWin.moves?.[0]);
  }
  const availableColumns: Set<number> = new Set();
  for (let column = 0; column < Constants.columns; column++) {
    if (logic.canPlaceChip(column)) availableColumns.add(column);
  }
  avoid?.forEach((move) => {
    if (availableColumns.has(move) && availableColumns.size > 1) {
      availableColumns.delete(move);
    }
  });
  return random.pick(Array.from(availableColumns));
}
