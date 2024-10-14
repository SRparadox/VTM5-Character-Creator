import "./style.css";

const APP_NAME = "Goodbye";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;
app.innerHTML = APP_NAME;

const test = document.createElement("h1");
test.innerHTML = "fart";
app.append(test);

const canvas = document.createElement("canvas");
canvas.id = "canvas"; // adds element to css class
canvas.height = 256;
canvas.width = 256;
app.append(canvas);

//drawing
const drawing = canvas.getContext("2d")!;
interface Point {
    x: number;
    y: number;
}
type Line = Point[];
const lines: Line[] = [];
const cursor = { active: false, x: 0, y: 0 };
let currentLine: Line = [];
canvas.addEventListener("mousedown", (e) => {
    cursor.active = true;
    cursor.x = e.offsetX;
    cursor.y = e.offsetY;
    currentLine = [];
    currentLine.push({ x: e.offsetX, y: e.offsetY });
    lines.push(currentLine);
    canvas.dispatchEvent(event)
});

canvas.addEventListener("mousemove", (e) => {
    if (cursor.active) {
        cursor.x = e.offsetX;
        cursor.y = e.offsetY;
        currentLine.push({ x: e.offsetX, y: e.offsetY });
        canvas.dispatchEvent(event)
    }
});
canvas.addEventListener("mouseup", (e) => {
    if (cursor.active) {
        cursor.x = 0;
        cursor.y = 0;
        cursor.active = false;
        currentLine.push({ x: e.offsetX, y: e.offsetY });
        canvas.dispatchEvent(event)
    }
});
function drawLine(drawing, x1, y1, x2, y2) {
    drawing.beginPath();
    drawing.strokeStyle = "black";
    drawing.lineWidth = 1;
    drawing.moveTo(x1, y1);
    drawing.lineTo(x2, y2);
    drawing.stroke();
    drawing.closePath();
}

function drawAllLines() {
    drawing.clearRect(0, 0, canvas.height, canvas.width);
    for (const line of lines) {
        drawing.beginPath();
        drawing.strokeStyle = "black";
        drawing.lineWidth = 1;
        const { x, y } = line[0];
        drawing.moveTo(x, y);
        for (const { x, y } of line) {
            drawing.lineTo(x, y);
        }
        drawing.stroke();
        drawing.closePath();
    }
}

//clear button
const clearButton = document.createElement("button");
clearButton.className = "clear_button";
clearButton.innerHTML = "CLEAR";
app.append(clearButton);
clearButton.addEventListener("mousedown", () => {
    drawing.clearRect(0, 0, canvas.height, canvas.width);
});

const event = new Event("drawing-changed");
canvas.addEventListener("drawing-changed", () => { // what happens when canvas receives event
    drawAllLines();
});
