import { GameObject } from "../GameObject/GameObject";
import { Game } from "../Game";
import { Background } from "./Background";

export class Stage {
    stageObjects: GameObject[] = [];
    numberOfObjects: number = 0;
    game: Game;
    name: string;
    activeBackground: Background | undefined;
    backgrounds: Background[] = [];

    constructor(game: Game, name: string) {
        this.game = game;
        this.name = name;
    }

    update() {
        for (let i = this.stageObjects.length - 1; i >= 0; i--) {
            if (!this.stageObjects[i].loading) {
                this.stageObjects[i].update();
                this.stageObjects[i].draw();
            }
        }
    }

    add(obj: GameObject) {
        this.stageObjects.push(obj);
        this.numberOfObjects++;
        this.numberOfObjects += obj.otherObjects.length;
    }

    remove(obj: GameObject) {
        this.stageObjects.splice(this.stageObjects.indexOf(obj), 1);
    }

    setBackground(imagePath: string) {
        this.activeBackground = this.backgrounds.find((background: Background) => {
            return background.imagePath == imagePath;
        })
        if (this.activeBackground) {
            this.game.setBackground(imagePath, this.activeBackground);
        }
    }

    addBackground(background: Background) {
        this.backgrounds.push(background);
    }

    removeBackground(background: Background) {
        this.backgrounds.slice(this.backgrounds.indexOf(background), 1);
    }
}
