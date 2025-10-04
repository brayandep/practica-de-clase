require('dotenv').config();
const { test, expect } = require('@playwright/test');
const path = require('path');
const {
  createSpace,
  deleteSpace,
  getSpace
} = require('../../services/workspace'); // tu servicio ya usa .env

const {
  expectDeleteOK,
  expectNotFoundOnGet,
  assertNoSensitiveData
} = require('../../Assertions/deletews.assert');

const { loadCsv, applyTs } = require('../../utils/workspacehelpers');
const { buildCreateFromRow, expectedStatusFromRow } = require('../../payloads/deletews.payload');

test.describe('ClickUp API – Eliminar Space (parametrizado CSV)', () => {

  test.beforeAll(() => {
    if (!process.env.TOKEN || !process.env.ID_TEAM) {
      throw new Error('Faltan TOKEN o ID_TEAM en .env');
    }
  });

  const rows = loadCsv('data/workspacedelete.csv');

  for (const row of rows) {
    test(`CSV ${row.caseId || ''} – ${row.reason || row.type}`, async ({ request }) => {
      // Arrange: payload desde CSV (con {{ts}})
      const payload = buildCreateFromRow({
        ...row,
        name: applyTs(row.name)
      });
      const expCreate = expectedStatusFromRow(row, 200);

      // Act: intentar crear el Space
      const rCreate = await createSpace(request, payload);

      // Assert de creación (puede ser positivo o negativo)
      expect(rCreate.status(), await rCreate.text()).toBe(expCreate);

      if (expCreate !== 200) {
        // Caso negativo de creación: NO intentar eliminar
        return;
      }

      // Si la creación fue 200, seguimos con la eliminación
      const body = await rCreate.json();
      const spaceId = body.id;
      expect(spaceId).toBeTruthy();

      // Delete
      const rDelete = await deleteSpace(request, spaceId);
      await expectDeleteOK(rDelete);
      await assertNoSensitiveData(rDelete);

      // GET debe fallar tras borrar
      const rGet = await getSpace(request, spaceId);
      await expectNotFoundOnGet(rGet);
    });
  }
});
