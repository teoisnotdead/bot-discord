const fs = require("fs");
const path = require("path");

const storageFilePath = path.join(__dirname, "../storage.json");

// 🔹 Cargar el archivo JSON de almacenamiento
function loadStorage() {
  try {
    return JSON.parse(fs.readFileSync(storageFilePath, "utf8"));
  } catch (error) {
    console.error("⚠️ Error al cargar el archivo de almacenamiento, creando uno nuevo.");
    return { youtube: "", tiktok: "", instagram: "" };
  }
}

// 🔹 Guardar datos en el archivo JSON
function saveStorage(data) {
  fs.writeFileSync(storageFilePath, JSON.stringify(data, null, 2));
}

// 🔹 Verificar si un post es nuevo
function isNewPost(type, newUrl) {
  const storage = loadStorage();
  return storage[type] !== newUrl;
}

// 🔹 Actualizar el archivo JSON con el nuevo post
function updateStorage(type, newUrl) {
  const storage = loadStorage();
  storage[type] = newUrl;
  saveStorage(storage);
}

module.exports = { isNewPost, updateStorage };
