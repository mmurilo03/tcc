import { ObjectPropsChess, Pos } from "./ChessPiece";
import { WhiteBishop } from "./WhiteBishop";

export class BlackBishop extends WhiteBishop {
    static imagePath: string = "chess/blackBishop.png";
    selected: boolean = false;
    lock: boolean = false;
    firstMove: boolean = true;
    constructor({ game }: ObjectPropsChess, initialPos: Pos) {
        super({ game, imagePath: BlackBishop.imagePath }, initialPos);
        this.type = "black";
    }
}
