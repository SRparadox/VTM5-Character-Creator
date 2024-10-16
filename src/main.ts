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

const thickLine = 10;
const thinLine = 1;
let nextLineWidth = thinLine;

interface Point {
    x: number,
    y: number,
}

interface Displayable {
    display(ctx: CanvasRenderingContext2D): void
}

class MarkerCommand {
    constructor(lineWidth: number){
        this.line = [];
        this.lineWidth = lineWidth;
    }
    line: Point[];
    lineWidth: number;
    
    display(ctx: CanvasRenderingContext2D) {
        ctx.lineWidth = this.lineWidth;
        if (this.line.length > 0) {
            ctx.beginPath();
            const startingPoint: Point = this.line[0];
            ctx.moveTo(startingPoint.x,startingPoint.y);
            for (const point of this.line) {
                ctx.lineTo(point.x, point.y);
            }
            ctx.stroke();
        };
    }
    drag(x: number, y: number) {
        currentCommand.line.push({x, y});
    }
}

//cxt.lineWidth

const displayableCommands: Displayable[] = [];
let currentCommand = new MarkerCommand(nextLineWidth);
const redoCommands: Displayable[] = [];

const cursor = {active: false}; 

//mouse moving
const drawingChangeEvent = new Event('drawing-changed');

canvas.addEventListener("mousedown", (e) => {
    cursor.active = true;
    currentCommand = new MarkerCommand(nextLineWidth);
    currentCommand.drag(e.offsetX, e.offsetY);
    displayableCommands.push(currentCommand);
    canvas.dispatchEvent(drawingChangeEvent);
})

canvas.addEventListener("mouseup", ()=> {
    cursor.active = false;
    canvas.dispatchEvent(drawingChangeEvent);
})

canvas.addEventListener("mousemove", (e) => {
    if (cursor.active) {
        currentCommand.line.push({x: e.offsetX, y: e.offsetY});
        canvas.dispatchEvent(drawingChangeEvent);
    }
})

canvas.addEventListener("drawing-changed", () => {
    drawing.clearRect(0, 0, canvas.width, canvas.height);
    for (const command of displayableCommands) {
        command.display(drawing);
    }
})

const clearButton = document.createElement("button");
clearButton.innerHTML = "clear";
app.append(clearButton);
clearButton.addEventListener("click", () => {
    drawing.clearRect(0, 0, canvas.width, canvas.height);
    displayableCommands.length = 0;
})

const undoButton = document.createElement("button");
undoButton.innerHTML = "undo";
app.append(undoButton);
undoButton.addEventListener("click", () => {
   mover(displayableCommands, redoCommands);
});

const redoButton = document.createElement("button");
redoButton.innerHTML = "redo";
app.append(redoButton);
redoButton.addEventListener("click", () => {
   mover(redoCommands, displayableCommands);
});

function mover (source: Displayable[], dest: Displayable[]) {
    if(source.length != 0) {
        const movedLine = source.pop();
        if (movedLine) {
            dest.push(movedLine);
        }
        canvas.dispatchEvent(drawingChangeEvent);
    }
}

const thinButton = document.createElement("button");
thinButton.innerHTML = "thin"
app.append(thinButton);
thinButton.addEventListener("click", () => {
    nextLineWidth = thinLine;
});

const thickButton = document.createElement("button");
thickButton.innerHTML = "thick"
app.append(thickButton);
thickButton.addEventListener("click", () => {
    nextLineWidth = thickLine;
 });