import { Constants, Logic, Player } from '@brajkowski/connect4-logic';
import { Math } from 'phaser';
import { AiStrategy } from './ai-strategy';

export class RandomStrategy implements AiStrategy {
  private random = new Math.RandomDataGenerator();
  private simulatedThinkingTime?: number;

  constructor(simulatedThinkingTime?: number) {
    this.simulatedThinkingTime = simulatedThinkingTime;
  }

  getOptimalMove(player: Player, logic: Logic): Promise<number> {
    const availableColumns: number[] = [];
    for (let column = 0; column < Constants.columns; column++) {
      if (logic.canPlaceChip(column)) availableColumns.push(column);
    }
    const chosenColumn = this.random.pick(availableColumns);
    return new Promise((resolve) => {
      setTimeout(() => resolve(chosenColumn), this.simulatedThinkingTime);
    });
  }
}
