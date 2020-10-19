import { AUTO, Game, Types } from 'phaser';
import { PlayingScene } from './gui/scenes/playing-scene';
import { globalScale } from './gui/util/scale';

const scene = new PlayingScene(null);

const config: Types.Core.GameConfig = {
  type: AUTO,
  width: globalScale(600),
  height: globalScale(600),
  scene: scene,
  scale: {
    mode: Phaser.Scale.FIT,
  },
};

const game = new Game(config);
