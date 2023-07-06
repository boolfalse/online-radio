
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

            const totalSize = response.headers['content-length'];
            let downloadedSize = 0;
            let previousProgress = 0;

            const writer = fs.createWriteStream(destinationFile);
            response.data.pipe(writer);

            response.data.on('data', (chunk) => {
                downloadedSize += chunk.length;
                const progress = Math.round((downloadedSize / totalSize) * 100);
                if (progress !== previousProgress) {
                    previousProgress = progress;
                    process.stdout.write(`\rDownloading file: ${progress}%; `);
                }
            });

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
            return null;
        }
    },
    getTrackDuration: (trackPath) => {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(trackPath, (err, metadata) => {
                if (err) {
                    console.log(err.message || 'Error while getting track duration!');
                    reject(err);
                }
                const trackDuration = metadata.format.duration;
                const duration = trackDuration ? Math.floor(trackDuration) : 0;

                resolve(duration);
            });
        })
    },
    exitHandler: (message = '') => {
        console.log(message);
        process.exit(1);
    },
};
