import { World } from "./World";
import { GameContext, GameStatus } from "./GameContext";
import { Snake } from "./Snake";
import { Direction } from "./types";
import { Queue } from "./Queue";
import { GameDebugger } from "./GameDebugger";

interface MoveInput {
  key: "W" | "A" | "S" | "D";
  type: "move";
  direction: Direction;
}

interface UIInput {
  key: "ENTER";
  type: "ui";
  action: () => boolean;
}

type GameInputEvent = MoveInput | UIInput;

export class SnakeGame {
  // game options
  private world: World;
  private gCtx: GameContext;
  private readonly inputQueue: Queue<GameInputEvent>;
  private ctx: CanvasRenderingContext2D;
  private cellSize: number;
  private cellsX: number;
  private cellsY: number;
  public width: number;
  public height: number;
  public scale: number;
  private gameStartAt: number | null = null;
  private gameEndedAt: number | null = null;

  // frame calculation
  private startTime = 0;
  private previousTime = window.performance.now();
  private lag = 0.0;
  private framesCounter = 0;
  private avgFPS = 0;

  // entitys
  public snakes: Snake[] = [];

  constructor(canvasEl: HTMLCanvasElement, width: number, height: number, cellSize: number) {
    // set up game display and options
    this.cellSize = cellSize;
    this.cellsX = width;
    this.cellsY = height;
    this.width = width * cellSize;
    this.height = height * cellSize;
    this.keyHandler = this.keyHandler.bind(this);
    this.inputQueue = new Queue<GameInputEvent>();
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
    // Add 30 Snakes for determanistic position problem debugging
    for (let i = 0; i < 30; i++) {
      this.snakes[i] = new Snake(this.gCtx, Math.floor(i), Math.floor(this.cellsY / 4));
      this.snakes[i].setSpeed(i);
    }
    // start animation / hook into main-loop
    this.gCtx.setStatus(GameStatus.RUNNING);

    console.log("Init SnakeGame done");
    setTimeout(
      (self: SnakeGame) => {
        self.gameStartAt = Date.now();
        window.requestAnimationFrame(self.nextFrame);
      },
      1800,
      this
    );
    // window.requestAnimationFrame(this.nextFrame);
  }

  private keyHandler(event: KeyboardEvent) {
    event.preventDefault();
    switch (event.code) {
      case "KeyW":
        this.inputQueue.enqueue({ type: "move", key: "W", direction: Direction.UP });
        break;
      case "KeyA":
        this.inputQueue.enqueue({ type: "move", key: "A", direction: Direction.LEFT });
        break;
      case "KeyS":
        this.inputQueue.enqueue({ type: "move", key: "S", direction: Direction.DOWN });
        break;
      case "KeyD":
        this.inputQueue.enqueue({ type: "move", key: "D", direction: Direction.RIGHT });
        break;
      case "Enter":
        // this.inputQueue.enqueue({type: "ui", key: "ENTER", action: this.holdGame})
        break;
    }
  }

  private fillGridCell(gridX: number, gridY: number) {
    // grid index starts at 0
    this.ctx.fillStyle = "rgb(255,0,0)";
    this.ctx.fillRect(this.cellSize * gridX, this.cellSize * gridY, this.cellSize, this.cellSize);
  }

  private drawSnake(interpolation: number) {
    // draw for each body a rect
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (const snake of this.snakes) {
      let bodyIndex = 0;
      for (let [x, y] of snake.getBody()) {
        this.fillGridCell(x, y);
        // label head of snake with its current velocity for debugging
        if (bodyIndex === 0) {
          this.ctx.fillStyle = "white";
          this.ctx.textAlign = "center";
          this.ctx.textBaseline = "middle";
          this.ctx.font = "10px sans-serif";
          this.ctx.fillText(
            snake.getSpeed().toString(),
            this.cellSize * x + this.cellSize / 2,
            this.cellSize * y + this.cellSize / 2
          );
        }
        bodyIndex++;
      }
    }
  }

  private drawFPS(timeStart: number) {
    this.avgFPS = this.framesCounter / (timeStart / 1000);
    // if(avgFPS > 2000000) {
    //   avgFPS = 0
    // }
    this.ctx.fillStyle = "rgb(255, 255, 0)";
    this.ctx.strokeRect(0, 0, 21, 21);
    this.ctx.font = "10px sans-serif";
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "hanging";
    this.ctx.fillText(this.avgFPS.toFixed(1), 0, 0);
  }

  private nextFrame() {
    const cancelId = requestAnimationFrame(this.nextFrame);

    const currentTime = window.performance.now();
    if (this.startTime === 0) {
      this.startTime = currentTime;
      this.previousTime = currentTime;
    }

    const elapsedTime = currentTime - this.previousTime; // time elapsed between last frame and this, delta frame time
    const totalElapsedTime = currentTime - this.startTime; // time passed in ms since game start
    this.lag += elapsedTime;

    let updatesCycles = 0;
    while (this.lag >= window.snake.settings.msPerUpdate) {
      // console.log("Game update")

      // console.log("Frame", this.framesCounter, "at", new Date().getSeconds(), new Date().getMilliseconds(), "diff", elapsedTime, MS_PER_UPDATE)

      const input = this.inputQueue.dequeue();
      if (input && input.type === "move") {
        for (const snake of this.snakes) {
          snake.setDirection(input.direction);
        }
      }
      for (const snake of this.snakes) {
        snake.update(this.world);
      }
      this.lag -= window.snake.settings.msPerUpdate;
      updatesCycles++;
    }

    if (this.gCtx.getStatus() === GameStatus.ENDED) {
      console.log("Game Ended!");
      cancelAnimationFrame(cancelId);
      this.endGame();
      window.snake.debugger.render({
        totalElapsedTime,
        elapsedTime,
        msPerUpdate: window.snake.settings.msPerUpdate,
        frame: this.framesCounter,
        currentSnakeSpeed: this.snakes[0].getSpeed(),
        frameCalcTime: 0,
        updateCyclesPerFrame: updatesCycles,
        gameStart: this.gameStartAt,
        gameEnd: this.gameEndedAt
      });
      return;
    }

    this.render(this.lag / window.snake.settings.msPerUpdate);

    // debug
    GameDebugger._sleep(10);
    const frameCalcTime = window.performance.now() - currentTime;
    window.snake.debugger.render({
      totalElapsedTime,
      elapsedTime,
      msPerUpdate: window.snake.settings.msPerUpdate,
      frame: this.framesCounter,
      currentSnakeSpeed: this.snakes[0].getSpeed(),
      frameCalcTime,
      updateCyclesPerFrame: updatesCycles,
      gameStart: this.gameStartAt,
      gameEnd: this.gameEndedAt
    });

    ++this.framesCounter;
    this.previousTime = currentTime;
  }

  private render(interp: number) {
    this.drawSnake(interp);
  }

  public freezeGame() {
    this.gCtx.setStatus(GameStatus.FREEZE);
  }

  public endGame() {
    this.gameEndedAt = Date.now();
    requestAnimationFrame(() => {
      this.ctx.fillStyle = "rgb(255,0,0)";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.font = `${1.2 * this.cellSize}px sans-serif`;
      this.ctx.fillText("Game Over", Math.floor(this.width / 2), Math.floor(this.height / 2));
    });
  }
}
