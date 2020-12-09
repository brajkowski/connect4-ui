import { Input, Scene } from 'phaser';
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

  /**
   * Preload any required assets for the scene such as the controller icon.
   * @param scene Scene that assets should be loaded to.
   */
  preload(scene: Scene): void;

  /**
   * Returns the texture key that the scene can use to render the icon.
   */
  getIconTextureKey(): string;

  /**
   * Returns the name of the entity that is responsible for the controller (ex: a username).
   */
  getControllerName(): string;
}
