import "./style.css";

const APP_NAME = "Painter";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;
app.innerHTML = APP_NAME;

const title = document.createElement("h1");
title.innerHTML = "Painter";

const CANVAS_HEIGHT = 256;
const CANVAS_WIDTH = 256;

const canvas = document.createElement("canvas");
canvas.height = CANVAS_HEIGHT;
canvas.width = CANVAS_WIDTH;

const clearButton = document.createElement("button");
clearButton.innerHTML = "clear";
const undoButton = document.createElement("button");
undoButton.innerHTML = "undo";
const redoButton = document.createElement("button");
redoButton.innerHTML = "redo";
const thinButton = document.createElement("button");
thinButton.innerHTML = "thin";
const thickButton = document.createElement("button");
thickButton.innerHTML = "thick";
const customButton = document.createElement("button");
customButton.innerHTML = "Add Custom Emoji";
const exportButton = document.createElement("button");
exportButton.innerHTML = "export";

app.append(title);
app.append(canvas);
app.append(document.createElement("h2"));
app.append(
  clearButton,
  undoButton,
  redoButton,
  thinButton,
  thickButton,
  exportButton
);
app.append(document.createElement("div"));
app.append(customButton);
app.append(document.createElement("div"));

interface Emoji {
  emoji: string;
  button: HTMLButtonElement;
}
const button = document.createElement("button");

const availableEmojis: Emoji[] = [
  {
    emoji: "🦖",
    button,
  },
  {
    emoji: "👹",
    button,
  },
  {
    emoji: "⭐",
    button,
  },
];

for (let i = 0; i < availableEmojis.length; i++) {
  const emojiButton = document.createElement("button");
  emojiButton.innerHTML = availableEmojis[i].emoji;
  availableEmojis[i].button = emojiButton;
  emojiButton.onclick = () => {
    if (cursorSymbol != availableEmojis[i].emoji) {
      cursorSymbol = availableEmojis[i].emoji;
    } else {
      cursorSymbol = "o";
    }
    canvas.dispatchEvent(new Event("tool-moved"));
  };
  app.append(emojiButton);
}

const THIN_LINE = 2;
const THICK_LINE = 6;
let lineSize = THIN_LINE;
let cursorSymbol = "o";

class Line {
  points: [{ x: number; y: number }];
  size: number;

  constructor(x: number, y: number, s: number) {
    this.points = [{ x, y }];
    this.size = s;
  }

  drag(x: number, y: number) {
    this.points.push({ x, y });
  }

  display(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "black";
    ctx.lineWidth = this.size;
    ctx.beginPath();
    const { x, y } = this.points[0];
    ctx.moveTo(x, y);
    for (const { x, y } of this.points) {
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

class Cursor {
  x: number;
  y: number;
  symbol: string;
  constructor(x: number, y: number, symbol: string) {
    this.x = x;
    this.y = y;
    this.symbol = symbol;
  }
  display(ctx: CanvasRenderingContext2D) {
    if (this.symbol == "o") {
      ctx.font = "16px monospace";
      ctx.fillText(this.symbol, this.x - 6, this.y + 4);
    } else {
      ctx.font = "32px monospace";
      ctx.fillText(this.symbol, this.x - 16, this.y + 16);
    }
  }
}

class Sticker {
  x: number;
  y: number;
  stamp: string;
  constructor(x: number, y: number, stamp: string) {
    this.x = x;
    this.y = y;
    this.stamp = stamp;
  }
  drag(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  display(ctx: CanvasRenderingContext2D) {
    ctx.font = "32px monospace";
    ctx.fillText(this.stamp, this.x - 16, this.y + 16);
  }
}

let currentLine: Line;
let cursor: Cursor;
const lines: (Line | Sticker)[] = [];
const redoLines: Line[] = [];
let sticker: Sticker;

canvas.addEventListener("mouseout", (e) => {
  cursor = null;
  canvas.dispatchEvent(new Event("drawing-changed"));
});

canvas.addEventListener("mouseenter", (e) => {
  cursor = new Cursor(e.offsetX, e.offsetY, cursorSymbol);
  canvas.dispatchEvent(new Event("drawing-changed"));
});

canvas.addEventListener("mousedown", (e) => {
  cursor = new Cursor(e.offsetX, e.offsetY, cursorSymbol);
  if (cursorSymbol != "o") {
    sticker = new Sticker(e.offsetX, e.offsetY, cursorSymbol);
    lines.push(sticker);
  } else {
    currentLine = new Line(e.offsetX, e.offsetY, lineSize);
    lines.push(currentLine);
  }
  redoLines.splice(0, redoLines.length);
  canvas.dispatchEvent(new Event("drawing-changed"));
});

canvas.addEventListener("mousemove", (e) => {
  cursor = new Cursor(e.offsetX, e.offsetY, cursorSymbol);
  if (!currentLine) {
    if (cursorSymbol != "o") {
      canvas.dispatchEvent(new Event("tool-moved"));
      sticker.drag(e.offsetX, e.offsetY);
    }
    canvas.dispatchEvent(new Event("tool-moved"));
  } else {
    currentLine.drag(e.offsetX, e.offsetY);
  }
  canvas.dispatchEvent(new Event("drawing-changed"));
});

canvas.addEventListener("mouseup", (e) => {
  currentLine = null;
  sticker = null;
  cursor = new Cursor(e.offsetX, e.offsetY, cursorSymbol);
  canvas.dispatchEvent(new Event("drawing-changed"));
});

canvas.addEventListener("drawing-changed", () => {
  redraw();
});

canvas.addEventListener("tool-moved", () => {
  redraw();
});

function redraw() {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const line of lines) {
    line.display(ctx);
  }
  cursor.display(ctx);
  sticker.display(ctx);
}

clearButton.addEventListener("click", () => {
  const ctx = canvas.getContext("2d");
  ctx?.clearRect(0, 0, canvas.width, canvas.height);
  lines.splice(0, lines.length);
  redoLines.splice(0, redoLines.length);
});

undoButton.addEventListener("click", () => {
  if (lines.length > 0) {
    redoLines.push(lines.pop());
    canvas.dispatchEvent(new Event("drawing-changed"));
  }
});

redoButton.addEventListener("click", () => {
  if (redoLines.length > 0) {
    lines.push(redoLines.pop());
    canvas.dispatchEvent(new Event("drawing-changed"));
  }
});

thinButton.addEventListener("click", () => {
  lineSize = THIN_LINE;
  cursorSymbol = "o";
});

thickButton.addEventListener("click", () => {
  lineSize = THICK_LINE;
  cursorSymbol = "o";
});

exportButton.addEventListener("click", () => {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = 1024;
  tempCanvas.height = 1024;

  const exportCtx = canvas.getContext("2d");
  exportCtx?.scale(4, 4);

  for (const line of lines) {
    line.display(exportCtx);
  }

  const anchor = document.createElement("a");
  anchor.href = canvas.toDataURL("image/png");
  anchor.download = "sketchpad.png";
  anchor.click();
});

customButton.addEventListener("click", () => {
  const text = prompt("Add a new emoji:", "❤️");
  if (text) {
    const emojiButton = document.createElement("button");
    emojiButton.innerHTML = text;
    emojiButton.onclick = () => {
      if (cursorSymbol != text) {
        cursorSymbol = text;
      } else {
        cursorSymbol = "o";
      }
      canvas.dispatchEvent(new Event("tool-moved"));
    };
    app.append(emojiButton);
  }
});
