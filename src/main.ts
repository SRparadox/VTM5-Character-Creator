import "./style.css";

const APP_NAME = "Stick N Sketch";
const app = document.querySelector<HTMLDivElement>("#app")!;

// Add app title to the webpage:
const header = document.createElement("h1");
header.innerHTML = APP_NAME;
app.append(header);

document.title = APP_NAME;
app.innerHTML = APP_NAME;

// Add canvas 
const canvas = document.createElement("canvas"); // Create a canvas element
canvas.width = 256;  // Set the width
canvas.height = 256; // Set the height
app.appendChild(canvas); // Append the canvas to the app

// Optionally, You may get the context for drawing on the canvas
const context = canvas.getContext("2d");