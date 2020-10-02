export interface PlayerState {
  clearAllPositions(): void;
  occupiesPosition(x: number, y: number): boolean;
  occupyPosition(x: number, y: number): void;
}
