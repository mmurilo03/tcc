import { GameObject } from "../GameObject/GameObject";
import { Game } from "../Game";
import { Background } from "./Background";
import { Button } from "../GameButton/Button";

export class Stage {
    stageObjects: GameObject[] = [];
    globalObjects: GameObject[] = [];
    stageButtons: Button[] = [];
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
        for (let i = this.globalObjects.length - 1; i >= 0; i--) {
            if (!this.globalObjects[i].loading) {
                this.globalObjects[i].update();
                this.globalObjects[i].draw();
            }
        }
        for (let i = this.stageObjects.length - 1; i >= 0; i--) {
            if (!this.stageObjects[i].loading) {
                this.stageObjects[i].update();
                this.stageObjects[i].draw();
            }
        }
        for (let i = this.stageButtons.length - 1; i >= 0; i--) {
            if (!this.stageButtons[i].loading) {
                this.stageButtons[i].update();
                this.stageButtons[i].draw();
            }
        }
    }

    addObject(obj: GameObject) {
        obj.loadImage();
        this.stageObjects.push(obj);
        this.numberOfObjects++;
        this.numberOfObjects += obj.otherObjects.length;
    }

    addGlobalObject(obj: GameObject) {
        obj.loadImage();
        this.globalObjects.push(obj);
        this.numberOfObjects++;
        this.numberOfObjects += obj.otherObjects.length;
    }

    addButton(button: Button) {
        this.stageButtons.push(button);
    }

    removeObject(obj: GameObject) {
        this.stageObjects.splice(this.stageObjects.indexOf(obj), 1);
    }

    removeGlobalObject(obj: GameObject) {
        this.globalObjects.splice(this.globalObjects.indexOf(obj), 1);
    }

    getObject(name: string) {
        for (let obj of this.stageObjects) {
            if ((obj.name = name)) return obj;
        }
    }

    getGlobalObject(name: string) {
        for (let obj of this.globalObjects) {
            if ((obj.name = name)) return obj;
        }
    }

    setBackground(imagePath: string) {
        this.activeBackground = this.backgrounds.find((background: Background) => {
            return background.imagePath == imagePath;
        });
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

    init() {}
}
