import "./style.css";

let isDraw = false;
let x = 0;
let y = 0;
let mousePositions = [];

const size = 256;
const app = document.querySelector<HTMLDivElement>("#app")!;
const canv = document.getElementById("canvas");
const ctx = canv.getContext("2d");
const Title = "Title";
const header = document.createElement("h1");
const clearButton = document.createElement("button");
const changEvent = new Event("drawing-changed");

header.innerHTML = Title;
app.append(header);

clearButton.textContent = "Clear"; //moon emoji
app.append(clearButton);

ctx.fillStyle = "blue";
ctx.fillRect(0, 0, size, size);

document.title = Title;

clearButton.addEventListener("click", () => {
    ctx.clearRect(0,0,size,size);
    ctx.fillRect(0, 0, size, size);
})

canv.addEventListener("drawing-changed", (changEvent) => {
    redraw();
})

//redraw function borrowed from https://quant-paint.glitch.me/paint1.html 
function redraw() {
    ctx.clearRect(0, 0, size, size);
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

//functions borrowed from: https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event
// Add the event listeners for mousedown, mousemove, and mouseup
canv.addEventListener("mousedown", (e) => 
{
    x = e.offsetX;
    y = e.offsetY;
    mousePositions.push([x, y]);
    isDraw = true;
});

canv.addEventListener("mousemove", (e) => 
{
    if (isDraw) {
        drawLine(ctx, x, y, e.offsetX, e.offsetY);
        x = e.offsetX;
        y = e.offsetY;
        mousePositions.push([x, y]);
        dispatchEvent(changEvent);
    }
});

globalThis.addEventListener("mouseup", (e) => {
    if (isDraw) {
        drawLine(ctx, x, y, e.offsetX, e.offsetY);
        x = 0;
        y = 0;
        mousePositions.push([x, y]);
        console.log(mousePositions);
        isDraw = false;
    }
});

function drawLine(context, x1, y1, x2, y2) {
    context.beginPath();
    context.strokeStyle = "black";
    context.lineWidth = 1;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.closePath();
  }
  