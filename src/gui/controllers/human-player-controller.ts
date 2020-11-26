import { Input } from 'phaser';
import { Player, Logic } from '../../logic/logic';
import { ColumnMapper } from '../util/column-mapper';
import { globalScale } from '../util/scale';
import { PlayerController } from './player-controller';

export class HumanPlayerController implements PlayerController {
  private readonly pointerUpEvent = 'pointerup';
  private input: Input.InputPlugin;
  private resolve: (value?: number | PromiseLike<number>) => void;
  private reject: (reason?: any) => void;
  private pointerUpListener: Function;

  promptForMove(
    player: Player,
    logic: Logic,
    input: Input.InputPlugin
  ): Promise<number> {
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
    this.input.removeListener(this.pointerUpEvent, this.pointerUpListener);
    this.reject();
  }

  private onPointerUp(pointer: Input.Pointer) {
    if (pointer.y >= globalScale(64) && pointer.y <= globalScale(492)) {
      const col = ColumnMapper.getColumnFromMouseCoordinate(pointer.x);
      this.input.removeListener(this.pointerUpEvent, this.pointerUpListener);
      this.resolve(col);
    }
  }
}
