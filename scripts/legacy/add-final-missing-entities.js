#!/usr/bin/env node
/**
 * Add remaining missing entities to CSV with proper metadata.
 * Uses a robust CSV parser/serializer.
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

const newFigures = [
  { figure_id: 'FIG_KAIKEYI_IND', preferred_name: 'Kaikeyi', figure_type: 'Queen', culture_group: 'Indian', domains: 'Motherhood;Jealousy;Exile', alternate_names: '', description_brief: 'Queen of Ayodhya and mother of Bharata; her scheming causes Rama\'s exile.', notes: 'Wife of Dasharatha. Step-mother of Rama.', works_appeared_in: 'IND_RAMAYANA_GRIFFITH', character_archetype_tags: 'ARCH_SHADOW_FIGURE', function_tags: 'FUNC_SOVEREIGNTY_GODDESS', cognitive_function_tags: 'COG_MORAL_REGULATION' },
  { figure_id: 'FIG_GERAINT_WELSH', preferred_name: 'Geraint', figure_type: 'Hero', culture_group: 'Welsh', domains: 'Love;Knighthood;Tournament', alternate_names: '', description_brief: 'Welsh hero and knight of Arthur\'s court whose devotion to Enid is tested.', notes: 'Son of Erbin. Husband of Enid. Central figure in Geraint and Enid.', works_appeared_in: 'WELSH_MABINOGION_GUEST', character_archetype_tags: 'ARCH_HERO', function_tags: 'FUNC_WARRIOR', cognitive_function_tags: 'COG_GROUP_IDENTITY' },
  { figure_id: 'FIG_OWAIN_WELSH', preferred_name: 'Owain', figure_type: 'Knight', culture_group: 'Welsh', domains: 'Chivalry;Adventure;Marriage', alternate_names: 'Yvain;Ywain', description_brief: 'Knight of the Round Table who wins the hand of the Lady of the Fountain.', notes: 'Son of Urien. Central figure in The Lady of the Fountain.', works_appeared_in: 'WELSH_MABINOGION_GUEST', character_archetype_tags: 'ARCH_HERO', function_tags: 'FUNC_WARRIOR', cognitive_function_tags: 'COG_GROUP_IDENTITY' },
  { figure_id: 'FIG_KILHWCH_WELSH', preferred_name: 'Culhwch', figure_type: 'Hero', culture_group: 'Welsh', domains: 'Quest;Love;Giant-slaying', alternate_names: 'Kilhwch', description_brief: 'Hero who seeks to marry Olwen and must complete impossible tasks set by her father.', notes: 'Son of Cilydd. Cousin of Arthur.', works_appeared_in: 'WELSH_MABINOGION_GUEST', character_archetype_tags: 'ARCH_HERO', function_tags: 'FUNC_WARRIOR', cognitive_function_tags: 'COG_GROUP_IDENTITY' },
  { figure_id: 'FIG_LAEG_IRISH', preferred_name: 'Láeg', figure_type: 'Charioteer', culture_group: 'Irish', domains: 'Loyalty;Combat;Speed', alternate_names: 'Laeg;Loeg', description_brief: 'Faithful charioteer of Cú Chulainn who drives him into battle.', notes: 'Constant companion to Cú Chulainn.', works_appeared_in: 'IRISH_TAIN_BO_CUAILNGE_FARADAY', character_archetype_tags: 'ARCH_LOYAL_COMPANION', function_tags: 'FUNC_WARRIOR', cognitive_function_tags: 'COG_COOPERATION_FACILITATION' },
  { figure_id: 'FIG_ARIANROD_WELSH', preferred_name: 'Arianrod', figure_type: 'Goddess', culture_group: 'Welsh', domains: 'Birth;Fate;Magic;Sky', alternate_names: 'Arianrhod', description_brief: 'Goddess of birth and fate who places a tynged (fate) on her son Lleu.', notes: 'Daughter of Dôn. Mother of Lleu and Dylan. Central to Math fab Mathonwy.', works_appeared_in: 'WELSH_MABINOGION_GUEST', character_archetype_tags: 'ARCH_FATE_WEAVER', function_tags: 'FUNC_SOVEREIGNTY_GODDESS', cognitive_function_tags: 'COG_STATUS_HIERARCHY_LEGITIMATION' },
  { figure_id: 'FIG_CORMAC_COND_LONGAS_IRISH', preferred_name: 'Cormac Cond Longas', figure_type: 'Exile;Prince', culture_group: 'Irish', domains: 'Exile;Loyalty;Kingship', alternate_names: '', description_brief: 'Exiled son of Conchobar who sides with Medb in the Táin.', notes: 'Son of Conchobar. Exiled Ulster prince.', works_appeared_in: 'IRISH_TAIN_BO_CUAILNGE_FARADAY', character_archetype_tags: 'ARCH_TRAGIC_FIGURE', function_tags: 'FUNC_SOVEREIGNTY_MAGICAL', cognitive_function_tags: 'COG_STATUS_HIERARCHY_LEGITIMATION' },
  { figure_id: 'FIG_JIMMU_JPN', preferred_name: 'Jimmu', figure_type: 'Emperor', culture_group: 'Japanese', domains: 'Imperial descent;Conquest;Founding', alternate_names: 'Kamu-yamato-ihare-biko;Divine-Yamato-Ihare-Prince', description_brief: 'Legendary first emperor of Japan and descendant of Amaterasu.', notes: 'Mythic founder of the imperial line.', works_appeared_in: 'JPN_KOJIKI_CHAMBERLAIN', character_archetype_tags: 'ARCH_FOUNDING_ANCESTOR', function_tags: 'FUNC_SOVEREIGNTY_MAGICAL', cognitive_function_tags: 'COG_STATUS_HIERARCHY_LEGITIMATION' },
  { figure_id: 'FIG_YMIR_NORSE', preferred_name: 'Ymir', figure_type: 'Primordial Giant', culture_group: 'Norse', domains: 'Creation;Chaos;Ice;Death', alternate_names: 'Aurgelmir', description_brief: 'Primordial giant from whose body the world was created.', notes: 'First being in Norse cosmogony. Killed by Odin and his brothers.', works_appeared_in: 'NORSE_PROSE_EDDA_BRODEUR', character_archetype_tags: 'ARCH_PRIMORDIAL_ANTAGONIST', function_tags: 'FUNC_CREATOR_DEMIURGE', cognitive_function_tags: 'COG_INTUITIVE_ONTOLOGY_MANIPULATION' },
  { figure_id: 'FIG_CERIDWEN_WELSH', preferred_name: 'Ceridwen', figure_type: 'Witch;Poet', culture_group: 'Welsh', domains: 'Inspiration;Transformation;Wisdom', alternate_names: '', description_brief: 'Enchantress who brews a potion of wisdom and pursues the boy Gwion Bach.', notes: 'Mother of Afagddu. Her cauldron grants poetic inspiration.', works_appeared_in: 'WELSH_MABINOGION_GUEST', character_archetype_tags: 'ARCH_WITCH_SORCERESS', function_tags: 'FUNC_MAGICIAN_MEDIATOR', cognitive_function_tags: 'COG_INTUITIVE_ONTOLOGY_MANIPULATION' },
  { figure_id: 'FIG_APEP_EGY', preferred_name: 'Apep', figure_type: 'Serpent;Chaos', culture_group: 'Egyptian', domains: 'Chaos;Darkness;Destruction', alternate_names: 'Apophis', description_brief: 'Giant serpent of chaos who attacks Ra nightly.', notes: 'Enemy of Maat and cosmic order. Defeated by Set or Ra.', works_appeared_in: 'EGY_BOOK_DEAD_BUDGE;EGY_PYRAMID_TEXTS_MERCER', character_archetype_tags: 'ARCH_SHADOW_FIGURE', function_tags: 'FUNC_ANTAGONIST_OBSTRUCTER', cognitive_function_tags: 'COG_THREAT_ANXIETY_MANAGEMENT' },
  { figure_id: 'DEITY_MUMMU_MES', preferred_name: 'Mummu', figure_type: 'Deity;Chaos', culture_group: 'Mesopotamian', domains: 'Chaos;Chaos mist;Vacuum', alternate_names: '', description_brief: 'Personification of primordial chaos mist and advisor to Apsu.', notes: 'Son of Apsu and Tiamat. Captured by Ea.', works_appeared_in: 'AKK_ENUMA_ELIS_KING', character_archetype_tags: 'ARCH_SHADOW_FIGURE', function_tags: 'FUNC_CREATOR_DEMIURGE', cognitive_function_tags: 'COG_INTUITIVE_ONTOLOGY_MANIPULATION' },
  { figure_id: 'FIG_LUG_IRISH', preferred_name: 'Lug', figure_type: 'Deity;Hero', culture_group: 'Irish', domains: 'Skill;Kingship;Sorcery;War', alternate_names: 'Lugh', description_brief: 'Many-skilled god of light and crafts, king of the Tuatha Dé Danann.', notes: 'Samildánach (master of all arts). Father of Cú Chulainn.', works_appeared_in: 'IRISH_TAIN_BO_CUAILNGE_FARADAY', character_archetype_tags: 'ARCH_CULTURE_HERO_ARCHETYPE', function_tags: 'FUNC_WARRIOR', cognitive_function_tags: 'COG_AGENCY_DETECTION' },
];

const newCreatures = [];

for (const row of newFigures) {
  if (!csvIds.has(row.figure_id)) {
    figs.push(row);
  }
}
for (const row of newCreatures) {
  if (!csvIds.has(row.creature_id)) {
    crts.push(row);
  }
}

const figHeaders = ['figure_id','preferred_name','figure_type','culture_group','domains','alternate_names','description_brief','notes','works_appeared_in','character_archetype_tags','function_tags','cognitive_function_tags'];
const crtHeaders = ['creature_id','preferred_name','culture_group','creature_type','description_brief','symbolism_roles','alternate_names','notes','works_appeared_in'];

fs.writeFileSync(FIGURES_FILE, serializeCsv(figHeaders, figs), 'utf8');
fs.writeFileSync(CREATURES_FILE, serializeCsv(crtHeaders, crts), 'utf8');

console.log('Added ' + newFigures.length + ' figures and ' + newCreatures.length + ' creatures.');
