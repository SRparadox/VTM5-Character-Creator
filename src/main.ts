import "./style.css";

class MarkerLine {
  private points: Array<{ x: number; y: number }> = [];
  private thickness: number;

  constructor(initialX: number, initialY: number, thickness: number) {
    this.points.push({ x: initialX, y: initialY });
    this.thickness = thickness;
  }

  drag(x: number, y: number) {
    this.points.push({ x, y });
  }

  display(context: CanvasRenderingContext2D) {
    if (this.points.length < 1) return;

    context.beginPath();
    this.points.forEach((point, index) => {
      if (index === 0) {
        context.moveTo(point.x, point.y);
      } else {
        context.lineTo(point.x, point.y);
      }
    });

    context.strokeStyle = "black";
    context.lineWidth = this.thickness;
    context.lineCap = "round";
    context.stroke();
    context.closePath();
  }
}

class Sticker {
  private emoji: string;
  private x: number;
  private y: number;

  constructor(emoji: string, x: number, y: number) {
    this.emoji = emoji;
    this.x = x;
    this.y = y;
  }

  drag(newX: number, newY: number) {
    this.x = newX;
    this.y = newY;
  }

  display(context: CanvasRenderingContext2D) {
    context.font = "24px serif";
    context.fillText(this.emoji, this.x, this.y);
  }
}

class ToolPreview {
  private x: number;
  private y: number;
  private thickness: number;

  constructor(thickness: number) {
    this.x = 0;
    this.y = 0;
    this.thickness = thickness;
  }

  updatePosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.arc(this.x, this.y, this.thickness / 2, 0, 2 * Math.PI);
    context.strokeStyle = "gray";
    context.lineWidth = 1;
    context.stroke();
  }
}

const APP_NAME = "Stick N Sketch";
const app = document.querySelector<HTMLDivElement>("#app")!;

const header = document.createElement("h1");
header.innerHTML = APP_NAME;
app.append(header);

document.title = APP_NAME;

const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
app.appendChild(canvas);

const context = canvas.getContext("2d")!;
let drawing = false;
const strokes: (MarkerLine | Sticker)[] = [];
let currentStroke: MarkerLine | null = null;
const redoStack: (MarkerLine | Sticker)[] = [];

let toolPreview: ToolPreview | null = new ToolPreview(2);
let currentMarkerThickness = 2;

let currentSticker: Sticker | null = null;

function endStroke() {
  if (drawing && currentStroke !== null) {
    strokes.push(currentStroke);
    currentStroke = null;
    drawing = false;
    dispatchDrawingChangedEvent();
  } else if (currentSticker !== null) {
    strokes.push(currentSticker);
    currentSticker = null;
    dispatchDrawingChangedEvent();
  }
}

canvas.addEventListener("mousedown", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  if (!drawing && !currentSticker) {
    drawing = true;
    currentStroke = new MarkerLine(x, y, currentMarkerThickness);
    addPoint(event);
  } else if (currentSticker) {
    currentSticker.drag(x, y);
    dispatchDrawingChangedEvent();
    endStroke();
  }
});

canvas.addEventListener("mouseup", endStroke);
canvas.addEventListener("mouseout", endStroke);

canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  if (drawing && currentStroke) {
    addPoint(event);
  } else if (toolPreview) {
    toolPreview.updatePosition(x, y);
    dispatchToolMovedEvent();
  } else if (currentSticker) {
    currentSticker.drag(x, y);
    dispatchDrawingChangedEvent();
  }
});

function addPoint(event: MouseEvent) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  if (currentStroke) {
    currentStroke.drag(x, y);
    dispatchDrawingChangedEvent();
  }
}

function redraw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  strokes.forEach((stroke) => stroke.display(context));

  if (!drawing && toolPreview) {
    toolPreview.draw(context);
  }

  if (currentSticker) {
    currentSticker.display(context);
  }
}

function dispatchDrawingChangedEvent() {
  const event = new Event("drawing-changed");
  canvas.dispatchEvent(event);
}

function dispatchToolMovedEvent() {
  const event = new Event("tool-moved");
  canvas.dispatchEvent(event);
}

canvas.addEventListener("drawing-changed", redraw);
canvas.addEventListener("tool-moved", redraw);

const clearButton = document.createElement("button");
clearButton.textContent = "Clear";
app.appendChild(clearButton);

const undoButton = document.createElement("button");
undoButton.textContent = "Undo";
app.appendChild(undoButton);

const redoButton = document.createElement("button");
redoButton.textContent = "Redo";
app.appendChild(redoButton);

const thickButton = document.createElement("button");
thickButton.textContent = "Thick";
app.appendChild(thickButton);

const thinButton = document.createElement("button");
thinButton.textContent = "Thin";
app.appendChild(thinButton);

// Sticker Buttons
const stickerEmojis = ['👤', '🕶', '🧢'];
stickerEmojis.forEach((emoji) => {
  const button = document.createElement("button");
  button.textContent = emoji;
  app.appendChild(button);

  button.addEventListener("click", () => {
    toolPreview = null;
    currentSticker = new Sticker(emoji, 0, 0);
    dispatchToolMovedEvent();
  });
});

clearButton.addEventListener("click", () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  strokes.length = 0;
  redoStack.length = 0;
  dispatchDrawingChangedEvent();
});

undoButton.addEventListener("click", () => {
  if (strokes.length !== 0) {
    const stroke = strokes.pop()!;
    redoStack.push(stroke);
    dispatchDrawingChangedEvent();
  }
});

redoButton.addEventListener("click", () => {
  if (redoStack.length !== 0) {
    const stroke = redoStack.pop()!;
    strokes.push(stroke);
    dispatchDrawingChangedEvent();
  }
});

thickButton.addEventListener("click", () => {
  currentMarkerThickness = 4;
  toolPreview = new ToolPreview(4);
  updateSelectedTool(thickButton);
});

thinButton.addEventListener("click", () => {
  currentMarkerThickness = 2;
  toolPreview = new ToolPreview(2);
  updateSelectedTool(thinButton);
});

function updateSelectedTool(selectedButton: HTMLButtonElement) {
  const buttons = [thinButton, thickButton];
  buttons.forEach(button => {
    if (button === selectedButton) {
      button.classList.add("selectedTool");
    } else {
      button.classList.remove("selectedTool");
    }
  });
}

// Initialize with the thin marker selected
updateSelectedTool(thinButton);