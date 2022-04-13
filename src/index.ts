import "./styles/style.css";
import SnakeGame from "./SnakeGame";

window.currentSnakeGame = null;
window.createNewGame = () => {
  window.currentSnakeGame?.endGame();
  const canvasEl = document.getElementById("game") as HTMLCanvasElement;
  window.currentSnakeGame = new SnakeGame(canvasEl, 40, 40, 20);
};
