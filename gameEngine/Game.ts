import { GameObject } from "./GameObject/GameObject.ts";
import { Dimensions } from "./Interfaces/Dimensions.ts";
import { Wolf } from "./GameClasses/Wolf.ts";
import { Floor } from "./GameClasses/Floor/Floor.ts";

export class Game {
    width: number;
    height: number;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    player: GameObject;
    loading: boolean = true;
    inputs: string[] = [];

    constructor({ width, height }: Dimensions) {
        this.width = width;
        this.height = height;

        this.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;

        this.player = new Wolf({
            game: this,
            context: this.context,
            x: 250,
            y: 250,
        });
    }

    addInput(key: string) {
        if (this.inputs.includes(key)) return;
        this.inputs.push(key);
        
    }

    removeInput(key: string) {
        if (!this.inputs.includes(key)) return;
        this.inputs.splice(this.inputs.indexOf(key), 1)
    }

    update() {
        if (!this.player.loading) {
            this.player.update(0);
        }
    }

    draw() {
        if (!this.player.loading) {
            this.player.draw();
        }
    }
}