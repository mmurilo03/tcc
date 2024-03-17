import { Context } from "./Context";

export interface Coordinates {
    x: number;
    y: number;
}

export interface GameObjectInterface {
    context: Context;
    imageName: string;
    x: number;
    y: number;
    width: number;
    height: number;
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
