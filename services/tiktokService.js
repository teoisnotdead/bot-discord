const puppeteer = require("puppeteer");
const { isNewPost, updateStorage } = require("./storageService");

const TIKTOK_USERNAME = process.env.TIKTOK_USERNAME;

async function checkTikTok() {
  try {
    console.log("🔍 Buscando el último video en TikTok...");
    const username = TIKTOK_USERNAME;
    if (!username) throw new Error("❌ ERROR: TIKTOK_USERNAME no está definido en .env.");

    const profileUrl = `https://www.tiktok.com/@${username}`;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    console.log(`🌍 Accediendo al perfil de TikTok: ${profileUrl}`);
    await page.goto(profileUrl, { waitUntil: "networkidle2" });

    const videoLink = await page.evaluate(() => {
      const videoElement = document.querySelector("a[href*='/video/']");
      return videoElement ? videoElement.href : null;
    });

    await browser.close();

    if (!videoLink) throw new Error("❌ No se pudo encontrar el último video en TikTok.");

    // Verificar si es un video nuevo
    if (!isNewPost("tiktok", videoLink)) {
      console.log("⚠️ No hay nuevos videos en TikTok.");
      return null;
    }

    console.log(`✅ Nuevo video en TikTok encontrado: ${videoLink}`);
    updateStorage("tiktok", videoLink);

    return `📱 **Último TikTok publicado:**\n🔗 ${videoLink}`;
  } catch (error) {
    console.error("❌ Error al obtener videos de TikTok:", error.message);
    return null;
  }
}

module.exports = { checkTikTok };