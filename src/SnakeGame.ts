import { GlobalStateMachine } from "./GlobalStateMachine";
import { StartState } from "./states/game/StartState";
import { PlayState } from "./states/game/PlayState";
import { EndState } from "./states/game/EndState";

import { initializeCanvas } from ".";
import { World } from "./World";
import { GameDebugger } from "./GameDebugger";

let cancelId: number; // todo: refactor for proper error handling

export interface KeyActions {
  [key: string]: undefined | ((event: KeyboardEvent) => void);
}

export class SnakeGame {
  // game options
  public ctx: CanvasRenderingContext2D;
  public gStateMachine;

  // frame calculation
  private startTime = 0;
  private previousTime = window.performance.now();
  private lag = 0.0;
  private framesCounter = 0;

  constructor(canvasEl: HTMLCanvasElement) {
    this.keyHandler = this.keyHandler.bind(this);
    this.nextFrame = this.nextFrame.bind(this);

    const { width, height, cellSize } = window.snake.settings;
    const canvasOptions = initializeCanvas(width * cellSize, height * cellSize, canvasEl);
    this.ctx = canvasOptions.ctx;

    this.gStateMachine = new GlobalStateMachine(
      {
        start: () =>
          new StartState({
            Space: () => {
              this.gStateMachine.change("play");
            },
            Escape: () => {
              this.gStateMachine.toggleDebuggerVisibility();
            }
          }),
        play: () => new PlayState(new World(0, 0, width, height)),
        end: () => new EndState()
      },
      new GameDebugger()
    );
    this.gStateMachine.change("start");

    window.addEventListener("keydown", this.keyHandler);
    setTimeout(
      (self: SnakeGame) => {
        window.requestAnimationFrame(self.nextFrame);
      },
      1800,
      this
    );
  }

  private keyHandler(event: KeyboardEvent) {
    event.preventDefault();
    this.gStateMachine.handleInput(event);
  }

  private nextFrame() {
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
      // console.log("Frame", this.framesCounter, "at", new Date().getSeconds(), new Date().getMilliseconds(), "diff", elapsedTime, MS_PER_UPDATE)
      this.gStateMachine.update(window.snake.settings.msPerUpdate);

      this.lag -= window.snake.settings.msPerUpdate;
      updatesCycles++;
    }

    this.gStateMachine.render(this.ctx, this.lag / window.snake.settings.msPerUpdate);

    // GameDebugger._sleep(10);
    this.gStateMachine.updateDebugData({
      totalElapsedTime,
      elapsedTime,
      msPerUpdate: window.snake.settings.msPerUpdate,
      frame: this.framesCounter,
      frameCalcTime: window.performance.now() - currentTime,
      updateCyclesPerFrame: updatesCycles,
      gameStart: null,
      gameEnd: null
    });

    ++this.framesCounter;
    this.previousTime = currentTime;

    cancelId = requestAnimationFrame(this.nextFrame);
  }
}
