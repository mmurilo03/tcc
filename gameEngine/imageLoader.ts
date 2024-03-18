import * as fs from "fs";
import jsdom from "jsdom";
import { createCanvas, loadImage } from "canvas";
import { HitboxMaker } from "./GameObject/HitboxMaker";

const { JSDOM } = jsdom;
const fakeDOM = new JSDOM(
    `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Build Page</title>
      </head>
      <body>
        <div id="root"></div>
      </body>
    </html>
`,
    {
        resources: "usable",
    }
);
global.document = fakeDOM.window.document;
global.window = fakeDOM.window as any;
global.Image = fakeDOM.window.Image;

const canvas = createCanvas(500, 500);
const context = canvas.getContext("2d");

const files = fs.readdirSync("./gameEngine/GameClasses");

files.forEach(async (file) => {
    const importedClass = await import(`./GameClasses/${file}`);

    const gameClass = importedClass[file.split(".")[0]];

    const image = await loadImage(`public/${gameClass.imageName}`);

    // const c = new gameClass({ context, x: 0, y: 0 });

    console.log(importedClass);

    const b = new HitboxMaker({
        context: context,
        width: gameClass.width,
        height: gameClass.height,
        imageName: gameClass.imageName,
    }, image);
});

