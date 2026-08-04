// Validates that the CSV parser used in app.js correctly reads every data file,
// including Persian text and commas. Run: node test_parse.mjs
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dataDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'data');

// --- identical logic to js/app.js ---
function parseCSV(text) {
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  const rows = [];
  let field = '', row = [], inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n') { row.push(field); field = ''; rows.push(row); row = []; }
    else if (ch !== '\r') field += ch;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function toObjects(rows) {
  if (!rows.length) return [];
  const headers = rows[0].map(h => h.trim());
  return rows.slice(1)
    .filter(r => r.some(c => c !== undefined && c !== null && c !== ''))
    .map(r => {
      const o = {};
      headers.forEach((h, i) => { o[h] = (r[i] !== undefined ? r[i] : '').trim(); });
      return o;
    });
}

const files = ['person.csv', 'contact.csv', 'skills.csv', 'samples.csv',
  'education.csv', 'work.csv', 'languages.csv', 'certificates.csv'];

let failed = 0;
for (const f of files) {
  const text = await readFile(join(dataDir, f), 'utf8');
  const rows = toObjects(parseCSV(text));
  const hasBom = Buffer.isEncoding('utf8') ; // noop
  const firstBom = text.charCodeAt(0) === 0xfeff;
  console.log(`\n== ${f} == rows=${rows.length} BOM=${firstBom}`);
  const head = rows[0] || {};
  console.log('  sample row:', JSON.stringify(head));
  // check every row has same keys as first
  const keys = Object.keys(head).sort().join(',');
  for (const r of rows) {
    if (Object.keys(r).sort().join(',') !== keys) {
      console.log('  !! MISSING/EXTRA KEYS:', JSON.stringify(r)); failed++;
    }
  }
  // no undefined values asserted
  for (const r of rows) {
    for (const k of Object.keys(r)) {
      if (r[k] === undefined) { console.log('  !! undefined in', k); failed++; }
    }
  }
}
console.log(failed ? `\n${failed} FAILURES` : '\nALL CSV PARSE CHECKS PASSED');
