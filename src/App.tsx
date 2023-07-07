
import Player from "./components/Player.tsx";
import Visualizer from "./components/Visualizer.tsx";
import React from "react";
import Info from "./components/Info.tsx";

function App() {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [isTrackChanged, setIsTrackChanged] = React.useState(false);
    const defaultTrackInfo = {
        title: 'Artist - Title',
        image: '/default.png',
        duration: 0,
        time: '0:00',
        difference_in_seconds: 0,
    };
    const [currentTrackInfo, setCurrentTrackInfo] = React.useState(defaultTrackInfo);

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
