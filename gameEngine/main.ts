import { GameObject } from "./GameObject/GameObject.ts";
import { Dimensions } from "./Interfaces/Dimensions.ts";

export class Game {
    width: number;
    height: number;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    player: GameObject;

    constructor({ width, height }: Dimensions) {
        this.width = width;
        this.height = height;

        this.canvas = document.createElement("canvas");
        this.canvas.className = "canvas1";
        this.canvas.width = 500;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;

        this.player = new GameObject(
            {
                game: this,
                imageName: "/player2Hitboxes.png",
                x: 250,
                y: 250,
            },
            { height: 100, width: 100 }
        );
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
// console.log(game);
// container.appendChild(game.canvas);

const animate = () => {
    game.context.clearRect(0, 0, game.width, game.height);
    game.update();
    game.draw();
    requestAnimationFrame(animate);
};
animate();
