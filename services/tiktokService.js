const puppeteer = require("puppeteer");

const TIKTOK_USERNAME = process.env.TIKTOK_USERNAME;

async function checkTikTok() {
  try {
    console.log("🔍 Buscando el último video en TikTok...");

    // Verificar que la variable TIKTOK_USERNAME esté definida
    if (!TIKTOK_USERNAME) {
      throw new Error("❌ ERROR: La variable TIKTOK_USERNAME no está definida en el .env.");
    }

    // Construir la URL del perfil de TikTok usando el username
    const username = TIKTOK_USERNAME;
    const profileUrl = `https://www.tiktok.com/@${username}`;

    // 1️⃣ ABRIR TIKTOK Y OBTENER EL ÚLTIMO VIDEO DEL PERFIL
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    console.log(`🌍 Accediendo al perfil de TikTok: ${profileUrl}`);
    await page.goto(profileUrl, { waitUntil: "networkidle2" });

    // Buscar el enlace del último video
    const videoLink = await page.evaluate(() => {
      const videoElement = document.querySelector("a[href*='/video/']");
      return videoElement ? videoElement.href : null;
    });

    await browser.close();

    if (!videoLink) {
      throw new Error("❌ No se pudo encontrar el último video en TikTok.");
    }

    console.log(`✅ Último video en TikTok encontrado: ${videoLink}`);

    // RETORNAR LA URL PARA QUE SE PUBLIQUE EN DISCORD
    return `📱 **Último TikTok publicado:**\n🔗 ${videoLink}`;
  } catch (error) {
    console.error("❌ Error al obtener videos de TikTok:", error.response?.data || error.message);
  }
  return null;
}

module.exports = { checkTikTok };
