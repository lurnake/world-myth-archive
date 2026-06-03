#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const worksDir = 'Corpus Forge/works';
const files = fs.readdirSync(worksDir).filter(f => f.endsWith('.md'));

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

function normalize(v) {
  return String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9' -]+/g, ' ').replace(/\s+/g, ' ').trim();
}

const figs = parseCsv(fs.readFileSync('Corpus Forge/lexicons/key_figures.csv', 'utf8'));
const crts = parseCsv(fs.readFileSync('Corpus Forge/lexicons/creatures.csv', 'utf8'));
const manifest = JSON.parse(fs.readFileSync('Corpus Forge/corpus_manifest.json', 'utf8'));

console.log('Loaded ' + figs.length + ' figures and ' + crts.length + ' creatures');

// Build entity lookup: normalized name -> list of entity rows
const entityNames = new Map();
for (const e of [...figs, ...crts]) {
  const id = e.figure_id || e.creature_id;
  if (!id) continue;
  const names = [e.preferred_name, ...(e.alternate_names || '').split(/[;,]/)]
    .map(v => normalize(v)).filter(v => v.length > 2);
  for (const n of [...new Set(names)]) {
    if (!entityNames.has(n)) entityNames.set(n, []);
    entityNames.get(n).push({ ...e, id });
  }
}

console.log('Built name index with ' + entityNames.size + ' unique names');

// For each work, find which entities appear
for (const file of files) {
  const text = fs.readFileSync(path.join(worksDir, file), 'utf8');
  const normText = normalize(text);
  const workId = manifest.works.find(w => w.file === file)?.id;
  if (!workId) continue;

  const foundIds = new Set();
  for (const [name, entities] of entityNames) {
    const hasMatch = name.includes(' ') || name.includes('-')
      ? normText.includes(name)
      : new RegExp('(^|\\s)' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(\\s|$)').test(normText);
    if (hasMatch) {
      for (const e of entities) foundIds.add(e.id);
    }
  }

  // Check which found entities are NOT in works_appeared_in
  const missingWorkIds = [];
  for (const e of [...figs, ...crts]) {
    const id = e.figure_id || e.creature_id;
    if (foundIds.has(id)) {
      const works = (e.works_appeared_in || '').split(/[,;\s]+/).filter(Boolean);
      if (works.length > 0 && !works.includes(workId)) {
        missingWorkIds.push(id);
      }
    }
  }

  console.log(workId + ': ' + foundIds.size + ' entities in text, ' + missingWorkIds.length + ' missing from works_appeared_in');
  if (missingWorkIds.length > 0 && missingWorkIds.length <= 10) {
    console.log('  Missing: ' + missingWorkIds.join(', '));
  } else if (missingWorkIds.length > 10) {
    console.log('  Missing (first 10): ' + missingWorkIds.slice(0, 10).join(', ') + ' ... +' + (missingWorkIds.length - 10) + ' more');
  }
}
