import { StateMachineState } from "../BaseState";

export class EndState implements StateMachineState {
  private countdownTicker: number;
  private countdownRate: number;
  private countdown: number;
  constructor() {
    this.countdownRate = 1; // accumulator multiplier
    this.countdownTicker = 0; // delta time accumulator
    this.countdown = 4; // 3 -> 0 seconds
  }
  update(dt: number): void {
    this.countdownTicker += dt * this.countdownRate;
    if (this.countdownTicker >= 1000) {
      console.log(this.countdown);
      --this.countdown;

      if (this.countdown === 0) {
        window.snake.currentGame?.gStateMachine.change("start");
      }
      // this.countdown -= 1000;
      this.countdownTicker = this.countdownTicker % 1000;
    }
  }
  render(ctx: CanvasRenderingContext2D, interpolation: number): void {
    const { cellSize, width, height } = window.snake.settings;

    ctx.fillStyle = "rgba(255,0,0,0.9)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "36px kongtext";
    ctx.fillText(
      "Game Over",
      Math.floor((width * cellSize) / 2),
      Math.floor((height * cellSize) / 2)
    );

    ctx.font = "20px kongtext";
    ctx.fillText(`Next game in ${this.countdown}`, width * cellSize / 2, height * cellSize * 0.6);
  }
  enter(): void {
    console.log("Enter EndState!");
  }
  exit(): void {}
  handleInput(event: KeyboardEvent): void {}
}
