import { ObjectPropsChess, Pos } from "./ChessPiece";
import { WhiteRook } from "./WhiteRook";

export class BlackRook extends WhiteRook {
    static imagePath: string = "chess/blackRook.png";
    selected: boolean = false;
    lock: boolean = false;
    firstMove: boolean = true;
    constructor({ game }: ObjectPropsChess, initialPos: Pos) {
        super({ game, imagePath: BlackRook.imagePath }, initialPos);
        this.type = "black";
    }
}
