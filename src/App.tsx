import "./App.css";
import { game } from "../gameEngine/main";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { HitboxMaker } from "../gameEngine/GameObject/HitboxMaker";
import { GameObject } from "../gameEngine/GameObject/GameObject";

const hitboxMaker = new HitboxMaker({ context: game.context });

const buildImage = async (obj: GameObject) => {
    if (!hitboxMaker.checkIfSaved(obj.imagePath)) {
        await hitboxMaker.initialize({
            imagePath: obj.imagePath,
            height: obj.height,
            width: obj.width,
            precision: obj.precision,
        });
    }
    await obj.loadImage();

    for (let otherObj of obj.otherObjects) {
        if (!hitboxMaker.checkIfSaved(otherObj.imagePath)) {
            await buildImage(otherObj);
        }
    }
};

const loadGame = async () => {
    if (game.globalStage) {
        for (let obj of game.globalStage.stageObjects) {
            await buildImage(obj);
        }
    }

    for (let stage in game.stages) {
        let currentStage = game.stages[stage];
        for (let obj of currentStage.stageObjects) {
            await buildImage(obj);
        }
    }

    return false;
};

function App() {
    const canvasRef = useRef<HTMLDivElement>(null);
    const divRef = useRef<HTMLDivElement>(null);
    const { current: gameState } = useRef(game);

    const [loading, setLoading] = useState(true);
    const called = useRef(false);

    const handleKeyDown = (event: KeyboardEvent) => {
        event.preventDefault();
        gameState.addInput(event.key.toLowerCase());
    };

    const handleKeyUp = (event: KeyboardEvent) => {
        event.preventDefault();
        gameState.removeInput(event.key.toLowerCase());
    };

    const handleMouseMove = (event: MouseEvent) => {
        event.preventDefault();
        if (canvasRef.current) {
            const offset = canvasRef.current.getBoundingClientRect();

            gameState.updateMousePos(
                { width: offset.width, height: offset.height },
                { x: event.clientX - offset.left, y: event.clientY - offset.top }
            );
        }
    };

    const handleMouseDown = () => {
        gameState.mouseDown();
    };

    const handleMouseUp = () => {
        gameState.mouseUp();
    };

    const handleScreen = () => {
        if (divRef.current && canvasRef.current) {
            const windowWidth = Math.ceil(window.innerWidth * 0.95);
            const windowHeight = Math.ceil(window.innerHeight * 0.95);
            divRef.current.style.width = `${windowWidth}px`;
            divRef.current.style.height = `${windowHeight}px`;

            const canvasWidth = Number(gameState.canvas.width);
            const canvasHeight = Number(gameState.canvas.height);

            const widthProportion = windowWidth / canvasWidth;
            const heightProportion = windowHeight / canvasHeight;

            const finalProportion = widthProportion < heightProportion ? widthProportion : heightProportion;

            const finalWidth = Math.ceil(canvasWidth * finalProportion);
            const finalHeight = Math.ceil(canvasHeight * finalProportion);
            gameState.canvas.style.width = `${finalWidth}px`;
            gameState.canvas.style.height = `${finalHeight}px`;
        }
    };

    useEffect(() => {
        if (!canvasRef.current) return;
        canvasRef.current.replaceChildren(gameState.canvas);
        handleScreen();

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);
        window.addEventListener("resize", handleScreen);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
            window.removeEventListener("resize", handleScreen);
        };
    });

    useEffect(() => {
        if (!called.current) {
            loadGame().then((res) => {
                setLoading(res);
                game.start();
            });
            called.current = true;
        }
    }, []);

    if (loading) {
        return (
            <>
                <div className="outline">
                    <h1>Loading</h1>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="outline" ref={divRef}>
                <div
                    className="canvas"
                    ref={canvasRef}
                    onMouseMove={handleMouseMove}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                ></div>
            </div>
        </>
    );
}

export default App;
