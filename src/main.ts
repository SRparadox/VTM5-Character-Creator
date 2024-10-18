import "./style.css";

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

/*Code from https://quant-paint.glitch.me/paint0.html*/
const ctx = canvas.getContext("2d")!;

interface Point {
  x: number;
  y: number;
}
interface Line {
  points: Point[];
}

class LineCommand{
  points: Point[];

  constructor(points: Point[]){
    this.points = points;
  }

  drag(x:number,y:number){
    this.points.push({x,y});
  }

  display(ctx: CanvasRenderingContext2D){
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (const point of this.points) {
      ctx.lineTo(point.x, point.y);
    }
    ctx.stroke();
  }
}

const cursor = { active: false, x: 0, y: 0 };

const lines: LineCommand[] = [];

let lastLine: LineCommand = new LineCommand([]);

canvas.addEventListener("mousedown", (event) => {
  cursor.active = true;
  cursor.x = event.offsetX;
  cursor.y = event.offsetY;

  lastLine = new LineCommand([{ x: cursor.x, y: cursor.y }]);
  lines.push(lastLine);

  canvas.dispatchEvent(new CustomEvent("drawing-changed"));
});

canvas.addEventListener("mousemove", (event) => {
  if (cursor.active) {
    cursor.x = event.offsetX;
    cursor.y = event.offsetY;

    lastLine.drag(cursor.x,cursor.y );
    canvas.dispatchEvent(new CustomEvent("drawing-changed"));
  }
});

canvas.addEventListener("mouseup", (_event) => {
  cursor.active = false;
  canvas.dispatchEvent(new CustomEvent("drawing-changed"));
});

canvas.addEventListener("drawing-changed", (_event) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const line of lines) {
    line.display(ctx);
  }
});

const clearButton = document.createElement("button");
clearButton.innerHTML = "clear";
app.append(clearButton);

clearButton.addEventListener("click", () => {
  lines.length = 0;
  canvas.dispatchEvent(new CustomEvent("drawing-changed"));
});

const redoStack: LineCommand[] = [];

const redoButton = document.createElement("button");
redoButton.innerHTML = "redo";
app.append(redoButton);

const undoButton = document.createElement("button");
undoButton.innerHTML = "undo";
app.append(undoButton);

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