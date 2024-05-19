export interface Coordinates {
    x: number;
    y: number;
}

export interface CoordinatesAsKey {
    [propName: string]: Coordinates;
}

export interface HitboxMakerInterface {
    context: CanvasRenderingContext2D;
    imagePath: string;
    width: number;
    height: number;
    precision?: number;
}

export interface HitboxMakerProperties {
    imageElement: HTMLImageElement;
    hitboxCount: number;
    activeFrame: number;
    hitboxes: Array<Array<Array<string>>>;
    animationImagePosition: Array<Coordinates>;
    finalHitbox: { hitboxCount: number; hitboxes: string[][][]; animationImagePosition: Coordinates[] };
    loading: boolean;
}
