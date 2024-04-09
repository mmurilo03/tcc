import { GameObjectInterface } from "../Interfaces/GameObjectInterfaces";
import { GameObject } from "./GameObject";

export class GameObjectStatic extends GameObject {
    constructor(gameObjectInterface: GameObjectInterface) {
        super(gameObjectInterface, {
            state: "static",
            previousState: "static",
            animationFrames: { static: { start: 0, end: 0, duration: 0 } },
        });
    }
}
