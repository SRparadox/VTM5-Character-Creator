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

// Add mouse event listeners for drawing
canvas.addEventListener("mousedown", (event) => {
  drawing = true;
  draw(event);
});

canvas.addEventListener("mousemove", draw);

canvas.addEventListener("mouseup", () => {
  drawing = false;
  context.beginPath(); // Begin new path after mouse is released
});

canvas.addEventListener("mouseout", () => {
  drawing = false;
  context.beginPath(); // Ensure path ends when mouse leaves canvas
});

// Drawing function
function draw(event: MouseEvent) {
  if (!drawing) return; // If not drawing, do nothing
  
  context.lineWidth = 2; // Set line width
  context.lineCap = "round"; // Set line cap to round
  context.strokeStyle = "black"; // Set line color
  
  context.lineTo(event.offsetX, event.offsetY); // Draw from previous to current position
  context.stroke(); // Make the stroke
  context.beginPath(); // Start a new path
  context.moveTo(event.offsetX, event.offsetY); // Move to the current position
}

// Add clear button
const clearButton = document.createElement("button");
clearButton.textContent = "Clear";
app.appendChild(clearButton);

// Clear canvas on button click
clearButton.addEventListener("click", () => {
  context.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
});
