import "./style.css";

const APP_NAME = "Draw your hearts content";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;
app.innerHTML = APP_NAME;

type Point = {x: number, y: number};

let strokes: Point[][] = [];
let currentStroke: Point[] = [];

function app_setup() {

    //App Title Settings
    const title = document.createElement('h1');
    title.textContent = 'Colors of the Wind';
    document.body.appendChild(title);

    //Canvas Settings
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    canvas.id = 'appCanvas';
    document.body.appendChild(canvas);

    drawing_behavior(canvas);

    canvas.addEventListener('drawing changed', () => {
        redraw_behavior(canvas);
    });

    return canvas;
}

function clear_behavior(canvas: HTMLCanvasElement) {

    const clear_btn = document.createElement('button');
    clear_btn.textContent = 'CLEAR';
    clear_btn.id = 'clearButton';
    document.body.appendChild(clear_btn);

    clear_btn.addEventListener('click', () => {
        strokes = [];
        currentStroke = [];
        const ctx = canvas.getContext('2d');
        if(ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    });
}


function drawing_behavior(canvas: HTMLCanvasElement) {

    let drawing = false;

    const pen_touch= (event: MouseEvent) => {
        drawing = true;
        currentStroke = [];
        const initial_contact = {x: event.offsetX, y: event.offsetY};
        currentStroke.push(initial_contact); 
    };

    const pen_draw = (event: MouseEvent) => {
        if (!drawing) return;
        const line = {x: event.offsetX, y: event.offsetY};
        currentStroke.push(line);
        dispatch_drawing_changed(canvas);
    };

    const pen_off = () => {
        if (drawing) {
            strokes.push([...currentStroke]);
        }
        drawing = false;
        currentStroke = [];
    };

    canvas.addEventListener('mousedown', pen_touch);
    canvas.addEventListener('mousemove', pen_draw);
    canvas.addEventListener('mouseup', pen_off);
    canvas.addEventListener('mouseleave', pen_off);
}

function dispatch_drawing_changed(canvas: HTMLCanvasElement) {
    const event = new Event('drawing changed');
    canvas.dispatchEvent(event);
}


document.addEventListener('DOMContentLoaded', () => {
    const canvas = app_setup(); 
    clear_behavior(canvas);     
});

function redraw_behavior(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const stroke of strokes) {
        if (stroke.length > 0) {
            ctx.beginPath();
            ctx.moveTo(stroke[0].x, stroke[0].y);
            for (let i = 1; i < stroke.length; i++) {
                ctx.lineTo(stroke[i].x, stroke[i].y);
            }
            ctx.stroke();
            ctx.closePath();
        }
    }
}