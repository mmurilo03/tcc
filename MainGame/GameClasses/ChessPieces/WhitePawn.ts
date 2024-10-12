import { FullBoard } from "./Board";
import { ChessPiece, ObjectPropsChess, Pos } from "./ChessPiece";

export class WhitePawn extends ChessPiece {
    static imagePath: string = "chess/whitePawn.png";
    selected: boolean = false;
    lock: boolean = false;
    firstMove: boolean = true;
    constructor({ game, imagePath }: ObjectPropsChess, initialPos: Pos) {
        super(
            { game, imagePath: imagePath ? imagePath : WhitePawn.imagePath },
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

        if (
            fullBoard[`${finalPos.x}/${finalPos.y}`] &&
            Math.abs(this.cellPos.x - finalPos.x) == 1 &&
            this.cellPos.y - finalPos.y == 1
        ) {
            return true;
        } else if (fullBoard[`${finalPos.x}/${finalPos.y}`]) {
            return false;
        }

        if (this.firstMove) {
            return (
                this.cellPos.x == finalPos.x &&
                this.cellPos.y - finalPos.y <= 2 &&
                this.cellPos.y - finalPos.y >= 1
            );
        } else {
            return this.cellPos.x == finalPos.x && this.cellPos.y - finalPos.y == 1;
        }
    }

    setCell(x: number, y: number): void {
        super.setCell(x, y);
        this.firstMove = false;
    }
}
