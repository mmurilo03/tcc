import { Game } from "../../../gameEngine/Game";
import { GameObjectStatic } from "../../../gameEngine/GameObject/GameObjectStatic";
import { Board, FullBoard } from "./Board";

export interface ChessPieceInterface {
    selected: boolean;
    lock: boolean;
    initialPos: Pos;
}

export interface ObjectPropsChess {
    game: Game;
    imagePath?: string;
}

export interface Pos {
    x: number;
    y: number;
}

export abstract class ChessPiece extends GameObjectStatic {
    static width: number = 60;
    static height: number = 60;

    type: string = "white";
    selected: boolean = false;
    lock: boolean = false;
    firstHightlight: boolean = true;
    cellPos: Pos = { x: 0, y: 0 };

    constructor(objectProps: ObjectPropsChess, chessPieceInterface: ChessPieceInterface) {
        super({
            game: objectProps.game,
            x: 0,
            y: 0,
            precision: 1,
            clickable: true,
            height: ChessPiece.height,
            width: ChessPiece.width,
            imagePath: objectProps.imagePath ? objectProps.imagePath : "chess/whitePawn.png",
        });
        this.selected = chessPieceInterface.selected;
        this.lock = chessPieceInterface.lock;
        this.cellPos = chessPieceInterface.initialPos;
        this.setCell(this.cellPos.x, this.cellPos.y);
        this.outlineWidth = 2;
    }

    updateNonPlayerTurn() {
        super.update();
        if (this.firstHightlight != this.selected) {
            this.highlightObject();
            this.firstHightlight = this.selected;
        }
    }

    update(): void {
        super.update();
        if (this.firstHightlight != this.selected) {
            this.highlightObject();
            this.firstHightlight = this.selected;
        }
        if (this.clicked && !this.lock) {
            this.selected = !this.selected;
        }
        if (this.game.mouseClick) {
            this.lockMouse();
        } else {
            this.unlockMouse();
        }
        if (this.selected) {
            this.outlineColor = "blue";
        } else {
            this.outlineColor = "red";
        }
    }

    lockMouse() {
        this.lock = true;
    }

    unlockMouse() {
        this.lock = false;
    }

    abstract checkMove(finalPos: Pos, fullBoard: FullBoard): boolean;

    checkIfInsideBoard(finalPos: Pos) {
        if (finalPos.x >= 0 && finalPos.x <= 7 && finalPos.y >= 0 && finalPos.y <= 7) {
            return true;
        }
        return false;
    }

    checkIfPieceIsOnTheWay(finalPos: Pos, fullBoard: FullBoard) {
        let distanceMoved: Pos = { x: finalPos.x - this.cellPos.x, y: finalPos.y - this.cellPos.y };
        if (
            fullBoard[`${finalPos.x}/${finalPos.y}`] &&
            fullBoard[`${finalPos.x}/${finalPos.y}`].type != this.type
        ) {
            return true;
        }
        let stepCount = 1;
        while (Math.abs(distanceMoved.x) > 0 || Math.abs(distanceMoved.y) > 0) {
            // Moving left up
            if (distanceMoved.x < 0 && distanceMoved.y < 0) {
                if (fullBoard[`${this.cellPos.x - stepCount}/${this.cellPos.y - stepCount}`]) {
                    return false;
                }
            } else if (distanceMoved.x == 0 && distanceMoved.y < 0) {
                if (fullBoard[`${this.cellPos.x}/${this.cellPos.y - stepCount}`]) {
                    return false;
                }
            } else if (distanceMoved.x > 0 && distanceMoved.y < 0) {
                if (fullBoard[`${this.cellPos.x + stepCount}/${this.cellPos.y - stepCount}`]) {
                    return false;
                }
            } else if (distanceMoved.x > 0 && distanceMoved.y == 0) {
                if (fullBoard[`${this.cellPos.x + stepCount}/${this.cellPos.y}`]) {
                    return false;
                }
            } else if (distanceMoved.x > 0 && distanceMoved.y > 0) {
                if (fullBoard[`${this.cellPos.x + stepCount}/${this.cellPos.y + stepCount}`]) {
                    return false;
                }
            } else if (distanceMoved.x == 0 && distanceMoved.y > 0) {
                if (fullBoard[`${this.cellPos.x}/${this.cellPos.y + stepCount}`]) {
                    return false;
                }
            } else if (distanceMoved.x < 0 && distanceMoved.y > 0) {
                if (fullBoard[`${this.cellPos.x - stepCount}/${this.cellPos.y + stepCount}`]) {
                    return false;
                }
            } else if (distanceMoved.x < 0 && distanceMoved.y == 0) {
                if (fullBoard[`${this.cellPos.x - stepCount}/${this.cellPos.y}`]) {
                    return false;
                }
            }
            if (distanceMoved.x != 0) {
                distanceMoved.x = distanceMoved.x < 0 ? distanceMoved.x + 1 : distanceMoved.x - 1;
            }
            if (distanceMoved.y != 0) {
                distanceMoved.y = distanceMoved.y < 0 ? distanceMoved.y + 1 : distanceMoved.y - 1;
            }
            stepCount++;
        }
        return true;
    }

    setCell(x: number, y: number) {
        this.cellPos = { x: x, y: y };
        this.x = 78 + Board.cellWidth * x + 20;
        this.y = 78 + Board.cellHeight * y + 20;
        this.selected = false;
    }
}
