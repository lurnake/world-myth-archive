#!/usr/bin/env node

/**
 * Build a static, local search index from Corpus Forge markdown works.
 *
 * The index intentionally stores plain text chunks and metadata only. It gives
 * the archive a usable offline search surface now, while leaving embeddings or
 * a database as later swap-in layers.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const WORKS_DIR = path.join(ROOT_DIR, 'Corpus Forge/works');
const MANIFEST_FILE = path.join(ROOT_DIR, 'Corpus Forge/corpus_manifest.json');
const OUTPUT_FILE = path.join(ROOT_DIR, 'world-mythological-codex-ui/public/search-index.json');

const CHUNK_WORDS = 650;
const OVERLAP_WORDS = 90;
const MIN_CHUNK_WORDS = 40;

const TAG_KEYS = {
  mythType: 'myth_type_tags',
  theme: 'theme_tags',
  archetype: 'character_archetype_tags',
  social: 'social_role_tags',
  cognitive: 'cognitive_function_tags',
  rite: 'rite_tags',
  episode: 'myth_episode_tags',
  proppian: 'proppian_function_tags',
};

const LEXICON_DIR = path.join(ROOT_DIR, 'Corpus Forge/lexicons');
const LEXICON_FILES = {
  mythType: { file: 'myth_type_tags.csv', code: 'code', label: 'label', notes: 'notes' },
  theme: { file: 'theme_tags.csv', code: 'code', label: 'label', notes: 'notes' },
  archetype: { file: 'character_archetype_tags.csv', code: 'code', label: 'label', notes: 'notes' },
  social: { file: 'social_role_tags.csv', code: 'code', label: 'label', notes: 'notes' },
  cognitive: { file: 'cognitive_function_tags.csv', code: 'code', label: 'label', notes: 'notes' },
  rite: { file: 'rite_tags.csv', code: 'code', label: 'label', notes: 'notes' },
  episode: { file: 'myth_episode.csv', code: 'code', label: 'label', notes: 'notes' },
  proppian: { file: 'proppian_functions.csv', code: 'function_no', label: 'label', notes: 'brief_definition' },
};

const STOP_WORDS = new Set([
  'about', 'above', 'across', 'after', 'again', 'against', 'also', 'among', 'another', 'being',
  'between', 'both', 'called', 'often', 'their', 'there', 'these', 'those', 'through', 'under',
  'using', 'where', 'which', 'while', 'with', 'within', 'without', 'from', 'into', 'onto', 'over',
  'that', 'this', 'they', 'them', 'then', 'than', 'such', 'some', 'same', 'form', 'forms', 'role',
  'roles', 'myth', 'myths', 'story', 'stories', 'narrative', 'narratives', 'deity', 'deities',
  'figure', 'figures', 'human', 'humans', 'life', 'deathless', 'mortal', 'mortals',
]);

const CUSTOM_KEYWORDS = {
  THM_CREATION: ['created', 'creator', 'birth of the gods', 'made the world', 'first arose', 'origin'],
  THM_FLOOD: ['flood', 'deluge', 'ark', 'waters rose', 'rain', 'submerged'],
  THM_UNDERWORLD_JOURNEY: ['underworld', 'hades', 'duat', 'nether', 'below the earth', 'realm of death'],
  THM_TRICKSTER_CYCLE: ['trick', 'deceive', 'cunning', 'stole', 'theft', 'wily'],
  THM_HERO_JOURNEY: ['quest', 'journey', 'trial', 'adventure', 'hero', 'return'],
  THM_APOTHEOSIS: ['became a god', 'deified', 'immortal', 'star', 'constellation'],
  THM_WORLD_AXIS: ['world tree', 'axis', 'mountain', 'pillar', 'heaven and earth'],
  THM_DIVINE_COMBAT: ['battle', 'combat', 'slay', 'slew', 'monster', 'dragon', 'serpent'],
  THM_CELESTIAL_PHENOMENA: ['sun', 'moon', 'star', 'dawn', 'eclipse', 'heavenly'],
  THM_METAMORPHOSIS: ['changed into', 'transformed', 'became', 'shape', 'form'],
  THM_ORDER_VS_CHAOS: ['chaos', 'order', 'law', 'cosmic order', 'disorder'],
  THM_PROPHECY_FATE: ['prophecy', 'fate', 'destiny', 'doom', 'oracle'],
  ARCH_SKY_FATHER: ['sky father', 'heavenly father', 'zeus', 'dyaus', 'varuna', 'ouranos'],
  ARCH_EARTH_MOTHER: ['earth mother', 'gaia', 'earth', 'mother goddess'],
  ARCH_TRICKSTER: ['trickster', 'cunning', 'deceiver', 'hermes', 'loki'],
  ARCH_HERALD: ['messenger', 'herald', 'announced', 'summoned'],
  ARCH_SHAPESHIFTER: ['changed shape', 'disguise', 'shapeshift', 'transformed'],
  FUNC_WARRIOR: ['warrior', 'battle', 'weapon', 'spear', 'sword', 'war'],
  FUNC_FERTILITY_PROSPERITY: ['fertility', 'harvest', 'cattle', 'wealth', 'grain', 'fruit'],
  FUNC_TRICKSTER_MEDIATOR: ['trick', 'mediator', 'boundary', 'cunning', 'stole'],
  FUNC_COSMIC_ORDERER: ['ordered the world', 'cosmic order', 'law', 'established'],
  COG_AGENCY_DETECTION: ['god', 'gods', 'goddess', 'spirit', 'demon', 'divine', 'speaks', 'commanded'],
  COG_MEMORY_TRANSMISSION: ['sing', 'song', 'hymn', 'chant', 'praise', 'remember', 'heard', 'repeated'],
  COG_GROUP_IDENTITY: ['people', 'tribe', 'clan', 'lineage', 'fathers', 'sons of', 'nation', 'kin'],
  COG_MORAL_REGULATION: ['law', 'justice', 'sin', 'evil', 'righteous', 'punish', 'oath', 'taboo', 'forbidden'],
  COG_COOPERATION_FACILITATION: ['gift', 'share', 'covenant', 'alliance', 'friendship', 'feast', 'assembly'],
  COG_THREAT_ANXIETY_MANAGEMENT: ['death', 'dead', 'fear', 'danger', 'disease', 'protect', 'save', 'lament'],
  COG_MINIMALLY_COUNTERINTUITIVE: ['immortal', 'divine', 'talking', 'transformed', 'monster', 'spirit', 'magic'],
  COG_RITUAL_BINDING_COMMITMENT: ['ritual', 'sacrifice', 'offering', 'prayer', 'vow', 'altar', 'libation'],
  COG_STATUS_HIERARCHY_LEGITIMATION: ['king', 'queen', 'lord', 'throne', 'sovereign', 'rule', 'crown'],
  RITE_SACRIFICE: ['sacrifice', 'offering', 'hecatomb', 'altar', 'oblation'],
  RITE_INVOCATION_PRAYER: ['prayer', 'hymn', 'sing of', 'invoke', 'praise'],
  RITE_FUNERAL: ['funeral', 'burial', 'mourning', 'lament', 'corpse'],
  RITE_DIVINATION: ['divination', 'omen', 'oracle', 'prophecy', 'dream'],
  RITE_INITIATION: ['initiation', 'trial', 'ordeal', 'passage'],
  EP_PRIMORDIAL_CHAOS: ['chaos', 'void', 'first', 'beginning'],
  EP_CREATION_BY_DEITY: ['created', 'made', 'fashioned', 'formed'],
  EP_CREATION_WORLD_PARENTS: ['sky', 'earth', 'gaia', 'ouranos'],
  EP_CREATION_DISMEMBERMENT: ['dismembered', 'body', 'limbs', 'from his body'],
  EP_DIVINE_SUCCESSION: ['succession', 'overthrew', 'throne', 'king of the gods'],
  EP_DIVINE_COMBAT: ['divine combat', 'battle', 'war among gods'],
  EP_MONSTER_SLAYING: ['slay', 'slew', 'monster', 'serpent', 'dragon'],
  EP_UNDERWORLD_JOURNEY: ['underworld', 'hades', 'descent', 'realm of death'],
  EP_TRICKSTER_THEFT: ['stole', 'theft', 'trick', 'cattle'],
};

const GUIDED_TRAILS = [
  {
    id: 'flood-myths',
    title: 'Floods, Survival, and Renewal',
    audience: 'curious',
    description: 'Compare deluge scenes and the human problem of survival after cosmic catastrophe.',
    query: 'flood survivor ark waters divine destruction',
    tags: ['THM_FLOOD', 'MYTHTYPE_COSMOGONY']
  },
  {
    id: 'underworld-descents',
    title: 'Journeys Below',
    audience: 'both',
    description: 'Follow descents, afterlife crossings, funerary passages, and encounters with the dead.',
    query: 'underworld death afterlife descent realm of the dead',
    tags: ['THM_UNDERWORLD_JOURNEY', 'EP_UNDERWORLD_JOURNEY']
  },
  {
    id: 'trickster-thefts',
    title: 'Tricksters and Sacred Thefts',
    audience: 'curious',
    description: 'Look for cunning figures who steal, cross boundaries, or bring dangerous gifts.',
    query: 'trickster theft cunning stole deception',
    tags: ['THM_TRICKSTER_CYCLE', 'FUNC_TRICKSTER_MEDIATOR', 'EP_TRICKSTER_THEFT']
  },
  {
    id: 'divine-kingship',
    title: 'Divine Kingship and Sovereignty',
    audience: 'scholarly',
    description: 'Trace how rule is legitimized by gods, ritual, conquest, genealogy, and cosmic order.',
    query: 'king throne sovereignty divine rule justice',
    tags: ['FUNC_SOVEREIGNTY_MAGICAL', 'FUNC_SOVEREIGNTY_PRIESTLY', 'COG_STATUS_HIERARCHY_LEGITIMATION']
  },
  {
    id: 'creation-from-chaos',
    title: 'Creation from Chaos',
    audience: 'both',
    description: 'Explore beginnings: void, waters, world parents, divine craftsmanship, and cosmic ordering.',
    query: 'creation chaos world beginning formed heaven earth',
    tags: ['THM_CREATION', 'THM_ORDER_VS_CHAOS', 'EP_PRIMORDIAL_CHAOS', 'EP_CREATION_BY_DEITY']
  },
  {
    id: 'hero-companions',
    title: 'Heroes and Companions',
    audience: 'curious',
    description: 'Find heroic pairs, loyal companions, trials, grief, and quests.',
    query: 'hero companion friend quest battle loyalty',
    tags: ['THM_HERO_JOURNEY', 'MYTHTYPE_HERO_SAGA_LEGEND']
  }
];

const ENTITY_NAME_OVERRIDES = {
  FIG_CU_CHULAINN_IRISH: { name: 'Cú Chulainn', aliases: ['Cuchulain', 'Cuchulainn', 'Setanta'] },
  FIG_VAINAMOINEN_FINN: { name: 'Väinämöinen', aliases: ['Vainamoinen', 'Wainamoinen', 'Waino'] },
  FIG_ILMARINEN_FINN: { name: 'Ilmarinen', aliases: [] },
  FIG_LEMMINKAINEN_FINN: { name: 'Lemminkäinen', aliases: ['Lemminkainen'] },
  FIG_KULLERVO_FINN: { name: 'Kullervo', aliases: [] },
  FIG_LOUHI_FINN: { name: 'Louhi', aliases: [] },
  FIG_ILMATAR_FINN: { name: 'Ilmatar', aliases: [] },
  FIG_UKKO_FINN: { name: 'Ukko', aliases: [] },
  FIG_MARIATTA_FINN: { name: 'Mariatta', aliases: [] },
  OBJ_SAMPO_FINN: { name: 'Sampo', aliases: [] },
  PLACE_POHJOLA_FINN: { name: 'Pohjola', aliases: ['Pohyola', 'Northland'] },
  PLACE_KALEVALA_FINN: { name: 'Kalevala', aliases: ['Wainola'] },
  PLACE_TUONELA_FINN: { name: 'Tuonela', aliases: [] },
  FIG_HUNAHPU_MAYA: { name: 'Hunahpu', aliases: ['Hun Ahpu'] },
  FIG_XBALANQUE_MAYA: { name: 'Xbalanque', aliases: ['Xbalanqué'] },
  FIG_HEART_OF_SKY_MAYA: { name: 'Heart of Sky', aliases: ['Huracan', 'Hurricane'] },
  FIG_SOVEREIGN_PLUMED_SERPENT_MAYA: { name: 'Sovereign Plumed Serpent', aliases: ['Gucumatz', 'Kukulkan', 'Plumed Serpent'] },
  FIG_RA_EGY: { name: 'Ra', aliases: ['Re'] },
  FIG_RE_EGY: { name: 'Re', aliases: ['Ra'] },
  FIG_APEP_EGY: { name: 'Apep', aliases: ['Apophis'] },
  FIG_AMATERASU_JPN: { name: 'Amaterasu', aliases: ['Amaterasu Omikami', 'Heavenly Shining-Great-August-Deity', 'Great August Deity of Ise'] },
  FIG_SUSANOO_JPN: { name: 'Susanoo', aliases: ['Susa-no-o', 'Susano-o', 'His-Swift-Impetuous-Male-Augustness', 'Swift-Impetuous-Male-Augustness'] },
  FIG_IZANAGI_JPN: { name: 'Izanagi', aliases: ['Male-Who-Invites', 'His Augustness the Male-Who-Invites'] },
  FIG_IZANAMI_JPN: { name: 'Izanami', aliases: ['Female-Who-Invites', 'Her Augustness the Female-Who-Invites'] },
  FIG_TSUKUYOMI_JPN: { name: 'Tsukuyomi', aliases: [] },
  FIG_OKUNINUSHI_JPN: { name: 'Okuninushi', aliases: ['Oho-kuni-nushi', 'Ohokuninushi', 'Master-of-the-Great-Land', 'Great-Land-Master'] },
  FIG_NINIGI_JPN: { name: 'Ninigi', aliases: ['Heavenly Grandchild', 'Heavenly-Satiety-Sky-Luxuriant'] },
  FIG_JIMMU_JPN: { name: 'Jimmu', aliases: ['Kamu-yamato-ihare-biko', 'Divine-Yamato-Ihare-Prince'] },
  FIG_YAMATO_TAKERU_JPN: { name: 'Yamato Takeru', aliases: ['Yamato-take', 'Yamato-takeru', 'Yamato-wo-guna', 'Wo-usu'] },
  FIG_ODIN_NORSE: { name: 'Odin', aliases: ['Óðinn', 'Woden'] },
  FIG_THOR_NORSE: { name: 'Thor', aliases: ['Þórr'] },
  FIG_FREYJA_NORSE: { name: 'Freyja', aliases: ['Freya'] },
  FIG_FREYR_NORSE: { name: 'Freyr', aliases: ['Frey'] },
  FIG_TYR_NORSE: { name: 'Tyr', aliases: ['Týr'] },
  FIG_HEIMDALLR_NORSE: { name: 'Heimdallr', aliases: ['Heimdall'] },
  FIG_FENRIR_NORSE: { name: 'Fenrir', aliases: ['Fenris', 'Fenris-Wolf'] },
  CRT_TIAMAT_MES: { name: 'Tiamat', aliases: [] },
  DEITY_TIAMAT_MES: { name: 'Tiamat', aliases: [] },
  DEITY_APSU_MES: { name: 'Apsu', aliases: ['Apsû'] },
  DEITY_MARDUK_MES: { name: 'Marduk', aliases: [] },
  DEITY_EA_MES: { name: 'Ea', aliases: ['Enki'] },
  DEITY_ANU_MES: { name: 'Anu', aliases: [] },
  DEITY_KINGU_MES: { name: 'Kingu', aliases: ['Qingu'] },
  FIG_ARTHUR_WELSH: { name: 'Arthur', aliases: ['King Arthur'] },
  FIG_PWYLL_WELSH: { name: 'Pwyll', aliases: [] },
  FIG_RHIANNON_WELSH: { name: 'Rhiannon', aliases: [] },
  FIG_PRYDERI_WELSH: { name: 'Pryderi', aliases: [] },
  FIG_BRANWEN_WELSH: { name: 'Branwen', aliases: [] },
  FIG_BRAN_BLESSED_WELSH: { name: 'Bran the Blessed', aliases: ['Bendigeidfran', 'Bran'] },
  FIG_MANAWYDDAN_WELSH: { name: 'Manawyddan', aliases: ['Manawydan'] },
  FIG_MATH_WELSH: { name: 'Math', aliases: [] },
  FIG_GWYDION_WELSH: { name: 'Gwydion', aliases: [] },
  FIG_ARIANROD_WELSH: { name: 'Arianrod', aliases: ['Arianrhod'] },
  FIG_LLEU_WELSH: { name: 'Lleu', aliases: ['Lleu Llaw Gyffes'] },
  FIG_BLODEUWEDD_WELSH: { name: 'Blodeuwedd', aliases: [] },
  FIG_MEDB_IRISH: { name: 'Medb', aliases: ['Maeve', 'Meave'] },
  FIG_AILILL_IRISH: { name: 'Ailill', aliases: [] },
  FIG_FERGUS_MAC_ROICH_IRISH: { name: 'Fergus mac Roich', aliases: ['Fergus'] },
  FIG_FER_DIAD_IRISH: { name: 'Fer Diad', aliases: ['Ferdiad', 'Ferdia'] },
  FIG_CONCHOBOR_MAC_NESSA_IRISH: { name: 'Conchobor mac Nessa', aliases: ['Conchobar', 'Conchobor'] },
  FIG_LAEG_IRISH: { name: 'Láeg', aliases: ['Laeg', 'Loeg'] },
  FIG_MORRIGAN_IRISH: { name: 'Morrígan', aliases: ['Morrigan'] },
  FIG_LUG_IRISH: { name: 'Lug', aliases: ['Lugh'] },
  FIG_RAMA_IND: { name: 'Rama', aliases: ['Râma'] },
  FIG_SITA_IND: { name: 'Sita', aliases: ['Sîtâ'] },
  FIG_LAKSHMANA_IND: { name: 'Lakshmana', aliases: ['Lakshman'] },
  FIG_RAVANA_IND: { name: 'Ravana', aliases: ['Râvana'] },
  FIG_HANUMAN_IND: { name: 'Hanuman', aliases: [] },
  FIG_VISHNU_IND: { name: 'Vishnu', aliases: [] },
};

const WORK_ENTITY_SEEDS = {
  GRK_THEOGONY_HESIOD_EVELYN: {
    figures: [
      ['FIG_ZEUS_GRK', 'Zeus', ['Jove']],
      ['FIG_GAIA_GRK', 'Gaia', ['Earth']],
      ['FIG_OURANOS_GRK', 'Ouranos', ['Uranus', 'Heaven']],
      ['FIG_KRONOS_GRK', 'Kronos', ['Cronus', 'Saturn']],
      ['FIG_RHEA_GRK', 'Rhea', []],
      ['FIG_PROMETHEUS_GRK', 'Prometheus', []],
      ['FIG_HESIOD_GRK', 'Hesiod', []],
      ['FIG_MUSES_GRK', 'Muses', ['Muse']],
    ],
    creatures: [['CRT_TYPHON_GRK', 'Typhon', ['Typhoeus']], ['CRT_TITANS_GRK', 'Titans', ['Titan']]],
  },
  GRK_HOMERIC_HYMNS_EVELYN: {
    figures: [
      ['FIG_DEMETER_GRK', 'Demeter', []],
      ['FIG_PERSEPHONE_GRK', 'Persephone', ['Kore']],
      ['FIG_HADES_GRK', 'Hades', ['Aidoneus']],
      ['FIG_APOLLO_GRK', 'Apollo', ['Phoebus']],
      ['FIG_HERMES_GRK', 'Hermes', []],
      ['FIG_APHRODITE_GRK', 'Aphrodite', ['Cypris']],
      ['FIG_DIONYSUS_GRK', 'Dionysus', ['Dionysos']],
      ['FIG_ZEUS_GRK', 'Zeus', ['Jove']],
      ['FIG_ATHENA_GRK', 'Athena', ['Pallas']],
      ['FIG_ARTEMIS_GRK', 'Artemis', []],
      ['FIG_LETO_GRK', 'Leto', []],
      ['FIG_HESTIA_GRK', 'Hestia', []],
    ],
    creatures: [],
  },
  ROM_METAMORPHOSES_OVID_MORE: {
    figures: [
      ['FIG_JUPITER_ROM', 'Jupiter', ['Jove', 'Zeus']],
      ['FIG_JUNO_ROM', 'Juno', ['Hera']],
      ['FIG_APOLLO_GRK', 'Apollo', ['Phoebus']],
      ['FIG_DIANA_ROM', 'Diana', ['Artemis']],
      ['FIG_VENUS_ROM', 'Venus', ['Aphrodite']],
      ['FIG_MERCURY_ROM', 'Mercury', ['Hermes']],
      ['FIG_NEPTUNE_ROM', 'Neptune', ['Poseidon']],
      ['FIG_ORPHEUS_GRK', 'Orpheus', []],
      ['FIG_EURYDICE_GRK', 'Eurydice', []],
      ['FIG_PHAETHON_GRK', 'Phaethon', []],
      ['FIG_NARCISSUS_GRK', 'Narcissus', []],
      ['FIG_PERSEUS_GRK', 'Perseus', []],
      ['FIG_MEDEA_GRK', 'Medea', []],
      ['FIG_ACHILLES_GRK', 'Achilles', []],
      ['FIG_AENEAS_ROM', 'Aeneas', []],
    ],
    creatures: [['CRT_PYTHON_GRK', 'Python', []], ['CRT_MEDUSA_GRK', 'Medusa', []], ['CRT_MINOTAUR_GRK', 'Minotaur', []]],
  },
  NORSE_POETIC_EDDA_BELLOWS: {
    figures: [
      ['FIG_ODIN_NORSE', 'Odin', ['Othin', 'Óðinn']],
      ['FIG_THOR_NORSE', 'Thor', ['Þórr']],
      ['FIG_LOKI_NORSE', 'Loki', []],
      ['FIG_FREYJA_NORSE', 'Freyja', ['Freya']],
      ['FIG_FREYR_NORSE', 'Freyr', ['Frey']],
      ['FIG_SIGURD_NORSE', 'Sigurd', []],
      ['FIG_BRYNHILD_NORSE', 'Brynhild', ['Brynhildr']],
      ['FIG_GUDRUN_NORSE', 'Gudrun', []],
      ['FIG_ATLI_NORSE', 'Atli', []],
      ['FIG_GUNNAR_NORSE', 'Gunnar', []],
      ['FIG_HEL_NOR', 'Hel', []],
    ],
    creatures: [['CRT_FENRIR_NORSE', 'Fenrir', ['Fenris']], ['CRT_JORMUNGANDR_NORSE', 'Jormungandr', ['Midgard Serpent']]],
  },
  VED_RG_VEDA_GRIFFITH: {
    figures: [
      ['FIG_INDRA_VED', 'Indra', []],
      ['FIG_AGNI_VED', 'Agni', []],
      ['FIG_SOMA_VED', 'Soma', []],
      ['FIG_VARUNA_VED', 'Varuna', []],
      ['FIG_MITRA_VED', 'Mitra', []],
      ['FIG_USHAS_VED', 'Ushas', ['Dawn']],
      ['FIG_VAYU_VED', 'Vayu', []],
      ['FIG_MARUTS_VED', 'Maruts', ['Marut']],
      ['FIG_SAVITR_VED', 'Savitr', ['Savitar']],
      ['FIG_VISHNU_VED', 'Vishnu', []],
      ['FIG_RUDRA_VED', 'Rudra', []],
      ['FIG_ASVINS_VED', 'Asvins', ['Ashvins', 'Asvinas']],
    ],
    creatures: [['CRT_VRITRA_VED', 'Vritra', ['Vrtra', 'Ahi']]],
  },
  PER_SHAHNAMEH_ATKINSON: {
    figures: [
      ['FIG_RUSTEM_PERS', 'Rustem', ['Rostam', 'Rustam']],
      ['FIG_SOHRAB_PERS', 'Sohrab', ['Suhraub']],
      ['FIG_ZAL_PERS', 'Zal', ['Zâl']],

      ['FIG_KAI_KAUS_PERS', 'Kai-kaus', ['Kai Kavus', 'Kavus']],
      ['FIG_KAI_KHOSRAU_PERS', 'Kai-khosrau', ['Kai Khosrau']],
      ['FIG_AFRASIYAB_PERS', 'Afrasiab', []],
      ['FIG_SIYAVUSH_PERS', 'Siyavush', ['Siawush']],
      ['FIG_FERIDOUN_PERS', 'Feridoun', ['Fereydun']],
      ['FIG_ZOHAK_PERS', 'Zohak', ['Zahhak']],
    ],
    creatures: [['CRT_SIMURGH_PERS', 'Simurgh', ['Simorg']], ['CRT_WHITE_DEMON_PERS', 'White Demon', ['Deev', 'Div']]],
  },
  IND_MAHABHARATA_GANGULI: {
    figures: [
      ['FIG_KRISHNA_IND', 'Krishna', ['Krsna']],
      ['FIG_ARJUNA_IND', 'Arjuna', []],
      ['FIG_YUDHISHTHIRA_IND', 'Yudhishthira', ['Yudhisthira']],
      ['FIG_BHIMA_IND', 'Bhima', []],
      ['FIG_DRAUPADI_IND', 'Draupadi', []],
      ['FIG_DURYODHANA_IND', 'Duryodhana', []],
      ['FIG_KARNA_IND', 'Karna', []],
      ['FIG_BHISHMA_IND', 'Bhishma', []],
      ['FIG_DHRITARASHTRA_IND', 'Dhritarashtra', []],
      ['FIG_KUNTI_IND', 'Kunti', []],
      ['FIG_VYASA_IND', 'Vyasa', []],
      ['FIG_INDRA_IND', 'Indra', []],
      ['FIG_SHIVA_IND', 'Shiva', ['Siva']],
      ['FIG_VISHNU_IND', 'Vishnu', []],
    ],
    creatures: [],
  },
  GRK_ILIAD_BUTLER: {
    figures: [
      ['FIG_ACHILLES_GRK', 'Achilles', ['Achilleus', 'Peleus son']],
      ['FIG_HECTOR_GRK', 'Hector', []],
      ['FIG_AGAMEMNON_GRK', 'Agamemnon', ['Atreus son']],
      ['FIG_PATROCLUS_GRK', 'Patroclus', ['Patroklos']],
      ['FIG_PRIAM_GRK', 'Priam', []],
      ['FIG_HELEN_GRK', 'Helen', []],
      ['FIG_PARIS_GRK', 'Paris', ['Alexandrus']],
      ['FIG_ODYSSEUS_GRK', 'Odysseus', ['Ulysses']],
      ['FIG_DIOMEDES_GRK', 'Diomed', ['Diomedes']],
      ['FIG_NESTOR_GRK', 'Nestor', []],
      ['FIG_ZEUS_GRK', 'Zeus', ['Jove', 'Jupiter']],
      ['FIG_HERA_GRK', 'Hera', ['Juno']],
      ['FIG_ATHENA_GRK', 'Athena', ['Minerva', 'Pallas']],
      ['FIG_APOLLO_GRK', 'Apollo', ['Phoebus']],
      ['FIG_APHRODITE_GRK', 'Aphrodite', ['Venus']],
      ['FIG_ARES_GRK', 'Ares', ['Mars']],
      ['FIG_THETIS_GRK', 'Thetis', []],
    ],
    creatures: [],
  },
  GRK_ODYSSEY_BUTLER: {
    figures: [
      ['FIG_ODYSSEUS_GRK', 'Odysseus', ['Ulysses']],
      ['FIG_TELEMACHUS_GRK', 'Telemachus', []],
      ['FIG_PENELOPE_GRK', 'Penelope', []],
      ['FIG_ATHENA_GRK', 'Athena', ['Minerva', 'Pallas']],
      ['FIG_POSEIDON_GRK', 'Poseidon', ['Neptune']],
      ['FIG_CIRCE_GRK', 'Circe', []],
      ['FIG_CALYPSO_GRK', 'Calypso', []],
      ['FIG_NAUSICAA_GRK', 'Nausicaa', ['Nausicaä']],
      ['FIG_ALCINOUS_GRK', 'Alcinous', []],
      ['FIG_ARETE_GRK', 'Arete', []],
      ['FIG_EUMAEUS_GRK', 'Eumaeus', []],
      ['FIG_ANTINOUS_GRK', 'Antinous', []],
      ['FIG_EURYMACHUS_GRK', 'Eurymachus', []],
      ['FIG_TIRESIAS_GRK', 'Tiresias', []],
    ],
    creatures: [
      ['CRT_POLYPHEMUS_GRK', 'Polyphemus', ['Cyclops']],
      ['CRT_SCYLLA_GRK', 'Scylla', []],
      ['CRT_CHARYBDIS_GRK', 'Charybdis', []],
      ['CRT_SIRENS_GRK', 'Sirens', ['Siren']],
    ],
  },
  ROM_AENEID_DRYDEN: {
    figures: [
      ['FIG_AENEAS_ROM', 'Aeneas', []],
      ['FIG_DIDO_ROM', 'Dido', ['Elissa']],
      ['FIG_ASCANIUS_ROM', 'Ascanius', ['Iulus']],
      ['FIG_TURNUS_ROM', 'Turnus', []],
      ['FIG_LAVINIA_ROM', 'Lavinia', []],
      ['FIG_LATINUS_ROM', 'Latinus', []],
      ['FIG_ANCHISES_ROM', 'Anchises', []],
      ['FIG_CREUSA_ROM', 'Creusa', []],
      ['FIG_JUNO_ROM', 'Juno', ['Hera']],
      ['FIG_VENUS_ROM', 'Venus', ['Aphrodite']],
      ['FIG_JUPITER_ROM', 'Jupiter', ['Jove', 'Zeus']],
      ['FIG_MERCURY_ROM', 'Mercury', ['Hermes']],
      ['FIG_SIBYL_CUMAE_ROM', 'Sibyl of Cumae', ['Sibyl']],
      ['FIG_PALLAS_ROM', 'Pallas', []],
    ],
    creatures: [],
  },
  GRK_ARGONAUTICA_SEATON: {
    figures: [
      ['FIG_JASON_GRK', 'Jason', ['Aeson son']],
      ['FIG_MEDEA_GRK', 'Medea', []],
      ['FIG_AEETES_GRK', 'Aeetes', []],
      ['FIG_HERA_GRK', 'Hera', ['Juno']],
      ['FIG_ATHENA_GRK', 'Athena', ['Pallas']],
      ['FIG_APHRODITE_GRK', 'Aphrodite', ['Cypris']],
      ['FIG_ORPHEUS_GRK', 'Orpheus', []],
      ['FIG_HERACLES_GRK', 'Heracles', ['Hercules']],
      ['FIG_CASTOR_GRK', 'Castor', []],
      ['FIG_POLYDEUCES_GRK', 'Polydeuces', ['Pollux']],
      ['FIG_PELEUS_GRK', 'Peleus', []],
      ['FIG_IDMON_GRK', 'Idmon', []],
      ['FIG_MOPSUS_GRK', 'Mopsus', []],
    ],
    creatures: [
      ['CRT_COLCHIAN_DRAGON_GRK', 'Colchian Dragon', ['dragon']],
      ['CRT_HARPIES_GRK', 'Harpies', ['Harpy']],
    ],
  },
  ANG_BEOWULF_HALL: {
    figures: [
      ['FIG_BEOWULF_ANG', 'Beowulf', []],
      ['FIG_HROTHGAR_ANG', 'Hrothgar', []],
      ['FIG_WIGLAF_ANG', 'Wiglaf', []],
      ['FIG_UNFERTH_ANG', 'Unferth', []],
      ['FIG_WEALHTHEOW_ANG', 'Wealhtheow', []],
      ['FIG_HYGELAC_ANG', 'Hygelac', ['Higelac']],
      ['FIG_SCYLD_ANG', 'Scyld', []],
      ['FIG_HILDEBURH_ANG', 'Hildeburh', ['Hildeburg']],
      ['FIG_HNAEF_ANG', 'Hnæf', ['Hnaef']],
      ['FIG_HENGEST_ANG', 'Hengest', []],
    ],
    creatures: [
      ['CRT_GRENDEL_ANG', 'Grendel', []],
      ['CRT_GRENDELS_MOTHER_ANG', "Grendel's Mother", ['mother of Grendel']],
      ['CRT_DRAGON_BEOWULF_ANG', 'Dragon', ['fire-drake', 'worm']],
    ],
  },
  GER_NIBELUNGENLIED: {
    figures: [
      ['FIG_SIEGFRIED_GER', 'Siegfried', ['Sîfrit', 'Sifrit']],
      ['FIG_KRIEMHILD_GER', 'Kriemhild', ['Kriemhilda']],
      ['FIG_BRUNHILD_GER', 'Brunhild', ['Brunhilda']],
      ['FIG_GUNTHER_GER', 'Gunther', []],
      ['FIG_HAGEN_GER', 'Hagen', []],
      ['FIG_ETZEL_GER', 'Etzel', ['Attila']],
      ['FIG_RUEDIGER_GER', 'Ruediger', ['Rüdiger']],
      ['FIG_VOLKER_GER', 'Volker', []],
      ['FIG_GERNOT_GER', 'Gernot', []],
      ['FIG_GISELHER_GER', 'Giselher', []],
    ],
    creatures: [['CRT_DRAGON_NIBELUNG_GER', 'Dragon', []]],
  },
  NORSE_VOLSUNGA_SAGA_MAGNUSSON_MORRIS: {
    figures: [
      ['FIG_SIGURD_NORSE', 'Sigurd', ['Siegfried']],
      ['FIG_BRYNHILD_NORSE', 'Brynhild', ['Brynhildr', 'Brunhild']],
      ['FIG_GUDRUN_NORSE', 'Gudrun', []],
      ['FIG_SIGMUND_NORSE', 'Sigmund', []],
      ['FIG_SIGNY_NORSE', 'Signy', []],
      ['FIG_REGIN_NORSE', 'Regin', []],
      ['FIG_FAFNIR_NORSE', 'Fafnir', ['Fafner']],
      ['FIG_ODIN_NORSE', 'Odin', ['Óðinn']],
      ['FIG_ATLI_NORSE', 'Atli', ['Attila']],
      ['FIG_GUNNAR_NORSE', 'Gunnar', []],
      ['FIG_HOGNI_NORSE', 'Hogni', ['Högni']],
    ],
    creatures: [['CRT_FAFNIR_NORSE', 'Fafnir', ['dragon']], ['CRT_DRAGON_VOLSUNG_NORSE', 'Dragon', []]],
  },
};

function stripInlineComment(value) {
  let inSingle = false;
  let inDouble = false;

  for (let i = 0; i < value.length; i += 1) {
    const char = value[i];
    const previous = value[i - 1];

    if (char === "'" && !inDouble && previous !== '\\') inSingle = !inSingle;
    if (char === '"' && !inSingle && previous !== '\\') inDouble = !inDouble;

    if (char === '#' && !inSingle && !inDouble) {
      return value.slice(0, i).trim();
    }
  }

  return value.trim();
}

function cleanYamlValue(value) {
  const withoutComment = stripInlineComment(value);
  if (withoutComment === 'null') return null;

  return withoutComment
    .replace(/^["']|["']$/g, '')
    .trim();
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
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
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      field = '';
      continue;
    }

    field += char;
  }

  row.push(field);
  if (row.some((value) => value.trim())) rows.push(row);

  const [headers = [], ...dataRows] = rows;
  return dataRows.map((values) => Object.fromEntries(
    headers.map((header, index) => [header.trim(), (values[index] || '').trim()])
  ));
}

function normalizeForMatch(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9' -]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function wordsFrom(value) {
  return Array.from(new Set(
    normalizeForMatch(value)
      .replace(/\([^)]*\)/g, ' ')
      .split(/[\s-]+/)
      .map((word) => word.replace(/^'+|'+$/g, ''))
      .filter((word) => word.length > 3 && !STOP_WORDS.has(word))
  ));
}

function phraseFromLabel(value) {
  const phrase = normalizeForMatch(String(value).replace(/\([^)]*\)/g, ''));
  return phrase.length > 3 ? phrase : '';
}

function proppCode(row) {
  const label = String(row.label || '').toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '');
  return `PROPP_${String(row.function_no || '').padStart(2, '0')}_${label}`;
}

function candidateFromCode(code, label = code, notes = '') {
  const cleanedCode = cleanTag(code);
  return {
    code: cleanedCode,
    label: String(label || cleanedCode),
    phrase: phraseFromLabel(label || cleanedCode),
    strongWords: Array.from(new Set([
      ...wordsFrom(cleanedCode.replace(/^(THM|ARCH|FUNC|COG|RITE|EP|MYTHTYPE|PROPP)_/, '')),
      ...wordsFrom(label || cleanedCode),
      ...(CUSTOM_KEYWORDS[cleanedCode] || []).flatMap(wordsFrom),
    ])),
    customPhrases: (CUSTOM_KEYWORDS[cleanedCode] || []).map(normalizeForMatch).filter((value) => value.length > 3),
    weakWords: wordsFrom(notes).slice(0, 24),
  };
}

function loadLexicons() {
  const lexicons = Object.fromEntries(Object.keys(TAG_KEYS).map((key) => [key, new Map()]));

  for (const [tagKey, config] of Object.entries(LEXICON_FILES)) {
    const filePath = path.join(LEXICON_DIR, config.file);
    if (!fs.existsSync(filePath)) continue;

    const rows = parseCsv(fs.readFileSync(filePath, 'utf8'));
    for (const row of rows) {
      const code = tagKey === 'proppian' ? proppCode(row) : row[config.code];
      if (!code) continue;
      lexicons[tagKey].set(cleanTag(code), candidateFromCode(code, row[config.label], row[config.notes]));
    }
  }

  return lexicons;
}

function addWorkTagsToLexicons(lexicons, tags) {
  for (const [tagKey, values] of Object.entries(tags)) {
    if (!lexicons[tagKey]) continue;
    for (const tag of values || []) {
      if (!lexicons[tagKey].has(tag)) {
        lexicons[tagKey].set(tag, candidateFromCode(tag));
      }
    }
  }
}

function hasWord(haystack, word) {
  return new RegExp(`(^|\\s)${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|$)`).test(haystack);
}

function scoreCandidate(candidate, haystack) {
  let score = 0;

  if (candidate.phrase && haystack.includes(candidate.phrase)) score += 8;
  for (const phrase of candidate.customPhrases) {
    if (haystack.includes(phrase)) score += 6;
  }

  for (const word of candidate.strongWords) {
    if (hasWord(haystack, word)) score += 2;
  }

  let weakScore = 0;
  for (const word of candidate.weakWords) {
    if (hasWord(haystack, word)) weakScore += 0.5;
  }

  return score + Math.min(4, weakScore);
}

function relevantTagsForChunk(chunk, work, lexicons) {
  const haystack = normalizeForMatch(`${chunk.sectionTitle} ${chunk.text}`);
  const thresholds = {
    mythType: 5,
    theme: 4,
    archetype: 5,
    social: 5,
    cognitive: 4,
    rite: 4,
    episode: 5,
    proppian: 6,
  };
  const limits = {
    mythType: 4,
    theme: 6,
    archetype: 4,
    social: 4,
    cognitive: 4,
    rite: 4,
    episode: 5,
    proppian: 4,
  };

  const tags = {};
  const scores = {};

  for (const tagKey of Object.keys(TAG_KEYS)) {
    const candidates = Array.from(lexicons[tagKey].values());
    const scored = candidates
      .map((candidate) => ({
        code: candidate.code,
        score: scoreCandidate(candidate, haystack) + ((work.tags[tagKey] || []).includes(candidate.code) ? 0.25 : 0),
      }))
      .filter((entry) => entry.score >= thresholds[tagKey])
      .sort((a, b) => b.score - a.score || a.code.localeCompare(b.code))
      .slice(0, limits[tagKey]);

    let result = scored.map((entry) => entry.code);

    // Merge work-level mythType tags into every chunk; damping trims over-propagated ones
    if (tagKey === 'mythType') {
      result = Array.from(new Set([...(work.tags.mythType || []), ...result])).slice(0, limits[tagKey]);
    }

    tags[tagKey] = result;
    scores[tagKey] = Object.fromEntries(scored.map((entry) => [entry.code, entry.score]));
  }

  return { tags, scores };
}

function loadEntityLexicons() {
  const figuresPath = path.join(LEXICON_DIR, 'key_figures.csv');
  const creaturesPath = path.join(LEXICON_DIR, 'creatures.csv');

  function entityCandidates(filePath, idKey, nameKey, aliasesKey) {
    if (!fs.existsSync(filePath)) return [];

    return parseCsv(fs.readFileSync(filePath, 'utf8')).map((row) => {
      const names = [
        row[nameKey],
        ...(row[aliasesKey] || '').split(/[;,]/),
      ].map((value) => normalizeForMatch(value)).filter((value) => value.length > 2);
      const aliases = (row[aliasesKey] || '').split(/[;,]/).map((value) => value.trim()).filter(Boolean);

      return {
        id: row[idKey],
        name: row[nameKey],
        names,
        aliases,
        entityType: row.figure_type || row.creature_type || '',
        worksAppearedIn: (row.works_appeared_in || '').split(/[;,\s]+/).map(cleanTag).filter(Boolean),
        cultureGroup: row.culture_group || '',
        domains: row.domains || row.symbolism_roles || '',
        description: row.description_brief || '',
        notes: row.notes || '',
        source: 'csv',
      };
    }).filter((entity) => entity.id && entity.names.length > 0);
  }

  return {
    figures: entityCandidates(figuresPath, 'figure_id', 'preferred_name', 'alternate_names'),
    creatures: entityCandidates(creaturesPath, 'creature_id', 'preferred_name', 'alternate_names'),
  };
}

function titleFromEntityId(id) {
  return String(id)
    .replace(/^(FIG|DEITY|CRT)_/, '')
    .replace(/_(MES|EGY|MAYA|NORSE|FINN|JPN|IND|IRISH|WELSH|GRK|ROM|ANG|GER|PERS|VEDIC)$/, '')
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

function entityCandidate(id, fallbackName, aliases = [], source = 'curated', extras = {}) {
  const override = ENTITY_NAME_OVERRIDES[id] || {};
  const name = override.name || fallbackName || titleFromEntityId(id);
  const allNames = [
    name,
    fallbackName,
    ...(override.aliases || []),
    ...aliases,
  ].filter(Boolean);

  return {
    id,
    name,
    aliases: Array.from(new Set([...((override.aliases || [])), ...aliases].filter(Boolean))),
    names: Array.from(new Set(allNames.map((value) => normalizeForMatch(value)).filter((value) => value.length > 2))),
    source,
    entityType: extras.entityType || (id.startsWith('DEITY_') ? 'Deity' : id.startsWith('CRT_') ? 'Creature' : 'Figure'),
    cultureGroup: extras.cultureGroup || '',
    domains: extras.domains || '',
    description: extras.description || '',
    roleInWork: extras.roleInWork || '',
    notes: extras.notes || '',
  };
}

function extractFrontmatterEntityIds(frontmatterText) {
  const ids = [];
  const entityBlocks = ['key_figures', 'creatures'];
  const lines = frontmatterText.split(/\r?\n/);

  for (const blockName of entityBlocks) {
    const start = lines.findIndex((line) => new RegExp(`^${blockName}:\\s*$`).test(line.trim()));
    if (start < 0) continue;

    const blockLines = [];
    for (let i = start + 1; i < lines.length; i += 1) {
      if (/^[A-Za-z0-9_]+:\s*/.test(lines[i])) break;
      blockLines.push(lines[i]);
    }

    let current = null;
    for (const line of blockLines) {
      const idMatch = line.match(/^\s*-\s+id:\s*([^#\s]+)/);
      if (idMatch) {
        if (current) ids.push(current);
        current = { id: cleanTag(idMatch[1]), blockName, roleInWork: '' };
        continue;
      }

      const roleMatch = line.match(/^\s+role_in_work:\s*(.+)$/);
      if (roleMatch && current) {
        current.roleInWork = cleanYamlValue(roleMatch[1]);
      }
    }
    if (current) ids.push(current);
  }

  return ids;
}

function workScopedEntityLexicons(markdown, workId, baseEntityLexicons) {
  const frontmatterMatch = markdown.replace(/^\s+/, '').match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const frontmatterText = frontmatterMatch ? frontmatterMatch[1] : '';
  const cleanWorkId = cleanTag(workId);
  const appliesToWork = (entity) => !entity.worksAppearedIn?.length || entity.worksAppearedIn.includes(cleanWorkId);
  const figures = baseEntityLexicons.figures.filter(appliesToWork);
  const creatures = baseEntityLexicons.creatures.filter(appliesToWork);

  for (const { id, blockName, roleInWork } of extractFrontmatterEntityIds(frontmatterText)) {
    if (!id) continue;
    const candidate = entityCandidate(id, null, [], `frontmatter:${workId}`, { roleInWork });
    if (blockName === 'creatures' || id.startsWith('CRT_')) creatures.push(candidate);
    else if (id.startsWith('FIG_') || id.startsWith('DEITY_')) figures.push(candidate);
  }

  const seeds = WORK_ENTITY_SEEDS[cleanWorkId] || {};
  for (const [id, name, aliases = []] of seeds.figures || []) {
    figures.push(entityCandidate(id, name, aliases, `work-seed:${workId}`));
  }
  for (const [id, name, aliases = []] of seeds.creatures || []) {
    creatures.push(entityCandidate(id, name, aliases, `work-seed:${workId}`));
  }

  function dedupe(candidates) {
    const byId = new Map();
    for (const entity of candidates.filter((candidate) => candidate.id && candidate.names.length > 0)) {
      const previous = byId.get(entity.id);
      if (!previous) {
        byId.set(entity.id, entity);
        continue;
      }

      byId.set(entity.id, {
        ...previous,
        ...Object.fromEntries(
          Object.entries(entity).filter(([, value]) => {
            if (Array.isArray(value)) return value.length > 0;
            return value !== undefined && value !== null && value !== '';
          }),
        ),
        names: Array.from(new Set([...(previous.names || []), ...(entity.names || [])])),
        aliases: Array.from(new Set([...(previous.aliases || []), ...(entity.aliases || [])])),
        entityType: previous.entityType || entity.entityType || '',
        cultureGroup: previous.cultureGroup || entity.cultureGroup || '',
        domains: previous.domains || entity.domains || '',
        description: previous.description || entity.description || '',
        roleInWork: previous.roleInWork || entity.roleInWork || '',
        notes: previous.notes || entity.notes || '',
        source: [previous.source, entity.source].filter(Boolean).join('+'),
      });
    }
    return Array.from(byId.values());
  }

  return {
    figures: dedupe(figures),
    creatures: dedupe(creatures),
  };
}

function loadManifest() {
  if (!fs.existsSync(MANIFEST_FILE)) {
    return { editorialStages: {}, works: [], byDocId: new Map() };
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'));
  return {
    ...manifest,
    byDocId: new Map((manifest.works || []).map((work) => [work.docId, work])),
  };
}

function editorialConfidence(record) {
  const stageScores = {
    raw: 0.15,
    cleaned: 0.35,
    metadata_complete: 0.5,
    machine_tagged: 0.62,
    human_reviewed: 0.82,
    scholar_reviewed: 0.95,
    metadata_only: 0.2,
  };
  const completenessPenalty = {
    complete: 0,
    partial: -0.12,
    abridged: -0.1,
    not_ingested: -0.5,
  };
  const sourceBonus = {
    published_translation: 0.08,
    public_domain_mirror: 0.02,
    source_text_extract: -0.04,
    rights_pending: -0.15,
  };

  const base = stageScores[record?.status] ?? 0.4;
  const score = base
    + (completenessPenalty[record?.completeness] ?? 0)
    + (sourceBonus[record?.sourceQuality] ?? 0);

  return Math.max(0.05, Math.min(0.99, Number(score.toFixed(2))));
}

function tagConfidenceForChunk(tagScores, workRecord) {
  const base = editorialConfidence(workRecord);
  return Object.fromEntries(
    Object.entries(tagScores).map(([key, scores]) => [
      key,
      Object.fromEntries(
        Object.entries(scores).map(([code, score]) => {
          // Score typically ranges from threshold (4–6) up to ~20+ for strong matches.
          // Normalize: score 4 → ~0.41, score 10 → ~0.65, score 20 → ~0.95
          const normalized = Math.min(0.99, 0.25 + (score / 25));
          const blended = Number((0.4 * base + 0.6 * normalized).toFixed(2));
          return [code, Math.max(0.25, blended)];
        })
      ),
    ])
  );
}

function bm25TextForChunk(chunk, tags, entities) {
  return [
    chunk.sectionTitle,
    chunk.text,
    ...Object.values(tags).flat(),
    ...entities.figures.map((entity) => entity.name),
    ...entities.creatures.map((entity) => entity.name),
  ].join(' ');
}

/**
 * Dampen ultra-generic tags that appear on too many chunks within a single work.
 * This prevents tags like MYTHTYPE_DIVINE_MYTH or COG_STATUS_HIERARCHY_LEGITIMATION
 * from dominating every chunk simply because their keywords ("god", "king") are ubiquitous.
 */
function dampUniversalTags(chunks, maxFrequency = 0.35) {
  const byWork = new Map();
  for (const chunk of chunks) {
    if (!byWork.has(chunk.workId)) byWork.set(chunk.workId, []);
    byWork.get(chunk.workId).push(chunk);
  }

  for (const [, workChunks] of byWork) {
    for (const tagKey of Object.keys(TAG_KEYS)) {
      // mythType is allowed a higher per-work frequency because it is work-derived;
      // small works (≤50 chunks) are not damped at all to avoid sparse tagging.
      const effectiveMax = tagKey === 'mythType'
        ? (workChunks.length <= 50 ? 1.0 : 0.65)
        : maxFrequency;
      const tagCounts = new Map();
      const tagInstances = new Map(); // tag → [{ chunk, confidence }]

      for (const chunk of workChunks) {
        for (const tag of chunk.tags[tagKey] || []) {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
          if (!tagInstances.has(tag)) tagInstances.set(tag, []);
          const confidence = chunk.tagConfidence?.[tagKey]?.[tag] || 0;
          tagInstances.get(tag).push({ chunk, confidence });
        }
      }

      const threshold = Math.max(1, Math.floor(workChunks.length * effectiveMax));
      for (const [tag, count] of tagCounts) {
        if (count > threshold) {
          const toRemove = count - threshold;
          const instances = tagInstances.get(tag).sort((a, b) => a.confidence - b.confidence);
          for (let i = 0; i < toRemove; i++) {
            const { chunk } = instances[i];
            chunk.tags[tagKey] = chunk.tags[tagKey].filter((t) => t !== tag);
            if (chunk.tagConfidence?.[tagKey]) {
              delete chunk.tagConfidence[tagKey][tag];
            }
          }
        }
      }
    }
  }
}

function relevantEntitiesForChunk(chunk, entityLexicons) {
  const haystack = normalizeForMatch(`${chunk.sectionTitle} ${chunk.text}`);

  function matches(entities) {
    return entities
      .filter((entity) => entity.names.some((name) => name.includes(' ') ? haystack.includes(name) : hasWord(haystack, name)))
      .slice(0, 12)
      .map((entity) => ({
        id: entity.id,
        name: entity.name,
        type: entity.entityType || '',
        culture: entity.cultureGroup || '',
        domains: entity.domains || '',
        description: entity.description || '',
        roleInWork: entity.roleInWork || '',
        aliases: entity.aliases || [],
        notes: entity.notes || '',
        source: entity.source || '',
      }));
  }

  return {
    figures: matches(entityLexicons.figures),
    creatures: matches(entityLexicons.creatures),
  };
}

function parseFrontmatter(markdown) {
  const trimmed = markdown.replace(/^\s+/, '');
  const match = trimmed.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) {
    return { frontmatter: {}, body: trimmed };
  }

  const result = {};
  const lines = match[1].split(/\r?\n/);
  let currentKey = null;
  let currentMode = null;

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const topLevel = rawLine.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (topLevel) {
      const [, key, rawValue] = topLevel;
      const value = cleanYamlValue(rawValue);
      currentKey = key;

      if (rawValue.trim() === '' || value === '') {
        result[key] = [];
        currentMode = 'collection';
      } else {
        result[key] = value;
        currentMode = null;
      }
      continue;
    }

    const listItem = rawLine.match(/^\s*-\s+(.*)$/);
    if (listItem && currentKey && Array.isArray(result[currentKey])) {
      const value = cleanYamlValue(listItem[1]);
      if (value) result[currentKey].push(value);
      currentMode = 'array';
      continue;
    }

    const nestedPair = rawLine.match(/^\s{2}([A-Za-z0-9_]+):\s*(.*)$/);
    if (nestedPair && currentKey && currentMode === 'collection') {
      if (Array.isArray(result[currentKey])) result[currentKey] = {};
      const [, key, rawValue] = nestedPair;
      result[currentKey][key] = cleanYamlValue(rawValue);
    }
  }

  return {
    frontmatter: result,
    body: markdown.slice(match[0].length).trim(),
  };
}

function normalizeWhitespace(text) {
  return text
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function plainText(markdown) {
  return normalizeWhitespace(
    markdown
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
      .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
      .replace(/^\s{0,3}#{1,6}\s+/gm, '')
      .replace(/^\s{0,3}> ?/gm, '')
      .replace(/[*_~]/g, '')
  );
}

function splitIntoSections(body) {
  const lines = body.split(/\r?\n/);
  const sections = [];
  let currentTitle = 'Opening';
  let currentLines = [];

  function flush() {
    const text = plainText(currentLines.join('\n'));
    if (text) sections.push({ title: currentTitle, text });
  }

  for (const line of lines) {
    const heading = line.match(/^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$/);
    if (heading) {
      flush();
      currentTitle = heading[1].trim();
      currentLines = [];
      continue;
    }

    currentLines.push(line);
  }

  flush();

  if (sections.length === 0) {
    return [{ title: 'Text', text: plainText(body) }].filter((section) => section.text);
  }

  return sections;
}

function chunkSection(section, workId) {
  const words = section.text.split(/\s+/).filter(Boolean);
  const chunks = [];

  if (words.length === 0) return chunks;

  for (let start = 0; start < words.length; start += CHUNK_WORDS - OVERLAP_WORDS) {
    const end = Math.min(start + CHUNK_WORDS, words.length);
    const text = words.slice(start, end).join(' ');
    const wordCount = end - start;

    if (wordCount < MIN_CHUNK_WORDS && chunks.length > 0) break;

    const digest = crypto.createHash('sha1').update(`${workId}:${section.title}:${start}:${text}`).digest('hex').slice(0, 12);

    chunks.push({
      id: `${workId}:${digest}`,
      sectionTitle: section.title,
      wordStart: start,
      wordEnd: end,
      text,
      tokenCount: wordCount,
    });

    if (end === words.length) break;
  }

  return chunks;
}

function cleanTag(tag) {
  return String(tag)
    .split('#')[0]
    .trim()
    .replace(/^["']|["']$/g, '');
}

function tagsFromFrontmatter(frontmatter) {
  return Object.fromEntries(
    Object.entries(TAG_KEYS).map(([outputKey, sourceKey]) => [
      outputKey,
      Array.isArray(frontmatter[sourceKey])
        ? frontmatter[sourceKey].map(cleanTag).filter(Boolean)
        : [],
    ])
  );
}

function processWork(fileName, lexicons, entityLexicons, manifest) {
  const filePath = path.join(WORKS_DIR, fileName);
  const markdown = fs.readFileSync(filePath, 'utf8');
  const { frontmatter, body } = parseFrontmatter(markdown);
  const workId = frontmatter.doc_id || path.basename(fileName, '.md');
  const workEntityLexicons = workScopedEntityLexicons(markdown, workId, entityLexicons);
  const manifestRecord = manifest.byDocId.get(cleanTag(workId)) || {};
  const title = frontmatter.title || path.basename(fileName, '.md').replace(/_/g, ' ');
  const culture = frontmatter.culture_group || 'Unknown';
  const sourceDocument = frontmatter.source_document && typeof frontmatter.source_document === 'object'
    ? frontmatter.source_document
    : {};
  const tags = tagsFromFrontmatter(frontmatter);
  addWorkTagsToLexicons(lexicons, tags);
  const sections = splitIntoSections(body);

  const work = {
    id: cleanTag(workId),
    title,
    culture: String(culture).split('#')[0].trim(),
    languageOriginal: frontmatter.language_original || null,
    summary: frontmatter.summary || '',
    sourceUrl: sourceDocument.url || null,
    sourceTitle: sourceDocument.text_title || null,
    translator: sourceDocument.translator_author_editor || null,
    provenance: {
      rights: manifestRecord.rights || 'unknown',
      sourceQuality: manifestRecord.sourceQuality || 'unknown',
      completeness: manifestRecord.completeness || 'unknown',
      translationCompleteness: manifestRecord.translationCompleteness || 'unknown',
      editorialStatus: manifestRecord.status || 'metadata_complete',
      tagReview: manifestRecord.tagReview || 'automated',
      notes: manifestRecord.notes || '',
      confidence: editorialConfidence(manifestRecord),
    },
    tags,
  };

  const rawChunks = sections.flatMap((section) => chunkSection(section, workId)).map((chunk, index) => {
    const { tags: chunkTags, scores: tagScores } = relevantTagsForChunk(chunk, work, lexicons);
    const entities = relevantEntitiesForChunk(chunk, workEntityLexicons);
    const tagConfidence = tagConfidenceForChunk(tagScores, manifestRecord);

    return {
      ...chunk,
      chunkIndex: index + 1,
      stableCitation: `${work.id} §${index + 1}`,
      workId: work.id,
      workTitle: title,
      culture: work.culture,
      sourceUrl: work.sourceUrl,
      tags: chunkTags,
      tagConfidence,
      workTags: tags,
      entities,
      provenance: work.provenance,
      interpretation: {
        method: 'automated-controlled-vocabulary-heuristic',
        reviewedBy: manifestRecord.tagReview || 'automated',
        caveat: 'Tags are machine suggestions from controlled lexicons and should be treated as interpretive aids until human-reviewed.',
      },
      bm25Text: bm25TextForChunk(chunk, chunkTags, entities),
    };
  });

  dampUniversalTags(rawChunks);
  const chunks = rawChunks;

  return { work: { ...work, chunkCount: chunks.length }, chunks };
}

function shouldInclude(fileName) {
  return fileName.endsWith('.md')
    && !/readme/i.test(fileName)
    && !/audit/i.test(fileName)
    && !/draft/i.test(fileName)
    && !/notes/i.test(fileName);
}

function buildIndex() {
  const lexicons = loadLexicons();
  const entityLexicons = loadEntityLexicons();
  const manifest = loadManifest();
  const files = fs.readdirSync(WORKS_DIR).filter(shouldInclude).sort();
  const processed = files.map((file) => processWork(file, lexicons, entityLexicons, manifest));
  const works = processed.map((entry) => entry.work).sort((a, b) => a.title.localeCompare(b.title));
  const chunks = processed.flatMap((entry) => entry.chunks);

  const facets = {
    cultures: Array.from(new Set(works.map((work) => work.culture))).sort(),
    tags: Object.fromEntries(
      Object.keys(TAG_KEYS).map((tagKey) => [
        tagKey,
        Array.from(new Set(chunks.flatMap((chunk) => chunk.tags[tagKey] || []))).sort(),
      ])
    ),
    entities: {
      figures: Array.from(new Map(chunks.flatMap((chunk) => chunk.entities.figures).map((entity) => [entity.id, entity])).values())
        .sort((a, b) => a.name.localeCompare(b.name)),
      creatures: Array.from(new Map(chunks.flatMap((chunk) => chunk.entities.creatures).map((entity) => [entity.id, entity])).values())
        .sort((a, b) => a.name.localeCompare(b.name)),
    },
  };

  const index = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    editorialStages: manifest.editorialStages || {},
    guidedTrails: GUIDED_TRAILS,
    methodology: {
      sourceTextLayer: 'Cleaned public-domain or open source markdown texts with provenance carried from Corpus Forge frontmatter and corpus_manifest.json.',
      interpretationLayer: 'Automated controlled-vocabulary tags scored from local passage text, headings, and work metadata.',
      retrievalLayer: 'Browser-local hybrid retrieval: exact text, weighted lexical search, controlled tag matching, and curated semantic expansions. No embeddings are bundled yet.',
      caveat: 'Machine tags are discovery aids, not final scholarly claims.',
    },
    chunking: {
      chunkWords: CHUNK_WORDS,
      overlapWords: OVERLAP_WORDS,
    },
    stats: {
      workCount: works.length,
      chunkCount: chunks.length,
      taggedChunkCount: chunks.filter((chunk) => Object.values(chunk.tags).some((values) => values.length > 0)).length,
    },
    facets,
    works,
    chunks,
  };

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(index)}\n`, 'utf8');

  console.log(`Built ${path.relative(ROOT_DIR, OUTPUT_FILE)}`);
  console.log(`${works.length} works, ${chunks.length} chunks`);
}

buildIndex();
