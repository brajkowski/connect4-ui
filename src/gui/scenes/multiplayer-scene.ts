import { Player } from '@brajkowski/connect4-logic';
import { Connect4Client } from '@brajkowski/connect4-multiplayer-client';
import { GameObjects, Types } from 'phaser';
import { multiplayerServer } from '../..';
import { PlayerController } from '../controllers/player-controller';
import { globalScale } from '../util/scale';
import { PlayingScene } from './playing-scene';

export class MultiplayerPlayingScene extends PlayingScene {
  private displayName: string;
  private displayNameText: GameObjects.Text;
  private opponentDisplayNameText: GameObjects.Text;

  constructor(
    config: Types.Scenes.SettingsConfig,
    player1: PlayerController,
    player2: PlayerController,
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
    this.displayNameText = this.make.text({
      x: globalScale(160),
      y: globalScale(582),
      text: this.displayName,
      style: {
        font: `italic ${globalScale(10)}px "Arial"`,
        color: 'white',
      },
    });
    this.displayNameText.setOrigin(0.5);
    this.opponentDisplayNameText = this.make.text({
      x: globalScale(440),
      y: globalScale(582),
      text: 'Opponent',
      style: {
        font: `italic ${globalScale(10)}px "Arial"`,
        color: 'white',
      },
    });
    this.opponentDisplayNameText.setOrigin(0.5);
  }
}
