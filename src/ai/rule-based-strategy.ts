import { Math } from 'phaser';
import { Logic, Player, WinType } from '../logic/logic';
import { Constants } from '../util/constants';
import { AiStrategy } from './ai-strategy';
import { canWinOnNextTurn, canWinOnNthTurn } from './queries/ai-queries';
import { QueryOptimizer } from './queries/optimization/query-optimizer';
import {
  preferFewerMoves,
  preferMovesNearCenter,
} from './queries/optimization/rules';

export class RuleBasedStrategy implements AiStrategy {
  private readonly random = new Math.RandomDataGenerator();
  private readonly optimizer = new QueryOptimizer([
    preferFewerMoves,
    preferMovesNearCenter,
  ]);
  private simulatedThinkingTime?: number;

  constructor(simulatedThinkingTime?: number) {
    this.simulatedThinkingTime = simulatedThinkingTime;
  }

  getOptimalMove(player: Player, logic: Logic): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(
        () => resolve(this._getOptimalMove(player, logic)),
        this.simulatedThinkingTime
      );
    });
  }

  private _getOptimalMove(player: Player, logic: Logic): number {
    const avoid = new Set<number>();
    // Make a winning move if it exists.
    const nextMoveWin = canWinOnNextTurn(player, logic);
    if (nextMoveWin.result === true) {
      return nextMoveWin.moves[0];
    }

    // Block opponent winning move if it exists.
    const opponent = this.getOpponent(player);
    const opponentNextMoveWin = canWinOnNextTurn(opponent, logic);
    if (opponentNextMoveWin.result === true) {
      return opponentNextMoveWin.moves[0];
    }

    // Inspect 2 opponent winning moves ahead and block the first in the sequence.
    const opponentWinsIn2 = canWinOnNthTurn(opponent, logic, 1, this.optimizer);
    if (opponentWinsIn2.result === true) {
      // Optimizer: If the opponent can win with stacking two pieces, ensure the first is not required only for stacking.
      if (
        opponentWinsIn2.moves[0] === opponentWinsIn2.moves[1] &&
        opponentWinsIn2.type !== WinType.Vertical
      ) {
        avoid.add(opponentWinsIn2.moves[0]);
      } else {
        return opponentWinsIn2.moves[0];
      }
    }

    // Play the most optimal first move.
    if (logic.getChipsPlayed(player) === 0) {
      return 3;
    }

    // Play an attacking move.
    const winsIn2 = canWinOnNthTurn(player, logic, 1, this.optimizer);
    if (winsIn2.result === true) {
      if (!avoid.has(winsIn2.moves[0])) {
        return winsIn2.moves[0];
      }
    }
    return this.randomFallback(logic, avoid);
  }

  private getOpponent(player: Player): Player {
    return player === Player.One ? Player.Two : Player.One;
  }

  private randomFallback(logic: Logic, tryToPrevent?: Set<number>): number {
    const availableColumns: Set<number> = new Set();
    for (let column = 0; column < Constants.columns; column++) {
      if (logic.canPlaceChip(column)) availableColumns.add(column);
    }
    tryToPrevent?.forEach((move) => {
      if (availableColumns.has(move) && availableColumns.size > 1) {
        availableColumns.delete(move);
      }
    });
    return this.random.pick(Array.from(availableColumns));
  }
}
