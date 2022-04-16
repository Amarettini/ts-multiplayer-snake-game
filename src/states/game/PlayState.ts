import { Snake } from "../../entities/Snake";
import { World } from "../../World";
import { StateMachineState } from "../BaseState";

export class PlayState implements StateMachineState {
  private world: World;
  private entities: Snake[] = [];
  constructor(world: World) {
    this.world = world;

    this.entities.push(new Snake(0, 0));
    this.entities[0].setSpeed(5);
  }
  enter(): void {
    console.log("Enter PlayState!");
  }
  exit(): void {}

  update(dt: number): void {
    // update snake state
    this.entities[0].update(this.world);

    // check world board collision
    const head = this.entities[0].getHead();
    if (!this.world.resolveCollision(head.x, head.y)) {
      window.snake.currentGame?.gStateMachine.change("end");
    }
  }

  handleInput(event: KeyboardEvent): void {
    console.log("Input from PlayState");
    for (const entity of this.entities) {
      entity.handleInput(event);
    }
  }

  render(ctx: CanvasRenderingContext2D, interpolation: number): void {
    // render world
    for (const entity of this.entities) {
      // render entities
      entity.render(ctx, interpolation);
    }
  }
}
