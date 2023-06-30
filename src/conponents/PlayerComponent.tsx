
import {useEffect, useState} from "react";
import { Line } from 'rc-progress';

function PlayerComponent() {
    const progressIntervalMs = 1000;
    const [trackImage, setTrackImage] = useState('/track-image.jpg');
    const [trackTitle, setTrackTitle] = useState('Artist - Title');

    const [trackContainerDisplay, setTrackContainerDisplay] = useState('none');
    const [btnRestartDisplay, setBtnRestartDisplay] = useState('none');
    const [showProgressBar, setShowProgressBar] = useState(false);
    const [progressPercent, setProgressPercent] = useState(0);
    const [btnPlayDisplay, setBtnPlayDisplay] = useState('block');
    const [btnPauseDisplay, setBtnPauseDisplay] = useState('none');

    const startInterval = (seconds, intervalId) => {
        setProgressPercent((prevProgress) => {
            const newProgress = prevProgress + Math.floor(100 / seconds);
            if (newProgress >= 100) {
                clearInterval(intervalId);
                setBtnRestartDisplay('block');
                setBtnPlayDisplay('none');
                setBtnPauseDisplay('none');
                setShowProgressBar(false);
            }
            return newProgress;
        });
    };

    const restartProgressBar = (seconds: number) => () => {
        const intervalId = setInterval(() => startInterval(seconds, intervalId), progressIntervalMs);

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }

    const toggle = () => {
        if (btnRestartDisplay === 'block') {
            setProgressPercent(0);
            setBtnRestartDisplay('none');
            setBtnPlayDisplay('none');
            setBtnPauseDisplay('block');
            setShowProgressBar(true);

            restartProgressBar(10)();
        } else {
            setTrackContainerDisplay(showProgressBar ? 'none' : 'block');
            setBtnPlayDisplay(showProgressBar ? 'block' : 'none');
            setBtnPauseDisplay(showProgressBar ? 'none' : 'block');
            setShowProgressBar(!showProgressBar);
        }
    }

    useEffect(() => {
        const seconds = 10;
        const intervalId = setInterval(() => startInterval(seconds, intervalId), progressIntervalMs);

        return () => clearInterval(intervalId);
    }, []);

    return <>
        <div id="bg_image" style={{background: `url(${trackImage}) 0/cover fixed`}}></div>
        <div id="bg_shadow"></div>
        <main>
            <div id="track_image" style={{backgroundImage: `url(${trackImage})`}}></div>
            <div id="track_container">
                <div id="track" style={{display: trackContainerDisplay}}>
                    <div id="progress">
                        <Line percent={progressPercent} strokeWidth={2} strokeColor="#D3D3D3" />
                    </div>
                    <div id="title">
                        <div id="track_title">{trackTitle}</div>
                    </div>
                </div>
            </div>
            <div id="controls">
                <div className="control" id="btn_controls" onClick={toggle}>
                    <i id="btn_play" style={{display: btnPlayDisplay}} className="material-icons icon">&#xE037;</i>
                    <i id="btn_pause" style={{display: btnPauseDisplay}} className="material-icons icon">&#xE034;</i>
                    <i id="btn_restart" style={{display: btnRestartDisplay}} className="material-icons icon ss-rotate-90 ss-ml-10">↻</i>
                </div>
            </div>
        </main>
    </>
}

export default PlayerComponent;
