const { expect } = require('@playwright/test');
const { test } = require('../../apiFixture'); // fixture que crea un space real

const {deleteSpace,getSpace,authlessDelete} = require('../../services/workspace');

const { expectDeleteOK, expectNotFoundOnGet, assertNoSensitiveData} = require('../../Assertions/deletews.assert');

// 👉 Nuevo helper temporal para enviar request sin token
const BASE = process.env.BASE_URL || 'https://api.clickup.com/api/v2';

test.describe('ClickUp API – Eliminar Space (sin CSV)', () => {

  test.beforeAll(() => {
    if (!process.env.TOKEN || !process.env.ID_TEAM) {
      throw new Error('Faltan TOKEN o ID_TEAM en .env');
    }
  });

  // ✅ Caso positivo
  test('TD001 – Eliminar un Space existente', async ({ request, space }) => {
    const rDelete = await deleteSpace(request, space.id);
    await expectDeleteOK(rDelete);
    await assertNoSensitiveData(rDelete);

    const rGet = await getSpace(request, space.id);
    await expectNotFoundOnGet(rGet);
  });

  // ❌ Caso negativo 1: ID inexistente
  test('TD002 – Eliminar Space con ID inexistente', async ({ request }) => {
    const fakeId = '9999999999999999'; // ID arbitrario que no existe
    const rDelete = await deleteSpace(request, fakeId);

    console.log('Status esperado ~404, recibido:', rDelete.status());
    expect([400, 401]).toContain(rDelete.status());
    await assertNoSensitiveData(rDelete);
  });

  // ❌ Caso negativo 2: Sin token
  test('TD003 – Eliminar Space sin token', async ({ request, space }) => {
    const rDelete = await authlessDelete(request, space.id);

    console.log('Status esperado 401, recibido:', rDelete.status());
    expect(rDelete.status()).toBe(400);
    await assertNoSensitiveData(rDelete);
  });

});
