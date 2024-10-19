import "./style.css";

let isDraw = false;
let x = 0;
let y = 0;
let mousePositions = [];
let redoPositions = [];
let thisLine = null;
let thickness: number[] = [];
let redoThickness: number[] = [];
let currentThick = false;
let mouseX:number;
let mouseY:number;

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

const penType: selectTool = {
    construct(width){
        
    },

    moveCursor(){
        ctx.move(x, y);
    }
}

const changEvent = new Event("drawing-changed");
const toolMoved = new Event("tool-moved");

header.innerHTML = Title;
app.append(header);

ctx.fillStyle = "blue";
ctx.fillRect(0, 0, size, size);

document.title = Title;

thinButton.addEventListener("click", () => {
    currentThick = false;
})

thickButton.addEventListener("click", () => {
    currentThick = true;
})

clearButton.addEventListener("click", () => {
    ctx.clearRect(0,0,size,size);
    ctx.fillRect(0, 0, size, size);
    mousePositions = [];
    thickness = [];
})

globalThis.addEventListener("drawing-changed", (e) => {
    redraw();
})

interface displayObj {
    x: number;
    y: number;
    display(context : CanvasRenderingContext2D): void;
}

interface repLines{
    construct(x: number, y: number): void;
    drag(x: number, y: number): void;
}

interface selectTool{
    construct(thickness: number): void;
    x: number;
    y: number;
    moveCursor(): void;
}


globalThis.addEventListener("tool-moved", (e) => {
    
    ctx.moveTo(x, y);
})

canvas.addEventListener("mouseenter", (e) => {
    ctx.arc(x, y, 1, 0, 2*Math.PI);
    ctx.stroke();
    dispatchEvent(toolMoved);
    
})

canvas.addEventListener("mouseleave", () => {

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

        ctx.lineWidth = thickness[n];
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
    x = e.offsetX;
    y = e.offsetY;
    isDraw = true;
    if (currentThick){
        thickness.push(4);
    }else{
        thickness.push(1);
    }
    thisLine = [];
    redoPositions.splice(0, redoPositions.length);
    thisLine.push({x: x, y: y});
    mousePositions.push(thisLine);
    dispatchEvent(changEvent);
});

canvas.addEventListener("mousemove", (e) => {
    dispatchEvent(toolMoved);
    x = e.offsetX;
    y = e.offsetY;
    if (isDraw) {
        thisLine.push({x: x, y: y})
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

  