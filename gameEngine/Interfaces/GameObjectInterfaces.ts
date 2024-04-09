import { Game } from "../Game";

export interface Coordinates {
    x: number;
    y: number;
}

export interface GameObjectInterface {
    game: Game;
    objId: string;
    context: CanvasRenderingContext2D;
    imagePath: string;
    x: number;
    y: number;
    width: number;
    height: number;
    clickable: boolean;
}

export interface GameObjectHiddenProperties {
    imageElement: HTMLImageElement;
    hitboxCount: number;
    activeFrame: number;
    frameCounter: number;
    flip: boolean;
    hitboxes: Array<Array<Array<string>>>;
    animationImagePosition: Array<Coordinates>;
    clicked: boolean;
}

export interface AnimationFrame {
    [propName: string]: { start: number; end: number; duration: number };
}

export interface GameObjectProperties {
    state: string;
    animationFrames: AnimationFrame;
    previousState?: string;
}

export interface GameObjectDraw {
    loading: boolean;
    update(): any;
    draw(): void;
}
