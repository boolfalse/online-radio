
import Player from "./components/Player.tsx";
import Visualizer from "./components/Visualizer.tsx";
import {useState} from "react";
import Info from "./components/Info.tsx";

function App() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isTrackChanged, setIsTrackChanged] = useState(false);
    const defaultTrackInfo = {
        title: 'Artist - Title',
        image: '/default.png',
        duration: 0,
        time: '0:00',
    };
    const [currentTrackInfo, setCurrentTrackInfo] = useState(defaultTrackInfo);

    return (
        <>
            <Visualizer isPlaying={isPlaying}
                        isTrackInfoReceived={currentTrackInfo.duration !== defaultTrackInfo.duration}
            />
            <Player defaultTrackInfo={defaultTrackInfo}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    currentTrackInfo={currentTrackInfo}
                    setCurrentTrackInfo={setCurrentTrackInfo}
                    isTrackChanged={isTrackChanged}
                    setIsTrackChanged={setIsTrackChanged}
            />
            <Info setCurrentTrackInfo={setCurrentTrackInfo}
                  setIsTrackChanged={setIsTrackChanged}
            />
        </>
    )
}

export default App
