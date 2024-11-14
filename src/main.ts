import "./style.css";
import {Point, Displayable} from "./helper.ts";



const APP_NAME = "Jack's Great, Amazing Game!";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;
app.innerHTML = APP_NAME;

const appTitle = document.createElement("h1");
appTitle.textContent = "My Cool App"
app.append(appTitle);

const canvas = document.createElement("canvas") as HTMLCanvasElement;
canvas.width = 256;
canvas.height = 256;
app.append(canvas);

const drawing = canvas.getContext('2d') as CanvasRenderingContext2D;

const thickLine = 20;
const thinLine = 2;
const fontSize = 25;
const strokeColors = ["black", "red", "orange", "yellow", "green", "blue", "purple"]
let nextLineWidth = thinLine;
let nextLineColor: string = strokeColors[0];
let nextStickerRotation: number = Math.floor(Math.random() * 360);


class MarkerCommand {
    constructor(lineWidth: number, lineColor: string){
        this.line = [];
        this.lineWidth = lineWidth;
        this.lineColor = lineColor;
    }
    line: Point[];
    lineWidth: number;
    lineColor: string;
    
    display(ctx: CanvasRenderingContext2D) {
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.lineColor;
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
    constructor(x: number, y: number, radius: number, active: boolean, color: string){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.active = active;
        this.color = color;
    }
    x: number;
    y: number;
    radius: number;
    active: boolean;
    color: string;

    draw(ctx: CanvasRenderingContext2D) {
        if(this.active) {
            ctx.strokeStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.lineWidth = thinLine;
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.stroke();
            ctx.lineWidth = nextLineWidth;
        }
    }
}

class stickerPreviewCommand {
    constructor(x:number, y:number, sticker: string, active: boolean, rotation: number) {
        this.x = x;
        this.y = y;
        this.sticker = sticker;
        this.active = active;
        this.rotation = rotation;
    }

    x: number;
    y: number;
    sticker: string;
    active: boolean;
    rotation: number;

    draw(ctx: CanvasRenderingContext2D) {
        if(this.active) {
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI)/180);
            ctx.font = `${fontSize}px serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(this.sticker, 0, 0);
            ctx.resetTransform();
        }
    }
}

class StickerCommand {
    constructor(x:number, y:number, sticker: string, rotation: number) {
        this.x = x;
        this.y = y;
        this.sticker = sticker;
        this.rotation = rotation;
    }
    x: number;
    y: number;
    sticker: string;
    rotation: number;

    display(ctx: CanvasRenderingContext2D) {
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.font = `${fontSize}px serif`;
        ctx.fillText(this.sticker, 0, 0);
        ctx.resetTransform();
    }
    drag(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}



const availableStickers = [
    "🍔",
    "👨",
    "👩"
];
let nextSticker = availableStickers[0];

const displayableCommands: Displayable[] = [];
let currentCommand: Displayable = new MarkerCommand(nextLineWidth, nextLineColor);
const redoCommands: Displayable[] = [];

const cursorDrawing = new cursorPreviewCommand(0, 0, nextLineWidth, true, nextLineColor);
const stickerPreviewDrawing = new stickerPreviewCommand(0, 0, nextSticker, false, nextStickerRotation);

const cursor = {active: false}; 

const drawingChangeEvent = new Event('drawing-changed');
const toolMovedEvent = new Event('tool-moved');

canvas.addEventListener("mousedown", (e) => {
    cursor.active = true;
    if(currentCommand instanceof MarkerCommand){
        currentCommand = new MarkerCommand(nextLineWidth, nextLineColor);
    } else if (currentCommand instanceof StickerCommand) {
        currentCommand = new StickerCommand(0, 0, nextSticker, nextStickerRotation);
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
    globalThis.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) { console.log('changed!!');})

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

//clears cursor/sticker previews from viewable canvas when mouse is not on canvas
canvas.addEventListener("mouseout", () => {
    canvas.dispatchEvent(drawingChangeEvent);
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
    nextLineColor = strokeColors[Math.floor(Math.random() * strokeColors.length)];
    cursorDrawing.color = nextLineColor;
    currentCommand = new MarkerCommand(nextLineWidth, nextLineColor);
});

const thickButton = document.createElement("button");
thickButton.innerHTML = "thick";
app.append(thickButton);

thickButton.addEventListener("click", () => {
    cursorDrawing.active = true;
    stickerPreviewDrawing.active = false;
    nextLineWidth = thickLine;
    nextLineColor = strokeColors[Math.floor(Math.random() * strokeColors.length)];
    cursorDrawing.color = nextLineColor;
    currentCommand = new MarkerCommand(nextLineWidth, nextLineColor);
 });

const customStickerButton = document.createElement("button");
customStickerButton.innerHTML = "custom sticker";
app.append(customStickerButton);
customStickerButton.addEventListener("click", () => {
    const customStickerEmoji = prompt("Custom sticker text","🧽");
    if (customStickerEmoji) {
        const customSticker: string = customStickerEmoji;
        availableStickers.push(customSticker);
        createStickerButton(customSticker);
    }
});

function createStickerButton(sticker: string) {
    const currentButton = document.createElement("button");
    currentButton.innerHTML = sticker;
    app.append(currentButton);
    currentButton.addEventListener("click", () => {
        canvas.dispatchEvent(toolMovedEvent);
        cursorDrawing.active = false;
        stickerPreviewDrawing.active = true;
        stickerPreviewDrawing.sticker = sticker;
        nextSticker = sticker;
        nextStickerRotation = Math.floor(Math.random() * 360);
        stickerPreviewDrawing.rotation = nextStickerRotation;
        currentCommand = new StickerCommand(0, 0, nextSticker, nextStickerRotation);
    })
}

for (const sticker of availableStickers) {
    createStickerButton(sticker);
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
        if(command instanceof StickerCommand) {
            tempContext.scale(4, 4);
        }
    }
    const anchor = document.createElement("a");
    anchor.href = tempCanvas.toDataURL("image/png");
    anchor.download = "sketchpad.png";
    anchor.click();
});

//// Change button text colors based on browser theme 
// Function to set button colors based on the color scheme
function updateButtonColors(scheme: 'dark' | 'light') {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.style.color = scheme === 'dark' ? 'white' : 'black'; // Set text color
    });
}

// Initial color scheme check
const currentScheme = globalThis.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
updateButtonColors(currentScheme);

// Listen for color scheme changes
globalThis.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    const newColorScheme = event.matches ? 'dark' : 'light';
    updateButtonColors(newColorScheme);
});