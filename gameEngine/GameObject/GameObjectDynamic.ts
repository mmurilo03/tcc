import { GameObjectInterface, GameObjectProperties } from "../Interfaces/GameObjectInterfaces";
import { GameObject } from "./GameObject";

export class GameObjectDynamic extends GameObject {
    constructor(gameObjectInterface: GameObjectInterface, gameObjectProperties: GameObjectProperties) {
        super(gameObjectInterface, gameObjectProperties);
    }

    update() {
        super.update();
        this.frameCounter++;

        if (this.state != this.previousState) {
            this.previousState = this.state;
            this.activeFrame = this.animationFrames[this.state].start;
        }
        if (this.frameCounter > this.animationFrames[this.state].duration) {
            this.frameCounter = 0;
            this.activeFrame++;
            if (this.activeFrame > this.animationFrames[this.state].end) {
                this.activeFrame = this.animationFrames[this.state].start;
            }
        }
    }
}
