import { Math } from 'phaser';
import { Logic, Player } from '../../../logic/logic';
import { QueryOptimizer } from '../../queries/optimization/query-optimizer';
import {
  preferFewerMoves,
  preferMovesNearCenter,
} from '../../queries/optimization/rules';
import { AiStrategy } from '../ai-strategy';
import { StrategyRuleBuilder } from './strategy-rule';
import {
  blockOpponentWinningMove,
  blockOpponentWinningMoveSequence,
  makeAttackingMoveSequence,
  makeOptimalOpeningMove,
  makeWinningMove,
  randomFallback,
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
      .finally(randomFallback(player, logic, this.optimizer));
    return s(player, logic);
  }
}
