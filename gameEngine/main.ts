import { GameObject } from "./GameObject/GameObject.ts";
import { Dimensions } from "./Interfaces/Dimensions.ts";
import { Wolf } from "./GameClasses/Wolf.ts";

export class Game {
    width: number;
    height: number;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    player: GameObject;
    loading: boolean = true;

    constructor({ width, height }: Dimensions) {
        this.width = width;
        this.height = height;

        this.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;

        this.player = new Wolf({
            context: this.context,
            x: 250,
            y: 250,
        });
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

export const game = new Game({ width: 500, height: 500 });

const animate = () => {
    game.context.clearRect(0, 0, game.width, game.height);
    game.update();
    game.draw();
    requestAnimationFrame(animate);
};
animate();
