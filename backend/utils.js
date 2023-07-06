
const axios = require("axios");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");

module.exports = {
    downloadFileFromGoogleDrive: async (fileUrl, destinationFile) => {
        try {
            const response = await axios({
                url: fileUrl,
                method: 'GET',
                responseType: 'stream',
            });
            const writer = fs.createWriteStream(destinationFile);
            response.data.pipe(writer);

            return new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
        } catch (err) {
            console.log(err.message);
        }
    },
    getGistFileContent: async (gistId, fileName) => {
        try {
            const response = await axios.get(`https://api.github.com/gists/${gistId}`);
            const file = response.data.files[fileName];
            return file.content;
        } catch (err) {
            console.log(err.message);
        }
    },
    getTrackDuration: (trackPath) => {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(trackPath, (err, metadata) => {
                if (err) {
                    console.log(err.message);
                    reject(err);
                }
                const trackDuration = metadata.format.duration;
                const duration = trackDuration ? Math.floor(trackDuration) : 0;

                resolve(duration);
            });
        })
    }
};
