import { Coordinates, GameObjectHiddenProperties, ObjectProps } from "../Interfaces/GameObjectInterfaces";
import { Game } from "../Game";
import { ExportedObject } from "./HitboxMaker";
import paper from "paper";

export class GameObject implements ObjectProps, GameObjectHiddenProperties {
    // ObjectProps
    game: Game;
    x: number;
    y: number;
    precision: number = 2.5;
    imagePath: string;
    width: number;
    height: number;
    clickable: boolean = false;

    context: CanvasRenderingContext2D;
    // GameObjectHiddenProperties
    imageElement: HTMLImageElement;
    flippedImageElement: HTMLImageElement;
    loading: boolean = true;
    hitboxCount: number;
    activeFrame: number;
    frameCounter: number;
    flip: boolean = false;
    clicked: boolean = false;
    highlighted: boolean = false;
    outline: string = "";
    outlineColor: string = "red";
    fillColor: string = "black";
    outlineWidth: number = 1;
    name: string = "";
    // Array with frames
    // Array with each outline of a frame
    // Array of points
    hitboxes: string[][][];
    animationImagePosition: Coordinates[];

    otherObjects: GameObject[] = [];

    constructor(objectProps: ObjectProps) {
        this.game = objectProps.game;
        this.x = objectProps.x;
        this.y = objectProps.y;
        this.precision = objectProps.precision ? objectProps.precision : 10;
        this.imagePath = objectProps.imagePath;
        this.width = objectProps.width;
        this.height = objectProps.height;
        this.clickable = objectProps.clickable;

        this.context = this.game.context;

        this.hitboxCount = 0;
        this.activeFrame = 0;
        this.frameCounter = 0;
        this.hitboxes = []; // points of the hitbox
        this.animationImagePosition = []; // animation frame count per line on image
        const img = new Image();
        this.imageElement = img;
        this.flippedImageElement = img;
    }

    async loadImage() {
        await new Promise((resolve, reject) => {
            const img = new Image();
            img.src = `./gameEngine/GameImages/${this.imagePath}`;
            img.onload = () => {
                this.imageElement = img;
                this.game.extraCanvas.width = this.imageElement.naturalWidth;
                this.game.extraCanvas.height = this.imageElement.naturalHeight;
                this.game.extraContext.save();
                this.game.extraContext.translate(this.game.extraCanvas.width, 0);
                this.game.extraContext.scale(-1, 1);
                this.game.extraContext.drawImage(this.imageElement, 0, 0);
                this.flippedImageElement.src = this.game.extraCanvas.toDataURL();
                this.game.extraContext.clearRect(0, 0, this.game.width, this.game.height);
                this.game.extraContext.restore();
                resolve("done");
            };
            img.onerror = (error) => {
                reject(error);
            };
        });
        await this.loadFromExport();
    }

    async loadFromExport() {
        let ex = await fetch(new URL("../exports.json", import.meta.url));
        let json = await ex.json();
        let exportedObject: ExportedObject = json.exports[this.imagePath];

        this.hitboxCount = exportedObject.hitboxCount;
        this.hitboxes = exportedObject.hitboxes;
        this.animationImagePosition = exportedObject.animationImagePosition;
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

    updateOutline() {
        // For each animation frame, get every outline and draw it
        this.outline = `M${this.flip ? -this.x - this.width : this.x} ${this.y}`;
        if (this.loading) {
            this.loadFromExport();
            if (this.highlighted) {
                this.highlightObject();
            }
            return;
        }
        for (let outline = 0; outline < this.hitboxes[this.activeFrame].length; outline++) {
            let currentOutline = this.hitboxes[this.activeFrame][outline];
            this.outline += currentOutline[0] + `M${this.flip ? -this.x - this.width : this.x} ${this.y}`;
        }
    }

    getOutline() {
        this.updateOutline();
        return this.outline;
    }

    detectClick() {
        if (this.isPointClose(this.game.mousePos)) {
            return this.detectCollision(this.game.mousePos);
        }
        return false;
    }

    detectCollision(point: Coordinates) {
        if (this.context.isPointInPath(new Path2D(this.getOutline()), point.x, point.y)) return true;
        return false;
    }

    highlightObject() {
        this.highlighted = true;
        this.updateOutline();
    }

    unhighlightObject() {
        this.highlighted = false;
    }

    isPointClose(point: Coordinates) {
        return (
            point.x > this.x &&
            point.x < this.x + this.width &&
            point.y > this.y &&
            point.y < this.y + this.height
        );
    }

    checkCollision(otherObject: GameObject) {
        if (this.loading || otherObject.loading) {
            return false;
        }
        otherObject.updateOutline();
        let otherObjectOutline = otherObject.outline;

        let path = new paper.Path(otherObjectOutline);
        this.updateOutline();
        let svgPath = new paper.Path(this.outline);

        let collision = path.intersects(svgPath) ? true : false;
        paper.project.clear();
        return collision;
    }

    draw() {
        if (this.loading) {
            this.loadFromExport();
            return;
        }
        if (this.flip) {
            this.context.drawImage(
                this.flippedImageElement,
                this.imageElement.naturalWidth - this.width - this.animationImagePosition[this.activeFrame].x,
                this.animationImagePosition[this.activeFrame].y,
                this.width,
                this.height,
                this.x,
                this.y,
                this.width,
                this.height
            );
        } else {
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
        if (this.highlighted) {
            this.context.fillStyle = this.fillColor;
            this.context.strokeStyle = this.outlineColor;
            this.context.lineWidth = this.outlineWidth;
            const path = new Path2D(this.outline);
            this.context.stroke(path);
        }
    }
}
