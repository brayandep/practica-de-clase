const fs = require('fs');
const path = require('path');

function loadCsv(relPath) {
  const abs = path.resolve(process.cwd(), relPath);
  const raw = fs.readFileSync(abs, 'utf-8').trim();
  const [head, ...lines] = raw.split(/\r?\n/);
  const cols = head.split(',').map(s => s.trim());
  return lines.map(line => {
    // soporta campos con comillas
    const parts = [];
    let cur = '';
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQ = !inQ; continue; }
      if (ch === ',' && !inQ) { parts.push(cur); cur = ''; continue; }
      cur += ch;
    }
    parts.push(cur);
    const obj = {};
    cols.forEach((c, i) => obj[c] = (parts[i] || '').trim());
    return obj;
  });
}

function nowTs() { return Date.now().toString(); }

function applyTs(s) {
  if (!s) return s;
  return s.replaceAll('{{ts}}', nowTs());
}

module.exports = { loadCsv, applyTs };
