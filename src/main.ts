import "./style.css";

const APP_NAME = "EZ SKETCH!!!";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;

// Add an h1 element with the app title
const titleElement = document.createElement("h1");
titleElement.textContent = APP_NAME;
app.appendChild(titleElement);

// Add a canvas element with size 256x256 pixels
const canvasElement = document.createElement("canvas");
canvasElement.width = 256;
canvasElement.height = 256;
canvasElement.id = "sketchCanvas";
app.appendChild(canvasElement);

// Add a clear button below the canvas
const clearButton = document.createElement("button");
clearButton.textContent = "Clear";
clearButton.id = "clearButton";
app.appendChild(clearButton);

const ctx = canvasElement.getContext("2d")!;
let drawing = false;
let points: Array<Array<{ x: number, y: number }>> = [];
let currentLine: Array<{ x: number, y: number }> = [];

canvasElement.addEventListener("mousedown", () => {
    drawing = true;
    currentLine = [];
    points.push(currentLine);
});

canvasElement.addEventListener("mouseup", () => {
    drawing = false;
    ctx.beginPath(); // Reset the path to avoid connecting lines
});

canvasElement.addEventListener("mousemove", (event) => {
    if (!drawing) return;
    const point = { x: event.offsetX, y: event.offsetY };
    currentLine.push(point);
    canvasElement.dispatchEvent(new Event("drawing-changed"));
});

canvasElement.addEventListener("drawing-changed", () => {
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    points.forEach(line => {
        ctx.beginPath();
        line.forEach((point, index) => {
            if (index === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        });
        ctx.stroke();
    });
});

clearButton.addEventListener("click", () => {
    points = [];
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
});
