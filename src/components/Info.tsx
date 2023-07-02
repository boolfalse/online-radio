
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socketPort = import.meta.env.VITE_SOCKET_PORT;
const socket = io(`http://localhost:${socketPort}`, {
    transports: ['websocket'],
});

function Info() {
    const [listenersCount, setListenersCount] = useState(0);
    const [trackNotification, setTrackNotification] = useState({
        title: 'Artist - Title',
        image: '/track-image.jpg',
        duration: 0,
    });

    useEffect(() => {
        socket.on('listeners_count', (count) => {
            setListenersCount(count);
        });
        socket.on('track_notification', (data) => {
            setTrackNotification(data);
        });
        // return () => { socket.disconnect(); };
    }, []);

    return (
        <div id="info_container">
            <p>Listeners: <strong>{listenersCount}</strong>, Track: <strong>{trackNotification.title}</strong>, Duration: <strong>{trackNotification.duration}</strong></p>
            <h2>Online Radio by 📻 <a href='https://boolfalse.com/'>@BoolFalse</a></h2>
            <p>This is a simple online radio station. It plays random songs from a defined playlist, which can be updated.</p>
            <p>You can find the source code of this project at GitHub: ⭐ <a href='https://github.com/boolfalse/online-radio'>boolfalse/online-radio</a></p>
        </div>
    );
}

export default Info;
