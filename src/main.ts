import "./style.css";

const APP_NAME = "Stick N Sketch";
const app = document.querySelector<HTMLDivElement>("#app")!;

// Add app title to the webpage:
const header = document.createElement("h1");
header.innerHTML = APP_NAME;
app.append(header);

document.title = APP_NAME;

// Add canvas
const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
app.appendChild(canvas);

const context = canvas.getContext("2d")!;
let drawing = false; // Variable to track drawing status
// Arrays to track drawn lines:
const strokes: Array<Array<{ x: number; y: number }>> = []; // Array to hold all strokes
let currentStroke: Array<{ x: number; y: number }> = [];
const redoStack: Array<Array<{ x: number; y: number }>> = []; // Array to hold undone strokes

// Add mouse event listeners for drawing
canvas.addEventListener("mousedown", (event) => {
  drawing = true;
  currentStroke = [];
  addPoint(event);
});

canvas.addEventListener("mousemove", (event) => {
  if (drawing) {
    addPoint(event);
  }
});

canvas.addEventListener("mouseup", () => {
  drawing = false;
  if (currentStroke.length > 0) {
    strokes.push(currentStroke); // Save the current stroke
    // Clear redoStack on new stroke addition
    redoStack.length = 0;
    dispatchDrawingChangedEvent();
  }
});

canvas.addEventListener("mouseout", () => {
  drawing = false;
  if (currentStroke.length > 0) {
    strokes.push(currentStroke);
    redoStack.length = 0;
    dispatchDrawingChangedEvent();
  }
});

// Function to add a point to the current stroke
function addPoint(event: MouseEvent) {
  const rect = canvas.getBoundingClientRect();
  currentStroke.push({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  dispatchDrawingChangedEvent();
}

// Function to redraw the canvas from stored points
function redraw() {
  context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

  for (const stroke of strokes) {
    context.beginPath();
    stroke.forEach((point, index) => {
      if (index === 0) {
        context.moveTo(point.x, point.y);
      } else {
        context.lineTo(point.x, point.y);
      }
    });
    context.strokeStyle = "black";
    context.lineWidth = 2;
    context.lineCap = "round";
    context.stroke();
    context.closePath();
  }
}

// Function to dispatch "drawing-changed" event
function dispatchDrawingChangedEvent() {
  const event = new Event("drawing-changed");
  canvas.dispatchEvent(event);
}

// Observer for "drawing-changed" that will clear and redraw the user's lines
canvas.addEventListener("drawing-changed", redraw);

// Add clear button
const clearButton = document.createElement("button");
clearButton.textContent = "Clear";
app.appendChild(clearButton);

// Undo button:
const undoButton = document.createElement("button");
undoButton.textContent = "Undo";
app.appendChild(undoButton);

// Redo button:
const redoButton = document.createElement("button");
redoButton.textContent = "Redo";
app.appendChild(redoButton);

// Clear canvas on button click
clearButton.addEventListener("click", () => {
  context.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
  strokes.length = 0; // Empty the array
  redoStack.length = 0; // Clear redo stack
  dispatchDrawingChangedEvent();
});

// Undo functionality
undoButton.addEventListener("click", () => {
  if (strokes.length !== 0) {
    const stroke = strokes.pop()!;
    redoStack.push(stroke); // Add the stroke to redo stack
    dispatchDrawingChangedEvent();
  }
});

// Redo functionality
redoButton.addEventListener("click", () => {
  if (redoStack.length !== 0) {
    const stroke = redoStack.pop()!;
    strokes.push(stroke); // Add the stroke back to display list
    dispatchDrawingChangedEvent();
  }
});