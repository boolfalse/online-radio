
import axios from "axios";



export const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) return error.message
    return String(error)
}

export const timeFormat = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    const formattedSeconds = (seconds < 10) ? `0${seconds}` : seconds;
    const formattedMinutes = (minutes < 10) ? `0${minutes}` : minutes;

    return `${formattedMinutes}:${formattedSeconds}`;
}

export const getTrackInfo = async () => {
    try {
        const response = await axios.get('/api/track-info');
        const { message, track } = response.data;

        return {
            success: true, message: message,
            ...track, // title, image, duration, difference_in_seconds
        };
    } catch (err) {
        return {
            success: false, message: getErrorMessage(err),
        }
    }
}
