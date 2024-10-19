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

interface point {
  x: number;
  y: number;
}
type line = point[];
let currentLine: line = [];
const lines: line[] = [];
const redoLines: line[] = [];

const ctx = canvas.getContext("2d");

let active = false;

canvas.addEventListener("mousedown", (e) => {
  active = true;

  currentLine = [];
  lines.push(currentLine);
  currentLine.push({ x: e.offsetX, y: e.offsetY });
});

canvas.addEventListener("mousemove", (e) => {
  if (active) {
    currentLine.push({ x: e.offsetX, y: e.offsetY });
    canvas.dispatchEvent(new Event("drawing-changed"));
  }
});

canvas.addEventListener("mouseup", (e) => {
  active = false;
  currentLine = [];
  canvas.dispatchEvent(new Event("drawing-changed"));
});

canvas.addEventListener("drawing-changed", () => {
  redraw();
});

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const line of lines) {
    if (line.length > 1) {
      ctx.beginPath();
      const { x, y } = line[0];
      ctx.moveTo(x, y);
      for (const { x, y } of line) {
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }
}

clearButton.addEventListener("click", () => {
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
