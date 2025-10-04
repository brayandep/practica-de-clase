// Assertions/deletews.assert.js
const { expect } = require('@playwright/test');

/** ────────── Sanitización ────────── **/
const leakPatterns = [
  /authorization\s*:\s*[A-Za-z0-9\-\._]{6,}/i,
  /bearer\s+[A-Za-z0-9\-\._]{10,}/i,
  /api[_-]?key\s*[:=]\s*[A-Za-z0-9\-\._]{6,}/i,
  /token\s*[:=]\s*[A-Za-z0-9\-\._]{6,}/i,
  /password\s*[:=]\s*[^,\s"']+/i,
  /secret\s*[:=]\s*[^,\s"']+/i,
];
const _assertNoSensitiveDataText = (text) => {
  for (const rx of leakPatterns) expect(text).not.toMatch(rx);
};

exports.assertNoSensitiveData = async (res) => {
  const text = await res.text();
  _assertNoSensitiveDataText(text);
  return text; // por si otra aserción necesita reusar el body
};

/** ────────── Aserciones de estado ────────── **/
exports.expectDeleteOK = async (res) => {
  expect([200, 204]).toContain(res.status());
  await exports.assertNoSensitiveData(res);
};

exports.expectNotFoundOnGet = async (res) => {
  expect([404, 400]).toContain(res.status());
  await exports.assertNoSensitiveData(res);
};

/** 400/401 esperado cuando falta Authorization; valida ECODE OAUTH_017 */
exports.expectNoAuthOAUTH017 = async (res, allowed = [400, 401]) => {
  const status = res.status();
  const text = await exports.assertNoSensitiveData(res); // sanitiza y devuelve body
  expect(allowed).toContain(status);

  try {
    const json = JSON.parse(text);
    expect(json).toHaveProperty('ECODE');
    expect(json.ECODE).toBe('OAUTH_017'); // "Authorization header required"
  } catch {
    expect(text).toMatch(/Authorization header required/i);
  }
};

/** Para ID inexistente: ClickUp puede responder 400/401/404 */
exports.expectDeleteIdInexistente = async (res) => {
  expect([400, 401, 404]).toContain(res.status());
  await exports.assertNoSensitiveData(res);
};
