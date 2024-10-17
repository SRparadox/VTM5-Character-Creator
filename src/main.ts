import "./style.css";

let isDraw = false;
let x = 0;
let y = 0;
let mousePositions = [];
let redoPositions = [];
let thisLine = null;

const size = 256;
const app = document.querySelector<HTMLDivElement>("#app")!;
const canv = document.getElementById("canvas");
const ctx = canv.getContext("2d");
const Title = "Title";
const header = document.createElement("h1");

const clearButton = document.createElement("button");
const undoButton = document.createElement("button");
const redoButton = document.createElement("button");
clearButton.textContent = "Clear";
app.append(clearButton);
undoButton.textContent = "Undo";
app.append(undoButton);
redoButton.textContent = "Redo";
app.append(redoButton);

const changEvent = new Event("drawing-changed");

header.innerHTML = Title;
app.append(header);

ctx.fillStyle = "blue";
ctx.fillRect(0, 0, size, size);

document.title = Title;

clearButton.addEventListener("click", () => {
    ctx.clearRect(0,0,size,size);
    ctx.fillRect(0, 0, size, size);
    mousePositions = [];
})


globalThis.addEventListener("drawing-changed", (e) => {
    //console.log("drawing-changed event");
    redraw();
})

interface displayObj {
    x: number;
    y: number;
    display(ctx : CanvasRenderingContext2D): void;
}

//functions borrowed from https://quant-paint.glitch.me/paint1.html 
undoButton.addEventListener("click", () => {
    if (mousePositions.length > 0) {
        redoPositions.push(mousePositions.pop());
        dispatchEvent(changEvent);
        console.log(mousePositions);
        console.log(redoPositions);
    }
});

redoButton.addEventListener("click", () => {
    if (redoPositions.length > 0) {
        mousePositions.push(redoPositions.pop());
        dispatchEvent(changEvent);
    }
});

function redraw() {
    ctx.clearRect(0, 0, size, size);
    ctx.fillRect(0,0,size, size);
    for (const line of mousePositions) {
      if (line.length > 1) {
        ctx.beginPath();
        const { x, y } = line[0];
        ctx.moveTo(x, y);
        for (const { x, y } of line) {
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
  }

canv.addEventListener("mousedown", (e) => {
    x = e.offsetX;
    y = e.offsetY;
    isDraw = true;
    
    thisLine = [];
    redoPositions.splice(0, redoPositions.length);
    thisLine.push({x: x, y: y});
    mousePositions.push(thisLine);
    dispatchEvent(changEvent);
});

canv.addEventListener("mousemove", (e) => {
    if (isDraw) {
        //drawLine(ctx, x, y, e.offsetX, e.offsetY);
        x = e.offsetX;
        y = e.offsetY;
        //mousePositions.push([x, y]);
        thisLine.push({x: x, y: y})
        dispatchEvent(changEvent);
    }
});

globalThis.addEventListener("mouseup", (e) => {
    if (isDraw) {
        //drawLine(ctx, x, y, e.offsetX, e.offsetY);
        //x = 0;
        //y = 0;
        //mousePositions.push([x, y]);
        console.log(mousePositions);
        thisLine = null;
        isDraw = false;
        dispatchEvent(changEvent);
    }
});

  