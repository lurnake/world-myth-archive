#!/usr/bin/env node
const fs = require('fs');

const FIGURES_FILE = 'Corpus Forge/lexicons/key_figures.csv';
const CREATURES_FILE = 'Corpus Forge/lexicons/creatures.csv';

function parseCsv(content) {
  const lines = content.split('\n').filter(l => l.trim());
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const fields = [];
    let field = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      const next = line[i + 1];
      if (ch === '"') {
        if (inQuotes && next === '"') { field += '"'; i++; }
        else { inQuotes = !inQuotes; }
      } else if (ch === ',' && !inQuotes) {
        fields.push(field.trim());
        field = '';
      } else {
        field += ch;
      }
    }
    fields.push(field.trim());
    const row = {};
    headers.forEach((h, i) => { row[h] = fields[i] || ''; });
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
const byId = new Set([...figs.map(f => f.figure_id), ...crts.map(c => c.creature_id)]);

const toAdd = [
  { id: 'FIG_CREUSA_ROM', name: 'Creusa', type: 'Princess', culture: 'Trojan', domains: 'Marriage;Loss;Trojan women', aliases: '', desc: 'First wife of Aeneas who dies fleeing Troy.', notes: 'Daughter of Priam.', works: 'ROM_AENEID_DRYDEN', arch: '', func: '', cog: '' },
  { id: 'FIG_SIBYL_CUMAE_ROM', name: 'Sibyl of Cumae', type: 'Prophetess', culture: 'Roman', domains: 'Prophecy;Underworld guide', aliases: 'Sibyl', desc: 'Prophetess who guides Aeneas to the underworld.', notes: 'Guardian of the golden bough.', works: 'ROM_AENEID_DRYDEN', arch: 'ARCH_WISE_OLD_MENTOR', func: 'FUNC_ORACLE_PROPHET_FUNCTION', cog: 'COG_MEMORY_TRANSMISSION' },
  { id: 'FIG_MERCURY_ROM', name: 'Mercury', type: 'Deity', culture: 'Roman', domains: 'Messenger;Commerce;Travel', aliases: 'Hermes', desc: 'Roman messenger god.', notes: 'Guides souls to the underworld.', works: 'ROM_AENEID_DRYDEN;ROM_METAMORPHOSES_OVID_MORE', arch: 'ARCH_HERALD', func: 'FUNC_PSYCHOPOMP', cog: 'COG_AGENCY_DETECTION' },
  { id: 'FIG_POLYDEUCES_GRK', name: 'Polydeuces', type: 'Hero', culture: 'Greek', domains: 'Boxing;Brotherhood;Immortality', aliases: 'Pollux', desc: 'Divine twin brother of Castor.', notes: 'Son of Zeus and Leda.', works: 'GRK_ARGONAUTICA_SEATON', arch: 'ARCH_HERO', func: 'FUNC_WARRIOR', cog: 'COG_GROUP_IDENTITY' },
  { id: 'FIG_MOPSUS_GRK', 'name': 'Mopsus', type: 'Seer', culture: 'Greek', domains: 'Divination;Prophecy;Argonaut', aliases: '', desc: 'Prophetic seer among the Argonauts.', notes: 'Son of Ampyx.', works: 'GRK_ARGONAUTICA_SEATON', arch: 'ARCH_WISE_OLD_MENTOR', func: 'FUNC_ORACLE_PROPHET_FUNCTION', cog: 'COG_MEMORY_TRANSMISSION' },
  { id: 'FIG_PELEUS_GRK', name: 'Peleus', type: 'Hero', culture: 'Greek', domains: 'Fatherhood;Wedding;Achilles', aliases: '', desc: 'Father of Achilles and husband of Thetis.', notes: 'Son of Aeacus.', works: 'GRK_ILIAD_BUTLER;GRK_ARGONAUTICA_SEATON', arch: '', func: '', cog: '' },
  { id: 'FIG_CASTOR_GRK', name: 'Castor', type: 'Hero', culture: 'Greek', domains: 'Horsemanship;Brotherhood;Mortal twin', aliases: '', desc: 'Mortal twin brother of Polydeuces.', notes: 'Son of Tyndareus and Leda.', works: 'GRK_ARGONAUTICA_SEATON', arch: 'ARCH_HERO', func: 'FUNC_WARRIOR', cog: 'COG_GROUP_IDENTITY' },
  { id: 'FIG_IDMON_GRK', name: 'Idmon', type: 'Seer', culture: 'Greek', domains: 'Divination;Prophecy;Argonaut', aliases: '', desc: 'Prophetic seer among the Argonauts who foresees his own death.', notes: 'Son of Apollo.', works: 'GRK_ARGONAUTICA_SEATON', arch: 'ARCH_WISE_OLD_MENTOR', func: 'FUNC_ORACLE_PROPHET_FUNCTION', cog: 'COG_MEMORY_TRANSMISSION' },
  { id: 'FIG_HILDEBURH_ANG', name: 'Hildeburh', type: 'Queen', culture: 'Anglo-Saxon', domains: 'Marriage;Grief;Kin-slaying', aliases: '', desc: 'Danish princess married to Finn whose son and brother die in battle.', notes: 'Her tragedy is sung by the scop in Heorot.', works: 'ANG_BEOWULF_HALL', arch: 'ARCH_TRAGIC_FIGURE', func: 'FUNC_KINSHIP_MEDIATOR', cog: 'COG_THREAT_ANXIETY_MANAGEMENT' },
  { id: 'FIG_HNAEF_ANG', name: 'Hnæf', type: 'Prince', culture: 'Anglo-Saxon', domains: 'Battle;Loyalty;Death', aliases: '', desc: 'Danish prince killed in the Finnsburg episode.', notes: 'Brother of Hildeburh.', works: 'ANG_BEOWULF_HALL', arch: 'ARCH_WARRIOR_HERO', func: 'FUNC_WARRIOR', cog: 'COG_GROUP_IDENTITY' },
  { id: 'FIG_HENGEST_ANG', name: 'Hengest', type: 'Warrior', culture: 'Anglo-Saxon', domains: 'Vengeance;Exile;Leadership', aliases: '', desc: 'Jutish warrior who avenges Hnæf\'s death.', notes: 'Takes over leadership after Hnæf\'s fall.', works: 'ANG_BEOWULF_HALL', arch: 'ARCH_WARRIOR_HERO', func: 'FUNC_WARRIOR', cog: 'COG_THREAT_ANXIETY_MANAGEMENT' },
  { id: 'FIG_THETIS_GRK', name: 'Thetis', type: 'Nereid', culture: 'Greek', domains: 'Motherhood;Sea;Prophecy', aliases: '', desc: 'Sea nymph and mother of Achilles.', notes: 'Tries to make Achilles immortal.', works: 'GRK_ILIAD_BUTLER;GRK_ARGONAUTICA_SEATON', arch: 'ARCH_DIVINE_MOTHER', func: 'FUNC_MOTHER', cog: 'COG_GROUP_IDENTITY' },
  { id: 'FIG_KILHWCH_WELSH', name: 'Kilhwch', type: 'Hero', culture: 'Welsh', domains: 'Quest;Love;Giant-slaying', aliases: '', desc: 'Hero who seeks to marry Olwen.', notes: 'Variant spelling of Culhwch.', works: 'WELSH_MABINOGION_GUEST', arch: 'ARCH_HERO', func: 'FUNC_WARRIOR', cog: 'COG_GROUP_IDENTITY' },
  { id: 'FIG_NAUSICAA_GRK', name: 'Nausicaa', type: 'Princess', culture: 'Greek', domains: 'Hospitality;Youth;Marriage', aliases: 'Nausicaä', desc: 'Phaeacian princess who discovers Odysseus.', notes: 'Daughter of Alcinous and Arete.', works: 'GRK_ODYSSEY_BUTLER', arch: 'ARCH_INNOCENT_YOUTH', func: 'FUNC_HOSPITALITY_CULTIVATOR', cog: 'COG_COOPERATION_FACILITATION' },
  { id: 'FIG_EURYMACHUS_GRK', name: 'Eurymachus', type: 'Suitor', culture: 'Greek', domains: 'Pride;Treachery;Death', aliases: '', desc: 'Leading suitor of Penelope.', notes: 'Killed by Odysseus.', works: 'GRK_ODYSSEY_BUTLER', arch: 'ARCH_SHADOW_FIGURE', func: 'FUNC_ANTAGONIST_OBSTRUCTER', cog: 'COG_STATUS_HIERARCHY_LEGITIMATION' },
  { id: 'FIG_ARETE_GRK', name: 'Arete', type: 'Queen', culture: 'Greek', domains: 'Hospitality;Wisdom;Queenship', aliases: '', desc: 'Queen of the Phaeacians who helps Odysseus.', notes: 'Wife of Alcinous.', works: 'GRK_ODYSSEY_BUTLER', arch: 'ARCH_SOVEREIGNTY_GODDESS', func: 'FUNC_HOSPITALITY_CULTIVATOR', cog: 'COG_COOPERATION_FACILITATION' },
  { id: 'FIG_NEPTUNE_ROM', name: 'Neptune', type: 'Deity', culture: 'Roman', domains: 'Sea;Storms;Horses', aliases: 'Poseidon', desc: 'Roman god of the sea.', notes: 'Equivalent to Greek Poseidon.', works: 'ROM_AENEID_DRYDEN;ROM_METAMORPHOSES_OVID_MORE', arch: '', func: 'FUNC_COSMIC_ORDERER', cog: 'COG_THREAT_ANXIETY_MANAGEMENT' },
  { id: 'FIG_DIANA_ROM', name: 'Diana', type: 'Deity', culture: 'Roman', domains: 'Hunt;Moon;Virginity', aliases: 'Artemis', desc: 'Roman goddess of the hunt and the moon.', notes: 'Equivalent to Greek Artemis.', works: 'ROM_METAMORPHOSES_OVID_MORE', arch: '', func: 'FUNC_WARRIOR', cog: 'COG_THREAT_ANXIETY_MANAGEMENT' },
  { id: 'FIG_PHAETHON_GRK', name: 'Phaethon', type: 'Youth', culture: 'Greek', domains: 'Pride;Sun;Destruction', aliases: '', desc: 'Son of Helios who crashes the sun chariot.', notes: 'Killed by Zeus\' thunderbolt.', works: 'ROM_METAMORPHOSES_OVID_MORE', arch: 'ARCH_TRAGIC_HERO', func: '', cog: 'COG_THREAT_ANXIETY_MANAGEMENT' },
  { id: 'FIG_NARCISSUS_GRK', name: 'Narcissus', type: 'Youth', culture: 'Greek', domains: 'Beauty;Self-love;Death', aliases: '', desc: 'Beautiful youth who falls in love with his own reflection.', notes: 'Transformed into the narcissus flower.', works: 'ROM_METAMORPHOSES_OVID_MORE', arch: 'ARCH_TRAGIC_FIGURE', func: '', cog: 'COG_GROUP_IDENTITY' },
  { id: 'FIG_EURYDICE_GRK', name: 'Eurydice', type: 'Nymph', culture: 'Greek', domains: 'Love;Death;Loss', aliases: '', desc: 'Wife of Orpheus who dies and is almost rescued from Hades.', notes: 'Dies from a snake bite.', works: 'ROM_METAMORPHOSES_OVID_MORE', arch: 'ARCH_TRAGIC_FIGURE', func: '', cog: 'COG_THREAT_ANXIETY_MANAGEMENT' },
  { id: 'FIG_HEL_NORSE', name: 'Hel', type: 'Deity', culture: 'Norse', domains: 'Death;Underworld;Boundary;Fate', aliases: '', desc: 'Ruler or personification of the realm of the dead.', notes: 'Daughter of Loki.', works: 'NORSE_POETIC_EDDA_BELLOWS;NORSE_PROSE_EDDA_BRODEUR', arch: 'ARCH_THRESHOLD_GUARDIAN', func: 'FUNC_COSMIC_ORDERER', cog: 'COG_THREAT_ANXIETY_MANAGEMENT' },
  { id: 'FIG_YMIR_NORSE', name: 'Ymir', type: 'Primordial Giant', culture: 'Norse', domains: 'Creation;Chaos;Ice;Death', aliases: 'Aurgelmir', desc: 'Primordial giant from whose body the world was created.', notes: 'First being in Norse cosmogony.', works: 'NORSE_PROSE_EDDA_BRODEUR', arch: 'ARCH_PRIMORDIAL_ANTAGONIST', func: 'FUNC_CREATOR_DEMIURGE', cog: 'COG_INTUITIVE_ONTOLOGY_MANIPULATION' },
  { id: 'FIG_SIGNY_NORSE', name: 'Signy', type: 'Princess', culture: 'Norse', domains: 'Vengeance;Incest;Lineage', aliases: '', desc: 'Volsung princess who avenges her family.', notes: 'Sister of Sigmund. Wife of Siggeir.', works: 'NORSE_VOLSUNGA_SAGA_MAGNUSSON_MORRIS', arch: 'ARCH_TRAGIC_FIGURE', func: 'FUNC_WARRIOR', cog: 'COG_THREAT_ANXIETY_MANAGEMENT' },
];

const toAddCreatures = [
  { id: 'CRT_SIMURGH_PERS2', name: 'Simurgh', culture: 'Persian', type: 'Mythic Bird', desc: 'Great wise bird who raises Zal.', symbolism: 'Fosterage;Healing;Wisdom', aliases: 'Simorg', notes: 'Lives on Mount Alborz.', works: 'PER_SHAHNAMEH_ATKINSON' },
  { id: 'CRT_FAFNIR_NORSE', name: 'Fafnir', culture: 'Norse;Germanic', type: 'Dragon;Cursed Hoarder', desc: 'Dragon slain by Sigurd after greed transforms him into a treasure guardian.', symbolism: 'Cursed wealth;Greed;Dragon-slaying', aliases: 'Fafner;dragon', notes: 'Central dragon of the Volsung cycle.', works: 'NORSE_POETIC_EDDA_BELLOWS;NORSE_PROSE_EDDA_BRODEUR;NORSE_VOLSUNGA_SAGA_MAGNUSSON_MORRIS' },
];

for (const a of toAdd) {
  if (byId.has(a.id)) continue;
  figs.push({ figure_id: a.id, preferred_name: a.name, figure_type: a.type, culture_group: a.culture, domains: a.domains, alternate_names: a.aliases, description_brief: a.desc, notes: a.notes, works_appeared_in: a.works, character_archetype_tags: a.arch, function_tags: a.func, cognitive_function_tags: a.cog });
}
for (const a of toAddCreatures) {
  if (byId.has(a.id)) continue;
  crts.push({ creature_id: a.id, preferred_name: a.name, culture_group: a.culture, creature_type: a.type, description_brief: a.desc, symbolism_roles: a.symbolism, alternate_names: a.aliases, notes: a.notes, works_appeared_in: a.works });
}

const figHeaders = ['figure_id','preferred_name','figure_type','culture_group','domains','alternate_names','description_brief','notes','works_appeared_in','character_archetype_tags','function_tags','cognitive_function_tags'];
const crtHeaders = ['creature_id','preferred_name','culture_group','creature_type','description_brief','symbolism_roles','alternate_names','notes','works_appeared_in'];

fs.writeFileSync(FIGURES_FILE, serializeCsv(figHeaders, figs), 'utf8');
fs.writeFileSync(CREATURES_FILE, serializeCsv(crtHeaders, crts), 'utf8');

console.log('Added ' + toAdd.filter(a => !byId.has(a.id)).length + ' figures and ' + toAddCreatures.filter(a => !byId.has(a.id)).length + ' creatures.');
