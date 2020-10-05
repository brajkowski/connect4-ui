import { GameObjects, Input, Math, Scene } from 'phaser';
import background from '../../assets/background.png';
import board from '../../assets/board.png';
import { BitboardLogic } from '../../logic/bitboard-logic';
import { Player } from '../../logic/logic';
import { Chip } from '../components/chip';
import { MoveIndicator } from '../components/move-indicator';
import { RestartButton } from '../components/restart-button';
import { ColumnMapper } from '../util/column-mapper';

export class PlayingScene extends Scene {
  private moveIndicator: MoveIndicator;
  private restartButton: RestartButton;
  private chips = new Array<Chip>();
  private player = Player.One;
  private score1 = 0;
  private score2 = 0;
  private score1Text: GameObjects.Text;
  private score2Text: GameObjects.Text;
  private winningText: GameObjects.Text;
  private isInWinState = false;
  private logic = new BitboardLogic();

  preload() {
    this.load.image('background', background);
    this.load.image('board', board);
    MoveIndicator.preload(this);
    RestartButton.preload(this);
    Chip.preload(this);
  }

  create() {
    this.add.image(0, 0, 'background').setOrigin(0, 0);
    this.add.image(50, 64, 'board').setOrigin(0, 0).setDepth(1);
    this.input.on('pointerdown', this.onMouseButtonPress.bind(this));
    this.moveIndicator = new MoveIndicator(new Math.Vector2(0, 25), this);
    this.restartButton = new RestartButton(
      new Math.Vector2(276, 516),
      this,
      this.restart.bind(this)
    );
    this.score1Text = this.make.text({
      x: 165,
      y: 525,
      text: `${this.score1}`,
      style: {
        font: '30px "Arial"',
        color: 'white',
      },
    });
    this.score2Text = this.make.text({
      x: 445,
      y: 525,
      text: `${this.score2}`,
      style: {
        font: '30px "Arial"',
        color: 'white',
      },
    });
    this.winningText = this.make.text({
      x: 175,
      y: 10,
      text: '',
      style: {
        font: '40px "Arial"',
        color: 'white',
      },
    });
    this.winningText.visible = false;
  }

  update() {
    this.prepareMoveIndicator();
    this.chips.forEach((c) => c.update());
    this.moveIndicator.update();
    this.restartButton.update();
  }

  private onMouseButtonPress(pointer: Input.Pointer) {
    if (pointer.y >= 64 && pointer.y <= 492 && !this.isInWinState) {
      this.dropChip(ColumnMapper.getColumnFromMouseCoordinate(pointer.x));
    }
  }

  private dropChip(column: number) {
    if (!this.logic.canPlaceChip(column)) {
      return;
    }
    const row = this.logic.placeChip(this.player, column);
    this.chips.push(new Chip(this.player, column, row, this));
    if (this.logic.didWin(this.player)) {
      this.player == Player.One ? this.score1++ : this.score2++;
      this.score1Text.text = this.score1.toString();
      this.score2Text.text = this.score2.toString();
      this.isInWinState = true;
      this.moveIndicator.setVisibility(false);
      this.winningText.text = `Player ${this.player + 1} Wins!`;
      this.winningText.visible = true;
      return;
    }
    this.swapPlayers();
  }

  private prepareMoveIndicator() {
    const column = ColumnMapper.getColumnFromMouseCoordinate(
      this.input.activePointer.x
    );
    const x = ColumnMapper.getColumnCenterPixelFromIndex(column);
    this.moveIndicator.setXPosition(x);
    this.moveIndicator.valid = this.logic.canPlaceChip(column);
  }

  private swapPlayers() {
    this.player === Player.One
      ? (this.player = Player.Two)
      : (this.player = Player.One);
    this.restartButton.triggerAnimation();
  }

  private restart() {
    this.winningText.visible = false;
    this.logic.clear();
    this.chips.forEach((c) => c.destroy());
    this.chips = new Array<Chip>();
    const random = new Math.RandomDataGenerator();
    random.integerInRange(0, 1);
    this.player = random.integerInRange(0, 1);
    this.restartButton.reinitialize(this.player === Player.One);
    this.isInWinState = false;
    this.moveIndicator.setVisibility(true);
  }
}
