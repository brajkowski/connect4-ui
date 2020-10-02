import { Logic, Player } from './logic';
import { PlayerState } from './player-state';

export class BitboardLogic implements Logic {
  getPlayerState(player: Player): PlayerState {
    throw new Error('Method not implemented.');
  }
  placeChip(player: Player, column: number): number {
    throw new Error('Method not implemented.');
  }
  didWin(player: Player): boolean {
    throw new Error('Method not implemented.');
  }
  canPlaceChip(column: number): boolean {
    throw new Error('Method not implemented.');
  }
  clear(): void {
    throw new Error('Method not implemented.');
  }
  getGameState(): number {
    throw new Error('Method not implemented.');
  }
  private findHighestIndexRow(column: number): number {
    throw new Error('Method not implemented.');
  }
  private checkVerticalWin(state: number): boolean {
    throw new Error('Method not implemented.');
  }
  private checkHorizontalWin(state: number): boolean {
    throw new Error('Method not implemented.');
  }
  private checkDiagonalWin(state: number): boolean {
    throw new Error('Method not implemented.');
  }
}
