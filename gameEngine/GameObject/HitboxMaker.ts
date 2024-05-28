import {
    Coordinates,
    CoordinatesAsKey,
    HitboxMakerInterface,
    HitboxMakerProperties,
} from "../Interfaces/HitboxMakerInterfaces";
import paper from "paper";
import { exports } from "../exports.json";
import { api } from "../axios";

interface DirectionPixels {
    pixelLeft: number;
    pixelUp: number;
    pixelRight: number;
    pixelDown: number;
}

interface DirectionCoords {
    leftCoord: Coordinates;
    upCoord: Coordinates;
    rightCoord: Coordinates;
    downCoord: Coordinates;
}

export class HitboxMaker implements HitboxMakerInterface, HitboxMakerProperties {
    context!: CanvasRenderingContext2D;
    imagePath!: string;
    width!: number;
    height!: number;
    precision?: number = 2.5;

    imageElement!: HTMLImageElement;
    hitboxCount!: number;
    activeFrame!: number;

    // Array with frames
    // Array with each outline of a frame
    // Array of points
    hitboxes!: string[][][];
    animationImagePosition!: Coordinates[];
    finalHitbox: { hitboxCount: number; hitboxes: string[][][]; animationImagePosition: Coordinates[] } = {
        hitboxCount: 0,
        hitboxes: [],
        animationImagePosition: [],
    };
    loading: boolean = true;

    async initialize(hitboxMakerInterface: HitboxMakerInterface) {
        this.context = hitboxMakerInterface.context;
        this.width = hitboxMakerInterface.width;
        this.height = hitboxMakerInterface.height;
        this.imagePath = hitboxMakerInterface.imagePath;
        this.precision = hitboxMakerInterface.precision ? hitboxMakerInterface.precision : 10;

        this.hitboxCount = 0;
        this.activeFrame = 0;
        this.hitboxes = []; // points of the hitbox
        this.animationImagePosition = []; // animation frame count per line on image

        const img = new Image();
        this.imageElement = img;

        await new Promise((resolve, reject) => {
            img.src = `./gameEngine/GameImages/${this.imagePath}`;
            img.onload = async () => {
                this.imageElement = img;
                if (!Object.keys(exports).includes(this.imagePath)) {
                    this.countHitboxes();
                    await this.loadHitBox();
                }
                resolve("done");
            };
            img.onerror = reject;
        });
        return new HitboxMaker();
    }

    eraseImage(outline: Coordinates[], outlineUniqueKeys: CoordinatesAsKey) {
        for (let element of outline) {
            let endPixel = [element.x, 0];
            let i = element.y + 1;
            for (i; i < this.height; i++) {
                if (this.searchByKeys({ x: endPixel[0], y: i }, outlineUniqueKeys)) {
                    break;
                }
            }
            this.context.clearRect(endPixel[0], element.y, 1, i);
        }
    }

    countHitboxes() {
        // console.log("Counting hitboxes and separating animation frames");
        // console.log(`Image: ${this.imagePath}`);
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
                    this.animationImagePosition.push({ x: positionX, y: positionY });
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

    async loadHitBox() {
        // console.log("Making hitbox outlines");
        let c = 0;
        while (c < this.hitboxCount) {
            // console.log(`Hitbox ${c + 1}/${this.hitboxCount}`);
            this.context.clearRect(0, 0, this.width, this.height);
            this.context.drawImage(
                this.imageElement,
                this.animationImagePosition[c].x,
                this.animationImagePosition[c].y,
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
            let tempHitboxUniqueKeys: CoordinatesAsKey = {};
            for (let pixel = 0; pixel <= pixels.length; pixel += 4) {
                // Searching for pixels with opacity
                const pixelOpacity = pixels[pixel + 3];
                if (pixelOpacity > 0) {
                    tempHitbox.push({
                        x: (pixel / 4) % this.width,
                        y: Math.floor(pixel / 4 / this.width),
                    });

                    let repetitions = 0;

                    let index = pixel;
                    let direction = "right";
                    while (repetitions < 5) {
                        // Gets the opacity of the pixels to each direction of the current pixel

                        // const pixelCurrent = pixels[index + 3];
                        const pixelLeft = pixels[index + 3 - 4] == undefined ? 0 : pixels[index + 3 - 4];
                        const pixelUp =
                            pixels[index + 3 - this.width * 4] == undefined
                                ? 0
                                : pixels[index + 3 - this.width * 4];
                        const pixelRight = pixels[index + 3 + 4] == undefined ? 0 : pixels[index + 3 + 4];
                        const pixelDown =
                            pixels[index + 3 + this.width * 4] == undefined
                                ? 0
                                : pixels[index + 3 + this.width * 4];
                        const directionPixels: DirectionPixels = {
                            pixelLeft,
                            pixelUp,
                            pixelRight,
                            pixelDown,
                        };

                        // Coordinates of each pixel
                        const currentCoord: Coordinates = {
                            x: (index / 4) % this.width,
                            y: Math.floor(index / 4 / this.width),
                        };
                        const leftCoord: Coordinates = {
                            x: ((index - 4) / 4) % this.width,
                            y: Math.floor(index / 4 / this.width),
                        };
                        const upCoord: Coordinates = {
                            x: (index / 4) % this.width,
                            y: Math.floor((index - this.width * 4) / 4 / this.width),
                        };
                        const rightCoord: Coordinates = {
                            x: ((index + 4) / 4) % this.width,
                            y: Math.floor(index / 4 / this.width),
                        };
                        const downCoord: Coordinates = {
                            x: (index / 4) % this.width,
                            y: Math.floor((index + this.width * 4) / 4 / this.width),
                        };

                        const directionCoords: DirectionCoords = {
                            leftCoord,
                            upCoord,
                            rightCoord,
                            downCoord,
                        };

                        // If moving the pixel to the right makes X coordinate less than current coordinate, it means it should go down
                        if (rightCoord.x < currentCoord.x) {
                            direction = "down";
                        }

                        // If moving the pixel to the left makes X coordinate more than current coordinate, it means it should go up
                        if (leftCoord.x > currentCoord.x) {
                            direction = "up";
                        }

                        const values = this.drawOutline(
                            direction,
                            currentCoord,
                            directionPixels,
                            directionCoords,
                            tempHitbox,
                            index
                        );

                        direction = values.direction;
                        index = values.index;
                        // Gets newest Point
                        let newPoint: Coordinates = tempHitbox[tempHitbox.length - 1];
                        tempHitboxUniqueKeys[`${newPoint.x}-${newPoint.y}`] = newPoint;

                        // If there are no points in the temporary hitbox, stop the loop
                        if (!tempHitbox[repetitions]) {
                            break;
                        }

                        // If the newest point repeats at the start of the temporary hitbox, count repetitions, else reset repetition
                        if (
                            tempHitbox[repetitions].x == newPoint.x &&
                            tempHitbox[repetitions].y == newPoint.y
                        ) {
                            repetitions++;
                        } else {
                            repetitions = 0;
                        }
                    }

                    this.eraseImage(tempHitbox, tempHitboxUniqueKeys);
                    imgData = this.context.getImageData(0, 0, this.width, this.height);
                    pixels = imgData.data;
                    if (tempHitbox.length > 0) {
                        this.hitboxes[c] = this.hitboxes[c] == undefined ? [] : this.hitboxes[c];

                        paper.setup(new paper.Size(1, 1));
                        const path = new paper.Path(tempHitbox);
                        path.simplify(this.precision);
                        const simplePath = (path.exportSVG() as SVGElement)
                            .getAttribute("d")
                            ?.toLocaleLowerCase() as string;
                        this.hitboxes[c].push([simplePath]);

                        tempHitbox = [];
                    }
                }
            }
            c++;
        }

        this.finalHitbox = {
            hitboxCount: this.hitboxCount,
            hitboxes: this.hitboxes,
            animationImagePosition: this.animationImagePosition,
        };

        this.finalHitbox.hitboxes.forEach(async (hitbox) => {
            await api.post("/objects", {
                imagePath: this.imagePath,
                hitboxCount: this.finalHitbox.hitboxCount,
                hitbox: hitbox,
                animationImagePosition: this.finalHitbox.animationImagePosition,
            });
        });
    }

    drawOutline(
        direction: string,
        currentCoord: Coordinates,
        { pixelLeft, pixelUp, pixelRight, pixelDown }: DirectionPixels,
        { leftCoord, upCoord, rightCoord, downCoord }: DirectionCoords,
        arr: Coordinates[],
        index: number
    ) {
        switch (direction) {
            case "right":
                if (pixelUp > 0) {
                    // look up
                    arr.push(upCoord);
                    direction = "up";
                    index -= this.width * 4;
                } else if (pixelRight > 0) {
                    // look right
                    arr.push(rightCoord);
                    direction = "right";
                    index += 4;
                } else if (pixelDown > 0) {
                    // look down
                    arr.push(downCoord);
                    direction = "down";
                    index += this.width * 4;
                } else if (pixelLeft > 0) {
                    // look left
                    arr.push(leftCoord);
                    direction = "left";
                    index -= 4;
                }
                break;
            case "down":
                if (pixelRight && rightCoord.x > currentCoord.x) {
                    // look right
                    arr.push(rightCoord);
                    direction = "right";
                    index += 4;
                } else if (pixelDown > 0) {
                    // look down
                    arr.push(downCoord);
                    direction = "down";
                    index += this.width * 4;
                } else if (pixelLeft > 0) {
                    // look left
                    arr.push(leftCoord);
                    direction = "left";
                    index -= 4;
                } else if (pixelUp > 0) {
                    // look up
                    arr.push(upCoord);
                    direction = "up";
                    index -= this.width * 4;
                }
                break;
            case "up":
                if (pixelLeft > 0 && leftCoord.x < currentCoord.x) {
                    // look left
                    arr.push(leftCoord);
                    direction = "left";
                    index -= 4;
                } else if (pixelUp > 0) {
                    // look up
                    arr.push(upCoord);
                    direction = "up";
                    index -= this.width * 4;
                } else if (pixelRight > 0) {
                    // look right
                    arr.push(rightCoord);
                    direction = "right";
                    index += 4;
                } else if (pixelDown > 0) {
                    // look down
                    arr.push(downCoord);
                    direction = "down";
                    index += this.width * 4;
                }
                break;
            case "left":
                if (pixelDown > 0) {
                    // look down
                    arr.push(downCoord);
                    direction = "down";
                    index += this.width * 4;
                } else if (pixelLeft > 0) {
                    // look left
                    arr.push(leftCoord);
                    direction = "left";
                    index -= 4;
                } else if (pixelUp > 0) {
                    // look up
                    arr.push(upCoord);
                    direction = "up";
                    index -= this.width * 4;
                } else if (pixelRight > 0) {
                    // look right
                    arr.push(rightCoord);
                    direction = "right";
                    index += 4;
                }
                break;
            default:
                break;
        }
        return { direction, index };
    }

    search(point: Coordinates, arr: Coordinates[]) {
        for (let arrayPoint of arr) {
            if (arrayPoint.x == point.x && arrayPoint.y == point.y) return true;
        }
    }

    searchByKeys(point: Coordinates, arr: CoordinatesAsKey) {
        return arr[`${point.x}-${point.y}`] == undefined ? false : true;
    }
}
