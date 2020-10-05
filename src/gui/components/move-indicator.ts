import { GameObjects, Math, Scene } from 'phaser';
import v1 from '../../assets/animations/move_indicator/valid/1.png';
import v2 from '../../assets/animations/move_indicator/valid/2.png';
import v3 from '../../assets/animations/move_indicator/valid/3.png';
import v4 from '../../assets/animations/move_indicator/valid/4.png';
import v5 from '../../assets/animations/move_indicator/valid/5.png';
import v6 from '../../assets/animations/move_indicator/valid/6.png';
import v7 from '../../assets/animations/move_indicator/valid/7.png';
import v8 from '../../assets/animations/move_indicator/valid/8.png';
import v9 from '../../assets/animations/move_indicator/valid/9.png';
import v10 from '../../assets/animations/move_indicator/valid/10.png';
import v11 from '../../assets/animations/move_indicator/valid/11.png';
import v12 from '../../assets/animations/move_indicator/valid/12.png';
import v13 from '../../assets/animations/move_indicator/valid/13.png';
import v14 from '../../assets/animations/move_indicator/valid/14.png';
import v15 from '../../assets/animations/move_indicator/valid/15.png';

import i1 from '../../assets/animations/move_indicator/invalid/1.png';
import i2 from '../../assets/animations/move_indicator/invalid/2.png';
import i3 from '../../assets/animations/move_indicator/invalid/3.png';
import i4 from '../../assets/animations/move_indicator/invalid/4.png';
import i5 from '../../assets/animations/move_indicator/invalid/5.png';
import i6 from '../../assets/animations/move_indicator/invalid/6.png';
import i7 from '../../assets/animations/move_indicator/invalid/7.png';
import i8 from '../../assets/animations/move_indicator/invalid/8.png';
import i9 from '../../assets/animations/move_indicator/invalid/9.png';
import i10 from '../../assets/animations/move_indicator/invalid/10.png';
import i11 from '../../assets/animations/move_indicator/invalid/11.png';
import i12 from '../../assets/animations/move_indicator/invalid/12.png';
import i13 from '../../assets/animations/move_indicator/invalid/13.png';
import i14 from '../../assets/animations/move_indicator/invalid/14.png';
import i15 from '../../assets/animations/move_indicator/invalid/15.png';

export class MoveIndicator {
  static preload(scene: Scene) {
    scene.load.image('v1', v1);
    scene.load.image('v2', v2);
    scene.load.image('v3', v3);
    scene.load.image('v4', v4);
    scene.load.image('v5', v5);
    scene.load.image('v6', v6);
    scene.load.image('v7', v7);
    scene.load.image('v8', v8);
    scene.load.image('v9', v9);
    scene.load.image('v10', v10);
    scene.load.image('v11', v11);
    scene.load.image('v12', v12);
    scene.load.image('v13', v13);
    scene.load.image('v14', v14);
    scene.load.image('v15', v15);

    scene.load.image('i1', i1);
    scene.load.image('i2', i2);
    scene.load.image('i3', i3);
    scene.load.image('i4', i4);
    scene.load.image('i5', i5);
    scene.load.image('i6', i6);
    scene.load.image('i7', i7);
    scene.load.image('i8', i8);
    scene.load.image('i9', i9);
    scene.load.image('i10', i10);
    scene.load.image('i11', i11);
    scene.load.image('i12', i12);
    scene.load.image('i13', i13);
    scene.load.image('i14', i14);
    scene.load.image('i15', i15);
  }

  private readonly minImageIndex = 1;
  private readonly maxImageIndex = 15;
  private current = this.minImageIndex;
  private increment = -1;
  private image: GameObjects.Image;
  private frame = 0;

  valid: boolean;

  constructor(position: Math.Vector2, scene: Scene) {
    this.valid = true;
    this.image = scene.add.image(position.x, position.y, 'v1').setOrigin(0, 0);
  }

  setVisibility(visible: boolean) {
    this.image.visible = visible;
  }

  setXPosition(x: number) {
    this.image.setX(x);
  }

  update() {
    if (this.frame % 3 == 0) {
      if (
        this.current == this.maxImageIndex ||
        this.current == this.minImageIndex
      ) {
        this.increment = -this.increment;
      }
      this.current += this.increment;
    }
    this.valid
      ? this.image.setTexture(`v${this.current}`)
      : this.image.setTexture(`i${this.current}`);
    this.frame++;
  }
}
