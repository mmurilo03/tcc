import "./App.css";
import { game } from "../gameEngine/main";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { HitboxMaker } from "../gameEngine/GameObject/HitboxMaker";
import { GameObject } from "../gameEngine/GameObject/GameObject";

const buildImage = async (obj: GameObject) => {
    await new HitboxMaker().initialize({
        context: game.context,
        imagePath: obj.imagePath,
        height: obj.height,
        width: obj.width,
        precision: obj.precision,
    });
    for (let otherObj of obj.otherObjects) {
        await buildImage(otherObj);
    }
};

const loadGame = async () => {
    for (let obj of game.globalObjects.stageObjects) {
        await buildImage(obj);
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

    useEffect(() => {
        if (!canvasRef.current) return;
        canvasRef.current.replaceChildren(gameState.canvas);

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.addEventListener("keyup", handleKeyUp);
        };
    });

    useEffect(() => {
        if (!called.current) {
            loadGame().then((res) => setLoading(res));
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
            <div className="outline">
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
