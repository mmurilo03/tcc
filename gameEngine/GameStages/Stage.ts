import { GameObjectDraw } from "../Interfaces/GameObjectInterfaces";
import { Game } from "../Game";

export class Stage {
    stageObjects: GameObjectDraw[] = [];
    game: Game;
    name: string;

    constructor(game: Game, name: string) {
        this.game = game;
        this.name = name;
    }

    update() {
        for (let i = 0; i < this.stageObjects.length; i++) {
            if (!this.stageObjects[i].loading) {
                this.stageObjects[i].update("");
                this.stageObjects[i].draw();
            }
        }
    }

    add(obj: GameObjectDraw) {
        this.stageObjects.push(obj);
    }

    remove(obj: GameObjectDraw) {
        this.stageObjects.slice(this.stageObjects.indexOf(obj), 1);
    }
}
