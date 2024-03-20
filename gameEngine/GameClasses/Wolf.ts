import { GameObject } from "../GameObject/GameObject";

interface WolfProps {
    context: CanvasRenderingContext2D;
    x: number;
    y: number;
}

export class Wolf extends GameObject {
    static imagePath: string = "playerTestImage.png";
    static height: number = 100;
    static width: number = 100;
    constructor({ context, x, y }: WolfProps) {
        super({ context: context, height: Wolf.height, width: Wolf.width, imagePath: Wolf.imagePath, x, y });
    }
}
