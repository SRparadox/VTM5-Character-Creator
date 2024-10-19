import "./style.css";

let isDraw = false;
let mousePositions = [];
let redoPositions = [];
let thisLine = null;
let thickness: number[] = [];
let redoThickness: number[] = [];
let currentThick = false;

const size = 256;
const app = document.querySelector<HTMLDivElement>("#app")!;
const canvas = document.getElementById("canvas");
canvas.style.cursor = "none";
const ctx = canvas.getContext("2d");
const Title = "Title";
const header = document.createElement("h1");

const clearButton = document.createElement("button");
const undoButton = document.createElement("button");
const redoButton = document.createElement("button");
const thinButton = document.createElement("button");
const thickButton = document.createElement("button");
const emoteButton1 = document.createElement("button");
const emoteButton2 = document.createElement("button");
const emoteButton3 = document.createElement("button");
clearButton.textContent = "Clear";
app.append(clearButton);
undoButton.textContent = "Undo";
app.append(undoButton);
redoButton.textContent = "Redo";
app.append(redoButton);
thinButton.textContent = "Thin";
app.append(thinButton);
thickButton.textContent = "Thick";
app.append(thickButton);
emoteButton1.textContent = "🌕";
app.append(emoteButton1);
emoteButton2.textContent = "🍤";
app.append(emoteButton2);
emoteButton3.textContent = "☄️";
app.append(emoteButton3);

const penTool: selectTool = {
    x: 0, 
    y: 0,

    construct(width){
        thickness.push(width);
    },

    moveCursor(){
        ctx.arc(penTool.x, penTool.y, 1, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

const changEvent = new Event("drawing-changed");
const toolMoved = new Event("tool-moved");

thickness.push(1);
header.innerHTML = Title;
app.append(header);

ctx.fillStyle = "blue";
ctx.fillRect(0, 0, size, size);

document.title = Title;

thinButton.addEventListener("click", () => {
    currentThick = false;
    console.log("thin button clicked");
})

thickButton.addEventListener("click", () => {
    currentThick = true;
    console.log("thick button clicked");
})

clearButton.addEventListener("click", () => {
    ctx.clearRect(0,0,size,size);
    ctx.fillRect(0, 0, size, size);
    mousePositions = [];
    thickness = [];
})

emoteButton1.addEventListener("click", () => {
    ctx.font = "32px monospace";
    ctx.fillText("🌕", penTool.x, penTool.y);
})

globalThis.addEventListener("drawing-changed", (e) => {
    redraw();
})

interface displayObj {
    
    display(context : CanvasRenderingContext2D): void;
}

interface repLines{
    construct(x: number, y: number): void;
    drag(x: number, y: number): void;
}

interface selectTool{
    x: number;
    y: number;
    construct(thickness: number): void;
    moveCursor(): void;
}

globalThis.addEventListener("tool-moved", (e) => {
    if (currentThick){
        ctx.lineWidth = 4;
    }else{
        ctx.lineWidth = 1;
    }
    redraw();
    ctx.beginPath();
    ctx.arc(penTool.x, penTool.y, 1, 0, 2 * Math.PI);
    ctx.stroke();
})

canvas.addEventListener("mouseleave", () => {
    redraw();
})

//functions borrowed from https://quant-paint.glitch.me/paint1.html 
undoButton.addEventListener("click", () => {
    if (mousePositions.length > 0) {
        redoPositions.push(mousePositions.pop());
        redoThickness.push(thickness.pop());
        dispatchEvent(changEvent);
    }
});

redoButton.addEventListener("click", () => {
    if (redoPositions.length > 0) {
        mousePositions.push(redoPositions.pop());
        thickness.push(redoThickness.pop());
        dispatchEvent(changEvent);
    }
});

function redraw() {
    ctx.clearRect(0, 0, size, size);
    ctx.fillRect(0,0,size, size);
    let n = 0;
    //
    for (const line of mousePositions) {

        ctx.lineWidth = thickness[n + 1];
        if (line.length > 1) {
            ctx.beginPath();
            const { x, y } = line[0];
            ctx.moveTo(x, y);
            for (const { x, y } of line) {
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
      n++;
    }
  }

canvas.addEventListener("mousedown", (e) => {
    dispatchEvent(toolMoved);
    penTool.x = e.offsetX;
    penTool.y = e.offsetY;
    isDraw = true;
    if (currentThick){
        thickness.push(4);
    }else{
        thickness.push(1);
    }
    thisLine = [];
    redoPositions.splice(0, redoPositions.length);
    thisLine.push({x: penTool.x, y: penTool.y});
    mousePositions.push(thisLine);
    dispatchEvent(changEvent);
});

canvas.addEventListener("mousemove", (e) => {
    penTool.x = e.offsetX;
    penTool.y = e.offsetY;
    
    dispatchEvent(toolMoved);
    if (isDraw) {
        thisLine.push({x: penTool.x, y: penTool.y})
        dispatchEvent(changEvent);
    }
});

globalThis.addEventListener("mouseup", (e) => {
    dispatchEvent(toolMoved);
    if (isDraw) {
        
        //console.log(mousePositions);
        thisLine = null;
        isDraw = false;
        dispatchEvent(changEvent);
    }
});

  