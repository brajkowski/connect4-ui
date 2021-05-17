import { GameObjects, Scene } from 'phaser';
import back from '../../assets/back.png';
import backPressed from '../../assets/back_pressed.png';

export class BackButton {
  static preload(scene: Scene) {
    scene.load.image(this.passiveTexture, back);
    scene.load.image(this.activeTexture, backPressed);
  }

  private static readonly passiveTexture = 'back';
  private static readonly activeTexture = 'back-pressed';
  private sprite: GameObjects.Sprite;
  private action?: () => void;

  constructor(scene: Scene, x: number, y: number, action?: () => void) {
    this.action = action;
    this.sprite = scene.add
      .sprite(x, y, BackButton.passiveTexture)
      .setOrigin(0, 0)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.activeState())
      .on('pointerout', () => this.passiveState())
      .on('pointerup', () => {
        this.passiveState();
        this.action?.();
      });
  }

  setAction(action: () => void): void {
    this.action = action;
  }

  private activeState() {
    this.sprite.setTexture(BackButton.activeTexture);
  }

  private passiveState() {
    this.sprite.setTexture(BackButton.passiveTexture);
  }
}
