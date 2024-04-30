import express from "express";
import cors from "cors";
import { exports } from "./exports.json";
import { writeJsonFileSync } from "write-json-file";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/objects", async (req, res) => {
    res.json(exports);
});

app.post("/objects", async (req, res) => {
    exports[`${req.body.imagePath}`] = {
        hitboxCount: req.body.hitboxCount,
        hitboxes: req.body.hitboxes,
        animationImagePosition: req.body.animationImagePosition,
    };
    writeJsonFileSync("./gameEngine/exports.json", { exports: exports });
    res.status(200).send("ok");
});

const server = app.listen(3000, () => {
    console.log("Server ready");
});
