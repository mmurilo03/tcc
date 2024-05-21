import { Game } from "../Game";

export interface Coordinates {
    x: number;
    y: number;
}

export interface ObjectProps {
    game: Game;
    context: CanvasRenderingContext2D;
    x: number;
    y: number;
    precision?: number;
}

export interface GameObjectInterface {
    imagePath: string;
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
    highlighted: boolean;
    outline: string;
}

export interface AnimationFrame {
    [propName: string]: { start: number; end: number; duration: number };
}

export interface GameObjectProperties {
    state: string;
    animationFrames: AnimationFrame;
    previousState?: string;
}