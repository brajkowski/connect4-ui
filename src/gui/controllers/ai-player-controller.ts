import { AiStrategy } from '../../ai/strategies/ai-strategy';
import { Logic, Player } from '../../logic/logic';
import { PlayerController } from './player-controller';

export class AiPlayerController implements PlayerController {
  private reject: (reason?: any) => void;
  private hasBeenPrompted = false;
  private strategy: AiStrategy;

  constructor(strategy: AiStrategy) {
    this.strategy = strategy;
  }

  promptForMove(
    player: Player,
    logic: Logic,
    input: Phaser.Input.InputPlugin
  ): Promise<number> {
    this.hasBeenPrompted = true;
    return new Promise((resolve, reject) => {
      this.reject = reject;
      this.strategy.getOptimalMove(player, logic).then(resolve);
    });
  }

  cancelPromptForMove(): void {
    if (!this.hasBeenPrompted) return;
    this.hasBeenPrompted = false;
    this.reject();
  }
}
