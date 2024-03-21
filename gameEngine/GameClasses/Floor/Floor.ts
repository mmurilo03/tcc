import { GameObject } from "../../GameObject/GameObject";
import { Game } from "../../main";

interface FloorProps {
    game?: Game;
    context: CanvasRenderingContext2D;
    x: number;
    y: number;
}

export class Floor extends GameObject {
    static imagePath: string = "floor.png";
    static width: number = 100;
    static height: number = 10;
    constructor({ game, context, x, y }: FloorProps) {
        super({
            game: game,
            context: context,
            x: x,
            y: y,
            height: Floor.height,
            width: Floor.width,
            imagePath: Floor.imagePath,
        });
    }
}
