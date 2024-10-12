import { ObjectPropsChess, Pos } from "./ChessPiece";
import { WhiteKnight } from "./WhiteKnight";

export class BlackKnight extends WhiteKnight {
    static imagePath: string = "chess/blackKnight.png";
    selected: boolean = false;
    lock: boolean = false;
    firstMove: boolean = true;
    constructor({ game }: ObjectPropsChess, initialPos: Pos) {
        super({ game, imagePath: BlackKnight.imagePath }, initialPos);
        this.type = "black";
    }
}
