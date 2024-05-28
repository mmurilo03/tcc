import { Game } from "../../Game";
import { Floor } from "../../GameClasses/Floor/Floor";
import { Stage } from "../Stage";

export class Stage2 extends Stage {
    constructor(game: Game) {
        super(game, "Stage 2");
        this.add(new Floor({ game: game, x: 250, y: 350 }));
    }
}
