import "./style.css";

let isDraw = false;
//let penType.x = 0;
//let penType.y = 0;
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
    x: 0, 
    y: 0,

    construct(width){
        thickness.push(width);
    },

    moveCursor(){
        ctx.arc(penType.x, penType.y, 1, 0, 2 * Math.PI);
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
    
})

canvas.addEventListener("mouseenter", (e) => {
    /*
    if (currentThick){
        ctx.lineWidth = 4;
    }else{
        ctx.lineWidth = 1;
    }
    ctx.arc(size / 2, size / 2, 1, 0, 2 * Math.PI);
    ctx.stroke();*/
    dispatchEvent(toolMoved);
    
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
    penType.x = e.offsetX;
    penType.y = e.offsetY;
    isDraw = true;
    if (currentThick){
        thickness.push(4);
    }else{
        thickness.push(1);
    }
    thisLine = [];
    redoPositions.splice(0, redoPositions.length);
    thisLine.push({x: penType.x, y: penType.y});
    mousePositions.push(thisLine);
    dispatchEvent(changEvent);
});

canvas.addEventListener("mousemove", (e) => {
    dispatchEvent(toolMoved);
    penType.x = e.offsetX;
    penType.y = e.offsetY;
    if (isDraw) {
        thisLine.push({x: penType.x, y: penType.y})
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

  