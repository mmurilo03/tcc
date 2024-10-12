import { Game } from "./Game";
import { allStages } from "./GameStages/AllStages";

export const game = new Game({ width: 1000, height: 1000 });

for (let Stage of allStages) {
    game.addStage(new Stage(game));
}

game.changeStage("Chess");
