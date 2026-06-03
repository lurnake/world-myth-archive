#!/usr/bin/env node
/**
 * Normalize ad-hoc tags in Corpus Forge work frontmatters to controlled vocabulary.
 * Adds missing codes to lexicons where justified, maps/removes the rest.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const WORKS_DIR = path.join(ROOT, 'Corpus Forge/works');
const LEXICON_DIR = path.join(ROOT, 'Corpus Forge/lexicons');

const TAG_KEYS = {
  mythType: 'myth_type_tags',
  theme: 'theme_tags',
  archetype: 'character_archetype_tags',
  social: 'social_role_tags',
  cognitive: 'cognitive_function_tags',
  rite: 'rite_tags',
  episode: 'myth_episode_tags',
};

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"' && inQuotes && next === '"') {
      field += '"';
      i += 1;
      continue;
    }
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (char === ',' && !inQuotes) {
      row.push(field);
      field = '';
      continue;
    }
    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(field);
      if (row.some((v) => v.trim())) rows.push(row);
      row = [];
      field = '';
      continue;
    }
    field += char;
  }
  row.push(field);
  if (row.some((v) => v.trim())) rows.push(row);
  const [headers = [], ...data] = rows;
  return data.map((values) => Object.fromEntries(
    headers.map((h, i) => [h.trim(), (values[i] || '').trim()])
  ));
}

function loadLexiconCodes() {
  const codes = new Set();
  for (const [key, file] of Object.entries({
    mythType: 'myth_type_tags.csv',
    theme: 'theme_tags.csv',
    archetype: 'character_archetype_tags.csv',
    social: 'social_role_tags.csv',
    cognitive: 'cognitive_function_tags.csv',
    rite: 'rite_tags.csv',
    episode: 'myth_episode.csv',
  })) {
    const fp = path.join(LEXICON_DIR, file);
    if (!fs.existsSync(fp)) continue;
    const rows = parseCsv(fs.readFileSync(fp, 'utf8'));
    for (const row of rows) {
      if (row.code) codes.add(row.code);
    }
  }
  return codes;
}

const CONTROLLED = loadLexiconCodes();

// Tags to map: ad-hoc code -> controlled code or null (remove)
const MAPPINGS = {
  // Myth type
  MYTHTYPE_EPIC: 'MYTHTYPE_HERO_SAGA_LEGEND',
  MYTHTYPE_COSMOGONIC: 'MYTHTYPE_COSMOGONY',
  MYTHTYPE_CREATION_COSMOGONY: 'MYTHTYPE_COSMOGONY',
  MYTHTYPE_DYNASTIC_LEGEND: 'MYTHTYPE_FOUNDATION',
  MYTHTYPE_ARTHURIAN_ROMANCE: 'MYTHTYPE_HERO_SAGA_LEGEND',
  MYTHTYPE_MONSTER_LEGEND: 'MYTHTYPE_HERO_SAGA_LEGEND',

  // Archetype
  ARCH_SHADOW_ANTAGONIST: 'ARCH_SHADOW_FIGURE',
  ARCH_HERO: null,
  ARCH_WARRIOR_HERO: null,
  ARCH_TRANSFORMATIVE_FEMININE: null,

  // Theme
  THM_DEATH_MORTALITY: 'THM_DEATH_ORIGIN',
  THM_DIVINE_INTERVENTION_CONFLICT: 'THM_DIVINE_COMBAT',
  THM_METAMORPHOSIS_TRANSFORMATION: 'THM_METAMORPHOSIS',
  THM_CREATION_ORIGIN: 'THM_CREATION',
  THM_PROPHECY_OMENS_DREAMS: 'THM_PROPHECY_FATE',
  THM_WISDOM_KNOWLEDGE: null,
  THM_TRICKSTER: 'THM_TRICKSTER_CYCLE',
  THM_TRANSFORMATION_METAMORPHOSIS: 'THM_METAMORPHOSIS',
  THM_TABOO_TRANSGRESSION: 'THM_FORBIDDEN_ACT_TRANSGRESSION',
  THM_SOVEREIGNTY: 'THM_ORDER_VS_CHAOS',
  THM_SOLAR_CYCLE: 'THM_CELESTIAL_PHENOMENA',
  THM_REVENGE_JUSTICE: 'THM_ORDER_VS_CHAOS',

  // Social
  FUNC_WARRIOR_HERO: 'FUNC_WARRIOR',
  FUNC_SOVEREIGNTY: null,
  FUNC_CULTURE_HERO: 'FUNC_CIVILIZER_CULTURE_HERO',

  // Rite
  RITE_PURIFICATION_LUSTRATION: 'RITE_PURIFICATION',
  RITE_SACRIFICE_OFFERING: 'RITE_SACRIFICE',
  RITE_FUNERAL_MOURNING: 'RITE_FUNERAL',

  // Episode
  EP_UNDERWORLD_JOURNEY: 'EP_DESCENT_TO_UNDERWORLD',
  EP_ORACULAR_GUIDANCE: 'EP_ORACULAR_PRONOUNCEMENT',
ARCH_TRICKSTER: 'ARCH_TRICKSTER_ARCHETYPE',
  EP_DIVINE_CONFLICT: 'EP_THEOMACHY',
  FUNC_MEDIATOR_CIVILIZER: 'FUNC_CIVILIZER_CULTURE_HERO',
  FUNC_ORACLE_PROPHET: 'FUNC_ORACLE_PROPHET_FUNCTION',
  FUNC_BARD_POET: null,
  ARCH_HERO_CHAMPION: null,
};

// Add new controlled codes to lexicons
const NEW_CODES = {
  'myth_type_tags.csv': [
    { code: 'MYTHTYPE_HYMN_PRAYER', label: 'Hymn/Prayer', notes: 'Text primarily consisting of hymns, prayers, or invocations to deities' },
    { code: 'MYTHTYPE_RITUAL_TEXT', label: 'Ritual Text', notes: 'Text designed for ritual performance, funeral rites, or religious ceremony' },
  ],
};

function addNewLexiconCodes() {
  for (const [file, entries] of Object.entries(NEW_CODES)) {
    const fp = path.join(LEXICON_DIR, file);
    if (!fs.existsSync(fp)) continue;
    const content = fs.readFileSync(fp, 'utf8').trimEnd();
    const rows = parseCsv(content);
    const existingCodes = new Set(rows.map((r) => r.code));
    const toAdd = entries.filter((e) => !existingCodes.has(e.code));
    if (toAdd.length === 0) continue;
    const newLines = toAdd.map((e) => `${e.code},${e.label},"${e.notes}"`).join('\n');
    fs.writeFileSync(fp, `${content}\n${newLines}\n`);
    console.log(`Added ${toAdd.length} codes to ${file}`);
  }
}

function normalizeWorkFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const fmMatch = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) return;

  let changed = false;
  let frontmatter = fmMatch[1];

  for (const [key, yamlKey] of Object.entries(TAG_KEYS)) {
    const regex = new RegExp(`^(${yamlKey}):\\s*\\n((?:\\s+-\\s+.*\\n)+)`, 'gm');
    frontmatter = frontmatter.replace(regex, (match, tagKey, block) => {
      const lines = block.split('\n').filter((l) => l.trim());
      const newLines = [];
      const seen = new Set();
      for (const line of lines) {
        const tag = line.match(/^\s+-\s+(.*)$/)?.[1]?.trim();
        if (!tag) continue;
        const mapped = MAPPINGS[tag] !== undefined ? MAPPINGS[tag] : tag;
        if (mapped === null) {
          changed = true;
          continue;
        }
        if (seen.has(mapped)) continue;
        seen.add(mapped);
        if (mapped !== tag) changed = true;
        newLines.push(`  - ${mapped}`);
      }
      return `${tagKey}:\n${newLines.join('\n')}\n`;
    });
  }

  if (changed) {
    const newText = `---\n${frontmatter}---${text.slice(fmMatch[0].length)}`;
    fs.writeFileSync(filePath, newText, 'utf8');
    console.log(`Normalized ${path.basename(filePath)}`);
  }
}

addNewLexiconCodes();

// Re-load controlled codes after adding new ones
const CONTROLLED2 = loadLexiconCodes();

const files = fs.readdirSync(WORKS_DIR).filter((f) => f.endsWith('.md') && !/readme|audit|draft|notes/i.test(f));
for (const file of files) {
  normalizeWorkFile(path.join(WORKS_DIR, file));
}

// Report remaining ad-hoc tags
const adHoc = new Map();
for (const file of files) {
  const text = fs.readFileSync(path.join(WORKS_DIR, file), 'utf8');
  const fmMatch = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) continue;
  for (const line of fmMatch[1].split('\n')) {
    const tag = line.match(/^\s+-\s+([A-Z_]+)$/)?.[1];
    if (tag && !CONTROLLED2.has(tag)) {
      adHoc.set(tag, (adHoc.get(tag) || 0) + 1);
    }
  }
}

if (adHoc.size > 0) {
  console.log('\nRemaining ad-hoc tags:');
  for (const [tag, count] of [...adHoc.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${tag}: ${count}`);
  }
} else {
  console.log('\nAll work tags are now within controlled vocabulary.');
}
