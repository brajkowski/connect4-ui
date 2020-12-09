import { Math } from 'phaser';
import { QueryOptimizer } from '../../queries/optimization/query-optimizer';
import {
  preferFewerMoves,
  preferMovesNearCenter,
} from '../../queries/optimization/rules';
import { StrategyRule, StrategyRuleBuilder } from './strategy-rule';
import {
  blockOpponentWinningMove,
  blockOpponentWinningMoveSequence,
  makeAttackingMoveSequence,
  makeOptimalOpeningMove,
  makeWinningMove,
  randomFallback,
} from './strategy-rules';

const optimizer: QueryOptimizer = new QueryOptimizer([
  preferFewerMoves,
  preferMovesNearCenter,
]);

const random = new Math.RandomDataGenerator();

const noop: StrategyRule = () => null;

export const easy: StrategyRule = (p, l) =>
  new StrategyRuleBuilder(random.weightedPick([makeWinningMove, noop]))
    .orElse(random.weightedPick([blockOpponentWinningMove, noop]))
    .orElse(random.weightedPick([makeOptimalOpeningMove, noop]))
    .finally(randomFallback(p, l, optimizer))(p, l);

export const medium: StrategyRule = (p, l) =>
  new StrategyRuleBuilder(makeWinningMove)
    .orElse(blockOpponentWinningMove)
    .orElse(blockOpponentWinningMoveSequence(1, optimizer))
    .orElse(makeOptimalOpeningMove)
    .finally(randomFallback(p, l, optimizer))(p, l);

export const hard: StrategyRule = (p, l) =>
  new StrategyRuleBuilder(makeWinningMove)
    .orElse(blockOpponentWinningMove)
    .orElse(blockOpponentWinningMoveSequence(1, optimizer))
    .orElse(makeOptimalOpeningMove)
    .orElse(makeAttackingMoveSequence(1, optimizer))
    .finally(randomFallback(p, l, optimizer))(p, l);
