import { Game } from "../Game";
import { Stage } from "./Stage";

// Makes the stage constructable
interface StageInterface {
    [stage: string]: new (game: Game) => Stage;
}

interface StagePaths {
    [pathToStage: string]: StageInterface;
}

const stages: StagePaths = import.meta.glob("../../MainGame/Stages/*.ts", { eager: true });
let temp = [];

for (const path in stages) {
    // Picks the stage class
    const stageName = Object.keys(stages[path])[0];
    temp.push(stages[path][stageName]);
}

export const allStages = temp;
