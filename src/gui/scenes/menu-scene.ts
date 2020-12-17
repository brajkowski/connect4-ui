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
      console.log('Easy')
    );
    new Button(this, globalScale(138), globalScale(460), 'Medium', () =>
      console.log('Medium')
    );
    new Button(this, globalScale(138), globalScale(520), 'Hard', () =>
      console.log('Hard')
    );
    new Button(this, globalScale(352), globalScale(400), 'Local', () =>
      console.log('Local')
    );
    new Button(this, globalScale(352), globalScale(460), 'Multiplayer', () =>
      console.log('Multiplayer')
    );
  }

  update() {}
}
