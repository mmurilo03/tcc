import { FullBoard } from "./Board";
import { ChessPiece, ObjectPropsChess, Pos } from "./ChessPiece";

export class WhiteRook extends ChessPiece {
    static imagePath: string = "chess/whiteRook.png";
    selected: boolean = false;
    lock: boolean = false;
    firstMove: boolean = true;
    constructor({ game, imagePath }: ObjectPropsChess, initialPos: Pos) {
        super(
            { game, imagePath: imagePath ? imagePath : WhiteRook.imagePath },
            {
                lock: false,
                selected: false,
                initialPos,
            }
        );
        this.type = "white";
    }

    checkMove(finalPos: Pos, fullBoard: FullBoard): boolean {
        if (!this.checkIfInsideBoard(finalPos) || !this.checkIfPieceIsOnTheWay(finalPos, fullBoard)) {
            return false;
        }
        return (
            (this.cellPos.x == finalPos.x && this.cellPos.y != finalPos.y) ||
            (this.cellPos.y == finalPos.y && this.cellPos.x != finalPos.x)
        );
    }
}
