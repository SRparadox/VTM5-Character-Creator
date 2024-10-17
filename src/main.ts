import "./style.css";

const APP_NAME = "Drawing Application";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;
const h = document.createElement("h1");
h.innerHTML = APP_NAME;
app.append(h);

const canvas = document.createElement("canvas");
canvas.height = 256;
canvas.width = 256;
app.append(canvas);
canvas.style.cursor = "none";

const context = canvas.getContext("2d")!;
context.fillStyle = "white";
context.fillRect(0, 0, canvas.height, canvas.width);

let isMouseDown = false;
let lineSize = 1;

interface Point {
    x: number;
    y: number;
}
interface Displayable {
    display(context: CanvasRenderingContext2D): void;
}
class LineCommand implements Displayable {
    line: Point[] = [];
    lineSize: number = 1;
    display(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.strokeStyle = "black";
        context.lineWidth = this.lineSize;
        for (const point of this.line) {
            context.lineTo(point.x, point.y);
        }
        context.stroke();
        context.closePath();
    }
    drag(x: number, y: number) {
        this.line.push({ x, y });
    }
}
let displayCommands: Displayable[] = [];
let currentCommand = new LineCommand();
let redoCommands: Displayable[] = [];

class Cursor{
    x : number;
    y : number;
    constructor(x : number, y : number){
        this.x = x;
        this.y = y;
    }
    execute(){
        context.beginPath()
        context.strokeStyle = "black";
        context.lineWidth = lineSize;
        context.moveTo(this.x, this.y);
        context.lineTo(this.x + 1, this.y);
        context.lineTo(this.x + 1, this.y-1);
        context.lineTo(this.x, this.y-1);
        context.lineTo(this.x, this.y);
        context.stroke();
        context.closePath();
    }
}
let cursorCommand : Cursor;


canvas.addEventListener("mousedown", (e) => {
    redoCommands = [];
    isMouseDown = true;

    cursorCommand = new Cursor(e.offsetX, e.offsetY);
    canvas.dispatchEvent(toolMovedEvent);

    currentCommand = new LineCommand();
    currentCommand.lineSize = lineSize;
    currentCommand.drag(e.offsetX, e.offsetY);
    displayCommands.push(currentCommand);
    canvas.dispatchEvent(drawingChangedEvent);
});
canvas.addEventListener("mousemove", (e) => {
    if (isMouseDown) {
        currentCommand.drag(e.offsetX, e.offsetY);
        canvas.dispatchEvent(drawingChangedEvent);
    }
    else{
        cursorCommand = new Cursor(e.offsetX, e.offsetY);
        canvas.dispatchEvent(toolMovedEvent);
    }
});
canvas.addEventListener("mouseup", (e) => {
    isMouseDown = false;
    currentCommand.drag(e.offsetX, e.offsetY);
    canvas.dispatchEvent(drawingChangedEvent);
});

const drawingChangedEvent = new Event("drawing-changed");
canvas.addEventListener("drawing-changed", () => {
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.height, canvas.width);
    for (const command of displayCommands) {
        command.display(context);
    }
});

const toolMovedEvent = new Event("tool-moved");
canvas.addEventListener("tool-moved", () => {
    canvas.dispatchEvent(drawingChangedEvent);
    cursorCommand.execute();
});



const buttonPanel = document.createElement("div");
app.append(buttonPanel);

const clearButton = document.createElement("button");
clearButton.innerHTML = "CLEAR";
buttonPanel.append(clearButton);
clearButton.addEventListener("mousedown", () => {
    displayCommands = [];
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.height, canvas.width);
});

const undoButton = document.createElement("button");
undoButton.innerHTML = "undo";
buttonPanel.append(undoButton);
undoButton.addEventListener("mousedown", () => {
    if (displayCommands.length > 0) {
        redoCommands.push(displayCommands.pop()!);
        canvas.dispatchEvent(drawingChangedEvent);
    }
});

const redoButton = document.createElement("button");
redoButton.innerHTML = "redo";
buttonPanel.append(redoButton);
redoButton.addEventListener("mousedown", () => {
    if (redoCommands.length > 0) {
        displayCommands.push(redoCommands.pop()!);
        canvas.dispatchEvent(drawingChangedEvent);
    }
});

const smallLineButton = document.createElement("button");
smallLineButton.innerHTML = "small line";
buttonPanel.append(smallLineButton);
smallLineButton.addEventListener("mousedown", () => {
    lineSize = 1;
});

const bigLineButton = document.createElement("button");
bigLineButton.innerHTML = "big line";
buttonPanel.append(bigLineButton);
bigLineButton.addEventListener("mousedown", () => {
    lineSize = 4;
});
