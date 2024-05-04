import { GameObject } from "../GameObject/GameObject";
import { Game } from "../Game";

export class Stage {
    stageObjects: GameObject[] = [];
    game: Game;
    name: string;

    constructor(game: Game, name: string) {
        this.game = game;
        this.name = name;
    }

    update() {
        for (let i = this.stageObjects.length-1; i >= 0; i--) {
            if (!this.stageObjects[i].loading) {
                this.stageObjects[i].update();
                this.stageObjects[i].draw();
            }
        }
    }

    add(obj: GameObject) {
        this.stageObjects.push(obj);
    }

    remove(obj: GameObject) {
        this.stageObjects.slice(this.stageObjects.indexOf(obj), 1);
    }
}
