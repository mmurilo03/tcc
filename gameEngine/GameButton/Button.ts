import { Game } from "../Game";
import { Coordinates } from "../Interfaces/GameObjectInterfaces";

interface Position {
    x: number;
    y: number;
}

interface Text {
    fontSize: string;
    text: string;
    textColor?: string;
    textPositionX: number;
    textPositionY: number;
    textOutlineColor?: string;
    textOutlineWidth?: number;
}

export class Button {
    game: Game;
    context: CanvasRenderingContext2D;
    text: Text;
    font?: FontFace;
    pos: Position;
    imagePath: string;
    fixedPosition: boolean = false;
    clicked: boolean = false;
    func: Function;
    loading: boolean = true;
    image: HTMLImageElement;

    constructor(game: Game, text: Text, imagePath: string, pos: Position, func: Function, font?: FontFace) {
        this.game = game;
        this.context = game.context;
        this.text = text;
        this.imagePath = imagePath;
        this.pos = pos;
        this.func = func;
        const img = new Image();
        this.image = img;
        img.src = `../MainGame/GameImages/${this.imagePath}`;
        img.onload = () => {
            this.image = img;
            this.loading = false;
        };
        this.font = font
        if (this.font) {
            document.fonts.add(this.font);
            this.font.load();
        }
    }

    isClicked(point: Coordinates) {
        return (
            point.x > this.pos.x &&
            point.x < this.pos.x + this.image.naturalWidth &&
            point.y > this.pos.y &&
            point.y < this.pos.y + this.image.naturalHeight
        );
    }

    update() {
        if (this.isClicked(this.game.mousePos) && this.game.mouseClick) {
            this.clicked = true;
        } else {
            this.clicked = false;
        }
        if (this.clicked) {
            this.func();
        }
    }

    draw() {
        let font;
        
        if (this.font?.loaded) {
            font = `${this.text.fontSize} "${this.font.family}"`;
        } else {
            font = `${this.text.fontSize} sans-serif`;
        }

        this.context.font = font;
        this.context.fillStyle = this.text.textColor ? this.text.textColor : "black";

        if (this.fixedPosition) {
            this.context.drawImage(this.image, this.pos.x + this.game.pos.x, this.pos.y - this.game.pos.y);
            this.context.fillText(
                this.text.text,
                this.text.textPositionX + this.game.pos.x,
                this.text.textPositionY - this.game.pos.y
            );
        } else {
            this.context.drawImage(this.image, this.pos.x, this.pos.y);
            this.context.fillText(this.text.text, this.text.textPositionX, this.text.textPositionY);
        }

        if (this.text.textOutlineColor && this.text.textOutlineWidth) {
            this.context.lineWidth = this.text.textOutlineWidth;
            this.context.strokeStyle = this.text.textOutlineColor;
            if (this.fixedPosition) {
                this.context.strokeText(
                    this.text.text,
                    this.text.textPositionX + this.game.pos.x,
                    this.text.textPositionY - this.game.pos.y
                );
            } else {
                this.context.strokeText(this.text.text, this.text.textPositionX, this.text.textPositionY);
            }
        }
    }
}
