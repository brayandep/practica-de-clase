// construye el payload de create a partir de la fila del CSV
function buildCreateFromRow(row) {
  // En ClickUp el name de Space debe ser un string; la API valida caracteres.
  // No forzamos slug aquí para que ejerza la validación real de la API.
  const payload = {
    name: row.name || '',
    multiple_assignees: false
  };
  return payload;
}

function expectedStatusFromRow(row, def = 200) {
  const n = Number(row.expectedStatus);
  return Number.isFinite(n) ? n : def;
}

module.exports = { buildCreateFromRow, expectedStatusFromRow };
