import { Connect4Client } from '@brajkowski/connect4-multiplayer-client';
import { AUTO, Game, Types } from 'phaser';
import { easy, hard, medium } from './ai/strategies/rules/difficulty';
import { RuleBasedStrategy } from './ai/strategies/rules/rule-based-strategy';
import { AiPlayerController } from './gui/controllers/ai-player-controller';
import { HumanPlayerController } from './gui/controllers/human-player-controller';
import { MultiplayerOpponentController } from './gui/controllers/multiplayer-opponent-controller';
import { MultiplayerPlayerController } from './gui/controllers/multiplayer-player-controller';
import { MenuScene } from './gui/scenes/menu-scene';
import { MultiplayerPlayingScene } from './gui/scenes/multiplayer-scene';
import { PlayingScene } from './gui/scenes/playing-scene';
import { globalScale } from './gui/util/scale';

export const multiplayerServer = 'wss://br-connect-4-mp-server.herokuapp.com';
const client: Connect4Client = new Connect4Client();
const menu = new MenuScene({ key: 'menu' });
const easyScene = new PlayingScene(
  { key: 'easy' },
  new HumanPlayerController(),
  new AiPlayerController(new RuleBasedStrategy(easy, 1500))
);
const mediumScene = new PlayingScene(
  { key: 'medium' },
  new HumanPlayerController(),
  new AiPlayerController(new RuleBasedStrategy(medium, 1500))
);
const hardScene = new PlayingScene(
  { key: 'hard' },
  new HumanPlayerController(),
  new AiPlayerController(new RuleBasedStrategy(hard, 1500))
);
const localScene = new PlayingScene(
  { key: 'local' },
  new HumanPlayerController(),
  new HumanPlayerController()
);
const createMultiplayer = new MultiplayerPlayingScene(
  { key: 'mp-create' },
  new MultiplayerPlayerController(client),
  new MultiplayerOpponentController(client),
  client,
  false
);
const joinMultiplayer = new MultiplayerPlayingScene(
  { key: 'mp-join' },
  new MultiplayerPlayerController(client),
  new MultiplayerOpponentController(client),
  client,
  true
);

const config: Types.Core.GameConfig = {
  type: AUTO,
  width: globalScale(600),
  height: globalScale(600),
  scene: [
    menu,
    easyScene,
    mediumScene,
    hardScene,
    localScene,
    createMultiplayer,
    joinMultiplayer,
  ],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
  },
  dom: {
    createContainer: true,
  },
  parent: 'canvas-parent',
};

const game = new Game(config);
