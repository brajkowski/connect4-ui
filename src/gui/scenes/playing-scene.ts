import { GameObjects, Math, Scene } from 'phaser';
import background from '../../assets/background.png';
import board from '../../assets/board.png';
import { BitboardLogic } from '../../logic/bitboard-logic';
import { Player } from '../../logic/logic';
import { IFrameEvents } from '../../util/iframe-events';
import { noop } from '../../util/no-op';
import { Chip } from '../components/chip';
import { MoveIndicator } from '../components/move-indicator';
import { RestartButton } from '../components/restart-button';
import { HumanPlayerController } from '../controllers/human-player-controller';
import { PlayerController } from '../controllers/player-controller';
import { ColumnMapper } from '../util/column-mapper';
import { globalScale } from '../util/scale';

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
  private drawText: GameObjects.Text;
  private logic = new BitboardLogic();
  private player1controller = new HumanPlayerController();
  private player2controller = new HumanPlayerController();

  preload() {
    this.load.image('background', background);
    this.load.image('board', board);
    MoveIndicator.preload(this);
    RestartButton.preload(this);
    Chip.preload(this);
  }

  create() {
    this.add.image(0, 0, 'background').setOrigin(0, 0);
    this.add
      .image(globalScale(50), globalScale(64), 'board')
      .setOrigin(0, 0)
      .setDepth(1);
    this.moveIndicator = new MoveIndicator(
      new Math.Vector2(globalScale(0), globalScale(25)),
      this
    );
    this.restartButton = new RestartButton(
      new Math.Vector2(globalScale(276), globalScale(516)),
      this,
      this.restart.bind(this)
    );
    this.score1Text = this.make.text({
      x: globalScale(165),
      y: globalScale(525),
      text: `${this.score1}`,
      style: {
        font: `${globalScale(30)}px "Arial"`,
        color: 'white',
      },
    });
    this.score2Text = this.make.text({
      x: globalScale(445),
      y: globalScale(525),
      text: `${this.score2}`,
      style: {
        font: `${globalScale(30)}px "Arial"`,
        color: 'white',
      },
    });
    this.winningText = this.make.text({
      x: globalScale(175),
      y: globalScale(10),
      text: '',
      style: {
        font: `${globalScale(40)}px "Arial"`,
        color: 'white',
      },
    });
    this.winningText.visible = false;
    this.drawText = this.make.text({
      x: globalScale(250),
      y: globalScale(10),
      text: 'Draw!',
      style: {
        font: `${globalScale(40)}px "Arial"`,
        color: 'white',
      },
    });
    this.drawText.visible = false;
    IFrameEvents.listenForSleep(this);
    IFrameEvents.listenForWake(this);
    IFrameEvents.emitSceneCreated();
    this.beginActivePlayerTurn();
  }

  update(time, delta) {
    this.prepareMoveIndicator();
    this.chips.forEach((c) => c.update(time, delta));
    this.moveIndicator.update();
    this.restartButton.update();
  }

  private beginActivePlayerTurn() {
    this.getActivePlayerController()
      .promptForMove(this.player, this.logic, this.input)
      .then((column) => {
        if (!this.logic.canPlaceChip(column)) {
          this.beginActivePlayerTurn();
          return;
        }
        this.dropChip(column);
      })
      .catch(noop);
  }

  private getActivePlayerController(): PlayerController {
    return this.player === Player.One
      ? this.player1controller
      : this.player2controller;
  }

  private dropChip(column: number) {
    const row = this.logic.placeChip(this.player, column);
    this.chips.push(new Chip(this.player, column, row, this));
    if (this.logic.didWin(this.player)) {
      this.player == Player.One ? this.score1++ : this.score2++;
      this.score1Text.text = this.score1.toString();
      this.score2Text.text = this.score2.toString();
      this.moveIndicator.setVisibility(false);
      this.winningText.text = `Player ${this.player + 1} Wins!`;
      this.winningText.visible = true;
      return;
    }
    if (this.logic.boardIsFull()) {
      this.moveIndicator.setVisibility(false);
      this.drawText.visible = true;
      return;
    }
    this.swapPlayers();
    this.beginActivePlayerTurn();
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
    this.drawText.visible = false;
    this.logic.clear();
    this.chips.forEach((c) => c.destroy());
    this.chips = new Array<Chip>();
    const random = new Math.RandomDataGenerator();
    random.integerInRange(0, 1);
    this.player = random.integerInRange(0, 1);
    this.restartButton.reinitialize(this.player === Player.One);
    this.moveIndicator.setVisibility(true);
    this.player1controller.cancelPromptForMove();
    this.player2controller.cancelPromptForMove();
    this.beginActivePlayerTurn();
  }
}
