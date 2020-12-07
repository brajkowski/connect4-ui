import { Math } from 'phaser';
import { Logic, Player } from '../../logic/logic';
import { Constants } from '../../util/constants';
import { QueryOptimizer } from '../queries/optimization/query-optimizer';
import {
  preferFewerMoves,
  preferMovesNearCenter,
} from '../queries/optimization/rules';
import { AiStrategy } from './ai-strategy';
import { StrategyRuleBuilder } from './strategy-rule';
import {
  blockOpponentWinningMove,
  blockOpponentWinningMoveSequence,
  makeAttackingMoveSequence,
  makeOptimalOpeningMove,
  makeWinningMove,
} from './strategy-rules';

export class RuleBasedStrategy implements AiStrategy {
  private readonly random = new Math.RandomDataGenerator();
  private readonly optimizer = new QueryOptimizer([
    preferFewerMoves,
    preferMovesNearCenter,
  ]);
  private simulatedThinkingTime?: number;

  constructor(simulatedThinkingTime?: number) {
    this.simulatedThinkingTime = simulatedThinkingTime;
  }

  getOptimalMove(player: Player, logic: Logic): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(
        () => resolve(this._getOptimalMove(player, logic)),
        this.simulatedThinkingTime
      );
    });
  }

  private _getOptimalMove(player: Player, logic: Logic): number {
    const s = new StrategyRuleBuilder(makeWinningMove)
      .orElse(blockOpponentWinningMove)
      .orElse(blockOpponentWinningMoveSequence(1, this.optimizer))
      .orElse(makeOptimalOpeningMove)
      .orElse(makeAttackingMoveSequence(1, this.optimizer))
      .finally(this.randomFallback(logic));
    return s(player, logic);
  }

  private randomFallback(logic: Logic, tryToPrevent?: Set<number>): number {
    const availableColumns: Set<number> = new Set();
    for (let column = 0; column < Constants.columns; column++) {
      if (logic.canPlaceChip(column)) availableColumns.add(column);
    }
    tryToPrevent?.forEach((move) => {
      if (availableColumns.has(move) && availableColumns.size > 1) {
        availableColumns.delete(move);
      }
    });
    return this.random.pick(Array.from(availableColumns));
  }
}
