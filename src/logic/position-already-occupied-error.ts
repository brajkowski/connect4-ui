export class PositionAlreadyOccupiedError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = PositionAlreadyOccupiedError.name;
  }
}
