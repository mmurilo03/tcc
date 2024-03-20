import { Coordinates, GameObjectInterface, GameObjectProperties } from "../Interfaces/GameObjectInterfaces";
import { exports } from "../exports.json";

export class GameObject implements GameObjectInterface, GameObjectProperties {
    context: CanvasRenderingContext2D;
    imagePath: string;
    imageElement: HTMLImageElement;
    x: number;
    y: number;
    loading: boolean = true;
    hitboxCount: number;
    activeFrame: number;
    frameCounter: number;
    flip: boolean;

    // Array with frames
    // Array with each outline of a frame
    // Array of points
    hitboxes: string[][][];
    animationFrame: Coordinates[];

    width: number;
    height: number;

    constructor(gameObjectInterface: GameObjectInterface) {
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
        this.animationFrame = []; // animation frame count per line on image

        const img = new Image();
        this.imageElement = img;

        img.src = `./gameEngine/GameImages/${this.imagePath}`;
        img.onload = () => {
            this.imageElement = img;
            this.loadFromExport();
        };
    }

    loadFromExport() {
        console.log(this.imagePath);
        
        this.hitboxCount = exports[this.imagePath as keyof typeof exports]?.hitboxCount;
        this.hitboxes = exports[this.imagePath as keyof typeof exports]?.hitboxes;
        this.animationFrame = exports[this.imagePath as keyof typeof exports]?.animationFrame;

        if (this.hitboxCount > 0 && this.hitboxes.length > 0 && this.animationFrame.length > 0) {
            this.loading = false;
        }
    }

    update(n: number) {
        this.x += n;
        this.frameCounter++;
    }

    draw() {
        this.context.save();
        if (this.flip) {
            this.context.scale(-1, 1);
            this.context.translate(-500, 0);
        }
        if (this.frameCounter > 4) {
            this.frameCounter = 0;
            this.activeFrame++;
            if (this.activeFrame >= this.hitboxCount) {
                this.activeFrame = 0;
            }
        }
        this.context.fillStyle = "red";
        this.context.strokeStyle = "red";

        this.context.drawImage(
            this.imageElement,
            this.animationFrame[this.activeFrame].x,
            this.animationFrame[this.activeFrame].y,
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
        this.context.restore();
    }

    drawSimple() {
        this.context.drawImage(
            this.imageElement,
            this.animationFrame[this.activeFrame].x,
            this.animationFrame[this.activeFrame].y,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
}
