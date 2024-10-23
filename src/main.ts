import "./style.css";

const APP_NAME = "Draw your hearts content";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;
app.innerHTML = APP_NAME;

type Point = {x: number, y: number};

let strokes: Drawable[] = [];
let currentStroke: Drawable | null = null;
let FIFObag: Drawable[] = [];

interface Drawable {
    display(ctx: CanvasRenderingContext2D): void;
    drag(x: number, y: number): void;
}

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
        FIFObag = [];
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
        FIFObag = [];
        currentStroke = createLine(event.offsetX, event.offsetY);
        strokes.push(currentStroke);
        dispatch_drawing_changed(canvas);
    };

    const pen_draw = (event: MouseEvent) => {
        if (!drawing || !currentStroke) return;

        currentStroke.drag(event.offsetX, event.offsetY);
        dispatch_drawing_changed(canvas);
    };

    const pen_off = () => {
        drawing = false;
        currentStroke = null;
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

function redraw_behavior(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const stroke of strokes) {
        stroke.display(ctx);
    }
}

function undo_redo_behavior( canvas: HTMLCanvasElement) {

    //Undo button behavior
    const undo_btn = document.createElement('button');
    undo_btn.textContent = 'UNDO';
    undo_btn.id = 'undoButton';
    document.body.appendChild(undo_btn);

    undo_btn.addEventListener('click', () => {
        if (strokes.length > 0) {
            const lastStroke = strokes.pop();
            if (lastStroke) {
                FIFObag.push(lastStroke);
            }
            dispatch_drawing_changed(canvas);
        }
    });


    
    //Redo Button behavior
    const redo_btn = document.createElement('button');
    redo_btn.textContent = 'REDO';
    redo_btn.id = 'redoButton';
    document.body.appendChild(redo_btn);

    redo_btn.addEventListener('click', () => {
        if (FIFObag.length > 0) {
            const lastUndo = FIFObag.pop();
            if (lastUndo) {
                strokes.push(lastUndo);
            }
            dispatch_drawing_changed(canvas);
        }
    });
} 

function createLine(startX: number, startY: number): Drawable {
    const points: Point[] = [{ x: startX, y: startY }];

    return {
        
        drag(x: number, y: number) {
            points.push({ x, y });
        },

        display(ctx: CanvasRenderingContext2D) {
            if (points.length > 1) {
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length; i++) {
                    ctx.lineTo(points[i].x, points[i].y);
                }
                ctx.stroke();
                ctx.closePath();
            }
        },
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = app_setup(); 
    clear_behavior(canvas); 
    undo_redo_behavior(canvas);    
});
