import { ObjectProps } from "../Interfaces/GameObjectInterfaces";
import { GameObject } from "./GameObject";

export class GameObjectStatic extends GameObject {
    constructor(objectProps: ObjectProps) {
        super(objectProps);
    }
}
