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

const thickLine = 20;
const thinLine = 2;
let nextLineWidth = thinLine;
const fontSize = 25;

interface Point {
    x: number,
    y: number,
}

interface Displayable {
    display(ctx: CanvasRenderingContext2D): void
    drag(x: number, y:number): void;
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
        if(currentCommand instanceof MarkerCommand) {
            currentCommand.line.push({x, y});
        }
    }
}

class cursorPreviewCommand {
    constructor(x: number, y: number, radius: number, active: boolean){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.active = active;
    }
    x: number;
    y: number;
    radius: number;
    active: boolean;

    draw(ctx: CanvasRenderingContext2D) {
        if(this.active) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.lineWidth = thinLine;
            ctx.fillStyle = 'black';
            ctx.fill();
            ctx.stroke();
            ctx.lineWidth = nextLineWidth;
        }
    }
}

class stickerPreviewCommand {
    constructor(x:number, y:number, sticker: string, active: boolean) {
        this.x = x;
        this.y = y;
        this.sticker = sticker;
        this.active = active;
    }

    x: number;
    y: number;
    sticker: string;
    active: boolean

    draw(ctx: CanvasRenderingContext2D) {
        if(this.active) {
            ctx.font = `${fontSize}px serif`;
            ctx.fillText(this.sticker, this.x, this.y);
        }
    }
}

class StickerCommand {
    constructor(x:number, y:number, sticker: string) {
        this.x = x;
        this.y = y;
        this.sticker = sticker;
    }
    x: number;
    y: number;
    sticker: string;

    display(ctx: CanvasRenderingContext2D) {
        ctx.font = `${fontSize}px serif`;
        ctx.fillText(this.sticker, this.x, this.y);
    }
    drag(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

const availableStickers = [
    {symbol: "🍔"},
    {symbol: "👨"},
    {symbol: "👩"}
];

let nextSticker = availableStickers[0].symbol;

const displayableCommands: Displayable[] = [];
let currentCommand: Displayable = new MarkerCommand(nextLineWidth);
const redoCommands: Displayable[] = [];
const cursorDrawing = new cursorPreviewCommand(0, 0, nextLineWidth, true);
const stickerPreviewDrawing = new stickerPreviewCommand(0, 0, nextSticker, false);

const cursor = {active: false}; 

const drawingChangeEvent = new Event('drawing-changed');
const toolMovedEvent = new Event('tool-moved');

canvas.addEventListener("mousedown", (e) => {
    cursor.active = true;
    if(currentCommand instanceof MarkerCommand){
        currentCommand = new MarkerCommand(nextLineWidth);
    } else if (currentCommand instanceof StickerCommand) {
        currentCommand = new StickerCommand(0, 0, nextSticker);
    }
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
        if(currentCommand instanceof MarkerCommand){
            currentCommand.line.push({x: e.offsetX, y: e.offsetY});
        } else if (currentCommand instanceof StickerCommand) {
            currentCommand.drag(e.offsetX, e.offsetY);
        }
        canvas.dispatchEvent(drawingChangeEvent);
    } else {
        cursorDrawing.x = e.offsetX;
        cursorDrawing.y = e.offsetY;
        cursorDrawing.radius = nextLineWidth;
        stickerPreviewDrawing.x = e.offsetX;
        stickerPreviewDrawing.y = e.offsetY;
        canvas.dispatchEvent(toolMovedEvent);
    }
})

canvas.addEventListener("drawing-changed", () => {
    drawing.clearRect(0, 0, canvas.width, canvas.height);
    for (const command of displayableCommands) {
        command.display(drawing);
    }
})

canvas.addEventListener("tool-moved", () => {
    canvas.dispatchEvent(drawingChangeEvent);
    cursorDrawing.draw(drawing);
    stickerPreviewDrawing.draw(drawing);
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
thinButton.innerHTML = "thin";
app.append(thinButton);
thinButton.addEventListener("click", () => {
    cursorDrawing.active = true;
    stickerPreviewDrawing.active = false;
    nextLineWidth = thinLine;
    currentCommand = new MarkerCommand(nextLineWidth);
});

const thickButton = document.createElement("button");
thickButton.innerHTML = "thick";
app.append(thickButton);
thickButton.addEventListener("click", () => {
    cursorDrawing.active = true;
    stickerPreviewDrawing.active = false;
    nextLineWidth = thickLine;
    currentCommand = new MarkerCommand(nextLineWidth);
 });

 const customStickerButton = document.createElement("button");
 customStickerButton.innerHTML = "custom sticker";
 app.append(customStickerButton);
 customStickerButton.addEventListener("click", () => {
    const customStickerEmoji = prompt("Custom sticker text","🧽");
    if (customStickerEmoji) {
        const customSticker = {symbol: customStickerEmoji};
        availableStickers.push(customSticker);
        createStickerButton(customSticker);
    }
 })

function createStickerButton(sticker: {symbol: string}) {
    const currentButton = document.createElement("button");
    currentButton.innerHTML = sticker.symbol;
    app.append(currentButton);
    currentButton.addEventListener("click", () => {
        canvas.dispatchEvent(toolMovedEvent);
        cursorDrawing.active = false;
        stickerPreviewDrawing.active = true;
        stickerPreviewDrawing.sticker = sticker.symbol;
        nextSticker = sticker.symbol;
        currentCommand = new StickerCommand(0, 0, nextSticker);
    })
}

for (const sticker of availableStickers) {
    if ("symbol" in sticker) {
        createStickerButton(sticker);
    }
}

const exportButton = document.createElement("button");
exportButton.innerHTML = "export";
app.append(exportButton);
exportButton.addEventListener("click", () => {
    const tempCanvas = document.createElement("canvas") as HTMLCanvasElement;
    tempCanvas.width = 1024;
    tempCanvas.height = 1024;
    const tempContext = tempCanvas.getContext('2d') as CanvasRenderingContext2D;
    tempContext.scale(4, 4);
    tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
    for (const command of displayableCommands) {
        command.display(tempContext);
    }
    const anchor = document.createElement("a");
    anchor.href = canvas.toDataURL("image/png");
    anchor.download = "sketchpad.png";
    anchor.click();
})
