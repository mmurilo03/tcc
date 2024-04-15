import { GameObjectInterface, ObjectProps } from "../Interfaces/GameObjectInterfaces";
import { GameObject } from "./GameObject";

export class GameObjectStatic extends GameObject {
    constructor(objectProps: ObjectProps, gameObjectInterface: GameObjectInterface) {
        super(objectProps, gameObjectInterface, {
            state: "static",
            previousState: "static",
            animationFrames: { static: { start: 0, end: 0, duration: 0 } },
        });
    }
}
