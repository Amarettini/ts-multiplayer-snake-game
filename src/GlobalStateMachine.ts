import { DebugSnapshotData, GameDebugger } from "./GameDebugger";
import { ConstructorStates, StateMachine } from "./StateMachine";

/**
 * Top-level state-machine for setting the current state the game is in
 * and a global debugger to log metrics on a overlay canvas.
 */
export class GlobalStateMachine<T extends string> extends StateMachine<T> {
  private _debugger!: GameDebugger;
  private debugSnapshotData: DebugSnapshotData | null;
  private showDebugger: boolean;

  constructor(states: ConstructorStates<T>, gameDebugger: GameDebugger) {
    super(states);
    this.setDebugger(gameDebugger)
    this.debugSnapshotData = null;
    this.showDebugger = false;
  }

  public setDebugger(newDebugger: GameDebugger) {
    console.debug("New debugger assigned!", newDebugger);
    this._debugger = newDebugger;
    window.snake.debugger = newDebugger;
  }

  public getDebugger() {
    return this._debugger;
  }

  public toggleDebuggerVisibility() {
    this.showDebugger = !this.showDebugger;
    if (this.showDebugger) this._debugger.show();
    else this._debugger.hide();
  }

  /**
   * Update data of the debugger, this value is read on every frame update
   * Subseqent calls withing the same frame will overwrite the last snapshot submitted.
   * @param data data to be commited to the next debug render cycle.
   */
  public updateDebugData(data: DebugSnapshotData) {
    this.debugSnapshotData = data;
  }

  public render(ctx: CanvasRenderingContext2D, interpolation: number): void {
    const { width, height, cellSize } = window.snake.settings;
    ctx.clearRect(0, 0, width * cellSize, height * cellSize);
    super.render(ctx, interpolation);

    if (this.debugSnapshotData && this.showDebugger) this._debugger.render(this.debugSnapshotData);
    this.debugSnapshotData = null; // TODO: add option for presistant debug data to be saved / cached
  }
}
