export enum GameStatus {
  CREATED,
  RUNNING,
  ENDED,
  FREEZE
}

export class GameContext {
  private gameStatus: GameStatus = GameStatus.CREATED;

  public setStatus(status: GameStatus) {
    this.gameStatus = status;
  }

  public getStatus() {
    return this.gameStatus;
  }
}
