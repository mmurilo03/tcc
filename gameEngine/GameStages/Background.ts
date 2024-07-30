export class Background {
    imagePath: string;
    scrollAmount: number;
    fadeSpeed: number;

    constructor(imagePath: string, scrollAmount?: number, fadeSpeed?: number) {
        this.imagePath = imagePath;
        this.scrollAmount = scrollAmount ? scrollAmount : 1;
        this.fadeSpeed = fadeSpeed ? fadeSpeed : 0.005;
    }
}
