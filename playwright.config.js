const { defineConfig } = require('@playwright/test');
require('dotenv').config();

module.exports = defineConfig({
  testDir: './test/api',  // Asegúrate de que la ruta esté correcta para tu proyecto
  reporter: [['list'], ['html'], ['allure-playwright']],
  use: {
    baseURL: process.env.API_BASE || 'https://api.clickup.com/api/v2/',  // Asegúrate de que se use la URL de ClickUp
    headless: true,  // El modo headless es verdadero por defecto para que no se abra una ventana de navegador
  },
  timeout: 30 * 1000,  // Puedes ajustar el tiempo de espera si es necesario
  retries: 0,  // No reintentar las pruebas automáticamente
});
