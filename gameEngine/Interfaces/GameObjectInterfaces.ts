import { Game } from "../main";

export interface Coordinates {
    x: number;
    y: number;
}

export interface GameObjectInterface {
    game: Game;
    imageName: string;
    x: number;
    y: number;
}

export interface GameObjectProperties {
    imageElement: HTMLImageElement;
    loading: boolean;
    hitboxCount: number;
    activeFrame: number;
    frameCounter: number;
    flip: boolean;
    hitboxes: Array<Array<Array<Coordinates>>>;
    animationFrame?: Array<Coordinates>;
}
