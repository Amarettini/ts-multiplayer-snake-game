import { StateMachineState } from "../BaseState";

export class EndState implements StateMachineState {
  update(dt: number): void {}
  render(ctx: CanvasRenderingContext2D, interpolation: number): void {
    this.endGame(ctx);
  }
  enter(): void {}
  exit(): void {}
  handleInput(event: KeyboardEvent): void {}

  public endGame(ctx: CanvasRenderingContext2D) {
    // this.gameEndedAt = Date.now();
    const { cellSize, width, height } = window.snake.settings;
    requestAnimationFrame(() => {
      ctx.fillStyle = "rgb(255,0,0)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${1.2 * cellSize}px sans-serif`;
      ctx.fillText(
        "Game Over",
        Math.floor((width * cellSize) / 2),
        Math.floor((height * cellSize) / 2)
      );
    });
  }
}
