
import { useState, useEffect, useRef } from 'react';

function Visualizer({ isPlaying, isTrackInfoReceived }) {
    const streamUrl = `http://localhost:${import.meta.env.VITE_BACKEND_PORT}/stream`;
    const [audioElement, setAudioElement] = useState(null);
    const [analyser, setAnalyser] = useState(null);
    const [dataArray, setDataArray] = useState([]);
    const [isAudioPlaying, setIsAudioPlaying] = useState(isPlaying);
    const visualizerRef = useRef(null);
    const audioContextRef = useRef(null);

    useEffect(() => {
        if (isTrackInfoReceived) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            const analyserNode = audioContextRef.current.createAnalyser();
            analyserNode.fftSize = 128;
            const bufferLength = analyserNode.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            analyserNode.connect(audioContextRef.current.destination);
            setAnalyser(analyserNode);
            setDataArray(dataArray);

            return () => {
                analyserNode.disconnect();
            };
        }
    }, [isTrackInfoReceived]);

    useEffect(() => {
        if (audioElement && analyser) {
            const sourceNode = audioContextRef.current.createMediaElementSource(audioElement);
            sourceNode.connect(analyser);
        }
    }, [audioElement, analyser]);

    useEffect(() => {
        if (analyser) {
            // FROM TOP TO BOTTOM
            const renderVisualization = () => {
                if (visualizerRef.current) {
                    const canvas = visualizerRef.current;
                    const canvasContext = canvas.getContext('2d');
                    const { width, height } = canvas;

                    analyser.getByteFrequencyData(dataArray);

                    canvasContext.clearRect(0, 0, width, height);

                    const barWidth = width / dataArray.length;
                    const barHeightMultiplier = height / 255;
                    canvasContext.globalAlpha = 0.5;
                    for (let i = 0; i < dataArray.length; i++) {
                        const barHeight = dataArray[i] * barHeightMultiplier;
                        const x = i * barWidth;
                        const y = 0;
                        canvasContext.fillStyle = `hsl(${i * 2}, 100%, 50%)`;
                        canvasContext.fillRect(x, y, barWidth, barHeight);
                    }

                    requestAnimationFrame(renderVisualization);
                }
            };

            renderVisualization();
        }
    }, [analyser, dataArray]);

    useEffect(() => {
        handleTogglePlay();
    }, [isPlaying]);

    const handleTogglePlay = () => {
        if (audioElement && audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }

        if (audioElement) {
            if (isAudioPlaying) {
                audioElement.pause();
            } else {
                audioElement.play();
            }
            setIsAudioPlaying(!isAudioPlaying);
        }
    };

    return (
        <div>
            <div id="visualizer-container">
                <canvas id="visualizer" ref={visualizerRef} style={{position: "fixed", zIndex: 1}} />
            </div>
            <audio crossOrigin='anonymous' ref={setAudioElement} controls style={{ display: 'none' }}>
                {isTrackInfoReceived && <source src={streamUrl} type='audio/mpeg' />}
            </audio>
        </div>
    );
};

export default Visualizer;
