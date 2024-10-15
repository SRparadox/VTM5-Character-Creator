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
//Arrays to track drawn lines:
const strokes: Array<Array<{ x: number; y: number }>> = []; // Array to hold all strokes
let currentStroke: Array<{ x: number; y: number }> = [];

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
  if (drawing) {
    strokes.push(currentStroke); // Save the current stroke
    drawing = false;
  }
});

canvas.addEventListener("mouseout", () => {
  if (drawing) {
    strokes.push(currentStroke);
    drawing = false;
  }
});

// Function to add a point to the current stroke and redraw
function addPoint(event: MouseEvent) {
  const rect = canvas.getBoundingClientRect();
  currentStroke.push({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  redraw();
}

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

// Add clear button
const clearButton = document.createElement("button");
clearButton.textContent = "Clear";
app.appendChild(clearButton);

// Clear canvas on button click
clearButton.addEventListener("click", () => {
  context.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
  // Empty the array:
  strokes.length = 0;
});
