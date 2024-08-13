import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post("/objects", (req, res) => {
    let jsonBefore = JSON.parse(fs.readFileSync("./gameEngine/exports.json", "utf-8")).exports;
    if (
        jsonBefore[`${req.body.imagePath}`] &&
        jsonBefore[`${req.body.imagePath}`].hitboxCount == jsonBefore[`${req.body.imagePath}`].hitboxes.length
    ) {
        res.status(200).send("ok");
        return;
    }
    let hitboxBefore = jsonBefore[`${req.body.imagePath}`];

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

    fs.writeFileSync("./gameEngine/exports.json", JSON.stringify({ exports: jsonBefore }, null, 4));
    res.status(200).send("ok");
    return;
});

const server = app.listen(3000, () => {
    console.log("Server ready");
});
