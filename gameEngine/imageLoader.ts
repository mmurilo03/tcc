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

const fsPathToGameFiles = "./gameEngine/GameClasses";
const files = fs.readdirSync(fsPathToGameFiles);
const filePaths: string[] = [];

const getFilesAndFolders = (path: string, files: string[]) => {
    files.forEach((file) => {
        if (fs.statSync(`${path}/${file}`).isDirectory()) {
            const newFiles = fs.readdirSync(`${path}/${file}`);
            getFilesAndFolders(`${path}/${file}`, newFiles);
        } else if (file.endsWith(".ts")) {
            filePaths.push(`${path}/${file}`);
        }
    });
};

getFilesAndFolders(fsPathToGameFiles, files);
filePaths.forEach(async (file) => {
    const importedClass = await import(file.replace("/gameEngine", ""));
    const keys = Object.keys(importedClass);
    keys.forEach(async (key) => {
        const currentClass = importedClass[key];
        const width = currentClass.width;
        const height = currentClass.height;
        const imageName = currentClass.imageName;
        if (width && height && imageName && fs.existsSync(`./public/${imageName}`)) {
            const image = await loadImage(`public/${imageName}`);
            const hitboxMaker = new HitboxMaker(
                {
                    context: context,
                    width: width,
                    height: height,
                    imageName: imageName,
                },
                image
            );
        }
    });
});
