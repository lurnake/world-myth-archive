#!/usr/bin/env node
/**
 * For every entity in key_figures.csv and creatures.csv, scan all works
 * and add any work where the entity's name (or alias) appears to works_appeared_in.
 */

const fs = require('fs');
const path = require('path');

const WORKS_DIR = 'Corpus Forge/works';
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

function normalize(v) {
  return String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9' -]+/g, ' ').replace(/\s+/g, ' ').trim();
}

const files = fs.readdirSync(WORKS_DIR).filter(f => f.endsWith('.md') && !/readme|audit|draft|notes/i.test(f));

// Map work filename -> workId from frontmatter
const workIdByFile = new Map();
for (const file of files) {
  const text = fs.readFileSync(path.join(WORKS_DIR, file), 'utf8');
  const match = text.replace(/^\s+/, '').match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const fm = match ? match[1] : '';
  const docIdMatch = fm.match(/doc_id:\s*(.+)/);
  const workId = docIdMatch ? docIdMatch[1].trim() : path.basename(file, '.md');
  workIdByFile.set(file, workId);
}

// Load entities
const figures = parseCsv(fs.readFileSync(FIGURES_FILE, 'utf8'));
const creatures = parseCsv(fs.readFileSync(CREATURES_FILE, 'utf8'));
const allEntities = [...figures, ...creatures];

// For each work, build normalized text
const workTexts = new Map();
for (const [file, workId] of workIdByFile) {
  const text = fs.readFileSync(path.join(WORKS_DIR, file), 'utf8');
  workTexts.set(workId, normalize(text));
}

// For each entity, find which works contain it
let updatedCount = 0;
for (const entity of allEntities) {
  const id = entity.figure_id || entity.creature_id;
  const names = [entity.preferred_name, ...(entity.alternate_names || '').split(/[;,]/)].map(v => normalize(v)).filter(v => v.length > 2);
  const existingWorks = (entity.works_appeared_in || '').split(/[,;\s]+/).filter(Boolean);
  
  const foundWorks = [];
  for (const [workId, normText] of workTexts) {
    if (existingWorks.includes(workId)) continue;
    const hasMatch = names.some(name => {
      if (name.includes(' ') || name.includes('-')) {
        return normText.includes(name);
      }
      return new RegExp('(^|\\s)' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(\\s|$)').test(normText);
    });
    if (hasMatch) {
      foundWorks.push(workId);
    }
  }
  
  if (foundWorks.length > 0) {
    const newWorks = [...existingWorks, ...foundWorks].sort();
    entity.works_appeared_in = [...new Set(newWorks)].join(';');
    updatedCount++;
  }
}

// Write back
const figHeaders = ['figure_id','preferred_name','figure_type','culture_group','domains','alternate_names','description_brief','notes','works_appeared_in','character_archetype_tags','function_tags','cognitive_function_tags'];
const crtHeaders = ['creature_id','preferred_name','culture_group','creature_type','description_brief','symbolism_roles','alternate_names','notes','works_appeared_in'];

fs.writeFileSync(FIGURES_FILE, serializeCsv(figHeaders, figures), 'utf8');
fs.writeFileSync(CREATURES_FILE, serializeCsv(crtHeaders, creatures), 'utf8');

console.log('Updated ' + updatedCount + ' entities with additional work scopes.');
