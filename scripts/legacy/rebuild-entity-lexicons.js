#!/usr/bin/env node
/**
 * One-shot rebuild of entity lexicons from a clean base.
 * Properly handles CSV quoting throughout.
 */

const fs = require('fs');
const path = require('path');

const FIGURES_FILE = 'Corpus Forge/lexicons/key_figures.csv';
const CREATURES_FILE = 'Corpus Forge/lexicons/creatures.csv';
const WORKS_DIR = 'Corpus Forge/works';

// ========== Proper CSV parse/serialize ==========
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
        if (inQuotes && next === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
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

// ========== Load base CSVs ==========
let figs = parseCsv(fs.readFileSync(FIGURES_FILE, 'utf8'));
let crts = parseCsv(fs.readFileSync(CREATURES_FILE, 'utf8'));
const byId = new Map([...figs.map(f => [f.figure_id, f]), ...crts.map(c => [c.creature_id, c])]);

function addFigure(id, name, type, culture, domains, aliases, desc, notes, works, archetypes, functions, cognitive) {
  if (byId.has(id)) {
    const existing = byId.get(id);
    if (!existing.preferred_name) existing.preferred_name = name;
    if (!existing.figure_type) existing.figure_type = type;
    if (!existing.culture_group) existing.culture_group = culture;
    if (!existing.domains) existing.domains = domains;
    if (!existing.alternate_names && aliases) existing.alternate_names = aliases;
    if (!existing.description_brief) existing.description_brief = desc;
    if (!existing.notes && notes) existing.notes = notes;
    if (!existing.works_appeared_in && works) existing.works_appeared_in = works;
    if (!existing.character_archetype_tags && archetypes) existing.character_archetype_tags = archetypes;
    if (!existing.function_tags && functions) existing.function_tags = functions;
    if (!existing.cognitive_function_tags && cognitive) existing.cognitive_function_tags = cognitive;
    return;
  }
  const row = { figure_id: id, preferred_name: name, figure_type: type, culture_group: culture, domains, alternate_names: aliases, description_brief: desc, notes, works_appeared_in: works, character_archetype_tags: archetypes, function_tags: functions, cognitive_function_tags: cognitive };
  figs.push(row);
  byId.set(id, row);
}

function addCreature(id, name, culture, type, desc, symbolism, aliases, notes, works) {
  if (byId.has(id)) {
    const existing = byId.get(id);
    if (!existing.preferred_name) existing.preferred_name = name;
    if (!existing.culture_group) existing.culture_group = culture;
    if (!existing.creature_type) existing.creature_type = type;
    if (!existing.description_brief) existing.description_brief = desc;
    if (!existing.symbolism_roles && symbolism) existing.symbolism_roles = symbolism;
    if (!existing.alternate_names && aliases) existing.alternate_names = aliases;
    if (!existing.notes && notes) existing.notes = notes;
    if (!existing.works_appeared_in && works) existing.works_appeared_in = works;
    return;
  }
  const row = { creature_id: id, preferred_name: name, culture_group: culture, creature_type: type, description_brief: desc, symbolism_roles: symbolism, alternate_names: aliases, notes, works_appeared_in: works };
  crts.push(row);
  byId.set(id, row);
}

// ========== Add expansion entities (same as expand-entity-lexicons.js) ==========
// Greek
addFigure('FIG_ZEUS_GRK', 'Zeus', 'Deity', 'Greek', 'Sky, Kingship, Thunder, Justice', 'Jupiter', 'King of the Olympian gods, wielder of the thunderbolt.', 'Son of Cronus and Rhea.', 'GRK_ILIAD_BUTLER;GRK_ODYSSEY_BUTLER;GRK_THEOGONY_HESIOD_EVELYN;GRK_HOMERIC_HYMNS_EVELYN;ROM_METAMORPHOSES_OVID_MORE', 'ARCH_SKY_FATHER', 'FUNC_SOVEREIGNTY_MAGICAL', 'COG_AGENCY_DETECTION');
addFigure('FIG_HERA_GRK', 'Hera', 'Deity', 'Greek', 'Marriage, Queenship, Family', 'Juno', 'Queen of the gods, protector of marriage.', 'Sister and wife of Zeus.', 'GRK_ILIAD_BUTLER;GRK_ODYSSEY_BUTLER;GRK_THEOGONY_HESIOD_EVELYN;GRK_HOMERIC_HYMNS_EVELYN;ROM_METAMORPHOSES_OVID_MORE', 'ARCH_SOVEREIGNTY_GODDESS', 'FUNC_SOVEREIGNTY_PRIESTLY', 'COG_MORAL_REGULATION');
addFigure('FIG_ATHENA_GRK', 'Athena', 'Deity', 'Greek', 'Wisdom, War, Craft, Strategy', 'Minerva;Pallas Athena', 'Goddess of wisdom and strategic warfare.', 'Patron of Athens. Favors Odysseus.', 'GRK_ILIAD_BUTLER;GRK_ODYSSEY_BUTLER;GRK_THEOGONY_HESIOD_EVELYN;GRK_HOMERIC_HYMNS_EVELYN;GRK_ARGONAUTICA_SEATON;ROM_METAMORPHOSES_OVID_MORE', 'ARCH_WISE_OLD_MENTOR', 'FUNC_WARRIOR', 'COG_STATUS_HIERARCHY_LEGITIMATION');
addFigure('FIG_APOLLO_GRK', 'Apollo', 'Deity', 'Greek', 'Sun, Prophecy, Music, Archery, Healing', 'Phoebus', 'God of light, prophecy, music, and archery.', 'Son of Zeus and Leto.', 'GRK_ILIAD_BUTLER;GRK_ODYSSEY_BUTLER;GRK_THEOGONY_HESIOD_EVELYN;GRK_HOMERIC_HYMNS_EVELYN;GRK_ARGONAUTICA_SEATON;ROM_METAMORPHOSES_OVID_MORE', 'ARCH_HERALD', 'FUNC_ORACLE_PROPHET_FUNCTION', 'COG_AGENCY_DETECTION');
addFigure('FIG_POSEIDON_GRK', 'Poseidon', 'Deity', 'Greek', 'Sea, Earthquakes, Horses', 'Neptune', 'God of the sea, earthquakes, and horses.', 'Brother of Zeus.', 'GRK_ILIAD_BUTLER;GRK_ODYSSEY_BUTLER;GRK_THEOGONY_HESIOD_EVELYN;GRK_HOMERIC_HYMNS_EVELYN;GRK_ARGONAUTICA_SEATON;ROM_METAMORPHOSES_OVID_MORE', '', 'FUNC_COSMIC_ORDERER', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_APHRODITE_GRK', 'Aphrodite', 'Deity', 'Greek', 'Love, Beauty, Desire', 'Venus', 'Goddess of love and beauty.', 'Protector of Paris and the Trojans.', 'GRK_ILIAD_BUTLER;GRK_ODYSSEY_BUTLER;GRK_THEOGONY_HESIOD_EVELYN;GRK_HOMERIC_HYMNS_EVELYN;ROM_METAMORPHOSES_OVID_MORE', 'ARCH_FEMME_FATALE_HOMME_FATAL', 'FUNC_FERTILITY_PROSPERITY', 'COG_GROUP_IDENTITY');
addFigure('FIG_ARTEMIS_GRK', 'Artemis', 'Deity', 'Greek', 'Hunt, Moon, Virginity, Wilderness', 'Diana', 'Goddess of the hunt, the moon, and wild animals.', 'Twin sister of Apollo.', 'GRK_ILIAD_BUTLER;GRK_ODYSSEY_BUTLER;GRK_THEOGONY_HESIOD_EVELYN;GRK_HOMERIC_HYMNS_EVELYN;ROM_METAMORPHOSES_OVID_MORE', '', 'FUNC_WARRIOR', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_HEPHAESTUS_GRK', 'Hephaestus', 'Deity', 'Greek', 'Forge, Fire, Craft, Volcanoes', 'Vulcan;Mulciber', 'God of fire, metalworking, and craftsmanship.', 'Son of Hera. Crafts armor for Achilles.', 'GRK_ILIAD_BUTLER;GRK_ODYSSEY_BUTLER;GRK_THEOGONY_HESIOD_EVELYN;GRK_HOMERIC_HYMNS_EVELYN;ROM_METAMORPHOSES_OVID_MORE', '', 'FUNC_CIVILIZER_CULTURE_HERO', 'COG_INTUITIVE_ONTOLOGY_MANIPULATION');
addFigure('FIG_HERMES_GRK', 'Hermes', 'Deity', 'Greek', 'Messenger, Travel, Commerce, Thieves', 'Mercury', 'Messenger of the gods, guide of souls.', 'Son of Zeus and Maia.', 'GRK_ILIAD_BUTLER;GRK_ODYSSEY_BUTLER;GRK_THEOGONY_HESIOD_EVELYN;GRK_HOMERIC_HYMNS_EVELYN;GRK_ARGONAUTICA_SEATON;ROM_METAMORPHOSES_OVID_MORE', 'ARCH_HERALD', 'FUNC_PSYCHOPOMP', 'COG_AGENCY_DETECTION');
addFigure('FIG_DEMETER_GRK', 'Demeter', 'Deity', 'Greek', 'Grain, Harvest, Agriculture, Fertility', 'Ceres', 'Goddess of the harvest and agriculture.', 'Mother of Persephone.', 'GRK_THEOGONY_HESIOD_EVELYN;GRK_HOMERIC_HYMNS_EVELYN;ROM_METAMORPHOSES_OVID_MORE', 'ARCH_EARTH_MOTHER', 'FUNC_FERTILITY_PROSPERITY', 'COG_GROUP_IDENTITY');
addFigure('FIG_DIONYSUS_GRK', 'Dionysus', 'Deity', 'Greek', 'Wine, Ecstasy, Theater, Fertility', 'Bacchus', 'God of wine, revelry, and ecstatic ritual.', 'Son of Zeus and Semele.', 'GRK_HOMERIC_HYMNS_EVELYN;GRK_THEOGONY_HESIOD_EVELYN;ROM_METAMORPHOSES_OVID_MORE', '', 'FUNC_FERTILITY_PROSPERITY', 'COG_RITUAL_BINDING_COMMITMENT');
addFigure('FIG_HADES_GRK', 'Hades', 'Deity', 'Greek', 'Underworld, Death, Wealth', 'Pluto;Dis', 'God of the underworld and the dead.', 'Brother of Zeus. Husband of Persephone.', 'GRK_THEOGONY_HESIOD_EVELYN;GRK_HOMERIC_HYMNS_EVELYN;GRK_ODYSSEY_BUTLER;ROM_METAMORPHOSES_OVID_MORE', '', 'FUNC_PSYCHOPOMP', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_HESTIA_GRK', 'Hestia', 'Deity', 'Greek', 'Hearth, Home, Family', 'Vesta', 'Goddess of the hearth and domestic life.', 'Firstborn of Cronus and Rhea.', 'GRK_THEOGONY_HESIOD_EVELYN;GRK_HOMERIC_HYMNS_EVELYN', '', 'FUNC_GUARDIAN_PROTECTOR', 'COG_GROUP_IDENTITY');
addFigure('FIG_CRONUS_GRK', 'Cronus', 'Titan', 'Greek', 'Time, Harvest, Succession', 'Saturn', 'Leader of the Titans who overthrew Uranus.', 'Father of Zeus. Swallowed his children.', 'GRK_THEOGONY_HESIOD_EVELYN;GRK_HOMERIC_HYMNS_EVELYN;ROM_METAMORPHOSES_OVID_MORE', 'ARCH_SHADOW_FIGURE', 'FUNC_SOVEREIGNTY_MAGICAL', 'COG_STATUS_HIERARCHY_LEGITIMATION');
addFigure('FIG_PROMETHEUS_GRK', 'Prometheus', 'Titan', 'Greek', 'Fire, Craft, Foresight, Rebellion', 'Forethinker', 'Titan who brought fire to humanity.', 'Creator of mankind. Chained to a rock.', 'GRK_THEOGONY_HESIOD_EVELYN;GRK_HOMERIC_HYMNS_EVELYN;ROM_METAMORPHOSES_OVID_MORE', 'ARCH_CULTURE_HERO_ARCHETYPE', 'FUNC_CIVILIZER_CULTURE_HERO', 'COG_INTUITIVE_ONTOLOGY_MANIPULATION');
addFigure('FIG_ACHILLES_GRK', 'Achilles', 'Hero', 'Greek', 'Wrath, Honor, Mortality, Battle', '', 'Greatest Greek warrior.', 'Son of Peleus and Thetis.', 'GRK_ILIAD_BUTLER;ROM_METAMORPHOSES_OVID_MORE', 'ARCH_HERO', 'FUNC_WARRIOR', 'COG_GROUP_IDENTITY');
addFigure('FIG_HECTOR_GRK', 'Hector', 'Hero', 'Greek', 'Honor, Duty, Defense, Mortality', '', 'Greatest Trojan warrior.', 'Son of Priam. Killed by Achilles.', 'GRK_ILIAD_BUTLER', 'ARCH_HERO', 'FUNC_WARRIOR', 'COG_MORAL_REGULATION');
addFigure('FIG_ODYSSEUS_GRK', 'Odysseus', 'Hero', 'Greek', 'Cunning, Journey, Homecoming, Survival', 'Ulysses', 'Crafty hero whose ten-year voyage home is the Odyssey.', 'Son of Laertes. Husband of Penelope.', 'GRK_ODYSSEY_BUTLER;GRK_ILIAD_BUTLER;GRK_ARGONAUTICA_SEATON;ROM_METAMORPHOSES_OVID_MORE;ROM_AENEID_DRYDEN', 'ARCH_TRICKSTER_ARCHETYPE', 'FUNC_TRICKSTER_MEDIATOR', 'COG_MEMORY_TRANSMISSION');
addFigure('FIG_AGAMEMNON_GRK', 'Agamemnon', 'King', 'Greek', 'Kingship, War, Sacrifice, Vengeance', '', 'High king of the Achaeans.', 'Son of Atreus. Brother of Menelaus.', 'GRK_ILIAD_BUTLER;GRK_ODYSSEY_BUTLER;GRK_HOMERIC_HYMNS_EVELYN', 'ARCH_SOVEREIGN_RULER', 'FUNC_SOVEREIGNTY_MAGICAL', 'COG_STATUS_HIERARCHY_LEGITIMATION');
addFigure('FIG_PATROCLUS_GRK', 'Patroclus', 'Hero', 'Greek', 'Friendship, Sacrifice, Battle', '', 'Beloved companion of Achilles.', 'Wears Achilles\' armor. Killed by Hector.', 'GRK_ILIAD_BUTLER', 'ARCH_LOYAL_COMPANION', 'FUNC_WARRIOR', 'COG_COOPERATION_FACILITATION');
addFigure('FIG_DIOMEDES_GRK', 'Diomedes', 'Hero', 'Greek', 'Battle, Courage, Divine Favor', '', 'Mighty Greek warrior.', 'Son of Tydeus. Favored by Athena.', 'GRK_ILIAD_BUTLER;GRK_ARGONAUTICA_SEATON', 'ARCH_HERO', 'FUNC_WARRIOR', 'COG_AGENCY_DETECTION');
addFigure('FIG_NESTOR_GRK', 'Nestor', 'Elder', 'Greek', 'Wisdom, Counsel, Memory', '', 'Wise old king of Pylos.', 'Son of Neleus.', 'GRK_ILIAD_BUTLER;GRK_ODYSSEY_BUTLER', 'ARCH_WISE_OLD_MENTOR', 'FUNC_SOVEREIGNTY_PRIESTLY', 'COG_MEMORY_TRANSMISSION');
addFigure('FIG_PRIAM_GRK', 'Priam', 'King', 'Greek', 'Kingship, Grief, Fathers', '', 'Aged king of Troy.', 'Father of Hector and Paris.', 'GRK_ILIAD_BUTLER', 'ARCH_SOVEREIGN_RULER', 'FUNC_SOVEREIGNTY_MAGICAL', 'COG_STATUS_HIERARCHY_LEGITIMATION');
addFigure('FIG_PARIS_GRK', 'Paris', 'Prince', 'Greek', 'Love, Judgment, Cowardice', 'Alexandros', 'Prince of Troy whose abduction of Helen sparks the war.', 'Son of Priam. Kills Achilles.', 'GRK_ILIAD_BUTLER;ROM_METAMORPHOSES_OVID_MORE', '', 'FUNC_LOVER_BELOVED', 'COG_MORAL_REGULATION');
addFigure('FIG_HELEN_GRK', 'Helen', 'Queen', 'Greek', 'Beauty, Desire, War, Infidelity', '', 'The most beautiful woman in the world.', 'Daughter of Zeus and Leda. Wife of Menelaus.', 'GRK_ILIAD_BUTLER;GRK_ODYSSEY_BUTLER;GRK_HOMERIC_HYMNS_EVELYN;ROM_METAMORPHOSES_OVID_MORE', 'ARCH_FEMME_FATALE_HOMME_FATAL', 'FUNC_FERTILITY_PROSPERITY', 'COG_GROUP_IDENTITY');
addFigure('FIG_MENELAUS_GRK', 'Menelaus', 'King', 'Greek', 'Kingship, Vengeance, Marriage', '', 'King of Sparta and husband of Helen.', 'Brother of Agamemnon.', 'GRK_ILIAD_BUTLER;GRK_ODYSSEY_BUTLER;GRK_HOMERIC_HYMNS_EVELYN', 'ARCH_SOVEREIGN_RULER', 'FUNC_SOVEREIGNTY_MAGICAL', 'COG_STATUS_HIERARCHY_LEGITIMATION');
addFigure('FIG_PENELOPE_GRK', 'Penelope', 'Queen', 'Greek', 'Fidelity, Cunning, Patience, Weaving', '', 'Faithful wife of Odysseus.', 'Daughter of Icarius. Mother of Telemachus.', 'GRK_ODYSSEY_BUTLER;ROM_METAMORPHOSES_OVID_MORE', '', 'FUNC_GUARDIAN_PROTECTOR', 'COG_MORAL_REGULATION');
addFigure('FIG_TELEMACHUS_GRK', 'Telemachus', 'Prince', 'Greek', 'Youth, Growth, Search, Identity', '', 'Son of Odysseus and Penelope.', 'Matures during the Odyssey.', 'GRK_ODYSSEY_BUTLER', 'ARCH_INNOCENT_YOUTH', 'FUNC_SOVEREIGNTY_PRIESTLY', 'COG_GROUP_IDENTITY');
addFigure('FIG_AENEAS_ROM', 'Aeneas', 'Hero', 'Roman', 'Duty, Piety, Foundation, Exile', '', 'Trojan hero destined to found Rome.', 'Son of Venus and Anchises.', 'ROM_AENEID_DRYDEN;ROM_METAMORPHOSES_OVID_MORE', 'ARCH_HERO', 'FUNC_CIVILIZER_CULTURE_HERO', 'COG_GROUP_IDENTITY');
addFigure('FIG_DIDO_ROM', 'Dido', 'Queen', 'Phoenician', 'Love, Suicide, Foundation, Betrayal', 'Elissa', 'Queen of Carthage who falls in love with Aeneas.', 'Founder of Carthage.', 'ROM_AENEID_DRYDEN;ROM_METAMORPHOSES_OVID_MORE', 'ARCH_TRAGIC_FIGURE', 'FUNC_SOVEREIGNTY_MAGICAL', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_TURNUS_ROM', 'Turnus', 'Prince', 'Italian', 'War, Rivalry, Honor, Death', '', 'Rutulian prince and Aeneas\'s rival.', 'Favored by Juno.', 'ROM_AENEID_DRYDEN', 'ARCH_SHADOW_FIGURE', 'FUNC_WARRIOR', 'COG_STATUS_HIERARCHY_LEGITIMATION');
addFigure('FIG_JASON_GRK', 'Jason', 'Hero', 'Greek', 'Quest, Leadership, Betrayal', '', 'Leader of the Argonauts.', 'Son of Aeson. Husband of Medea.', 'GRK_ARGONAUTICA_SEATON;ROM_METAMORPHOSES_OVID_MORE', 'ARCH_HERO', 'FUNC_WARRIOR', 'COG_GROUP_IDENTITY');
addFigure('FIG_MEDEA_GRK', 'Medea', 'Sorceress', 'Greek', 'Magic, Vengeance, Love, Infanticide', '', 'Sorceress princess of Colchis.', 'Daughter of Aeetes. Granddaughter of Helios.', 'GRK_ARGONAUTICA_SEATON;ROM_METAMORPHOSES_OVID_MORE', 'ARCH_FEMME_FATALE_HOMME_FATAL', 'FUNC_TRICKSTER_MEDIATOR', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_PERSEUS_GRK', 'Perseus', 'Hero', 'Greek', 'Monster-slaying, Rescue, Destiny', '', 'Hero who slays Medusa and rescues Andromeda.', 'Son of Zeus and Danae.', 'GRK_HOMERIC_HYMNS_EVELYN;GRK_THEOGONY_HESIOD_EVELYN;ROM_METAMORPHOSES_OVID_MORE', 'ARCH_HERO', 'FUNC_WARRIOR', 'COG_AGENCY_DETECTION');
addFigure('FIG_THESEUS_GRK', 'Theseus', 'Hero', 'Greek', 'Kingship, Monster-slaying, Law', '', 'Hero-king of Athens who slays the Minotaur.', 'Son of Aegeus.', 'GRK_HOMERIC_HYMNS_EVELYN;ROM_METAMORPHOSES_OVID_MORE', 'ARCH_HERO', 'FUNC_SOVEREIGNTY_MAGICAL', 'COG_STATUS_HIERARCHY_LEGITIMATION');
addFigure('FIG_HERACLES_GRK', 'Heracles', 'Hero', 'Greek', 'Strength, Labors, Immortality, Madness', 'Hercules', 'Greatest of Greek heroes.', 'Son of Zeus and Alcmene.', 'GRK_ILIAD_BUTLER;GRK_HOMERIC_HYMNS_EVELYN;GRK_THEOGONY_HESIOD_EVELYN;ROM_METAMORPHOSES_OVID_MORE', 'ARCH_HERO', 'FUNC_WARRIOR', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_ORPHEUS_GRK', 'Orpheus', 'Musician;Hero', 'Greek', 'Music, Poetry, Underworld, Love', '', 'Legendary musician who descended to Hades for Eurydice.', 'Son of Calliope.', 'GRK_HOMERIC_HYMNS_EVELYN;GRK_ARGONAUTICA_SEATON;ROM_METAMORPHOSES_OVID_MORE', 'ARCH_CULTURE_HERO_ARCHETYPE', 'FUNC_PSYCHOPOMP', 'COG_MEMORY_TRANSMISSION');
addFigure('FIG_OVID_ROM', 'Ovid', 'Poet', 'Roman', 'Transformation, Poetry, Mythology', '', 'Roman poet whose Metamorphoses recounts myths of transformation.', 'Exiled by Augustus.', 'ROM_METAMORPHOSES_OVID_MORE', 'ARCH_CULTURE_HERO_ARCHETYPE', 'FUNC_BARD_POET', 'COG_MEMORY_TRANSMISSION');

// Norse
addFigure('FIG_ODIN_NOR', 'Odin', 'Deity', 'Norse', 'Wisdom, War, Death, Poetry, Magic, Kingship', 'Wotan;Woden', 'Allfather and chief of the Aesir.', 'Hangs himself on Yggdrasil for nine nights.', 'NORSE_POETIC_EDDA_BELLOWS;NORSE_PROSE_EDDA_BRODEUR;NORSE_VOLSUNGA_SAGA_MAGNUSSON_MORRIS', 'ARCH_SKY_FATHER', 'FUNC_SOVEREIGNTY_MAGICAL', 'COG_AGENCY_DETECTION');
addFigure('FIG_THOR_NOR', 'Thor', 'Deity', 'Norse', 'Thunder, Strength, Protection, Fertility', 'Donar', 'God of thunder and strength.', 'Son of Odin and Jord. Wields Mjolnir.', 'NORSE_POETIC_EDDA_BELLOWS;NORSE_PROSE_EDDA_BRODEUR', 'ARCH_WARRIOR_HERO', 'FUNC_WARRIOR', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_LOKI_NOR', 'Loki', 'Trickster', 'Norse', 'Trickery, Fire, Chaos, Shape-shifting', 'Loptr', 'Trickster god of fire and mischief.', 'Shape-shifter. Father of monsters.', 'NORSE_POETIC_EDDA_BELLOWS;NORSE_PROSE_EDDA_BRODEUR;NORSE_VOLSUNGA_SAGA_MAGNUSSON_MORRIS', 'ARCH_TRICKSTER_ARCHETYPE', 'FUNC_TRICKSTER_MEDIATOR', 'COG_INTUITIVE_ONTOLOGY_MANIPULATION');
addFigure('FIG_FREYJA_NOR', 'Freyja', 'Deity', 'Norse', 'Love, Beauty, Fertility, War, Death, Magic', 'Freya', 'Goddess of love, fertility, and war.', 'Rides a chariot drawn by cats.', 'NORSE_POETIC_EDDA_BELLOWS;NORSE_PROSE_EDDA_BRODEUR', 'ARCH_EARTH_MOTHER', 'FUNC_FERTILITY_PROSPERITY', 'COG_GROUP_IDENTITY');
addFigure('FIG_FREYR_NOR', 'Freyr', 'Deity', 'Norse', 'Fertility, Prosperity, Sunshine, Rain', 'Frey', 'God of fertility and prosperity.', 'Son of Njord.', 'NORSE_POETIC_EDDA_BELLOWS;NORSE_PROSE_EDDA_BRODEUR', '', 'FUNC_FERTILITY_PROSPERITY', 'COG_COOPERATION_FACILITATION');
addFigure('FIG_BALDR_NOR', 'Baldr', 'Deity', 'Norse', 'Light, Purity, Beauty, Death', 'Balder', 'God of light and beauty.', 'Son of Odin and Frigg. Killed by mistletoe.', 'NORSE_POETIC_EDDA_BELLOWS;NORSE_PROSE_EDDA_BRODEUR', 'ARCH_SACRIFICIAL_FIGURE', 'FUNC_SOVEREIGNTY_PRIESTLY', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_TYR_NOR', 'Tyr', 'Deity', 'Norse', 'War, Law, Justice, Honor', 'Tiw', 'One-handed god of war and justice.', 'Sacrificed his hand to bind Fenrir.', 'NORSE_POETIC_EDDA_BELLOWS;NORSE_PROSE_EDDA_BRODEUR', 'ARCH_WARRIOR_HERO', 'FUNC_WARRIOR', 'COG_MORAL_REGULATION');
addFigure('FIG_HEIMDALL_NOR', 'Heimdall', 'Deity', 'Norse', 'Watchfulness, Senses, Boundaries', 'Rig', 'Guardian god who watches the Bifrost bridge.', 'Son of nine mothers.', 'NORSE_POETIC_EDDA_BELLOWS;NORSE_PROSE_EDDA_BRODEUR', 'ARCH_HERALD', 'FUNC_GUARDIAN_PROTECTOR', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_FRIGG_NOR', 'Frigg', 'Deity', 'Norse', 'Marriage, Motherhood, Prophecy', 'Frigga', 'Queen of the Aesir, wife of Odin.', 'Mother of Baldr.', 'NORSE_POETIC_EDDA_BELLOWS;NORSE_PROSE_EDDA_BRODEUR', 'ARCH_EARTH_MOTHER', 'FUNC_SOVEREIGNTY_PRIESTLY', 'COG_GROUP_IDENTITY');
addFigure('FIG_NJORD_NOR', 'Njord', 'Deity', 'Norse', 'Sea, Wind, Wealth', '', 'Vanir god of the sea, wind, and wealth.', 'Father of Freyr and Freyja.', 'NORSE_POETIC_EDDA_BELLOWS;NORSE_PROSE_EDDA_BRODEUR', '', 'FUNC_FERTILITY_PROSPERITY', 'COG_COOPERATION_FACILITATION');
addFigure('FIG_BRAGI_NOR', 'Bragi', 'Deity', 'Norse', 'Poetry, Eloquence', '', 'God of poetry and skaldic verse.', 'Husband of Idun.', 'NORSE_POETIC_EDDA_BELLOWS;NORSE_PROSE_EDDA_BRODEUR', 'ARCH_CULTURE_HERO_ARCHETYPE', 'FUNC_BARD_POET', 'COG_MEMORY_TRANSMISSION');
addFigure('FIG_IDUN_NOR', 'Idun', 'Deity', 'Norse', 'Youth, Renewal, Apples', 'Ithunn', 'Goddess who tends the apples of immortality.', 'Wife of Bragi.', 'NORSE_POETIC_EDDA_BELLOWS;NORSE_PROSE_EDDA_BRODEUR', '', 'FUNC_HEALER', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_SIGURD_NOR', 'Sigurd', 'Hero', 'Norse;Germanic', 'Dragon-slaying, Vengeance, Love, Betrayal', 'Siegfried', 'Greatest Germanic hero who slays the dragon Fafnir.', 'Son of Sigmund. Rides Grani.', 'NORSE_POETIC_EDDA_BELLOWS;NORSE_VOLSUNGA_SAGA_MAGNUSSON_MORRIS', 'ARCH_HERO', 'FUNC_WARRIOR', 'COG_GROUP_IDENTITY');
addFigure('FIG_BRYNHILD_NOR', 'Brynhild', 'Valkyrie', 'Norse', 'War, Love, Vengeance, Honor', 'Brunhild', 'Valkyrie cursed into sleep within a ring of fire.', 'Awakened by Sigurd. Betrayed.', 'NORSE_POETIC_EDDA_BELLOWS;NORSE_VOLSUNGA_SAGA_MAGNUSSON_MORRIS', 'ARCH_WARRIOR_HERO', 'FUNC_WARRIOR', 'COG_MORAL_REGULATION');
addFigure('FIG_GUDRUN_NOR', 'Gudrun', 'Queen', 'Norse;Germanic', 'Love, Grief, Vengeance', 'Kriemhild', 'Wife of Sigurd who avenges his murder.', 'Daughter of Gjuki. Marries Atli.', 'NORSE_POETIC_EDDA_BELLOWS;NORSE_VOLSUNGA_SAGA_MAGNUSSON_MORRIS', 'ARCH_TRAGIC_FIGURE', 'FUNC_SOVEREIGNTY_MAGICAL', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_GUNNAR_NOR', 'Gunnar', 'King', 'Norse', 'Kingship, Treachery, Death', 'Gunther', 'King of the Burgundians who betrays Sigurd.', 'Son of Gjuki. Marries Brynhild.', 'NORSE_POETIC_EDDA_BELLOWS;NORSE_VOLSUNGA_SAGA_MAGNUSSON_MORRIS', 'ARCH_SHADOW_FIGURE', 'FUNC_SOVEREIGNTY_MAGICAL', 'COG_STATUS_HIERARCHY_LEGITIMATION');
addFigure('FIG_SIGMUND_NOR', 'Sigmund', 'Hero', 'Norse', 'Lineage, Sword, Fate', '', 'Father of Sigurd.', 'Son of Volsung. Wields Gram.', 'NORSE_POETIC_EDDA_BELLOWS;NORSE_VOLSUNGA_SAGA_MAGNUSSON_MORRIS', 'ARCH_HERO', 'FUNC_WARRIOR', 'COG_MEMORY_TRANSMISSION');
addFigure('FIG_ATLI_NOR', 'Atli', 'King', 'Norse', 'Treasure greed;Marriage;Betrayal;Slaughter', 'Attila', 'King who draws Gudrun\'s brothers into fatal conflict.', 'Norse heroic memory of Attila.', 'GER_NIBELUNGENLIED;NORSE_POETIC_EDDA_BELLOWS;NORSE_VOLSUNGA_SAGA_MAGNUSSON_MORRIS', 'ARCH_TYRANT', 'FUNC_SOVEREIGNTY_MAGICAL', 'COG_MORAL_REGULATION');
addFigure('FIG_HEL_NOR', 'Hel', 'Deity', 'Norse', 'Death;Underworld;Boundary;Fate', '', 'Ruler or personification of the realm of the dead.', 'Daughter of Loki.', 'NORSE_POETIC_EDDA_BELLOWS;NORSE_PROSE_EDDA_BRODEUR', 'ARCH_THRESHOLD_GUARDIAN', 'FUNC_COSMIC_ORDERER', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_YMIR_NOR', 'Ymir', 'Primordial Giant', 'Norse', 'Creation;Chaos;Ice;Death', 'Aurgelmir', 'Primordial giant from whose body the world was created.', 'First being in Norse cosmogony.', 'NORSE_PROSE_EDDA_BRODEUR', 'ARCH_PRIMORDIAL_ANTAGONIST', 'FUNC_CREATOR_DEMIURGE', 'COG_INTUITIVE_ONTOLOGY_MANIPULATION');

// Egyptian
addFigure('FIG_RA_EGY', 'Ra', 'Deity', 'Egyptian', 'Sun, Creation, Kingship', 'Re;Amun-Ra', 'Supreme sun god and creator.', 'Fights Apep nightly.', 'EGY_BOOK_DEAD_BUDGE;EGY_PYRAMID_TEXTS_MERCER', 'ARCH_SKY_FATHER', 'FUNC_SOVEREIGNTY_MAGICAL', 'COG_AGENCY_DETECTION');
addFigure('FIG_OSIRIS_EGY', 'Osiris', 'Deity', 'Egyptian', 'Death, Resurrection, Fertility, Kingship', 'Usir', 'God of the dead and resurrection.', 'Son of Geb and Nut. Brother-husband of Isis.', 'EGY_BOOK_DEAD_BUDGE;EGY_PYRAMID_TEXTS_MERCER', 'ARCH_DYING_RESURRECTING_GOD', 'FUNC_PSYCHOPOMP', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_ISIS_EGY', 'Isis', 'Deity', 'Egyptian', 'Magic, Motherhood, Healing, Protection', 'Aset', 'Goddess of magic and motherhood.', 'Sister-wife of Osiris. Mother of Horus.', 'EGY_BOOK_DEAD_BUDGE;EGY_PYRAMID_TEXTS_MERCER', 'ARCH_EARTH_MOTHER', 'FUNC_HEALER', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_HORUS_EGY', 'Horus', 'Deity', 'Egyptian', 'Kingship, Sky, Vengeance, Order', 'Heru', 'Sky god and divine king.', 'Son of Osiris and Isis.', 'EGY_BOOK_DEAD_BUDGE;EGY_PYRAMID_TEXTS_MERCER', 'ARCH_HERO', 'FUNC_SOVEREIGNTY_MAGICAL', 'COG_STATUS_HIERARCHY_LEGITIMATION');
addFigure('FIG_SET_EGY', 'Set', 'Deity', 'Egyptian', 'Chaos, Storm, Desert, Violence', 'Seth;Sutekh', 'God of chaos, storms, and the desert.', 'Brother of Osiris.', 'EGY_BOOK_DEAD_BUDGE;EGY_PYRAMID_TEXTS_MERCER', 'ARCH_SHADOW_FIGURE', 'FUNC_DESTROYER_RENEWER', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_ANUBIS_EGY', 'Anubis', 'Deity', 'Egyptian', 'Death, Mummification, Afterlife', 'Anpu;Inpw', 'Jackal-headed god of mummification.', 'Son of Osiris and Nephthys.', 'EGY_BOOK_DEAD_BUDGE;EGY_PYRAMID_TEXTS_MERCER', 'ARCH_PSYCHOPOMP', 'FUNC_PSYCHOPOMP', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_THOTH_EGY', 'Thoth', 'Deity', 'Egyptian', 'Wisdom, Writing, Moon, Magic', 'Djehuty', 'Ibis-headed god of wisdom and writing.', 'Records the weighing of the heart.', 'EGY_BOOK_DEAD_BUDGE;EGY_PYRAMID_TEXTS_MERCER', 'ARCH_WISE_OLD_MENTOR', 'FUNC_ORACLE_PROPHET_FUNCTION', 'COG_MEMORY_TRANSMISSION');
addFigure('FIG_HATHOR_EGY', 'Hathor', 'Deity', 'Egyptian', 'Love, Joy, Music, Motherhood, Sky', '', 'Cow goddess of love, joy, and music.', 'Often identified with Isis.', 'EGY_BOOK_DEAD_BUDGE;EGY_PYRAMID_TEXTS_MERCER', 'ARCH_DIVINE_MOTHER', 'FUNC_FERTILITY_PROSPERITY', 'COG_GROUP_IDENTITY');
addFigure('FIG_NUT_EGY', 'Nut', 'Deity', 'Egyptian', 'Sky, Stars, Cosmos, Motherhood', 'Nuit', 'Goddess of the sky.', 'Daughter of Shu and Tefnut.', 'EGY_BOOK_DEAD_BUDGE;EGY_PYRAMID_TEXTS_MERCER', 'ARCH_SKY_GODDESS', 'FUNC_COSMIC_ORDERER', 'COG_INTUITIVE_ONTOLOGY_MANIPULATION');
addFigure('FIG_GEB_EGY', 'Geb', 'Deity', 'Egyptian', 'Earth, Fertility, Vegetation', '', 'God of the earth.', 'Son of Shu and Tefnut. Husband of Nut.', 'EGY_BOOK_DEAD_BUDGE;EGY_PYRAMID_TEXTS_MERCER', '', 'FUNC_FERTILITY_PROSPERITY', 'COG_INTUITIVE_ONTOLOGY_MANIPULATION');
addFigure('FIG_PTAH_EGY', 'Ptah', 'Deity', 'Egyptian', 'Creation, Crafts, Memphis', '', 'Creator god of Memphis.', 'Husband of Sekhmet.', 'EGY_BOOK_DEAD_BUDGE;EGY_PYRAMID_TEXTS_MERCER', 'ARCH_CREATOR_DEMIURGE', 'FUNC_CREATOR_DEMIURGE', 'COG_AGENCY_DETECTION');
addFigure('FIG_SEKHMET_EGY', 'Sekhmet', 'Deity', 'Egyptian', 'War, Destruction, Healing, Lioness', '', 'Fierce lioness goddess of war.', 'Daughter of Ra.', 'EGY_BOOK_DEAD_BUDGE;EGY_PYRAMID_TEXTS_MERCER', 'ARCH_WARRIOR_HERO', 'FUNC_WARRIOR', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_BASTET_EGY', 'Bastet', 'Deity', 'Egyptian', 'Home, Fertility, Protection, Cats', 'Bast', 'Cat goddess of home and protection.', 'Daughter of Ra.', 'EGY_BOOK_DEAD_BUDGE;EGY_PYRAMID_TEXTS_MERCER', '', 'FUNC_GUARDIAN_PROTECTOR', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_MAAT_EGY', 'Maat', 'Deity', 'Egyptian', 'Truth, Justice, Order, Cosmic Balance', '', 'Goddess of truth and cosmic order.', 'Daughter of Ra.', 'EGY_BOOK_DEAD_BUDGE;EGY_PYRAMID_TEXTS_MERCER', '', 'FUNC_COSMIC_ORDERER', 'COG_MORAL_REGULATION');
addFigure('FIG_KHONSU_EGY', 'Khonsu', 'Deity', 'Egyptian', 'Moon, Time, Healing', 'Khons', 'Moon god associated with time and healing.', 'Son of Amun and Mut.', 'EGY_BOOK_DEAD_BUDGE;EGY_PYRAMID_TEXTS_MERCER', 'ARCH_DIVINE_CHILD', 'FUNC_HEALER', 'COG_AGENCY_DETECTION');
addFigure('FIG_SHU_EGY', 'Shu', 'Deity', 'Egyptian', 'Air, Light, Wind', '', 'God of air and light.', 'Son of Ra. Brother-husband of Tefnut.', 'EGY_BOOK_DEAD_BUDGE;EGY_PYRAMID_TEXTS_MERCER', '', 'FUNC_COSMIC_ORDERER', 'COG_INTUITIVE_ONTOLOGY_MANIPULATION');
addFigure('FIG_TEFNUT_EGY', 'Tefnut', 'Deity', 'Egyptian', 'Moisture, Rain', '', 'Goddess of moisture and rain.', 'Daughter of Ra. Mother of Nut and Geb.', 'EGY_BOOK_DEAD_BUDGE;EGY_PYRAMID_TEXTS_MERCER', '', 'FUNC_FERTILITY_PROSPERITY', 'COG_INTUITIVE_ONTOLOGY_MANIPULATION');
addFigure('FIG_NEPHTHYS_EGY', 'Nephthys', 'Deity', 'Egyptian', 'Death, Mourning, Protection', 'Nebthet', 'Goddess of mourning and protection.', 'Sister of Isis. Wife of Set.', 'EGY_BOOK_DEAD_BUDGE;EGY_PYRAMID_TEXTS_MERCER', 'ARCH_PROTECTIVE_DEITY', 'FUNC_GUARDIAN_PROTECTOR', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_ATUM_EGY', 'Atum', 'Deity', 'Egyptian', 'Creation, Sun, Completeness', 'Tem', 'Creator god who made the first gods.', 'Self-created deity.', 'EGY_BOOK_DEAD_BUDGE;EGY_PYRAMID_TEXTS_MERCER', 'ARCH_CREATOR_DEMIURGE', 'FUNC_CREATOR_DEMIURGE', 'COG_AGENCY_DETECTION');
addFigure('FIG_APEP_EGY', 'Apep', 'Serpent;Chaos', 'Egyptian', 'Chaos;Darkness;Destruction', 'Apophis', 'Giant serpent of chaos who attacks Ra nightly.', 'Enemy of Maat and cosmic order.', 'EGY_BOOK_DEAD_BUDGE;EGY_PYRAMID_TEXTS_MERCER', 'ARCH_SHADOW_FIGURE', 'FUNC_ANTAGONIST_OBSTRUCTER', 'COG_THREAT_ANXIETY_MANAGEMENT');

// Indian
addFigure('FIG_VISHNU_IND', 'Vishnu', 'Deity', 'Indian', 'Preservation, Cosmos, Righteousness', 'Narayana', 'Supreme preserver god.', 'Incarnates as Rama, Krishna, etc.', 'IND_MAHABHARATA_GANGULI;IND_RAMAYANA_GRIFFITH;VED_RG_VEDA_GRIFFITH', 'ARCH_SKY_FATHER', 'FUNC_COSMIC_ORDERER', 'COG_AGENCY_DETECTION');
addFigure('FIG_SHIVA_IND', 'Shiva', 'Deity', 'Indian', 'Destruction, Transformation, Asceticism, Dance', 'Rudra', 'Supreme destroyer and transformer.', 'Husband of Parvati. Father of Ganesha.', 'IND_MAHABHARATA_GANGULI;IND_RAMAYANA_GRIFFITH;VED_RG_VEDA_GRIFFITH', 'ARCH_DESTROYER_RENEWER', 'FUNC_DESTROYER_RENEWER', 'COG_INTUITIVE_ONTOLOGY_MANIPULATION');
addFigure('FIG_BRAHMA_IND', 'Brahma', 'Deity', 'Indian', 'Creation, Vedas, Knowledge', '', 'Creator god of the Hindu trinity.', 'Four-headed. Less worshipped.', 'IND_MAHABHARATA_GANGULI;IND_RAMAYANA_GRIFFITH;VED_RG_VEDA_GRIFFITH', 'ARCH_CREATOR_DEMIURGE', 'FUNC_CREATOR_DEMIURGE', 'COG_AGENCY_DETECTION');
addFigure('FIG_INDRA_IND', 'Indra', 'Deity', 'Indian', 'Storm, War, Kingship', 'Sakra;Shakra', 'King of the gods and god of storms.', 'Rides Airavata. Wields Vajra.', 'IND_MAHABHARATA_GANGULI;IND_RAMAYANA_GRIFFITH;VED_RG_VEDA_GRIFFITH', 'ARCH_SKY_FATHER', 'FUNC_WARRIOR', 'COG_AGENCY_DETECTION');
addFigure('FIG_AGNI_IND', 'Agni', 'Deity', 'Indian', 'Fire, Sacrifice, Messenger', '', 'God of fire and sacrifice.', 'Priest of the gods.', 'VED_RG_VEDA_GRIFFITH;IND_MAHABHARATA_GANGULI', 'ARCH_HERALD', 'FUNC_PRIEST_RITUAL_SPECIALIST', 'COG_RITUAL_BINDING_COMMITMENT');
addFigure('FIG_SOMA_IND', 'Soma', 'Deity', 'Indian', 'Moon, Soma Juice, Ecstasy', 'Chandra', 'God of the moon and the divine soma plant.', 'Personification of the soma sacrifice.', 'VED_RG_VEDA_GRIFFITH;IND_MAHABHARATA_GANGULI', '', 'FUNC_HEALER', 'COG_RITUAL_BINDING_COMMITMENT');
addFigure('FIG_VARUNA_IND', 'Varuna', 'Deity', 'Indian', 'Cosmic Order, Oceans, Law', '', 'God of cosmic order and the waters.', 'Associated with Mitra.', 'VED_RG_VEDA_GRIFFITH;IND_MAHABHARATA_GANGULI', '', 'FUNC_COSMIC_ORDERER', 'COG_MORAL_REGULATION');
addFigure('FIG_MITRA_IND', 'Mitra', 'Deity', 'Indian', 'Friendship, Contracts, Daylight', '', 'God of friendship and contracts.', 'Often paired with Varuna.', 'VED_RG_VEDA_GRIFFITH', '', 'FUNC_SOVEREIGNTY_PRIESTLY', 'COG_COOPERATION_FACILITATION');
addFigure('FIG_USHAS_IND', 'Ushas', 'Deity', 'Indian', 'Dawn, Light, Awakening', 'Dawn', 'Goddess of dawn.', 'Beautiful. Daughter of the sky.', 'VED_RG_VEDA_GRIFFITH', 'ARCH_HERALD', 'FUNC_SOVEREIGNTY_PRIESTLY', 'COG_AGENCY_DETECTION');
addFigure('FIG_SARASWATI_IND', 'Saraswati', 'Deity', 'Indian', 'Knowledge, Music, Arts, Wisdom', '', 'Goddess of knowledge, music, and the arts.', 'Wife of Brahma.', 'IND_MAHABHARATA_GANGULI;IND_RAMAYANA_GRIFFITH;VED_RG_VEDA_GRIFFITH', 'ARCH_WISE_OLD_MENTOR', 'FUNC_ORACLE_PROPHET_FUNCTION', 'COG_MEMORY_TRANSMISSION');
addFigure('FIG_LAKSHMI_IND', 'Lakshmi', 'Deity', 'Indian', 'Wealth, Prosperity, Fortune', 'Sri', 'Goddess of wealth and prosperity.', 'Wife of Vishnu.', 'IND_MAHABHARATA_GANGULI;IND_RAMAYANA_GRIFFITH', 'ARCH_FERTILITY_GODDESS', 'FUNC_FERTILITY_PROSPERITY', 'COG_COOPERATION_FACILITATION');
addFigure('FIG_PARVATI_IND', 'Parvati', 'Deity', 'Indian', 'Love, Fertility, Devotion, Power', 'Uma;Durga;Kali', 'Goddess of love and devotion.', 'Wife of Shiva. Mother of Ganesha.', 'IND_MAHABHARATA_GANGULI;IND_RAMAYANA_GRIFFITH', 'ARCH_EARTH_MOTHER', 'FUNC_FERTILITY_PROSPERITY', 'COG_GROUP_IDENTITY');
addFigure('FIG_GANESHA_IND', 'Ganesha', 'Deity', 'Indian', 'Wisdom, Obstacles, Beginnings', 'Ganapati', 'Elephant-headed god of wisdom.', 'Son of Shiva and Parvati.', 'IND_MAHABHARATA_GANGULI;IND_RAMAYANA_GRIFFITH', 'ARCH_WISE_OLD_MENTOR', 'FUNC_ORACLE_PROPHET_FUNCTION', 'COG_AGENCY_DETECTION');
addFigure('FIG_YAMA_IND', 'Yama', 'Deity', 'Indian', 'Death, Justice, Underworld', 'Dharmaraja', 'God of death and justice.', 'Son of Surya. Twin of Yami.', 'IND_MAHABHARATA_GANGULI;IND_RAMAYANA_GRIFFITH;VED_RG_VEDA_GRIFFITH', 'ARCH_DIVINE_JUDGE', 'FUNC_DIVINE_JUDGE', 'COG_MORAL_REGULATION');
addFigure('FIG_RAMA_IND', 'Rama', 'Hero', 'Indian', 'Righteousness, Kingship, Exile, Combat', 'Ramachandra', 'Incarnation of Vishnu and hero of the Ramayana.', 'Son of Dasharatha. Husband of Sita.', 'IND_RAMAYANA_GRIFFITH', 'ARCH_HERO', 'FUNC_SOVEREIGNTY_MAGICAL', 'COG_MORAL_REGULATION');
addFigure('FIG_SITA_IND', 'Sita', 'Heroine', 'Indian', 'Fidelity, Endurance, Purity, Suffering', 'Janaki', 'Wife of Rama.', 'Daughter of Janaka. Abducted by Ravana.', 'IND_RAMAYANA_GRIFFITH', 'ARCH_INNOCENT_YOUTH', 'FUNC_GUARDIAN_PROTECTOR', 'COG_MORAL_REGULATION');
addFigure('FIG_LAKSHMANA_IND', 'Lakshmana', 'Hero', 'Indian', 'Loyalty, Service, Sacrifice', 'Lakhan', 'Devoted brother of Rama.', 'Son of Sumitra.', 'IND_RAMAYANA_GRIFFITH', 'ARCH_LOYAL_COMPANION', 'FUNC_WARRIOR', 'COG_COOPERATION_FACILITATION');
addFigure('FIG_HANUMAN_IND', 'Hanuman', 'Vanara', 'Indian', 'Devotion, Strength, Service, Messenger', 'Anjaneya', 'Divine monkey warrior devoted to Rama.', 'Son of Vayu.', 'IND_RAMAYANA_GRIFFITH', 'ARCH_LOYAL_COMPANION', 'FUNC_WARRIOR', 'COG_COOPERATION_FACILITATION');
addFigure('FIG_RAVANA_IND', 'Ravana', 'Demon King', 'Indian', 'Pride, Knowledge, Tyranny, Ascetic Power', 'Dashaanana', 'Ten-headed demon king of Lanka.', 'Son of Vishrava.', 'IND_RAMAYANA_GRIFFITH', 'ARCH_SHADOW_FIGURE', 'FUNC_ANTAGONIST_OBSTRUCTER', 'COG_STATUS_HIERARCHY_LEGITIMATION');
addFigure('FIG_KUMBRAKARNA_IND', 'Kumbhakarna', 'Rakshasa', 'Indian', 'Gluttony, Strength, Slumber', '', 'Giant brother of Ravana.', 'Son of Vishrava.', 'IND_RAMAYANA_GRIFFITH', '', 'FUNC_WARRIOR', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_VIBHISHANA_IND', 'Vibhishana', 'Rakshasa', 'Indian', 'Righteousness, Defection, Counsel', '', 'Righteous brother of Ravana.', 'Son of Vishrava.', 'IND_RAMAYANA_GRIFFITH', 'ARCH_WISE_OLD_MENTOR', 'FUNC_ORACLE_PROPHET_FUNCTION', 'COG_MORAL_REGULATION');
addFigure('FIG_SUGRIVA_IND', 'Sugriva', 'Vanara King', 'Indian', 'Exile, Alliance, Kingship', '', 'Exiled monkey king allied with Rama.', 'Brother of Vali.', 'IND_RAMAYANA_GRIFFITH', 'ARCH_SOVEREIGN_RULER', 'FUNC_SOVEREIGNTY_MAGICAL', 'COG_STATUS_HIERARCHY_LEGITIMATION');
addFigure('FIG_ANGADA_IND', 'Angada', 'Vanara', 'Indian', 'Messenger, Diplomacy, Strength', '', 'Son of Vali and Tara.', 'Nephew of Sugriva.', 'IND_RAMAYANA_GRIFFITH', 'ARCH_HERALD', 'FUNC_HERALD_MESSENGER', 'COG_COOPERATION_FACILITATION');
addFigure('FIG_JATAYU_IND', 'Jatayu', 'Bird', 'Indian', 'Sacrifice, Loyalty, Combat', '', 'Great vulture who dies trying to rescue Sita.', 'Son of Aruna.', 'IND_RAMAYANA_GRIFFITH', 'ARCH_SACRIFICIAL_FIGURE', 'FUNC_GUARDIAN_PROTECTOR', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_KRISHNA_IND', 'Krishna', 'Avatar;Deity', 'Indian', 'Divine Play, Counsel, War, Love', 'Vasudeva', 'Incarnation of Vishnu; speaker of the Bhagavad Gita.', 'Son of Devaki. Cousin of Arjuna.', 'IND_MAHABHARATA_GANGULI', 'ARCH_WISE_OLD_MENTOR', 'FUNC_ORACLE_PROPHET_FUNCTION', 'COG_MORAL_REGULATION');
addFigure('FIG_ARJUNA_IND', 'Arjuna', 'Hero', 'Indian', 'Skill, Honor, Doubt, Duty', 'Partha', 'Greatest warrior of the Pandavas.', 'Son of Indra. Husband of Draupadi.', 'IND_MAHABHARATA_GANGULI', 'ARCH_HERO', 'FUNC_WARRIOR', 'COG_MORAL_REGULATION');
addFigure('FIG_YUDHISTHIRA_IND', 'Yudhishthira', 'King', 'Indian', 'Righteousness, Truth, Gambling, Suffering', 'Dharmaraja', 'Eldest Pandava and rightful king.', 'Son of Dharma/Yama.', 'IND_MAHABHARATA_GANGULI', 'ARCH_SOVEREIGN_RULER', 'FUNC_SOVEREIGNTY_PRIESTLY', 'COG_MORAL_REGULATION');
addFigure('FIG_BHIMA_IND', 'Bhima', 'Hero', 'Indian', 'Strength, Wrath, Gluttony, Vengeance', 'Vrikodara', 'Mightiest Pandava warrior.', 'Son of Vayu.', 'IND_MAHABHARATA_GANGULI', 'ARCH_WARRIOR_HERO', 'FUNC_WARRIOR', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_DRAUPADI_IND', 'Draupadi', 'Queen', 'Indian', 'Honor, Suffering, Vengeance, Polyandry', 'Panchali', 'Wife of the five Pandavas.', 'Daughter of Drupada.', 'IND_MAHABHARATA_GANGULI', 'ARCH_FEMME_FATALE_HOMME_FATAL', 'FUNC_SOVEREIGNTY_GODDESS', 'COG_STATUS_HIERARCHY_LEGITIMATION');
addFigure('FIG_KARNA_IND', 'Karna', 'Hero', 'Indian', 'Honor, Tragedy, Loyalty, Charity', 'Vasusena', 'Greatest warrior of the Kauravas.', 'Son of Surya. Raised by a charioteer.', 'IND_MAHABHARATA_GANGULI', 'ARCH_TRAGIC_HERO', 'FUNC_WARRIOR', 'COG_MORAL_REGULATION');
addFigure('FIG_DURYODHANA_IND', 'Duryodhana', 'Prince', 'Indian', 'Pride, Envy, Kingship, War', 'Suyodhana', 'Eldest Kaurava.', 'Son of Dhritarashtra.', 'IND_MAHABHARATA_GANGULI', 'ARCH_SHADOW_FIGURE', 'FUNC_ANTAGONIST_OBSTRUCTER', 'COG_STATUS_HIERARCHY_LEGITIMATION');
addFigure('FIG_BHISHMA_IND', 'Bhishma', 'Elder', 'Indian', 'Vows, Duty, War, Sacrifice', 'Devavrata', 'Grandsire of the Kuru dynasty.', 'Son of Shantanu.', 'IND_MAHABHARATA_GANGULI', 'ARCH_WISE_OLD_MENTOR', 'FUNC_GUARDIAN_PROTECTOR', 'COG_MORAL_REGULATION');
addFigure('FIG_DRONA_IND', 'Drona', 'Teacher', 'Indian', 'Martial Arts, Loyalty, Vengeance', '', 'Master archer and teacher.', 'Son of Bharadwaja.', 'IND_MAHABHARATA_GANGULI', 'ARCH_WISE_OLD_MENTOR', 'FUNC_WARRIOR', 'COG_MEMORY_TRANSMISSION');
addFigure('FIG_KUNTI_IND', 'Kunti', 'Queen', 'Indian', 'Motherhood, Sacrifice, Secrecy', 'Pritha', 'Mother of the Pandavas and Karna.', 'Daughter of Kuntibhoja.', 'IND_MAHABHARATA_GANGULI', 'ARCH_DIVINE_MOTHER', 'FUNC_MOTHER', 'COG_GROUP_IDENTITY');
addFigure('FIG_GANDHARI_IND', 'Gandhari', 'Queen', 'Indian', 'Blindness, Devotion, Suffering, Prophecy', '', 'Blindfolded queen of Hastinapura.', 'Wife of Dhritarashtra.', 'IND_MAHABHARATA_GANGULI', 'ARCH_SOVEREIGNTY_GODDESS', 'FUNC_SOVEREIGNTY_PRIESTLY', 'COG_MORAL_REGULATION');
addFigure('FIG_SHAKUNI_IND', 'Shakuni', 'Prince', 'Indian', 'Deceit, Gambling, Vengeance', '', 'Master gambler and uncle of the Kauravas.', 'Brother of Gandhari.', 'IND_MAHABHARATA_GANGULI', 'ARCH_TRICKSTER_ARCHETYPE', 'FUNC_TRICKSTER_MEDIATOR', 'COG_INTUITIVE_ONTOLOGY_MANIPULATION');
addFigure('FIG_VYASA_IND', 'Vyasa', 'Sage', 'Indian', 'Authorship, Lineage, Wisdom', 'Veda Vyasa', 'Compiler of the Vedas and narrator of the Mahabharata.', 'Son of Parashara and Satyavati.', 'IND_MAHABHARATA_GANGULI', 'ARCH_WISE_OLD_MENTOR', 'FUNC_ORACLE_PROPHET_FUNCTION', 'COG_MEMORY_TRANSMISSION');
addFigure('FIG_KAIKEYI_IND', 'Kaikeyi', 'Queen', 'Indian', 'Motherhood;Jealousy;Exile', '', 'Queen of Ayodhya and mother of Bharata.', 'Wife of Dasharatha. Step-mother of Rama.', 'IND_RAMAYANA_GRIFFITH', 'ARCH_SHADOW_FIGURE', 'FUNC_SOVEREIGNTY_GODDESS', 'COG_MORAL_REGULATION');

// Japanese
addFigure('FIG_AMATERASU_JPN', 'Amaterasu', 'Deity', 'Japanese', 'Sun, Imperial Ancestry, Light', 'Amaterasu-ōmikami;Heaven-Shining;Heaven-Shining-Great-August-Deity', 'Sun goddess and ancestor of the imperial line.', 'Daughter of Izanagi.', 'JPN_KOJIKI_CHAMBERLAIN', 'ARCH_SOLAR_DEITY', 'FUNC_SOVEREIGNTY_MAGICAL', 'COG_AGENCY_DETECTION');
addFigure('FIG_SUSANOO_JPN', 'Susanoo', 'Deity', 'Japanese', 'Storms, Sea, Chaos, Heroism', 'Takehaya Susanoo-no-Mikoto;Swift-Impetuous;Swift-Impetuous-Male-Augustness;His-Swift-Impetuous-Male-Augustness;Brave-Awful-Possessing-Male-Deity', 'Storm god who slays Yamata no Orochi.', 'Son of Izanagi. Brother of Amaterasu.', 'JPN_KOJIKI_CHAMBERLAIN', 'ARCH_TRICKSTER_ARCHETYPE', 'FUNC_WARRIOR', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_TSUKUYOMI_JPN', 'Tsukuyomi', 'Deity', 'Japanese', 'Moon, Night', 'Tsukuyomi-no-Mikoto', 'Moon god.', 'Brother of Amaterasu and Susanoo.', 'JPN_KOJIKI_CHAMBERLAIN', '', 'FUNC_SOVEREIGNTY_PRIESTLY', 'COG_AGENCY_DETECTION');
addFigure('FIG_IZANAGI_JPN', 'Izanagi', 'Deity', 'Japanese', 'Creation, Life', 'Izanaki;Male-Who-Invites;mas-qui-invitat', 'Male creator god.', 'Husband of Izanami.', 'JPN_KOJIKI_CHAMBERLAIN', 'ARCH_CREATOR_DEMIURGE', 'FUNC_CREATOR_DEMIURGE', 'COG_AGENCY_DETECTION');
addFigure('FIG_IZANAMI_JPN', 'Izanami', 'Deity', 'Japanese', 'Creation, Death', 'Izanami-no-Mikoto;Female-Who-Invites;femina-qui-invitat', 'Female creator goddess.', 'Wife of Izanagi. Died giving birth to fire.', 'JPN_KOJIKI_CHAMBERLAIN', 'ARCH_EARTH_MOTHER', 'FUNC_CREATOR_DEMIURGE', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_NINIGI_JPN', 'Ninigi', 'Deity', 'Japanese', 'Rice, Earth, Imperial Descent', 'Ninigi-no-Mikoto;Heavenly-Grandchild;Heavenly-Young-Prince', 'Grandson of Amaterasu sent to rule the earth.', 'Son of Ame-no-oshihomimi.', 'JPN_KOJIKI_CHAMBERLAIN', 'ARCH_DIVINE_CHILD', 'FUNC_SOVEREIGNTY_MAGICAL', 'COG_STATUS_HIERARCHY_LEGITIMATION');
addFigure('FIG_HACHIMAN_JPN', 'Hachiman', 'Deity', 'Japanese', 'War, Archery, Agriculture', 'Yahata', 'God of war and divine protector of Japan.', 'Deified Emperor Ojin.', 'JPN_KOJIKI_CHAMBERLAIN', 'ARCH_WARRIOR_HERO', 'FUNC_WARRIOR', 'COG_GROUP_IDENTITY');
addFigure('FIG_OKUNINUSHI_JPN', 'Okuninushi', 'Deity', 'Japanese', 'Land, Medicine, Marriage', 'Onamuji;Oho-kuni-nushi;Great-Land-Master;Master-of-the-Great-Land;Deity-of-Eight-Thousand-Spears;Eight-Thousand-Spears', 'God of the land and medicine.', 'Son of Susanoo.', 'JPN_KOJIKI_CHAMBERLAIN', 'ARCH_CULTURE_HERO_ARCHETYPE', 'FUNC_CIVILIZER_CULTURE_HERO', 'COG_COOPERATION_FACILITATION');
addFigure('FIG_JIMMU_JPN', 'Jimmu', 'Emperor', 'Japanese', 'Imperial descent;Conquest;Founding', 'Kamu-yamato-ihare-biko;Divine-Yamato-Ihare-Prince', 'Legendary first emperor of Japan.', 'Descendant of Amaterasu.', 'JPN_KOJIKI_CHAMBERLAIN', 'ARCH_FOUNDING_ANCESTOR', 'FUNC_SOVEREIGNTY_MAGICAL', 'COG_STATUS_HIERARCHY_LEGITIMATION');

// Finnish
addFigure('FIG_VAINAMOINEN_FIN', 'Väinämöinen', 'Hero;Sage', 'Finnish', 'Magic, Song, Creation, Wisdom', 'Wainamoinen', 'Eternal sage and singer.', 'Son of Ilmatar.', 'FINN_KALEVALA_CRAWFORD', 'ARCH_CULTURE_HERO_ARCHETYPE', 'FUNC_SHAMAN_PRIEST', 'COG_MEMORY_TRANSMISSION');
addFigure('FIG_ILMARINEN_FIN', 'Ilmarinen', 'Smith', 'Finnish', 'Forge, Craft, Marriage', 'Ilmarinen', 'Divine smith who forges the Sampo.', 'Brother of Väinämöinen.', 'FINN_KALEVALA_CRAWFORD', 'ARCH_CULTURE_HERO_ARCHETYPE', 'FUNC_CRAFTSMAN_SMITH', 'COG_INTUITIVE_ONTOLOGY_MANIPULATION');
addFigure('FIG_LEMMINKAINEN_FIN', 'Lemminkäinen', 'Hero', 'Finnish', 'Adventure, Recklessness, Resurrection', 'Lemminkainen', 'Reckless hero who dies and is resurrected.', 'Son of Lempi.', 'FINN_KALEVALA_CRAWFORD', 'ARCH_HERO', 'FUNC_WARRIOR', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_KULLERVO_FIN', 'Kullervo', 'Tragic Hero', 'Finnish', 'Tragedy, Incest, Revenge', '', 'Tragic orphan who commits incest and suicide.', 'Son of Kalervo.', 'FINN_KALEVALA_CRAWFORD', 'ARCH_TRAGIC_HERO', 'FUNC_WARRIOR', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_LOUHI_FIN', 'Louhi', 'Witch', 'Finnish', 'Sorcery, Northland, Hostility', 'Pohjolan emäntä', 'Mistress of Pohjola.', 'Mother of the Maiden of the North.', 'FINN_KALEVALA_CRAWFORD', 'ARCH_PRIMORDIAL_ANTAGONIST', 'FUNC_WITCH_SORCERESS', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_ILMATAR_FIN', 'Ilmatar', 'Goddess', 'Finnish', 'Air, Creation, Motherhood', 'Luonnotar', 'Primordial air goddess.', 'Daughter of the air.', 'FINN_KALEVALA_CRAWFORD', 'ARCH_EARTH_MOTHER', 'FUNC_CREATOR_DEMIURGE', 'COG_AGENCY_DETECTION');
addFigure('FIG_UKKO_FIN', 'Ukko', 'Deity', 'Finnish', 'Thunder, Sky, Rain, Fertility', 'Ukko ylijumala', 'Supreme sky god and thunder deity.', 'Husband of Rauni.', 'FINN_KALEVALA_CRAWFORD', 'ARCH_THUNDER_WARRIOR_GOD', 'FUNC_WARRIOR', 'COG_AGENCY_DETECTION');
addFigure('FIG_MARIATTA_FIN', 'Mariatta', 'Virgin Mother', 'Finnish', 'Virginity, Motherhood, Purity', '', 'Virgin mother whose child displaces Väinämöinen.', 'Found in the forest.', 'FINN_KALEVALA_CRAWFORD', 'ARCH_VIRGIN_MOTHER', 'FUNC_MOTHER', 'COG_GROUP_IDENTITY');

// Welsh
addFigure('FIG_PWYLL_WEL', 'Pwyll', 'Prince', 'Welsh', 'Hunting, Hospitality, Exchange', '', 'Prince of Dyfed.', 'Lord of Dyfed. Marries Rhiannon.', 'WELSH_MABINOGION_GUEST', 'ARCH_HERO', 'FUNC_SOVEREIGNTY_MAGICAL', 'COG_STATUS_HIERARCHY_LEGITIMATION');
addFigure('FIG_RHIANNON_WEL', 'Rhiannon', 'Goddess;Queen', 'Welsh', 'Horses, Fertility, Suffering, Magic', 'Rigantona', 'Otherworldly queen associated with horses.', 'Wife of Pwyll. Mother of Pryderi.', 'WELSH_MABINOGION_GUEST', 'ARCH_EARTH_MOTHER', 'FUNC_FERTILITY_PROSPERITY', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_BRANWEN_WEL', 'Branwen', 'Princess', 'Welsh', 'Beauty, Suffering, War', '', 'Beautiful daughter of Llyr.', 'Sister of Bendigeidfran.', 'WELSH_MABINOGION_GUEST', 'ARCH_TRAGIC_FIGURE', 'FUNC_KINSHIP_MEDIATOR', 'COG_GROUP_IDENTITY');
addFigure('FIG_BENDIGEIDFRAN_WEL', 'Bendigeidfran', 'Giant King', 'Welsh', 'Kingship, Giant, Protection, Prophecy', 'Bran the Blessed', 'Giant king of Britain.', 'Son of Llyr. Brother of Branwen.', 'WELSH_MABINOGION_GUEST', 'ARCH_SOVEREIGN_RULER', 'FUNC_GUARDIAN_PROTECTOR', 'COG_STATUS_HIERARCHY_LEGITIMATION');
addFigure('FIG_MANAWYDAN_WEL', 'Manawydan', 'Prince', 'Welsh', 'Craft, Patience, Loyalty', '', 'Loyal companion of Bendigeidfran.', 'Son of Llyr.', 'WELSH_MABINOGION_GUEST', 'ARCH_LOYAL_COMPANION', 'FUNC_CRAFTSMAN_SMITH', 'COG_COOPERATION_FACILITATION');
addFigure('FIG_MATH_WEL', 'Math', 'King', 'Welsh', 'Magic, War, Foot-holder', '', 'Magical king of Gwynedd.', 'Son of Mathonwy.', 'WELSH_MABINOGION_GUEST', 'ARCH_SOVEREIGN_RULER', 'FUNC_SOVEREIGNTY_MAGICAL', 'COG_STATUS_HIERARCHY_LEGITIMATION');
addFigure('FIG_GWYDION_WEL', 'Gwydion', 'Magician', 'Welsh', 'Magic, Trickery, Poetry, Transformation', '', 'Master magician and trickster.', 'Nephew of Math.', 'WELSH_MABINOGION_GUEST', 'ARCH_TRICKSTER_ARCHETYPE', 'FUNC_DRUID_MAGICIAN', 'COG_INTUITIVE_ONTOLOGY_MANIPULATION');
addFigure('FIG_LLEU_WEL', 'Lleu', 'Hero', 'Welsh', 'Light, Destiny, Betrayal, Resilience', 'Llew Llaw Gyffes', 'Hero born with a curse.', 'Son of Arianrhod. Shaped by Gwydion.', 'WELSH_MABINOGION_GUEST', 'ARCH_HERO', 'FUNC_WARRIOR', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_BLODEUWEDD_WEL', 'Blodeuwedd', 'Enchantress', 'Welsh', 'Beauty, Betrayal, Transformation', 'Blodeuwedd', 'Woman made of flowers.', 'Created by Gwydion and Math.', 'WELSH_MABINOGION_GUEST', 'ARCH_FEMME_FATALE_HOMME_FATAL', 'FUNC_FEMME_FATALE', 'COG_INTUITIVE_ONTOLOGY_MANIPULATION');
addFigure('FIG_KILHWCH_WEL', 'Culhwch', 'Hero', 'Welsh', 'Quest, Love, Giant-slaying', '', 'Hero who seeks to marry Olwen.', 'Son of Cilydd. Cousin of Arthur.', 'WELSH_MABINOGION_GUEST', 'ARCH_HERO', 'FUNC_WARRIOR', 'COG_GROUP_IDENTITY');
addFigure('FIG_OLwen_WEL', 'Olwen', 'Princess', 'Welsh', 'Beauty, Love, Spring', '', 'Beautiful daughter of Ysbaddaden.', 'Wife of Culhwch.', 'WELSH_MABINOGION_GUEST', 'ARCH_INNOCENT_YOUTH', 'FUNC_FERTILITY_PROSPERITY', 'COG_GROUP_IDENTITY');
addFigure('FIG_PEREDUR_WEL', 'Peredur', 'Hero', 'Welsh', 'Quest, Grail, Madness', 'Perceval', 'Welsh hero whose adventures parallel the Grail quest.', 'Son of Efrawg.', 'WELSH_MABINOGION_GUEST', 'ARCH_HERO', 'FUNC_WARRIOR', 'COG_GROUP_IDENTITY');
addFigure('FIG_KINGARTHUR_WEL', 'Arthur', 'King', 'Welsh', 'Kingship, War, Law', '', 'King of Britain.', 'Son of Uther.', 'WELSH_MABINOGION_GUEST', 'ARCH_SOVEREIGN_RULER', 'FUNC_SOVEREIGNTY_MAGICAL', 'COG_STATUS_HIERARCHY_LEGITIMATION');
addFigure('FIG_GERAINT_WELSH', 'Geraint', 'Hero', 'Welsh', 'Love;Knighthood;Tournament', '', 'Welsh hero and knight of Arthur\'s court.', 'Son of Erbin. Husband of Enid.', 'WELSH_MABINOGION_GUEST', 'ARCH_HERO', 'FUNC_WARRIOR', 'COG_GROUP_IDENTITY');
addFigure('FIG_OWAIN_WELSH', 'Owain', 'Knight', 'Welsh', 'Chivalry;Adventure;Marriage', 'Yvain;Ywain', 'Knight of the Round Table.', 'Son of Urien.', 'WELSH_MABINOGION_GUEST', 'ARCH_HERO', 'FUNC_WARRIOR', 'COG_GROUP_IDENTITY');
addFigure('FIG_ARIANROD_WELSH', 'Arianrod', 'Goddess', 'Welsh', 'Birth;Fate;Magic;Sky', 'Arianrhod', 'Goddess of birth and fate.', 'Daughter of Dôn. Mother of Lleu.', 'WELSH_MABINOGION_GUEST', 'ARCH_FATE_WEAVER', 'FUNC_SOVEREIGNTY_GODDESS', 'COG_STATUS_HIERARCHY_LEGITIMATION');
addFigure('FIG_CERIDWEN_WELSH', 'Ceridwen', 'Witch;Poet', 'Welsh', 'Inspiration;Transformation;Wisdom', '', 'Enchantress who brews a potion of wisdom.', 'Mother of Afagddu.', 'WELSH_MABINOGION_GUEST', 'ARCH_WITCH_SORCERESS', 'FUNC_MAGICIAN_MEDIATOR', 'COG_INTUITIVE_ONTOLOGY_MANIPULATION');

// Irish
addFigure('FIG_CUCHULAINN_IR', 'Cú Chulainn', 'Hero', 'Irish', 'Battle, Warp-spasm, Honor, Youth', 'Cuchulain;Setanta', 'Greatest Irish hero.', 'Son of Sualtam and Deichtine.', 'IRISH_TAIN_BO_CUAILNGE_FARADAY', 'ARCH_HERO', 'FUNC_WARRIOR', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_MEDB_IR', 'Medb', 'Queen', 'Irish', 'Kingship, War, Greed, Sexuality', 'Maeve', 'Warrior queen of Connacht.', 'Wife of Ailill.', 'IRISH_TAIN_BO_CUAILNGE_FARADAY', 'ARCH_SOVEREIGNTY_GODDESS', 'FUNC_SOVEREIGNTY_MAGICAL', 'COG_STATUS_HIERARCHY_LEGITIMATION');
addFigure('FIG_AILILL_IR', 'Ailill', 'King', 'Irish', 'Kingship, Jealousy, Marriage', '', 'King of Connacht.', 'Marries Medb.', 'IRISH_TAIN_BO_CUAILNGE_FARADAY', 'ARCH_SHADOW_FIGURE', 'FUNC_SOVEREIGNTY_MAGICAL', 'COG_STATUS_HIERARCHY_LEGITIMATION');
addFigure('FIG_FERGUS_IR', 'Fergus', 'Exile;Warrior', 'Irish', 'Exile, Strength, Lust, Honor', '', 'Exiled Ulster king.', 'Former king of Ulster.', 'IRISH_TAIN_BO_CUAILNGE_FARADAY', 'ARCH_WARRIOR_HERO', 'FUNC_WARRIOR', 'COG_GROUP_IDENTITY');
addFigure('FIG_CONCHOBAR_IR', 'Conchobar', 'King', 'Irish', 'Kingship, Ulster, Tragedy', 'Conchubar', 'King of Ulster.', 'Son of Ness.', 'IRISH_TAIN_BO_CUAILNGE_FARADAY', 'ARCH_SOVEREIGN_RULER', 'FUNC_SOVEREIGNTY_MAGICAL', 'COG_STATUS_HIERARCHY_LEGITIMATION');
addFigure('FIG_MORRIGAN_IR', 'Morrigan', 'Goddess', 'Irish', 'War, Death, Prophecy, Fertility', 'Morrigu', 'Goddess of war and fate.', 'Triple goddess with Badb and Macha.', 'IRISH_TAIN_BO_CUAILNGE_FARADAY', 'ARCH_FATE_WEAVER', 'FUNC_WARRIOR', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_SCATHACH_IR', 'Scáthach', 'Warrior', 'Irish', 'Training, War, Shadows', '', 'Warrior woman who trains Cú Chulainn.', 'Daughter of Ardgeimmer.', 'IRISH_TAIN_BO_CUAILNGE_FARADAY', 'ARCH_WISE_OLD_MENTOR', 'FUNC_WARRIOR', 'COG_MEMORY_TRANSMISSION');
addFigure('FIG_FERDIA_IR', 'Ferdia', 'Warrior', 'Irish', 'Friendship, Tragedy, Duel', '', 'Cú Chulainn\'s foster-brother.', 'Trained with Cú Chulainn under Scáthach.', 'IRISH_TAIN_BO_CUAILNGE_FARADAY', 'ARCH_TRAGIC_FIGURE', 'FUNC_WARRIOR', 'COG_COOPERATION_FACILITATION');
addFigure('FIG_LAEG_IRISH', 'Láeg', 'Charioteer', 'Irish', 'Loyalty;Combat;Speed', 'Laeg;Loeg', 'Faithful charioteer of Cú Chulainn.', 'Constant companion to Cú Chulainn.', 'IRISH_TAIN_BO_CUAILNGE_FARADAY', 'ARCH_LOYAL_COMPANION', 'FUNC_WARRIOR', 'COG_COOPERATION_FACILITATION');
addFigure('FIG_CORMAC_COND_LONGAS_IRISH', 'Cormac Cond Longas', 'Exile;Prince', 'Irish', 'Exile;Loyalty;Kingship', '', 'Exiled son of Conchobar.', 'Sides with Medb in the Táin.', 'IRISH_TAIN_BO_CUAILNGE_FARADAY', 'ARCH_TRAGIC_FIGURE', 'FUNC_SOVEREIGNTY_MAGICAL', 'COG_STATUS_HIERARCHY_LEGITIMATION');
addFigure('FIG_LUG_IRISH', 'Lug', 'Deity;Hero', 'Irish', 'Skill;Kingship;Sorcery;War', 'Lugh', 'Many-skilled god of light and crafts.', 'Samildánach. Father of Cú Chulainn.', 'IRISH_TAIN_BO_CUAILNGE_FARADAY', 'ARCH_CULTURE_HERO_ARCHETYPE', 'FUNC_WARRIOR', 'COG_AGENCY_DETECTION');

// Maya
addFigure('FIG_HUNHUNAHPU_MYA', 'Hun Hunahpu', 'Deity', 'Maya', 'Death, Underworld, Ball Game', 'One Hunahpu', 'Father of the Hero Twins.', 'Husband of Xquic.', 'MAYA_POPOL_VUH_GOETZ', 'ARCH_SACRIFICIAL_FIGURE', 'FUNC_SOVEREIGNTY_PRIESTLY', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_HUNAHPU_MYA', 'Hunahpu', 'Hero', 'Maya', 'Trickery, Resurrection, Sun', '', 'One of the Hero Twins.', 'Son of Hun Hunahpu and Xquic.', 'MAYA_POPOL_VUH_GOETZ', 'ARCH_CULTURE_HERO_ARCHETYPE', 'FUNC_TRICKSTER_MEDIATOR', 'COG_AGENCY_DETECTION');
addFigure('FIG_XBALANQUE_MYA', 'Xbalanque', 'Hero', 'Maya', 'Magic, Resurrection, Moon', '', 'One of the Hero Twins.', 'Son of Hun Hunahpu and Xquic.', 'MAYA_POPOL_VUH_GOETZ', 'ARCH_CULTURE_HERO_ARCHETYPE', 'FUNC_TRICKSTER_MEDIATOR', 'COG_AGENCY_DETECTION');
addFigure('FIG_XMUCANE_MYA', 'Xmucane', 'Grandmother', 'Maya', 'Maize, Divination, Corn', 'Xpiacoc', 'Grandmother of the Hero Twins.', 'Wife of Xpiyacoc.', 'MAYA_POPOL_VUH_GOETZ', 'ARCH_EARTH_MOTHER', 'FUNC_FERTILITY_PROSPERITY', 'COG_GROUP_IDENTITY');
addFigure('FIG_XPIYACOC_MYA', 'Xpiyacoc', 'Grandfather', 'Maya', 'Divination, Creation', 'Xpiacoc', 'Grandfather of the Hero Twins.', 'Husband of Xmucane.', 'MAYA_POPOL_VUH_GOETZ', 'ARCH_WISE_OLD_MENTOR', 'FUNC_ORACLE_PROPHET_FUNCTION', 'COG_MEMORY_TRANSMISSION');
addFigure('FIG_VUCUBCAQUIX_MYA', 'Vucub-Caquix', 'Demon Bird', 'Maya', 'Pride, False Sun, Hubris', 'Seven Macaw', 'False sun bird.', 'Proud demon bird.', 'MAYA_POPOL_VUH_GOETZ', 'ARCH_SHADOW_FIGURE', 'FUNC_ANTAGONIST_OBSTRUCTER', 'COG_STATUS_HIERARCHY_LEGITIMATION');
addFigure('FIG_ZIPACNA_MYA', 'Zipacna', 'Monster', 'Maya', 'Pride, Deception, Earthquake', 'Zipacna', 'Arrogant crocodile demon.', 'Son of Vucub-Caquix.', 'MAYA_POPOL_VUH_GOETZ', 'ARCH_SHADOW_FIGURE', 'FUNC_ANTAGONIST_OBSTRUCTER', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_CABRACAN_MYA', 'Cabracan', 'Monster', 'Maya', 'Pride, Earthquake, Mountains', 'Cabrakan', 'Earthquake demon.', 'Son of Vucub-Caquix.', 'MAYA_POPOL_VUH_GOETZ', 'ARCH_SHADOW_FIGURE', 'FUNC_ANTAGONIST_OBSTRUCTER', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_HURAKAN_MYA', 'Hurakan', 'Deity', 'Maya', 'Storm, Creation, Wind', 'Huracan', 'Storm god of creation.', 'Heart of Sky.', 'MAYA_POPOL_VUH_GOETZ', 'ARCH_CREATOR_DEMIURGE', 'FUNC_CREATOR_DEMIURGE', 'COG_AGENCY_DETECTION');
addFigure('FIG_QUETZALCOATL_MYA', 'Quetzalcoatl', 'Deity', 'Maya', 'Wind, Creation, Wisdom', 'Gucumatz;Kukulkan', 'Feathered serpent god.', 'Heart of Sky.', 'MAYA_POPOL_VUH_GOETZ', 'ARCH_CREATOR_DEMIURGE', 'FUNC_CREATOR_DEMIURGE', 'COG_AGENCY_DETECTION');
addFigure('FIG_TEPEU_MYA', 'Tepeu', 'Deity', 'Maya', 'Creation, Sovereignty', '', 'Creator god.', 'Heart of Sky.', 'MAYA_POPOL_VUH_GOETZ', 'ARCH_CREATOR_DEMIURGE', 'FUNC_CREATOR_DEMIURGE', 'COG_AGENCY_DETECTION');

// Persian
addFigure('FIG_ROSTAM_PER', 'Rostam', 'Hero', 'Persian', 'Strength, Honor, Tragedy, Kingship', 'Rustem;Rustam', 'Greatest Persian hero.', 'Son of Zal.', 'PER_SHAHNAMEH_ATKINSON', 'ARCH_HERO', 'FUNC_WARRIOR', 'COG_GROUP_IDENTITY');
addFigure('FIG_ZAL_PER', 'Zal', 'Prince', 'Persian', 'Wisdom, Lineage, White Hair', '', 'White-haired prince raised by the Simurgh.', 'Son of Sam.', 'PER_SHAHNAMEH_ATKINSON', 'ARCH_WISE_OLD_MENTOR', 'FUNC_WARRIOR', 'COG_MEMORY_TRANSMISSION');
addFigure('FIG_SOHRAB_PER', 'Sohrab', 'Hero', 'Persian', 'Youth, Tragedy, Unrecognized Son', '', 'Young warrior killed by his father Rostam.', 'Son of Rostam and Tahmineh.', 'PER_SHAHNAMEH_ATKINSON', 'ARCH_TRAGIC_HERO', 'FUNC_WARRIOR', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_SIYAVASH_PER', 'Siyavash', 'Prince', 'Persian', 'Purity, Martyrdom, Betrayal', 'Siyavush', 'Prince of exemplary purity.', 'Son of Kay Kavus.', 'PER_SHAHNAMEH_ATKINSON', 'ARCH_SACRIFICIAL_FIGURE', 'FUNC_SOVEREIGNTY_PRIESTLY', 'COG_MORAL_REGULATION');
addFigure('FIG_ISFANDIYAR_PER', 'Isfandiyar', 'Prince', 'Persian', 'Fate, Bravery, Sacrifice', '', 'Prince destined to die at Rostam\'s hands.', 'Son of Gushtasp.', 'PER_SHAHNAMEH_ATKINSON', 'ARCH_TRAGIC_HERO', 'FUNC_WARRIOR', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_KAYKAVUS_PER', 'Kay Kavus', 'King', 'Persian', 'Pride, Foolishness, Kingship', 'Kai Kavus', 'Proud king whose hubris leads to disaster.', 'Grandfather of Rostam.', 'PER_SHAHNAMEH_ATKINSON', 'ARCH_SHADOW_FIGURE', 'FUNC_SOVEREIGNTY_MAGICAL', 'COG_STATUS_HIERARCHY_LEGITIMATION');
addFigure('FIG_KAYKHOSROW_PER', 'Kay Khosrow', 'King', 'Persian', 'Justice, Wisdom, Kingship', '', 'Wise king and son of Siyavash.', 'Son of Siyavash and Farangis.', 'PER_SHAHNAMEH_ATKINSON', 'ARCH_SOVEREIGN_RULER', 'FUNC_SOVEREIGNTY_MAGICAL', 'COG_STATUS_HIERARCHY_LEGITIMATION');
addFigure('FIG_TAHMINEH_PER', 'Tahmineh', 'Princess', 'Persian', 'Love, Motherhood, Night', '', 'Princess of Samangan who bears Sohrab.', 'Daughter of the king of Samangan.', 'PER_SHAHNAMEH_ATKINSON', '', 'FUNC_MOTHER', 'COG_GROUP_IDENTITY');
addFigure('FIG_RUDABA_PER', 'Rudaba', 'Princess', 'Persian', 'Beauty, Love', '', 'Princess loved by Zal.', 'Daughter of Mehrab.', 'PER_SHAHNAMEH_ATKINSON', 'ARCH_FEMME_FATALE_HOMME_FATAL', 'FUNC_FERTILITY_PROSPERITY', 'COG_GROUP_IDENTITY');
addFigure('FIG_AFRASIYAB_PER', 'Afrasiyab', 'King', 'Persian', 'Tyranny, War, Vengeance', '', 'King of Turan and archenemy of the Persians.', 'Descendant of Tur.', 'PER_SHAHNAMEH_ATKINSON', 'ARCH_SHADOW_FIGURE', 'FUNC_ANTAGONIST_OBSTRUCTER', 'COG_STATUS_HIERARCHY_LEGITIMATION');

// Germanic
addFigure('FIG_SIEGFRIED_GER', 'Siegfried', 'Hero', 'Germanic', 'Dragon-slaying, Invulnerability, Betrayal', 'Sigurd', 'Dragon-slaying hero.', 'Son of Siegmund. Husband of Kriemhild.', 'GER_NIBELUNGENLIED', 'ARCH_HERO', 'FUNC_WARRIOR', 'COG_GROUP_IDENTITY');
addFigure('FIG_KRIEMHILD_GER', 'Kriemhild', 'Queen', 'Germanic', 'Vengeance, Grief, Treachery', 'Gudrun;Grimhild', 'Widow of Siegfried who avenges his murder.', 'Sister of Gunther.', 'GER_NIBELUNGENLIED', 'ARCH_TRAGIC_FIGURE', 'FUNC_SOVEREIGNTY_MAGICAL', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_BRUNHILD_GER', 'Brunhild', 'Queen', 'Germanic', 'Strength, Honor, Deception, Vengeance', 'Brunhilde', 'Warrior queen deceived into marriage.', 'Queen of Iceland.', 'GER_NIBELUNGENLIED', 'ARCH_WARRIOR_HERO', 'FUNC_WARRIOR', 'COG_STATUS_HIERARCHY_LEGITIMATION');
addFigure('FIG_HAGEN_GER', 'Hagen', 'Warrior', 'Germanic', 'Treachery, Loyalty, Envy', 'Hagen of Tronje', 'Treacherous vassal who murders Siegfried.', 'Vassal of Gunther.', 'GER_NIBELUNGENLIED', 'ARCH_SHADOW_FIGURE', 'FUNC_ANTAGONIST_OBSTRUCTER', 'COG_MORAL_REGULATION');
addFigure('FIG_GUNTHER_GER', 'Gunther', 'King', 'Germanic', 'Kingship, Deception, Weakness', 'Gunnar', 'King of the Burgundians.', 'Brother of Kriemhild.', 'GER_NIBELUNGENLIED', 'ARCH_SHADOW_FIGURE', 'FUNC_SOVEREIGNTY_MAGICAL', 'COG_STATUS_HIERARCHY_LEGITIMATION');
addFigure('FIG_ETZEL_GER', 'Etzel', 'King', 'Germanic', 'Kingship, Alliance, Destruction', 'Attila', 'King of the Huns who marries Kriemhild.', 'Husband of Kriemhild.', 'GER_NIBELUNGENLIED', 'ARCH_SOVEREIGN_RULER', 'FUNC_SOVEREIGNTY_MAGICAL', 'COG_STATUS_HIERARCHY_LEGITIMATION');
addFigure('FIG_VOLKER_GER', 'Volker', 'Warrior', 'Germanic', 'Music;Loyalty;Battle', '', 'Minstrel-warrior loyal to Hagen.', 'Plays the fiddle before battle.', 'GER_NIBELUNGENLIED', 'ARCH_CULTURE_HERO_ARCHETYPE', 'FUNC_WARRIOR', 'COG_MEMORY_TRANSMISSION');

// Mesopotamian additions
addFigure('FIG_MARDUK_MES', 'Marduk', 'Deity', 'Mesopotamian', 'Creation, Storm, Kingship, Cosmic Order', 'Bel;Merodach', 'Supreme god of Babylon who defeats Tiamat.', 'Son of Ea.', 'AKK_ENUMA_ELIS_KING', 'ARCH_HERO', 'FUNC_COSMIC_ORDERER', 'COG_AGENCY_DETECTION');
addFigure('FIG_APSU_MES', 'Apsu', 'Primordial Deity', 'Mesopotamian', 'Freshwater, Primordial Deep', 'Abzu', 'Personification of freshwater.', 'Husband of Tiamat.', 'AKK_ENUMA_ELIS_KING', '', 'FUNC_CREATOR_DEMIURGE', 'COG_INTUITIVE_ONTOLOGY_MANIPULATION');
addFigure('FIG_KINGU_MES', 'Kingu', 'Monster', 'Mesopotamian', 'Chaos, Rebellion, Blood', '', 'Tiamat\'s consort and commander.', 'Husband of Tiamat. Killed by Marduk.', 'AKK_ENUMA_ELIS_KING', 'ARCH_SHADOW_FIGURE', 'FUNC_ANTAGONIST_OBSTRUCTER', 'COG_THREAT_ANXIETY_MANAGEMENT');
addFigure('FIG_LAHMU_MES', 'Lahmu', 'Primordial Deity', 'Mesopotamian', 'Silt, Primordial', '', 'First-born of Apsu and Tiamat.', 'Husband of Lahamu.', 'AKK_ENUMA_ELIS_KING', '', 'FUNC_CREATOR_DEMIURGE', 'COG_INTUITIVE_ONTOLOGY_MANIPULATION');
addFigure('FIG_LAHAMU_MES', 'Lahamu', 'Primordial Deity', 'Mesopotamian', 'Silt, Primordial', '', 'First-born daughter of Apsu and Tiamat.', 'Wife of Lahmu.', 'AKK_ENUMA_ELIS_KING', '', 'FUNC_CREATOR_DEMIURGE', 'COG_INTUITIVE_ONTOLOGY_MANIPULATION');
addFigure('FIG_ANSHAR_MES', 'Anshar', 'Primordial Deity', 'Mesopotamian', 'Sky, Totality', '', 'God of the sky or totality of heaven.', 'Son of Lahmu and Lahamu.', 'AKK_ENUMA_ELIS_KING', '', 'FUNC_COSMIC_ORDERER', 'COG_INTUITIVE_ONTOLOGY_MANIPULATION');
addFigure('FIG_KISHAR_MES', 'Kishar', 'Primordial Deity', 'Mesopotamian', 'Earth, Totality', '', 'Goddess of the earth or totality of earth.', 'Daughter of Lahmu and Lahamu.', 'AKK_ENUMA_ELIS_KING', 'ARCH_EARTH_MOTHER', 'FUNC_COSMIC_ORDERER', 'COG_INTUITIVE_ONTOLOGY_MANIPULATION');
addFigure('DEITY_MUMMU_MES', 'Mummu', 'Deity;Chaos', 'Mesopotamian', 'Chaos;Chaos mist;Vacuum', '', 'Personification of primordial chaos mist.', 'Son of Apsu and Tiamat.', 'AKK_ENUMA_ELIS_KING', 'ARCH_SHADOW_FIGURE', 'FUNC_CREATOR_DEMIURGE', 'COG_INTUITIVE_ONTOLOGY_MANIPULATION');

// Creatures
addCreature('CRT_CYCLOPS_GRK', 'Cyclops', 'Greek', 'Giant', 'One-eyed giant shepherds who trap and devour travelers.', 'Monstrous hospitality;Cannibal threat;Primitive force', 'Cyclopes', 'Polyphemus traps Odysseus.', 'GRK_ODYSSEY_BUTLER;GRK_HOMERIC_HYMNS_EVELYN;GRK_THEOGONY_HESIOD_EVELYN;ROM_METAMORPHOSES_OVID_MORE');
addCreature('CRT_HYDRA_GRK', 'Hydra', 'Greek', 'Serpent;Monster', 'Many-headed serpent whose heads regrow when cut off.', 'Regeneration;Overwhelming danger;Heroic trial', 'Lernean Hydra', 'Slain by Heracles.', 'GRK_HOMERIC_HYMNS_EVELYN;ROM_METAMORPHOSES_OVID_MORE');
addCreature('CRT_CHIMERA_GRK', 'Chimera', 'Greek', 'Hybrid Monster', 'Fire-breathing lion-goat-serpent hybrid.', 'Unnatural hybrid;Composite danger', '', 'Slain by Bellerophon.', 'GRK_HOMERIC_HYMNS_EVELYN;ROM_METAMORPHOSES_OVID_MORE');
addCreature('CRT_CENTAUR_GRK', 'Centaur', 'Greek', 'Hybrid', 'Half-man, half-horse beings.', 'Wildness;Animal instinct;Teacher', 'Centaurs', 'Chiron teaches heroes.', 'GRK_ILIAD_BUTLER;GRK_HOMERIC_HYMNS_EVELYN;GRK_ARGONAUTICA_SEATON;ROM_METAMORPHOSES_OVID_MORE');
addCreature('CRT_SPHINX_GRK', 'Sphinx', 'Greek', 'Hybrid Monster', 'Winged lion with a woman\'s head who poses riddles.', 'Riddle;Liminal danger;Wisdom test', '', 'Slain by Oedipus.', 'GRK_HOMERIC_HYMNS_EVELYN;ROM_METAMORPHOSES_OVID_MORE');
addCreature('CRT_NEMEANLION_GRK', 'Nemean Lion', 'Greek', 'Monster', 'Invulnerable lion slain by Heracles.', 'Invulnerability;Raw strength;Heroic initiation', '', 'Killed by Heracles.', 'GRK_HOMERIC_HYMNS_EVELYN;ROM_METAMORPHOSES_OVID_MORE');
addCreature('CRT_CERBERUS_GRK', 'Cerberus', 'Greek', 'Guardian;Dog', 'Three-headed hound guarding the entrance to Hades.', 'Underworld guardian;Threshold;Death boundary', '', 'Heracles captures him.', 'GRK_HOMERIC_HYMNS_EVELYN;GRK_THEOGONY_HESIOD_EVELYN;ROM_METAMORPHOSES_OVID_MORE');
addCreature('CRT_PEGASUS_GRK', 'Pegasus', 'Greek', 'Winged Horse', 'Winged horse born from Medusa\'s blood.', 'Flight;Divine origin;Poetic inspiration', '', 'Helps Bellerophon.', 'GRK_HOMERIC_HYMNS_EVELYN;ROM_METAMORPHOSES_OVID_MORE');
addCreature('CRT_GARUDA_IND', 'Garuda', 'Indian', 'Divine Bird', 'Giant divine bird and mount of Vishnu.', 'Speed;Devotion;Solar;Enemy of serpents', '', 'Son of Kashyapa and Vinata.', 'IND_MAHABHARATA_GANGULI;IND_RAMAYANA_GRIFFITH;VED_RG_VEDA_GRIFFITH');
addCreature('CRT_NAGA_IND', 'Naga', 'Indian', 'Serpent;Deity', 'Divine serpent beings associated with water and wisdom.', 'Water;Treasure;Wisdom;Snake', 'Nagas', 'Vasuki used to churn the ocean.', 'IND_MAHABHARATA_GANGULI;IND_RAMAYANA_GRIFFITH;VED_RG_VEDA_GRIFFITH');
addCreature('CRT_RAKSHASA_IND', 'Rakshasa', 'Indian', 'Demon', 'Shapeshifting demons who eat flesh.', 'Cannibal;Shapeshifter;Enemy of order', 'Rakshasas', 'Ravana is the greatest.', 'IND_MAHABHARATA_GANGULI;IND_RAMAYANA_GRIFFITH;VED_RG_VEDA_GRIFFITH');
addCreature('CRT_VANARA_IND', 'Vanara', 'Indian', 'Monkey;Humanoid', 'Divine monkey warriors who aid Rama.', 'Devotion;Strength;Agility;Messenger', 'Vanaras', 'Sugriva, Hanuman, Angada.', 'IND_RAMAYANA_GRIFFITH');
addCreature('CRT_AHI_VED', 'Ahi', 'Vedic', 'Serpent', 'Serpent or dragon who holds back the cosmic waters.', 'Drought;Obstruction;Water', 'Vritra', 'Slain by Indra.', 'VED_RG_VEDA_GRIFFITH');
addCreature('CRT_NIDHOGG_NOR', 'Nidhogg', 'Norse', 'Dragon;Serpent', 'Dragon who gnaws at the root of Yggdrasil.', 'Decay;Envy;Underworld', 'Nidhogg', 'Gnaws the roots of Yggdrasil.', 'NORSE_POETIC_EDDA_BELLOWS;NORSE_PROSE_EDDA_BRODEUR');
addCreature('CRT_RATATOSKR_NOR', 'Ratatoskr', 'Norse', 'Squirrel', 'Squirrel who carries insults on Yggdrasil.', 'Messenger;Slander;Gossip', 'Ratatosk', 'Runs up and down Yggdrasil.', 'NORSE_POETIC_EDDA_BELLOWS;NORSE_PROSE_EDDA_BRODEUR');
addCreature('CRT_SLEIPNIR_NOR', 'Sleipnir', 'Norse', 'Horse', 'Eight-legged horse of Odin.', 'Speed;Shamanic journey;Between worlds', '', 'Born when Loki took the form of a mare.', 'NORSE_POETIC_EDDA_BELLOWS;NORSE_PROSE_EDDA_BRODEUR');
addCreature('CRT_HUGINN_NOR', 'Huginn', 'Norse', 'Raven', 'One of Odin\'s ravens who gathers news.', 'Thought;Intelligence;Messenger', '', 'Flies across the world.', 'NORSE_POETIC_EDDA_BELLOWS;NORSE_PROSE_EDDA_BRODEUR');
addCreature('CRT_MUNINN_NOR', 'Muninn', 'Norse', 'Raven', 'One of Odin\'s ravens who gathers news.', 'Memory;Intelligence;Messenger', '', 'Flies across the world.', 'NORSE_POETIC_EDDA_BELLOWS;NORSE_PROSE_EDDA_BRODEUR');
addCreature('CRT_GARM_NOR', 'Garm', 'Norse', 'Dog;Guardian', 'Blood-stained hound guarding Hel.', 'Death guardian;Threshold;Hel', '', 'Breaks free at Ragnarok.', 'NORSE_POETIC_EDDA_BELLOWS;NORSE_PROSE_EDDA_BRODEUR');
addCreature('CRT_GRANI_NOR', 'Grani', 'Norse', 'Horse', 'Sigurd\'s horse descended from Sleipnir.', 'Heroic steed;Speed;Lineage', '', 'Rides through flames to Brynhild.', 'NORSE_POETIC_EDDA_BELLOWS;NORSE_VOLSUNGA_SAGA_MAGNUSSON_MORRIS');
addCreature('CRT_AMMIT_EGY', 'Ammit', 'Egyptian', 'Devourer', 'Demon who devours hearts failing judgment.', 'Divine judgment;Consumption;Failure', 'Devourer of the Dead', 'Has crocodile head, lion front, hippo hind.', 'EGY_BOOK_DEAD_BUDGE;EGY_PYRAMID_TEXTS_MERCER');
addCreature('CRT_BENNU_EGY', 'Bennu', 'Egyptian', 'Bird', 'Solar bird of rebirth associated with Ra.', 'Rebirth;Sun;Immortality;Cyclic renewal', 'Phoenix', 'Lives on the benben stone.', 'EGY_BOOK_DEAD_BUDGE;EGY_PYRAMID_TEXTS_MERCER');
addCreature('CRT_TENGU_JPN', 'Tengu', 'Japanese', 'Goblin;Demon', 'Mountain goblins mastering martial arts.', 'Pride;Martial arts;Mountain;Trickery', '', 'Teach martial arts.', 'JPN_KOJIKI_CHAMBERLAIN');
addCreature('CRT_ONI_JPN', 'Oni', 'Japanese', 'Demon', 'Ogres associated with disease and punishment.', 'Punishment;Disease;Chaos;Cruelty', 'Oni', 'Guard the gates of hell.', 'JPN_KOJIKI_CHAMBERLAIN');
addCreature('CRT_KITSUNE_JPN', 'Kitsune', 'Japanese', 'Fox Spirit', 'Shapeshifting fox spirits.', 'Shapeshifting;Trickery;Wisdom;Fertility', 'Fox', 'Serve Inari.', 'JPN_KOJIKI_CHAMBERLAIN');
addCreature('CRT_HIISI_FIN', 'Hiisi', 'Finnish', 'Goblin;Demon', 'Forest goblin or demon of the wilderness.', 'Wilderness;Chaos;Liminal', '', 'Associated with Louhi.', 'FINN_KALEVALA_CRAWFORD');
addCreature('CRT_AFANC_WEL', 'Afanc', 'Welsh', 'Lake Monster', 'Lake monster of Welsh folklore.', 'Water monster;Chaos;Liminal', 'Addanc', 'Lives in lakes and rivers.', 'WELSH_MABINOGION_GUEST');
addCreature('CRT_TWRCHTRWYTH_WEL', 'Twrch Trwyth', 'Welsh', 'Boar', 'Enchanted wild boar hunted by Arthur.', 'Wild boar;Enchantment;Quest', 'Twrch Trwyth', 'Central quest of Culhwch and Olwen.', 'WELSH_MABINOGION_GUEST');
addCreature('CRT_MORRIGAN_CROW_IR', 'Morrigan\'s Crow', 'Irish', 'Bird', 'The crow form of the Morrigan.', 'Death omen;War;Prophecy', '', 'Appears to Cú Chulainn.', 'IRISH_TAIN_BO_CUAILNGE_FARADAY');
addCreature('CRT_SIMURGH_PERS2', 'Simurgh', 'Persian', 'Mythic Bird', 'Great wise bird who raises Zal.', 'Fosterage;Healing;Wisdom', 'Simorg', 'Lives on Mount Alborz.', 'PER_SHAHNAMEH_ATKINSON');
addCreature('CRT_AKVANDIV_PERS', 'Akvan Div', 'Persian', 'Demon', 'Demon defeated by Rostam.', 'Demonic threat;Monster combat', 'Akvan Deev', 'One of Rostam\'s major adversaries.', 'PER_SHAHNAMEH_ATKINSON');
addCreature('CRT_DRAGON_NIB2', 'Dragon', 'Germanic', 'Dragon', 'Dragon slain by Siegfried.', 'Treasure;Invulnerability;Heroic trial', '', 'Guards treasure. Siegfried bathes in its blood.', 'GER_NIBELUNGENLIED');
addCreature('CRT_FAFNIR_NORSE', 'Fafnir', 'Norse;Germanic', 'Dragon;Cursed Hoarder', 'Dragon slain by Sigurd after greed transforms him.', 'Cursed wealth;Greed;Dragon-slaying', 'Fafner;dragon', 'Central dragon of the Volsung cycle.', 'NORSE_POETIC_EDDA_BELLOWS;NORSE_PROSE_EDDA_BRODEUR;NORSE_VOLSUNGA_SAGA_MAGNUSSON_MORRIS');
addCreature('CRT_DRAGON_VOLSUNG_NORSE', 'Dragon', 'Norse', 'Dragon', 'Dragon in the Volsunga Saga.', 'Treasure;Monster;Heroic trial', '', 'Generic dragon for Volsunga Saga.', 'NORSE_VOLSUNGA_SAGA_MAGNUSSON_MORRIS');

// ========== Update works_appeared_in by scanning works ==========
function normalize(v) {
  return String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9' -]+/g, ' ').replace(/\s+/g, ' ').trim();
}

const files = fs.readdirSync(WORKS_DIR).filter(f => f.endsWith('.md') && !/readme|audit|draft|notes/i.test(f));
const workTexts = new Map();
for (const file of files) {
  const text = fs.readFileSync(path.join(WORKS_DIR, file), 'utf8');
  const fmMatch = text.replace(/^\s+/, '').match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const docIdMatch = fmMatch ? fmMatch[1].match(/doc_id:\s*(.+)/) : null;
  const workId = docIdMatch ? docIdMatch[1].trim() : path.basename(file, '.md');
  workTexts.set(workId, normalize(text));
}

for (const entity of [...figs, ...crts]) {
  const id = entity.figure_id || entity.creature_id;
  const names = [(entity.preferred_name || ''), ...(entity.alternate_names || '').split(/[,;]/)].map(v => normalize(v)).filter(v => v.length > 2);
  const existingWorks = (entity.works_appeared_in || '').split(/[,;\s]+/).filter(Boolean);
  
  const foundWorks = [];
  for (const [workId, normText] of workTexts) {
    if (existingWorks.includes(workId)) continue;
    const hasMatch = names.some(name => {
      if (name.includes(' ') || name.includes('-')) return normText.includes(name);
      return new RegExp('(^|\\s)' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(\\s|$)').test(normText);
    });
    if (hasMatch) foundWorks.push(workId);
  }
  
  if (foundWorks.length > 0) {
    const newWorks = [...new Set([...existingWorks, ...foundWorks])].sort();
    entity.works_appeared_in = newWorks.join(';');
  }
}

// ========== Write back ==========
const figHeaders = ['figure_id','preferred_name','figure_type','culture_group','domains','alternate_names','description_brief','notes','works_appeared_in','character_archetype_tags','function_tags','cognitive_function_tags'];
const crtHeaders = ['creature_id','preferred_name','culture_group','creature_type','description_brief','symbolism_roles','alternate_names','notes','works_appeared_in'];

fs.writeFileSync(FIGURES_FILE, serializeCsv(figHeaders, figs), 'utf8');
fs.writeFileSync(CREATURES_FILE, serializeCsv(crtHeaders, crts), 'utf8');

console.log('Wrote ' + figs.length + ' figures and ' + crts.length + ' creatures.');
