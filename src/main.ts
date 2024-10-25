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

const smallLineSize = 1; const bigLineSize = 4;
let isMouseDown = false;
let lineSize = smallLineSize;
let lineColor = "black";

interface Point {
    x: number;
    y: number;
}
interface Displayable {
    display(context: CanvasRenderingContext2D): void;
}
class LineCommand implements Displayable {
    line: Point[] = [];
    lineSize: number = lineSize;
    lineColor: string = lineColor;
    display(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.strokeStyle = this.lineColor;
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
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    display(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.strokeStyle = lineColor;
        context.lineWidth = lineSize;
        context.moveTo(this.x, this.y);
        context.lineTo(this.x + 1, this.y);
        context.lineTo(this.x + 1, this.y - 1);
        context.lineTo(this.x, this.y - 1);
        context.lineTo(this.x, this.y);
        context.stroke();
        context.closePath();
    }
    drag(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class Sticker implements Displayable {
    x: number = 0;
    y: number = 0;
    sticker: string;
    rotation: number;
    constructor(x: number, y: number, sticker: string, rotation: number) {
        this.x = x;
        this.y = y;
        this.sticker = sticker;
        this.rotation = rotation;
    }
    display(context: CanvasRenderingContext2D) {
        context.save();
        context.translate(this.x, this.y);
        context.rotate((this.rotation / Math.PI) / 180);
        context.translate(-this.x, -this.y);
        context.fillStyle = "black"; // just in case someone adds a custom sticker that is just text
        context.font = "30px serif";
        context.textAlign = "center";
        context.fillText(this.sticker, this.x, this.y);
        context.restore();
    }
    drag(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
let cursorCommand: Displayable = new Cursor(0, 0);

canvas.addEventListener("mousedown", (e) => {
    redoCommands = [];
    isMouseDown = true;

    if (cursorCommand instanceof Sticker) {
        const sticker = new Sticker(
            e.offsetX,
            e.offsetY,
            cursorCommand.sticker,
            cursorCommand.rotation,
        );
        displayCommands.push(sticker);
    } else {
        currentCommand = new LineCommand();
        currentCommand.drag(e.offsetX, e.offsetY);
        displayCommands.push(currentCommand);
    }

    canvas.dispatchEvent(drawingChangedEvent);
});
canvas.addEventListener("mousemove", (e) => {
    cursorCommand.drag(e.offsetX, e.offsetY);
    if(isMouseDown && cursorCommand instanceof Cursor){
        currentCommand.drag(e.offsetX, e.offsetY);
    }
    canvas.dispatchEvent(toolMovedEvent);
});
canvas.addEventListener("mouseup", (e) => {
    isMouseDown = false;
    if (cursorCommand instanceof Cursor) {
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

const toolMovedEvent = new Event("tool-moved");
canvas.addEventListener("tool-moved", () => {
    canvas.dispatchEvent(drawingChangedEvent);
    cursorCommand.display(context);
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
    lineSize = smallLineSize;
    lineColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    cursorCommand = new Cursor(e.offsetX, e.offsetY);
    canvas.dispatchEvent(toolMovedEvent);
    setSelectedButton(smallLineButton);
});

const bigLineButton = document.createElement("button");
bigLineButton.innerHTML = "big line";
buttonPanel.append(bigLineButton);
bigLineButton.addEventListener("mousedown", (e) => {
    lineSize = bigLineSize;
    lineColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    cursorCommand = new Cursor(e.offsetX, e.offsetY);
    canvas.dispatchEvent(toolMovedEvent);
    setSelectedButton(bigLineButton);
});

const stickerPanel = document.createElement("div");
app.append(stickerPanel);

let stickerList: string[] = ["😸", "😀", "😈"];
function createStickerButton(s: string) {
    const sticker = document.createElement("button");
    sticker.innerHTML = s;
    stickerPanel.append(sticker);
    sticker.addEventListener("mousedown", (e) => {
        cursorCommand = new Sticker(
            e.offsetX,
            e.offsetY,
            s,
            Math.floor(Math.random() * (200 - (-200)) + -200),
        );
        canvas.dispatchEvent(toolMovedEvent);
        setSelectedButton(sticker);
    });
}
for (let i = 0; i < stickerList.length; i++) {
    createStickerButton(stickerList[i]);
}

const customPanel = document.createElement("div");
app.append(customPanel);

const customSticker = document.createElement("button");
customSticker.innerHTML = "add custom sticker";
customPanel.append(customSticker);
customSticker.addEventListener("mousedown", () => {
    const newSticker: string = prompt("Give new sticker", "🧽")!;
    if (newSticker && stickerList.indexOf(newSticker) == -1) {
        stickerList.push(newSticker);
        createStickerButton(newSticker);
    }
});

const exportButton = document.createElement("button");
exportButton.innerHTML = "export";
customPanel.append(exportButton);
exportButton.addEventListener("mousedown", () => {
    const exportCanvas = document.createElement("canvas");
    exportCanvas.height = 1024;
    exportCanvas.width = 1024;

    const exportContext = exportCanvas.getContext("2d")!;
    exportContext.scale(4, 4);

    exportCanvas.addEventListener("drawing-changed", () => {
        exportContext.fillStyle = "white";
        exportContext.fillRect(0, 0, exportCanvas.height, exportCanvas.width);
        for (const command of displayCommands) {
            command.display(exportContext);
        }
    });
    exportCanvas.dispatchEvent(drawingChangedEvent);

    const anchor = document.createElement("a");
    anchor.href = exportCanvas.toDataURL("image/png");
    anchor.download = "sketchpad.png";
    anchor.click();
});

let selectedButton: HTMLButtonElement = smallLineButton;
selectedButton.style.backgroundColor = "grey";
function setSelectedButton(button: HTMLButtonElement) {
    button.style.backgroundColor = "grey";
    selectedButton.style.backgroundColor = "";
    selectedButton = button;
}
