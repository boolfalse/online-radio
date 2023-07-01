
const express = require("express");
const path = require("path");

const assetsRouter = require("./assets-router");
const port = process.env.NODE_PORT || 5000;
const app = express();

app.use("/", express.static(path.join(__dirname, "public")));
app.use("/src", assetsRouter);

app.get("/", (req, res) => {
    res.json({
        message: "Root URL-endpoint.",
    });
});
app.get("/api", (req, res) => {
    res.json({
        message: "API URL-endpoint.",
    });
});
app.get("/*", (_req, res) => {
    res.json({
        message: "API URL-endpoint not found!",
    });
});

app.listen(port, () => {
    console.log(`App running on port ${port}...`);
    console.log(`Local: \x1b[36mhttp://localhost:\x1b[1m${port}/\x1b[0m`);
});
