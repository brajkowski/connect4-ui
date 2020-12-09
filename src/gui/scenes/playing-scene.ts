import { GameObjects, Math, Scene } from 'phaser';
import { hard } from '../../ai/strategies/rules/difficulty';
import { RuleBasedStrategy } from '../../ai/strategies/rules/rule-based-strategy';
import aiController from '../../assets/ai_controller.png';
import background from '../../assets/background.png';
import board from '../../assets/board.png';
import humanController from '../../assets/human_controller.png';
import { BitboardLogic } from '../../logic/bitboard-logic';
import { Player } from '../../logic/logic';
import { IFrameEvents } from '../../util/iframe-events';
import { noop } from '../../util/no-op';
import { Chip } from '../components/chip';
import { MoveIndicator } from '../components/move-indicator';
import { RestartButton } from '../components/restart-button';
import { AiPlayerController } from '../controllers/ai-player-controller';
import { HumanPlayerController } from '../controllers/human-player-controller';
import { PlayerController } from '../controllers/player-controller';
import { ColumnMapper } from '../util/column-mapper';
import { globalScale } from '../util/scale';

export class PlayingScene extends Scene {
  private moveIndicator: MoveIndicator;
  private restartButton: RestartButton;
  private chips = new Array<Chip>();
  private activePlayer = Player.One;
  private score1 = 0;
  private score2 = 0;
  private score1Text: GameObjects.Text;
  private score2Text: GameObjects.Text;
  private winningText: GameObjects.Text;
  private drawText: GameObjects.Text;
  private logic = new BitboardLogic();
  private player1controller = new HumanPlayerController();
  private player2controller = new AiPlayerController(
    new RuleBasedStrategy(hard, 1500)
  );

  preload() {
    this.load.image('background', background);
    this.load.image('board', board);
    this.load.image('humanController', humanController);
    this.load.image('aiController', aiController);
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
    this.add
      .image(globalScale(70), globalScale(524), 'humanController')
      .setOrigin(0, 0);
    this.add
      .image(globalScale(506), globalScale(524), 'aiController')
      .setOrigin(0, 0);
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
    this.restartButton.update();
  }

  private beginActivePlayerTurn() {
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

  private getActivePlayerController(): PlayerController {
    return this.activePlayer === Player.One
      ? this.player1controller
      : this.player2controller;
  }

  private dropChip(column: number) {
    const row = this.logic.placeChip(this.activePlayer, column);
    this.chips.push(new Chip(this.activePlayer, column, row, this));
    if (this.logic.didWin(this.activePlayer)) {
      this.activePlayer == Player.One ? this.score1++ : this.score2++;
      this.score1Text.text = this.score1.toString();
      this.score2Text.text = this.score2.toString();
      this.moveIndicator.setVisibility(false);
      this.activePlayer == Player.One
        ? (this.winningText.text = 'You Win!')
        : (this.winningText.text = "Aiden 'The AI' Won!");
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
    this.activePlayer === Player.One
      ? (this.activePlayer = Player.Two)
      : (this.activePlayer = Player.One);
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
    this.activePlayer = random.integerInRange(0, 1);
    this.restartButton.reinitialize(this.activePlayer === Player.One);
    this.moveIndicator.setVisibility(true);
    this.player1controller.cancelPromptForMove();
    this.player2controller.cancelPromptForMove();
    this.beginActivePlayerTurn();
  }
}
