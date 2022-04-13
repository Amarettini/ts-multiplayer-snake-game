
declare interface Window {
    createNewGame(): void;
    currentSnakeGame: import("./SnakeGame").default | null;
    MS_PER_UPDATE: number;
    GAME_DEBUGGER: import("./GameDebugger").GameDebugger;
  }