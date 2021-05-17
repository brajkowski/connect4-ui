import { BitboardLogic, Player } from '@brajkowski/connect4-logic';
import { GameObjects, Math, Scene, Types } from 'phaser';
import background from '../../assets/background.png';
import board from '../../assets/board.png';
import { IFrameEvents } from '../../util/iframe-events';
import { noop } from '../../util/no-op';
import { BackButton } from '../components/back-button';
import { Chip } from '../components/chip';
import { MoveIndicator } from '../components/move-indicator';
import { RestartButton } from '../components/restart-button';
import { PlayerController } from '../controllers/player-controller';
import { ColumnMapper } from '../util/column-mapper';
import { globalScale } from '../util/scale';

export class PlayingScene extends Scene {
  protected moveIndicator: MoveIndicator;
  protected restartButton?: RestartButton;
  protected chips = new Array<Chip>();
  protected activePlayer = Player.One;
  protected score1 = 0;
  protected score2 = 0;
  protected score1Text: GameObjects.Text;
  protected score2Text: GameObjects.Text;
  protected winningText: GameObjects.Text;
  protected drawText: GameObjects.Text;
  protected logic = new BitboardLogic();
  protected player1controller: PlayerController;
  protected player2controller: PlayerController;
  protected backButton: BackButton;

  constructor(
    config: Types.Scenes.SettingsConfig,
    player1: PlayerController,
    player2: PlayerController
  ) {
    super(config);
    this.player1controller = player1;
    this.player2controller = player2;
  }

  preload() {
    this.load.image('background', background);
    this.load.image('board', board);
    this.player1controller.preload(this);
    this.player2controller.preload(this);
    MoveIndicator.preload(this);
    RestartButton.preload(this);
    Chip.preload(this);
    BackButton.preload(this);
  }

  createRestartButton() {
    this.restartButton = new RestartButton(
      new Math.Vector2(globalScale(276), globalScale(516)),
      this,
      () => this.restart(this.chooseRandomPlayer)
    );
  }

  create() {
    this.add.image(0, 0, 'background').setOrigin(0, 0);
    this.backButton = new BackButton(
      this,
      globalScale(12.5),
      globalScale(12.5),
      () => this.scene.switch('menu')
    );
    this.add
      .image(globalScale(50), globalScale(64), 'board')
      .setOrigin(0, 0)
      .setDepth(1);
    this.add
      .image(
        globalScale(70),
        globalScale(524),
        this.player1controller.getIconTextureKey()
      )
      .setOrigin(0, 0);
    this.add
      .image(
        globalScale(506),
        globalScale(524),
        this.player2controller.getIconTextureKey()
      )
      .setOrigin(0, 0);
    this.moveIndicator = new MoveIndicator(
      new Math.Vector2(globalScale(0), globalScale(25)),
      this
    );
    this.createRestartButton();
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
      x: globalScale(300),
      y: globalScale(35),
      text: '',
      style: {
        font: `${globalScale(40)}px "Arial"`,
        color: 'white',
      },
    });
    this.winningText.setOrigin(0.5);
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
    this.restartButton?.update();
  }

  protected beginActivePlayerTurn() {
    this.getActivePlayerController()
      .promptForMove(this.activePlayer, this.logic.createCopy(), this.input)
      .then((column) => {
        if (!this.logic.canPlaceChip(column)) {
          this.beginActivePlayerTurn();
          return;
        }
        this.dropChip(column);
      })
      .catch(noop);
  }

  protected getActivePlayerController(): PlayerController {
    return this.activePlayer === Player.One
      ? this.player1controller
      : this.player2controller;
  }

  protected dropChip(column: number) {
    const row = this.logic.placeChip(this.activePlayer, column);
    this.chips.push(new Chip(this.activePlayer, column, row, this));
    if (this.logic.didWin(this.activePlayer)) {
      this.activePlayer == Player.One ? this.score1++ : this.score2++;
      this.score1Text.text = this.score1.toString();
      this.score2Text.text = this.score2.toString();
      this.moveIndicator.setVisibility(false);
      const winnersName =
        this.activePlayer == Player.One
          ? this.player1controller.getControllerName()
          : this.player2controller.getControllerName();
      this.winningText.text = `${winnersName} Won!`;
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

  protected prepareMoveIndicator() {
    const column = ColumnMapper.getColumnFromMouseCoordinate(
      this.input.activePointer.x
    );
    const x = ColumnMapper.getColumnCenterPixelFromIndex(column);
    this.moveIndicator.setXPosition(x);
    this.moveIndicator.valid = this.logic.canPlaceChip(column);
  }

  protected swapPlayers() {
    this.activePlayer === Player.One
      ? (this.activePlayer = Player.Two)
      : (this.activePlayer = Player.One);
    this.restartButton?.triggerAnimation();
  }

  protected restart(chooseStartingPlayer: () => number) {
    this.winningText.visible = false;
    this.drawText.visible = false;
    this.logic.clear();
    this.chips.forEach((c) => c.destroy());
    this.chips = new Array<Chip>();
    this.activePlayer = chooseStartingPlayer();
    this.restartButton?.reinitialize(this.activePlayer === Player.One);
    this.moveIndicator.setVisibility(true);
    this.player1controller.cancelPromptForMove();
    this.player2controller.cancelPromptForMove();
    this.beginActivePlayerTurn();
  }

  protected chooseRandomPlayer(): number {
    const random = new Math.RandomDataGenerator();
    return random.integerInRange(0, 1);
  }
}
