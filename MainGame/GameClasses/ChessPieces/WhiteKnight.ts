import { FullBoard } from "./Board";
import { ChessPiece, ObjectPropsChess, Pos } from "./ChessPiece";

export class WhiteKnight extends ChessPiece {
    static imagePath: string = "chess/whiteKnight.png";
    selected: boolean = false;
    lock: boolean = false;
    firstMove: boolean = true;
    constructor({ game, imagePath }: ObjectPropsChess, initialPos: Pos) {
        super(
            { game, imagePath: imagePath ? imagePath : WhiteKnight.imagePath },
            {
                lock: false,
                selected: false,
                initialPos,
            }
        );
        this.type = "white";
    }

    checkMove(finalPos: Pos, fullBoard: FullBoard): boolean {
        if (!this.checkIfInsideBoard(finalPos)) {
            return false;
        }
        return (
            (Math.abs(this.cellPos.x - finalPos.x) == 2 && Math.abs(this.cellPos.y - finalPos.y) == 1) ||
            (Math.abs(this.cellPos.x - finalPos.x) == 1 && Math.abs(this.cellPos.y - finalPos.y) == 2)
        );
    }
}
