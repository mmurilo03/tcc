import { Dimensions } from "./Interfaces/Dimensions.ts";
import { Stage } from "./GameStages/Stage.ts";

interface Stages {
    [propName: string]: Stage;
}

export class Game {
    width: number;
    height: number;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    inputs: string[] = [];
    stages: Stages = {};
    activeStage?: Stage;

    constructor({ width, height }: Dimensions) {
        this.width = width;
        this.height = height;

        this.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;
    }

    addInput(key: string) {
        if (this.inputs.includes(key)) return;
        this.inputs.push(key);
    }

    removeInput(key: string) {
        if (!this.inputs.includes(key)) return;
        this.inputs.splice(this.inputs.indexOf(key), 1);
    }

    update() {
        if (this.activeStage) {
            this.activeStage.update();
        }
    }

    addStage(stage: Stage) {
        this.stages[stage.name] = stage;
    }

    changeStage(name: string) {
        this.activeStage = this.stages[name];
    }
}
