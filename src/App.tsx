
import Player from "./components/Player.tsx";
import Visualizer from "./components/Visualizer.tsx";
import {useState} from "react";
import Info from "./components/Info.tsx";

function App() {
    const [isTrackInfoReceived, setIsTrackInfoReceived] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <>
            <Visualizer isPlaying={isPlaying}
                        isTrackInfoReceived={isTrackInfoReceived}
            />
            <Player isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    setIsTrackInfoReceived={setIsTrackInfoReceived}
            />
            <Info />
        </>
    )
}

export default App
