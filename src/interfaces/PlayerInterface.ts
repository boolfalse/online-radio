
import trackInfoType from "../types/trackInfoType";

export default interface PlayerInterface {
    defaultTrackInfo: trackInfoType;
    isPlaying: boolean;
    setIsPlaying: (isPlaying: boolean) => void;
    currentTrackInfo: trackInfoType;
    setCurrentTrackInfo: (trackInfo: trackInfoType) => void;
    isTrackChanged: boolean;
    setIsTrackChanged: (isTrackChanged: boolean) => void;
}
