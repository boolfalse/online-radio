
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socketPort = import.meta.env.VITE_SOCKET_PORT;
const socket = io(`http://localhost:${socketPort}`, {
    transports: ['websocket'],
});

function Info({
                  currentTrackInfo,
                  setCurrentTrackInfo,
                  setIsTrackChanged
}) {
    const [listenersCount, setListenersCount] = useState(0);

    // TODO: use utils
    const timeFormat = (duration: number) => {
        const minutes = Math.floor(duration/60);
        const seconds = duration%60;
        const formattedSeconds = (seconds < 10) ? `0${seconds}` : seconds;
        const formattedMinutes = (minutes < 10) ? `0${minutes}` : minutes;

        return `${formattedMinutes}:${formattedSeconds}`;
    }

    useEffect(() => {
        socket.on('listeners_count', (count) => {
            setListenersCount(count);
        });
        socket.on('track_changed', (data) => {
            setCurrentTrackInfo(data);
            setIsTrackChanged(true);
        });
    }, []);

    return (
        <div id="info_container">
            <p>📻 Listeners: <strong>{listenersCount}</strong></p>
            <h2>Online Radio by <a href='https://boolfalse.com/'>@BoolFalse</a></h2>
            <p>This is a simple online radio station. It plays random songs from a defined playlist, which can be updated.</p>
            <p>You can find the source code of this project at GitHub: ⭐ <a href='https://github.com/boolfalse/online-radio'>boolfalse/online-radio</a></p>
        </div>
    );
}

export default Info;
