import "./style.css";

class MarkerLine {
  private points: Array<{ x: number; y: number }> = [];
  private thickness: number;
  private color: string;

  constructor(initialX: number, initialY: number, thickness: number, color: string) {
    this.points.push({ x: initialX, y: initialY });
    this.thickness = thickness;
    this.color = color;
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

    context.strokeStyle = this.color;
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
  private rotation: number;

  constructor(emoji: string, x: number, y: number, rotation: number) {
    this.emoji = emoji;
    this.x = x;
    this.y = y;
    this.rotation = rotation;
  }

  drag(newX: number, newY: number) {
    this.x = newX;
    this.y = newY;
  }

  display(context: CanvasRenderingContext2D) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate((this.rotation * Math.PI) / 180);
    context.font = "24px serif";
    context.fillText(this.emoji, 0, 0);
    context.restore();
  }
}

class ToolPreview {
  private x: number;
  private y: number;
  private thickness: number;
  private color: string;

  constructor(thickness: number, color: string) {
    this.x = 0;
    this.y = 0;
    this.thickness = thickness;
    this.color = color;
  }

  update(newThickness: number, newColor: string) {
    this.thickness = newThickness;
    this.color = newColor;
  }

  updatePosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.arc(this.x, this.y, this.thickness / 2, 0, 2 * Math.PI);
    context.strokeStyle = this.color;
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

let currentColor = generateRandomColor();
let currentRotation = 0;

let toolPreview: ToolPreview = new ToolPreview(2, currentColor); // Ensure always initialized
let currentMarkerThickness = 2;

let currentSticker: Sticker | null = null;

// Initial set of stickers with new options added.
const stickers = [
  { emoji: "👤" },
  { emoji: "🕶" },
  { emoji: "🧢" }
];

function generateRandomColor(): string {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function generateRandomRotation(): number {
  return Math.floor(Math.random() * 360);
}

function exportCanvas() {
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = 1024;
  exportCanvas.height = 1024;

  const exportContext = exportCanvas.getContext("2d")!;
  exportContext.scale(4, 4);

  strokes.forEach(stroke => stroke.display(exportContext));

  const anchor = document.createElement("a");
  anchor.href = exportCanvas.toDataURL("image/png");
  anchor.download = "sketchpad.png";
  anchor.click();
}

const exportButton = document.createElement("button");
exportButton.textContent = "Export as PNG";
app.appendChild(exportButton);
exportButton.addEventListener("click", exportCanvas);

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
    currentStroke = new MarkerLine(x, y, currentMarkerThickness, currentColor);
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

  toolPreview?.draw(context); // Use optional chaining to safely call draw
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

const controlsDiv = document.createElement("div");
controlsDiv.id = "controls";
app.appendChild(controlsDiv);

const clearButton = document.createElement("button");
clearButton.textContent = "Clear";
controlsDiv.appendChild(clearButton);

const undoButton = document.createElement("button");
undoButton.textContent = "Undo";
controlsDiv.appendChild(undoButton);

const redoButton = document.createElement("button");
redoButton.textContent = "Redo";
controlsDiv.appendChild(redoButton);

const thickButton = document.createElement("button");
thickButton.textContent = "Thick";
controlsDiv.appendChild(thickButton);

const thinButton = document.createElement("button");
thinButton.textContent = "Thin";
controlsDiv.appendChild(thinButton);

// Sticker controls
const stickerControlsDiv = document.createElement("div");
stickerControlsDiv.id = "sticker-controls";
stickerControlsDiv.style.display = "flex";
app.appendChild(stickerControlsDiv);

// Add custom sticker button to the sticker controls
const customStickerButton = document.createElement("button");
customStickerButton.textContent = "Add Custom Sticker";
stickerControlsDiv.appendChild(customStickerButton);

// Add sticker buttons
stickers.forEach(sticker => {
  const button = document.createElement("button");
  button.textContent = sticker.emoji;
  stickerControlsDiv.appendChild(button);

  button.addEventListener("click", () => {
    currentRotation = generateRandomRotation();
    currentColor = generateRandomColor();
    toolPreview = new ToolPreview(24, currentColor); // Reinitialize for sticker tool preview
    currentSticker = new Sticker(sticker.emoji, 0, 0, currentRotation);
    dispatchToolMovedEvent();
  });
});

customStickerButton.addEventListener("click", () => {
  const inputEmoji = prompt("Enter emoji for a new sticker:", "🙂");
  if (inputEmoji) {
    const newSticker = { emoji: inputEmoji };
    stickers.push(newSticker);
    createStickerButton(newSticker);
  }
});

function createStickerButton(sticker: { emoji: string }) {
  const button = document.createElement("button");
  button.textContent = sticker.emoji;
  stickerControlsDiv.appendChild(button);

  button.addEventListener("click", () => {
    currentRotation = generateRandomRotation();
    currentColor = generateRandomColor();
    toolPreview = new ToolPreview(24, currentColor);
    currentSticker = new Sticker(sticker.emoji, 0, 0, currentRotation);
    dispatchToolMovedEvent();
  });
}

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
  currentColor = generateRandomColor();
  toolPreview.update(currentMarkerThickness, currentColor);
  updateSelectedTool(thickButton);
});

thinButton.addEventListener("click", () => {
  currentMarkerThickness = 2;
  currentColor = generateRandomColor();
  toolPreview.update(currentMarkerThickness, currentColor);
  updateSelectedTool(thinButton);
});

function updateSelectedTool(selectedButton: HTMLButtonElement) {
  const buttons = [thinButton, thickButton];
  buttons.forEach((button) => {
    if (button === selectedButton) {
      button.classList.add("selectedTool");
    } else {
      button.classList.remove("selectedTool");
    }
  });
}

// Initialize with the thin marker selected and randomize its color
updateSelectedTool(thinButton);
currentColor = generateRandomColor();
toolPreview.update(currentMarkerThickness, currentColor);