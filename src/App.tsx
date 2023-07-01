
import PlayerComponent from "./conponents/PlayerComponent.tsx";
import Visualizer from "./conponents/Visualizer.tsx";
import {useState} from "react";

function App() {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <>
            <Visualizer isPlaying={isPlaying} />
            <PlayerComponent isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
        </>
    )
}

export default App
