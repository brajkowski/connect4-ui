import { Scene } from 'phaser';
import background from '../../assets/background.png';
import click from '../../assets/click.wav';

export class PlayingScene extends Scene {
  preload() {
    this.load.image('background', background);
    this.load.audio('click', click);
  }

  create() {
    this.add.image(0, 0, 'background').setOrigin(0, 0);
    const music = this.sound.add('click');
    this.input.on('pointerdown', () => {
      music.play();
    });
    const score1 = this.make.text({
      x: 165,
      y: 525,
      text: '0',
      style: {
        font: '30px "Arial"',
        color: 'white',
      },
    });
    const score2 = this.make.text({
      x: 445,
      y: 525,
      text: '0',
      style: {
        font: '30px "Arial"',
        color: 'white',
      },
    });
  }
}
