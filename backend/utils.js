
const axios = require("axios");
const fs = require("fs");

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
};
