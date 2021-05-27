import { GameObjects, Scene } from 'phaser';
import button from '../../assets/button.png';
import buttonPressed from '../../assets/button_pressed.png';

export class Button {
  static preload(scene: Scene) {
    scene.load.image(this.passiveTexture, button);
    scene.load.image(this.activeTexture, buttonPressed);
  }

  private static readonly passiveTexture = 'button';
  private static readonly activeTexture = 'button-pressed';
  private readonly disabledTint = 0x777777;
  private readonly textOffsetX = 172;
  private readonly textoOffsetY = 68;
  private sprite: GameObjects.Sprite;
  private text: GameObjects.Text;
  constructor(
    scene: Scene,
    x: number,
    y: number,
    text: string,
    action?: () => void,
    disabled?: boolean
  ) {
    this.sprite = scene.add
      .sprite(x, y, Button.passiveTexture)
      .setOrigin(0, 0)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.activeState())
      .on('pointerout', () => this.passiveState())
      .on('pointerup', () => {
        this.passiveState();
        action?.();
      });
    const spritePos = this.sprite.getTopLeft();
    this.text = scene.make
      .text({
        x: spritePos.x + this.textOffsetX,
        y: spritePos.y + this.textoOffsetY,
        text,
        style: {
          color: 'white',
          font: `40px "Arial"`,
        },
      })
      .setOrigin(0.5);
    if (disabled) {
      this.disable();
    }
  }

  enable() {
    this.sprite.clearTint();
    this.text.clearTint();
    this.sprite.setInteractive({ useHandCursor: true });
  }

  disable() {
    this.sprite.setTint(this.disabledTint);
    this.text.setTint(this.disabledTint);
    this.sprite.disableInteractive();
  }

  private activeState() {
    this.sprite.setTexture(Button.activeTexture);
  }

  private passiveState() {
    this.sprite.setTexture(Button.passiveTexture);
  }
}
