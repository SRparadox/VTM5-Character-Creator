import "./style.css";

const APP_NAME = "Canvas Craft";
document.title = APP_NAME;
const Title = document.createElement("h2");
Title.innerHTML = APP_NAME; document.body.append(Title);

let lines:(Line|Sticker)[] = [];
let undoed_lines:(Line|Sticker)[] = [];
let marker_size = 1;
let current_color: string = "black";

interface Point{
    x: number,
    y: number
}

class Sticker{
    x: number
    y: number
    text: string
    size: number
    rotation: string

    constructor(x_:number, y_:number, text_:string, size_:number){
        this.x = x_; this.y = y_; 
        this.text = text_; this.size = size_;
        this.rotation = current_rotation;
    }

    addPoint(x_:number, y_:number){
    }

    display(ctx:CanvasRenderingContext2D):void{
        ctx.save(); ctx.translate(this.x,this.y);
        ctx.font = (10 + 5 * marker_size) + "px serif";
        ctx.rotate((parseFloat(this.rotation)*Math.PI/180));
        ctx.fillText(this.text, 0,0);
        ctx.restore();

    }
}

class Line{
    x: number
    y: number
    points: Point[]
    thickness: number
    color: string

    constructor(thickness:number){
        this.points = [];
        this.thickness = thickness;
        this.x = 0; this.y = 0;
        this.color = current_color;
    }

    addPoint(x_:number, y_:number){
        this.points.push({x:x_, y:y_});
    }

    display(ctx:CanvasRenderingContext2D):void{
        ctx.strokeStyle = this.color;

        for(let i = 0; i < this.points.length; i++){

            if(ctx != null)ctx.fillStyle = this.color;
            ctx?.beginPath();
            ctx.lineWidth = this.thickness;
            for(let i = 0; i < this.points.length; i++){
                ctx?.lineTo(this.points[i].x,this.points[i].y); 
            }
            ctx?.stroke();
            ctx?.closePath();
            ctx.lineWidth = 1;
        }
    }
}

class tool{
    x:number
    y:number
    text:string
    display_type:string

    constructor(x_:number, y_:number){
        this.x = x_;  this.y = y_;
        this.text = ""; this.display_type = "circle";
    }

    update_position(x_:number, y_:number){
        this.x = x_;  this.y = y_;
    }

    update_display(display_type_:string,  text_:string = ""){
        this.display_type = display_type_;
        this.text = text_;
    }

    display(ctx:CanvasRenderingContext2D):void{
        if(is_mouse_down == false){
            if(this.display_type == "circle"){
                ctx.beginPath();
                ctx.arc(this.x, this.y, marker_size, 0, 2 * Math.PI);
                ctx.stroke();
            }
            if(this.display_type == "string"){
                ctx.save(); ctx.translate(this.x,this.y);
                ctx.font = (10 + 5 * marker_size) + "px serif";
                ctx.rotate((parseFloat(current_rotation)*Math.PI/180));
                ctx.fillText(this.text, 0,0);
                ctx.restore();

            }
        }
    }

    assign_text(text:string){
        this.text = text;
    }

}
const preview_tool = new tool(0,0);

const canvas = document.createElement("canvas");
document.body.append(canvas); 
canvas.id = "my_canvas"; 

const ctx = canvas.getContext("2d");
canvas.width = 256; canvas.height = 256;
let is_mouse_down = false;

function clearctx(clear:boolean, ctx:CanvasRenderingContext2D){
    if(ctx != null){
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 256, 256);
        ctx.fillStyle = 'black';

        if(clear == true){
            lines = [];
            undoed_lines = [];
        }
    }
}
if(ctx != null)
clearctx(true, ctx);

canvas.addEventListener("mousemove", (event) => {
    if(ctx != null){
        const x = event.clientX - ctx.canvas.offsetLeft;
        const y = event.clientY - ctx.canvas.offsetTop;
        preview_tool.update_position(x,y);
        if(is_mouse_down){
            if((lines[lines.length - 1]) instanceof Line){
                lines[lines.length - 1].addPoint(x,y);
            }
            if((lines[lines.length - 1]) instanceof Sticker){
                lines[lines.length - 1].x = x;
                lines[lines.length - 1].y = y;
            }
        }
            canvas.dispatchEvent(tool_moved);   
    }
});

const tool_moved = new CustomEvent('tool_moved', {});
canvas.addEventListener('tool_moved', () => {
    if(ctx != null){
        if(ctx != null)
            clearctx(false, ctx);
        for(let i = 0; i < lines.length; i++){
            lines[i].display(ctx);
        }
        if(is_mouse_down == false){
            preview_tool.display(ctx);

        }
    }
    
})

canvas.addEventListener("mouseup", () => {
    is_mouse_down = false; 
})
canvas.addEventListener("mousedown", () => {
    is_mouse_down = true
    let newline;
    if(preview_tool.display_type == "circle"){
        newline = new Line(marker_size);
    }
    else if(preview_tool.display_type == "string"){
        newline = new Sticker(preview_tool.x, preview_tool.y,
        preview_tool.text, marker_size);
    }
    if(newline != undefined){lines.push(newline);}
    undoed_lines = [];
})

function setting(sett:string){
    const newline = document.createElement("h3");
    newline.innerHTML = sett; document.body.append(newline);
}
setting("Ordering");

const clear = document.createElement("button");
document.body.append(clear); clear.innerHTML = "clear canvas";
clear.addEventListener("click", () => {
    if(ctx != null)
        clearctx(true, ctx);
});

const undo = document.createElement("button");
document.body.append(undo); undo.innerHTML = "undo";
undo.addEventListener("click", () => {
    if(ctx != null)
        clearctx(false, ctx);

    if(lines.length > 0){

        undoed_lines.push(lines[lines.length - 1]);

        console.log("removed line " + lines.length)
        lines = lines.slice(0, -1)      
    }
    for(let i = 0; i < lines.length; i++){
        if(ctx != null)
        lines[i].display(ctx); 
    }
});

const redo = document.createElement("button");
document.body.append(redo); redo.innerHTML = "redo";
redo.addEventListener("click", () => {
    if(ctx != null)
        clearctx(false, ctx);

    if(undoed_lines.length > 0){

        lines.push(undoed_lines[undoed_lines.length -1]);
        undoed_lines.pop();
    }
    for(let i = 0; i < lines.length; i++){
        if(ctx != null)
        lines[i].display(ctx); 
    }
});
setting("Resizing & Rotation (right slider is rotation)");

const thicken = document.createElement("button");
document.body.append(thicken); thicken.innerHTML = "thicken marker";
thicken.addEventListener("click", () => {
    if(marker_size < 10){
        marker_size += 1;
    }
    updateMarkertxt(marker_size);
});

const thin = document.createElement("button");
document.body.append(thin); thin.innerHTML = "thin marker";
thin.addEventListener("click", () => {
    if(marker_size > 1){
        marker_size -= 1;
    }
    updateMarkertxt(marker_size);
});

const rotation = document.createElement("input"); 
rotation.type = "range"; rotation.min = "0"; rotation.max="360";
let current_rotation = '0';
rotation.addEventListener("input", (event: Event) => {
    const target = event.target as HTMLInputElement;
    current_rotation = target.value;
});
document.body.append(rotation);

const markertxt = document.createElement("p");
document.body.append(markertxt);
function updateMarkertxt(size:number){
    markertxt.innerHTML = "Marker thickness is: " + size;
}
updateMarkertxt(marker_size);

setting("Color");
const color = document.createElement("select");
document.body.append(color); 
addoption("black");addoption("red");addoption("green");addoption("blue");
addoption("yellow"); addoption("purple");
color.addEventListener('change', (event) => {
    const target = event.target as HTMLSelectElement;
    current_color = target.value;

})

function addoption(str:string){
    const option = document.createElement("option");
    option.value = str; option.text = str;
    color.appendChild(option);
}

const colortxt = document.createElement("p");
document.body.append(colortxt);

setting("Stickers");
const emoji1 = document.createElement("button");
document.body.append(emoji1); emoji1.innerHTML = "👾";
emoji1.addEventListener("click", () => {
    preview_tool.update_display("string", "👾");
});
const emoji2 = document.createElement("button");
document.body.append(emoji2); emoji2.innerHTML = "🎃";
emoji2.addEventListener("click", () => {
    preview_tool.update_display("string", "🎃");
});
const emoji3 = document.createElement("button");
document.body.append(emoji3); emoji3.innerHTML = "😇";
emoji3.addEventListener("click", () => {
    preview_tool.update_display("string", "😇");
});
const emoji4 = document.createElement("button");
document.body.append(emoji4); emoji4.innerHTML = ":3";
emoji4.addEventListener("click", () => {
    preview_tool.update_display("string", ":3");
});
const emoji5 = document.createElement("button");
document.body.append(emoji5); emoji5.innerHTML = "👻";
emoji5.addEventListener("click", () => {
    preview_tool.update_display("string", "👻");
});
const customemoji = document.createElement("button");
document.body.append(customemoji); customemoji.innerHTML = "Custom Sticker";
customemoji.addEventListener("click", () => {
    const stickertxt =  prompt("Input text for custom sticker.");
    if(stickertxt != null)
    preview_tool.update_display("string", stickertxt);
});
const emoji0 = document.createElement("button");
document.body.append(emoji0); emoji0.innerHTML = "Unselect Sticker";
emoji0.addEventListener("click", () => {
    preview_tool.update_display("circle");
});
setting("Export");

const export_button = document.createElement("button");
document.body.append(export_button); export_button.innerHTML = "Export Canvas";
export_button.addEventListener("click", () => {

    const export_canvas = document.createElement("canvas");
    document.body.append(export_canvas); 
    const export_ctx = export_canvas.getContext("2d");
    export_canvas.width = 1024; export_canvas.height =  1024;

    export_ctx?.scale(4,4);
    for(let i = 0; i < lines.length; i++){
        if(export_ctx != null)
        lines[i].display(export_ctx); 
    }

    globalThis.open(export_canvas.toDataURL("image/png"))

    if(export_ctx != null)
    clearctx(false, export_ctx);
    
    export_canvas.remove();
});
