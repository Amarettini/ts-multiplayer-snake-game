export interface StateMachineState {
  update(dt: number): void;
  render(ctx: CanvasRenderingContext2D, interpolation: number): void;
  enter(): void;
  exit(): void;
  handleInput(event: KeyboardEvent): void;
}

/**
 * Adaper class providing empty method implementations
 */
class BaseState implements StateMachineState {
  protected ctx: CanvasRenderingContext2D;
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }
  update(dt: number): void {}
  render(ctx: CanvasRenderingContext2D, interpolation: number): void {}
  enter(): void {}
  exit(): void {}
  handleInput(event: KeyboardEvent): void {}
}
