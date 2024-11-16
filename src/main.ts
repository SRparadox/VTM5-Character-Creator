import "./style.css";

//--------------------------------------------------------------------------
//  Classes and Interfaces
//--------------------------------------------------------------------------

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
  color: string;

  constructor(points: Point[], thickness: number, color: string = "black") {
    this.points = points;
    this.thickness = thickness;
    this.color = color;
  }

  drag(x: number, y: number) {
    this.points.push({ x, y });
  }

  display(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = this.thickness;
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (const point of this.points) {
      ctx.lineTo(point.x, point.y);
    }
    ctx.stroke();
  }
   // Implement serialization for saving/loading
   toJSON() {
    return {
      type: 'line',
      points: this.points,
      thickness: this.thickness,
      color: this.color
    };
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
    ctx.font = `${STICKER_SIZE}px monospace`;
    ctx.fillText(this.sticker, this.x - 4, this.y + 4);
  }
  toJSON() {
    return {
      type: 'sticker',
      x: this.x,
      y: this.y,
      sticker: this.sticker
    };
  }
}

class CursorCommand {
  x: number;
  y: number;
  active: boolean;
  color: string = "black";

  constructor(x: number, y: number, active: boolean, color: string) {
    this.x = x;
    this.y = y;
    this.active = active;
    this.color = color;
  }

  display(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(lineThickness / 2, 1), 0, Math.PI * 2);
    ctx.fill();
  }
}
//------------------------------------------------------------------------------
// Consts and globals
//------------------------------------------------------------------------------
const redoStack: DrawCommand[] = [];
const APP_NAME = "Sketchpad Demo";
const colors = ["black", "red", "green", "blue", "purple"];

const drawings: DrawCommand[] = [];
const THIN_LINE_PX = 2;
const THICK_LINE_PX = 8;
let lineThickness = THIN_LINE_PX;

const stickers = [`🗿`, `❤️`, `👹`];
const STICKER_SIZE = 16;
const DRAW_MODE_LINE = 12;
const DRAW_MODE_STICKER = 13;


let cursor: CursorCommand | null = null;
let drawMode = DRAW_MODE_LINE
let currentDrawing: DrawCommand = new LineCommand([], 1);
let lineColor = "black";

//------------------------------------------------------------------------------
// Adding/Configuring HTML Elements
//------------------------------------------------------------------------------
document.title = APP_NAME;
const app = document.querySelector<HTMLDivElement>("#app")!;
const header = document.querySelector<HTMLCanvasElement>("#h1");
const canvas = document.querySelector<HTMLCanvasElement>("#drawingCanvas");
if (!canvas){
  throw new Error("Canvas element not found");
}
const ctx = canvas.getContext("2d")!;

// Buttons
function makeButton(innerText, parent, callback){
  const button = document.createElement("button");
  button.innerHTML = innerText;
  parent.append(button);
  button.addEventListener("click", callback);
  return(button);
}

const clearButton = makeButton("clear", app, ()=>{
  drawings.length = 0;
  canvas.dispatchEvent(new CustomEvent("drawing-changed"));
})

const undoButton = makeButton("undo", app, ()=>{
  const line = drawings.pop();
  if (line) {
    redoStack.push(line);
    canvas.dispatchEvent(new CustomEvent("drawing-changed"));
  }
})

const redoButton = makeButton("redo", app, ()=>{
  const line = redoStack.pop();
  if (line) {
    drawings.push(line);
    canvas.dispatchEvent(new CustomEvent("drawing-changed"));
  }
})

const exportButton = makeButton("Export", app, ()=>{
  const highDef = document.createElement("canvas");
  highDef.width = 1024;
  highDef.height = 1024;
  const hdctx = highDef.getContext("2d")!;
  hdctx.scale(4, 4);
  for (const drawing of drawings) {
    drawing.display(hdctx);
  }
  const anchor = document.createElement("a");
  anchor.href = highDef.toDataURL("image/png");
  anchor.download = "sketchpad.png";
  anchor.click();
  // Save the drawings to localStorage
  localStorage.setItem("drawings", JSON.stringify(drawings));
})

app.append(document.createElement("br"));


for(const color of colors){
  makeButton(color, app, ()=>{
    if(drawMode == DRAW_MODE_LINE){
      lineColor = color;
    }
  })
}

app.append(document.createElement("br"));

const thinMarkerButton = makeButton("Thin",app, ()=>{
  canvas.dispatchEvent(new CustomEvent("marker-changed", { detail: THIN_LINE_PX }));
})

const thickMarkerButton = makeButton("Thick", app, ()=>{
  canvas.dispatchEvent(new CustomEvent("marker-changed", { detail: THICK_LINE_PX }));
})

for (const sticker of stickers) {
  const stickerButton = makeButton(sticker, app, ()=>{
    canvas.dispatchEvent(new CustomEvent("tool-moved"));
    canvas.dispatchEvent(new CustomEvent("sticker-mode", { detail: sticker }));
  });
}

const customStickerButton = makeButton("Create Sticker", app, ()=> {
  const sticker = prompt("Enter a sticker");
  if(sticker){
    stickers.push(sticker);
    const stickerButton = makeButton(sticker, app, ()=>{
      canvas.dispatchEvent(new CustomEvent("tool-moved"));
      canvas.dispatchEvent(new CustomEvent("sticker-mode", { detail: sticker }));
    })
  }
})


app.append(document.createElement("br"));

const loadButton = makeButton("Load", app, ()=>{
  const storedDrawings = localStorage.getItem("drawings");
  if (storedDrawings) {
    const parsedDrawings = JSON.parse(storedDrawings);
    drawings.length = 0; // Clear the current drawings
    parsedDrawings.forEach((drawing: any) => {
      if (drawing.type === 'line') {
        drawings.push(new LineCommand(drawing.points, drawing.thickness, drawing.color));
      } else if (drawing.type === 'sticker') {
        drawings.push(new StickerCommand(drawing.x, drawing.y, drawing.sticker));
      }
    });
    canvas.dispatchEvent(new CustomEvent("drawing-changed"));
  }
});

// ----------------------------------------------------------------------------------------
// Canvas listeners
// ----------------------------------------------------------------------------------------

canvas.addEventListener("mouseout", (_event) => {
  cursor = null;
  stickerCursor = null;
  canvas.dispatchEvent(new CustomEvent("tool-moved"));
});

canvas.addEventListener("mouseenter", (event) => {
  cursor = new CursorCommand(event.x, event.y, false, lineColor);
  stickerCursor = new StickerCommand(event.x, event.y, currentSticker);
  canvas.dispatchEvent(new CustomEvent("tool-moved"));
});



canvas.addEventListener("mousedown", (_event) => {
  if(cursor){
    if(drawMode == DRAW_MODE_LINE){
      currentDrawing = new LineCommand([{ x: cursor.x, y: cursor.y }], lineThickness, lineColor);
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
  if (!canvas){
    return
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const drawing of drawings) {
    drawing.display(ctx);
  }
  if (cursor?.active == false) {
    cursor.display(ctx);
  }
  if(drawMode == DRAW_MODE_STICKER && stickerCursor){
    stickerCursor.display(ctx);
    if(cursor){
      cursor.active = true;
    }
  }
}

// ------------------------------------------------------------------------
// Canvas signal Listeners
// ------------------------------------------------------------------------

canvas.addEventListener("drawing-changed", (_event) => {
  redraw();
});

canvas.addEventListener("tool-moved", (_event) => {
  if(cursor && stickerCursor){
    stickerCursor.drag(cursor.x, cursor.y);
  }
  redraw();
});

canvas.addEventListener("marker-changed", ((event: CustomEvent) => {
  drawMode = DRAW_MODE_LINE
  lineColor = colors[Math.floor(Math.random() * colors.length)];
  lineThickness = event.detail;
}) as EventListener);

let stickerCursor: StickerCommand | null = null;
let currentSticker = stickers[0];

canvas.addEventListener("sticker-mode", ((event: CustomEvent) => {
  drawMode = DRAW_MODE_STICKER
  currentSticker = event.detail;
  stickerCursor = new StickerCommand(0, 0, currentSticker);
}) as EventListener);
