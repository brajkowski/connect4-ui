import { Logic, Player, WinType } from '../logic/logic';
import { Constants } from '../util/constants';

export interface AiQueryResult {
  result: boolean;
  moves?: number[];
  type?: WinType;
}

export function canWinOnNextTurn(player: Player, logic: Logic): AiQueryResult {
  for (let column = 0; column < Constants.columns; column++) {
    if (logic.canPlaceChip(column)) {
      const logicCopy = logic.createCopy();
      logicCopy.placeChip(player, column);
      const result = logicCopy.didWinWithType(player);
      if (result.result === true) {
        return { result: true, moves: [column], type: result.type };
      }
    }
  }
  return { result: false };
}

export function canWinOnNthTurn(
  player: Player,
  logic: Logic,
  nthTurn: number,
  moves?: number[],
  optimizer?: AiQueryOptimizer
): AiQueryResult {
  const result = logic.didWinWithType(player);
  if (result.result === true) {
    return { result: true, moves, type: result.type };
  }
  if (!moves) {
    moves = [];
  }
  if (nthTurn === 0) {
    const result = canWinOnNextTurn(player, logic);
    moves = moves.concat(result.moves);
    return { result: result.result, moves, type: result.type };
  }

  const children: { logic: Logic; column: number }[] = [];
  for (let column = 0; column < Constants.columns; column++) {
    if (logic.canPlaceChip(column)) {
      const childLogic = logic.createCopy();
      childLogic.placeChip(player, column);
      children.push({ logic: childLogic, column });
    }
  }
  for (let i = 0; i < children.length; i++) {
    const result = canWinOnNthTurn(
      player,
      children[i].logic,
      nthTurn - 1,
      moves.concat(children[i].column),
      optimizer
    );
    if (result.result === true) {
      if (!optimizer) return result;
      optimizer.test(result);
    }
  }
  const optimalResult = optimizer?.getOptimalResult();
  return optimalResult ? optimalResult : { result: false };
}

export class AiQueryOptimizer {
  private optimalResult: AiQueryResult;
  private rules: AiQueryOptimizerRule[];

  constructor(rules: AiQueryOptimizerRule[]) {
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

export interface AiQueryOptimizerRule {
  (result: AiQueryResult, optimalResult: AiQueryResult): boolean;
}

export class AiQueryOptimizerRules {
  static preferFewerMoves: AiQueryOptimizerRule = (r, o) =>
    r.moves?.length < o.moves?.length;
  static preferMovesNearCenter: AiQueryOptimizerRule = (r, o) =>
    r.moves?.length === o.moves?.length &&
    Math.abs(3 - r.moves?.[0]) < Math.abs(3 - o.moves?.[0]);
}
