import { Logic, Player } from '@brajkowski/connect4-logic';
import { Connect4Client } from '@brajkowski/connect4-multiplayer-client';
import humanController from '../../assets/human_controller.png';
import { PlayerController } from './player-controller';

export class MultiplayerOpponentController implements PlayerController {
  private readonly controllerName = 'Opponent';
  private readonly iconTextureKey = 'humanControllerIcon';
  constructor(private client: Connect4Client) {}

  promptForMove(
    player: Player,
    logic: Logic,
    input: Phaser.Input.InputPlugin
  ): Promise<number> {
    return new Promise((resolve) => {
      this.client.onOpponentMove((column) => resolve(column));
    });
  }

  cancelPromptForMove(): void {}

  preload(scene: Phaser.Scene): void {
    scene.load.image(this.iconTextureKey, humanController);
  }

  getIconTextureKey(): string {
    return this.iconTextureKey;
  }

  getControllerName(): string {
    return this.controllerName;
  }
}
