import { PlayerState } from './player-state';

export interface Logic {
  getPlayerState(player: Player): PlayerState;
  placeChip(player: Player, column: number): number;
  didWin(player: Player): boolean;
  boardIsFull(): boolean;
  canPlaceChip(column: number): boolean;
  clear(): void;
  createCopy(): Logic;
}

export enum Player {
  One,
  Two,
}
