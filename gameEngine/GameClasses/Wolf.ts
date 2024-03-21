import { GameObject } from "../GameObject/GameObject";
import { Game } from "../main";

interface WolfProps {
    game?: Game;
    context: CanvasRenderingContext2D;
    x: number;
    y: number;
}

export class Wolf extends GameObject {
    static imagePath: string = "playerTestImage.png";
    static height: number = 100;
    static width: number = 100;
    constructor({ game, context, x, y }: WolfProps) {
        super({
            game: game,
            context: context,
            x,
            y,
            height: Wolf.height,
            width: Wolf.width,
            imagePath: Wolf.imagePath,
        });
    }

    update(n: number) {
        super.update(n);
        if (
            this.game?.inputs.includes("a") &&
            this.game.inputs.indexOf("a") > this.game.inputs.indexOf("d")
        ) {
            this.x -= 1;
        } else if (
            this.game?.inputs.includes("d") &&
            this.game.inputs.indexOf("d") > this.game.inputs.indexOf("a")
        ) {
            this.x += 1;
        }
    }
}
