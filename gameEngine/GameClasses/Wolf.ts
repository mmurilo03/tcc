import { GameObject } from "../GameObject/GameObject";
import { Game } from "../Game";

interface WolfProps {
    game: Game;
    context: CanvasRenderingContext2D;
    x: number;
    y: number;
}

export class Wolf extends GameObject {
    static imagePath: string = "playerTestImage.png";
    static height: number = 100;
    static width: number = 100;
    constructor({ game, context, x, y }: WolfProps) {
        super(
            {
                game: game,
                objId: `${Math.floor(Math.random()*100000)}`,
                context: context,
                x,
                y,
                height: Wolf.height,
                width: Wolf.width,
                imagePath: Wolf.imagePath,
            },
            {
                state: "idle",
                animationFrames: {
                    idle: { start: 0, end: 6, duration: 5 },
                    jumpingUp: { start: 7, end: 13, duration: 5 },
                    jumpingDown: { start: 14, end: 20, duration: 5 },
                    running: { start: 21, end: 29, duration: 5 },
                    stun: { start: 30, end: 40, duration: 5 },
                    crouch: { start: 41, end: 45, duration: 5 },
                    rolling: { start: 46, end: 52, duration: 5 },
                    something: { start: 53, end: 59, duration: 5 },
                    damaged: { start: 60, end: 75, duration: 5 },
                },
            }
        );
        this.previousState = this.state;
    }

    update() {
        super.update("");
        if (!this.game?.inputs.includes("a") && !this.game?.inputs.includes("d")) {
            this.state = "idle";
        }
        if (
            this.game?.inputs.includes("a") &&
            this.game.inputs.indexOf("a") > this.game.inputs.indexOf("d")
        ) {
            this.x -= 1;
            this.state = "running";
        } else if (
            this.game?.inputs.includes("d") &&
            this.game.inputs.indexOf("d") > this.game.inputs.indexOf("a")
        ) {
            this.x += 1;
            this.state = "running";
        }
    }
}
