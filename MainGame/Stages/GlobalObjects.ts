import { Game } from "../../gameEngine/Game";
import { Wolf } from "../GameClasses/Wolf";
import { Stage } from "../../gameEngine/GameStages/Stage";

export class Stage1 extends Stage {
    constructor(game: Game) {
        super(game, "global");
        // const wolf = new Wolf({ game: game, x: 250, y: 250 });
        // wolf.name = "wolf"
        // this.addObject(wolf);
    }
}
