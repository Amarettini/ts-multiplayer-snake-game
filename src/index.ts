import "./styles/style.css";
import { SnakeGame } from "./SnakeGame";

window.snake = {
  currentGame: null,
  debugger: null,
  settings: {
    msPerUpdate: 6,
    width: 40,
    height: 40,
    cellSize: 20
  }
};

window.createNewGame = () => {
  // window.snake.currentGame?.endGame();
  const canvasEl = document.getElementById("game") as HTMLCanvasElement;
  window.snake.currentGame = new SnakeGame(canvasEl);
};

/**
 * Initializes canvas element to match display resolution.
 * @param virtualWidth Width of canvas on display, measured in css pixels.
 * @param virtualHeight Height of canvas on display, measured in css pixels.
 * @param canvas Canvas element to initialize, new element will be created if not provided.
 * @todo return a resize-handler
 */
export function initializeCanvas(
  virtualWidth: number,
  virtualHeight: number,
  canvas?: HTMLCanvasElement
) {
  if (!canvas) {
    canvas = document.createElement("canvas");
  }
  const ctx = canvas.getContext("2d")!;

  // window.devicePixelRatio = 8; // 6 is working on ThinkPad T15, not sure about differance at 8
  // window.devicePixelRatio is read only works on initial load, but browser does not save the value
  const scale = 2; // window.devicePixelRatio;

  // display size in css pixel
  canvas.style.width = virtualWidth + "px"; // css pixel size
  canvas.style.height = virtualHeight + "px"; // css pixel size

  // resolution of canvas
  const canvasWidth = Math.floor(virtualWidth * scale);
  const canvasHeight = Math.floor(virtualHeight * scale);
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // scale coordiante system to match CSS pixels so we dont have to worry about the canvas resolution when drawing.
  ctx.scale(scale, scale);

  return { canvas, ctx, virtualWidth, virtualHeight, canvasWidth, canvasHeight, scale };
}
