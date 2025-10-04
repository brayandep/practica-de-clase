const { test } = require('../../apiFixture');
const { cargarCasosDesdeJson, esperarFlujoDeCreacionDeSpace } = require('../../Assertions/spaces.assert');

test.describe('Verificar que se cree un spacio con datos parametrizados', () => {
  test.beforeAll(() => {
    if (!process.env.TOKEN || !process.env.ID_TEAM) {
      throw new Error('Faltan TOKEN o ID_TEAM en .env');
    }
  });

  for (const caso of cargarCasosDesdeJson()) {
    test(`${caso.caseId} – ${caso.reason} → ${caso.expectedStatus}`, async ({ request }) => {
      await esperarFlujoDeCreacionDeSpace(request, caso);
    });
  }
});