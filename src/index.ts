import { AUTO, Game, Scene, Types } from 'phaser';
import background from './assets/background.png';
import click from './assets/click.wav';

const config: Types.Core.GameConfig = {
  type: AUTO,
  width: 600,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: {
    preload: preload,
    create: create,
  },
};

const game = new Game(config);

function preload(this: Scene) {
  this.load.image('background', background);
  this.load.audio('click', click);
}

function create(this: Scene) {
  this.add.image(0, 0, 'background').setOrigin(0, 0);
  const music = this.sound.add('click');
  this.input.on('pointerdown', () => {
    music.play();
  });
}
