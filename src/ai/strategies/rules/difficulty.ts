import { Logic, Player } from '../../../logic/logic';
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

const hardOptimization: QueryOptimizer = new QueryOptimizer([
  preferFewerMoves,
  preferMovesNearCenter,
]);

export const hard: StrategyRule = (p: Player, l: Logic) =>
  new StrategyRuleBuilder(makeWinningMove)
    .orElse(blockOpponentWinningMove)
    .orElse(blockOpponentWinningMoveSequence(1, hardOptimization))
    .orElse(makeOptimalOpeningMove)
    .orElse(makeAttackingMoveSequence(1, hardOptimization))
    .finally(randomFallback(p, l, hardOptimization))(p, l);
