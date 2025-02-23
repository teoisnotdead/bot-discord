#!/bin/sh

echo "🚀 Instalando Chromium para Puppeteer..."
apt-get update && apt-get install -y wget unzip && \
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
dpkg -i google-chrome-stable_current_amd64.deb || apt-get -fy install && \
rm google-chrome-stable_current_amd64.deb

echo "📦 Instalando dependencias de Node.js..."
npm install

echo "✅ Configuración completada. Puppeteer y Chrome listos."
