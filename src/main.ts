import "./style.css";

const APP_NAME = "Beep";
const app = document.querySelector<HTMLDivElement>("#app")!;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const Title = "Title";

const header = document.createElement("h1");
header.innerHTML = Title;
app.append(header);

ctx.fillStyle = "red";
ctx.fillRect(0, 0, 256, 256);


document.title = APP_NAME;
app.innerHTML = APP_NAME;
