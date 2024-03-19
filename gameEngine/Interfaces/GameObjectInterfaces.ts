export interface Coordinates {
    x: number;
    y: number;
}

export interface GameObjectInterface {
    context: CanvasRenderingContext2D;
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
    hitboxes: Array<Array<Array<string>>>;
    animationFrame?: Array<Coordinates>;
}
