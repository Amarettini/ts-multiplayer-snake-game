import { StateMachineState } from "./BaseState";

export class DefaultState implements StateMachineState {
  update(dt: number): void {}
  render(ctx: CanvasRenderingContext2D, interpolation: number): void {}
  enter(): void {}
  exit(): void {}
  handleInput(event: KeyboardEvent): void {}
}
