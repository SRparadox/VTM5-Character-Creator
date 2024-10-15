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

app.append(title);
app.append(canvas);
