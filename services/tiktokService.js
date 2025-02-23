const puppeteer = require("puppeteer");
const { isNewPost, updateStorage } = require("./storageService");

const TIKTOK_USERNAME = process.env.TIKTOK_USERNAME;

async function launchBrowser() {
  return await puppeteer.launch({
    headless: "new", // Usa "true" si prefieres ocultarlo completamente
    executablePath: process.env.CHROME_PATH || puppeteer.executablePath(), // Render necesita CHROME_PATH
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--single-process",
      "--no-zygote"
    ]
  });
}
async function checkTikTok() {
  try {
    console.log("🔍 Buscando el último video en TikTok...");
    const username = TIKTOK_USERNAME;
    if (!username) throw new Error("❌ ERROR: TIKTOK_USERNAME no está definido en .env.");

    const profileUrl = `https://www.tiktok.com/@${username}`;
    const browser = await launchBrowser();
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
    if (!isNewPost("tiktok", videoLink)) return null;

    console.log(`✅ Nuevo video en TikTok encontrado: ${videoLink}`);
    updateStorage("tiktok", videoLink);

    return `📱 **Último TikTok publicado:**\n🔗 ${videoLink}`;
  } catch (error) {
    console.error("❌ Error al obtener videos de TikTok:", error.message);
    return null;
  }
}

module.exports = { checkTikTok };
