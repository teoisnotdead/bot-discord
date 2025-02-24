const puppeteer = require("puppeteer");
const { isNewPost, updateStorage } = require("./storageService");

const INSTAGRAM_USERNAME = process.env.INSTAGRAM_USERNAME;

async function checkInstagram() {
  try {
    console.log("🔍 Buscando el último post en Instagram...");

    if (!INSTAGRAM_USERNAME) {
      throw new Error("❌ ERROR: La variable INSTAGRAM_USERNAME no está definida en el .env.");
    }

    const username = INSTAGRAM_USERNAME;
    const profileUrl = `https://www.instagram.com/${username}/`;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    console.log(`🌍 Accediendo al perfil de Instagram: ${profileUrl}`);
    await page.goto(profileUrl, { waitUntil: "networkidle2" });

    // Esperar a que cargue la primera publicación
    await page.waitForSelector("article a", { timeout: 5000 });

    // Obtener el enlace del último post
    const latestPostUrl = await page.evaluate(() => {
      const postElement = document.querySelector("article a");
      return postElement ? postElement.href : null;
    });

    // Obtener la miniatura del último post
    const latestPostImage = await page.evaluate(() => {
      const imgElement = document.querySelector("article img");
      return imgElement ? imgElement.src : null;
    });

    await browser.close();

    if (!latestPostUrl) {
      throw new Error("❌ No se encontraron publicaciones en Instagram.");
    }

    // 🛑 Verificar si el post ya fue publicado
    if (!isNewPost("instagram", latestPostUrl)) {
      console.log("⚠️ No hay publicaciones nuevas en Instagram.");
      return null; // No publicar si es repetido
    }

    // 📌 Guardar el nuevo post en `storage.json`
    updateStorage("instagram", latestPostUrl);

    console.log(`✅ Nuevo post en Instagram: ${latestPostUrl}`);

    // 🖼️ Crear Embed para Discord si hay imagen
    if (latestPostImage) {
      return {
        embed: {
          title: "📸 Última publicación en Instagram",
          description: `[Ver publicación en Instagram](${latestPostUrl})`,
          color: 0xE1306C, // Color Instagram
          image: { url: latestPostImage }
        }
      };
    }

    // Si no hay imagen, solo envía el enlace
    return `📸 **Última publicación en Instagram:**\n🔗 ${latestPostUrl}`;
  } catch (error) {
    console.error("❌ Error al obtener posts de Instagram:", error.message);
  }
  return null;
}

module.exports = { checkInstagram };