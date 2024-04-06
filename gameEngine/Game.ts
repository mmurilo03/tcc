import { Dimensions } from "./Interfaces/Dimensions.ts";
import { Stage } from "./GameStages/Stage.ts";

interface Stages {
    [propName: string]: Stage;
}

interface MousePos {
    mouseX: number;
    mouseY: number;
}

export class Game {
    width: number;
    height: number;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    inputs: string[] = [];
    stages: Stages = {};
    activeStage?: Stage;
    globalObjects: Stage = new Stage(this, "global");
    mousePos: MousePos = { mouseX: 0, mouseY: 0 };
    mouseClick: boolean = false;

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
        this.globalObjects.update();
    }

    addStage(stage: Stage) {
        if (stage.name == "global") {
            this.globalObjects = stage;
        } else {
            this.stages[stage.name] = stage;
        }
    }

    changeStage(name: string) {
        this.activeStage = this.stages[name];
    }

    updateMousePos(newPos: MousePos) {
        this.mousePos = newPos;
    }

    mouseDown() {
        this.mouseClick = true;
        console.log(this.mouseClick);
    }

    mouseUp() {
        this.mouseClick = false;
        console.log(this.mouseClick);
    }
}
