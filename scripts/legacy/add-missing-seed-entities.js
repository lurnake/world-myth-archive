#!/usr/bin/env node
/**
 * Extract WORK_ENTITY_SEEDS entities that are not in the CSV lexicons,
 * and append them with basic metadata.
 */

const fs = require('fs');

const BUILD_FILE = 'scripts/build-local-search-index.js';
const FIGURES_FILE = 'Corpus Forge/lexicons/key_figures.csv';
const CREATURES_FILE = 'Corpus Forge/lexicons/creatures.csv';

function parseCsv(content) {
  const lines = content.split('\n').filter(l => l.trim());
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const row = {};
    let inQuotes = false;
    let field = '';
    let colIdx = 0;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        row[headers[colIdx]] = field.trim();
        field = '';
        colIdx++;
      } else {
        field += ch;
      }
    }
    row[headers[colIdx]] = field.trim();
    return row;
  });
}

function csvEscape(val) {
  const str = String(val || '').replace(/"/g, '""');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) return `"${str}"`;
  return str;
}

const figs = parseCsv(fs.readFileSync(FIGURES_FILE, 'utf8'));
const crts = parseCsv(fs.readFileSync(CREATURES_FILE, 'utf8'));
const csvIds = new Set([...figs.map(f => f.figure_id), ...crts.map(c => c.creature_id)]);

// Parse WORK_ENTITY_SEEDS from build-local-search-index.js
const buildContent = fs.readFileSync(BUILD_FILE, 'utf8');

// Find the WORK_ENTITY_SEEDS object
const startIdx = buildContent.indexOf('const WORK_ENTITY_SEEDS = {');
const endIdx = buildContent.indexOf('};\n', startIdx) + 2;
const seedsBlock = buildContent.slice(startIdx, endIdx);

// Extract all entity definitions: ['ID', 'Name', ['alias1', 'alias2']]
const entityRegex = /\[\s*'((?:FIG|DEITY|CRT)_[A-Z_]+)'\s*,\s*'([^']+)'\s*,\s*(\[[^\]]*\])\s*\]/g;
const seeds = [];
let m;
while ((m = entityRegex.exec(seedsBlock)) !== null) {
  seeds.push({ id: m[1], name: m[2], aliasesStr: m[3] });
}

console.log('Found ' + seeds.length + ' seed entities');

const missing = seeds.filter(s => !csvIds.has(s.id));
console.log('Missing from CSV: ' + missing.length);

const newFigures = [];
const newCreatures = [];

for (const s of missing) {
  // Parse aliases
  const aliases = s.aliasesStr.slice(1, -1).split(',').map(a => a.trim().replace(/^'|'$/g, '')).filter(Boolean);
  const aliasStr = aliases.join(';');
  
  if (s.id.startsWith('CRT_')) {
    newCreatures.push([s.id, s.name, '', '', '', '', aliasStr, '', '']);
  } else {
    newFigures.push([s.id, s.name, '', '', '', aliasStr, '', '', '', '', '', '']);
  }
}

function appendRows(filePath, rows) {
  if (rows.length === 0) return;
  const content = rows.map((r) => r.map(csvEscape).join(',')).join('\n');
  const existing = fs.readFileSync(filePath, 'utf8').trimEnd();
  fs.writeFileSync(filePath, `${existing}\n${content}\n`, 'utf8');
}

appendRows(FIGURES_FILE, newFigures);
appendRows(CREATURES_FILE, newCreatures);

console.log('Added ' + newFigures.length + ' figures and ' + newCreatures.length + ' creatures.');
