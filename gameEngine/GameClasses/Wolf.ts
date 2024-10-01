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
                    idle: { duration: 5, frames: [0, 1, 2, 3, 4, 5, 6] },
                    jumpingUp: { duration: 5, frames: [7, 8, 9, 10, 11, 12, 13] },
                    jumpingDown: { duration: 5, frames: [14, 15, 16, 17, 18, 19, 20] },
                    running: { duration: 5, frames: [21, 22, 23, 24, 25, 26, 27, 28, 29] },
                    stun: { duration: 5, frames: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
                    crouch: { duration: 5, frames: [41, 42, 43, 44, 45] },
                    rolling: { duration: 5, frames: [46, 47, 48, 49, 50, 51, 52] },
                    something: { duration: 5, frames: [53, 54, 55, 56, 57, 58, 59] },
                    damaged: {
                        duration: 5,
                        frames: [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75],
                    },
                },
            }
        );
        this.previousState = this.state;
    }

    update() {
        super.update();
        const pos = this.getPositionFromBorder();

        if (!this.game?.inputs.includes("a") && !this.game?.inputs.includes("d")) {
            this.state = "idle";
        }
        if (
            this.game?.inputs.includes("a") &&
            this.game.inputs.indexOf("a") > this.game.inputs.indexOf("d")
        ) {
            this.x -= this.speed;
            this.state = "running";
            this.flip = true;
        } else if (
            this.game?.inputs.includes("d") &&
            this.game.inputs.indexOf("d") > this.game.inputs.indexOf("a")
        ) {
            this.x += this.speed;
            this.state = "running";
            this.flip = false;
        }
        if (
            this.game?.inputs.includes("w") &&
            this.game.inputs.indexOf("w") > this.game.inputs.indexOf("s")
        ) {
            this.y -= this.speed;
            this.state = "running";
        } else if (
            this.game?.inputs.includes("s") &&
            this.game.inputs.indexOf("s") > this.game.inputs.indexOf("w")
        ) {
            this.y += this.speed;
            this.state = "running";
        }

        if (pos.x < this.game.width * 0.2) {
            this.game.moveCamera(-this.speed, 0);
        } else if (pos.x + this.width > this.game.width * 0.8) {
            this.game.moveCamera(this.speed, 0);
        }
        if (pos.y < this.game.height * 0.2) {
            this.game.moveCamera(0, this.speed);
        } else if (pos.y + this.height > this.game.height * 0.8) {
            this.game.moveCamera(0, -this.speed);
        }
    }
}
