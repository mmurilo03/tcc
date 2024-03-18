import { Coordinates, HitboxMakerInterface, HitboxMakerProperties } from "../Interfaces/HitboxMakerInterfaces";
import { CanvasRenderingContext2D, Image } from "canvas";
import { writeJsonFile } from "write-json-file";

export class HitboxMaker implements HitboxMakerInterface, HitboxMakerProperties {
    context: CanvasRenderingContext2D;
    imageName: string;
    imageElement: Image;
    hitboxCount: number;
    activeFrame: number;

    // Array with frames
    // Array with each outline of a frame
    // Array of points
    hitboxes: Coordinates[][][];
    animationFrame: Coordinates[];

    width: number;
    height: number;

    constructor(hitboxMakerInterface: HitboxMakerInterface, image: Image) {
        this.context = hitboxMakerInterface.context;
        this.width = hitboxMakerInterface.width;
        this.height = hitboxMakerInterface.height;
        this.imageName = hitboxMakerInterface.imageName;

        this.hitboxCount = 0;
        this.activeFrame = 0;
        this.hitboxes = []; // points of the hitbox
        this.animationFrame = []; // animation frame count per line on image

        this.imageElement = image;
        this.countHitboxes()
        this.loadHitBox()
    }

    eraseImage(outline: Coordinates[]) {
        outline.forEach((element) => {
            let endPixel = [element.x, 0];
            for (let i = element.y + 1; i < this.height; i++) {
                if (this.search({ x: endPixel[0], y: i }, outline)) {
                    this.context.clearRect(endPixel[0], element.y, 1, i);
                }
            }
        });
    }

    countHitboxes() {
        console.log("Counting hitboxes and separating animation frames");
        // Image size divided by object size
        let numberOfPossibleHitboxes =
            (this.imageElement.naturalHeight * this.imageElement.naturalWidth) / (this.height * this.width);
        let loopCounter = 0;
        let positionX = 0; // X position of the cropped image
        let positionY = 0; // Y position of the cropped image
        while (loopCounter < numberOfPossibleHitboxes) {
            this.context.drawImage(
                this.imageElement,
                positionX,
                positionY,
                this.width,
                this.height,
                0,
                0,
                this.width,
                this.height
            );
            const imgData = this.context.getImageData(0, 0, this.width, this.height);
            const pixels = imgData.data;
            for (let i = 0; i <= pixels.length; i += 4) {
                // const r = pixels[i];
                // const g = pixels[i+1];
                // const b = pixels[i+2];
                const o = pixels[i + 3];

                if (o > 0) {
                    this.animationFrame.push({ x: positionX, y: positionY });
                    this.hitboxCount++;
                    break;
                }
            }

            this.context.clearRect(0, 0, this.width, this.height);
            positionX += this.width; // Moves the cropped image to the left based on width
            if (positionX >= this.imageElement.naturalWidth) {
                // Resets position if it's out of the image and moves down
                positionY += this.height;
                positionX = 0;
            }
            loopCounter++;
            if (positionY > this.imageElement.naturalHeight) {
                // Stops the counting
                break;
            }
        }
        console.log("HITBOX COUNT: ", this.hitboxCount);
    }

    loadHitBox() {
        console.log("Making hitbox outlines");
        let c = 0;
        while (c < this.hitboxCount) {
            this.context.clearRect(0, 0, this.width, this.height);
            this.context.drawImage(
                this.imageElement,
                this.animationFrame[c].x,
                this.animationFrame[c].y,
                this.width,
                this.height,
                0,
                0,
                this.width,
                this.height
            );

            // Image details
            let imgData = this.context.getImageData(0, 0, this.width, this.height);
            let pixels = imgData.data;
            let tempHitbox: Coordinates[] = [];
            for (let pixel = 0; pixel <= pixels.length; pixel += 4) {
                // Searching for pixels with opacity
                const pixelOpacity = pixels[pixel + 3];
                if (pixelOpacity > 0) {
                    console.log("Found");
                    for (let i = pixel; i <= pixels.length; i += 4) {
                        // If it finds a pixel, creates hitbox
                        // const r = pixels[i];
                        // const g = pixels[i+1];
                        // const b = pixels[i+2];
                        const o = pixels[i + 3];
                        if (o > 0) {
                            tempHitbox.push({
                                x: (i / 4) % this.width,
                                y: Math.floor(i / 4 / 100),
                            });
                        }
                    }
                    tempHitbox = this.drawOutline(tempHitbox);
                    this.eraseImage(tempHitbox);
                    imgData = this.context.getImageData(0, 0, this.width, this.height);
                    pixels = imgData.data;
                    if (tempHitbox.length > 0) {
                        this.hitboxes[c] = this.hitboxes[c] == undefined ? [] : this.hitboxes[c];
                        this.hitboxes[c].push([...tempHitbox]);

                        tempHitbox = [];
                    }
                }
            }
            c++;
        }
        // this.draw(this.context);
        const hitbox = {}
        hitbox[`${this.imageName}`] = { hitboxCount: this.hitboxCount ,hitboxes: this.hitboxes, animationFrame: this.animationFrame};
        writeJsonFile("./gameEngine/exports.json", { exports: hitbox });
    }

    drawOutline(arr: Coordinates[]) {
        let newArr: Coordinates[] = [];
        newArr.push(arr[0]); // First point of the outline
        let direction = "right";
        let count = 0;
        for (let i = 0; i < arr.length; i++) {
            const lastPoint: Coordinates = newArr[newArr.length - 1];
            if (direction == "right") {
                if (this.search({ x: lastPoint.x, y: lastPoint.y - 1 }, arr)) {
                    // look up
                    newArr.push({ x: lastPoint.x, y: lastPoint.y - 1 });
                    direction = "up";
                } else if (this.search({ x: lastPoint.x + 1, y: lastPoint.y }, arr)) {
                    // look right
                    newArr.push({ x: lastPoint.x + 1, y: lastPoint.y });
                    direction = "right";
                } else if (this.search({ x: lastPoint.x, y: lastPoint.y + 1 }, arr)) {
                    // look down
                    newArr.push({ x: lastPoint.x, y: lastPoint.y + 1 });
                    direction = "down";
                } else if (this.search({ x: lastPoint.x - 1, y: lastPoint.y }, arr)) {
                    // look left
                    newArr.push({ x: lastPoint.x - 1, y: lastPoint.y });
                    direction = "left";
                }
            } else if (direction == "down") {
                if (this.search({ x: lastPoint.x + 1, y: lastPoint.y }, arr)) {
                    // look right
                    newArr.push({ x: lastPoint.x + 1, y: lastPoint.y });
                    direction = "right";
                } else if (this.search({ x: lastPoint.x, y: lastPoint.y + 1 }, arr)) {
                    // look down
                    newArr.push({ x: lastPoint.x, y: lastPoint.y + 1 });
                    direction = "down";
                } else if (this.search({ x: lastPoint.x - 1, y: lastPoint.y }, arr)) {
                    // look left
                    newArr.push({ x: lastPoint.x - 1, y: lastPoint.y });
                    direction = "left";
                } else if (this.search({ x: lastPoint.x, y: lastPoint.y - 1 }, arr)) {
                    // look up
                    newArr.push({ x: lastPoint.x, y: lastPoint.y - 1 });
                    direction = "up";
                }
            } else if (direction == "up") {
                if (this.search({ x: lastPoint.x - 1, y: lastPoint.y }, arr)) {
                    // look left
                    newArr.push({ x: lastPoint.x - 1, y: lastPoint.y });
                    direction = "left";
                } else if (this.search({ x: lastPoint.x, y: lastPoint.y - 1 }, arr)) {
                    // look up
                    newArr.push({ x: lastPoint.x, y: lastPoint.y - 1 });
                    direction = "up";
                } else if (this.search({ x: lastPoint.x + 1, y: lastPoint.y }, arr)) {
                    // look right
                    newArr.push({ x: lastPoint.x + 1, y: lastPoint.y });
                    direction = "right";
                } else if (this.search({ x: lastPoint.x, y: lastPoint.y + 1 }, arr)) {
                    // look down
                    newArr.push({ x: lastPoint.x, y: lastPoint.y + 1 });
                    direction = "down";
                }
            } else if (direction == "left") {
                if (this.search({ x: lastPoint.x, y: lastPoint.y + 1 }, arr)) {
                    // look down
                    newArr.push({ x: lastPoint.x, y: lastPoint.y + 1 });
                    direction = "down";
                } else if (this.search({ x: lastPoint.x - 1, y: lastPoint.y }, arr)) {
                    // look left
                    newArr.push({ x: lastPoint.x - 1, y: lastPoint.y });
                    direction = "left";
                } else if (this.search({ x: lastPoint.x, y: lastPoint.y - 1 }, arr)) {
                    // look up
                    newArr.push({ x: lastPoint.x, y: lastPoint.y - 1 });
                    direction = "up";
                } else if (this.search({ x: lastPoint.x + 1, y: lastPoint.y }, arr)) {
                    // look right
                    newArr.push({ x: lastPoint.x + 1, y: lastPoint.y });
                    direction = "right";
                }
            }
            count++;
        }
        return newArr;
    }

    search(point: Coordinates, arr: Coordinates[]) {
        return arr.some((value) => {
            return value.x == point.x && value.y == point.y;
        });
    }
}
