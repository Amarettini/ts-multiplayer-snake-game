import { StateMachineState } from "./states/BaseState";
import { DefaultState } from "./states/DefaultState";

type StateFactory = () => StateMachineState

export type ConstructorStates<T extends string> = { [StateId in T]: StateFactory};

export class StateMachine<T extends string> {
  public current: StateMachineState;
  private readonly states: ConstructorStates<T> & { default: () => DefaultState };

  /**
   *
   * @param states config object of state properties: `"name": new BaseState();`
   */
  constructor(states: ConstructorStates<T>) {
    this.current = new DefaultState();
    this.states = { default: () => new DefaultState(), ...states };
  }

  public change(state: T) {
    // why cant Private or protected member 'current' be accessed on a type parameter? ts(4105)
    this.current.exit();
    this.current = this.states[state]();
    this.current.enter();
  }

  public update(dt: number) {
    this.current.update(dt);
  }

  public render(ctx: CanvasRenderingContext2D, interpolation: number) {
    this.current.render(ctx, interpolation);
  }

  public handleInput(event: KeyboardEvent) {
    this.current.handleInput(event);
  }
}
