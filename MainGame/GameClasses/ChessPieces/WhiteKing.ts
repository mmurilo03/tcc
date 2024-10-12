import { FullBoard } from "./Board";
import { ChessPiece, ObjectPropsChess, Pos } from "./ChessPiece";

export class WhiteKing extends ChessPiece {
    static imagePath: string = "chess/whiteKing.png";
    selected: boolean = false;
    lock: boolean = false;
    firstMove: boolean = true;
    constructor({ game, imagePath }: ObjectPropsChess, initialPos: Pos) {
        super(
            { game, imagePath: imagePath ? imagePath : WhiteKing.imagePath },
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
            Math.abs(this.cellPos.x - finalPos.x) <= 1 && Math.abs(this.cellPos.y - finalPos.y) <= 1 &&
            (Math.abs(this.cellPos.x - finalPos.x) == Math.abs(this.cellPos.y - finalPos.y) ||
                (this.cellPos.x == finalPos.x && this.cellPos.y != finalPos.y) ||
                (this.cellPos.y == finalPos.y && this.cellPos.x != finalPos.x))
        );
    }
}
