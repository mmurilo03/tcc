import { GameObjectDynamic } from "../../gameEngine/GameObject/GameObjectDynamic";
import { ObjectPropsSimple } from "../../gameEngine/Interfaces/GameObjectInterfaces";

export class Special extends GameObjectDynamic {
    static imagePath: string = "special.png";
    time = 0;
    constructor({ game, x, y }: ObjectPropsSimple) {
        super(
            {
                clickable: true,
                game: game,
                x: x,
                y: y,
                height: 200,
                width: 200,
                imagePath: Special.imagePath,
            },
            {
                animationFrames: {
                    special: { duration: 4, frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
                },
                state: "special",
            }
        );
    }
}
