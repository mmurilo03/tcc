import { Game } from "../../gameEngine/Game";
import { Board } from "../GameClasses/ChessPieces/Board";
import { Stage } from "../../gameEngine/GameStages/Stage";

export class Chess extends Stage {
    constructor(game: Game) {
        super(game, "Chess");
        this.addObject(new Board({ game: game, x: 0, y: 0 }));
    }
}
