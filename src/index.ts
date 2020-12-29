import { AUTO, Game, Types } from 'phaser';
import { easy, hard, medium } from './ai/strategies/rules/difficulty';
import { RuleBasedStrategy } from './ai/strategies/rules/rule-based-strategy';
import { AiPlayerController } from './gui/controllers/ai-player-controller';
import { HumanPlayerController } from './gui/controllers/human-player-controller';
import { MenuScene } from './gui/scenes/menu-scene';
import { PlayingScene } from './gui/scenes/playing-scene';
import { globalScale } from './gui/util/scale';

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

const config: Types.Core.GameConfig = {
  type: AUTO,
  width: globalScale(600),
  height: globalScale(600),
  scene: [menu, easyScene, mediumScene, hardScene, localScene],
  scale: {
    mode: Phaser.Scale.FIT,
  },
};

const game = new Game(config);
