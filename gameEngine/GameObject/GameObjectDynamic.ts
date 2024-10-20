import { AnimationFrame, DynamicGameObjectProperties, ObjectProps } from "../Interfaces/GameObjectInterfaces";
import { GameObject } from "./GameObject";

export class GameObjectDynamic extends GameObject implements DynamicGameObjectProperties {
    state: string;
    animationFrames: AnimationFrame;
    previousState: string;

    constructor(objectProps: ObjectProps, gameObjectProperties: DynamicGameObjectProperties) {
        super(objectProps);
        this.state = gameObjectProperties.state;
        this.animationFrames = gameObjectProperties.animationFrames;
    }

    update() {
        super.update();
        this.frameCounter++;

        if (this.state != this.previousState) {
            this.previousState = this.state;
            this.activeFrame = this.animationFrames[this.state].frames[0];
        }
        
        if (isNaN(this.activeFrame)) {
            return;
        }
        if (this.frameCounter > this.animationFrames[this.state].duration) {
            this.frameCounter = 0;
            this.activeFrame++;
            if (
                this.activeFrame >
                this.animationFrames[this.state].frames[this.animationFrames[this.state].frames.length - 1]
            ) {
                this.activeFrame = this.animationFrames[this.state].frames[0];
            }
        }
    }
}
