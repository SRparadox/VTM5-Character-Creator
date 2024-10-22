import "./style.css";

interface Point {
  x: number;
  y: number;
}

interface DrawCommand {
  display(ctx: CanvasRenderingContext2D): void;
  drag(x: number, y: number): void;
}

class LineCommand implements DrawCommand {
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

class StickerCommand implements DrawCommand {
  x: number;
  y: number;
  sticker: string;

  constructor(x: number, y: number, sticker: string) {
    this.x = x;
    this.y = y;
    this.sticker = sticker;
  }

  drag(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  display(ctx: CanvasRenderingContext2D) {
    ctx.font = "32px monospace";
    ctx.fillText(this.sticker, this.x - 16, this.y + 16);
  }
}

class CursorCommand {
  x: number;
  y: number;
  active: boolean;

  constructor(x: number, y: number, active: boolean) {
    this.x = x;
    this.y = y;
    this.active = active;
  }

  display(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(lineThickness / 2, 1), 0, Math.PI * 2);
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

const stickers = [`🗿`, `❤️`, `👹`];
const DRAW_MODE_LINE = 12;
const DRAW_MODE_STICKER = 13;

for (const sticker of stickers) {
  const stickerButton = document.createElement("button");
  stickerButton.innerHTML = sticker;
  stickerButton.addEventListener("click", (_event) => {
    canvas.dispatchEvent(new CustomEvent("tool-moved"));
    canvas.dispatchEvent(new CustomEvent("sticker-mode", { detail: sticker }));
  });
  app.append(stickerButton);
}

let stickerCursor: StickerCommand | null = null;
let currentSticker = stickers[0];

canvas.addEventListener("sticker-mode", ((event: CustomEvent) => {
  drawMode = DRAW_MODE_STICKER
  currentSticker = event.detail;
  stickerCursor = new StickerCommand(0, 0, currentSticker);
}) as EventListener);

const ctx = canvas.getContext("2d")!;

let cursor: CursorCommand | null = null;

canvas.addEventListener("mouseout", (_event) => {
  cursor = null;
  stickerCursor = null;
  canvas.dispatchEvent(new CustomEvent("tool-moved"));
});

canvas.addEventListener("mouseenter", (event) => {
  cursor = new CursorCommand(event.x, event.y, false);
  stickerCursor = new StickerCommand(event.x, event.y, currentSticker);
  canvas.dispatchEvent(new CustomEvent("tool-moved"));
});

const drawings: DrawCommand[] = [];

let drawMode = DRAW_MODE_LINE
let currentDrawing: DrawCommand = new LineCommand([], 1);

canvas.addEventListener("mousedown", (_event) => {
  if(cursor){
    if(drawMode == DRAW_MODE_LINE){
      currentDrawing = new LineCommand([{ x: cursor.x, y: cursor.y }], lineThickness);
    } else if(drawMode == DRAW_MODE_STICKER){
      currentDrawing = new StickerCommand(cursor.x, cursor.y, currentSticker);
    }
    currentDrawing.drag(cursor.x, cursor.y);
    drawings.push(currentDrawing);
    cursor.active = true;
  }
  canvas.dispatchEvent(new CustomEvent("drawing-changed"));
});

canvas.addEventListener("mousemove", (_event) => {
  if(cursor){
    cursor.x = _event.offsetX;
    cursor.y = _event.offsetY;
    currentDrawing.drag(cursor.x, cursor.y);
  }
  
  canvas.dispatchEvent(new CustomEvent("drawing-changed"));
  canvas.dispatchEvent(new CustomEvent("tool-moved"));
});

canvas.addEventListener("mouseup", (_event) => {
  if(cursor){
    if(drawMode == DRAW_MODE_LINE){
      currentDrawing = new LineCommand([], lineThickness);
    } else if(drawMode == DRAW_MODE_STICKER){
      currentDrawing = new StickerCommand(cursor.x, cursor.y, (currentDrawing as StickerCommand).sticker);
    }
    cursor.active = false;
  }
  canvas.dispatchEvent(new CustomEvent("drawing-changed"));
});

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const drawing of drawings) {
    drawing.display(ctx);
  }
  if (cursor?.active == false) {
    cursor.display(ctx);
  }
  if(drawMode == DRAW_MODE_STICKER && stickerCursor){
    stickerCursor.display(ctx);
  }
}

canvas.addEventListener("drawing-changed", (_event) => {
  redraw();
});

canvas.addEventListener("tool-moved", (_event) => {
  if(cursor && stickerCursor){
    stickerCursor.drag(cursor.x, cursor.y);
  }
  redraw();
});

clearButton.addEventListener("click", () => {
  drawings.length = 0;
  canvas.dispatchEvent(new CustomEvent("drawing-changed"));
});

const redoStack: DrawCommand[] = [];

redoButton.addEventListener("click", () => {
  const line = redoStack.pop();
  if (line) {
    drawings.push(line);
    canvas.dispatchEvent(new CustomEvent("drawing-changed"));
  }
});

undoButton.addEventListener("click", () => {
  const line = drawings.pop();
  if (line) {
    redoStack.push(line);
    canvas.dispatchEvent(new CustomEvent("drawing-changed"));
  }
});

let lineThickness = 1;
thinMarkerButton.addEventListener("click", () => {
  //detail is the thickness of the marker
  canvas.dispatchEvent(new CustomEvent("marker-changed", { detail: 1 }));
});

thickMarkerButton.addEventListener("click", () => {
  //detail is the thickness of the marker
  canvas.dispatchEvent(new CustomEvent("marker-changed", { detail: 5 }));
});

canvas.addEventListener("marker-changed", ((event: CustomEvent) => {
  drawMode = DRAW_MODE_LINE
  lineThickness = event.detail;
}) as EventListener);
