import GameContext from "./GameContext";
import World from "./World";
import { Direction } from "./types";

export default class Snake {
  private ctx: GameContext;
  // entity properties
  private body: number[][]; // position of snake body in grid cells
  private direction: Direction | null = null;
  private speed = 15;

  constructor(ctx: GameContext, x: number, y: number) {
    this.ctx = ctx;
    this.body = [[x, y]];
  }

  public getHead() {
    return {x: this.body[0][0], y: this.body[0][1]}
  }

  public setDirection(direction: Direction) {
    this.direction = direction;
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
    console.log("*Grow snake*");
    const tailBodyX = this.body[this.body.length - 1][0];
    const tailBodyY = this.body[this.body.length - 1][1];
    this.body.push([tailBodyX, tailBodyY]);
  }

  // public isBorderCollision(borderX: number, borderY: number): boolean {
  // }

  public update(world: World) {
    this.move();
    const head = this.getHead();
    if(!world.resolveCollision(head.x, head.y)) {
      this.ctx.endGame();
    };
  }
}