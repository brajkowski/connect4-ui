export interface PlayerState {
  clearAllPositions(): void;
  occupiesPosition(row: number, column: number): boolean;
  occupyPosition(row: number, column: number): void;
}
