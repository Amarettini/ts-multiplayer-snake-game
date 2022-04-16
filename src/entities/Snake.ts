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
  private moveTicker = 0; // calculate movement as accululator, on which frame (-interval) it should move
  private speed = 1; // 1 = 1 cell/second; 2 = 2 cells/second

  // TODO: refactor world parameter
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

  public getSpeed() {
    return this.speed;
  }

  public setSpeed(speed: number) {
    this.speed = speed;
  }

  private move() {
    // consume direciton queue
    let head: Array<number>;
    if (this.getDirection() === null) {
      // user made no input
      return;
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
    // make sure to keep last Direction in queue
    if (this.directionQueue.size() > 1) {
      this.directionQueue.dequeue();
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

  public update(world: World) {
    if (this.directionQueue.size() >= 1) {
      this.moveTicker += window.snake.settings.msPerUpdate * this.speed;
      // snake moves this.speed * grid-cell/second
      while (this.moveTicker >= 1000) {
        this.move();
        this.moveTicker -= 1000;
      }
      this.moveTicker = this.moveTicker % 1000;
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
          this.getSpeed().toString(),
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
