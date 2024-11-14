import "./style.css";

const APP_NAME = "Draw your hearts content";
const app = document.querySelector<HTMLDivElement>("#app")!;

const DEFAULT_CANVAS_WIDTH = 256;
const DEFAULT_CANVAS_HEIGHT = 256;
const DEFAULT_EXPORT_WIDTH = 1024;
const DEFAULT_EXPORT_HEIGHT = 1024;

document.title = APP_NAME;
app.innerHTML = APP_NAME;

type Point = {x: number, y: number};

let drawing = false;
let Sticker = false;

let stickerOptions = ["👁", "💖", "🍑"];
let strokes: Drawable[] = [];
let currentStroke: Drawable | null = null;
let FIFObag: Drawable[] = [];
let selectedSticker: string | null = null;

interface Drawable {
    display(ctx: CanvasRenderingContext2D): void;
    drag(x: number, y: number): void;
}

let toolPreview: Drawable | null = null;
let lineThickness: number = 2;

let currentColor = getRandomColor(); 
let currentRotation: number = getRandomRotation();

function app_setup() {;

    //Canvas Settings
    const canvas = document.createElement('canvas');
    canvas.width = DEFAULT_CANVAS_WIDTH;
    canvas.height = DEFAULT_CANVAS_HEIGHT;
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

function getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

//let currentColor = getRandomColor();

function getRandomRotation(): number {
    return Math.random() * 360; 
}

function drawing_behavior(canvas: HTMLCanvasElement) {

    const pen_touch= (event: MouseEvent) => {
        if (Sticker && selectedSticker) {
            currentStroke = createSticker(event.offsetX, event.offsetY, selectedSticker);
            strokes.push(currentStroke);
            Sticker = false;
            dispatch_drawing_changed(canvas);
        } else {
            drawing = true;
            FIFObag = [];
            currentStroke = createLine(event.offsetX, event.offsetY, lineThickness);
            strokes.push(currentStroke);
            toolPreview = null;
            dispatch_drawing_changed(canvas);
        }
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

function tool_moved_behavior(canvas: HTMLCanvasElement) {
    canvas.addEventListener('mousemove', (event: MouseEvent) => {
        if (!drawing) {
            const { offsetX, offsetY } = event;
            if (Sticker && selectedSticker) {
                toolPreview = createStickerPreview(offsetX, offsetY, selectedSticker);
            } else {
                toolPreview = createToolPreview(offsetX, offsetY, lineThickness);
            }
            dispatch_tool_moved(canvas);
        }
    });

    canvas.addEventListener('mouseleave', () => {
        toolPreview = null;
        dispatch_tool_moved(canvas);
    });
}

function dispatch_tool_moved(canvas: HTMLCanvasElement) {
    const event = new Event('tool-moved');
    canvas.dispatchEvent(event);
}

function redraw_behavior(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const stroke of strokes) {
        stroke.display(ctx);
    }

    if (toolPreview && !drawing) {
        toolPreview.display(ctx);
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
                redraw_behavior(canvas);
            }
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
                redraw_behavior(canvas);
            }
        }
    });
} 

function createLine(startX: number, startY: number, thickness: number): Drawable {
    const points: Point[] = [{ x: startX, y: startY }];
    const color = currentColor;

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
                ctx.lineWidth = thickness;
                ctx.strokeStyle = color;
                ctx.stroke();
                ctx.closePath();
            }
        },
    };
}

function createSticker(x: number, y: number, sticker: string): Drawable {
    const color = currentColor;

    return {
        drag(newX: number, newY: number) {
            x = newX;
            y = newY;
        },
        display(ctx: CanvasRenderingContext2D) {
            ctx.font = "32px Arial";
            ctx.fillStyle = color;
            ctx.fillText(sticker, x, y);
        },
    };
}

function createStickerPreview(x: number, y: number, sticker: string | null): Drawable {
    return {
        display(ctx: CanvasRenderingContext2D) {
            if (sticker) {
                ctx.font = "32px Arial";
                ctx.globalAlpha = 0.5; 
                ctx.fillText(sticker, x, y);
                ctx.globalAlpha = 1.0; 
            }
        },
        drag(x: number, y: number) {}
    };
}

function createToolPreview(x: number, y: number, radius: number): Drawable {
    return {
        display(ctx: CanvasRenderingContext2D) {
            ctx.beginPath();
            ctx.arc(x, y, radius / 2, 0, 2 * Math.PI);
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = 1; // Outline the circle with thin stroke
            ctx.stroke();
            ctx.closePath();
        },

        drag(x: number, y: number) {
        }
    };
}

function marker_behavior() {
    const thin_btn = document.createElement('button');
    thin_btn.textContent = 'THIN';
    thin_btn.id = 'thinButton';
    document.body.appendChild(thin_btn);

    const thick_btn = document.createElement('button');
    thick_btn.textContent = 'THICK';
    thick_btn.id = 'thickButton';
    document.body.appendChild(thick_btn); 

    thin_btn.addEventListener('click', () => {
        lineThickness = 2; 
        randomizeToolAppearance();
        updateSelectedTool(thin_btn, thick_btn);
    });

    thick_btn.addEventListener('click', () => {
        lineThickness = 10; 
        randomizeToolAppearance();
        updateSelectedTool(thick_btn, thin_btn);
    });

    updateSelectedTool(thin_btn, thick_btn);
}

function sticker_behavior(canvas: HTMLCanvasElement) {
    const stickerContainer = document.createElement('div');
    document.body.appendChild(stickerContainer);

    stickerOptions.forEach(sticker => createStickerButton(sticker, stickerContainer, canvas));

    // Button for adding a custom sticker
    const customStickerBtn = document.createElement('button');
    customStickerBtn.textContent = "Create Custom Sticker";
    document.body.appendChild(customStickerBtn);

    customStickerBtn.addEventListener('click', () => {
        const customSticker = prompt("Custom sticker text","🌟");
        if (customSticker) {
            stickerOptions.push(customSticker); 
            createStickerButton(customSticker, stickerContainer, canvas); // Create button for new sticker
        }
    });
}

function createStickerButton(sticker: string, container: HTMLElement, canvas: HTMLCanvasElement) {
    const btn = document.createElement('button');
    btn.textContent = sticker;
    container.appendChild(btn);

    btn.addEventListener('click', () => {
        selectedSticker = sticker;
        Sticker = true;
        randomizeToolAppearance();
        dispatch_tool_moved(canvas);
    });
}

function updateSelectedTool(selectedButton: HTMLButtonElement, otherButton: HTMLButtonElement) {
    selectedButton.classList.add('selectedTool'); 
    otherButton.classList.remove('selectedTool');

    currentColor = getRandomColor();

    // Update tool preview to show the new color
    toolPreview = selectedSticker 
        ? createStickerPreview(0, 0, selectedSticker) 
        : createToolPreview(0, 0, lineThickness);
}

function randomizeToolAppearance() {
    currentColor = getRandomColor();
    currentRotation = getRandomRotation();
    toolPreview = createToolPreview(0, 0, lineThickness);
}

function export_behavior() {
    const export_btn = document.createElement('button');
    export_btn.textContent = 'EXPORT';
    export_btn.id = 'exportButton';
    document.body.appendChild(export_btn);

    export_btn.addEventListener('click', () => {
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = DEFAULT_EXPORT_WIDTH;
        exportCanvas.height = DEFAULT_EXPORT_HEIGHT;
        const exportCtx = exportCanvas.getContext('2d');
        if (!exportCtx) return;
        exportCtx.scale(DEFAULT_EXPORT_HEIGHT/DEFAULT_CANVAS_HEIGHT, DEFAULT_EXPORT_WIDTH/DEFAULT_CANVAS_WIDTH);

        for (const stroke of strokes) {
            stroke.display(exportCtx);
        }

        exportCanvas.toBlob((blob) => {
            if (blob) {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'drawing.png';
                link.click();

                URL.revokeObjectURL(link.href);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = app_setup(); 
    clear_behavior(canvas); 
    undo_redo_behavior(canvas);
    marker_behavior();
    drawing_behavior(canvas);
    tool_moved_behavior(canvas);
    sticker_behavior(canvas);
    export_behavior();

    canvas.addEventListener('tool-moved', () => {
        redraw_behavior(canvas); 
    });   
});
