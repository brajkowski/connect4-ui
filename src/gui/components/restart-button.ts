import { GameObjects, Math, Scene } from 'phaser';
import p1 from '../../assets/animations/restart_button/primary/1.png';
import p2 from '../../assets/animations/restart_button/primary/2.png';
import p3 from '../../assets/animations/restart_button/primary/3.png';
import p4 from '../../assets/animations/restart_button/primary/4.png';
import p5 from '../../assets/animations/restart_button/primary/5.png';
import p6 from '../../assets/animations/restart_button/primary/6.png';
import p7 from '../../assets/animations/restart_button/primary/7.png';
import p8 from '../../assets/animations/restart_button/primary/8.png';
import p9 from '../../assets/animations/restart_button/primary/9.png';
import p10 from '../../assets/animations/restart_button/primary/10.png';
import p11 from '../../assets/animations/restart_button/primary/11.png';
import p12 from '../../assets/animations/restart_button/primary/12.png';
import p13 from '../../assets/animations/restart_button/primary/13.png';
import p14 from '../../assets/animations/restart_button/primary/14.png';
import p15 from '../../assets/animations/restart_button/primary/15.png';
import p16 from '../../assets/animations/restart_button/primary/16.png';

import s1 from '../../assets/animations/restart_button/secondary/1.png';
import s2 from '../../assets/animations/restart_button/secondary/2.png';
import s3 from '../../assets/animations/restart_button/secondary/3.png';
import s4 from '../../assets/animations/restart_button/secondary/4.png';
import s5 from '../../assets/animations/restart_button/secondary/5.png';
import s6 from '../../assets/animations/restart_button/secondary/6.png';
import s7 from '../../assets/animations/restart_button/secondary/7.png';
import s8 from '../../assets/animations/restart_button/secondary/8.png';
import s9 from '../../assets/animations/restart_button/secondary/9.png';
import s10 from '../../assets/animations/restart_button/secondary/10.png';
import s11 from '../../assets/animations/restart_button/secondary/11.png';
import s12 from '../../assets/animations/restart_button/secondary/12.png';
import s13 from '../../assets/animations/restart_button/secondary/13.png';
import s14 from '../../assets/animations/restart_button/secondary/14.png';
import s15 from '../../assets/animations/restart_button/secondary/15.png';
import s16 from '../../assets/animations/restart_button/secondary/16.png';

export class RestartButton {
  static preload(scene: Scene) {
    scene.load.image('p1', p1);
    scene.load.image('p2', p2);
    scene.load.image('p3', p3);
    scene.load.image('p4', p4);
    scene.load.image('p5', p5);
    scene.load.image('p6', p6);
    scene.load.image('p7', p7);
    scene.load.image('p8', p8);
    scene.load.image('p9', p9);
    scene.load.image('p10', p10);
    scene.load.image('p11', p11);
    scene.load.image('p12', p12);
    scene.load.image('p13', p13);
    scene.load.image('p14', p14);
    scene.load.image('p15', p15);
    scene.load.image('p16', p16);

    scene.load.image('s1', s1);
    scene.load.image('s2', s2);
    scene.load.image('s3', s3);
    scene.load.image('s4', s4);
    scene.load.image('s5', s5);
    scene.load.image('s6', s6);
    scene.load.image('s7', s7);
    scene.load.image('s8', s8);
    scene.load.image('s9', s9);
    scene.load.image('s10', s10);
    scene.load.image('s11', s11);
    scene.load.image('s12', s12);
    scene.load.image('s13', s13);
    scene.load.image('s14', s14);
    scene.load.image('s15', s15);
    scene.load.image('s16', s16);
  }

  private readonly minAnimationIndex = 1;
  private readonly maxAnimationIndex = 16;
  private currentAnimation = this.minAnimationIndex;
  private increment = -1;
  private isAnimating = true;
  private isPrimary = true;
  private image: GameObjects.Image;

  constructor(position: Math.Vector2, scene: Scene, onClick?: () => void) {
    this.image = scene.add.image(position.x, position.y, 'p1').setOrigin(0, 0);
    this.image.setInteractive({ pixelPerfect: true });
    this.image.on('pointerup', () => {
      this.triggerAnimation();
      onClick();
    });
  }

  update() {
    if (this.isAnimating) {
      this.image.setTexture(this.getNext());
    }
  }

  triggerAnimation() {
    if (this.isAnimating) {
      // Finish out the existing animation, but swap the color.
      this.isPrimary = !this.isPrimary;
    }
    this.isAnimating = true;
  }

  reinitialize(isPrimary: boolean) {
    this.isPrimary = isPrimary;
    this.currentAnimation = this.minAnimationIndex;
    this.increment = -1;
    this.isAnimating = true;
    this.isPrimary
      ? this.image.setTexture(`p${this.currentAnimation}`)
      : this.image.setTexture(`s${this.currentAnimation}`);
  }

  private getNext() {
    let ret: string;
    if (
      this.currentAnimation === this.minAnimationIndex ||
      this.currentAnimation === this.maxAnimationIndex
    ) {
      this.increment = -this.increment;
    }
    this.isPrimary
      ? (ret = `p${this.currentAnimation}`)
      : (ret = `s${this.currentAnimation}`);
    if (this.currentAnimation == this.minAnimationIndex)
      this.isAnimating = false;
    if (this.currentAnimation == this.maxAnimationIndex) {
      this.isPrimary = !this.isPrimary;
    }
    this.currentAnimation += this.increment;
    return ret;
  }
}
