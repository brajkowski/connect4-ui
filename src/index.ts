import { AUTO, Game, Types } from 'phaser';
import { MenuScene } from './gui/scenes/menu-scene';
import { globalScale } from './gui/util/scale';

const scene = new MenuScene(null);

const config: Types.Core.GameConfig = {
  type: AUTO,
  width: globalScale(600),
  height: globalScale(600),
  scene,
  scale: {
    mode: Phaser.Scale.FIT,
  },
};

const game = new Game(config);
