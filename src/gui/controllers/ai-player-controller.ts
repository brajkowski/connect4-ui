import { Math } from 'phaser';
import { Player, Logic } from '../../logic/logic';
import { Constants } from '../../util/constants';
import { PlayerController } from './player-controller';

export class AiPlayerController implements PlayerController {
  private readonly thinkingTime = 2000; // ms.
  private reject: (reason?: any) => void;
  private hasBeenPrompted = false;

  promptForMove(
    player: Player,
    logic: Logic,
    input: Phaser.Input.InputPlugin
  ): Promise<number> {
    this.hasBeenPrompted = true;
    return new Promise((resolve, reject) => {
      this.reject = reject;
      const availableMoves: number[] = [];
      for (let i = 0; i < Constants.columns; i++) {
        if (logic.canPlaceChip(i)) availableMoves.push(i);
      }
      const random = new Math.RandomDataGenerator();
      setTimeout(() => resolve(random.pick(availableMoves)), this.thinkingTime);
    });
  }

  cancelPromptForMove(): void {
    if (!this.hasBeenPrompted) return;
    this.hasBeenPrompted = false;
    this.reject();
  }
}
