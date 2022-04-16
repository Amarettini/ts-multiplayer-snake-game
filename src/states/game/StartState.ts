import { KeyActions } from "../../SnakeGame";
import { StateMachineState } from "../BaseState";

export class StartState implements StateMachineState {
  private keyActions;
  constructor(keyActions: KeyActions) {
    this.keyActions = keyActions;
  }
  enter(): void {
    console.log("Enter StartState!");
  }
  exit(): void {}
  handleInput(event: KeyboardEvent): void {
    const action = this.keyActions[event.code];
    if (action) action(event);
  }
  update(dt: number): void {}
  render(ctx: CanvasRenderingContext2D, interpolation: number): void {
    const { width, height, cellSize } = window.snake.settings;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "orange";
    ctx.font = "30px kongtext";
    ctx.fillText("Snake Multiplayer", (width * cellSize) / 2, (height * cellSize) / 2);
    // ctx.textBaseline =
    ctx.fillStyle = "grey";
    ctx.font = "15px kongtext";
    ctx.fillText("Press SPACE to start.", (width * cellSize) / 2, height * cellSize * 0.65);
  }
}
