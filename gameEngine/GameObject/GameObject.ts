import { Coordinates, GameObjectInterface, GameObjectProperties } from "../Interfaces/GameObjectInterfaces";
import { Context } from "../Interfaces/Context.ts";

export class GameObject implements GameObjectInterface, GameObjectProperties {
    context: Context;
    imageName: string;
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
    hitboxes: Coordinates[][][];
    animationFrame: Coordinates[];

    width: number;
    height: number;

    constructor(gameObjectInterface: GameObjectInterface, imageElement?: HTMLImageElement) {
        this.context = gameObjectInterface.context;
        this.imageName = gameObjectInterface.imageName;
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
        this.imageElement = imageElement ? imageElement : img;

        if (!imageElement) {
            img.src = this.imageName;
            img.onload = () => {
                this.imageElement = img;
                this.countHitboxes();
                this.loadHitBox();
                this.loading = false;
            };
        } else {
            this.countHitboxes();
            this.loadHitBox();
            this.loading = false;
        }
    }

    eraseImage(outline: Coordinates[]) {
        // console.log("Erasing");
        // console.log(outline);
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
        this.hitboxCount = 2;
    }

    loadHitBox() {
        console.log("Making hitbox outlines");
        let c = 0;
        while (c < this.hitboxCount) {
            // console.log("Loading: ", c);
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
            // console.log(pixels.length);
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
                    // console.log(tempHitbox);
                    tempHitbox = this.drawOutline(tempHitbox);
                    this.eraseImage(tempHitbox);
                    imgData = this.context.getImageData(0, 0, this.width, this.height);
                    pixels = imgData.data;
                    if (tempHitbox.length > 0) {
                        this.hitboxes[c] = this.hitboxes[c] == undefined ? [] : this.hitboxes[c];
                        this.hitboxes[c].push([...tempHitbox]);

                        tempHitbox = [];
                        // this.context.putImageData(imgData, 0, 0);
                        // this.context.strokeRect(1, 1, this.width - 2, this.height - 2);
                        // this.context.clearRect(0, 0, this.width, this.height);
                    }
                    // break; [[0], [1], [2]]
                }
            }
            c++;
        }
        // this.draw(this.context);
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
        // console.log(arr);
        // console.log(newArr);
        return newArr;
    }

    search(point: Coordinates, arr: Coordinates[]) {
        return arr.some((value) => {
            return value.x == point.x && value.y == point.y;
        });
    }

    update(n: number) {
        this.x += n;
    }

    draw() {
        this.context.save();
        if (this.flip) {
            this.context.scale(-1, 1);
            this.context.translate(-500, 0);
        }
        // this.frameCounter++;
        if (this.frameCounter > 10) {
            this.frameCounter = 0;
            this.activeFrame++;
            if (this.activeFrame >= this.hitboxCount) {
                this.activeFrame = 0;
            }
        }
        this.context.fillStyle = "red";
        this.context.strokeStyle = "red";
        // this.context.fillRect(this.x, this.y, this.width, this.height);

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
        this.context.beginPath();
        // For each animation frame, get every outline and draw it
        for (let outline = 0; outline < this.hitboxes[this.activeFrame].length; outline++) {
            let currentOutline = this.hitboxes[this.activeFrame][outline];
            // Move to the first point
            this.context.moveTo(currentOutline[0].x + this.x, currentOutline[0].y + this.y);
            // Draw the outline
            for (let i = 0; i < currentOutline.length; i++) {
                this.context.lineTo(currentOutline[i].x + this.x, currentOutline[i].y + this.y);
            }
        }
        // this.context.fill();
        this.context.stroke();
        this.context.restore();
    }

    drawSimple() {
        // this.frameCounter++;
        // this.context.fillRect(this.x, this.y, this.width, this.height);
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
