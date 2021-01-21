import { Logic, Player } from '@brajkowski/connect4-web-logic';

export interface StrategyRule {
  (player: Player, logic: Logic): number;
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
