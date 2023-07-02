
const express = require("express");
const router = express.Router();

const serverPort = process.env.VITE_SERVER_PORT;
const imageRegex = /\/.+\.(svg|jpe?g|png)$/;
const videoRegex = /\/.+\.(mp4|ogv)$/

router.get(imageRegex, (req, res) => {
    const filePath = req.path;
    res.redirect(303, `http://localhost:${serverPort}/src${filePath}`);
});
router.get(videoRegex, (req, res) => {
    const filePath = req.path;
    res.redirect(303, `http://localhost:${serverPort}/src${filePath}`);
});

module.exports = router;
