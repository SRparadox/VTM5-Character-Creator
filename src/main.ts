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

// Add a clear button
const clearButton = document.createElement("button");
clearButton.textContent = "Clear";
clearButton.id = "clearButton";
app.appendChild(clearButton);

const ctx = canvasElement.getContext("2d")!;
let drawing = false;

canvasElement.addEventListener("mousedown", () => {
    drawing = true;
});

canvasElement.addEventListener("mouseup", () => {
    drawing = false;
    ctx.beginPath(); // Reset the path to avoid connecting lines
});

canvasElement.addEventListener("mousemove", (event) => {
    if (!drawing) return;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
});

clearButton.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
});
