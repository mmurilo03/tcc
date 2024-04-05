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

export class GameObjectStatic
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

    // GameObjectHiddenProperties
    imageElement: HTMLImageElement;
    loading: boolean = true;
    hitboxCount: number;
    activeFrame: number;
    frameCounter: number;
    flip: boolean;
    // Array with frames
    // Array with each outline of a frame
    // Array of points
    hitboxes: string[][][];
    animationImagePosition: Coordinates[];

    // GameObjectProperties
    state: string;
    animationFrames: AnimationFrame;
    previousState: string;

    constructor(gameObjectInterface: GameObjectInterface) {
        this.game = gameObjectInterface.game;
        this.objId = gameObjectInterface.objId;
        this.context = gameObjectInterface.context;
        this.imagePath = gameObjectInterface.imagePath;
        this.x = gameObjectInterface.x;
        this.y = gameObjectInterface.y;
        this.width = gameObjectInterface.width;
        this.height = gameObjectInterface.height;

        this.loading = true;

        this.hitboxCount = 0;
        this.activeFrame = 0;
        this.frameCounter = 0;
        this.flip = false;
        this.hitboxes = []; // points of the hitbox
        this.animationImagePosition = []; // animation frame count per line on image
        this.state = "static";
        this.previousState = "static";
        this.animationFrames = { static: { start: 0, end: 0, duration: 0 } };
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

    update(attribute: any) {}

    draw() {
        if (this.flip) {
            this.context.setTransform(-1, 0, 0, 1, 500 + this.x / 2, 0);
        }
        this.context.fillStyle = "red";
        this.context.strokeStyle = "red";

        this.context.drawImage(
            this.imageElement,
            this.animationImagePosition[this.activeFrame].x,
            this.animationImagePosition[this.activeFrame].y,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width,
            this.height
        );
        // For each animation frame, get every outline and draw it
        for (let outline = 0; outline < this.hitboxes[this.activeFrame].length; outline++) {
            let currentOutline = this.hitboxes[this.activeFrame][outline];
            // Draw the outline
            for (let i = 0; i < currentOutline.length; i++) {
                const path = new Path2D(`M${this.x} ${this.y},${currentOutline[i]}`);

                // Makes the outline visible
                // this.context.stroke(path);
            }
        }
        // this.context.fill();
        if (this.flip) {
            this.context.setTransform(1, 0, 0, 1, 0, 0);
        }
    }

    drawSimple() {
        this.context.drawImage(
            this.imageElement,
            this.animationImagePosition[this.activeFrame].x,
            this.animationImagePosition[this.activeFrame].y,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
}
