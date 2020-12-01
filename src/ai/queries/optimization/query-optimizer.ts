import { AiQueryResult } from '../ai-queries';

export interface QueryOptimizerRule {
  (result: AiQueryResult, optimalResult: AiQueryResult): boolean;
}

export class QueryOptimizer {
  private optimalResult: AiQueryResult;
  private rules: QueryOptimizerRule[];

  constructor(rules: QueryOptimizerRule[]) {
    this.rules = rules;
  }

  test(result: AiQueryResult) {
    if (!this.optimalResult) {
      this.optimalResult = result;
      return;
    }
    for (let i = 0; i < this.rules.length; i++) {
      if (this.rules[i](result, this.optimalResult)) {
        this.optimalResult = result;
        return;
      }
    }
  }

  getOptimalResult(): AiQueryResult {
    const result = this.optimalResult;
    this.optimalResult = null;
    return result;
  }
}
