import { Player } from '@brajkowski/connect4-logic';
import { Connect4Client } from '@brajkowski/connect4-multiplayer-client';
import { GameObjects, Types } from 'phaser';
import { multiplayerServer } from '../../index';
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
    if (this.joinSession) {
      this.activePlayer = Player.Two;
    }
    this.client.open(multiplayerServer);
    this.client.onOpen(() => {
      this.setupSession();
      this.setupClientHandlers();
    });
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
      text: 'Waiting for opponent to join...',
      style: {
        font: `italic ${globalScale(10)}px "Arial"`,
        color: 'white',
      },
    });
    this.opponentDisplayNameText.setOrigin(0.5);
    this.client.onOpponentJoin((opponentDisplayName) =>
      this.opponentDisplayNameText.setText(opponentDisplayName)
    );
  }

  private setupSession() {
    if (this.joinSession) {
      this.client.joinSession(window.prompt('Join session:'), this.displayName);
      this.client.onJoinedSession((opponentDisplayName) =>
        this.opponentDisplayNameText.setText(opponentDisplayName)
      );
    } else {
      this.client.createSession(this.displayName);
      this.client.onSessionCreated((session) =>
        console.log('Session created:', session)
      );
    }
  }

  private setupClientHandlers() {
    this.client.onOpponentMove((column) => super.dropChip(column));
    this.client.onGameRestart((thisClientStartsFirst) => {
      super.restart(() => (thisClientStartsFirst ? Player.One : Player.Two));
    });
    this.client.onClose(() => alert('Socket closed'));
    this.client.onOpponentQuit(() => alert('Opponent has left'));
    this.client.onSessionEnded(() => alert('The session has ended'));
  }
}