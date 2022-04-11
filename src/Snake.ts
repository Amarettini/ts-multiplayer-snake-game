import {GameContext, GameStatus} from "./GameContext";
import World from "./World";
import { Direction } from "./types";

const iligalDirectionTurns = new Map([
  [Direction.UP, Direction.DOWN],
  [Direction.LEFT, Direction.RIGHT],
  [Direction.DOWN, Direction.UP],
  [Direction.RIGHT, Direction.LEFT]
])

export default class Snake {
  private ctx: GameContext;
  // entity properties
  private body: number[][]; // position of snake body in grid cells
  private direction: Direction | null = null;
  private moveTicker = 0; // calculate movement as accululator, on which frame (-interval) it should move
  private speedTicker = 0; // on which frame the snake's seepd should increase
  private speedGrowRate = 1; // how fast the speed should increase
  private speed = 1; // 1 = 1 cell/second; 2 = 2 cells/second

  // private growTicker = 0;
  // private growRate = 0.3; // 1 = 1 body/second

  constructor(ctx: GameContext, x: number, y: number) {
    this.ctx = ctx;
    this.body = [[x, y]];
  }

  public getHead() {
    return {x: this.body[0][0], y: this.body[0][1]}
  }

  public setDirection(direction: Direction) {
    // return false if update was denied because of forbiden turn
    // prevent U-turns movements
    if(this.direction === iligalDirectionTurns.get(direction)) {
      return false;
    }

    this.direction = direction;
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

    let head: Array<number>;
    if (this.direction === null) {
      // user made no input
      return;
    }
    // create new head from previous head coordinates
    switch (this.direction) {
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

  // public isBorderCollision(borderX: number, borderY: number): boolean {
  // }

  public update(world: World) {
    // if(!this.direction) {
    //   return
    // }
    //this.timePassed += elapsedTime;
    // if(Math.trunc(this.timePassed / 10) % 10)

    // this.timePassed += elapsedTime;
    // if(this.timePassed >= 100) {
    //   this.move(elapsedTime);
    //   this.timePassed = 0;
    // }

    // this.speedTicker += MS_PER_UPDATE * this.speedGrowRate;
    // if(this.speedTicker >= 1000) {
    //   console.log("+speed", this.speed)
    //   this.speed += 1;
    //   this.speedTicker= 0;
    // }


    this.moveTicker += MS_PER_UPDATE * this.speed;
    if(this.moveTicker >= 1000) {
      this.move();
      this.moveTicker = 0;
    }

    const head = this.getHead();
    if(!world.resolveCollision(head.x, head.y)) {
      this.ctx.setStatus(GameStatus.ENDED);
    };
  }
}