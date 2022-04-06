import World from "./World";
import GameContext from "./GameContext";
import Snake from "./Snake";
import { Direction } from "./types";

const MS_PER_UPDATE = 150;

export default class SnakeGame {
  // game options
  private world: World;
  private gCtx: GameContext;
  private ctx: CanvasRenderingContext2D;
  private cellSize: number;
  private cellsX: number;
  private cellsY: number;
  public width: number;
  public height: number;
  public scale: number;

  // frame calculation
  private elapsedStartTime = 0;
  private previousTime = window.performance.now();
  private lag = 0.0;
  private acc = 0;
  private countedFrames = 0;
  private avgFPS = 0;

  // entitys
  public snake: Snake;

  constructor(
    canvasEl: HTMLCanvasElement,
    width: number,
    height: number,
    cellSize: number
  ) {
    // set up game display and options
    this.cellSize = cellSize;
    this.cellsX = width;
    this.cellsY = height;
    this.width = width * cellSize;
    this.height = height * cellSize;
    this.keyHandler = this.keyHandler.bind(this);
    this.nextFrame = this.nextFrame.bind(this);

    window.addEventListener("keydown", this.keyHandler);

    window.devicePixelRatio = 2;
    this.scale = window.devicePixelRatio;
    canvasEl.style.width = this.width + "px";
    canvasEl.style.height = this.height + "px";
    canvasEl.width = Math.floor(this.width * this.scale);
    canvasEl.height = Math.floor(this.height * this.scale);

    const cCtx = canvasEl.getContext("2d");
    if (!cCtx) {
      throw new Error("No 2d context receved!");
    }
    this.ctx = cCtx;
    this.ctx.scale(this.scale, this.scale);

    this.gCtx = new GameContext();
    this.world = new World(0, 0, this.cellsX, this.cellsY);
    this.snake = new Snake(
      this.gCtx,
      Math.floor(this.cellsX / 2),
      Math.floor(this.cellsY / 2)
    );

    // start animation / hook into main-loop
    this.drawSnake();
    this.nextFrame(0);
  }

  private keyHandler(event: KeyboardEvent) {
    event.preventDefault();
    switch (event.code) {
      case "KeyW":
        this.snake.setDirection(Direction.UP);
        break;
      case "KeyA":
        this.snake.setDirection(Direction.LEFT);
        break;
      case "KeyS":
        this.snake.setDirection(Direction.DOWN);
        break;
      case "KeyD":
        this.snake.setDirection(Direction.RIGHT);
        break;
    }
  }

  private fillGridCell(gridX: number, gridY: number) {
    // grid index starts at 0
    this.ctx.fillStyle = "rgb(255,0,0)";
    this.ctx.fillRect(
      this.cellSize * gridX,
      this.cellSize * gridY,
      this.cellSize,
      this.cellSize
    );
  }

  private drawSnake() {
    // draw for each body a rect
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (let [x, y] of this.snake.getBody()) {
      this.fillGridCell(x, y);
    }
  }

  private drawFPS(timeStart: number) {
    this.avgFPS = this.countedFrames / (timeStart / 1000);
    // if(avgFPS > 2000000) {
    //   avgFPS = 0
    // }
    this.ctx.fillStyle = "rgb(255, 255, 0)";
    this.ctx.strokeRect(0, 0, 21, 21);
    this.ctx.font = "10px sans-serif";
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "hanging";
    this.ctx.fillText(this.avgFPS.toFixed(0), 0, 0);
  }

  private nextFrame(ts: number) {
    const cid = requestAnimationFrame(this.nextFrame);

    const t = window.performance.now();
    if(this.elapsedStartTime === 0 ) {
      this.elapsedStartTime = t;
    }

    const currentTime = window.performance.now();
    const elapsedTime = currentTime - this.previousTime;
    this.lag += elapsedTime;



    while (this.lag >= MS_PER_UPDATE) {
      this.snake.update(this.world);
      this.lag -= MS_PER_UPDATE;
    }

    if (this.gCtx.isGameEnded()) {
      console.log("Game Ended!");
      cancelAnimationFrame(cid);
      this.endGame();
      return;
    }

    this.render(t - this.elapsedStartTime);

    /// if (this.acc >= 400) {
    // if (this.countedFrames % this.snake.getSpeed() === 0) {
      // if (this.snake.isBorderCollision(this.cellsX, this.cellsY)) {
      //   this.endGame();
      // }
      // this.drawSnake();
      // this.drawFPS(timeElapsed);
      /// drawFPS(ts)
      // this.acc = 0;
    // }

    /// this.previousTs = ts;

    ++this.countedFrames;
    this.previousTime = currentTime;
  }

  private render(timeStart: number) {
    this.drawSnake();
    this.drawFPS(timeStart);
  }

  public endGame() {
    requestAnimationFrame(() => {
      this.ctx.fillStyle = "rgb(255,0,0)";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.font = `${1.2 * this.cellSize}px sans-serif`;
      this.ctx.fillText(
        "Game Over",
        Math.floor(this.width / 2),
        Math.floor(this.height / 2)
      );
    });
  }
}