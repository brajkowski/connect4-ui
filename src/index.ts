import { AUTO, Game, Types } from 'phaser';
import { PlayingScene } from './gui/scenes/playing-scene';

const scene = new PlayingScene(null);

const config: Types.Core.GameConfig = {
  type: AUTO,
  width: 600,
  height: 600,
  scene: scene,
};

const game = new Game(config);
