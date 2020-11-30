import { Logic, Player } from '../logic/logic';
import { Constants } from '../util/constants';

export interface AiQueryResult {
  result: boolean;
  moves?: number[];
}
export function canWinOnNextTurn(player: Player, logic: Logic): AiQueryResult {
  for (let column = 0; column < Constants.columns; column++) {
    if (logic.canPlaceChip(column)) {
      const logicCopy = logic.createCopy();
      logicCopy.placeChip(player, column);
      if (logicCopy.didWin(player)) {
        return { result: true, moves: [column] };
      }
    }
  }
  return { result: false };
}

export function canWinOnNthTurn(
  player: Player,
  logic: Logic,
  nthTurn: number,
  moves?: number[]
): AiQueryResult {
  if (logic.didWin(player)) {
    return { result: true, moves };
  }
  if (!moves) {
    moves = [];
  }
  if (nthTurn === 0) {
    const result = canWinOnNextTurn(player, logic);
    moves = moves.concat(result.moves);
    return { result: result.result, moves };
  }

  const children: { logic: Logic; column: number }[] = [];
  let optimalResult: AiQueryResult;
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
      moves.concat(children[i].column)
    );
    // Optimizers.
    if (result.result === true) {
      if (!optimalResult) {
        optimalResult = result;
      } else if (result.moves?.length < optimalResult.moves?.length) {
        optimalResult = result;
      } else if (
        result.moves?.length === optimalResult.moves?.length &&
        Math.abs(3 - result.moves[0]) < Math.abs(3 - optimalResult.moves[0])
      ) {
        optimalResult = result;
      }
    }
  }
  if (optimalResult) {
    return optimalResult;
  }
  return { result: false };
}
