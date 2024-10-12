import { Game } from "../../gameEngine/Game";
import { Button } from "../../gameEngine/GameButton/Button";
import { Floor } from "../GameClasses/Floor/Floor";
import { Wolf } from "../GameClasses/Wolf";
import { GameObject } from "../../gameEngine/GameObject/GameObject";
import { Background } from "../../gameEngine/GameStages/Background";
import { Stage } from "../../gameEngine/GameStages/Stage";
import { FireBall } from "../GameClasses/FireBall";

export class Stage1 extends Stage {
    wolf: Wolf;
    floor: Floor[] = [];
    constructor(game: Game) {
        super(game, "Stage 1");
        // for (let i = 0; i < 1; i++) {
        //     this.wolf = new Wolf({ game: game, x: 3, y: 3 });
        //     this.addObject(this.wolf);
        // }

        let fire = new FireBall({ game, x: 5, y: 5})
        this.addObject(fire)
        let button = new Button(
            game,
            { fontSize: "20px", textPositionX: 138, textPositionY: 130, text: "Click" },
            "ButtonTest.png",
            { x: 100, y: 100 },
            () => {
                console.log("AAAAAAAAAAAAAAA");
            }
        );
        button.fixedPosition = true;
        button.text.fontStyle = new FontFace(
            "Grey Qo",
            "url('https://fonts.gstatic.com/s/greyqo/v9/BXRrvF_Nmv_TyXxNPONa9Ff0.woff2')"
        );
        // button.text.textOutlineColor = "aqua"
        // button.text.textOutlineWidth = 1

        // this.addButton(button)

        // this.game.addText({
        //     fontSize: "100px",
        //     fontStyle: new FontFace(
        //         "Grey Qo",
        //         "url('https://fonts.gstatic.com/s/greyqo/v9/BXRrvF_Nmv_TyXxNPONa9Ff0.woff2')"
        //     ),
        //     textPositionX: 138,
        //     textPositionY: 130,
        //     text: "Wheares",
        //     id: "efwe",
        // });

        // for (let i = 0; i < 10; i++) {
        //     let newFloor = new Floor({
        //         game: game,
        //         x: 400 + i * 30 + Math.random() * 400 - 200,
        //         y: 200 + Math.random() * 2000,
        //     });
        //     this.floor.push(newFloor);
        //     this.add(newFloor);
        // }
        for (let i = 0; i < 10; i++) {
            let newFloor = new Floor({
                game: game,
                x: 400 + Math.round(Math.random() * 700),
                y: Math.round(Math.random() * 300) + 200,
            });
            this.floor.push(newFloor);
            this.addObject(newFloor);
        }
        const bg1 = new Background("Forest_background_3.png");
        const bg2 = new Background("Forest_background_4.png");
        this.addBackground(bg1);
        this.addBackground(bg2);
        this.setBackground("Forest_background_3.png");
    }

    update(): void {
        super.update();
        let removeThese: Floor[] = [];
        // this.game.addText({
        //     fontSize: "100px",
        //     fontStyle: new FontFace(
        //         "Sankofa Display",
        //         "url('https://fonts.gstatic.com/s/sankofadisplay/v2/Ktk1ALSRd4LucUDghJ2rTqXOoh3HEKOY.woff2')"
        //     ),
        //     textPositionX: 138,
        //     textPositionY: 130,
        //     text: "ABCDEF",
        //     id: "efwe",
        // });
        if (this.game.inputs.includes(" ")) {
            let a = 400 + Math.round(Math.random() * 700);
            let b = Math.round(Math.random() * 300) + 200;

            let newFloor = new Floor({
                game: this.game,
                x: a,
                y: b,
            });
            this.floor.push(newFloor);
            this.addObject(newFloor);
        }

        this.floor.forEach((f) => {
            if (this.wolf.checkCollision(f)) {
                removeThese.push(f);
                this.game.changeStage("Stage 2")
            }
        });
        for (let floor of removeThese) {
            this.floor.splice(this.floor.indexOf(floor), 1);
            this.removeObject(floor);
        }
    }

    init() {
        let wolf = this.getGlobalObject("wolf")
        if (wolf) this.wolf = wolf as Wolf
    }
}
