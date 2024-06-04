import { Dimensions } from "./Interfaces/Dimensions.ts";
import { Stage } from "./GameStages/Stage.ts";
import { Coordinates } from "./Interfaces/GameObjectInterfaces.ts";

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
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    extraCanvas: HTMLCanvasElement;
    extraContext: CanvasRenderingContext2D;
    inputs: string[] = [];
    stages: Stages = {};
    activeStage?: Stage;
    globalObjects: Stage = new Stage(this, "global");
    mousePos: Coordinates = { x: 0, y: 0 };
    mouseClick: boolean = false;

    allText: AllText = {};
    allAudio: AllAudio = {};

    constructor({ width, height }: Dimensions) {
        this.width = width;
        this.height = height;

        this.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;
        this.extraCanvas = document.createElement("canvas");
        this.extraCanvas.width = width;
        this.extraCanvas.height = height;
        this.extraContext = this.extraCanvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;
    }

    addInput(key: string) {
        if (this.inputs.includes(key)) return;
        this.inputs.push(key);
    }

    removeInput(key: string) {
        if (!this.inputs.includes(key)) return;
        this.inputs.splice(this.inputs.indexOf(key), 1);
    }

    update() {
        this.globalObjects.update();
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
    }

    addStage(stage: Stage) {
        if (stage.name == "global") {
            this.globalObjects = stage;
        } else {
            this.stages[stage.name] = stage;
        }
    }

    changeStage(name: string) {
        this.activeStage = this.stages[name];
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
        audio = new Audio(`./gameEngine/GameSounds/${audioPath}`);
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
        let audio = new Audio(`./gameEngine/GameSounds/${audioPath}`);
        if (speed && speed >= 0.1 && speed <= 16) {
            audio.playbackRate = speed;
        }
        audio.play().catch(() => {
            console.log(`File: ${audioPath} not in GameSounds`)
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
