#!/usr/bin/env node
/**
 * Comprehensive script: read WORK_ENTITY_SEEDS + frontmatter entities,
 * find all missing from CSV, and add them with proper metadata.
 */

const fs = require('fs');
const path = require('path');

const FIGURES_FILE = 'Corpus Forge/lexicons/key_figures.csv';
const CREATURES_FILE = 'Corpus Forge/lexicons/creatures.csv';
const WORKS_DIR = 'Corpus Forge/works';

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

function esc(val) {
  const str = String(val || '').replace(/"/g, '""');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) return `"${str}"`;
  return str;
}

function serializeCsv(headers, rows) {
  return [headers.join(','), ...rows.map(r => headers.map(h => esc(r[h])).join(','))].join('\n') + '\n';
}

const figs = parseCsv(fs.readFileSync(FIGURES_FILE, 'utf8'));
const crts = parseCsv(fs.readFileSync(CREATURES_FILE, 'utf8'));
const csvIds = new Set([...figs.map(f => f.figure_id), ...crts.map(c => c.creature_id)]);

// Parse WORK_ENTITY_SEEDS
const buildContent = fs.readFileSync('scripts/build-local-search-index.js', 'utf8');
const startIdx = buildContent.indexOf('const WORK_ENTITY_SEEDS = {');
const endIdx = buildContent.indexOf('};\n', startIdx) + 2;
const seedsBlock = buildContent.slice(startIdx, endIdx);

const entityRegex = /\[\s*'((?:FIG|DEITY|CRT)_[A-Z_]+)'\s*,\s*'([^']+)'\s*,\s*(\[[^\]]*\])\s*\]/g;
const seeds = [];
let m;
while ((m = entityRegex.exec(seedsBlock)) !== null) {
  seeds.push({ id: m[1], name: m[2] });
}

// Parse frontmatter entities from works
const files = fs.readdirSync(WORKS_DIR).filter(f => f.endsWith('.md'));
for (const file of files) {
  const text = fs.readFileSync(path.join(WORKS_DIR, file), 'utf8');
  const fmMatch = text.replace(/^\s+/, '').match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) continue;
  const fm = fmMatch[1];
  // Find key_figures and creatures blocks
  const blocks = fm.match(/key_figures:[\s\S]*?(?=^\w|\z)/m) || [];
  for (const block of blocks) {
    const ids = block.match(/id:\s*(FIG|DEITY|CRT)_[A-Z_]+/g);
    for (const idMatch of (ids || [])) {
      const id = idMatch.replace('id:', '').trim();
      if (!csvIds.has(id) && !seeds.find(s => s.id === id)) {
        seeds.push({ id, name: id.replace(/^(FIG|DEITY|CRT)_/, '').replace(/_.*$/, '') });
      }
    }
  }
  const creatureBlocks = fm.match(/creatures:[\s\S]*?(?=^\w|\z)/m) || [];
  for (const block of creatureBlocks) {
    const ids = block.match(/id:\s*(FIG|DEITY|CRT)_[A-Z_]+/g);
    for (const idMatch of (ids || [])) {
      const id = idMatch.replace('id:', '').trim();
      if (!csvIds.has(id) && !seeds.find(s => s.id === id)) {
        seeds.push({ id, name: id.replace(/^(FIG|DEITY|CRT)_/, '').replace(/_.*$/, '') });
      }
    }
  }
}

const CULTURE_MAP = {
  _MES: 'Mesopotamian', _EGY: 'Egyptian', _GRK: 'Greek', _ROM: 'Roman',
  _NOR: 'Norse', _NORSE: 'Norse', _ANG: 'Anglo-Saxon', _GER: 'Germanic',
  _IND: 'Indian', _VED: 'Vedic Indian', _VEDIC: 'Vedic Indian',
  _JPN: 'Japanese', _FINN: 'Finnish', _FIN: 'Finnish', _WELSH: 'Welsh', _WEL: 'Welsh',
  _IR: 'Irish', _IRISH: 'Irish', _MYA: 'Maya', _MAYA: 'Maya',
  _PER: 'Persian', _PERS: 'Persian', _PERSIAN: 'Persian',
};

function cultureFromId(id) {
  for (const [suffix, culture] of Object.entries(CULTURE_MAP)) {
    if (id.endsWith(suffix)) return culture;
  }
  return '';
}

const missingSeeds = seeds.filter(s => !csvIds.has(s.id));
console.log('Missing entities:', missingSeeds.length);

const newFigures = [];
const newCreatures = [];

for (const s of missingSeeds) {
  const culture = cultureFromId(s.id);
  const desc = `${culture || 'Mythological'} figure ${s.name}.`;
  if (s.id.startsWith('CRT_')) {
    newCreatures.push({
      creature_id: s.id, preferred_name: s.name, culture_group: culture,
      creature_type: 'Creature', description_brief: desc,
      symbolism_roles: 'Mythic being', alternate_names: '', notes: '', works_appeared_in: ''
    });
  } else {
    newFigures.push({
      figure_id: s.id, preferred_name: s.name, figure_type: 'Figure', culture_group: culture,
      domains: 'Mythology', alternate_names: '', description_brief: desc,
      notes: '', works_appeared_in: '', character_archetype_tags: '', function_tags: '', cognitive_function_tags: ''
    });
  }
}

for (const row of newFigures) figs.push(row);
for (const row of newCreatures) crts.push(row);

const figHeaders = ['figure_id','preferred_name','figure_type','culture_group','domains','alternate_names','description_brief','notes','works_appeared_in','character_archetype_tags','function_tags','cognitive_function_tags'];
const crtHeaders = ['creature_id','preferred_name','culture_group','creature_type','description_brief','symbolism_roles','alternate_names','notes','works_appeared_in'];

fs.writeFileSync(FIGURES_FILE, serializeCsv(figHeaders, figs), 'utf8');
fs.writeFileSync(CREATURES_FILE, serializeCsv(crtHeaders, crts), 'utf8');

console.log('Added ' + newFigures.length + ' figures and ' + newCreatures.length + ' creatures.');
