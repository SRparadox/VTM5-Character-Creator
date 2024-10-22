import "./style.css";

const APP_NAME = "Hello. I hope you're doing better!";
const app = document.querySelector<HTMLDivElement>("#app")!;

const canvas = document.createElement("canvas");
document.body.append(canvas); 
canvas.id = "my_canvas"; 

const ctx = canvas.getContext("2d");
canvas.width = 256; canvas.height = 256;
let is_mouse_down = false;
let oldx:number = -1; let oldy:number = -1;

if(ctx != null){
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 256, 256);
}

canvas.addEventListener("mousemove", (event) => {
    if(ctx != null && is_mouse_down){
        ctx.fillStyle = 'black';
        const x = event.clientX - ctx.canvas.offsetLeft;
        const y = event.clientY - ctx.canvas.offsetTop;

        ctx.beginPath();
        if(oldx != -1){ctx.moveTo(oldx,oldy);}   
        ctx.lineTo(x,y); 
        ctx.stroke();
        ctx.closePath();
            
        oldx = x; oldy = y;
    }
});
canvas.addEventListener("mouseup", () => {
    is_mouse_down = false; 
    oldx = -1; oldy = -1;
})
canvas.addEventListener("mousedown", () => {
    is_mouse_down = true
    oldx = -1; oldy = -1;
})

const clear = document.createElement("button");
document.body.append(clear); clear.innerHTML = "clear canvas";
clear.addEventListener("click", () => {
    if(ctx != null){
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 256, 256);
    }
});

document.title = APP_NAME;
app.innerHTML = APP_NAME;
