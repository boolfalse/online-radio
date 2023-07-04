
// modules
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const http = require('http');
const ffmpeg = require("fluent-ffmpeg");
const express = require('express');
const openRadio = require('openradio');
const cors = require('cors');
const SocketIO = require('socket.io');
const { downloadFileFromGoogleDrive, getGistFileContent } = require('./utils');



// configs
const app = express();
const radio = openRadio();
app.use(cors());
app.use("/", express.static(path.join(__dirname, "public")));



// constants
const playlistFile = process.env.RADIO_PLAYLIST_FILE || 'tracks';
const backendPort = process.env.VITE_BACKEND_PORT || 5000;
const socketPort = process.env.SOCKET_PORT || 3000;
const serverPort = process.env.VITE_SERVER_PORT || 5001;
const trackPath = path.join(__dirname, '..', 'public', 'radio.mp3');



// socket related
const socketServer = http.createServer(app);
const io = SocketIO(socketServer, {
    // cors: {
    //     origin: [
    //         `http://localhost:${serverPort}`,
    //         // `http://localhost:${backendPort}`,
    //     ],
    // }
});
let trackInfo = {
    title: '',
    image: '',
    duration: 0,
    started_at: 0,
};
let listenersCount = 0;
const manualDelayTrackChangedEventSeconds = 0;



// routes
app.get("/", (req, res) => {
    res.json({
        message: "Root URL-endpoint.",
    });
});
app.get("/api", (req, res) => {
    res.json({
        message: "API URL-endpoint.",
    });
});
app.get("/api/track-info", (req, res) => {
    const differenceInSeconds = Math.floor(Date.now() / 1000) - trackInfo.started_at;

    return res.status(200).json({
        message: "Track info retrieved successfully.",
        track: {
            ...trackInfo,
            difference_in_seconds: differenceInSeconds,
        },
    });
});
app.get('/stream', (req, res) => {
    res.setHeader("Content-Type", "audio/mp3");
    radio.pipe(res);
});
app.get("/*", (_req, res) => {
    res.json({
        message: "API URL-endpoint not found!",
    });
});

// Handling errors for any other cases from whole application
app.use((err, req, res) => {
    return res.status(500).json({ error: "Something went wrong!" });
});



// create a server
http.createServer((req, res) => {
    res.setHeader("Content-Type", "audio/mp3");
    radio.pipe(res);
});



// listen on port
socketServer.listen(socketPort, () => {
    console.log(`Socket server running at: \x1b[36mhttp://localhost:\x1b[1m${socketPort}/\x1b[0m`);
});



// socket.io
io.on('connection', (socket) => {
    listenersCount++;
    io.emit('listeners_count', listenersCount);
    socket.on('disconnect', () => {
        listenersCount--;
        io.emit('listeners_count', listenersCount);
    });
    if (trackInfo.duration > 0) {
        setTimeout(() => {
            // console.log(`Playing track: ${trackInfo.title}`);
            socket.emit('track_changed', trackInfo);
        }, manualDelayTrackChangedEventSeconds * 1000);
    }
});

app.listen(backendPort, () => {
    console.log(`Backend running at: \x1b[36mhttp://localhost:\x1b[1m${backendPort}/\x1b[0m`);
});


// play track function
const playTrack = () => {
    // check if old track exists, delete it
    if (fs.existsSync(trackPath)) {
        fs.unlinkSync(trackPath);
    }
    // get playlist from gist
    getGistFileContent(process.env.RADIO_GIST_ID, `${playlistFile}.json`)
        .then((data) => {
            const playlist = JSON.parse(data);
            const randomNumber = Math.floor(Math.random() * playlist.length);
            // download random track from the source
            downloadFileFromGoogleDrive(playlist[randomNumber].file, trackPath)
                .then(() => {
                    ffmpeg.ffprobe(trackPath, (err, metadata) => {
                        if (err) {
                            console.log(err.message);
                            return;
                        }
                        const trackDuration = metadata.format.duration;
                        const duration = trackDuration ? Math.floor(trackDuration) : 0;
                        if (duration === 0) {
                            console.log('Track duration is 0, skipping...');
                            playTrack();
                            return;
                        }

                        radio.play(fs.createReadStream(trackPath));

                        trackInfo.title = playlist[randomNumber].title;
                        trackInfo.image = playlist[randomNumber].image || '/track-image.jpg';
                        trackInfo.duration = duration; // playlist[randomNumber].duration;
                        trackInfo.started_at = Math.floor(Date.now() / 1000);

                        setTimeout(() => {
                            console.log(`Playing track: ${trackInfo.title}`);
                            io.sockets.emit('track_changed', trackInfo);
                        }, manualDelayTrackChangedEventSeconds * 1000);
                    });
                })
                .catch((err) => {
                    console.log(err.message);
                });
        })
        .catch((err) => {
            console.log(err.message);
        });
}

// play track on start
playTrack();
// play next track when current track ends
radio.on('finish', () => {
    playTrack();
});
