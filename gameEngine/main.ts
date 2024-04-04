import { Game } from "./Game";
import { allStages } from "./GameStages/AllStages";

export const game = new Game({ width: 500, height: 500 });

for (let Stage of allStages) {
    game.addStage(new Stage(game));
}

game.activeStage = game.stages["Stage 1"];

const animate = () => {
    game.context.clearRect(0, 0, game.width, game.height);
    game.update();
    requestAnimationFrame(animate);
};
animate();
