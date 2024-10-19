import { GameObjectDynamic } from "../../gameEngine/GameObject/GameObjectDynamic";
import { ObjectPropsSimple } from "../../gameEngine/Interfaces/GameObjectInterfaces";

export class GreenSlime extends GameObjectDynamic {
    static imagePath: string = "greenSlime.png";
    constructor({ game, x, y }: ObjectPropsSimple) {
        super(
            {
                clickable: true,
                game: game,
                x: x,
                y: y,
                height: 200,
                width: 200,
                imagePath: GreenSlime.imagePath,
            },
            { animationFrames: { idle: { duration: 10 + Math.floor(Math.random()*10), frames: [0, 1, 2, 3] } }, state: "idle" }
        );
    }
}
