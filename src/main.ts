import "./style.css";

const APP_NAME = "Jack's Great, Amazing Game!";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;
app.innerHTML = APP_NAME;

const appTitle = document.createElement("h1");
appTitle.textContent = "My Cool App"
app.append(appTitle);

const canvas = document.createElement("canvas") as HTMLCanvasElement;
app.append(canvas);
canvas.width = 256;
canvas.height = 256;

const drawing = canvas.getContext('2d') as CanvasRenderingContext2D;

interface Point {
    x: number,
    y: number,
}
const lines: Point[][] = [];
const redoLines: Point[][] = [];
let currentLine: Point[] = [];

const cursor = {active: false, x:0, y:0}; 

//mouse moving
const drawingChangeEvent = new Event('drawing-changed');

canvas.addEventListener("mousedown", (e) => {
    cursor.active = true;
    cursor.x = e.offsetX;
    cursor.y = e.offsetY;
    currentLine = [];
    lines.push(currentLine);
    currentLine.push({ x: cursor.x, y: cursor.y });
    canvas.dispatchEvent(drawingChangeEvent);
})

canvas.addEventListener("mouseup", (e)=> {
    cursor.active = false;
    currentLine = [];
    canvas.dispatchEvent(drawingChangeEvent);
})

canvas.addEventListener("mousemove", (e) => {
    if (cursor.active) {
        cursor.x = e.offsetX;
        cursor.y = e.offsetY;
        currentLine.push({ x: cursor.x, y: cursor.y });
        canvas.dispatchEvent(drawingChangeEvent);
    }
})

canvas.addEventListener("drawing-changed", (e) => {
    drawing.clearRect(0, 0, canvas.width, canvas.height);
    for (const line of lines) {
        if (lines.length > 0) {
            drawing.beginPath();
            const startingPoint: Point = line[0];
            drawing.moveTo(startingPoint.x,startingPoint.y);
            for (const point of line) {
                drawing.lineTo(point.x, point.y);
            }
            drawing.stroke();
        }
    }
})

const clearButton = document.createElement("button");
clearButton.innerHTML = "clear";
app.append(clearButton);
clearButton.addEventListener("click", () => {
    drawing.clearRect(0, 0, canvas.width, canvas.height);
    lines.length = 0;
})

const undoButton = document.createElement("button");
undoButton.innerHTML = "undo";
app.append(undoButton);
undoButton.addEventListener("click", () => {
   lineMover(redoLines, lines);
});

const redoButton = document.createElement("button");
redoButton.innerHTML = "redo";
app.append(redoButton);
redoButton.addEventListener("click", () => {
   lineMover(lines, redoLines); 
});

function lineMover (addingLinesTo: Point[][], takingLinesFrom: Point[][]) {
    if(takingLinesFrom.length != 0) {
        const movedLine = takingLinesFrom.pop();
        if (movedLine){
            addingLinesTo.push(movedLine);
        }
        canvas.dispatchEvent(drawingChangeEvent);
    }
}