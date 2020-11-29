import { Logic, Player } from '../logic/logic';

export interface AiStrategy {
  getOptimalMove(player: Player, logic: Logic): Promise<number>;
}
