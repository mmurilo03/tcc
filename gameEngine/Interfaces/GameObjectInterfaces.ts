import { Game } from "../main";

export interface Coordinates {
    x: number;
    y: number;
}

export interface GameObjectInterface {
    game?: Game
    context: CanvasRenderingContext2D;
    imagePath: string;
    x: number;
    y: number;
    width: number;
    height: number;
}


export interface GameObjectHiddenProperties {
    imageElement: HTMLImageElement;
    loading: boolean;
    hitboxCount: number;
    activeFrame: number;
    frameCounter: number;
    flip: boolean;
    hitboxes: Array<Array<Array<string>>>;
    animationImagePosition: Array<Coordinates>;
}

export interface AnimationFrame {
    [propName: string] : {start: number, end: number, duration: number}
}

export interface GameObjectProperties {
    state: string;
    animationFrames: AnimationFrame;
    previousState?: string;
}