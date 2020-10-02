export class PositionAlreadyOccupiedError extends Error {
  constructor(message?: string) {
    super(message);
  }
}
