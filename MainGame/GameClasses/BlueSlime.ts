import { GameObjectDynamic } from "../../gameEngine/GameObject/GameObjectDynamic";
import { ObjectPropsSimple } from "../../gameEngine/Interfaces/GameObjectInterfaces";

export class BlueSlime extends GameObjectDynamic {
    static imagePath: string = "blueSlime.png";
    constructor({ game, x, y }: ObjectPropsSimple) {
        super(
            {
                clickable: true,
                game: game,
                x: x,
                y: y,
                height: 200,
                width: 200,
                imagePath: BlueSlime.imagePath,
            },
            { animationFrames: { idle: { duration: 15 + Math.floor(Math.random()*10), frames: [0, 1, 2, 3] } }, state: "idle" }
        );
    }
}
