require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { checkYouTube } = require("./services/youtubeService");
const { checkTikTok } = require("./services/tiktokService");
const { checkInstagram } = require("./services/instagramService");;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

// 🔹 Enviar actualizaciones a Discord
async function postUpdates() {
  console.log("\n🚀 Ejecutando revisión de redes sociales...\n");

  const youtubeUpdate = await checkYouTube();
  const tiktokUpdate = await checkTikTok();
  const instagramUpdate = await checkInstagram();

  console.log("\n🚀 ----FINAL----\n");
  console.log(`📢 Buscando canal en cache...`);
  const channel = await client.channels.fetch(DISCORD_CHANNEL_ID).catch(() => null);

  if (!channel) {
    console.error("❌ ERROR: No se encontró el canal de Discord.");
    return;
  }

  // Enviar mensajes a Discord
  if (youtubeUpdate) channel.send(youtubeUpdate);
  if (tiktokUpdate) channel.send(tiktokUpdate);

  if (instagramUpdate) {
    if (instagramUpdate.embed) {
      channel.send({ embeds: [instagramUpdate.embed] });
    } else {
      channel.send(instagramUpdate);
    }
  }
}

// 🔹 Comando Manual en Discord (Evita respuestas en otros canales)
client.on("messageCreate", async (message) => {
  // Ignorar mensajes de otros canales
  if (message.channel.id !== DISCORD_CHANNEL_ID) return;

  // Ignorar mensajes del propio bot
  if (message.author.bot) return;

  if (message.content === "!check") {
    console.log("\n🔎 Comando !check ejecutado\n");

    const youtubeUpdate = await checkYouTube();
    const tiktokUpdate = await checkTikTok();
    const instagramUpdate = await checkInstagram();

    const messageContent = [youtubeUpdate, tiktokUpdate, instagramUpdate]
      .filter(msg => msg !== null)
      .join("\n\n");

    if (messageContent) {
      message.channel.send(messageContent);
    } else {
      message.channel.send("⚠️ No se encontraron publicaciones.");
    }
  }
});

// 🔹 Ejecutar una vez al iniciar para pruebas inmediatas
client.once("ready", async () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
  await postUpdates(); // Ejecuta la función inmediatamente al iniciar
});

// 🔹 Revisión automática cada 10 minutos
setInterval(postUpdates, 600000);

client.login(DISCORD_BOT_TOKEN);
