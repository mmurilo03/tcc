import "./App.css";
import { game } from "../gameEngine/main";
import { useEffect, useRef } from "react";

function App() {
    const canvasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return
            canvasRef.current.replaceChildren(game.canvas)
        
    })

    return (
        <>
            <div className="canvas" ref={canvasRef}></div>
        </>
    );
}

export default App;
