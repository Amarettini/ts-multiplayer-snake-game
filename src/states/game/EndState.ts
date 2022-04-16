import { StateMachineState } from "../BaseState";

export class EndState implements StateMachineState {
  private cooldownTicker: number;
  private cooldownRate: number;
  private cooldown: number;
  constructor() {
    this.cooldownRate = 1;
    this.cooldownTicker = 0;
    this.cooldown = 0;
  }
  update(dt: number): void {
    this.cooldownTicker += dt * this.cooldownRate;
    if (this.cooldownTicker >= 1000) {
      console.log(this.cooldown);

      if (++this.cooldown === 3) {
        window.snake.currentGame?.gStateMachine.change("start");
      }
      this.cooldownTicker = this.cooldownTicker % 1000;
    }
  }
  render(ctx: CanvasRenderingContext2D, interpolation: number): void {
    this.endGame(ctx);
  }
  enter(): void {
    console.log("Enter EndState!");
  }
  exit(): void {}
  handleInput(event: KeyboardEvent): void {}

  public endGame(ctx: CanvasRenderingContext2D) {
    // this.gameEndedAt = Date.now();
    const { cellSize, width, height } = window.snake.settings;
    ctx.fillStyle = "rgb(255,0,0)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${1.2 * cellSize}px sans-serif`;
    ctx.fillText(
      "Game Over",
      Math.floor((width * cellSize) / 2),
      Math.floor((height * cellSize) / 2)
    );
  }
}
