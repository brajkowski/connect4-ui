import { PlayerState } from './player-state';

export class BitboardPlayerState implements PlayerState {
  constructor(state?: number) {}

  clearAllPositions(): void {
    throw new Error('Method not implemented.');
  }

  occupiesPosition(x: number, y: number): boolean {
    throw new Error('Method not implemented.');
  }

  occupyPosition(x: number, y: number): void {
    throw new Error('Method not implemented.');
  }

  getRawState(): number {
    throw new Error('Method not implemented.');
  }
}
