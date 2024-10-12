import { ObjectPropsChess, Pos } from "./ChessPiece";
import { WhiteKing } from "./WhiteKing";

export class BlackKing extends WhiteKing {
    static imagePath: string = "chess/blackKing.png";
    selected: boolean = false;
    lock: boolean = false;
    firstMove: boolean = true;
    constructor({ game }: ObjectPropsChess, initialPos: Pos) {
        super({ game, imagePath: BlackKing.imagePath }, initialPos);
        this.type = "black";
    }
}
