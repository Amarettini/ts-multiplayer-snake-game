import { StateMachineState } from "./states/BaseState";
import { DefaultState } from "./states/DefaultState";

export type ConstructorStates<T extends string> = { [StateId in T]: StateMachineState };

export class StateMachine<T extends string> {
  public current: T | "default";
  private readonly states: ConstructorStates<T> & { default: DefaultState };

  /**
   *
   * @param states config object of state properties: `"name": new BaseState();`
   */
  constructor(states: ConstructorStates<T>) {
    this.current = "default";
    this.states = { default: new DefaultState(), ...states };
  }

  public change(state: this["current"]) {
    // why cant Private or protected member 'current' be accessed on a type parameter? ts(4105)
    this.states[this.current].exit();
    this.current = state;
    this.states[this.current].enter();
  }

  public update(dt: number) {
    this.states[this.current].update(dt);
  }

  public render(ctx: CanvasRenderingContext2D, interpolation: number) {
    this.states[this.current].render(ctx, interpolation);
  }

  public handleInput(event: KeyboardEvent) {
    this.states[this.current].handleInput(event);
  }
}
