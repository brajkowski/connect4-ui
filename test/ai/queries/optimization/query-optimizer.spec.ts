import { AiQueryResult } from '../../../../src/ai/queries/ai-queries';
import {
  QueryOptimizer,
  QueryOptimizerRule,
} from '../../../../src/ai/queries/optimization/query-optimizer';

const trueRule: QueryOptimizerRule = (r, o) => true;
const falseRule: QueryOptimizerRule = (r, o) => false;
const result1: AiQueryResult = {
  result: false,
};
const result2: AiQueryResult = {
  result: true,
  moves: [0],
};

describe('query-optimizer', () => {
  it('Should set the optimal result if one is not already present', () => {
    const optimizer = new QueryOptimizer([falseRule]);
    optimizer.test(result1);
    expect(optimizer.getOptimalResult()).toEqual(result1);
  });

  it('Should not set the optimal result if the rule fails', () => {
    const optimizer = new QueryOptimizer([falseRule]);
    optimizer.test(result1);
    optimizer.test(result2);
    expect(optimizer.getOptimalResult()).toEqual(result1);
  });

  it('Should set the optimal result if the rule succeeds', () => {
    const optimizer = new QueryOptimizer([trueRule]);
    optimizer.test(result1);
    optimizer.test(result2);
    expect(optimizer.getOptimalResult()).toEqual(result2);
  });

  it('Should clear the optimal result after caller fetches the optimal result', () => {
    const optimizer = new QueryOptimizer([falseRule, trueRule]);
    optimizer.test(result1);
    optimizer.test(result2);
    optimizer.getOptimalResult();
    expect(optimizer.getOptimalResult()).toBeNull();
  });
});
