import "./style.css";

const APP_NAME = "Hello. I hope you're doing better!";
const app = document.querySelector<HTMLDivElement>("#app")!;

/*const linebreak = document.createElement("h1");
linebreak.innerHTML = "new line here. <br>"
document.body.append(linebreak);*/

const canvas = document.createElement("canvas");
document.body.append(canvas); canvas.id = "my_canvas";
const ctx = canvas.getContext("2d");
canvas.width = 256;
canvas.height = 256;

if(ctx != null){
    ctx.fillStyle = 'white';
ctx.fillRect(0, 0, 256, 256);
}


document.title = APP_NAME;
app.innerHTML = APP_NAME;
