require('dotenv').config();
const { test: base } = require('@playwright/test');
const { createSpace } = require('./services/workspace');

exports.test = base.extend({
  space: async ({ request }, use) => {
    // Setup: crear Space temporal
    const rCreate = await createSpace(request, { name: `SP_TEST_${Date.now()}` });
    if (rCreate.status() !== 200) {
      throw new Error(`Falló creación Space: ${rCreate.status()} ${await rCreate.text()}`);
    }
    const body = await rCreate.json();

    // Entregar el recurso al test (el test es quien elimina)
    await use({ id: body.id, name: body.name });
  },
});
