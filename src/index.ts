import "./styles/style.css";
import SnakeGame from "./SnakeGame";
import { GameDebugger} from "./GameDebugger";

declare global {
  function createNewGame(): void;
  var currentSnakeGame: SnakeGame | null;
  var MS_PER_UPDATE: number;
  var GAME_DEBUGGER: GameDebugger;
}

window.currentSnakeGame = null;
window.createNewGame = () => {
  currentSnakeGame?.endGame();
  const canvasEl = document.getElementById("game") as HTMLCanvasElement;
  currentSnakeGame = new SnakeGame(canvasEl, 40, 40, 20);
};
