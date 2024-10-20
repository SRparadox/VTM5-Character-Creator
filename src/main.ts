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

app.append(title);
app.append(canvas);
app.append(clearButton);
app.append(undoButton);
app.append(redoButton);

class Line {
  points: [{ x: number; y: number }];

  constructor(x: number, y: number) {
    this.points = [{ x, y }];
  }

  drag(x: number, y: number) {
    this.points.push({ x, y });
  }

  display(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.beginPath();
    const { x, y } = this.points[0];
    ctx.moveTo(x, y);
    for (const { x, y } of this.points) {
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

let currentLine: Line;
const lines: Line[] = [];
const redoLines: Line[] = [];

canvas.addEventListener("mousedown", (e) => {
  currentLine = new Line(e.offsetX, e.offsetY);
  lines.push(currentLine);
  redoLines.splice(0, redoLines.length);
  canvas.dispatchEvent(new Event("drawing-changed"));
});

canvas.addEventListener("mousemove", (e) => {
  if (!currentLine) return;
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

function redraw() {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const line of lines) {
    line.display(ctx);
  }
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
