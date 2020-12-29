import { Scene } from 'phaser';
import background from '../../assets/menu_background.png';
import { Button } from '../components/button';
import { globalScale } from '../util/scale';

export class MenuScene extends Scene {
  preload() {
    Button.preload(this);
    this.load.image('menu-background', background);
  }

  create() {
    this.add.image(0, 0, 'menu-background').setOrigin(0, 0);
    new Button(this, globalScale(138), globalScale(400), 'Easy', () =>
      this.scene.switch('easy')
    );
    new Button(this, globalScale(138), globalScale(460), 'Medium', () =>
      this.scene.switch('medium')
    );
    new Button(this, globalScale(138), globalScale(520), 'Hard', () =>
      this.scene.switch('hard')
    );
    new Button(this, globalScale(352), globalScale(400), 'Local', () =>
      this.scene.switch('local')
    );
    new Button(
      this,
      globalScale(352),
      globalScale(460),
      'Multiplayer',
      null,
      true
    );
  }

  update() {}
}
