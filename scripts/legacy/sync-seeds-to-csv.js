#!/usr/bin/env node
/**
 * Update WORK_ENTITY_SEEDS in build-local-search-index.js to use CSV IDs
 * where the same character exists with a different ID.
 * Also add genuinely missing entities to the CSV.
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

// Build name-to-CSV-ID map
const nameToCsvId = new Map();
for (const f of figs) {
  if (!f.figure_id) continue;
  const names = [f.preferred_name, ...(f.alternate_names || '').split(/[,;]/)].map(v => v.trim().toLowerCase()).filter(Boolean);
  for (const n of names) {
    if (!nameToCsvId.has(n)) nameToCsvId.set(n, []);
    nameToCsvId.get(n).push({ id: f.figure_id, type: 'figure' });
  }
}
for (const c of crts) {
  if (!c.creature_id) continue;
  const names = [c.preferred_name, ...(c.alternate_names || '').split(/[,;]/)].map(v => v.trim().toLowerCase()).filter(Boolean);
  for (const n of names) {
    if (!nameToCsvId.has(n)) nameToCsvId.set(n, []);
    nameToCsvId.get(n).push({ id: c.creature_id, type: 'creature' });
  }
}

// Read WORK_ENTITY_SEEDS
let buildContent = fs.readFileSync(BUILD_FILE, 'utf8');

// Find all seed entity IDs and figure out remappings
const seedIdRegex = /\['(FIG|DEITY|CRT)_[A-Z_]+',\s*'([^']+)'/g;
let m;
const remaps = {}; // seedId -> csvId
while ((m = seedIdRegex.exec(buildContent)) !== null) {
  const seedId = m[1];
  const name = m[2].toLowerCase();
  const csvMatches = nameToCsvId.get(name);
  if (csvMatches && csvMatches.length === 1) {
    const csvId = csvMatches[0].id;
    if (csvId !== seedId) {
      remaps[seedId] = csvId;
    }
  }
}

console.log('ID remappings found:', Object.keys(remaps).length);
for (const [seedId, csvId] of Object.entries(remaps)) {
  console.log('  ' + seedId + ' -> ' + csvId);
}

// Apply remappings to BUILD_FILE
for (const [seedId, csvId] of Object.entries(remaps)) {
  const regex = new RegExp("'" + seedId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "'", 'g');
  buildContent = buildContent.replace(regex, "'" + csvId + "'");
}

fs.writeFileSync(BUILD_FILE, buildContent, 'utf8');
console.log('Updated WORK_ENTITY_SEEDS with ' + Object.keys(remaps).length + ' ID remappings.');

// Now add genuinely missing entities to CSV
// Re-read BUILD_FILE to get updated seeds
const updatedContent = fs.readFileSync(BUILD_FILE, 'utf8');
const seedMatches = [];
const regex = /\['(FIG|DEITY|CRT)_[A-Z_]+',\s*'([^']+)',\s*(\[[^\]]*\])\]/g;
let match;
while ((match = regex.exec(updatedContent)) !== null) {
  const id = match[1];
  const name = match[2];
  seedMatches.push({ id, name });
}

const csvIds = new Set([...figs.map(f => f.figure_id), ...crts.map(c => c.creature_id)]);
const missingSeeds = seedMatches.filter(s => !csvIds.has(s.id));
console.log('Genuinely missing seed entities:', missingSeeds.length);

const figHeaders = 'figure_id,preferred_name,figure_type,culture_group,domains,alternate_names,description_brief,notes,works_appeared_in,character_archetype_tags,function_tags,cognitive_function_tags';
const crtHeaders = 'creature_id,preferred_name,culture_group,creature_type,description_brief,symbolism_roles,alternate_names,notes,works_appeared_in';

const newFigures = [];
const newCreatures = [];

for (const s of missingSeeds) {
  if (s.id.startsWith('CRT_')) {
    newCreatures.push([s.id, s.name, '', '', '', '', '', '', '']);
  } else {
    newFigures.push([s.id, s.name, '', '', '', '', '', '', '', '', '', '']);
  }
}

function appendRows(filePath, rows, headers) {
  const content = rows.map((r) => r.map(csvEscape).join(',')).join('\n');
  const existing = fs.readFileSync(filePath, 'utf8').trimEnd();
  fs.writeFileSync(filePath, `${existing}\n${content}\n`, 'utf8');
}

if (newFigures.length) appendRows(FIGURES_FILE, newFigures, figHeaders);
if (newCreatures.length) appendRows(CREATURES_FILE, newCreatures, crtHeaders);

console.log('Added ' + newFigures.length + ' figures and ' + newCreatures.length + ' creatures to CSV.');
