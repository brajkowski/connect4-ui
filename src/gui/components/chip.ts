import { GameObjects, Scene } from 'phaser';
import { Player } from '../../logic/logic';
import chipPrimary from '../../assets/chip_primary.png';
import chipSecondary from '../../assets/chip_secondary.png';
import click from '../../assets/click.wav';
import { ChipPositionMapper } from '../util/chip-position-mapper';

export class Chip {
  static preload(scene: Scene) {
    scene.load.image('chipPrimary', chipPrimary);
    scene.load.image('chipSecondary', chipSecondary);
    scene.load.audio('click', click);
  }
  private static readonly gravity = 1;
  private static readonly dampening = 0.5;
  private static readonly bounceThreshold = 0.7;
  private static readonly bounceVolumeCoeff = 0.1;

  private readonly sprite: GameObjects.Sprite;
  private x: number;
  private finalY: number;
  private currentY: number;
  private velocityY = 0;
  private hasRested = false;
  private playBouncingSound: () => void;

  constructor(player: Player, column: number, fallToRow: number, scene: Scene) {
    switch (player) {
      case Player.One:
        this.sprite = scene.add.sprite(0, 0, 'chipPrimary').setOrigin(0, 0);
        break;
      case Player.Two:
        this.sprite = scene.add.sprite(0, 0, 'chipSecondary').setOrigin(0, 0);
        break;
    }
    const startingPosition = ChipPositionMapper.map(0, column);
    this.x = startingPosition.x;
    this.currentY = startingPosition.y;
    this.finalY = ChipPositionMapper.map(fallToRow, column).y;
    if (fallToRow === 0) {
      this.hasRested = true;
      this.sprite.setPosition(this.x, this.finalY);
    }
    this.playBouncingSound = () => {
      const volume = Math.abs(this.velocityY * Chip.bounceVolumeCoeff);
      const sound = scene.sound.add('click', { volume: volume });
      sound.play();
    };
  }

  destroy() {
    this.sprite.destroy(false);
  }

  update() {
    if (!this.hasRested) {
      this.fallingAnimation();
    }
  }

  private fallingAnimation() {
    this.accelerate();
    this.move();
    this.sprite.setPosition(this.x, this.currentY);
  }

  private accelerate() {
    this.velocityY += Chip.gravity;
  }

  private move() {
    this.currentY += this.velocityY;
    if (this.currentY >= this.finalY && this.velocityY > 0) {
      this.bounce();
    }
    if (this.currentY > this.finalY) {
      this.currentY = this.finalY;
    }
  }

  private bounce() {
    if (this.velocityY <= Chip.bounceThreshold) {
      this.hasRested = true;
      this.currentY = this.finalY;
      return;
    }
    this.velocityY = -this.velocityY * Chip.dampening;
    this.playBouncingSound();
  }
}
