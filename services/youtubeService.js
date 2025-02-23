const axios = require("axios");
const { isNewPost, updateStorage } = require("./storageService");

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

async function checkYouTube() {
    try {
        console.log("🔍 Buscando el último video en YouTube...");
        const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${YOUTUBE_CHANNEL_ID}&order=date&part=snippet&type=video&maxResults=1`;
        const response = await axios.get(url);
        const latestVideo = response.data.items[0];

        const videoId = latestVideo.id.videoId;
        const videoTitle = latestVideo.snippet.title;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

        // Verificar si es un video nuevo
        if (!isNewPost("youtube", videoUrl)) return null;

        console.log(`✅ Nuevo video en YouTube: ${videoTitle} - ${videoUrl}`);
        updateStorage("youtube", videoUrl);

        return `📺 **Último video en YouTube:** ${videoTitle}\n🔗 ${videoUrl}`;
    } catch (error) {
        console.error("❌ Error al obtener videos de YouTube:", error);
        return null;
    }
}

module.exports = { checkYouTube };
