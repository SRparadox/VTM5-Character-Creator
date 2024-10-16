import "./style.css";

const APP_NAME = "Drawing Application";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;
app.innerHTML = APP_NAME;

const canvas = document.createElement("canvas");
canvas.height = 256;
canvas.width = 256;
app.append(canvas);

const context = canvas.getContext("2d")!;

let isMouseDown = false;

interface Point {
    x: number;
    y: number;
}
interface Displayable {
    display(context: CanvasRenderingContext2D): void;
}
class LineCommand implements Displayable {
    line : Point[] = [];
    display(context: CanvasRenderingContext2D){
        context.beginPath();
        context.strokeStyle = "black";
        context.lineWidth = 1;
        for(const point of this.line){
            context.lineTo(point.x, point.y)
        }
        context.stroke();
        context.closePath();
    }
    drag(x : number, y : number){
        this.line.push({x, y});
    }
}
let displayCommands : Displayable[] = [];
let currentCommand = new LineCommand();
let redoCommands : Displayable[] = [];

canvas.addEventListener("mousedown", (e) => {
    redoCommands = [];
    isMouseDown = true;

    currentCommand = new LineCommand();
    currentCommand.drag(e.offsetX, e.offsetY);
    displayCommands.push(currentCommand);
    canvas.dispatchEvent(drawingChangedEvent);
});
canvas.addEventListener("mousemove", (e) => {
    if (isMouseDown) {
        currentCommand.drag(e.offsetX, e.offsetY);
        canvas.dispatchEvent(drawingChangedEvent);
    }
});
canvas.addEventListener("mouseup", (e) => {
    isMouseDown = false;
    currentCommand.drag(e.offsetX, e.offsetY);
    canvas.dispatchEvent(drawingChangedEvent);
});

const clearButton = document.createElement("button");
clearButton.innerHTML = "CLEAR";
app.append(clearButton);
clearButton.addEventListener("mousedown", () => {
    displayCommands = []
    context.clearRect(0, 0, canvas.height, canvas.width);
});

const drawingChangedEvent = new Event("drawing-changed");
canvas.addEventListener("drawing-changed", () => {
    context.clearRect(0, 0, canvas.height, canvas.width);
    for (const command of displayCommands){
        command.display(context)
    }
});

const undoButton = document.createElement("button");
undoButton.innerHTML = "undo";
app.append(undoButton);
undoButton.addEventListener("mousedown", () => {
    if(lines.length > 0){
        redoList.push(lines.pop()!);
        canvas.dispatchEvent(drawingChangedEvent);
    }

    //new
    if(displayCommands.length > 0){
        redoCommands.push(displayCommands.pop()!);
        canvas.dispatchEvent(drawingChangedEvent);
    }
});

const redoButton = document.createElement("button");
redoButton.innerHTML = "redo";
app.append(redoButton);
redoButton.addEventListener("mousedown", () => {
    if(redoList.length > 0){
        lines.push(redoList.pop()!);
        canvas.dispatchEvent(drawingChangedEvent);
    }

    //new
    if(redoCommands.length > 0){
        displayCommands.push(redoCommands.pop()!);
        canvas.dispatchEvent(drawingChangedEvent);
    }
});