import {
    AnimationFrame,
    Coordinates,
    GameObjectInterface,
    GameObjectHiddenProperties,
    GameObjectProperties,
    GameObjectDraw,
} from "../Interfaces/GameObjectInterfaces";
import { exports } from "../exports.json";
import { Game } from "../Game";

export class GameObject
    implements GameObjectDraw, GameObjectInterface, GameObjectProperties, GameObjectHiddenProperties
{
    // GameObjectInterface
    game: Game;
    objId: string;
    context: CanvasRenderingContext2D;
    imagePath: string;
    x: number;
    y: number;
    width: number;
    height: number;
    clickable: boolean = false;

    // GameObjectHiddenProperties
    imageElement: HTMLImageElement;
    loading: boolean = true;
    hitboxCount: number;
    activeFrame: number;
    frameCounter: number;
    flip: boolean;
    clicked: boolean = false;
    // Array with frames
    // Array with each outline of a frame
    // Array of points
    hitboxes: string[][][];
    animationImagePosition: Coordinates[];

    // GameObjectProperties
    state: string;
    animationFrames: AnimationFrame;
    previousState: string;

    constructor(gameObjectInterface: GameObjectInterface, gameObjectProperties: GameObjectProperties) {
        this.game = gameObjectInterface.game;
        this.objId = gameObjectInterface.objId;
        this.context = gameObjectInterface.context;
        this.imagePath = gameObjectInterface.imagePath;
        this.x = gameObjectInterface.x;
        this.y = gameObjectInterface.y;
        this.width = gameObjectInterface.width;
        this.height = gameObjectInterface.height;
        this.clickable = gameObjectInterface.clickable;

        this.loading = true;

        this.hitboxCount = 0;
        this.activeFrame = 0;
        this.frameCounter = 0;
        this.flip = false;
        this.hitboxes = []; // points of the hitbox
        this.animationImagePosition = []; // animation frame count per line on image
        this.state = gameObjectProperties.state;
        this.previousState = gameObjectProperties.state;
        this.animationFrames = gameObjectProperties.animationFrames;
        const img = new Image();
        this.imageElement = img;

        img.src = `./gameEngine/GameImages/${this.imagePath}`;
        img.onload = () => {
            this.imageElement = img;
            this.loadFromExport();
        };
    }

    loadFromExport() {
        this.hitboxCount = exports[this.imagePath as keyof typeof exports]?.hitboxCount;
        this.hitboxes = exports[this.imagePath as keyof typeof exports]?.hitboxes;
        this.animationImagePosition = exports[this.imagePath as keyof typeof exports]?.animationImagePosition;

        if (this.hitboxCount > 0 && this.hitboxes.length > 0 && this.animationImagePosition.length > 0) {
            this.loading = false;
        }
    }

    update() {
        if (this.clickable && this.game.mouseClick) {
            this.clicked = this.detectClick();
        } else if (!this.game.mouseClick) {
            this.clicked = false;
        }
    }

    detectClick() {
        if (this.isPointClose(this.game.mousePos)) {
            return this.detectCollision(this.game.mousePos);
        }
        return false;
    }

    detectCollision(point: Coordinates) {
        this.context.fillStyle = "red";
        this.context.strokeStyle = "red";
        // For each animation frame, get every outline and draw it
        for (let outline = 0; outline < this.hitboxes[this.activeFrame].length; outline++) {
            let currentOutline = this.hitboxes[this.activeFrame][outline];
            // Draw the outline
            for (let i = 0; i < currentOutline.length; i++) {
                const path = new Path2D(
                    `M${this.flip ? -this.x - this.width : this.x} ${this.y},${currentOutline[i]}`
                );
                // Makes the outline visible
                // this.context.stroke(path);
                if (this.context.isPointInPath(path, point.x, point.y)) return true;
            }
        }
        return false;
    }

    isPointClose(point: Coordinates) {
        return (
            point.x > this.x &&
            point.x < this.x + this.width &&
            point.y > this.y &&
            point.y < this.y + this.height
        );
    }

    draw() {
        if (this.flip) {
            this.context.scale(-1, 1);
        }
        this.context.drawImage(
            this.imageElement,
            this.animationImagePosition[this.activeFrame].x,
            this.animationImagePosition[this.activeFrame].y,
            this.width,
            this.height,
            this.flip ? -this.x - this.width : this.x,
            this.y,
            this.width,
            this.height
        );
        if (this.flip) {
            this.context.scale(-1, 1);
        }
    }
}
