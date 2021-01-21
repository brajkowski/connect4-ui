import { Logic, Player } from '@brajkowski/connect4-web-logic';
import { AiStrategy } from '../ai-strategy';
import { StrategyRule } from './strategy-rule';

export class RuleBasedStrategy implements AiStrategy {
  constructor(
    private rule: StrategyRule,
    private simulatedThinkingTime?: number
  ) {}

  getOptimalMove(player: Player, logic: Logic): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(
        () => resolve(this.rule(player, logic)),
        this.simulatedThinkingTime
      );
    });
  }
}
