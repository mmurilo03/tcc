import { Game } from "../../gameEngine/Game";
import { Stage } from "../../gameEngine/GameStages/Stage";

export class Stage1 extends Stage {
    constructor(game: Game) {
        super(game, "global");
    }
}
