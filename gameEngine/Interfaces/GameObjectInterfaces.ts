import { Game } from "../Game";

export interface Coordinates {
    x: number;
    y: number;
}

export interface ObjectProps {
    game: Game;
    x: number;
    y: number;
    precision?: number;
    imagePath: string;
    width: number;
    height: number;
    clickable: boolean;
}

export interface ObjectPropsSimple {
    game: Game;
    x: number;
    y: number;
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
    clicked: boolean;
    highlighted: boolean;
    outline: string;
    outlineColor: string;
    fillColor: string;
    outlineWidth: number;
    name?: string;
    flippedImageElement: HTMLImageElement;
}

export interface AnimationFrame {
    [propName: string]: { duration: number, frames: number[] };
}

export interface DynamicGameObjectProperties {
    state: string;
    animationFrames: AnimationFrame;
}
