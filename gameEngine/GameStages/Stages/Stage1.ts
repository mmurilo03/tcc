import { Game } from "../../Game";
import { Floor } from "../../GameClasses/Floor/Floor";
import { Stage } from "../Stage";

export class Stage1 extends Stage {
    constructor(game: Game) {
        super(game, "Stage 1");
        this.add(new Floor({ game: game, context: game.context, x: 250, y: 250 }));
    }
}
