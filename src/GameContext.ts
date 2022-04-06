export default class GameContext {
  private ended = false;
  constructor() {}

  public endGame() {
    this.ended = true;
  }

  public isGameEnded() {
    return this.ended;
  }
}