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
    loading: boolean = true;
    hitboxCount: number;
    activeFrame: number;
    frameCounter: number;
    flip: boolean = false;
    // Array with frames
    // Array with each outline of a frame
    // Array of points
    hitboxes: string[][][];
    animationImagePosition: Coordinates[];
    clicked: boolean = false;
    highlighted: boolean = false;
    outline: string = "";
    outlineColor: string = "red";
    fillColor: string = "black";
    outlineWidth: number = 1;
    name: string = "";
    flippedImageElement: HTMLImageElement;

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
        this.outline = `M${this.x} ${this.y}`;
        if (this.loading) {
            this.loadFromExport();
            if (this.highlighted) {
                this.highlightObject();
            }
            return;
        }
        for (let outline = 0; outline < this.hitboxes[this.activeFrame].length; outline++) {
            let currentOutline = this.hitboxes[this.activeFrame][outline];
            this.outline += currentOutline[0] + `M${this.x} ${this.y}`;
        }
        if (this.flip) {
            let path = new paper.Path(this.outline);
            let pathX = path.position.x - path.bounds.width / 2;
            let ajustment = this.x - pathX;
            let translate = this.x + this.width - (pathX + path.bounds.width) + ajustment;
            path.scale(-1, 1);
            path.translate([translate, 0]);
            this.outline = path.pathData;
        }
    }

    getOutline() {
        this.updateOutline();
        return this.outline;
    }

    getPositionFromBorder() {
        return { x: -this.game.pos.x + this.x, y: this.game.pos.y + this.y }
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
        if (!this.checkLeftRight(otherObject) || !this.checkUpDown(otherObject)) return false;
        
        otherObject.updateOutline();
        let otherObjectOutline = otherObject.outline;

        let path = new paper.Path(otherObjectOutline);
        this.updateOutline();
        let thisObjectPath = new paper.Path(this.outline);

        let collision = path.intersects(thisObjectPath) ? true : false;
        return collision;
    }

    checkIfWillCollide(otherObject: GameObject, horizontalDistance: number, verticalDistance: number) {
        if (this.loading || otherObject.loading) {
            return false;
        }
        otherObject.updateOutline();
        let otherObjectOutline = otherObject.outline;

        let path = new paper.Path(otherObjectOutline);
        this.updateOutline();
        let thisObjectPath = new paper.Path(this.outline);
        thisObjectPath.translate([horizontalDistance, verticalDistance]);

        let collision = path.intersects(thisObjectPath) ? true : false;
        return collision;
    }

    checkDistance(otherObject: GameObject) {
        if (this.loading || otherObject.loading) {
            return false;
        }
        otherObject.updateOutline();
        this.updateOutline();

        let distance = { x: 0, y: 0 };

        if (this.checkObjectIsToTheRight(otherObject)) {
            distance.x = otherObject.x - (this.x + this.width);
        } else {
            let dist = this.x - (otherObject.x + otherObject.width)
            distance.x = dist <= 0 ? 0 : dist
        }

        if (this.checkObjectIsBelow(otherObject)) {
            distance.y = otherObject.y - (this.y + this.height);
        } else {
            let dist = this.y - (otherObject.y + otherObject.height)
            distance.y = dist <= 0 ? 0 : dist
        }

        return distance;
    }

    checkObjectIsToTheRight(otherObject: GameObject) {
        if (this.loading || otherObject.loading) {
            return false;
        }
        let thisWidthPlusX = this.x + this.width;
        if (thisWidthPlusX < otherObject.x) {
            return true;
        }
        return false;
    }

    checkObjectIsBelow(otherObject: GameObject) {
        if (this.loading || otherObject.loading) {
            return false;
        }
        let thisHeightPlusY = this.y + this.height;
        if (thisHeightPlusY < otherObject.y) {
            return true;
        }
        return false;
    }

    checkLeftRight(otherObject: GameObject) {
        if (this.loading || otherObject.loading) {
            return false;
        }
        let thisWidthPlusX = this.x + this.width;
        let otherWidthPlusX = otherObject.x + otherObject.width;
        if (thisWidthPlusX > otherObject.x && this.x < otherWidthPlusX) {
            return true;
        }
        return false;
    }

    checkUpDown(otherObject: GameObject) {
        if (this.loading || otherObject.loading) {
            return false;
        }
        this.updateOutline();
        let thisHeightPlusY = this.y + this.height;
        let otherHeightPlusY = otherObject.y + otherObject.height;
        if (thisHeightPlusY > otherObject.y && this.y < otherHeightPlusY) {
            return true;
        }
        return false;
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
