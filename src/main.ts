import "./style.css";

const APP_NAME = "Hello Sketchpad";
const app = document.querySelector<HTMLDivElement>("#app")!;

const header  = document.createElement("h1");
header.innerHTML = "Sketchpad";
app.append(header);

const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
app.append(canvas);

document.title = APP_NAME;
//app.innerHTML = APP_NAME;
