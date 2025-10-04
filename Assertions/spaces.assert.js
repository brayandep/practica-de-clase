// Assertions/spaces.assert.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { expect } = require('@playwright/test');
const { createSpace, deleteSpace } = require('../services/workspace');
const { assertNoSensitiveData } = require('./deletews.assert');

// lee el data.js
const rutaPorDefectoJsonDeDatos = path.resolve(__dirname, '../data/spaces_create.json');
function cargarCasosDesdeJson(rutaOpcional) {
  const rutaJsonFinal = rutaOpcional || process.env.SPACES_JSON || rutaPorDefectoJsonDeDatos;
  const contenidoJson = fs.readFileSync(rutaJsonFinal, 'utf8');
  const arregloDeCasos = JSON.parse(contenidoJson);

  const marcaDeTiempoMilisegundos = Date.now().toString();
  return arregloDeCasos.map(caso => ({
    ...caso,
    name: typeof caso.name === 'string'
      ? caso.name.replace(/{{ts}}/g, marcaDeTiempoMilisegundos)
      : caso.name
  }));
}

async function esperarFlujoDeCreacionDeSpace(request, casoDePrueba) {
  const payloadDeCreacionDeSpace = {
    name: casoDePrueba.name || '',
    multiple_assignees: false
  };

  const respuestaCreacion = await createSpace(request, payloadDeCreacionDeSpace);
  const estadoHTTP = respuestaCreacion.status();

  // 1) Status esperado
  expect(
    estadoHTTP,
    `Body: ${await respuestaCreacion.text()}`
  ).toBe(Number(casoDePrueba.expectedStatus));

  // 2) Sin filtrar secretos
  await assertNoSensitiveData(respuestaCreacion);

  // 3) Validaciones extra + cleanup solo si es válido
  if (casoDePrueba.dataType === 'valid' && (estadoHTTP === 200 || estadoHTTP === 201)) {
    const cuerpoJson = await respuestaCreacion.json();
    expect(cuerpoJson?.id).toBeTruthy();
    expect(cuerpoJson?.name).toBe(payloadDeCreacionDeSpace.name);

    // Cleanup para no dejar basura
    const respuestaEliminacion = await deleteSpace(request, cuerpoJson.id);
    expect([200, 204]).toContain(respuestaEliminacion.status());
    await assertNoSensitiveData(respuestaEliminacion);
  }
}

module.exports = {
  cargarCasosDesdeJson,
  esperarFlujoDeCreacionDeSpace,
};