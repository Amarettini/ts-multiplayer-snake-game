import { Snake } from "../../entities/Snake";
import { World } from "../../World";
import { StateMachineState } from "../BaseState";

export class PlayState implements StateMachineState {
  private world: World;
  private entities: Snake[] = [];
  constructor(world: World) {
    this.world = world;

    const { width, height } = window.snake.settings;
    this.entities.push(new Snake(Math.floor(width / 2), Math.floor(height / 2)));
    this.entities[0].setVelocity(4);

    window.snake.debugger?.initStateSource(this.entities[0]);
  }
  enter(): void {
    console.log("Enter PlayState!");
  }
  exit(): void {}

  update(dt: number): void {
    // update snake state
    let updateSuccess = this.entities[0].update(dt, this.world); // failed due to self collision in this case

    // check world board collision
    const head = this.entities[0].getHead();
    if (!this.world.resolveCollision(head.x, head.y) || !updateSuccess) {
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
