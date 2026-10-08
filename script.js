const downloadBtn = document.getElementById("downloadBtn");
const spotifyLink = document.getElementById("spotifyLink");
const message = document.getElementById("message");
const result = document.getElementById("result");

const thumbnail = document.getElementById("thumbnail");
const songTitle = document.getElementById("songTitle");
const artist = document.getElementById("artist");
const duration = document.getElementById("duration");
const downloadLink = document.getElementById("downloadLink");

downloadBtn.addEventListener("click", async () => {

    const link = spotifyLink.value.trim();

    if (link === "") {
        message.textContent = "Please enter a Spotify song URL.";
        result.classList.add("hidden");
        return;
    }

    if (!link.includes("open.spotify.com/track/")) {
        message.textContent = "Please enter a valid Spotify track URL.";
        result.classList.add("hidden");
        return;
    }

    message.textContent = "Getting song information...";
    result.classList.add("hidden");

    try {

        const response = await fetch(
            `/api/download?link=${encodeURIComponent(link)}`
        );

        const data = await response.json();

        console.log("Server response:", data);

        if (!response.ok || !data.success || !data.data) {
            throw new Error(data.message || "Song information could not be found.");
        }

        const song = data.data;

        thumbnail.src =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
            <rect width="100%" height="100%" fill="#1DB954"/>
            <text x="50%" y="50%" text-anchor="middle"
                  dominant-baseline="middle"
                  font-size="80">🎵</text>
        </svg>
    `);
        songTitle.textContent = song.title;
        artist.textContent = `Artist: ${song.author}`;
        duration.textContent = `Duration: ${song.duration}`;

        if (song.medias && song.medias.length > 0) {
    downloadLink.href = song.medias[0].url;
    downloadLink.download = "sample-song.mp3";
} else {
            throw new Error("Download link not available.");
        }

        message.textContent = "Song found successfully!";
        result.classList.remove("hidden");

    } catch (error) {

        console.error("Error:", error);

        message.textContent =
            error.message || "Something went wrong. Please try again.";

        result.classList.add("hidden");
    }
});