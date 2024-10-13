import { GameObjectDynamic } from "../../gameEngine/GameObject/GameObjectDynamic";
import { ObjectPropsSimple } from "../../gameEngine/Interfaces/GameObjectInterfaces";

export class Slash extends GameObjectDynamic {
    static imagePath: string = "slash.png";
    time = 0
    constructor({ game, x, y }: ObjectPropsSimple) {
        super(
            {
                clickable: true,
                game: game,
                x: x,
                y: y,
                height: 200,
                width: 200,
                imagePath: Slash.imagePath,
            },
            { animationFrames: { slash: { duration: 3, frames: [0, 1, 2, 3, 4, 5] } }, state: "slash" }
        );
    }
}
