import { GameObjectDynamic } from "../GameObject/GameObjectDynamic";
import { ObjectPropsSimple } from "../Interfaces/GameObjectInterfaces";

export class Wolf extends GameObjectDynamic {
    static imagePath: string = "playerTestImage.png";
    static height: number = 100;
    static width: number = 100;
    speed: number = 5;
    constructor({ game, x, y }: ObjectPropsSimple) {
        super(
            {
                game,
                x,
                y,
                clickable: true,
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
        super.update();
        if (!this.game?.inputs.includes("a") && !this.game?.inputs.includes("d")) {
            this.state = "idle";
        }
        if (
            this.game?.inputs.includes("a") &&
            this.game.inputs.indexOf("a") > this.game.inputs.indexOf("d")
        ) {
            this.x -= this.speed;
            this.game.moveCamera(this.speed, 0);
            this.state = "running";
            this.flip = true;
        } else if (
            this.game?.inputs.includes("d") &&
            this.game.inputs.indexOf("d") > this.game.inputs.indexOf("a")
        ) {
            this.x += this.speed;
            this.game.moveCamera(-this.speed, 0);
            this.state = "running";
            this.flip = false;
        }
        if (
            this.game?.inputs.includes("w") &&
            this.game.inputs.indexOf("w") > this.game.inputs.indexOf("s")
        ) {
            this.y -= this.speed;
            this.game.moveCamera(0, this.speed);
            this.state = "running";
            this.flip = true;
        } else if (
            this.game?.inputs.includes("s") &&
            this.game.inputs.indexOf("s") > this.game.inputs.indexOf("w")
        ) {
            this.y += this.speed;
            this.game.moveCamera(0, -this.speed);
            this.state = "running";
            this.flip = true;
        }
        this.highlightObject();
    }
}
