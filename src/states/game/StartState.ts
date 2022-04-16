import { KeyActions } from "../../SnakeGame";
import { StateMachineState } from "../BaseState";

export class StartState implements StateMachineState {
  private keyActions;
  constructor(keyActions: KeyActions) {
    this.keyActions = keyActions;
  }
  enter(): void {}
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
    ctx.font = "20px kongtext";
    ctx.fillText("Snake Multiplayer", (width * cellSize) / 2, (height * cellSize) / 2);
  }
}
