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
    super(config, player1, player2, true);
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
    this.client.onOpen(() => {
      this.setupSession();
      this.setupClientHandlers();
    });
    super.create();
    if (this.joinSession) {
      this.activePlayer = Player.Two;
    }
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
    this.client.onOpponentJoin((opponentDisplayName) => {
      this.opponentDisplayNameText.setText(opponentDisplayName);
      this.beginActivePlayerTurn();
    });
  }

  private setupSession() {
    if (this.joinSession) {
      this.client.onSessionNotFound(() => {
        const session = window.prompt(
          'Session could not be found.\nPlease check the session code and try again:'
        );
        if (session == null) {
          this.scene.switch('menu');
          return;
        }
        this.client.joinSession(session, this.displayName);
      });
      const session = window.prompt('Join session:');
      if (session == null) {
        this.scene.switch('menu');
        return;
      }
      this.client.joinSession(session, this.displayName);
      this.client.onJoinedSession((opponentDisplayName) => {
        this.opponentDisplayNameText.setText(opponentDisplayName);
        this.beginActivePlayerTurn();
        this.client.onSessionNotFound(() => alert('Session corrupted'));
        this.backButton.setAction(() => {
          this.client.quit();
          this.scene.switch('menu');
        });
      });
    } else {
      this.client.createSession(this.displayName);
      this.client.onSessionCreated((session) => {
        console.log('Session created:', session);
        this.backButton.setAction(() => {
          this.client.quit();
          this.scene.switch('menu');
        });
      });
    }
  }

  private setupClientHandlers() {
    this.client.onOpponentMove((column) => super.dropChip(column));
    this.client.onGameRestart((thisClientStartsFirst) => {
      super.restart(() => (thisClientStartsFirst ? Player.One : Player.Two));
    });
    this.client.onOpponentQuit(() => alert('Opponent has left'));
    this.client.onSessionEnded(() => alert('The session has ended'));
  }
}
