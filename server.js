const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve website files
app.use(express.static(__dirname));

// Download MP3 file
app.get("/download", (req, res) => {
    const filePath = path.join(__dirname, "music", "sample-song.mp3");

    res.setHeader("Content-Disposition", 'attachment; filename="sample-song.mp3"');
    res.setHeader("Content-Type", "audio/mpeg");

    res.sendFile(filePath, (error) => {
        if (error) {
            console.error("Download error:", error);
        }
    });
});

// API for the downloader
app.get("/api/download", (req, res) => {
    const spotifyLink = req.query.link;

    if (!spotifyLink) {
        return res.status(400).json({
            success: false,
            message: "Please enter a Spotify song URL."
        });
    }

    if (!spotifyLink.includes("open.spotify.com/track/")) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid Spotify track URL."
        });
    }

    const song = {
        title: "Sample Song",
        author: "QSkill Demo Artist",
        duration: "03:06",
        thumbnail: "",
        medias: [
            {
                url: "/download"
            }
        ]
    };

    res.json({
        success: true,
        data: song
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});