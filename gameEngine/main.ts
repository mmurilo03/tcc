import { Game } from "./Game"

export const game = new Game({ width: 500, height: 500 });

const animate = () => {
    game.context.clearRect(0, 0, game.width, game.height);
    game.update();
    game.draw();
    requestAnimationFrame(animate);
};
animate();
