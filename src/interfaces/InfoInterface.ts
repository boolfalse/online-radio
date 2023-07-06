
import trackInfoType from "../types/trackInfoType";

export default interface InfoInterface {
    setCurrentTrackInfo: (trackInfo: trackInfoType) => void;
    setIsTrackChanged: (isTrackChanged: boolean) => void;
}
