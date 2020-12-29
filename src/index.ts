import { AUTO, Game, Types } from 'phaser';
import { MenuScene } from './gui/scenes/menu-scene';
import { PlayingScene } from './gui/scenes/playing-scene';
import { globalScale } from './gui/util/scale';

const menu = new MenuScene({ key: 'menu' });
const easy = new PlayingScene({ key: 'easy' });
const medium = new PlayingScene({ key: 'medium' });
const hard = new PlayingScene({ key: 'hard' });
const local = new PlayingScene({ key: 'local' });
const multiplayer = new PlayingScene({ key: 'multi' });

const config: Types.Core.GameConfig = {
  type: AUTO,
  width: globalScale(600),
  height: globalScale(600),
  scene: [menu, easy, medium, hard, local, multiplayer],
  scale: {
    mode: Phaser.Scale.FIT,
  },
};

const game = new Game(config);
