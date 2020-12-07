import { Logic, Player } from '../../../logic/logic';
import { QueryOptimizer } from '../../queries/optimization/query-optimizer';

export interface StrategyRule {
  (player: Player, logic: Logic, optimizer?: QueryOptimizer): number;
}

export class StrategyRuleBuilder {
  private rule: StrategyRule;

  constructor(rule: StrategyRule) {
    this.rule = rule;
  }

  orElse(rule: StrategyRule): StrategyRuleBuilder {
    const last = this.rule;
    this.rule = (p, l) => {
      const result = last(p, l);
      if (result == null) {
        return rule(p, l);
      }
      return result;
    };
    return this;
  }

  finally(fallback: number): StrategyRule {
    return (p, l) => {
      const result = this.rule(p, l);
      if (result == null) {
        return fallback;
      }
      return result;
    };
  }
}