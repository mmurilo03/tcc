import "./App.css";
import { game } from "../gameEngine/main";
import { useEffect, useRef } from "react";

function App() {
    const canvasRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = (event: KeyboardEvent) => {
        event.preventDefault();
        game.addInput(event.key.toLowerCase());
    };
    const handleKeyUp = (event: KeyboardEvent) => {
        event.preventDefault();
        game.removeInput(event.key.toLowerCase());
    };

    const changeStage = () => {
        const currentStage = game.activeStage?.name;
        if (currentStage) {
            const stages = Object.keys(game.stages);
            const position = stages.indexOf(currentStage);
            if (position + 1 >= stages.length) {
                game.changeStage(stages[0]);
            } else {
                game.changeStage(stages[position + 1]);
            }
        }
    };

    useEffect(() => {
        if (!canvasRef.current) return;
        canvasRef.current.replaceChildren(game.canvas);

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.addEventListener("keyup", handleKeyUp);
        };
    });

    return (
        <>
            <div className="canvas" ref={canvasRef}></div>
            <button onClick={changeStage}>Change</button>
        </>
    );
}

export default App;
