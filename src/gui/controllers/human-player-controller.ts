import { Logic, Player } from '@brajkowski/connect4-web-logic';
import { Input } from 'phaser';
import humanController from '../../assets/human_controller.png';
import { ColumnMapper } from '../util/column-mapper';
import { globalScale } from '../util/scale';
import { PlayerController } from './player-controller';

export class HumanPlayerController implements PlayerController {
  private readonly controllerName = 'You';
  private readonly iconTextureKey = 'humanControllerIcon';
  private readonly pointerUpEvent = 'pointerup';
  private input: Input.InputPlugin;
  private resolve: (value?: number | PromiseLike<number>) => void;
  private reject: (reason?: any) => void;
  private pointerUpListener: Function;
  private hasBeenPrompted = false;

  promptForMove(
    player: Player,
    logic: Logic,
    input: Input.InputPlugin
  ): Promise<number> {
    this.hasBeenPrompted = true;
    return new Promise((resolve, reject) => {
      this.input = input;
      this.resolve = resolve;
      this.reject = reject;
      this.pointerUpListener = (pointer: Input.Pointer) =>
        this.onPointerUp(pointer);
      input.on(this.pointerUpEvent, this.pointerUpListener);
    });
  }

  cancelPromptForMove() {
    if (!this.hasBeenPrompted) return;
    this.hasBeenPrompted = false;
    this.input.removeListener(this.pointerUpEvent, this.pointerUpListener);
    this.reject();
  }

  preload(scene: Phaser.Scene): void {
    scene.load.image(this.iconTextureKey, humanController);
  }

  getIconTextureKey(): string {
    return this.iconTextureKey;
  }

  getControllerName(): string {
    return this.controllerName;
  }

  private onPointerUp(pointer: Input.Pointer) {
    if (pointer.y >= globalScale(64) && pointer.y <= globalScale(492)) {
      const col = ColumnMapper.getColumnFromMouseCoordinate(pointer.x);
      this.input.removeListener(this.pointerUpEvent, this.pointerUpListener);
      this.resolve(col);
    }
  }
}
