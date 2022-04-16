import { World } from "../World";
import { Queue } from "../Queue";

export enum Direction {
  UP,
  LEFT,
  DOWN,
  RIGHT
}

const iligalDirectionTurns = new Map([
  [Direction.UP, Direction.DOWN],
  [Direction.LEFT, Direction.RIGHT],
  [Direction.DOWN, Direction.UP],
  [Direction.RIGHT, Direction.LEFT]
]);

export class Snake {
  private body: number[][]; // position of snake body in grid cells
  private readonly directionQueue = new Queue<Direction>();

  private growTicker = 0; // when to grow, accumulates delta frame time
  private growRate = 1; // (acc multiplier) how fast goal is reached, grow-increase/second

  // Idea: add acceleration on 'harder levers'
  private accelerationTicker = 0; // when to increase acceleration, accumulates delta frame time
  private acceleration = 0.125;       // increase speed by one every 8 seconds

  // linear acceleration by increasing velocity on a set intervall, with the acceleration var we could
  // multiply by a fraction to decrease the delta intervall
  private velocityTicker = 0; // when to increase velocity, accumulates delta frame time
  private velocity = 0; // velocity of snake, cells/second, 1 -> 1 cell per second, 2 -> 2 cells per second

  constructor(x: number, y: number) {
    this.body = [[x, y]];
  }

  public getHead() {
    return { x: this.body[0][0], y: this.body[0][1] };
  }

  public getDirection() {
    const direction = this.directionQueue.peek();
    return direction === undefined ? null : direction;
  }

  public setDirection(direction: Direction) {
    // return false if update was denied because of forbiden turn
    // prevent U-turns movements
    if (this.getDirection() === iligalDirectionTurns.get(direction)) {
      return false;
    }

    this.directionQueue.enqueue(direction);
    return true;
  }

  public getBody() {
    return this.body;
  }

  public getVelocity() {
    return this.velocity;
  }

  public setVelocity(velocity: number) {
    this.velocity = velocity;
  }

  private move() {
    console.log("move", this.getDirection());
    // consume direciton queue
    let head: Array<number>;
    if (this.getDirection() === null) {
      // user made no input
      return;
    }
    // make sure to keep last Direction in queue
    if (this.directionQueue.size() > 1) {
      this.directionQueue.dequeue();
    }
    // create new head from previous head position
    switch (this.getDirection()) {
      case Direction.UP:
        head = [this.body[0][0], this.body[0][1] - 1];
        break;
      case Direction.DOWN:
        head = [this.body[0][0], this.body[0][1] + 1];
        break;
      case Direction.RIGHT:
        head = [this.body[0][0] + 1, this.body[0][1]];
        break;
      case Direction.LEFT:
        head = [this.body[0][0] - 1, this.body[0][1]];
        break;
      default:
        throw new Error("Invalid Direction peeked from DirectionQueue.");
    }
    // insert new head and remove tail if long enought
    this.body.unshift(head);

    // grow the snake to the length of 3
    if (this.body.length <= 3) {
      return;
    }

    // keep the snakes length be removing the tail
    this.body.pop();
  }

  private grow() {
    console.log("*Grow snake*", new Date().toISOString());
    const tailBodyX = this.body[this.body.length - 1][0];
    const tailBodyY = this.body[this.body.length - 1][1];
    this.body.push([tailBodyX, tailBodyY]);
  }

  public update(dt: number, world: World) {
    if (this.directionQueue.size() >= 1) {
      this.velocityTicker += dt * this.velocity;
      while (this.velocityTicker >= 1000) {
        this.move();
        this.velocityTicker -= 1000;
      }
      // this line should be redundant
      this.velocityTicker = this.velocityTicker % 1000;

      this.growTicker += dt * this.growRate;
      while (this.growTicker >= 1000) {
        this.grow();
        this.growTicker -= 1000;
      }

      // when to increase the velocity
      this.accelerationTicker += dt * this.acceleration;
      while (this.accelerationTicker >= 1000) {
        this.velocity += 1;
        this.accelerationTicker -= 1000;
      }
    }
  }

  private fillGridCell(ctx: CanvasRenderingContext2D, gridX: number, gridY: number) {
    const { cellSize } = window.snake.settings;
    // grid index starts at 0
    ctx.fillStyle = "rgb(255,0,0)";
    ctx.fillRect(cellSize * gridX, cellSize * gridY, cellSize, cellSize);
  }

  render(ctx: CanvasRenderingContext2D, interpolation?: number) {
    // draw for each body a rect
    const { cellSize } = window.snake.settings;
    let bodyIndex = 0;
    for (let [x, y] of this.getBody()) {
      this.fillGridCell(ctx, x, y);
      // label head of snake with its current velocity for debugging
      if (bodyIndex === 0) {
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "10px sans-serif";
        ctx.fillText(
          this.getVelocity().toString(),
          cellSize * x + cellSize / 2,
          cellSize * y + cellSize / 2
        );
      }
      bodyIndex++;
    }
  }

  handleInput(input: KeyboardEvent) {
    // push input to direction queue
    switch (input.code) {
      case "KeyW":
        this.directionQueue.enqueue(Direction.UP);
        break;
      case "KeyA":
        this.directionQueue.enqueue(Direction.LEFT);
        break;
      case "KeyS":
        this.directionQueue.enqueue(Direction.DOWN);
        break;
      case "KeyD":
        this.directionQueue.enqueue(Direction.RIGHT);
        break;
    }
  }
}
