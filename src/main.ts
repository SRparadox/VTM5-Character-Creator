import "./style.css";

const APP_NAME = "Sketchpad Demo";
document.title = APP_NAME;
const app = document.querySelector<HTMLDivElement>("#app")!;

const header = document.createElement("h1");
header.innerHTML = "Sketchpad";
app.append(header);

const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
app.append(canvas);

/*Code from https://quant-paint.glitch.me/paint0.html*/
const ctx = canvas.getContext("2d")!;

const cursor = { active: false, x: 0, y: 0 };

canvas.addEventListener("mousedown", (event) => {
  cursor.active = true;
  cursor.x = event.offsetX;
  cursor.y = event.offsetY;
});

canvas.addEventListener("mousemove", (event) => {
  if (cursor.active) {
    ctx.beginPath();
    ctx.moveTo(cursor.x, cursor.y);
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    cursor.x = event.offsetX;
    cursor.y = event.offsetY;
  }
});

canvas.addEventListener("mouseup", (_event) => {
  cursor.active = false;
});

const clearButton = document.createElement("button");
clearButton.innerHTML = "clear";
app.append(clearButton);

clearButton.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
