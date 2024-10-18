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

const APP_NAME = "Sketchpad Demo";
document.title = APP_NAME;
const app = document.querySelector<HTMLDivElement>("#app")!;

const header = document.createElement("h1");
header.innerHTML = "Sketchpad";
app.append(header);

const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
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

const cursor = { active: false, x: 0, y: 0 };

const lines: LineCommand[] = [];

let currentLine: LineCommand = new LineCommand([], 1);

canvas.addEventListener("mousedown", (event) => {
  cursor.active = true;
  cursor.x = event.offsetX;
  cursor.y = event.offsetY;

  !currentLine
    ? new LineCommand([{ x: cursor.x, y: cursor.y }], lineThickness)
    : currentLine.drag(cursor.x, cursor.y);
  lines.push(currentLine);

  canvas.dispatchEvent(new CustomEvent("drawing-changed"));
});

canvas.addEventListener("mousemove", (event) => {
  if (cursor.active) {
    cursor.x = event.offsetX;
    cursor.y = event.offsetY;

    currentLine.drag(cursor.x, cursor.y);
    canvas.dispatchEvent(new CustomEvent("drawing-changed"));
  }
});

canvas.addEventListener("mouseup", (_event) => {
  currentLine = new LineCommand([], lineThickness);
  cursor.active = false;
  canvas.dispatchEvent(new CustomEvent("drawing-changed"));
});

function redraw() {
  for (const line of lines) {
    line.display(ctx);
  }
}

canvas.addEventListener("drawing-changed", (_event) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
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