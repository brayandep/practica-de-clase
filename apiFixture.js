// tests/fixtures/space.fixture.js
const { test: base } = require('@playwright/test');
const { createSpace } = require('../../src/services/clickup/spaces.service');

const LOG_NS = '[space-fixture]';
const ts = () => new Date().toISOString();

exports.test = base.extend({
  space: async ({ request }, use, testInfo) => {
    let spaceId = null;
    await testInfo.step('Setup: crear Space temporal', async () => {
      const res = await createSpace(request, process.env.CLICKUP_TEAM_ID, {
        name: `SP_TEST_${Date.now()}`
      });
      if (res.status() !== 200) {
        throw new Error(`Falló la creación del Space: ${res.status()} ${await res.text()}`);
      }
      const body = await res.json();
      spaceId = body.id;
      console.log(`${ts()} ${LOG_NS} Space creado`, { spaceId });
      await use({ id: spaceId, name: body.name });
    });
    // ❌ Sin teardown, el test se encarga de eliminar
  }
});
