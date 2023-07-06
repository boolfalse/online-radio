
export default interface PlayerInterface {
    defaultTrackInfo: {
        title: string;
        image: string;
        duration: number;
        time: string;
        difference_in_seconds: number;
    };
    isPlaying: boolean;
    setIsPlaying: Function;
    currentTrackInfo: {
        title: string;
        image: string;
        duration: number;
        time: string;
        difference_in_seconds: number;
    };
    setCurrentTrackInfo: Function;
    isTrackChanged: boolean;
    setIsTrackChanged: Function;
}
