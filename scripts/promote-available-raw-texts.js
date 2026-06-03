#!/usr/bin/env node

/**
 * Promote available public-domain source texts into Corpus Forge markdown.
 *
 * This fills the gap between raw downloads and the works directory for texts
 * that already have clean, public web sources available.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT_DIR = path.join(__dirname, '..');
const RAW_DIR = path.join(ROOT_DIR, 'raw_downloads/consolidated_texts');
const WORKS_DIR = path.join(ROOT_DIR, 'Corpus Forge/works');
const GUTENBERG_348_URL = 'https://www.gutenberg.org/ebooks/348.txt.utf-8';
const GUTENBERG_10315_URL = 'https://www.gutenberg.org/ebooks/10315.txt.utf-8';
const RIGVEDA_BASE_URL = 'https://philosophy1.narod.ru/www/html/library/asiatica/indica/sruti/rge';

function normalizeText(text) {
  return text
    .replace(/^\uFEFF/, '')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|h1|h2|h3|h4|div|li|tr)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

async function fetchText(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'World Myth Archive local corpus builder',
      },
    });

    if (!response.ok) {
      throw new Error(`Unable to fetch ${url}: ${response.status} ${response.statusText}`);
    }

    return response.text();
  } catch (error) {
    return execFileSync('curl', ['-L', '-s', '--max-time', '120', url], {
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 30,
    });
  }
}

function sectionBetween(text, startMarker, endMarker) {
  const starts = [];
  let cursor = text.indexOf(startMarker);
  while (cursor >= 0) {
    starts.push(cursor);
    cursor = text.indexOf(startMarker, cursor + startMarker.length);
  }

  for (let i = starts.length - 1; i >= 0; i -= 1) {
    const start = starts[i];
    const end = text.indexOf(endMarker, start + startMarker.length);
    if (end > start && end - start > 1000) {
      return normalizeText(text.slice(start, end));
    }
  }

  const start = starts[0] ?? -1;
  if (start < 0) throw new Error(`Missing start marker: ${startMarker}`);
  const end = text.indexOf(endMarker, start + startMarker.length);
  if (end < 0) throw new Error(`Missing end marker: ${endMarker}`);
  return normalizeText(text.slice(start, end));
}

function stripGutenbergContentsAndEndnotes(text) {
  const lines = text.split('\n');
  const totalLines = lines.length;

  // Find first real content heading (skip Contents, Preface, etc.)
  let contentStart = 0;
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (/^BOOK\s+[IVXLCDM]+\.?$/i.test(trimmed) && !/contents/i.test(lines.slice(0, i).join('\n'))) {
      contentStart = i;
      break;
    }
    if (/^ADVENTURE\s+I\b/i.test(trimmed)) {
      contentStart = i;
      break;
    }
    if (/^CHAPTER\s+I\b/i.test(trimmed)) {
      contentStart = i;
      break;
    }
  }

  // Find final endnotes/footnotes (only in last 15% of file)
  let endnotesStart = -1;
  const cutoff = Math.floor(totalLines * 0.85);
  for (let i = cutoff; i < totalLines; i++) {
    if (/^(ENDNOTES|FOOTNOTES):/i.test(lines[i].trim())) {
      endnotesStart = i;
      break;
    }
  }

  const end = endnotesStart >= 0 ? endnotesStart : totalLines;
  return lines.slice(contentStart, end).join('\n');
}

function markdownizeAllCapsHeadings(text) {
  return text
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (/^[IVXLCDM]+\.\s+TO\s+/.test(trimmed)) return `## ${trimmed}`;
      if (/^BOOK\s+[IVXLCDM]+\.?$/i.test(trimmed)) return `## ${trimmed}`;
      if (/^HYMN\s+[IVXLCDM]+\.?\s+/.test(trimmed)) return `## ${trimmed}`;
      if (/^[A-Z][A-Z0-9’' -]{8,}$/.test(trimmed) && !trimmed.startsWith('***')) return `## ${trimmed}`;
      return line;
    })
    .join('\n')
    .trim();
}

function titleCaseHeading(value) {
  const smallWords = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'the', 'to', 'with']);
  return value
    .replace(/\.$/, '')
    .replace(/_+/g, '')
    .replace(/\.?--/g, ' - ')
    .toLowerCase()
    .split(/(\s+|-)/)
    .map((part, index, parts) => {
      if (/^\s+$|-$/.test(part)) return part;
      if (smallWords.has(part) && index !== 0 && index !== parts.length - 1) return part;
      return part.replace(/^([a-zæþðœ])/, (letter) => letter.toUpperCase());
    })
    .join('');
}

function markdownizeBeowulfChapters(text) {
  const lines = text.split('\n');
  const output = [];

  for (let index = 0; index < lines.length; index += 1) {
    const trimmed = lines[index].trim();

    if (/^\[\d+]$/.test(trimmed)) continue;

    const numeral = trimmed.match(/^([IVXLCDM]+)\.$/);
    if (numeral) {
      let titleIndex = index + 1;
      while (titleIndex < lines.length && (!lines[titleIndex].trim() || /^\[\d+]$/.test(lines[titleIndex].trim()))) {
        titleIndex += 1;
      }

      const title = lines[titleIndex]?.trim() || '';
      if (/^[A-Za-zÆÐÞŒæþðœ0-9][A-Za-zÆÐÞŒæþðœ0-9 ._()’'—-]+\.?$/.test(title) && title.length > 4) {
        output.push(`## ${numeral[1]}. ${titleCaseHeading(title)}`);
        index = titleIndex;
        continue;
      }
    }

    output.push(lines[index]);
  }

  return output.join('\n');
}

function markdownizeNibelungenliedAdventures(text) {
  return text
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      const match = trimmed.match(/^ADVENTURE\s+([IVX]+)\.?\s*(.*)$/i);
      if (match) {
        const num = match[1];
        const title = match[2] ? `: ${match[2]}` : '';
        return `## Adventure ${num}${title}`;
      }
      return line;
    })
    .join('\n');
}

function extractBeowulfBody(text) {
  const stripped = stripGutenbergBoilerplate(text);
  const startMatch = stripped.match(/\nBEOWULF\.\s+\nI\.\s+\nTHE LIFE AND DEATH OF SCYLD\./);
  if (!startMatch || startMatch.index === undefined) {
    throw new Error('Unable to find Beowulf poem start');
  }

  const start = startMatch.index + 1;
  const addendaMatch = stripped.slice(start).match(/\nADDENDA\./);
  const end = addendaMatch ? start + addendaMatch.index : stripped.length;

  const body = normalizeText(stripped.slice(start, end))
    .replace(/^BEOWULF\.\s+/, '')
    .split(/\n(?=ADDENDA\.)/)[0]
    .replace(/^\[(\d+)]\s*$/gm, '');

  return markdownizeBeowulfChapters(body).trim();
}

function stripGutenbergBoilerplate(text) {
  const startMatch = text.match(/\*\*\* START OF (?:THE|THIS) PROJECT GUTENBERG EBOOK [^\n]+\*\*\*/i);
  const endMatch = text.match(/\*\*\* END OF (?:THE|THIS) PROJECT GUTENBERG EBOOK [^\n]+\*\*\*/i);
  const start = startMatch ? (startMatch.index || 0) + startMatch[0].length : 0;
  const end = endMatch ? endMatch.index || text.length : text.length;
  return normalizeText(text.slice(start, end));
}

function frontmatter(metadata) {
  function arrayBlock(key, values) {
    return `${key}:\n${values.map((value) => `  - ${value}`).join('\n')}`;
  }

  return `---\n# --- Core Information ---\n\n# Document Identification & Basic Metadata\ndoc_id: ${metadata.docId}\ntitle: "${metadata.title}"\ntitle_original: "${metadata.titleOriginal}"\nculture_group: ${metadata.cultureGroup}\nlanguage_original: ${metadata.languageOriginal}\nsummary: "${metadata.summary}"\n\n# Source & Provenance\nsource_primary:\n  title: "${metadata.primaryTitle}"\n  author: "${metadata.primaryAuthor}"\n  approx_date: "${metadata.approxDate}"\nsource_document:\n  text_title: "${metadata.sourceTitle}"\n  translator_author_editor: "${metadata.translator}"\n  publisher: "${metadata.publisher}"\n  publication_date: ${metadata.publicationDate}\n  url: "${metadata.url}"\n  doi: null\n  notes: "${metadata.notes}"\n\n# Core Categorization Tags\n${arrayBlock('myth_type_tags', metadata.mythTypeTags)}\n\n${arrayBlock('theme_tags', metadata.themeTags)}\n\n# --- Enhanced Information ---\n\n# Deeper Analytical Tags\n${arrayBlock('character_archetype_tags', metadata.characterArchetypeTags)}\n\n${arrayBlock('social_role_tags', metadata.socialRoleTags)}\n\n${arrayBlock('cognitive_function_tags', metadata.cognitiveFunctionTags)}\n\n${arrayBlock('rite_tags', metadata.riteTags)}\n\n${arrayBlock('myth_episode_tags', metadata.mythEpisodeTags)}\n\n# Archive Management\ndate_added: 2026-05-03\nstatus: complete\n---\n\n`;
}

async function ensureGutenbergText() {
  const outputPath = path.join(RAW_DIR, 'Hesiod_Homeric_Hymns_Homerica_Gutenberg_348.txt');
  if (fs.existsSync(outputPath) && fs.statSync(outputPath).size > 100000) {
    return fs.readFileSync(outputPath, 'utf8');
  }

  const text = await fetchText(GUTENBERG_348_URL);
  fs.mkdirSync(RAW_DIR, { recursive: true });
  fs.writeFileSync(outputPath, text, 'utf8');
  return text;
}

async function ensureShahnamehText() {
  const outputPath = path.join(RAW_DIR, 'Persian_Literature_Shahnameh_Gutenberg_10315.txt');
  if (fs.existsSync(outputPath) && fs.statSync(outputPath).size > 100000) {
    return fs.readFileSync(outputPath, 'utf8');
  }

  const text = await fetchText(GUTENBERG_10315_URL);
  fs.mkdirSync(RAW_DIR, { recursive: true });
  fs.writeFileSync(outputPath, text, 'utf8');
  return text;
}

async function promoteTheogony(gutenbergText) {
  const body = markdownizeAllCapsHeadings(sectionBetween(gutenbergText, 'THE THEOGONY', 'THE CATALOGUES OF WOMEN AND EOIAE'));
  const outputPath = path.join(WORKS_DIR, 'Hesiod_Theogony.md');
  const metadata = {
    docId: 'GRK_THEOGONY_HESIOD_EVELYN',
    title: 'Theogony',
    titleOriginal: 'Theogonia',
    cultureGroup: 'Greek',
    languageOriginal: 'grc',
    summary: "Hesiod's account of the origins, genealogies, and succession struggles of the Greek gods, moving from Chaos and Gaia through the Titans to Zeus's ordering of divine sovereignty.",
    primaryTitle: 'Theogony',
    primaryAuthor: 'Hesiod',
    approxDate: 'c. 700 BCE',
    sourceTitle: 'Hesiod, the Homeric Hymns, and Homerica',
    translator: 'Hugh G. Evelyn-White',
    publisher: 'Project Gutenberg / Loeb Classical Library source edition',
    publicationDate: 1914,
    url: GUTENBERG_348_URL,
    notes: 'English public-domain text from Project Gutenberg eBook 348.',
    mythTypeTags: ['MYTHTYPE_THEOGONY', 'MYTHTYPE_COSMOGONY', 'MYTHTYPE_DIVINE_MYTH', 'MYTHTYPE_ETIOLOGICAL'],
    themeTags: ['THM_CREATION', 'THM_ORDER_VS_CHAOS', 'THM_DIVINE_COMBAT', 'THM_SOVEREIGNTY', 'THM_PROPHECY_FATE', 'THM_COSMOLOGY_STRUCTURE'],
    characterArchetypeTags: ['ARCH_SKY_FATHER', 'ARCH_EARTH_MOTHER', 'ARCH_TRICKSTER', 'ARCH_CULTURE_HERO_ARCHETYPE', 'ARCH_SHAPESHIFTER', 'ARCH_SHADOW_ANTAGONIST'],
    socialRoleTags: ['FUNC_SOVEREIGNTY_MAGICAL', 'FUNC_SOVEREIGNTY_PRIESTLY', 'FUNC_COSMIC_ORDERER', 'FUNC_WARRIOR'],
    cognitiveFunctionTags: ['COG_AGENCY_DETECTION', 'COG_GROUP_IDENTITY', 'COG_MORAL_REGULATION', 'COG_MINIMALLY_COUNTERINTUITIVE'],
    riteTags: ['RITE_SACRIFICE', 'RITE_INVOCATION_PRAYER'],
    mythEpisodeTags: ['EP_PRIMORDIAL_CHAOS', 'EP_CREATION_BY_DEITY', 'EP_CREATION_WORLD_PARENTS', 'EP_CREATION_DISMEMBERMENT', 'EP_DIVINE_SUCCESSION', 'EP_MONSTER_SLAYING'],
  };

  fs.writeFileSync(outputPath, `${frontmatter(metadata)}${body}\n`, 'utf8');
  console.log(`Promoted ${path.relative(ROOT_DIR, outputPath)}`);
}

async function promoteHomericHymns(gutenbergText) {
  const body = markdownizeAllCapsHeadings(sectionBetween(gutenbergText, 'THE HOMERIC HYMNS', 'FRAGMENTS OF THE EPIC CYCLE'));
  const outputPath = path.join(WORKS_DIR, 'Homeric_Hymns.md');
  const metadata = {
    docId: 'GRK_HOMERIC_HYMNS_EVELYN',
    title: 'The Homeric Hymns',
    titleOriginal: 'Homerikoi Hymnoi',
    cultureGroup: 'Greek',
    languageOriginal: 'grc',
    summary: 'A collection of ancient Greek hymns honoring major deities including Demeter, Apollo, Hermes, Aphrodite, Dionysus, Artemis, Athena, Poseidon, Helios, Selene, and the Dioscuri.',
    primaryTitle: 'The Homeric Hymns',
    primaryAuthor: 'Anonymous Greek hymnists, traditionally attributed to Homer',
    approxDate: 'c. 7th-5th centuries BCE',
    sourceTitle: 'Hesiod, the Homeric Hymns, and Homerica',
    translator: 'Hugh G. Evelyn-White',
    publisher: 'Project Gutenberg / Loeb Classical Library source edition',
    publicationDate: 1914,
    url: GUTENBERG_348_URL,
    notes: 'English public-domain text from Project Gutenberg eBook 348.',
    mythTypeTags: ['MYTHTYPE_DIVINE_MYTH', 'MYTHTYPE_HYMN_PRAYER', 'MYTHTYPE_ETIOLOGICAL', 'MYTHTYPE_HERO_SAGA_LEGEND'],
    themeTags: ['THM_DIVINE_INTERVENTION_CONFLICT', 'THM_SACRED_MARRIAGE', 'THM_UNDERWORLD_JOURNEY', 'THM_METAMORPHOSIS', 'THM_APOTHEOSIS', 'THM_PROPHECY_FATE'],
    characterArchetypeTags: ['ARCH_SKY_FATHER', 'ARCH_EARTH_MOTHER', 'ARCH_DIVINE_CHILD', 'ARCH_TRICKSTER', 'ARCH_HERALD', 'ARCH_SHAPESHIFTER'],
    socialRoleTags: ['FUNC_SOVEREIGNTY_MAGICAL', 'FUNC_FERTILITY_PROSPERITY', 'FUNC_TRICKSTER_MEDIATOR', 'FUNC_CIVILIZER_CULTURE_HERO', 'FUNC_WARRIOR'],
    cognitiveFunctionTags: ['COG_AGENCY_DETECTION', 'COG_MEMORY_TRANSMISSION', 'COG_GROUP_IDENTITY', 'COG_RITUAL_BINDING_COMMITMENT'],
    riteTags: ['RITE_INVOCATION_PRAYER', 'RITE_SACRIFICE', 'RITE_FESTIVAL', 'RITE_INITIATION'],
    mythEpisodeTags: ['EP_DIVINE_BIRTH', 'EP_UNDERWORLD_JOURNEY', 'EP_CULTURE_BRINGING_GIFT', 'EP_DIVINE_CONFLICT', 'EP_TRICKSTER_THEFT', 'EP_APOTHEOSIS'],
  };

  fs.writeFileSync(outputPath, `${frontmatter(metadata)}${body}\n`, 'utf8');
  console.log(`Promoted ${path.relative(ROOT_DIR, outputPath)}`);
}

async function promoteRigVeda() {
  const rawDir = path.join(RAW_DIR, 'Rig_Veda_Griffith_books');
  fs.mkdirSync(rawDir, { recursive: true });

  const books = [];
  for (let i = 1; i <= 10; i += 1) {
    const fileName = `book${String(i).padStart(2, '0')}.html`;
    const rawPath = path.join(rawDir, fileName);
    let html;

    if (fs.existsSync(rawPath) && fs.statSync(rawPath).size > 50000) {
      html = fs.readFileSync(rawPath, 'utf8');
    } else {
      html = await fetchText(`${RIGVEDA_BASE_URL}/${fileName}`);
      fs.writeFileSync(rawPath, html, 'utf8');
    }

    const text = normalizeText(stripHtml(html))
      .replace(/^\s*The Rig Veda\s*/i, '')
      .replace(/^\s*Ralph T\.H\.Griffith,[\s\S]*?Translator\.?\s*/i, '');
    books.push(`## Book ${i}\n\n${markdownizeAllCapsHeadings(text)}`);
  }

  const outputPath = path.join(WORKS_DIR, 'Rg_Veda.md');
  const metadata = {
    docId: 'VED_RG_VEDA_GRIFFITH',
    title: 'The Rig Veda',
    titleOriginal: 'Rgveda',
    cultureGroup: 'Vedic Indian',
    languageOriginal: 'san',
    summary: 'The oldest Vedic collection of hymns, addressed to deities such as Agni, Indra, Soma, Varuna, Ushas, the Maruts, and the Ashvins, preserving ritual, cosmological, and sacrificial poetry from early Indo-Aryan tradition.',
    primaryTitle: 'Rgveda Samhita',
    primaryAuthor: 'Anonymous Vedic poets and priestly lineages',
    approxDate: 'c. 1500-1200 BCE',
    sourceTitle: 'The Rig Veda',
    translator: 'Ralph T. H. Griffith',
    publisher: 'Public-domain mirror of sacred-texts.com scan',
    publicationDate: 1896,
    url: `${RIGVEDA_BASE_URL}/index.html`,
    notes: 'Second edition Griffith translation; public-domain mirror used because sacred-texts.com blocks automated download.',
    mythTypeTags: ['MYTHTYPE_HYMN_PRAYER', 'MYTHTYPE_DIVINE_MYTH', 'MYTHTYPE_COSMOGONY', 'MYTHTYPE_RITUAL_TEXT', 'MYTHTYPE_ETIOLOGICAL'],
    themeTags: ['THM_CREATION', 'THM_COSMOLOGY_STRUCTURE', 'THM_DIVINE_COMBAT', 'THM_SACRED_MARRIAGE', 'THM_CELESTIAL_PHENOMENA', 'THM_ORDER_VS_CHAOS', 'THM_FIRE_ORIGIN'],
    characterArchetypeTags: ['ARCH_SKY_FATHER', 'ARCH_DIVINE_CHILD', 'ARCH_CULTURE_HERO_ARCHETYPE', 'ARCH_WARRIOR_HERO', 'ARCH_EARTH_MOTHER', 'ARCH_TRICKSTER'],
    socialRoleTags: ['FUNC_SOVEREIGNTY_MAGICAL', 'FUNC_SOVEREIGNTY_PRIESTLY', 'FUNC_WARRIOR', 'FUNC_FERTILITY_PROSPERITY', 'FUNC_COSMIC_ORDERER'],
    cognitiveFunctionTags: ['COG_AGENCY_DETECTION', 'COG_RITUAL_BINDING_COMMITMENT', 'COG_COOPERATION_FACILITATION', 'COG_MEMORY_TRANSMISSION', 'COG_MORAL_REGULATION'],
    riteTags: ['RITE_INVOCATION_PRAYER', 'RITE_SACRIFICE', 'RITE_FIRE_RITUAL', 'RITE_OFFERING', 'RITE_PURIFICATION'],
    mythEpisodeTags: ['EP_CREATION_BY_DEITY', 'EP_DIVINE_COMBAT', 'EP_MONSTER_SLAYING', 'EP_CULTURE_BRINGING_GIFT', 'EP_COSMIC_ORDERING'],
  };

  fs.writeFileSync(outputPath, `${frontmatter(metadata)}${books.join('\n\n')}\n`, 'utf8');
  console.log(`Promoted ${path.relative(ROOT_DIR, outputPath)}`);
}

async function promoteShahnameh(shahnamehText) {
  const body = markdownizeAllCapsHeadings(sectionBetween(shahnamehText, 'THE SHÁH NÁMEH', 'THE RUBÁIYÁT OF OMAR KHAYYÁM'));
  const outputPath = path.join(WORKS_DIR, 'Shahnameh.md');
  const metadata = {
    docId: 'PER_SHAHNAMEH_ATKINSON',
    title: 'The Shah Nameh',
    titleOriginal: 'Shahnameh',
    cultureGroup: 'Persian',
    languageOriginal: 'fas',
    summary: "Ferdowsi's Persian Book of Kings in James Atkinson's public-domain English rendering, presenting mythic and legendary Iranian kings and heroes including Kaiumers, Husheng, Jemshid, Zahhak, Feridun, Zal, Rustem, Sohrab, Siyawush, and Isfandiyar.",
    primaryTitle: 'Shahnameh',
    primaryAuthor: 'Ferdowsi',
    approxDate: 'c. 977-1010 CE',
    sourceTitle: 'The Persian Literature, Comprising The Shah Nameh, The Rubaiyat, The Divan, and The Gulistan, Volume 1',
    translator: 'James Atkinson',
    publisher: 'Project Gutenberg / Colonial Press revised edition source',
    publicationDate: 1909,
    url: GUTENBERG_10315_URL,
    notes: 'Public-domain abridged prose-and-verse English rendering from Project Gutenberg eBook 10315.',
    mythTypeTags: ['MYTHTYPE_HERO_SAGA_LEGEND', 'MYTHTYPE_FOUNDATION', 'MYTHTYPE_DIVINE_MYTH', 'MYTHTYPE_ETIOLOGICAL'],
    themeTags: ['THM_HERO_JOURNEY', 'THM_DIVINE_COMBAT', 'THM_PROPHECY_FATE', 'THM_ORDER_VS_CHAOS', 'THM_GOLDEN_AGE_LOST', 'THM_APOTHEOSIS'],
    characterArchetypeTags: ['ARCH_HERO', 'ARCH_WARRIOR_HERO', 'ARCH_WISE_OLD_MENTOR', 'ARCH_SHADOW_ANTAGONIST', 'ARCH_SOVEREIGN_RULER', 'ARCH_CULTURE_HERO_ARCHETYPE'],
    socialRoleTags: ['FUNC_WARRIOR', 'FUNC_SOVEREIGNTY_MAGICAL', 'FUNC_SOVEREIGNTY_PRIESTLY', 'FUNC_CIVILIZER_CULTURE_HERO', 'FUNC_COSMIC_ORDERER'],
    cognitiveFunctionTags: ['COG_GROUP_IDENTITY', 'COG_STATUS_HIERARCHY_LEGITIMATION', 'COG_MORAL_REGULATION', 'COG_MEMORY_TRANSMISSION', 'COG_THREAT_ANXIETY_MANAGEMENT'],
    riteTags: ['RITE_ENTHRONEMENT', 'RITE_FUNERAL', 'RITE_DIVINATION', 'RITE_SACRIFICE'],
    mythEpisodeTags: ['EP_HEROIC_QUEST', 'EP_MONSTER_SLAYING', 'EP_DIVINE_CONFLICT', 'EP_CULTURE_BRINGING_GIFT', 'EP_DIVINE_SUCCESSION'],
  };

  fs.writeFileSync(outputPath, `${frontmatter(metadata)}${body}\n`, 'utf8');
  console.log(`Promoted ${path.relative(ROOT_DIR, outputPath)}`);
}

const EXTRA_GUTENBERG_WORKS = [
  {
    ebook: 2199,
    fileName: 'Iliad.md',
    rawName: 'Iliad_Butler_Gutenberg_2199.txt',
    docId: 'GRK_ILIAD_BUTLER',
    title: 'The Iliad',
    titleOriginal: 'Ilias',
    cultureGroup: 'Greek',
    languageOriginal: 'grc',
    summary: "Homer's epic of wrath, honor, divine intervention, heroic warfare, mortality, and grief during the Trojan War, centered on Achilles, Hector, Agamemnon, Patroclus, Priam, and the gods.",
    primaryTitle: 'Iliad',
    primaryAuthor: 'Homer',
    approxDate: 'c. 8th century BCE',
    sourceTitle: 'The Iliad',
    translator: 'Samuel Butler',
    publisher: 'Project Gutenberg',
    publicationDate: 1898,
    notes: 'Public-domain prose translation from Project Gutenberg eBook 2199.',
    mythTypeTags: ['MYTHTYPE_HERO_SAGA_LEGEND', 'MYTHTYPE_DIVINE_MYTH', 'MYTHTYPE_ETIOLOGICAL'],
    themeTags: ['THM_HERO_JOURNEY', 'THM_DIVINE_COMBAT', 'THM_DEATH_ORIGIN', 'THM_PROPHECY_FATE', 'THM_ORDER_VS_CHAOS'],
    characterArchetypeTags: ['ARCH_HERO', 'ARCH_WARRIOR_HERO', 'ARCH_SHADOW_ANTAGONIST', 'ARCH_WISE_OLD_MENTOR', 'ARCH_HERALD'],
    socialRoleTags: ['FUNC_WARRIOR', 'FUNC_SOVEREIGNTY_PRIESTLY', 'FUNC_SOVEREIGNTY_MAGICAL'],
    cognitiveFunctionTags: ['COG_GROUP_IDENTITY', 'COG_STATUS_HIERARCHY_LEGITIMATION', 'COG_MORAL_REGULATION', 'COG_THREAT_ANXIETY_MANAGEMENT'],
    riteTags: ['RITE_FUNERAL', 'RITE_SACRIFICE', 'RITE_DIVINATION', 'RITE_OATH_VOW'],
    mythEpisodeTags: ['EP_HEROIC_QUEST', 'EP_DIVINE_CONFLICT', 'EP_MONSTER_SLAYING', 'EP_ORACULAR_GUIDANCE']
  },
  {
    ebook: 1727,
    fileName: 'Odyssey.md',
    rawName: 'Odyssey_Butler_Gutenberg_1727.txt',
    docId: 'GRK_ODYSSEY_BUTLER',
    title: 'The Odyssey',
    titleOriginal: 'Odysseia',
    cultureGroup: 'Greek',
    languageOriginal: 'grc',
    summary: "Homer's epic of Odysseus' return from Troy, including sea journeys, monsters, divine opposition, trickery, hospitality, recognition, and restoration of household sovereignty.",
    primaryTitle: 'Odyssey',
    primaryAuthor: 'Homer',
    approxDate: 'c. 8th century BCE',
    sourceTitle: 'The Odyssey',
    translator: 'Samuel Butler',
    publisher: 'Project Gutenberg',
    publicationDate: 1900,
    notes: 'Public-domain prose translation from Project Gutenberg eBook 1727.',
    mythTypeTags: ['MYTHTYPE_HERO_SAGA_LEGEND', 'MYTHTYPE_DIVINE_MYTH', 'MYTHTYPE_TRICKSTER_NARRATIVE'],
    themeTags: ['THM_HERO_JOURNEY', 'THM_TRICKSTER_CYCLE', 'THM_UNDERWORLD_JOURNEY', 'THM_METAMORPHOSIS', 'THM_PROPHECY_FATE'],
    characterArchetypeTags: ['ARCH_TRICKSTER', 'ARCH_HERO', 'ARCH_WISE_OLD_MENTOR', 'ARCH_SHAPESHIFTER', 'ARCH_THRESHOLD_GUARDIAN'],
    socialRoleTags: ['FUNC_TRICKSTER_MEDIATOR', 'FUNC_WARRIOR', 'FUNC_SOVEREIGNTY_PRIESTLY'],
    cognitiveFunctionTags: ['COG_AGENCY_DETECTION', 'COG_MORAL_REGULATION', 'COG_GROUP_IDENTITY', 'COG_MINIMALLY_COUNTERINTUITIVE'],
    riteTags: ['RITE_FUNERAL', 'RITE_SACRIFICE', 'RITE_PURIFICATION', 'RITE_OATH_VOW'],
    mythEpisodeTags: ['EP_HEROIC_QUEST', 'EP_UNDERWORLD_JOURNEY', 'EP_MONSTER_SLAYING', 'EP_TRICKSTER_THEFT', 'EP_OTHERWORLDLY_JOURNEY']
  },
  {
    ebook: 228,
    fileName: 'Aeneid.md',
    rawName: 'Aeneid_Dryden_Gutenberg_228.txt',
    docId: 'ROM_AENEID_DRYDEN',
    title: 'The Aeneid',
    titleOriginal: 'Aeneis',
    cultureGroup: 'Roman',
    languageOriginal: 'lat',
    summary: "Virgil's Roman national epic of Aeneas' flight from Troy, underworld descent, divine fate, conflict in Italy, and the mythic foundation of Roman destiny.",
    primaryTitle: 'Aeneid',
    primaryAuthor: 'Virgil',
    approxDate: '29-19 BCE',
    sourceTitle: 'The Aeneid',
    translator: 'John Dryden',
    publisher: 'Project Gutenberg',
    publicationDate: 1697,
    notes: 'Public-domain verse translation from Project Gutenberg eBook 228.',
    mythTypeTags: ['MYTHTYPE_FOUNDATION', 'MYTHTYPE_HERO_SAGA_LEGEND', 'MYTHTYPE_DIVINE_MYTH'],
    themeTags: ['THM_HERO_JOURNEY', 'THM_UNDERWORLD_JOURNEY', 'THM_PROPHECY_FATE', 'THM_SACRED_MARRIAGE', 'THM_ORDER_VS_CHAOS'],
    characterArchetypeTags: ['ARCH_HERO', 'ARCH_SOVEREIGN_RULER', 'ARCH_WISE_OLD_MENTOR', 'ARCH_TRANSFORMATIVE_FEMININE'],
    socialRoleTags: ['FUNC_CIVILIZER_CULTURE_HERO', 'FUNC_WARRIOR', 'FUNC_SOVEREIGNTY_MAGICAL', 'FUNC_COSMIC_ORDERER'],
    cognitiveFunctionTags: ['COG_GROUP_IDENTITY', 'COG_STATUS_HIERARCHY_LEGITIMATION', 'COG_MORAL_REGULATION', 'COG_THREAT_ANXIETY_MANAGEMENT'],
    riteTags: ['RITE_FUNERAL', 'RITE_DIVINATION', 'RITE_SACRIFICE', 'RITE_FOUNDATION'],
    mythEpisodeTags: ['EP_HEROIC_QUEST', 'EP_UNDERWORLD_JOURNEY', 'EP_DIVINE_CONFLICT', 'EP_ORACULAR_GUIDANCE', 'EP_CULTURE_BRINGING_GIFT']
  },
  {
    ebook: 830,
    fileName: 'Argonautica.md',
    rawName: 'Argonautica_Seaton_Gutenberg_830.txt',
    docId: 'GRK_ARGONAUTICA_SEATON',
    title: 'The Argonautica',
    titleOriginal: 'Argonautika',
    cultureGroup: 'Greek',
    languageOriginal: 'grc',
    summary: "Apollonius Rhodius' Hellenistic epic of Jason, Medea, the Argonauts, the Golden Fleece, divine schemes, sea travel, heroic tests, and magical aid.",
    primaryTitle: 'Argonautica',
    primaryAuthor: 'Apollonius Rhodius',
    approxDate: 'c. 3rd century BCE',
    sourceTitle: 'The Argonautica',
    translator: 'R. C. Seaton',
    publisher: 'Project Gutenberg',
    publicationDate: 1912,
    notes: 'Public-domain Loeb translation from Project Gutenberg eBook 830.',
    mythTypeTags: ['MYTHTYPE_HERO_SAGA_LEGEND', 'MYTHTYPE_DIVINE_MYTH', 'MYTHTYPE_ETIOLOGICAL'],
    themeTags: ['THM_HERO_JOURNEY', 'THM_SACRED_MARRIAGE', 'THM_TRICKSTER_CYCLE', 'THM_DIVINE_COMBAT', 'THM_PROPHECY_FATE'],
    characterArchetypeTags: ['ARCH_HERO', 'ARCH_TRANSFORMATIVE_FEMININE', 'ARCH_TRICKSTER', 'ARCH_THRESHOLD_GUARDIAN'],
    socialRoleTags: ['FUNC_WARRIOR', 'FUNC_TRICKSTER_MEDIATOR', 'FUNC_CIVILIZER_CULTURE_HERO'],
    cognitiveFunctionTags: ['COG_GROUP_IDENTITY', 'COG_COOPERATION_FACILITATION', 'COG_MINIMALLY_COUNTERINTUITIVE', 'COG_AGENCY_DETECTION'],
    riteTags: ['RITE_SACRIFICE', 'RITE_DIVINATION', 'RITE_INITIATION', 'RITE_OATH_VOW'],
    mythEpisodeTags: ['EP_HEROIC_QUEST', 'EP_MONSTER_SLAYING', 'EP_TRICKSTER_THEFT', 'EP_OTHERWORLDLY_JOURNEY']
  },
  {
    ebook: 16328,
    fileName: 'Beowulf.md',
    rawName: 'Beowulf_Hall_Gutenberg_16328.txt',
    docId: 'ANG_BEOWULF_HALL',
    title: 'Beowulf',
    titleOriginal: 'Beowulf',
    cultureGroup: 'Anglo-Saxon',
    languageOriginal: 'ang',
    summary: 'Old English heroic epic of Beowulf, Grendel, Grendel’s mother, the dragon, lordship, feud, gift-giving, monster combat, fame, death, and the fragility of heroic order.',
    primaryTitle: 'Beowulf',
    primaryAuthor: 'Unknown Anglo-Saxon poet',
    approxDate: 'c. 8th-11th centuries CE',
    sourceTitle: 'Beowulf',
    translator: 'Jno. Lesslie Hall',
    publisher: 'Project Gutenberg',
    publicationDate: 1892,
    notes: 'Public-domain Jno. Lesslie Hall translation from Project Gutenberg eBook 16328.',
    bodyExtractor: extractBeowulfBody,
    mythTypeTags: ['MYTHTYPE_HERO_SAGA_LEGEND', 'MYTHTYPE_MONSTER_LEGEND', 'MYTHTYPE_FOUNDATION'],
    themeTags: ['THM_HERO_JOURNEY', 'THM_DIVINE_COMBAT', 'THM_DEATH_ORIGIN', 'THM_ORDER_VS_CHAOS', 'THM_PROPHECY_FATE'],
    characterArchetypeTags: ['ARCH_HERO', 'ARCH_SHADOW_ANTAGONIST', 'ARCH_SOVEREIGN_RULER', 'ARCH_THRESHOLD_GUARDIAN'],
    socialRoleTags: ['FUNC_WARRIOR', 'FUNC_SOVEREIGNTY_PRIESTLY', 'FUNC_GROUP_IDENTITY'],
    cognitiveFunctionTags: ['COG_GROUP_IDENTITY', 'COG_STATUS_HIERARCHY_LEGITIMATION', 'COG_THREAT_ANXIETY_MANAGEMENT', 'COG_MORAL_REGULATION'],
    riteTags: ['RITE_FUNERAL', 'RITE_FEAST', 'RITE_OATH_VOW'],
    mythEpisodeTags: ['EP_MONSTER_SLAYING', 'EP_HEROIC_QUEST', 'EP_DIVINE_CONFLICT']
  },
  {
    ebook: 1151,
    fileName: 'Nibelungenlied.md',
    rawName: 'Nibelungenlied_Gutenberg_1151.txt',
    docId: 'GER_NIBELUNGENLIED',
    title: 'The Nibelungenlied',
    titleOriginal: 'Nibelungenlied',
    cultureGroup: 'Germanic',
    languageOriginal: 'gmh',
    summary: 'Middle High German heroic epic of Siegfried, Kriemhild, Brunhild, Hagen, dragon treasure, marriage politics, betrayal, revenge, and dynastic catastrophe.',
    primaryTitle: 'Nibelungenlied',
    primaryAuthor: 'Unknown Middle High German poet',
    approxDate: 'c. 1200 CE',
    sourceTitle: 'The Nibelungenlied',
    translator: 'Daniel B. Shumway',
    publisher: 'Project Gutenberg',
    publicationDate: 1909,
    notes: 'Public-domain translation from Project Gutenberg eBook 1151.',
    mythTypeTags: ['MYTHTYPE_HERO_SAGA_LEGEND', 'MYTHTYPE_FOUNDATION'],
    themeTags: ['THM_HERO_JOURNEY', 'THM_DEATH_ORIGIN', 'THM_PROPHECY_FATE', 'THM_ORDER_VS_CHAOS'],
    characterArchetypeTags: ['ARCH_SHADOW_FIGURE', 'ARCH_SOVEREIGN_RULER'],
    socialRoleTags: ['FUNC_WARRIOR', 'FUNC_SOVEREIGNTY_PRIESTLY', 'FUNC_FERTILITY_PROSPERITY'],
    cognitiveFunctionTags: ['COG_GROUP_IDENTITY', 'COG_STATUS_HIERARCHY_LEGITIMATION', 'COG_MORAL_REGULATION', 'COG_THREAT_ANXIETY_MANAGEMENT'],
    riteTags: ['RITE_MARRIAGE', 'RITE_FUNERAL', 'RITE_OATH_VOW', 'RITE_FEAST'],
    mythEpisodeTags: ['EP_HEROIC_QUEST', 'EP_MONSTER_SLAYING', 'EP_THEOMACHY'],
    bodyExtractor(text) {
      return markdownizeNibelungenliedAdventures(
        stripGutenbergContentsAndEndnotes(stripGutenbergBoilerplate(text))
      );
    }
  },
  {
    ebook: 1152,
    fileName: 'Volsunga_Saga.md',
    rawName: 'Volsunga_Saga_Gutenberg_1152.txt',
    docId: 'NORSE_VOLSUNGA_SAGA_MAGNUSSON_MORRIS',
    title: 'The Story of the Volsungs',
    titleOriginal: 'Volsunga Saga',
    cultureGroup: 'Norse',
    languageOriginal: 'non',
    summary: 'Legendary Norse saga of the Volsung lineage, Sigurd, Brynhild, Gudrun, dragon-slaying, cursed treasure, vengeance, oaths, heroic fate, and dynastic ruin.',
    primaryTitle: 'Volsunga Saga',
    primaryAuthor: 'Unknown Icelandic saga compiler',
    approxDate: 'c. 13th century CE',
    sourceTitle: 'The Story of the Volsungs',
    translator: 'Eiríkr Magnússon and William Morris',
    publisher: 'Project Gutenberg',
    publicationDate: 1888,
    notes: 'Public-domain translation from Project Gutenberg eBook 1152.',
    mythTypeTags: ['MYTHTYPE_HERO_SAGA_LEGEND', 'MYTHTYPE_MONSTER_LEGEND', 'MYTHTYPE_DIVINE_MYTH'],
    themeTags: ['THM_HERO_JOURNEY', 'THM_PROPHECY_FATE', 'THM_DIVINE_COMBAT', 'THM_DEATH_ORIGIN', 'THM_GOLDEN_AGE_LOST'],
    characterArchetypeTags: ['ARCH_HERO', 'ARCH_SHADOW_ANTAGONIST', 'ARCH_WISE_OLD_MENTOR', 'ARCH_TRANSFORMATIVE_FEMININE'],
    socialRoleTags: ['FUNC_WARRIOR', 'FUNC_SOVEREIGNTY_MAGICAL', 'FUNC_TRICKSTER_MEDIATOR'],
    cognitiveFunctionTags: ['COG_GROUP_IDENTITY', 'COG_STATUS_HIERARCHY_LEGITIMATION', 'COG_MORAL_REGULATION', 'COG_THREAT_ANXIETY_MANAGEMENT'],
    riteTags: ['RITE_OATH_VOW', 'RITE_FUNERAL', 'RITE_DIVINATION', 'RITE_MARRIAGE'],
    mythEpisodeTags: ['EP_HEROIC_QUEST', 'EP_MONSTER_SLAYING', 'EP_ORACULAR_GUIDANCE', 'EP_DIVINE_CONFLICT']
  }
];

async function promoteGutenbergWork(work) {
  const url = `https://www.gutenberg.org/ebooks/${work.ebook}.txt.utf-8`;
  const rawPath = path.join(RAW_DIR, work.rawName);
  let text;

  if (fs.existsSync(rawPath) && fs.statSync(rawPath).size > 50000) {
    text = fs.readFileSync(rawPath, 'utf8');
  } else {
    text = await fetchText(url);
    fs.mkdirSync(RAW_DIR, { recursive: true });
    fs.writeFileSync(rawPath, text, 'utf8');
  }

  const body = work.bodyExtractor
    ? work.bodyExtractor(text)
    : markdownizeAllCapsHeadings(stripGutenbergContentsAndEndnotes(stripGutenbergBoilerplate(text)));
  const outputPath = path.join(WORKS_DIR, work.fileName);
  const metadata = {
    ...work,
    url,
  };

  fs.writeFileSync(outputPath, `${frontmatter(metadata)}${body}\n`, 'utf8');
  console.log(`Promoted ${path.relative(ROOT_DIR, outputPath)}`);
}

async function main() {
  fs.mkdirSync(WORKS_DIR, { recursive: true });
  const gutenbergText = await ensureGutenbergText();
  const shahnamehText = await ensureShahnamehText();

  await promoteTheogony(gutenbergText);
  await promoteHomericHymns(gutenbergText);
  await promoteRigVeda();
  await promoteShahnameh(shahnamehText);
  for (const work of EXTRA_GUTENBERG_WORKS) {
    await promoteGutenbergWork(work);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
