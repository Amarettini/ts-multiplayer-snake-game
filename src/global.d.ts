declare function createNewGame(): void;
declare var snake: {
  currentGame: import("./SnakeGame").SnakeGame | null;
  debugger: import("./GameDebugger").GameDebugger;
  settings: {
    msPerUpdate: number;
  };
};
