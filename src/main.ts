import "./style.css";

interface Point {
  x: number;
  y: number;
}

class LineCommand {
  points: Point[];
  thickness: number = 1;

  constructor(points: Point[], thickness: number) {
    this.points = points;
    this.thickness = thickness;
  }

  drag(x: number, y: number) {
    this.points.push({ x, y });
  }

  display(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = this.thickness;
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (const point of this.points) {
      ctx.lineTo(point.x, point.y);
    }
    ctx.stroke();
  }
}

class CursorCommand {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  display(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, lineThickness, 0, Math.PI * 2);
    ctx.fill();
  }
}

const APP_NAME = "Sketchpad Demo";
document.title = APP_NAME;
const app = document.querySelector<HTMLDivElement>("#app")!;

const header = document.createElement("h1");
header.innerHTML = "Sketchpad";
app.append(header);

const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
canvas.style.cursor = "none";
app.append(canvas);

app.append(document.createElement("br"));

const clearButton = document.createElement("button");
clearButton.innerHTML = "clear";
app.append(clearButton);

const redoButton = document.createElement("button");
redoButton.innerHTML = "redo";
app.append(redoButton);

const undoButton = document.createElement("button");
undoButton.innerHTML = "undo";
app.append(undoButton);

app.append(document.createElement("br"));

const thinMarkerButton = document.createElement("button");
thinMarkerButton.innerHTML = "Thin";
app.append(thinMarkerButton);

const thickMarkerButton = document.createElement("button");
thickMarkerButton.innerHTML = "Thick";
app.append(thickMarkerButton);

const ctx = canvas.getContext("2d")!;

let cursor: CursorCommand | null = null;

canvas.addEventListener("mouseout", (_event) => {
  cursor = null;
  canvas.dispatchEvent(new CustomEvent("tool-moved"));
});

canvas.addEventListener("mouseenter", (_event) => {
  cursor = new CursorCommand(_event.offsetX, _event.offsetY);
  canvas.dispatchEvent(new CustomEvent("tool-moved"));
});

const lines: LineCommand[] = [];

let currentLine: LineCommand = new LineCommand([], 1);

canvas.addEventListener("mousedown", (_event) => {
  if (cursor) {
    currentLine = new LineCommand([{ x: cursor.x, y: cursor.y }], lineThickness);
    currentLine.drag(cursor.x, cursor.y);
    lines.push(currentLine);
  }
  canvas.dispatchEvent(new CustomEvent("drawing-changed"));
});

canvas.addEventListener("mousemove", (_event) => {
  if (cursor) {
    cursor.x = _event.offsetX;
    cursor.y = _event.offsetY;

    currentLine.drag(cursor.x, cursor.y);
    canvas.dispatchEvent(new CustomEvent("drawing-changed"));
  }
});

canvas.addEventListener("mouseup", (_event) => {
  currentLine = new LineCommand([], lineThickness);
  canvas.dispatchEvent(new CustomEvent("drawing-changed"));
});

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const line of lines) {
    line.display(ctx);
  }
  if (cursor) {
    cursor.display(ctx);
  }
}

canvas.addEventListener("drawing-changed", (_event) => {
  redraw();
});

canvas.addEventListener("tool-moved", (_event) => {
  redraw();
});

clearButton.addEventListener("click", () => {
  lines.length = 0;
  canvas.dispatchEvent(new CustomEvent("drawing-changed"));
});


const redoStack: LineCommand[] = [];

redoButton.addEventListener("click", () => {
  const line = redoStack.pop();
  if (line) {
    lines.push(line);
    canvas.dispatchEvent(new CustomEvent("drawing-changed"));
  }
});

undoButton.addEventListener("click", () => {
  const line = lines.pop();
  if (line) {
    redoStack.push(line);
    canvas.dispatchEvent(new CustomEvent("drawing-changed"));
  }
});

let lineThickness = 1;

thinMarkerButton.addEventListener("click", () => {
  lineThickness = 1;
  canvas.dispatchEvent(new CustomEvent("marker-changed"));
});

thickMarkerButton.addEventListener("click", () => {
  lineThickness = 5;
  canvas.dispatchEvent(new CustomEvent("marker-changed"));
});

canvas.addEventListener("marker-changed", (_event) => {
  currentLine.thickness = lineThickness;
});