import { Game } from "./Game";
import { allStages } from "./GameStages/AllStages";

export const game = new Game({ width: 800, height: 800 });

for (let Stage of allStages) {
    game.addStage(new Stage(game));
}

game.changeStage("Stage 1");

export const animate = () => {
    game.update();
    requestAnimationFrame(animate);
};
