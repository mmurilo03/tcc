import { Game } from "./Game";
import { allStages } from "./GameStages/AllStages";

export const game = new Game({ width: 1280, height: 720 });

for (let Stage of allStages) {
    game.addStage(new Stage(game));
}

game.changeStage("Stage 1");
