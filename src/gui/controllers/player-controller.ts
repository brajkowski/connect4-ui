import { Input } from 'phaser';
import { Logic, Player } from '../../logic/logic';

export interface PlayerController {
  /**
   * Prompts the player to choose a column to play.
   * @param player The player being prompted -- can be used in logic queries.
   * @param logic The current game state.
   * It is intended to only be used for logic queries, not state manipulation.
   * @param input The scene input plugin that can be used to listen for user input.
   */
  promptForMove(
    player: Player,
    logic: Logic,
    input: Input.InputPlugin
  ): Promise<number>;

  /**
   * Perform any cleanup required to cancel the prompt. This method should also
   * reject the promise created in the promptForMove() method.
   */
  cancelPromptForMove(): void;
}
