import "./style.css";

const APP_NAME = "Goodbye";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;
app.innerHTML = APP_NAME;

const test = document.createElement("h1")
test.innerHTML = "fart"
app.append(test)

const canvas = document.createElement("canvas");
canvas.id = 'canvas'; // adds element to css class
canvas.height = 256;
canvas.width = 256;
app.append(canvas)

const drawing = canvas.getContext("2d");
let isDrawing = false
let x = 0;
let y = 0;
canvas.addEventListener("mousedown", (cursor)=>{
    x = cursor.offsetX;
    y = cursor.offsetY;
    isDrawing = true;
})
canvas.addEventListener("mousemove", (cursor) => {
    if (isDrawing) {
      drawLine(drawing, x, y, cursor.offsetX, cursor.offsetY);
      x = cursor.offsetX;
      y = cursor.offsetY;
    }
});
canvas.addEventListener("mouseup", (e) => {
    if (isDrawing) {
      drawLine(drawing, x, y, e.offsetX, e.offsetY);
      x = 0;
      y = 0;
      isDrawing = false;
    }
});
function drawLine(drawing, x1, y1, x2, y2) {
    drawing.beginPath();
    drawing.strokeStyle = "black";
    drawing.lineWidth = 1;
    drawing.moveTo(x1, y1);
    drawing.lineTo(x2, y2);
    drawing.stroke();
    drawing.closePath();
}

//clear button
const clearButton = document.createElement("button")
clearButton.className = "clear_button"
clearButton.innerHTML = "CLEAR"
app.append(clearButton)
clearButton.addEventListener("mousedown", ()=>{
    drawing.clearRect(0, 0, canvas.height, canvas.width);
})