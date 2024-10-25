import "./style.css";

const APP_NAME = "Make your canvas!";
const app = document.querySelector<HTMLDivElement>("#app")!;

//let points:number[][] = [];
let lines:Line[] = [];
let undoed_lines:Line[] = [];
let marker_size = 1;

interface Point{
    x: number,
    y: number
}

class Line{
    points: Point[]
    thickness: number

    constructor(thickness:number){
        this.points = [];
        this.thickness = thickness;
    }

    addPoint(x_:number, y_:number){
        this.points.push({x:x_, y:y_});
    }

    display(ctx:CanvasRenderingContext2D):void{
        ctx.fillStyle = 'black';

        for(let i = 0; i < this.points.length; i++){
            if(ctx != null)ctx.fillStyle = 'black';
            ctx?.beginPath();
            ctx.lineWidth = this.thickness;
            for(let i = 0; i < this.points.length; i++){
                ctx?.lineTo(this.points[i].x,this.points[i].y); 
            }
            ctx?.stroke();
            ctx?.closePath();
        }
    }
}

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
            lines = [];
            undoed_lines = [];
        }
    }
}
clearctx(true);

canvas.addEventListener("mousemove", (event) => {
    if(ctx != null && is_mouse_down){
        const x = event.clientX - ctx.canvas.offsetLeft;
        const y = event.clientY - ctx.canvas.offsetTop;

        lines[lines.length - 1].addPoint(x,y);
        canvas.dispatchEvent(drawing_changed);
    }
});

const drawing_changed = new CustomEvent('drawing_changed', {});
canvas.addEventListener('drawing_changed', () => {
    if(ctx != null)
    for(let i = 0; i < lines.length; i++){
        lines[i].display(ctx);
    }
})

canvas.dispatchEvent(drawing_changed)

canvas.addEventListener("mouseup", () => {
    is_mouse_down = false; 
})
canvas.addEventListener("mousedown", () => {
    is_mouse_down = true
    const newline = new Line(marker_size);
    lines.push(newline);
    undoed_lines = [];
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
        if(ctx != null)
        lines[i].display(ctx); 
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
        if(ctx != null)
        lines[i].display(ctx); 
    }
});

document.title = APP_NAME;
//app.innerHTML = APP_NAME;


const thicken = document.createElement("button");
document.body.append(thicken); thicken.innerHTML = "thicken marker";
thicken.addEventListener("click", () => {
    if(marker_size < 10){
        marker_size += 1;
    }
    updateMarkertxt(marker_size);
});

const thin = document.createElement("button");
document.body.append(thin); thin.innerHTML = "thin marker";
thin.addEventListener("click", () => {
    if(marker_size > 1){
        marker_size -= 1;
    }
    updateMarkertxt(marker_size);
});

const markertxt = document.createElement("p");
document.body.append(markertxt);
function updateMarkertxt(size:number){
    markertxt.innerHTML = "Marker thickness is: " + size;
}
updateMarkertxt(marker_size);
