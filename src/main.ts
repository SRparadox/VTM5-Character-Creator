import "./style.css";

let isDraw = false;
let point = [0,0];
let mousePositions = [];

const size = 256;
const app = document.querySelector<HTMLDivElement>("#app")!;
const canv = document.getElementById("canvas");
const ctx = canv.getContext("2d");

const Title = "Title";

const header = document.createElement("h1");
header.innerHTML = Title;
app.append(header);

const clearButton = document.createElement("button");
clearButton.textContent = "Clear"; //moon emoji
app.append(clearButton);

ctx.fillStyle = "blue";
ctx.fillRect(0, 0, size, size);

document.title = Title;

clearButton.addEventListener("click", () => {
    ctx.clearRect(0,0,size,size);
    ctx.fillRect(0, 0, size, size);
})

//functions borrowed from: https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event
// Add the event listeners for mousedown, mousemove, and mouseup
canv.addEventListener("mousedown", (e) => 
{
    point[0] = e.offsetX;
    point[1] = e.offsetY;
    isDraw = true;
});

canv.addEventListener("mousemove", (e) => 
{
    if (isDraw) {
        drawLine(ctx, point[0], point[1], e.offsetX, e.offsetY);
        point[0] = e.offsetX;
        point[1] = e.offsetY;

    }
});

globalThis.addEventListener("mouseup", (e) => {
    if (isDraw) {
        drawLine(ctx, point[0], point[1], e.offsetX, e.offsetY);
        point[0] = 0;
        point[1] = 0;
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
  