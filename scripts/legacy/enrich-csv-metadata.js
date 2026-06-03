#!/usr/bin/env node
/**
 * Enrich CSV entities that are missing metadata with sensible defaults.
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

function figureTypeFromName(name, id) {
  if (id.includes('DEITY')) return 'Deity';
  if (['Zeus', 'Jupiter', 'Odin', 'Thor', 'Ra', 'Osiris', 'Amaterasu', 'Susanoo', 'Vishnu', 'Shiva', 'Brahma', 'Indra', 'Marduk'].includes(name)) return 'Deity';
  if (['Achilles', 'Hector', 'Odysseus', 'Aeneas', 'Sigurd', 'Siegfried', 'Rostam', 'Rustem', 'Rama', 'Arjuna', 'Cú Chulainn', 'Beowulf', 'Gilgamesh'].includes(name)) return 'Hero';
  if (['Agamemnon', 'Priam', 'Hrothgar', 'Kay Kavus', 'Conchobar', 'Ailill'].includes(name)) return 'King';
  if (['Medea', 'Circe', 'Morgan le Fay'].includes(name)) return 'Sorceress';
  if (['Helen', 'Penelope', 'Dido', 'Sita', 'Draupadi'].includes(name)) return 'Queen';
  return 'Figure';
}

function generateDescription(name, culture) {
  const descs = [
    `${culture} mythological figure ${name}.`,
    `Significant ${culture.toLowerCase()} figure known as ${name}.`,
    `${name}, a figure from ${culture.toLowerCase()} tradition.`,
  ];
  return descs[0];
}

const figs = parseCsv(fs.readFileSync(FIGURES_FILE, 'utf8'));
const crts = parseCsv(fs.readFileSync(CREATURES_FILE, 'utf8'));

let enriched = 0;
for (const row of figs) {
  const id = row.figure_id;
  if (!id) continue;
  const culture = row.culture_group || cultureFromId(id);
  if (!row.culture_group) row.culture_group = culture;
  if (!row.figure_type) row.figure_type = figureTypeFromName(row.preferred_name, id);
  if (!row.description_brief) {
    row.description_brief = generateDescription(row.preferred_name, culture);
    enriched++;
  }
  if (!row.domains) row.domains = 'Mythology';
  if (!row.works_appeared_in) row.works_appeared_in = '';
}

for (const row of crts) {
  const id = row.creature_id;
  if (!id) continue;
  const culture = row.culture_group || cultureFromId(id);
  if (!row.culture_group) row.culture_group = culture;
  if (!row.creature_type) row.creature_type = 'Creature';
  if (!row.description_brief) {
    row.description_brief = `${culture} mythological creature ${row.preferred_name}.`;
    enriched++;
  }
  if (!row.symbolism_roles) row.symbolism_roles = 'Mythic being';
  if (!row.works_appeared_in) row.works_appeared_in = '';
}

const figHeaders = ['figure_id','preferred_name','figure_type','culture_group','domains','alternate_names','description_brief','notes','works_appeared_in','character_archetype_tags','function_tags','cognitive_function_tags'];
const crtHeaders = ['creature_id','preferred_name','culture_group','creature_type','description_brief','symbolism_roles','alternate_names','notes','works_appeared_in'];

fs.writeFileSync(FIGURES_FILE, serializeCsv(figHeaders, figs), 'utf8');
fs.writeFileSync(CREATURES_FILE, serializeCsv(crtHeaders, crts), 'utf8');

console.log('Enriched ' + enriched + ' rows with generated metadata.');
