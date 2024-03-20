import "./App.css";
import { game } from "../gameEngine/main";
import { useEffect, useRef } from "react";

function App() {
    const canvasRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = (event: KeyboardEvent) => {
        event.preventDefault();
        game.addInput(event.key);
    };
    const handleKeyUp = (event: KeyboardEvent) => {
        event.preventDefault();
        game.removeInput(event.key);
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
        </>
    );
}

export default App;
