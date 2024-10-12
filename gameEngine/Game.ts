import { Dimensions } from "./Interfaces/Dimensions.ts";
import { Stage } from "./GameStages/Stage.ts";
import { Coordinates } from "./Interfaces/GameObjectInterfaces.ts";
import paper from "paper";
import { Background } from "./GameStages/Background.ts";

interface Stages {
    [propName: string]: Stage;
}

interface AllText {
    [propName: string]: Text;
}

interface AllAudio {
    [propName: string]: HTMLAudioElement;
}

interface Text {
    fontSize: string;
    fontStyle?: FontFace;
    text: string;
    id: string;
    textColor?: string;
    textPositionX: number;
    textPositionY: number;
    textOutlineColor?: string;
    textOutlineWidth?: number;
}

export class Game {
    width: number;
    height: number;
    horizontalOffset: number = 0;
    verticalOffset: number = 0;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    extraCanvas: HTMLCanvasElement;
    extraContext: CanvasRenderingContext2D;

    prevBackgroundImage: HTMLImageElement = new Image();
    backgroundImage: HTMLImageElement = new Image();
    verticalScroll: number;
    horizontalScroll: number;
    fadeIn: number = 0;
    fadeOut: number = 2;
    background: Background | undefined;

    pos: Coordinates = { x: 0, y: 0 };
    inputs: string[] = [];
    stages: Stages = {};
    activeStage?: Stage;
    globalStage?: Stage;
    mousePos: Coordinates = { x: 0, y: 0 };
    mouseClick: boolean = false;

    allText: AllText = {};
    allAudio: AllAudio = {};

    constructor({ width, height }: Dimensions) {
        this.width = width;
        this.height = height;
        paper.setup(new paper.Size(1, 1));

        this.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;
        this.extraCanvas = document.createElement("canvas");
        this.extraCanvas.width = width;
        this.extraCanvas.height = height;
        this.extraContext = this.extraCanvas.getContext("2d", {
            willReadFrequently: true,
        }) as CanvasRenderingContext2D;
        this.verticalScroll = 0;
        this.horizontalScroll = 0;
    }

    addInput(key: string) {
        if (this.inputs.includes(key)) return;
        this.inputs.push(key);
    }

    start = () => {
        this.update();
        requestAnimationFrame(this.start);
    };

    removeInput(key: string) {
        if (!this.inputs.includes(key)) return;
        this.inputs.splice(this.inputs.indexOf(key), 1);
    }

    moveCamera(horizontal: number, vertical: number) {
        if (this.background) {
            this.context.translate(-horizontal, vertical);
            if (vertical > 0) {
                this.verticalScroll -= this.background.verticalScroll;
            } else if (vertical < 0) {
                this.verticalScroll += this.background.verticalScroll;
            }
            
            if (horizontal > 0) {
                this.horizontalScroll += this.background.horizontalScroll;
            } else if (horizontal < 0) {
                this.horizontalScroll -= this.background.horizontalScroll;
            }
            this.pos = { x: this.pos.x + horizontal, y: this.pos.y + vertical };

            this.horizontalOffset -= horizontal;
            this.verticalOffset += vertical;
        }
    }

    update() {
        this.context.clearRect(-this.horizontalOffset, -this.verticalOffset, this.width, this.height);
        if (this.background) {
            if (this.fadeOut > 0) {
                this.drawBackgroundFadeOut();
            }
            this.drawBackgroundFadeIn();
        }
        this.context.globalAlpha = 1;
        if (this.activeStage) {
            this.activeStage.update();
        }
        for (let key in this.allText) {
            let text = this.allText[key];
            let font;
            if (text.fontStyle) {
                font = `${text.fontSize} "${text.fontStyle.family}"`;
            } else {
                font = `${text.fontSize} sans-serif`;
            }

            this.context.font = font;
            this.context.fillStyle = text.textColor ? text.textColor : "black";
            this.context.fillText(text.text, text.textPositionX, text.textPositionY);
            if (text.textOutlineColor && text.textOutlineWidth) {
                this.context.lineWidth = text.textOutlineWidth;
                this.context.strokeStyle = text.textOutlineColor;
                this.context.strokeText(text.text, text.textPositionX, text.textPositionY);
            }
        }
        paper.project.clear();
    }

    setBackground(imagePath: string, background: Background) {
        this.fadeIn = 0;
        this.fadeOut = 2;
        if (!this.background) {
            this.fadeIn = 1;
        }
        this.background = background;
        this.prevBackgroundImage = this.backgroundImage;
        const img = new Image();
        img.src = `../MainGame/GameImages/${imagePath}`;
        img.onload = () => {
            this.backgroundImage = img;
        };
    }

    removeBackground() {
        this.background = undefined;
    }

    drawBackgroundFadeIn() {
        this.context.globalAlpha = this.fadeIn;

        if (this.background?.repeatHorizontal) {
            if (this.background.repeatVertical) {
                this.drawBackgroundRepeatBoth(this.backgroundImage);
            } else {
                this.drawBackgroundRepeatHorizontal(this.backgroundImage);
            }
        } else {
            if (this.background?.repeatVertical) {
                this.drawBackgroundRepeatVertical(this.backgroundImage);
            } else {
                this.drawBackgroundNoRepeat(this.backgroundImage)
            }
        }
        if (this.background) {
            this.fadeIn = this.fadeIn >= 1 ? 1 : this.fadeIn + this.background.fadeSpeed;
        }
    }

    drawBackgroundFadeOut() {
        this.context.globalAlpha = this.fadeOut;
        if (this.background?.repeatHorizontal) {
            if (this.background.repeatVertical) {
                this.drawBackgroundRepeatBoth(this.prevBackgroundImage);
            } else {
                this.drawBackgroundRepeatHorizontal(this.prevBackgroundImage);
            }
        } else {
            if (this.background?.repeatVertical) {
                this.drawBackgroundRepeatVertical(this.prevBackgroundImage);
            } else {
                this.drawBackgroundNoRepeat(this.backgroundImage)
            }
        }
    }

    drawBackgroundRepeatHorizontal(image: HTMLImageElement) {
        const loop = Math.floor(this.pos.x / image.naturalWidth);

        if (this.pos.y >= 0) {
            this.context.drawImage(image, image.naturalWidth * loop, -this.pos.y);
            this.context.drawImage(image, image.naturalWidth * (loop + 1), -this.pos.y);
        } else if (this.verticalScroll < 100) {
            this.context.drawImage(
                image,
                image.naturalWidth * loop,
                -this.pos.y - ((image.naturalHeight - this.height) * this.verticalScroll) / 100
            );
            this.context.drawImage(
                image,
                image.naturalWidth * (loop + 1),
                -this.pos.y - ((image.naturalHeight - this.height) * this.verticalScroll) / 100
            );
        } else {
            this.context.drawImage(
                image,
                image.naturalWidth * loop,
                -(image.naturalHeight - this.height) - this.pos.y
            );
            this.context.drawImage(
                image,
                image.naturalWidth * (loop + 1),
                -(image.naturalHeight - this.height) - this.pos.y
            );
        }
    }

    drawBackgroundRepeatVertical(image: HTMLImageElement) {
        const loopV = Math.floor(this.pos.y / image.naturalHeight);
        
        if (this.pos.x <= 0) {
            this.context.drawImage(image, this.pos.x, - image.naturalHeight * loopV);
            this.context.drawImage(image, this.pos.x, - image.naturalHeight * (loopV + 1));
        } else if (this.horizontalScroll < 100) {
            this.context.drawImage(
                image,
                this.pos.x - ((image.naturalWidth) - this.width) * this.horizontalScroll / 100,
                -image.naturalHeight * loopV
            );
            this.context.drawImage(
                image,
                this.pos.x - ((image.naturalWidth) - this.width) * this.horizontalScroll / 100,
                -image.naturalHeight * (loopV + 1)
            );
        } else {            
            this.context.drawImage(
                image,
                this.pos.x - (image.naturalWidth - this.width),
                -image.naturalHeight * loopV
            );
            this.context.drawImage(
                image,
                this.pos.x - (image.naturalWidth - this.width),
                -image.naturalHeight * (loopV + 1)
            );
        }
    }

    drawBackgroundRepeatBoth(image: HTMLImageElement) {
        const loopH = Math.floor(this.pos.x / image.naturalWidth);
        const loopV = Math.floor(this.pos.y / image.naturalHeight);

        this.context.drawImage(image, image.naturalWidth * loopH, - image.naturalHeight * loopV);
        this.context.drawImage(image, image.naturalWidth * (loopH + 1), -image.naturalHeight * loopV);
        this.context.drawImage(image, image.naturalWidth * loopH, - image.naturalHeight * (loopV + 1));
        this.context.drawImage(image, image.naturalWidth * (loopH + 1), - image.naturalHeight * (loopV + 1));
    }

    drawBackgroundNoRepeat(image: HTMLImageElement) {
        if (this.pos.x <= 0) {
            if (this.pos.y >= 0) {
                this.context.drawImage(image, this.pos.x, -this.pos.y);
            } else if (this.verticalScroll < 100) {
                this.context.drawImage(image, this.pos.x, -this.pos.y - ((image.naturalHeight - this.height) * this.verticalScroll) / 100);
            } else {
                this.context.drawImage(image, this.pos.x, -(image.naturalHeight - this.height) - this.pos.y);
            }
        } else if (this.horizontalScroll < 100) {
            if (this.pos.y >= 0) {
                this.context.drawImage(image, this.pos.x - ((image.naturalWidth) - this.width) * this.horizontalScroll / 100, -this.pos.y);
            } else if (this.verticalScroll < 100) {
                this.context.drawImage(image, this.pos.x - ((image.naturalWidth) - this.width) * this.horizontalScroll / 100, -this.pos.y - ((image.naturalHeight - this.height) * this.verticalScroll) / 100);
            } else {
                this.context.drawImage(image, this.pos.x - ((image.naturalWidth) - this.width) * this.horizontalScroll / 100, -(image.naturalHeight - this.height) - this.pos.y);
            }
        } else {
            if (this.pos.y >= 0) {
                this.context.drawImage(image, this.pos.x - (image.naturalWidth - this.width), -this.pos.y);
            } else if (this.verticalScroll < 100) {
                this.context.drawImage(image, this.pos.x - (image.naturalWidth - this.width), -this.pos.y - ((image.naturalHeight - this.height) * this.verticalScroll) / 100);
            } else {
                this.context.drawImage(image, this.pos.x - (image.naturalWidth - this.width), -(image.naturalHeight - this.height) - this.pos.y);
            }
        }
    }

    addStage(stage: Stage) {
        if (stage.name == "global") {
            this.globalStage = stage;
        } else {
            this.stages[stage.name] = stage;
        }
    }

    changeStage(name: string) {
        if (this.globalStage) {
            for (let obj of this.globalStage.stageObjects) {
                this.stages[name].addGlobalObject(obj);
                this.activeStage?.removeGlobalObject(obj);
            }
        }
        this.activeStage = this.stages[name];
        this.activeStage.init();
    }

    updateMousePos(screenSize: { width: number; height: number }, newPos: Coordinates) {
        newPos.x = Math.floor((this.width / screenSize.width) * newPos.x);
        newPos.y = Math.floor((this.height / screenSize.height) * newPos.y);
        this.mousePos = newPos;
    }

    mouseDown() {
        this.mouseClick = true;
    }

    mouseUp() {
        this.mouseClick = false;
    }

    addText(text: Text) {
        if (this.allText[text.id]) return;
        this.allText[text.id] = text;
        if (text.fontStyle) {
            document.fonts.add(text.fontStyle);
            text.fontStyle.load();
        }
    }

    removeText(text: Text) {
        delete this.allText[text.id];
    }

    clearText() {
        for (let key of Object.keys(this.allText)) {
            delete this.allText[key];
        }
    }

    startAudio(audioPath: string, speed?: number) {
        let checkedAudio = this.allAudio[audioPath];
        if (checkedAudio && (checkedAudio.currentTime >= checkedAudio.duration || checkedAudio.paused)) {
            checkedAudio.play();
            return;
        } else if (checkedAudio && !checkedAudio.paused) {
            console.log(`Sound: ${audioPath} already playing`);
            return;
        }
        let audio: HTMLAudioElement;
        audio = new Audio(`../MainGame/GameSounds/${audioPath}`);
        if (speed && speed >= 0.1 && speed <= 16) {
            audio.playbackRate = speed;
        }
        this.allAudio[audioPath] = audio;
        audio.play().catch(() => {
            delete this.allAudio[audioPath];
            console.log(`File: ${audioPath} not in GameSounds`);
        });
    }

    playAudio(audioPath: string, speed?: number) {
        let audio = new Audio(`../MainGame/GameSounds/${audioPath}`);
        if (speed && speed >= 0.1 && speed <= 16) {
            audio.playbackRate = speed;
        }
        audio.play().catch(() => {
            console.log(`File: ${audioPath} not in GameSounds`);
        });
    }

    pauseAudio(audioPath: string) {
        if (!this.allAudio[audioPath]) return;
        this.allAudio[audioPath].pause();
    }

    deleteAudio(audioPath: string) {
        if (!this.allAudio[audioPath]) return;
        delete this.allAudio[audioPath];
    }

    getAudio(audioPath: string) {
        if (this.allAudio[audioPath]) return this.allAudio[audioPath];
    }
}
