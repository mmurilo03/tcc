export class Background {
    imagePath: string;
    repeatHorizontal: boolean = true;
    horizontalScroll: number = 1;
    repeatVertical: boolean = false;
    verticalScroll: number = 1;
    fadeSpeed: number = 0.005;

    constructor(imagePath: string, verticalScroll?: number, fadeSpeed?: number) {
        this.imagePath = imagePath;
        this.verticalScroll = verticalScroll ? verticalScroll : 1;
        this.fadeSpeed = fadeSpeed ? fadeSpeed : 0.005;
    }
}
