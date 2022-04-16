import { initializeCanvas } from ".";

export interface DebugSnapshotData {
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
    const canvasOptios = initializeCanvas(300, 150, options ? options.canvas : undefined);
    this.canvas = canvasOptios.canvas;
    this.canvasCtx = canvasOptios.ctx;

    this.canvas.style.background = "Blue";
    this.canvas.style.position = "absolute";
    this.canvas.style.top = "10px";
    this.canvas.style.left = "0";

    const bodyEl = document.getElementsByTagName("body").item(0);
    if (bodyEl !== null) {
      bodyEl.prepend(this.canvas);
    } else {
      throw new Error("Failed to attach debugger-canvas to dom!");
    }

    this.hide();

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

  public hide() {
    this.canvas.style.visibility = "hidden";
  }
  public show() {
    this.canvas.style.visibility = "visible";
  }
}

export { GameDebugger };
