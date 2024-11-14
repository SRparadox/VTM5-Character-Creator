export interface Point {
    x: number,
    y: number,
}

export interface Displayable {
    display(ctx: CanvasRenderingContext2D): void
    drag(x: number, y:number): void;
}

