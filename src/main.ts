import "./style.css";

let isDraw = false;
let drawPositions = [];
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

const changEvent = new Event("drawing-changed");
const toolMoved = new Event("tool-moved");

thickness.push(1);
header.innerHTML = Title;
app.append(header);

ctx.fillStyle = "blue";
ctx.fillRect(0, 0, size, size);

document.title = Title;

interface displayObj {
    
    display(context : CanvasRenderingContext2D): void;
}

interface StickerObj{ //represents marker lines
    x: number,
    y: number,
    drag(changeX: number, changeY: number): void;
}

interface selectTool{
    x: number;
    y: number;
    option: number;
    construct(thickness: number): void;
    moveCursor(): void;
}

const emojiSticker: StickerObj = {
    x: 0,
    y: 0,
    drag(changeX, changeY){
        x: changeX;
        y: changeY;
    }
}

const penTool: selectTool = {
    x: 0, 
    y: 0,
    option: 0,
    construct(width){
        thickness.push(width);
    },

    moveCursor(){
        redraw();
        ctx.beginPath();
        ctx.font = "32px monospace";
        if(this.option == 1){
            ctx.fillText("🌕", penTool.x - 18, penTool.y + 10);
        }else if (this.option == 2){
            ctx.fillText("🍤", penTool.x - 18, penTool.y + 10);
        }else if (this.option == 3){
            ctx.fillText("☄️", penTool.x - 18, penTool.y + 10);
        }else{
            ctx.arc(penTool.x, penTool.y, 1, 0, 2 * Math.PI);
        }
        ctx.stroke();
    }
}

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
    drawPositions = [];
    thickness = [];
})

emoteButton1.addEventListener("click", () => {
    if(penTool.option != 1){
        penTool.option = 1;
    }else{
        penTool.option = 0;
    }
    dispatchEvent(toolMoved);
})

emoteButton2.addEventListener("click", () => {
    if(penTool.option != 2){
        penTool.option = 2;
    }else{
        penTool.option = 0;
    }
    dispatchEvent(toolMoved);
})

emoteButton3.addEventListener("click", () => {
    if(penTool.option != 3){
        penTool.option = 3;
    }else{
        penTool.option = 0;
    }
    dispatchEvent(toolMoved);
})

globalThis.addEventListener("drawing-changed", () => {
    redraw();
})

globalThis.addEventListener("tool-moved", () => {
    if (currentThick){
        ctx.lineWidth = 4;
    }else{
        ctx.lineWidth = 1;
    }
    penTool.moveCursor();
})

canvas.addEventListener("mouseleave", () => {
    redraw();
})

//functions borrowed from https://quant-paint.glitch.me/paint1.html 
undoButton.addEventListener("click", () => {
    if (drawPositions.length > 0) {
        redoPositions.push(drawPositions.pop());
        redoThickness.push(thickness.pop());
        dispatchEvent(changEvent);
    }
});

redoButton.addEventListener("click", () => {
    if (redoPositions.length > 0) {
        drawPositions.push(redoPositions.pop());
        thickness.push(redoThickness.pop());
        dispatchEvent(changEvent);
    }
});

function redraw() {
    ctx.clearRect(0, 0, size, size);
    ctx.fillRect(0,0,size, size);
    let n = 0;
    for (const line of drawPositions) {

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

function stickerDraw(){

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
    if (penTool.option == 1){

    }
    thisLine = [];
    redoPositions.splice(0, redoPositions.length);
    thisLine.push({x: penTool.x, y: penTool.y});
    drawPositions.push(thisLine);
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

  