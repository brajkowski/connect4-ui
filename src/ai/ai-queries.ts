import { Logic, Player } from '../logic/logic';
import { Constants } from '../util/constants';

export interface AiQueryResult {
  result: boolean;
  move?: number;
}
export function canWinOnNextTurn(player: Player, logic: Logic): AiQueryResult {
  for (let column = 0; column < Constants.columns; column++) {
    if (logic.canPlaceChip(column)) {
      const logicCopy = logic.createCopy();
      logicCopy.placeChip(player, column);
      if (logicCopy.didWin(player)) {
        return { result: true, move: column };
      }
    }
  }
  return { result: false };
}
