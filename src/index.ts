import "./styles/style.css";
import { SnakeGame } from "./SnakeGame";
import { GameDebugger } from "./GameDebugger";

window.snake = {
  currentGame: null,
  debugger: new GameDebugger(),
  settings: {
    msPerUpdate: 34
  }
};

window.createNewGame = () => {
  window.snake.currentGame?.endGame();
  const canvasEl = document.getElementById("game") as HTMLCanvasElement;
  window.snake.currentGame = new SnakeGame(canvasEl, 40, 40, 20);
};
