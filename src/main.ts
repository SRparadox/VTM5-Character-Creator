import "./style.css";

const APP_NAME = "Draw your hearts content";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;
app.innerHTML = APP_NAME;


function app_setup() {

    //App Title Settings
    const title = document.createElement('h1');
    title.textContent = 'Colors of the Wind';
    document.body.appendChild(title);

    //Canvas Settings
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    canvas.id = 'appCanvas';
    document.body.appendChild(canvas);

}

document.addEventListener('DOMContentLoaded', app_setup);