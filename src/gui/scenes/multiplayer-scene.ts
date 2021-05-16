import { Player } from '@brajkowski/connect4-logic';
import { Connect4Client } from '@brajkowski/connect4-multiplayer-client';
import { Types } from 'phaser';
import { multiplayerServer } from '../..';
import { PlayerController } from '../controllers/player-controller';
import { PlayingScene } from './playing-scene';

export class MultiplayerPlayingScene extends PlayingScene {
  constructor(
    config: Types.Scenes.SettingsConfig,
    player1: PlayerController,
    player2: PlayerController,
    private displayName: string,
    private client: Connect4Client,
    private joinSession: boolean
  ) {
    super(config, player1, player2);
    this.client = client;
  }

  createRestartButton() {
    // Overridden so that the restart button is not displayed.
  }

  init(data: { displayName: string }) {
    console.log('Setting display name:', data.displayName);
    this.displayName = data.displayName;
  }

  create() {
    this.client.open(multiplayerServer);
    if (this.joinSession) {
      this.activePlayer = Player.Two;
    }
    setTimeout(() => {
      this.client.onOpponentMove((column) => super.dropChip(column));
      if (this.joinSession) {
        this.client.joinSession(
          window.prompt('Join session:'),
          this.displayName
        );
      } else {
        this.client.createSession(this.displayName);
        this.client.onSessionCreated((session) =>
          console.log('Session created:', session)
        );
      }
    }, 500);
    super.create();
    this.restartButton = null;
  }
}
