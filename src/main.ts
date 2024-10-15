import "./style.css";

let isDraw = true;
let x = 0;
let y = 0;

const APP_NAME = "Beep";
const app = document.querySelector<HTMLDivElement>("#app")!;
const canv = document.getElementById("canvas");
const ctx = canv.getContext("2d");

const Title = "Title";

const header = document.createElement("h1");
header.innerHTML = Title;
app.append(header);

ctx.fillStyle = "blue";
ctx.fillRect(0, 0, 256, 256);

addEventListener("mousemove", (draw) => {});

onmousemove = (draw) => {};

document.title = APP_NAME;
app.innerHTML = APP_NAME;

//functions borrowed from website: https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event
canv.addEventListener("mousemove", (e) => 
{
    if (isDraw) {
        drawLine(ctx, x, y, e.offsetX, e.offsetY);
        x = e.offsetX;
        y = e.offsetY;
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
  