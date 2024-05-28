import { GameObjectStatic } from "../../GameObject/GameObjectStatic";
import { Game } from "../../Game";
import { ObjectProps } from "../../Interfaces/GameObjectInterfaces";

export class Floor extends GameObjectStatic {
    static imagePath: string = "floor.png";
    static width: number = 100;
    static height: number = 10;
    constructor({ game, x, y }: ObjectProps) {
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
