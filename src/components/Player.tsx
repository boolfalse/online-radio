
import React, {useEffect, useRef, useState} from "react";
import { Line } from 'rc-progress';
import PlayerInterface from './../interfaces/PlayerInterface.ts'
import {getErrorMessage, getTrackInfo, timeFormat} from "../utils.ts";

function Player({
                    defaultTrackInfo,
                    isPlaying,
                    setIsPlaying,
                    currentTrackInfo,
                    setCurrentTrackInfo,
                    isTrackChanged,
                    setIsTrackChanged,
}: PlayerInterface) {
    const [firstLoad, setFirstLoad] = useState(true);
    const progressIntervalSeconds = 1;
    const [startTiming, setStartTiming] = useState(defaultTrackInfo.time); // start timing (for example, '1:04')
    const [trackTiming, setTrackTiming] = useState(defaultTrackInfo.time); // the current timing (for example, '1:12')
    const [trackDuration, setTrackDuration] = useState(defaultTrackInfo.time); // formatted duration (for example, '3:45')

    const [progressPercent, setProgressPercent] = useState(0);
    const [btnPlayDisplay, setBtnPlayDisplay] = useState(true);

    const [cubeDegree, setCubeDegree] = useState(0);
    const cubeRef = useRef<HTMLDivElement | null>(null);

    const startProgress = () => {
        if (currentTrackInfo.duration === 0) {
            return;
        }
        // here the progressPercent already calculated and set
        // here currentTrackInfo.duration already set
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
    const rotateCube = (trackImage: string) => {
        const newCubeDegree = (cubeDegree - 90) % 360;
        const nextImage = cubeRef.current.querySelector(`.pos-${newCubeDegree * -1}`);
        nextImage.querySelector('img').src = trackImage; // currentTrackInfo.image
        setTimeout(() => {
            cubeRef.current.style.transform = `rotateY(${newCubeDegree}deg)`;
            setCubeDegree(newCubeDegree);
        }, 0.1 * 1000); // manual delay
    }

    const handlePlay = (play) => {
        setIsPlaying(play); setBtnPlayDisplay(!play);
    };
    const handleKeyDown = (e, play: boolean) => {
        if (e.keyCode === 32) {
            handlePlay(play);
        }
    }

    useEffect(() => {
        if (isTrackChanged) {
            getTrackInfo().then((trackInfo) => {
                if (trackInfo.success) {
                    setTrackDuration(timeFormat(trackInfo.duration));
                    setStartTiming(timeFormat(trackInfo.difference_in_seconds));
                    setTrackTiming(timeFormat(trackInfo.difference_in_seconds));

                    const percent = Math.floor(trackInfo.difference_in_seconds / trackInfo.duration * 100);
                    setProgressPercent(percent);

                    setCurrentTrackInfo(trackInfo);
                    startProgress();

                    if (firstLoad) {
                        const firstImage = cubeRef.current.querySelector(`.pos-0`);
                        firstImage.querySelector('img').src = trackInfo.image;
                    }

                    rotateCube(trackInfo.image);
                }
            }).catch((err) => {
                console.error(getErrorMessage(err));
            });

            if (firstLoad) {
                setFirstLoad(false);
            }
            setIsTrackChanged(false);
        }
    }, [isTrackChanged]);

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
            <div id="image_wrapper">
                <div className="container">
                    <div className="image-cube" ref={cubeRef}>
                        <div className="pos-0">
                            <img src={defaultTrackInfo.image} alt="Track"/>
                        </div>
                        <div className="pos-90">
                            <img src={defaultTrackInfo.image} alt="Track"/>
                        </div>
                        <div className="pos-180">
                            <img src={defaultTrackInfo.image} alt="Track"/>
                        </div>
                        <div className="pos-270">
                            <img src={defaultTrackInfo.image} alt="Track"/>
                        </div>
                    </div>
                </div>
            </div>
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
                       aria-hidden="true"
                       onClick={() => handlePlay(true)}
                       onKeyDown={(e) => handleKeyDown(e, true)}
                       style={{display: btnPlayDisplay ? 'block' : 'none'}}
                       className="material-icons icon">&#xE037;</i>
                    <i id="btn_pause"
                       aria-hidden="true"
                       onClick={() => handlePlay(false)}
                       onKeyDown={(e) => handleKeyDown(e, false)}
                       style={{display: btnPlayDisplay ? 'none' : 'block'}}
                       className="material-icons icon">&#xE034;</i>
                </div>
            </div>
        </main>
    </>
}

export default Player;
