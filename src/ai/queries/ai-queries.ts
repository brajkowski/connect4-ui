import { Logic, Player, WinType } from '../../logic/logic';
import { Constants } from '../../util/constants';
import { QueryOptimizer } from './optimization/query-optimizer';

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
  optimizer?: QueryOptimizer
): AiQueryResult {
  return _canWinOnNthTurn(player, logic, nthTurn, [], optimizer);
}

function _canWinOnNthTurn(
  player: Player,
  logic: Logic,
  nthTurn: number,
  moves: number[],
  optimizer?: QueryOptimizer
): AiQueryResult {
  const result = logic.didWinWithType(player);
  if (result.result === true) {
    return { result: true, moves, type: result.type };
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
    const result = _canWinOnNthTurn(
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
