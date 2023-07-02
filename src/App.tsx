
import PlayerComponent from "./conponents/PlayerComponent.tsx";
import Visualizer from "./conponents/Visualizer.tsx";
import {useState} from "react";

function App() {
    const [isTrackInfoReceived, setIsTrackInfoReceived] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <>
            <Visualizer isPlaying={isPlaying}
                        isTrackInfoReceived={isTrackInfoReceived}
            />
            <PlayerComponent isPlaying={isPlaying}
                             setIsPlaying={setIsPlaying}
                             setIsTrackInfoReceived={setIsTrackInfoReceived}
            />
        </>
    )
}

export default App
