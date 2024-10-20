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
const strokes: MarkerLine[] = [];
let currentStroke: MarkerLine | null = null;
const redoStack: MarkerLine[] = [];

// Initially set to "thin" style
let currentMarkerThickness = 2; // Default thickness

function endStroke() {
  if (drawing && currentStroke !== null) {
    strokes.push(currentStroke);
    currentStroke = null;
    drawing = false;
    dispatchDrawingChangedEvent();
  }
}

canvas.addEventListener("mousedown", (event) => {
  if (!drawing) {
    drawing = true;
    const rect = canvas.getBoundingClientRect();
    currentStroke = new MarkerLine(event.clientX - rect.left, event.clientY - rect.top, currentMarkerThickness);
    addPoint(event);
  }
});

canvas.addEventListener("mousemove", (event) => {
  if (drawing && currentStroke) {
    addPoint(event);
  }
});

canvas.addEventListener("mouseup", endStroke);
canvas.addEventListener("mouseout", endStroke);

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
}

function dispatchDrawingChangedEvent() {
  const event = new Event("drawing-changed");
  canvas.dispatchEvent(event);
}

canvas.addEventListener("drawing-changed", redraw);

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
  currentMarkerThickness = 4; // Set thickness for thick marker
  updateSelectedTool(thickButton);
});

thinButton.addEventListener("click", () => {
  currentMarkerThickness = 2; // Set thickness for thin marker
  updateSelectedTool(thinButton);
});

// Function to update the CSS class of selected tool button
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

updateSelectedTool(thinButton); // Initialize with the thin marker selected
