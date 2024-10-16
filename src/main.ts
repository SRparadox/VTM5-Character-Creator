import "./style.css";

const APP_NAME = "EZ SKETCH WOW!!!";
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
