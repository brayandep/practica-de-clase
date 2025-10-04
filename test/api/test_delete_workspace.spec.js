// test/api/test_delete_workspace.spec.js
require('dotenv').config();
const { test: base } = require('@playwright/test');
const { test } = require('../../apiFixture'); // fixture que crea { space }

const {
  deleteSpace,
  getSpace,
  authlessDelete,
} = require('../../services/workspace');

const {
  expectDeleteOK,
  expectNotFoundOnGet,
  expectNoAuthOAUTH017,
  expectDeleteIdInexistente,
} = require('../../Assertions/deletews.assert');

test.describe('ClickUp API – Eliminar Space (sin CSV)', () => {
  test.beforeAll(() => {
    if (!process.env.TOKEN || !process.env.ID_TEAM) {
      throw new Error('Faltan TOKEN o ID_TEAM en .env');
    }
  });

  //  TD001: Eliminar un Space existente
  test('TD001 – Eliminar un Space existente', async ({ request, space }) => {
    if (!space) test.skip('No se pudo crear Space (límite del plan u otro error).');

    const rDelete = await deleteSpace(request, space.id);
    await expectDeleteOK(rDelete);

    const rGet = await getSpace(request, space.id);
    await expectNotFoundOnGet(rGet);
  });

  //  TD002: ID inexistente (sin fixture)
  base('TD002 – Eliminar Space con ID inexistente', async ({ request }) => {
    const fakeId = '9999999999999999';
    const rDelete = await deleteSpace(request, fakeId);
    await expectDeleteIdInexistente(rDelete);
  });

  //  TD003: Sin token (ID existente del fixture) + cleanup
  test('TD003 – Eliminar Space sin token (ID existente)', async ({ request, space }) => {
    if (!space) test.skip('No se pudo crear Space para la prueba.');

    const resNoToken = await authlessDelete(request, space.id);
    await expectNoAuthOAUTH017(resNoToken, [400, 401]); // encapsula el check de 400/401 + ECODE

    // cleanup para no dejar datos
    const resCleanup = await deleteSpace(request, space.id);
    await expectDeleteOK(resCleanup);
  });
});
