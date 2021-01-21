import {
  Constants,
  Logic,
  Player,
  WinType,
} from '@brajkowski/connect4-web-logic';
import { QueryOptimizer } from './optimization/query-optimizer';

export interface AiQueryResult {
  result: boolean;
  moves?: number[];
  type?: WinType;
}

export function canWinOnNextTurn(player: Player, logic: Logic): AiQueryResult {
  let result: AiQueryResult = { result: false };
  doWithValidMoves(player, logic, (action) => {
    let winResult = action.updatedLogic.didWinWithType(player);
    if (winResult.result === true) {
      result = {
        result: true,
        moves: [action.columnPlayed],
        type: winResult.type,
      };
    }
  });
  return result;
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

  const children: Action[] = [];
  doWithValidMoves(player, logic, (a) => children.push(a));
  for (let i = 0; i < children.length; i++) {
    const result = _canWinOnNthTurn(
      player,
      children[i].updatedLogic,
      nthTurn - 1,
      moves.concat(children[i].columnPlayed),
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

interface Action {
  updatedLogic: Logic;
  columnPlayed: number;
}

function doWithValidMoves(
  player: Player,
  logic: Logic,
  action: (a: Action) => void
): void {
  for (let columnPlayed = 0; columnPlayed < Constants.columns; columnPlayed++) {
    if (logic.canPlaceChip(columnPlayed)) {
      const updatedLogic = logic.createCopy();
      updatedLogic.placeChip(player, columnPlayed);
      action({ updatedLogic, columnPlayed });
    }
  }
}
