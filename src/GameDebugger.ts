interface DebugSnapshotData {
  msPerUpdate: number;
  totalElapsedTime: number;
  elapsedTime: number;
  frame: number;
  currentSnakeSpeed: number;
  frameCalcTime: number;
  updateCyclesPerFrame: number;
  gameStart: number | null;
  gameEnd: number | null;
}

interface GameDebuggerOptions {
  canvas: HTMLCanvasElement;
}

class GameDebugger {
  private canvas: HTMLCanvasElement;
  private canvasCtx: CanvasRenderingContext2D;

  private lastFrameLoggedAt = Date.now();
  private elDebug: HTMLElement;
  private elDebugLogger: HTMLElement;

  constructor(options?: GameDebuggerOptions) {
    if (options) {
      this.canvas = options.canvas;
    } else {
      // Create new canvas to render statistics, debug data
      this.canvas = document.createElement("canvas");
      this.canvas.style.background = "Blue";
      this.canvas.style.position = "absolute";
      this.canvas.style.top = "10px";
      this.canvas.style.left = "0";
      const bodyEl = document.getElementsByTagName("body").item(0);
      if (bodyEl !== null) {
        bodyEl.prepend(this.canvas);
      }
    }
    this.canvasCtx = this.canvas.getContext("2d")!;

    // Set size of canvas, take device pixel ratio into account
    const canvasWidth = 300; // css pixel size
    const canvasHeight = 150; // css pixel size

    // window.devicePixelRatio = 8; // 6 is working on ThinkPad T15, not sure about differance at 8
    // window.devicePixelRatio is read only works on initial load, but browser does not save the value
    const scale = 2; // window.devicePixelRatio;

    // display size in css pixel
    this.canvas.style.width = canvasWidth + "px";
    this.canvas.style.height = canvasHeight + "px";

    // resolution of canvas
    this.canvas.width = Math.floor(canvasWidth * scale);
    this.canvas.height = Math.floor(canvasHeight * scale);

    // scale coordiante system to match CSS pixels so we dont have to worry about the canvas resolution when drawing.
    this.canvasCtx.scale(scale, scale);

    // Elements for rendering statistics and debug data to DOM
    this.elDebug = document.getElementById("debug")!;
    this.elDebugLogger = document.getElementById("debugLogger")!;
  }

  static formatTime(date: Date) {
    // Format date to hh:mm:ss.fff
    return (
      date.toLocaleTimeString() + "." + date.getMilliseconds().toString().padEnd(3, "0").slice(0, 3)
    );
  }

  static _sleep(ms: number) {
    // ONLY use in developement
    var now = new Date().getTime();
    while (new Date().getTime() < now + ms) {
      /* Do nothing */
    }
  }

  private createFrameLog(fame: number, frameCalcTime: number) {
    // Create a line for each frame, <time> - <frameNumber> Δ<deltaTimeOfFrame> CalcIn: <timetakenToCalculateFrame>
    const date = new Date();
    const currentTime = date.valueOf();
    const line = `${GameDebugger.formatTime(date)} - Frame<${fame.toString().padStart(4, " ")}> Δ${
      currentTime - this.lastFrameLoggedAt
    }ms CalcIn: ${frameCalcTime.toFixed(4).padStart(8, "0")}ms\n`;
    this.lastFrameLoggedAt = currentTime;
    return line;
  }

  private drawFPS(frames: number, totalElapsedTime: number) {
    // fps calculation at 32 FPS (31.25 ms/Frame)
    // 0 / ( 0 / 1000 ) = undef.
    // 1 / ( 31.25 / 1000 ) = 32 FPS
    // 2 / ( 62.5 / 1000 ) = 32 FPS
    // 3 / ( 93.75 / 1000 ) = 32 FPS
    const averageFPS = frames / (totalElapsedTime / 1000);
    this.canvasCtx.fillStyle = "darkorange";
    this.canvasCtx.font = "14px monospace";
    this.canvasCtx.textAlign = "right";
    // use canvas.clientWidth to get the CSS pixel width of the canvas
    this.canvasCtx.fillText(`${averageFPS.toFixed(1)} FPS`, this.canvas.clientWidth, 10);
  }

  private renderMetricsToCanvas(data: DebugSnapshotData, frameLogLine: string, debugText: string) {
    const fontSize = 10;
    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvasCtx.font = `${fontSize}px monospace`;
    this.canvasCtx.textAlign = "left";
    this.canvasCtx.fillStyle = "Lime";
    const lines = debugText.split("\n");
    for (let i = 0; i < lines.length; i++) {
      this.canvasCtx.fillText(lines[i], 0, fontSize * i + fontSize);
    }

    this.drawFPS(data.frame, data.totalElapsedTime);
  }

  private renderMetricsToDOM(data: DebugSnapshotData, frameLog: string, debugText: string) {
    // update the debug metrics shown on the dom
    this.elDebug.innerText = debugText;
    this.elDebugLogger.prepend(frameLog);
  }

  public render(data: DebugSnapshotData) {
    const frameLogLine = this.createFrameLog(data.frame, data.frameCalcTime);
    const debugText =
      "MS per update:          " +
      data.msPerUpdate +
      "\n" +
      "Total elapsed time:     " +
      Math.trunc(data.totalElapsedTime).toString().padStart(6, "0") +
      " ms\n" +
      "Start: " +
      data.gameStart +
      "\n" +
      "End:   " +
      data.gameEnd +
      "\n" +
      "\n" +
      "Snake:\n" +
      "  Current speed:        " +
      data.currentSnakeSpeed +
      "\n" +
      "\n" +
      "Per Frame:\n" +
      "  Frame:                " +
      data.frame +
      "\n" +
      "  Update cycles:        " +
      data.updateCyclesPerFrame +
      " " +
      "1/Frame" +
      "\n" +
      "  Calculated in:        " +
      data.frameCalcTime.toFixed(3).padStart(7, " ") +
      " ms\n" +
      "  Elapsed time:         " +
      data.elapsedTime.toPrecision(5).padStart(7, " ") +
      " ms\n" +
      "\n" +
      frameLogLine;

    // this.renderMetricsToDOM(data, frameLogLine, debugText);
    this.renderMetricsToCanvas(data, frameLogLine, debugText);
  }
}

export { GameDebugger };
