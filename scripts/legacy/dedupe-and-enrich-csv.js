#!/usr/bin/env node
/**
 * Remove duplicate rows from CSV and enrich rows missing metadata.
 */

const fs = require('fs');

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

function serializeCsv(headers, rows) {
  function esc(val) {
    const str = String(val || '').replace(/"/g, '""');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) return `"${str}"`;
    return str;
  }
  return [headers.join(','), ...rows.map(r => headers.map(h => esc(r[h])).join(','))].join('\n') + '\n';
}

function dedupeAndEnrich(rows, idKey) {
  const byId = new Map();
  for (const row of rows) {
    const id = row[idKey];
    if (!id) continue;
    const existing = byId.get(id);
    if (!existing) {
      byId.set(id, row);
      continue;
    }
    // Merge: prefer non-empty fields from either row
    for (const key of Object.keys(row)) {
      if (!existing[key] && row[key]) {
        existing[key] = row[key];
      }
    }
  }
  return Array.from(byId.values());
}

const CULTURE_MAP = {
  _MES: 'Mesopotamian', _EGY: 'Egyptian', _GRK: 'Greek', _ROM: 'Roman',
  _NOR: 'Norse', _NORSE: 'Norse', _ANG: 'Anglo-Saxon', _GER: 'Germanic',
  _IND: 'Indian', _VED: 'Vedic Indian', _VEDIC: 'Vedic Indian',
  _JPN: 'Japanese', _FINN: 'Finnish', _WELSH: 'Welsh', _WEL: 'Welsh',
  _IR: 'Irish', _IRISH: 'Irish', _MYA: 'Maya', _MAYA: 'Maya',
  _PER: 'Persian', _PERS: 'Persian', _PERSIAN: 'Persian',
};

function cultureFromId(id) {
  for (const [suffix, culture] of Object.entries(CULTURE_MAP)) {
    if (id.endsWith(suffix)) return culture;
  }
  return '';
}

const figs = parseCsv(fs.readFileSync(FIGURES_FILE, 'utf8'));
const crts = parseCsv(fs.readFileSync(CREATURES_FILE, 'utf8'));

const dedupedFigs = dedupeAndEnrich(figs, 'figure_id');
const dedupedCrts = dedupeAndEnrich(crts, 'creature_id');

let enriched = 0;
for (const row of dedupedFigs) {
  if (!row.culture_group) { row.culture_group = cultureFromId(row.figure_id); enriched++; }
  if (!row.figure_type) { row.figure_type = 'Figure'; enriched++; }
  if (!row.description_brief) { row.description_brief = `${row.culture_group || 'Mythological'} figure ${row.preferred_name}.`; enriched++; }
  if (!row.domains) { row.domains = 'Mythology'; enriched++; }
}
for (const row of dedupedCrts) {
  if (!row.culture_group) { row.culture_group = cultureFromId(row.creature_id); enriched++; }
  if (!row.creature_type) { row.creature_type = 'Creature'; enriched++; }
  if (!row.description_brief) { row.description_brief = `${row.culture_group || 'Mythological'} creature ${row.preferred_name}.`; enriched++; }
  if (!row.symbolism_roles) { row.symbolism_roles = 'Mythic being'; enriched++; }
}

const figHeaders = ['figure_id','preferred_name','figure_type','culture_group','domains','alternate_names','description_brief','notes','works_appeared_in','character_archetype_tags','function_tags','cognitive_function_tags'];
const crtHeaders = ['creature_id','preferred_name','culture_group','creature_type','description_brief','symbolism_roles','alternate_names','notes','works_appeared_in'];

fs.writeFileSync(FIGURES_FILE, serializeCsv(figHeaders, dedupedFigs), 'utf8');
fs.writeFileSync(CREATURES_FILE, serializeCsv(crtHeaders, dedupedCrts), 'utf8');

console.log('Deduped to ' + dedupedFigs.length + ' figures and ' + dedupedCrts.length + ' creatures.');
console.log('Enriched ' + enriched + ' fields.');
