import "./style.css";

const APP_NAME = "Goodbye";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;
app.innerHTML = APP_NAME;

const canvas = document.createElement("canvas");
canvas.height = 256;
canvas.width = 256;
app.append(canvas);

const context = canvas.getContext("2d")!;

interface Point {
    x: number;
    y: number;
}
type Line = Point[];

const lines: Line[] = [];
let isMouseDown = false;
let currentLine: Line = [];
canvas.addEventListener("mousedown", (e) => {
    isMouseDown = true;
    currentLine = [];
    currentLine.push({ x: e.offsetX, y: e.offsetY });
    lines.push(currentLine);
    canvas.dispatchEvent(drawingChangedEvent);
});
canvas.addEventListener("mousemove", (e) => {
    if (isMouseDown) {
        currentLine.push({ x: e.offsetX, y: e.offsetY });
        canvas.dispatchEvent(drawingChangedEvent);
    }
});
canvas.addEventListener("mouseup", (e) => {
    if (isMouseDown) {
        isMouseDown = false;
        currentLine.push({ x: e.offsetX, y: e.offsetY });
        canvas.dispatchEvent(drawingChangedEvent);
    }
});

const clearButton = document.createElement("button");
clearButton.innerHTML = "CLEAR";
app.append(clearButton);
clearButton.addEventListener("mousedown", () => {
    context.clearRect(0, 0, canvas.height, canvas.width);
});

const drawingChangedEvent = new Event("drawing-changed");
canvas.addEventListener("drawing-changed", () => {
    context.clearRect(0, 0, canvas.height, canvas.width);
    for (const line of lines) {
        context.beginPath();
        context.strokeStyle = "black";
        context.lineWidth = 1;
        const { x, y } = line[0];
        context.moveTo(x, y);
        for (const { x, y } of line) {
            context.lineTo(x, y);
        }
        context.stroke();
        context.closePath();
    }
});
