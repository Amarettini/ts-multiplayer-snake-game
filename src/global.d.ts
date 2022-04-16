declare function createNewGame(): void;
declare var snake: {
  currentGame: import("./SnakeGame").SnakeGame | null;
  debugger: import("./GameDebugger").GameDebugger | null;
  settings: {
    msPerUpdate: number;
    width: number; // number of cells x
    height: number; // number of cells y
    cellSize: number; // css pixel size of one cell
  };
};
