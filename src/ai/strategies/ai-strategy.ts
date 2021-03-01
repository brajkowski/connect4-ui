import { Logic, Player } from '@brajkowski/connect4-logic';

export interface AiStrategy {
  getOptimalMove(player: Player, logic: Logic): Promise<number>;
}
