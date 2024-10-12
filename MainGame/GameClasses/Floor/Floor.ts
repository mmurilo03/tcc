import { GameObjectStatic } from "../../../gameEngine/GameObject/GameObjectStatic";
import { ObjectPropsSimple } from "../../../gameEngine/Interfaces/GameObjectInterfaces";

export class Floor extends GameObjectStatic {
    static imagePath: string = "floor.png";
    static width: number = 100;
    static height: number = 10;
    constructor({ game, x, y }: ObjectPropsSimple) {
        super({
            game,
            x,
            y,
            clickable: false,
            height: Floor.height,
            width: Floor.width,
            imagePath: Floor.imagePath,
        });
    }
}
