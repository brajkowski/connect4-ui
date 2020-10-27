import { GameObjects, Scene } from 'phaser';
import { Player } from '../../logic/logic';
import chipPrimary from '../../assets/chip_primary.png';
import chipSecondary from '../../assets/chip_secondary.png';
import click1 from '../../assets/click.ogg';
import click2 from '../../assets/click.m4a';
import click3 from '../../assets/click.mp3';
import click4 from '../../assets/click.wav';
import { ChipPositionMapper } from '../util/chip-position-mapper';
import { globalScale } from '../util/scale';

export class Chip {
  static preload(scene: Scene) {
    scene.load.image('chipPrimary', chipPrimary);
    scene.load.image('chipSecondary', chipSecondary);
    scene.load.audio('click', [click1, click2, click3, click4]);
  }
  private static readonly gravity = globalScale(0.08);
  private static readonly dampening = 0.5;
  private static readonly bounceThreshold = 0.7;
  private static readonly bounceVolumeCoeff = 0.1;

  private readonly sprite: GameObjects.Sprite;
  private x: number;
  private finalY: number;
  private currentY: number;
  private velocityY = 0;
  private hasRested = false;
  private playBouncingSound: () => void = () => {};

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

    // Hook in audio if it has been properly loaded (not all devices support all audio formats).
    if (scene.game.cache.audio.get('click') === undefined) return;
    this.playBouncingSound = () => {
      const volume = Math.abs(this.velocityY * Chip.bounceVolumeCoeff);
      const sound = scene.sound.add('click', { volume: volume });
      sound.play();
    };
  }

  destroy() {
    this.sprite.destroy(false);
  }

  update(time?: any, delta?: any) {
    if (!this.hasRested) {
      this.fallingAnimation(delta);
    }
  }

  private fallingAnimation(delta: any) {
    this.accelerate();
    this.move(delta);
    this.sprite.setPosition(this.x, this.currentY);
  }

  private accelerate() {
    this.velocityY += Chip.gravity;
  }

  private move(delta: any) {
    this.currentY += this.velocityY * delta;
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
