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


class Cursor implements Displayable {
    x : number;
    y : number;
    constructor(x : number, y : number){
        this.x = x;
        this.y = y;
    }
    display(context: CanvasRenderingContext2D){
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
    draw(context: CanvasRenderingContext2D){
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
    drag(x : number, y : number){
        this.x = x;
        this.y = y;
    }
}

class Sticker implements Displayable {
    x : number = 0;
    y : number = 0;
    sticker : string;
    constructor(x : number, y : number, sticker : string){
        this.x = x;
        this.y = y;
        this.sticker = sticker;
    }
    display(context: CanvasRenderingContext2D){
        context.font = "30px serif";
        context.fillText(this.sticker, this.x, this.y);
    }
    draw(context: CanvasRenderingContext2D){
        context.font = "30px serif";
        context.fillText(this.sticker, this.x, this.y);
    }
    drag(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
let cursorCommand : Displayable = new Cursor(0, 0);


canvas.addEventListener("mousedown", (e) => {
    redoCommands = [];
    isMouseDown = true;

    if(cursorCommand instanceof Sticker){
        const sticker = new Sticker(e.offsetX, e.offsetY, cursorCommand.sticker);
        displayCommands.push(sticker);
    }
    else{
        currentCommand = new LineCommand();
        currentCommand.lineSize = lineSize;
        currentCommand.drag(e.offsetX, e.offsetY);
        displayCommands.push(currentCommand);
    }

    canvas.dispatchEvent(drawingChangedEvent);
});
canvas.addEventListener("mousemove", (e) => {
    if (isMouseDown && cursorCommand instanceof Cursor) {
        currentCommand.drag(e.offsetX, e.offsetY);
        canvas.dispatchEvent(drawingChangedEvent);
    }
    else{
        cursorCommand.drag(e.offsetX, e.offsetY);
        canvas.dispatchEvent(toolMovedEvent);
    }
    
});
canvas.addEventListener("mouseup", (e) => {
    isMouseDown = false;
    if(cursorCommand instanceof Cursor){
        currentCommand.drag(e.offsetX, e.offsetY);
    }
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

const toolMovedEvent = new CustomEvent("tool-moved");
canvas.addEventListener("tool-moved", () => {
    canvas.dispatchEvent(drawingChangedEvent);
    cursorCommand.draw(context);
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
smallLineButton.addEventListener("mousedown", (e) => {
    lineSize = 1;
    cursorCommand = new Cursor(e.offsetX, e.offsetY);
});

const bigLineButton = document.createElement("button");
bigLineButton.innerHTML = "big line";
buttonPanel.append(bigLineButton);
bigLineButton.addEventListener("mousedown", (e) => {
    lineSize = 4;
    cursorCommand = new Cursor(e.offsetX, e.offsetY);
});

const stickerPanel = document.createElement("div");
app.append(stickerPanel);

let stickerList : string[] = ["😸", "😀", "😈"];
function createStickerButton (s : string){
    const sticker = document.createElement("button");
    sticker.innerHTML = s;
    stickerPanel.append(sticker);
    sticker.addEventListener("mousedown", () => { // should change background color too
        canvas.dispatchEvent(toolMovedEvent);
        cursorCommand = new Sticker(0, 0, s);
    });
}
for(let i = 0; i < stickerList.length; i++){
    createStickerButton(stickerList[i]);
}

const customPanel = document.createElement("div");
app.append(customPanel);

const customSticker = document.createElement("button");
customSticker.innerHTML = "add custom sticker";
customPanel.append(customSticker);
customSticker.addEventListener("mousedown", () => { // should change background color too
    const newSticker : string = prompt("Give new sticker", "🧽")!;
    if(newSticker && stickerList.indexOf(newSticker) == -1){
        stickerList.push(newSticker);
        createStickerButton(newSticker);
    }
});
