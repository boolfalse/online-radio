
import {useEffect, useState} from "react";
import { Line } from 'rc-progress';
import axios from "axios";

function Player({
                    defaultTrackInfo,
                    isPlaying,
                    setIsPlaying,
                    currentTrackInfo,
                    setCurrentTrackInfo,
                    isTrackChanged,
                    setIsTrackChanged,
}) {
    const progressIntervalSeconds = 1;
    const [startTiming, setStartTiming] = useState(defaultTrackInfo.time); // start timing (for example, '1:04')
    const [trackTiming, setTrackTiming] = useState(defaultTrackInfo.time); // the current timing (for example, '1:12')
    const [trackDuration, setTrackDuration] = useState(defaultTrackInfo.time); // formatted duration (for example, '3:45')

    const [progressPercent, setProgressPercent] = useState(0);
    const [btnPlayDisplay, setBtnPlayDisplay] = useState(true);

    const startProgress = () => {
        if (currentTrackInfo.duration === 0) {
            return;
        }

        // here the progressPercent already calculated and set in getTrackInfo()
        // here currentTrackInfo.duration already set in getTrackInfo()

        const intervalId = setInterval(() => {
            setProgressPercent((prevProgressPercent) => {
                const newProgressPercent = Math.floor((prevProgressPercent + progressIntervalSeconds / currentTrackInfo.duration * 100) * 100) / 100;
                if (newProgressPercent >= 100) {
                    clearInterval(intervalId);
                    // console.log('Progress finished!');
                    return 0;
                }
                return newProgressPercent;
            });
        }, progressIntervalSeconds * 1000);
    }

    const handlePlay = () => {
        setIsPlaying(true);
        setBtnPlayDisplay(false);
    }
    const handlePause = () => {
        setIsPlaying(false);
        setBtnPlayDisplay(true);
    }

    // TODO: use utils
    const timeFormat = (duration: number) => {
        const minutes = Math.floor(duration/60);
        const seconds = duration%60;
        const formattedSeconds = (seconds < 10) ? `0${seconds}` : seconds;
        const formattedMinutes = (minutes < 10) ? `0${minutes}` : minutes;

        return `${formattedMinutes}:${formattedSeconds}`;
    }

    // TODO: use hooks
    const getTrackInfo = async () => {
        try {
            const response = await axios.get('/api/track-info');
            const { message, track } = response.data;

            return {
                success: true,
                message: message,
                ...track, // title, image, duration, difference_in_seconds
            };
        } catch (err) {
            return {
                success: false,
                message: err.message,
            }
        }
    }
    useEffect(() => {
        if (isTrackChanged) {
            // TODO: avoid from duplications
            getTrackInfo().then((trackInfo) => {
                if (trackInfo.success) {
                    setTrackDuration(timeFormat(trackInfo.duration));
                    setStartTiming(timeFormat(trackInfo.difference_in_seconds));
                    setTrackTiming(timeFormat(trackInfo.difference_in_seconds));

                    const percent = Math.floor(trackInfo.difference_in_seconds / trackInfo.duration * 100);
                    setProgressPercent(percent);

                    setCurrentTrackInfo(trackInfo);
                    startProgress();
                }
            }).catch((err) => {
                console.error(err.message);
            });

            setIsTrackChanged(false);
        }
    }, [isTrackChanged]);

    useEffect(() => {
        getTrackInfo().then((trackInfo) => {
            if (trackInfo.success) {
                setTrackDuration(timeFormat(trackInfo.duration));
                setStartTiming(timeFormat(trackInfo.difference_in_seconds));
                setTrackTiming(timeFormat(trackInfo.difference_in_seconds));

                const percent = Math.floor(trackInfo.difference_in_seconds / trackInfo.duration * 100);
                setProgressPercent(percent);

                setCurrentTrackInfo(trackInfo);
                startProgress();
            }
        }).catch((err) => {
            console.error(err.message);
        });
    }, []);

    useEffect(() => {
        setTrackTiming(startTiming === defaultTrackInfo.time ? defaultTrackInfo.time : startTiming);
    }, [startTiming]);
    useEffect(() => {
        if (currentTrackInfo.time !== defaultTrackInfo.time) { // TODO: || check that track just changed
            const interval = setInterval(() => {
                const [currentMin, currentSec] = trackTiming.split(':').map(Number);
                const [durationMin, durationSec] = trackDuration.split(':').map(Number);
                if (currentMin === durationMin && currentSec === durationSec) {
                    clearInterval(interval);
                    // console.log('Track ended!');
                } else {
                    let newSec = currentSec + 1;
                    let newMin = currentMin;
                    if (newSec >= 60) {
                        newSec = 0;
                        newMin += 1;
                    }
                    // TODO: use utils (timeFormat)
                    const formattedSec = (newSec < 10) ? `0${newSec}` : newSec;
                    const formattedMin = (newMin < 10) ? `0${newMin}` : newMin;
                    setTrackTiming(`${formattedMin}:${formattedSec}`);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [trackTiming, trackDuration]); // TODO: , check that track just changed

    return <>
        <div id="bg_image"></div>
        <div id="bg_shadow"></div>
        <main>
            <div id="track_image" style={{background: `url(${currentTrackInfo.image}) no-repeat center center / cover`}}></div>
            <div id="track_container">
                <div id="track" style={{display: (isPlaying ? 'block' : 'none')}}>
                    <div id="progress">
                        <Line percent={progressPercent} strokeWidth={2} strokeColor="#D3D3D3" />
                    </div>
                    <div id="title">
                        <div id="track_title">{currentTrackInfo.title}</div>
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
                       style={{display: btnPlayDisplay ? 'block' : 'none'}}
                       className="material-icons icon">&#xE037;</i>
                    <i id="btn_pause"
                       onClick={handlePause}
                       style={{display: btnPlayDisplay ? 'none' : 'block'}}
                       className="material-icons icon">&#xE034;</i>
                </div>
            </div>
        </main>
    </>
}

export default Player;
