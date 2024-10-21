import "./style.css";

const APP_NAME = "Painter";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;
app.innerHTML = APP_NAME;

const title = document.createElement("h1");
title.innerHTML = "Painter";

const CANVAS_HEIGHT = 256;
const CANVAS_WIDTH = 256;

const canvas = document.createElement("canvas");
canvas.height = CANVAS_HEIGHT;
canvas.width = CANVAS_WIDTH;

const clearButton = document.createElement("button");
clearButton.innerHTML = "clear";
const undoButton = document.createElement("button");
undoButton.innerHTML = "undo";
const redoButton = document.createElement("button");
redoButton.innerHTML = "redo";
const thinButton = document.createElement("button");
thinButton.innerHTML = "thin";
const thickButton = document.createElement("button");
thickButton.innerHTML = "thick";

app.append(title);
document.body.append(canvas);
app.append(clearButton);
app.append(undoButton);
app.append(redoButton);
app.append(thinButton);
app.append(thickButton);

const THIN_LINE = 2;
const THICK_LINE = 6;
let lineSize = THIN_LINE;

class Line {
  points: [{ x: number; y: number }];
  size: number;

  constructor(x: number, y: number, s: number) {
    this.points = [{ x, y }];
    this.size = s;
  }

  drag(x: number, y: number) {
    this.points.push({ x, y });
  }

  display(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "black";
    ctx.lineWidth = this.size;
    ctx.beginPath();
    const { x, y } = this.points[0];
    ctx.moveTo(x, y);
    for (const { x, y } of this.points) {
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

class Cursor {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  display(ctx: CanvasRenderingContext2D) {
    ctx.font = 16 + "px monospace";
    ctx.fillText("o", this.x - 4, this.y + 4);
  }
}

let currentLine: Line;
let cursor: Cursor;
const lines: Line[] = [];
const redoLines: Line[] = [];

canvas.addEventListener("mousedown", (e) => {
  cursor = new Cursor(e.offsetX, e.offsetY);
  currentLine = new Line(e.offsetX, e.offsetY, lineSize);
  lines.push(currentLine);
  redoLines.splice(0, redoLines.length);
  canvas.dispatchEvent(new Event("drawing-changed"));
});

canvas.addEventListener("mousemove", (e) => {
  cursor = new Cursor(e.offsetX, e.offsetY);
  if (!currentLine) {
    canvas.dispatchEvent(new Event("tool-moved"));
    // return;
  }
  currentLine.drag(e.offsetX, e.offsetY);
  canvas.dispatchEvent(new Event("drawing-changed"));
});

canvas.addEventListener("mouseup", (e) => {
  currentLine = null;
  canvas.dispatchEvent(new Event("drawing-changed"));
});

canvas.addEventListener("drawing-changed", () => {
  redraw();
});

canvas.addEventListener("tool-moved", () => {
  redraw();
});

function redraw() {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const line of lines) {
    line.display(ctx);
  }
  cursor.display(ctx);
}

clearButton.addEventListener("click", () => {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  lines.splice(0, lines.length);
  redoLines.splice(0, redoLines.length);
});

undoButton.addEventListener("click", () => {
  if (lines.length > 0) {
    redoLines.push(lines.pop());
    canvas.dispatchEvent(new Event("drawing-changed"));
  }
});

redoButton.addEventListener("click", () => {
  if (redoLines.length > 0) {
    lines.push(redoLines.pop());
    canvas.dispatchEvent(new Event("drawing-changed"));
  }
});

thinButton.addEventListener("click", () => {
  lineSize = THIN_LINE;
});

thickButton.addEventListener("click", () => {
  lineSize = THICK_LINE;
});
