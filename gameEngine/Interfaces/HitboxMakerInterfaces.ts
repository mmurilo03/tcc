import { CanvasRenderingContext2D, Image } from "canvas";

export interface Coordinates {
    x: number;
    y: number;
}

export interface HitboxMakerInterface {
    context: CanvasRenderingContext2D;
    imagePath: string;
    width: number;    
    height: number;
}

export interface HitboxMakerProperties {
    imageElement: Image;
    hitboxCount: number;
    activeFrame: number;
    hitboxes: Array<Array<Array<string>>>;
    animationImagePosition: Array<Coordinates>;
}
