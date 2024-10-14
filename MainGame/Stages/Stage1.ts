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
    slash: Slash;
    enemies: GameObject[] = [];
    floor: Floor[] = [];
    score = 0;
    playerHitTimer = 60;
    constructor(game: Game) {
        super(game, "Stage 1");

        this.knight = new Knight({ game, x: 200, y: 5 });
        this.addObject(this.knight);

        this.slash = new Slash({ game, x: 200, y: 5 });
        this.addObject(this.slash);

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
        this.slash.x = this.knight.x;
        this.slash.y = this.knight.y;
        this.slash.flip = this.knight.flip;
        this.playerHitTimer -= this.playerHitTimer > 0 ? 1: 0;
        if (this.game.inputs.includes(" ") && this.slash.time == 0) {
            this.slash.state = "slash";
            this.slash.time = 35;
        }

        if (this.slash.time > 0) {
            for (let enemy of this.enemies) {
                if (enemy.checkCollision(this.slash)) {
                    this.enemies.splice(this.enemies.indexOf(enemy), 1);
                    this.removeObject(enemy);
                    this.score++;
                }
            }
        }
        this.slash.time -= this.slash.time > 0 ? 1 : 0
        this.slash.state = this.slash.time == 0 ? "idle" : "slash"
        for (let enemy of this.enemies) {
            enemy.x += enemy.x < this.knight.x ? 1 : -1;
            enemy.y += enemy.y < this.knight.y ? 1 : -1;

            if (enemy.checkCollision(this.knight) && this.playerHitTimer == 0) {
                this.playerHitTimer = 60;
                this.score -= 1;
                break;
            }
        }

        if (this.enemies.length < 20) {
            const enemy: GameObject =
                Math.floor(Math.random() * 2) == 0
                    ? new GreenSlime({
                          game: this.game,
                          x: Math.floor(Math.random() * 2000) - 500,
                          y: Math.floor(Math.random() * 1000) - 250,
                      })
                    : new BlueSlime({
                          game: this.game,
                          x: Math.floor(Math.random() * 2000) - 500,
                          y: Math.floor(Math.random() * 1000) - 250,
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
