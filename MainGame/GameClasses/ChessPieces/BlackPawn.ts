import { FullBoard } from "./Board";
import { ObjectPropsChess, Pos } from "./ChessPiece";
import { WhitePawn } from "./WhitePawn";

export class BlackPawn extends WhitePawn {
    static imagePath: string = "chess/blackPawn.png";
    selected: boolean = false;
    lock: boolean = false;
    firstMove: boolean = true;
    constructor({ game }: ObjectPropsChess, initialPos: Pos) {
        super({ game, imagePath: BlackPawn.imagePath }, initialPos);
        this.type = "black";
    }

    checkMove(finalPos: Pos, fullBoard: FullBoard): boolean {
        if (!this.checkIfInsideBoard(finalPos) || !this.checkIfPieceIsOnTheWay(finalPos, fullBoard)) {
            return false;
        }
        if (
            fullBoard[`${finalPos.x}/${finalPos.y}`] &&
            Math.abs(this.cellPos.x - finalPos.x) == 1 &&
            finalPos.y - this.cellPos.y == 1
        ) {
            return true;
        } else if (fullBoard[`${finalPos.x}/${finalPos.y}`]) {
            return false
        }
        if (this.firstMove) {
            return (
                this.cellPos.x == finalPos.x &&
                finalPos.y - this.cellPos.y <= 2 &&
                finalPos.y - this.cellPos.y >= 1
            );
        } else {
            return this.cellPos.x == finalPos.x && finalPos.y - this.cellPos.y == 1;
        }
    }
}
