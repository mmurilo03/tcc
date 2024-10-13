import { Game } from "../../gameEngine/Game";
import { Floor } from "../GameClasses/Floor/Floor";
import { Wolf } from "../GameClasses/Wolf";
import { Background } from "../../gameEngine/GameStages/Background";
import { Stage } from "../../gameEngine/GameStages/Stage";
import { FireBall } from "../GameClasses/FireBall";
import { BlueSlime } from "../GameClasses/BlueSlime";
import { GreenSlime } from "../GameClasses/GreenSlime";
import { Knight } from "../GameClasses/Knight";
import { GameObject } from "../../gameEngine/GameObject/GameObject";
import { Slash } from "../GameClasses/Slash";

export class Stage1 extends Stage {
    knight: Knight;
    slashes: Slash[] = [];
    enemies: GameObject[] = [];
    floor: Floor[] = [];
    score = 0;
    playerHitTimer = 60;
    constructor(game: Game) {
        super(game, "Stage 1");

        this.knight = new Knight({ game, x: 200, y: 5 });
        this.addObject(this.knight);

        const slash = new Slash({ game, x: 200, y: 5 });
        this.addObject(slash);
        this.slashes.push(slash);

        const blue = new BlueSlime({ game, x: 200, y: 5 });
        const green = new GreenSlime({ game, x: 200, y: 5 });
        this.addObject(blue);
        this.addObject(green);
        this.enemies.push(blue);
        this.enemies.push(green);

        const bg1 = new Background("forestBackground.png");
        this.addBackground(bg1);
        this.setBackground("forestBackground.png");
        this.game.addText({
            fontSize: "80px",
            id: "score",
            text: `${this.score}`,
            textPositionX: 50,
            textPositionY: 80,
        });
    }

    update(): void {
        super.update();
        this.game.clearText();
        this.game.addText({
            fontSize: "80px",
            id: "score",
            text: `${this.score}`,
            textPositionX: 50,
            textPositionY: 80,
        });
        this.playerHitTimer -= this.playerHitTimer > 0 ? 1: 0;
        let removeSlashes: Slash[] = [];
        if (this.game.inputs.includes(" ") && this.slashes.length < 1) {
            const slash = new Slash({ game: this.game, x: this.knight.x, y: this.knight.y });
            slash.flip = this.knight.flip;
            slash.x += slash.flip ? -60 : 60;
            slash.y -= 20;
            slash.time = 0;
            this.addObject(slash);
            this.slashes.push(slash);
        }

        for (let slash of this.slashes) {
            if (slash.time < 25) {
                slash.time++;
            }
            if (slash.time >= 25) {
                removeSlashes.push(slash);
            }

            for (let enemy of this.enemies) {
                if (enemy.checkCollision(slash)) {
                    this.enemies.splice(this.enemies.indexOf(enemy), 1);
                    this.removeObject(enemy);
                    this.score++;
                }
            }
        }

        for (let enemy of this.enemies) {
            enemy.x += enemy.x < this.knight.x ? 1 : -1;
            enemy.y += enemy.y < this.knight.y ? 1 : -1;

            if (enemy.checkCollision(this.knight) && this.playerHitTimer == 0) {
                this.playerHitTimer = 60;
                this.score -= 1;
                break;
            }
        }

        for (let obj of removeSlashes) {
            this.removeObject(obj);
            this.slashes.splice(this.slashes.indexOf(obj), 1);
        }

        if (this.enemies.length < 5) {
            const enemy: GameObject =
                Math.floor(Math.random() * 2) == 0
                    ? new GreenSlime({
                          game: this.game,
                          x: Math.floor(Math.random() * 1000),
                          y: Math.floor(Math.random() * 500),
                      })
                    : new BlueSlime({
                          game: this.game,
                          x: Math.floor(Math.random() * 1000),
                          y: Math.floor(Math.random() * 500),
                      });
            this.addObject(enemy);
            this.enemies.push(enemy);
        }
    }

    init() {
        // let wolf = this.getGlobalObject("wolf")
        // if (wolf) this.wolf = wolf as Wolf
    }
}
