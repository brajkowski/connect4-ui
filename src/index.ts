import { AUTO, Game, Types } from 'phaser';
import { PlayingScene } from './gui/scenes/playing-scene';

const scene = new PlayingScene(null);

const config: Types.Core.GameConfig = {
  type: AUTO,
  width: 600,
  height: 600,
  scene: scene,
  scale: {
    mode: Phaser.Scale.FIT,
  },
};

const game = new Game(config);
