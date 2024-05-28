import express from "express";
import fs from "fs";
import cors from "cors";
import { exports } from "./exports.json";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/objects", async (req, res) => {
    res.json(exports);
});

app.post("/objects", (req, res) => {
    let jsonBefore = exports;
    let hitboxBefore = exports[`${req.body.imagePath}`];

    if (hitboxBefore?.hitboxes && hitboxBefore.hitboxes.length > 0) {
        hitboxBefore = {
            hitboxCount: req.body.hitboxCount,
            hitboxes: [...hitboxBefore.hitboxes, req.body.hitbox],
            animationImagePosition: req.body.animationImagePosition,
        };
    } else {
        hitboxBefore = {
            hitboxCount: req.body.hitboxCount,
            hitboxes: [req.body.hitbox],
            animationImagePosition: req.body.animationImagePosition,
        };
    }
    jsonBefore[`${req.body.imagePath}`] = hitboxBefore;

    fs.writeFileSync("./gameEngine/exports.json", JSON.stringify({ exports: jsonBefore }));
    res.status(200).send("ok");
});

const server = app.listen(3000, () => {
    console.log("Server ready");
});
