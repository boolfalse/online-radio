
import {useEffect, useState} from "react";
import { Line } from 'rc-progress';
import axios from "axios";

function Player({ isPlaying, setIsPlaying, setIsTrackInfoReceived }) {
    const defaultTrackTime = '0:00';
    const progressIntervalMs = 1000;
    const [trackImage, setTrackImage] = useState('/track-image.jpg');
    const [trackTitle, setTrackTitle] = useState('Artist - Title');
    const [trackDuration, setTrackDuration] = useState(defaultTrackTime);
    const [trackTiming, setTrackTiming] = useState(defaultTrackTime);
    const [startTiming, setStartTiming] = useState(defaultTrackTime);

    const [isAudioPlaying, setIsAudioPlaying] = useState(isPlaying);
    const [btnRestartDisplay, setBtnRestartDisplay] = useState('none');
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
            }
            return newProgress;
        });
    };

    const restartProgressBar = (seconds: number) => () => {
        const intervalId = setInterval(() => startInterval(seconds, intervalId), progressIntervalMs);

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }

    const handlePlay = () => {
        setIsAudioPlaying(true);
        setBtnPlayDisplay('none');
        setBtnPauseDisplay('block');

        restartProgressBar(10)();
    }
    const handlePause = () => {
        setIsAudioPlaying(false);
        setBtnPlayDisplay('block');
        setBtnPauseDisplay('none');
    }
    const handleRestart = () => {
        setProgressPercent(0);
        setBtnRestartDisplay('none');
        setBtnPlayDisplay('none');
        setBtnPauseDisplay('block');
        setIsAudioPlaying(true);

        restartProgressBar(10)();
    }

    const timeFormat = (duration: number) => {
        const minutes = Math.floor(duration/60);
        const seconds = duration%60;
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        return `${formattedMinutes}:${formattedSeconds}`;
    }

    const getTrackInfo = async () => {
        try {
            const response = await axios.get('/api/track-info');
            const { message, track } = response.data;
            const formattedDuration = timeFormat(track.duration);
            const formattedTiming = timeFormat(track.current_timing);

            return {
                success: true,
                message: message,
                duration: formattedDuration,
                timing: formattedTiming,
                title: track.title,
                image: track.image,
            };
        } catch (err) {
            console.error(err.message);
            return {
                success: false,
            }
        }
    }

    useEffect(() => {
        const seconds = 10;
        const intervalId = setInterval(() => startInterval(seconds, intervalId), progressIntervalMs);

        getTrackInfo().then((trackInfo) => {
            if (trackInfo.success) {
                setIsTrackInfoReceived(true);
                setTrackImage(trackInfo.image);
                setTrackTitle(trackInfo.title);
                setTrackDuration(trackInfo.duration);
                setTrackTiming(trackInfo.timing);
                setStartTiming(trackInfo.timing);
            }
        }).catch((err) => {
            console.error(err.message);
        });

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        setIsPlaying(isAudioPlaying);
    }, [isAudioPlaying]);

    useEffect(() => {
        setTrackTiming(startTiming === defaultTrackTime ? '0:00' : startTiming);
    }, [startTiming]);
    useEffect(() => {
        if (trackDuration !== defaultTrackTime) { // && trackTiming !== defaultTrackTime
            const interval = setInterval(() => {
                const [currentMin, currentSec] = trackTiming.split(':').map(Number);
                const [durationMin, durationSec] = trackDuration.split(':').map(Number);
                if (currentMin === durationMin && currentSec === durationSec) {
                    clearInterval(interval);
                    console.log('Track ended!');
                } else {
                    let newSec = currentSec + 1;
                    let newMin = currentMin;
                    if (newSec >= 60) {
                        newSec = 0;
                        newMin += 1;
                    }
                    const formattedSec = String(newSec).padStart(2, '0');
                    const formattedMin = String(newMin).padStart(2, '0');
                    setTrackTiming(`${formattedMin}:${formattedSec}`);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [trackTiming, trackDuration]);

    return <>
        <div id="bg_image"></div>
        <div id="bg_shadow"></div>
        <main>
            <div id="track_image" style={{background: `url(${trackImage}) no-repeat center center / cover`}}></div>
            <div id="track_container">
                <div id="track" style={{display: (isAudioPlaying ? 'block' : 'none')}}>
                    <div id="progress">
                        <Line percent={progressPercent} strokeWidth={2} strokeColor="#D3D3D3" />
                    </div>
                    <div id="title">
                        <div id="track_title">{trackTitle}</div>
                    </div>
                    <div id="duration_timing">
                        <span id="track_duration">{trackDuration}</span> / <span id="track_timing">{trackTiming}</span>
                    </div>
                </div>
            </div>
            <div id="controls_container">
                <div className="control" id="btn_controls">
                    <i id="btn_play"
                       onClick={handlePlay}
                       style={{display: btnPlayDisplay}}
                       className="material-icons icon">&#xE037;</i>
                    <i id="btn_pause"
                       onClick={handlePause}
                       style={{display: btnPauseDisplay}}
                       className="material-icons icon">&#xE034;</i>
                    <i id="btn_restart"
                       onClick={handleRestart}
                       style={{display: btnRestartDisplay}}
                       className="material-icons icon ss-rotate-90 ss-ml-10">↻</i>
                </div>
            </div>
        </main>
    </>
}

export default Player;
