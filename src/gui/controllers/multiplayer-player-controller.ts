import { Logic, Player } from '@brajkowski/connect4-logic';
import { Connect4Client } from '@brajkowski/connect4-multiplayer-client';
import { Input } from 'phaser';
import { HumanPlayerController } from './human-player-controller';

export class MultiplayerPlayerController extends HumanPlayerController {
  constructor(private client: Connect4Client) {
    super();
  }

  promptForMove(
    player: Player,
    logic: Logic,
    input: Input.InputPlugin
  ): Promise<number> {
    return super.promptForMove(player, logic, input).then((column) => {
      this.client.makeMove(column);
      return column;
    });
  }
}
