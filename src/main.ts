import "./style.css";

const APP_NAME = "Jack's Great, Amazing Game!";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;
app.innerHTML = APP_NAME;

const appTitle = document.createElement("h1");
appTitle.textContent = "My Cool App"
app.append(appTitle);

const canvas = document.createElement("canvas") as HTMLCanvasElement;
app.append(canvas);
canvas.width = 256;
canvas.height = 256;

const drawing = canvas.getContext('2d') as CanvasRenderingContext2D;

const lines = [];
const redoLines = [];

const cursor = {active: false, x:0, y:0}; 
//mouse moving
canvas.addEventListener("mousedown", (e) => {
    cursor.active = true;
    cursor.x = e.offsetX;
    cursor.y = e.offsetY;
})

canvas.addEventListener("mouseup", (e)=> {
    cursor.active = false;
})

canvas.addEventListener("mousemove", (e) => {
    if (cursor.active) {
        drawing.beginPath();
        drawing.moveTo(cursor.x, cursor.y);
        drawing.lineTo(e.offsetX, e.offsetY);
        drawing.stroke();
        cursor.x = e.offsetX;
        cursor.y = e.offsetY;
    }
})

const clearButton = document.createElement("button");
clearButton.innerHTML = "clear";
app.append(clearButton);
clearButton.addEventListener("click", () => {
    drawing.clearRect(0, 0, canvas.width, canvas.height);
})