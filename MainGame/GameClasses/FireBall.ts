import { GameObjectDynamic } from "../../gameEngine/GameObject/GameObjectDynamic";
import { ObjectPropsSimple } from "../../gameEngine/Interfaces/GameObjectInterfaces";

export class FireBall extends GameObjectDynamic {
    static imagePath: string = "fireBig.png";
    constructor({ game, x, y }: ObjectPropsSimple) {
        super(
            {
                clickable: true,
                game: game,
                x: x,
                y: y,
                height: 200,
                width: 200,
                imagePath: FireBall.imagePath,
            },
            { animationFrames: { fire: { duration: 20, frames: [0, 1, 2, 3] } }, state: "fire" }
        );
    }
}
