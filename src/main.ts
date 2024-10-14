import "./style.css";

const APP_NAME = "Jack's Great, Amazing Game!";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;
app.innerHTML = APP_NAME;

const appTitle = document.createElement("h1");
appTitle.textContent = "My Cool App"
app.append(appTitle);

const canvas = document.createElement("canvas") as HTMLCanvasElement;
app.append(canvas);
canvas.width = 256;
canvas.height = 256;

