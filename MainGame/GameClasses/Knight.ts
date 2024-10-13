import { GameObjectDynamic } from "../../gameEngine/GameObject/GameObjectDynamic";
import { ObjectPropsSimple } from "../../gameEngine/Interfaces/GameObjectInterfaces";

export class Knight extends GameObjectDynamic {
    static imagePath: string = "knight.png";
    speed = 5;
    constructor({ game, x, y }: ObjectPropsSimple) {
        super(
            {
                clickable: true,
                game: game,
                x: x,
                y: y,
                height: 200,
                width: 200,
                imagePath: Knight.imagePath,
            },
            {
                animationFrames: {
                    idle: { duration: 10 + Math.floor(Math.random() * 10), frames: [0] },
                    walk: { duration: 10 + Math.floor(Math.random() * 10), frames: [0, 1, 2, 3] },
                },
                state: "idle",
            }
        );
    }

    update() {
        super.update();

        if (
            this.game.inputs.includes("w") ||
            this.game.inputs.includes("a") ||
            this.game.inputs.includes("s") ||
            this.game.inputs.includes("d")
        ) {
            this.state = "walk";
        } else {
            this.state = "idle";
        }
        
        if (
            this.game?.inputs.includes("w") &&
            this.game.inputs.indexOf("w") > this.game.inputs.indexOf("s") &&
            this.y > -50
        ) {
            this.y -= this.speed;
        } else if (
            this.game?.inputs.includes("s") &&
            this.game.inputs.indexOf("s") > this.game.inputs.indexOf("w") &&
            this.y < 600
        ) {
            this.y += this.speed;
        }
        if (
            this.game?.inputs.includes("a") &&
            this.game.inputs.indexOf("a") > this.game.inputs.indexOf("d") &&
            this.x > -50
        ) {
            this.x -= this.speed;
            this.flip = true;
        } else if (
            this.game?.inputs.includes("d") &&
            this.game.inputs.indexOf("d") > this.game.inputs.indexOf("a") &&
            this.x < 1120
        ) {
            this.x += this.speed;
            this.flip = false;
        }
    }
}
