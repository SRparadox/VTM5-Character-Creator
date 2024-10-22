import "./style.css";

const APP_NAME = "Hello. I hope you're doing better!";
const app = document.querySelector<HTMLDivElement>("#app")!;

let points:number[][] = [];
let lines:number[][][] = [];
let undoed_lines:number[][][] = [];


const canvas = document.createElement("canvas");
document.body.append(canvas); 
canvas.id = "my_canvas"; 

const ctx = canvas.getContext("2d");
canvas.width = 256; canvas.height = 256;
let is_mouse_down = false;

function clearctx(clear:boolean){
    if(ctx != null){
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 256, 256);
        ctx.fillStyle = 'black';

        if(clear == true){
            points = [];
            lines = [];
        }
    }
}
clearctx(true);

canvas.addEventListener("mousemove", (event) => {
    if(ctx != null && is_mouse_down){
        const x = event.clientX - ctx.canvas.offsetLeft;
        const y = event.clientY - ctx.canvas.offsetTop;

        lines[lines.length - 1]?.push([x, y]);
        canvas.dispatchEvent(drawing_changed);
    }
});

const drawing_changed = new CustomEvent('drawing_changed', {});
canvas.addEventListener('drawing_changed', () => {
    for(let i = 0; i < lines.length; i++){
        drawPoints(lines[i]);
    }
})

canvas.dispatchEvent(drawing_changed)

function drawPoints(pnts:number[][]){

    if(pnts != undefined && pnts.length >= 1){

        if(ctx != null)ctx.fillStyle = 'black';
        ctx?.beginPath();

        for(let i = 0; i < pnts.length; i++){
            ctx?.lineTo(pnts[i][0],pnts[i][1]); 
        }
        ctx?.stroke();
        ctx?.closePath();
    }
}
canvas.addEventListener("mouseup", () => {
    is_mouse_down = false; 
    //console.log("finished line: " + lines.length)
})
canvas.addEventListener("mousedown", () => {
    is_mouse_down = true
    lines.push([]);
    undoed_lines = [];
    //console.log("adding line: " + lines.length)
})

const clear = document.createElement("button");
document.body.append(clear); clear.innerHTML = "clear canvas";
clear.addEventListener("click", () => {
    clearctx(true);
});

const undo = document.createElement("button");
document.body.append(undo); undo.innerHTML = "undo";
undo.addEventListener("click", () => {
    clearctx(false);

    if(lines.length > 0){

        undoed_lines.push(lines[lines.length - 1]);

        console.log("removed line " + lines.length)
        lines = lines.slice(0, -1)      
    }
    for(let i = 0; i < lines.length; i++){
        drawPoints(lines[i]); 
    }
});

const redo = document.createElement("button");
document.body.append(redo); redo.innerHTML = "redo";
redo.addEventListener("click", () => {
    clearctx(false);

    if(undoed_lines.length > 0){

        lines.push(undoed_lines[undoed_lines.length -1]);
        undoed_lines.pop();


    }
    for(let i = 0; i < lines.length; i++){
        drawPoints(lines[i]); 
    }
});

document.title = APP_NAME;
app.innerHTML = APP_NAME;
