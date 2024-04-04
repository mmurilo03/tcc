import { Game } from "../../Game";
import { Wolf } from "../../GameClasses/Wolf";
import { Stage } from "../Stage";

export class Stage1 extends Stage {
    constructor(game: Game) {
        super(game, "Stage 1");
        this.add(new Wolf({ game: game, context: game.context, x: 250, y: 250 }));
    }
}
