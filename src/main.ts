import "./style.css";

const APP_NAME = "EZ SKETCH!!!";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;

// Add an h1 element with the app title
const titleElement = document.createElement("h1");
titleElement.textContent = APP_NAME;
app.appendChild(titleElement);

// Add a canvas element with size 256x256 pixels
const canvasElement = document.createElement("canvas");
canvasElement.width = 256;
canvasElement.height = 256;
canvasElement.id = "sketchCanvas";
app.appendChild(canvasElement);

// Create a container for the tools
const toolsContainer = document.createElement("div");
toolsContainer.id = "toolsContainer";
app.appendChild(toolsContainer);

// Add a clear button
const clearButton = document.createElement("button");
clearButton.textContent = "Clear";
clearButton.id = "clearButton";
toolsContainer.appendChild(clearButton);

// Add an undo button
const undoButton = document.createElement("button");
undoButton.textContent = "Undo";
toolsContainer.appendChild(undoButton);

// Add a redo button
const redoButton = document.createElement("button");
redoButton.textContent = "Redo";
toolsContainer.appendChild(redoButton);

// Add an export button
const exportButton = document.createElement("button");
exportButton.textContent = "Export";
toolsContainer.appendChild(exportButton);

// Add a sticker sidebar
const stickerSidebar = document.createElement("div");
stickerSidebar.id = "stickerSidebar";
app.appendChild(stickerSidebar);

exportButton.addEventListener("click", () => {
    // Create a new canvas object of size 1024x1024
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = 1024;
    exportCanvas.height = 1024;
    const exportCtx = exportCanvas.getContext("2d")!;

    // Scale the context to fill the larger canvas
    exportCtx.scale(4, 4);

    // Execute all items on the display list against the new canvas
    points.forEach(item => item.display(exportCtx));

    // Trigger a file download with the contents of the canvas as a PNG file
    exportCanvas.toBlob(blob => {
        if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "sketch.png";
            a.click();
            URL.revokeObjectURL(url);
        }
    });
});

// Tool button creation and selection
const selectableToolButtons = new Map<string, HTMLButtonElement>(); // Reference to all selectable tool buttons
const createSelectableToolButton = (id: string, buttonText: string) => {
    const button: HTMLButtonElement = document.createElement("button");
    button.id = id;
    button.textContent = buttonText;
    toolsContainer.appendChild(button); // Add to tools container div
    selectableToolButtons.set(button.id, button); // Add to group of selectable buttons

    return button
}
const selectToolButton = (id: string) => {
    const newButton = selectableToolButtons.get(id);
    if (newButton) {
        selectableToolButtons.forEach(button => button.classList.remove("selectedTool"));
        newButton.classList.add("selectedTool");
    }
}

// Add thin and thick marker tool buttons
const thinButton = createSelectableToolButton("thinButton", "Thin");
selectToolButton(thinButton.id); // Start with thin marker selected

const thickButton = createSelectableToolButton("thickButton", "Thick");

// Add a color input element
const colorInput = document.createElement("input");
colorInput.type = "color";
colorInput.id = "colorInput";
colorInput.value = "#000000"; // Default color is black
toolsContainer.appendChild(colorInput);

// Define an array of stickers
const stickers = ["🎃", "👻", "🕸️"];

// Function to create sticker buttons
const createStickerButtons = () => {
    stickers.forEach((sticker, index) => {
        let stickerButton = document.getElementById(`stickerButton${index}`) as (HTMLButtonElement | null);
        if (!stickerButton) {
            stickerButton = createSelectableToolButton(`stickerButton${index}`, sticker);
            stickerSidebar.appendChild(stickerButton);
        }

        stickerButton.addEventListener("click", () => {
            currentTool = "sticker";
            currentSticker = sticker;
            toolPreview = new ToolPreview(0, 0, currentThickness, currentSticker, currentColor);

            // Move "selectedTool" class to the clicked sticker button
            selectToolButton(stickerButton.id);

            canvasElement.dispatchEvent(new Event("tool-moved"));
        });
    });
};

// Create initial sticker buttons
createStickerButtons();

// Add a button for creating a custom sticker
const customStickerButton = document.createElement("button");
customStickerButton.textContent = "Add Custom Sticker";
stickerSidebar.appendChild(customStickerButton);

customStickerButton.addEventListener("click", () => {
    const customSticker = prompt("Enter your custom sticker:", "😱");
    if (customSticker) {
        stickers.push(customSticker);
        createStickerButtons();
    }
});

const ctx = canvasElement.getContext("2d")!;
let drawing = false;
let points: Array<Drawable> = [];
let redoStack: Array<Drawable> = [];
let currentLine: MarkerLine | null = null;
let currentStickerObj: Sticker | null = null;
let currentThickness = 3; // Default thickness
let toolPreview: ToolPreview | null = null;
let currentTool: "marker" | "sticker" = "marker";
let currentSticker: string | null = null;
let currentColor = "#000000"; // Default color is black

colorInput.addEventListener("input", (event) => {
    currentColor = (event.target as HTMLInputElement).value;
});

canvasElement.addEventListener("mousedown", (event) => {
    drawing = true;
    const rect = canvasElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (currentTool === "marker") {
        currentLine = new MarkerLine(x, y, currentThickness, currentColor);
        points.push(currentLine);
    } else if (currentTool === "sticker" && currentSticker) {
        currentStickerObj = new Sticker(x, y, currentSticker);
        points.push(currentStickerObj);
    }
});

canvasElement.addEventListener("mousemove", (event) => {
    const rect = canvasElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (!drawing) {
        if (!toolPreview) {
            toolPreview = new ToolPreview(x, y, currentThickness, currentSticker, currentColor);
        } else {
            toolPreview.updatePosition(x, y);
            toolPreview.updateTool(currentThickness, currentSticker, currentColor);
        }
        canvasElement.dispatchEvent(new Event("tool-moved"));
    } else if (currentLine) {
        currentLine.drag(x, y);
        canvasElement.dispatchEvent(new Event("drawing-changed"));
    } else if (currentStickerObj) {
        currentStickerObj.drag(x, y);
        canvasElement.dispatchEvent(new Event("drawing-changed"));
    }
});

canvasElement.addEventListener("mouseup", () => {
    drawing = false;
    currentLine = null;
    currentStickerObj = null;
});

canvasElement.addEventListener("mouseleave", () => {
    toolPreview = null;
    canvasElement.dispatchEvent(new Event("tool-moved"));
});

canvasElement.addEventListener("drawing-changed", () => {
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    points.forEach(line => line.display(ctx));
});

canvasElement.addEventListener("tool-moved", () => {
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    points.forEach(line => line.display(ctx));

    if (toolPreview) {
        toolPreview.display(ctx);
    }
});

clearButton.addEventListener("click", () => {
    points = [];
    redoStack = [];
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
});

undoButton.addEventListener("click", () => {
    if (points.length > 0) {
        const lastLine = points.pop();
        if (lastLine) {
            redoStack.push(lastLine);
        }
        canvasElement.dispatchEvent(new Event("drawing-changed"));
    }
});

redoButton.addEventListener("click", () => {
    if (redoStack.length > 0) {
        const lastLine = redoStack.pop();
        if (lastLine) {
            points.push(lastLine);
        }
        canvasElement.dispatchEvent(new Event("drawing-changed"));
    }
});

thinButton.addEventListener("click", () => {
    currentTool = "marker";
    currentThickness = 4;
    currentSticker = null;
    toolPreview = new ToolPreview(0, 0, currentThickness, currentSticker, currentColor);
    selectToolButton(thinButton.id);
    canvasElement.dispatchEvent(new Event("tool-moved"));
});

thickButton.addEventListener("click", () => {
    currentTool = "marker";
    currentThickness = 7;
    currentSticker = null;
    toolPreview = new ToolPreview(0, 0, currentThickness, currentSticker, currentColor);
    selectToolButton(thickButton.id);
    canvasElement.dispatchEvent(new Event("tool-moved"));
});

interface Drawable {
    display(ctx: CanvasRenderingContext2D): void;
}

class MarkerLine implements Drawable {
    private points: Array<{ x: number, y: number }> = [];
    private thickness: number;
    private color: string;

    constructor(initialX: number, initialY: number, thickness: number, color: string) {
        this.points.push({ x: initialX, y: initialY });
        this.thickness = thickness;
        this.color = color;
    }

    drag(x: number, y: number) {
        this.points.push({ x, y });
    }

    display(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.lineWidth = this.thickness;
        ctx.strokeStyle = this.color;
        this.points.forEach((point, index) => {
            if (index === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        });
        ctx.stroke();
    }
}

class Sticker implements Drawable {
    private x: number;
    private y: number;
    private emoji: string;

    constructor(x: number, y: number, emoji: string) {
        this.x = x;
        this.y = y;
        this.emoji = emoji;
    }

    drag(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    display(ctx: CanvasRenderingContext2D) {
        ctx.font = "24px Arial";
        ctx.fillText(this.emoji, this.x, this.y);
    }
}

class ToolPreview implements Drawable {
    private x: number;
    private y: number;
    private thickness: number;
    private emoji: string | null;
    private color: string;

    constructor(x: number, y: number, thickness: number, emoji: string | null, color: string) {
        this.x = x;
        this.y = y;
        this.thickness = thickness;
        this.emoji = emoji;
        this.color = color;
    }

    updatePosition(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    updateTool(thickness: number, emoji: string | null, color: string) {
        this.thickness = thickness;
        this.emoji = emoji;
        this.color = color;
    }

    display(ctx: CanvasRenderingContext2D) {
        if (this.emoji) {
            ctx.font = "24px Arial";
            ctx.fillText(this.emoji, this.x, this.y);
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.thickness / 2, 0, Math.PI * 2);
            ctx.fillStyle = this.color; // Fill the circle with the current color
            ctx.fill();
        }
    }
}