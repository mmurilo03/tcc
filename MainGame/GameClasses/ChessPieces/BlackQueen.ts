import { ObjectPropsChess, Pos } from "./ChessPiece";
import { WhiteQueen } from "./WhiteQueen";

export class BlackQueen extends WhiteQueen {
    static imagePath: string = "chess/blackQueen.png";
    selected: boolean = false;
    lock: boolean = false;
    firstMove: boolean = true;
    constructor({ game }: ObjectPropsChess, initialPos: Pos) {
        super({ game, imagePath: BlackQueen.imagePath }, initialPos);
        this.type = "black";
    }
}
