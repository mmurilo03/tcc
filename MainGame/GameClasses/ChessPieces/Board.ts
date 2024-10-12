import { GameObjectStatic } from "../../../gameEngine/GameObject/GameObjectStatic";
import { ObjectPropsSimple } from "../../../gameEngine/Interfaces/GameObjectInterfaces";
import { BlackBishop } from "./BlackBishop";
import { BlackKing } from "./BlackKing";
import { BlackKnight } from "./BlackKnight";
import { BlackPawn } from "./BlackPawn";
import { BlackQueen } from "./BlackQueen";
import { BlackRook } from "./BlackRook";
import { ChessPiece, Pos } from "./ChessPiece";
import { WhiteBishop } from "./WhiteBishop";
import { WhiteKing } from "./WhiteKing";
import { WhiteKnight } from "./WhiteKnight";
import { WhitePawn } from "./WhitePawn";
import { WhiteQueen } from "./WhiteQueen";
import { WhiteRook } from "./WhiteRook";

export interface FullBoard {
    [propName: string]: ChessPiece;
}

export class Board extends GameObjectStatic {
    static imagePath: string = "chess/chessBoard.jpg";
    static width: number = 1000;
    static height: number = 1000;

    static cellWidth: number = 105;
    static cellHeight: number = 105;

    whitePieces: ChessPiece[] = [];
    whiteTakenPieces: ChessPiece[] = [];
    blackPieces: ChessPiece[] = [];
    blackTakenPieces: ChessPiece[] = [];
    fullBoard: FullBoard = {};
    lock: boolean = false;
    lockedPiece: ChessPiece | null = null;
    turnPlayer: string = "white";
    playerWin = false;

    constructor({ game, x, y }: ObjectPropsSimple) {
        super({
            game,
            x,
            y,
            clickable: true,
            height: Board.height,
            width: Board.width,
            imagePath: Board.imagePath,
        });
        for (let num = 0; num < 8; num++) {
            this.whitePieces.push(new WhitePawn({ game }, { x: num, y: 6 }));
        }
        this.whitePieces.push(new WhiteRook({ game }, { x: 0, y: 7 }));
        this.whitePieces.push(new WhiteKnight({ game }, { x: 1, y: 7 }));
        this.whitePieces.push(new WhiteBishop({ game }, { x: 2, y: 7 }));
        this.whitePieces.push(new WhiteQueen({ game }, { x: 3, y: 7 }));
        let whiteKing = new WhiteKing({ game }, { x: 4, y: 7 });
        whiteKing.name = "king";
        this.whitePieces.push(whiteKing);
        this.whitePieces.push(new WhiteBishop({ game }, { x: 5, y: 7 }));
        this.whitePieces.push(new WhiteKnight({ game }, { x: 6, y: 7 }));
        this.whitePieces.push(new WhiteRook({ game }, { x: 7, y: 7 }));

        for (let num = 0; num < 8; num++) {
            this.blackPieces.push(new BlackPawn({ game }, { x: num, y: 1 }));
        }
        this.blackPieces.push(new BlackRook({ game }, { x: 0, y: 0 }));
        this.blackPieces.push(new BlackKnight({ game }, { x: 1, y: 0 }));
        this.blackPieces.push(new BlackBishop({ game }, { x: 2, y: 0 }));
        this.blackPieces.push(new BlackQueen({ game }, { x: 3, y: 0 }));
        let blackKing = new BlackKing({ game }, { x: 4, y: 0 });
        blackKing.name = "king";
        this.blackPieces.push(blackKing);
        this.blackPieces.push(new BlackBishop({ game }, { x: 5, y: 0 }));
        this.blackPieces.push(new BlackKnight({ game }, { x: 6, y: 0 }));
        this.blackPieces.push(new BlackRook({ game }, { x: 7, y: 0 }));

        this.whitePieces.forEach((piece) => {
            this.fullBoard[`${piece.cellPos.x}/${piece.cellPos.y}`] = piece;
            this.otherObjects.push(piece);
        });

        this.blackPieces.forEach((piece) => {
            this.fullBoard[`${piece.cellPos.x}/${piece.cellPos.y}`] = piece;
            this.otherObjects.push(piece);
        });
    }

    update(): void {
        super.update();
        this.whiteTakenPieces.forEach((piece) => {
            if (piece.name == "king") {
                this.playerWin = true;
            }
        });
        this.blackTakenPieces.forEach((piece) => {
            if (piece.name == "king") {
                this.playerWin = true;
            }
        });

        if (!this.playerWin) {
            if (this.lock && this.lockedPiece) {
                this.lockedPiece.update();
                if (!this.lockedPiece.selected) {
                    this.unlockMouse();
                    this.clear();
                }
            } else {
                this.unlockMouse();
                this.clear();
                for (let key of Object.keys(this.fullBoard)) {
                    let piece = this.fullBoard[key];
                    if (piece.type == this.turnPlayer) {
                        piece.update();
                    } else {
                        piece.updateNonPlayerTurn();
                    }
                    if (piece.selected) {
                        this.lockMouse();
                        this.lockedPiece = piece;
                        break;
                    }
                }
            }
            this.highlightObject()
            if (this.clicked) {
                let cellX = Math.floor((this.game.mousePos.x - 78) / Board.cellWidth);
                let cellY = Math.floor((this.game.mousePos.y - 78) / Board.cellHeight);
                console.log(cellX, cellY);
                
                if (
                    this.lock &&
                    this.lockedPiece &&
                    (this.lockedPiece.x != cellX || this.lockedPiece.y != cellY)
                ) {
                    this.move(cellX, cellY);
                }
            }
        }
    }

    draw(): void {
        super.draw();
        for (let obj of this.otherObjects) {
            obj.draw();
        }
        if (this.playerWin) {
            let playerThatWon = this.turnPlayer == "white" ? "Preto" : "Branco";
            this.game.addText({
                fontSize: "80px",
                id: "playerWin",
                text: `${playerThatWon} venceu o jogo`,
                textPositionX: 120,
                textPositionY: 500,
                textColor: "white",
                textOutlineColor: "black",
                textOutlineWidth: 2,
            });
        }
    }

    lockMouse() {
        this.lock = true;
    }

    unlockMouse() {
        this.lock = false;
    }

    getPos(x: number, y: number): Pos {
        return { x: 78 + Board.cellWidth * x + 20, y: 78 + Board.cellHeight * y + 20 };
    }

    move(cellX: number, cellY: number) {
        let finalPos: Pos = { x: cellX, y: cellY };
        if (this.lockedPiece) {
            if (this.lockedPiece.checkMove(finalPos, this.fullBoard) && this.checkCell(cellX, cellY)) {
                delete this.fullBoard[`${this.lockedPiece.cellPos.x}/${this.lockedPiece.cellPos.y}`];
                this.fullBoard[`${cellX}/${cellY}`] = this.lockedPiece;
                this.lockedPiece.setCell(cellX, cellY);
                this.lockedPiece.update();
                this.unlockMouse();
                this.clear();
                this.game.playAudio("movePiece.mp3");
                this.turnPlayer = this.turnPlayer == "white" ? "black" : "white";
            }
        }
    }

    checkCell(cellX: number, cellY: number) {
        if (
            this.fullBoard[`${cellX}/${cellY}`] &&
            this.fullBoard[`${cellX}/${cellY}`].type == this.lockedPiece?.type
        ) {
            return false;
        }
        if (this.fullBoard[`${cellX}/${cellY}`]) {
            if (this.fullBoard[`${cellX}/${cellY}`].type == `black`) {
                this.whiteTakenPieces.push(this.fullBoard[`${cellX}/${cellY}`]);
            } else if (this.fullBoard[`${cellX}/${cellY}`].type == `white`) {
                this.blackTakenPieces.push(this.fullBoard[`${cellX}/${cellY}`]);
            }
            this.game.playAudio("capture.mp3");
            this.otherObjects.splice(this.otherObjects.indexOf(this.fullBoard[`${cellX}/${cellY}`]), 1);
            delete this.fullBoard[`${cellX}/${cellY}`];
        }
        return true;
    }

    clear() {
        this.lockedPiece = null;
    }
}
