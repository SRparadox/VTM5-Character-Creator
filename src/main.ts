import "./style.css";

const APP_NAME = "Goodbye";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;
app.innerHTML = APP_NAME;

const test = document.createElement("h1")
test.innerHTML = "fart"
app.append(test)

const canvas = document.createElement("canvas");
canvas.id = 'canvas'; // adds element to css class
canvas.height = 256;
canvas.width = 256;
app.append(canvas)