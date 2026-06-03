/**
 * Auto-generated works metadata
 * Generated from Corpus Forge markdown files
 * DO NOT EDIT MANUALLY - run extract-works-metadata.js to regenerate
 */

export interface Work {
  id: string;
  title: string;
  titleOriginal?: string;
  cultureGroup: string;
  languageOriginal?: string;
  summary: string;
  sourcePrimary?: {
    title: string;
    author: string;
    approx_date: string;
    notes?: string;
    location?: string;
    [key: string]: unknown;
  };
  sourceDocument?: {
    text_title: string;
    translator_author_editor: string;
    publisher?: string;
    publication_date: number | string;
    url?: string;
    doi?: string | null;
    notes?: string;
    publication_place?: string;
    edition?: string;
    original_publication?: string;
    [key: string]: unknown;
  };
  mythTypeTags: string[] | string;
  themeTags: string[] | string;
  characterArchetypeTags: string[] | string;
}

export const works: Work[] = [
  {
    "id": "ANG_BEOWULF_HALL",
    "title": "Beowulf",
    "titleOriginal": "Beowulf",
    "cultureGroup": "Anglo-Saxon",
    "languageOriginal": "ang",
    "summary": "Old English heroic epic of Beowulf, Grendel, Grendel’s mother, the dragon, lordship, feud, gift-giving, monster combat, fame, death, and the fragility of heroic order.",
    "sourcePrimary": {
      "title": "Beowulf",
      "author": "Unknown Anglo-Saxon poet",
      "approx_date": "c. 8th-11th centuries CE"
    },
    "sourceDocument": {
      "text_title": "Beowulf",
      "translator_author_editor": "Jno. Lesslie Hall",
      "publisher": "Project Gutenberg",
      "publication_date": "1892",
      "url": "https://www.gutenberg.org/ebooks/16328.txt.utf-8",
      "doi": "null",
      "notes": "Public-domain Jno. Lesslie Hall translation from Project Gutenberg eBook 16328."
    },
    "mythTypeTags": [
      "MYTHTYPE_HERO_SAGA_LEGEND",
      "MYTHTYPE_MONSTER_LEGEND",
      "MYTHTYPE_FOUNDATION"
    ],
    "themeTags": [
      "THM_HERO_JOURNEY",
      "THM_DIVINE_COMBAT",
      "THM_DEATH_ORIGIN",
      "THM_ORDER_VS_CHAOS",
      "THM_PROPHECY_FATE"
    ],
    "characterArchetypeTags": [
      "ARCH_HERO",
      "ARCH_SHADOW_ANTAGONIST",
      "ARCH_SOVEREIGN_RULER",
      "ARCH_THRESHOLD_GUARDIAN"
    ]
  },
  {
    "id": "AKK_ENUMA_ELIS_KING",
    "title": "Enūma Eliš (The Seven Tablets of Creation)",
    "titleOriginal": "Enūma Eliš\" # Akkadian: \"When on high",
    "cultureGroup": "Mesopotamian # Babylonian/Akkadian tradition",
    "languageOriginal": "akk # ISO 639-3 code for Akkadian",
    "summary": "The Babylonian creation epic narrating the birth of the gods from primeval chaos, the rebellion of Tiamat and her monstrous army, the rise of Marduk as champion of the gods, his defeat of Tiamat, and his creation of the world from her body, culminating in the creation of humanity and the establishment of Marduk's supremacy.",
    "sourcePrimary": {
      "title": "Enūma Eliš (Seven Tablets of Creation)",
      "author": "Unknown (composed during Old Babylonian period)",
      "approx_date": "c. 1200 BCE (earliest manuscripts); composition possibly earlier"
    },
    "sourceDocument": {
      "text_title": "The Seven Tablets of Creation",
      "translator_author_editor": "Leonard William King",
      "publisher": "Luzac and Co.",
      "publication_date": "1902",
      "url": "https://www.sacred-texts.com/ane/enuma.htm",
      "doi": "null",
      "notes": "Translation based on cuneiform tablets from the British Museum, primarily from the library of Ashurbanipal at Nineveh (7th century BCE)."
    },
    "mythTypeTags": [
      "MYTHTYPE_COSMOGONY",
      "MYTHTYPE_THEOGONY",
      "MYTHTYPE_DIVINE_MYTH",
      "MYTHTYPE_ETIOLOGICAL"
    ],
    "themeTags": [
      "THM_CREATION",
      "THM_ORDER_VS_CHAOS",
      "THM_DIVINE_COMBAT",
      "THM_THEOMACHY",
      "THM_COSMOGONY",
      "THM_SOVEREIGNTY"
    ],
    "characterArchetypeTags": [
      "ARCH_SKY_FATHER # Anu",
      "ARCH_EARTH_MOTHER # Tiamat (as primordial mother)",
      "ARCH_CULTURE_HERO # Marduk",
      "ARCH_PRIMORDIAL_ANTAGONIST # Tiamat, Apsu",
      "ARCH_WISE_OLD_MENTOR # Ea",
      "ARCH_SOVEREIGN_RULER # Marduk"
    ]
  },
  {
    "id": "ROM_METAMORPHOSES_OVID_MORE",
    "title": "Metamorphoses",
    "titleOriginal": "Metamorphoseon",
    "cultureGroup": "Roman",
    "languageOriginal": "lat # ISO 639-3 code for Latin",
    "summary": "Ovid's monumental narrative poem in 15 books recounting transformations from Greek and Roman mythology, from creation to Julius Caesar's deification, composed 8 CE. A continuous narrative linking hundreds of myths through the theme of metamorphosis.",
    "sourcePrimary": {
      "title": "Metamorphoses (Metamorphoseon Libri XV)",
      "author": "Publius Ovidius Naso (Ovid)",
      "approx_date": "8 CE"
    },
    "sourceDocument": {
      "text_title": "Metamorphoses",
      "translator_author_editor": "Brookes More",
      "publisher": "Cornhill Publishing Company",
      "publication_date": "1922",
      "publication_place": "Boston",
      "url": "https://www.perseus.tufts.edu/hopper/text?doc=Ov.+Met",
      "notes": "English verse translation by Brookes More (1859-1942), published 1922. Based on the Perseus Digital Library edition. Licensed under Creative Commons Attribution-ShareAlike 3.0."
    },
    "mythTypeTags": [
      "MYTHTYPE_DIVINE_MYTH",
      "MYTHTYPE_HERO_SAGA_LEGEND",
      "MYTHTYPE_ETIOLOGICAL",
      "MYTHTYPE_METAMORPHOSIS",
      "MYTHTYPE_COSMOGONY"
    ],
    "themeTags": [
      "THM_METAMORPHOSIS",
      "THM_DIVINE_COMBAT",
      "THM_HERO_JOURNEY",
      "THM_LOVE_PASSION",
      "THM_DEATH_ORIGIN",
      "THM_CREATION",
      "THM_HUBRIS_PUNISHMENT",
      "THM_FORBIDDEN_ACT_TRANSGRESSION",
      "THM_PROPHECY_FATE",
      "THM_ORDER_VS_CHAOS"
    ],
    "characterArchetypeTags": [
      "ARCH_SOVEREIGN_RULER",
      "ARCH_TRICKSTER_ARCHETYPE",
      "ARCH_TRAGIC_LOVER",
      "ARCH_PRIMORDIAL_ANTAGONIST",
      "ARCH_WISE_OLD_MENTOR",
      "ARCH_VICTIM_INNOCENT"
    ]
  },
  {
    "id": "MAYA_POPOL_VUH_GOETZ",
    "title": "Popol Vuh: The Sacred Book of the Ancient K'iche' Maya",
    "titleOriginal": "Popol Wuj\" # K'iche' Maya: \"Book of the Community\" or \"Book of the People",
    "cultureGroup": "K'iche' Maya # Guatemalan highlands Maya civilization",
    "languageOriginal": "quc # ISO 639-3 code for K'iche' (Quiché) Maya",
    "summary": "The sacred creation narrative and heroic epic of the K'iche' Maya people of Guatemala. Recounts the creation of the world, the adventures of the Hero Twins Hunahpu and Xbalanque in their journey to Xibalba (the underworld), and the origin of the K'iche' people and their ruling lineages.",
    "sourcePrimary": {
      "title": "Popol Vuh (K'iche' manuscript, c. 1554-1558)",
      "author": "Unknown K'iche' Maya scribes (transcribing oral traditions dating to Classic Maya period, c. 200-900 CE)",
      "approx_date": "Original oral traditions: Classic Maya period (c. 200-900 CE); Written K'iche' manuscript: c. 1554-1558 CE; Spanish translation by Francisco Ximénez: c. 1701-1703"
    },
    "sourceDocument": {
      "text_title": "Popol Vuh: The Sacred Book of the Ancient Quiché Maya",
      "translator_author_editor": "Lewis Spence",
      "publisher": "Project Gutenberg / David Nutt (London)",
      "publication_date": "1908",
      "url": "https://www.gutenberg.org/ebooks/56550.txt.utf-8",
      "doi": "null",
      "notes": "Public-domain English translation by Lewis Spence (1908) from Project Gutenberg eBook 56550. Spence translated from the K'iche' via Brasseur de Bourbourg's French edition."
    },
    "mythTypeTags": [
      "MYTHTYPE_CREATION_COSMOGONY # Creation of world, humans, and cosmos",
      "MYTHTYPE_HERO_SAGA_LEGEND # Hero Twins epic",
      "MYTHTYPE_DIVINE_MYTH # Actions and conflicts of gods",
      "MYTHTYPE_ETIOLOGICAL # Origins of humans, death, celestial bodies",
      "MYTHTYPE_ESCHATOLOGICAL # Journey to underworld, death and transformation",
      "MYTHTYPE_ANCESTRAL_LEGEND # Origins of K'iche' royal lineages"
    ],
    "themeTags": [
      "THM_CREATION_ORIGIN # Multiple attempts to create humanity",
      "THM_HERO_JOURNEY # Hero Twins' quest and trials",
      "THM_UNDERWORLD_JOURNEY # Descent to and triumph in Xibalba",
      "THM_DEATH_MORTALITY # Defeat of death lords, origins of mortality",
      "THM_DIVINE_INTERVENTION_CONFLICT # Gods vs. death lords, divine trials",
      "THM_METAMORPHOSIS_TRANSFORMATION # Humans from maize, twins to sun and moon",
      "THM_TRICKSTER_CUNNING # Hero Twins' cleverness against death lords",
      "THM_SACRIFICE_OFFERING # Human and divine sacrifice themes",
      "THM_COSMIC_ORDER # Establishment of celestial and terrestrial order",
      "THM_TWINS_DUALITY # Hero Twins as cosmic principle",
      "THM_BALL_GAME # Sacred ball game as cosmic battle",
      "THM_ANCESTRY_GENEALOGY # K'iche' royal lineages and migrations"
    ],
    "characterArchetypeTags": [
      "ARCH_DIVINE_TWINS # Hunahpu and Xbalanque",
      "ARCH_CULTURE_HERO # Hero Twins as civilizers",
      "ARCH_TRICKSTER # Hero Twins using cunning and deception",
      "ARCH_PRIMORDIAL_ANTAGONIST # Vucub-Caquix and sons, Seven Death and One Death",
      "ARCH_CREATOR_DEITY # Heart of Sky, Sovereign Plumed Serpent",
      "ARCH_WISE_OLD_MENTOR # Xmucane (grandmother)",
      "ARCH_THRESHOLD_GUARDIAN # Lords of Xibalba",
      "ARCH_SACRIFICIAL_FIGURE # Hun-Hunahpu and Vucub-Hunahpu",
      "ARCH_TRANSFORMATIVE_FEMININE # Blood Moon (Xquic), grandmother Xmucane",
      "ARCH_DIVINE_MESSENGER # Animals as messengers of the gods"
    ]
  },
  {
    "id": "IRISH_TAIN_BO_CUAILNGE_FARADAY",
    "title": "Táin Bó Cúailnge (The Cattle Raid of Cooley)",
    "titleOriginal": "Táin Bó Cúailnge",
    "cultureGroup": "Irish",
    "languageOriginal": "mga # Middle Irish (ISO 639-3)",
    "summary": "The great Ulster epic recounting Cú Chulainn's single-handed defense of Ulster against Queen Medb's army seeking the Brown Bull of Cooley. The tale begins with the Pillow Talk between Medb and Ailill, includes Cú Chulainn's heroic single combat against Medb's champions, culminates in the tragic combat with his foster-brother Fer Diad, and concludes with the final battle and the combat between the two great bulls. This is L. Winifred Faraday's 1904 translation of the older, shorter Recension I; it is a partial witness to the epic, and her bracketed [Note: ...] insertions mark manuscript gaps and rhetorical passages she abridged.",
    "sourcePrimary": {
      "title": "Táin Bó Cúailnge (Recension I, Lebor na hUidre and the Yellow Book of Lecan)",
      "author": "Unknown (multiple authors and redactors across centuries)",
      "approx_date": "Recension I compiled c. 1100 CE (Lebor na hUidre), drawing on materials from c. 7th-8th centuries CE; stories may preserve material from as early as 1st-5th centuries CE"
    },
    "sourceDocument": {
      "text_title": "The Cattle-Raid of Cualnge (Táin Bó Cúailnge): An Old Irish Prose-Epic",
      "translator_author_editor": "L. Winifred Faraday",
      "publisher": "David Nutt, London",
      "publication_date": "1904",
      "url": "https://www.gutenberg.org/ebooks/14391",
      "doi": "null",
      "notes": "First English translation of the Táin, made from Lebor na hUidre (Leabhar na h-Uidhri) and the Yellow Book of Lecan (Recension I). Public domain; sourced from Project Gutenberg eBook 14391. Faraday's bracketed [Note: ...] insertions mark manuscript lacunae and long rhetorical passages she abridged. Her scholarly introduction has been omitted from the corpus text, which begins at the narrative proper."
    },
    "mythTypeTags": [
      "MYTHTYPE_HERO_SAGA_LEGEND",
      "MYTHTYPE_ETIOLOGICAL # Explains place names and customs",
      "MYTHTYPE_COSMOLOGICAL # Contains elements of cosmic conflict"
    ],
    "themeTags": [
      "THM_HERO_JOURNEY # Cú Chulainn's transformation and trials",
      "THM_WARFARE_CONFLICT # Central to the entire narrative",
      "THM_DEATH_MORTALITY # Especially in Fer Diad episode",
      "THM_HONOR_OBLIGATION # Geis, honor codes, fosterage bonds",
      "THM_DIVINE_INTERVENTION_CONFLICT # Morrígan, Lug, and other deities",
      "THM_METAMORPHOSIS_TRANSFORMATION # Cú Chulainn's ríastrad (warp-spasm)",
      "THM_TABOO_TRANSGRESSION # Geis and their violation",
      "THM_PROPHECY_OMENS_DREAMS # Throughout the narrative",
      "THM_SOVEREIGNTY # Medb as sovereignty goddess figure",
      "THM_CATTLE_WEALTH # The bulls as symbols of power and prosperity",
      "THM_VENGEANCE_JUSTICE # Multiple revenge cycles",
      "THM_FOSTERAGE_KINSHIP # Foster relationships central to plot",
      "THM_SINGLE_COMBAT # Repeated motif throughout"
    ],
    "characterArchetypeTags": [
      "ARCH_HERO # Cú Chulainn",
      "ARCH_DIVINE_WARRIOR # Cú Chulainn (son of Lug)",
      "ARCH_SOVEREIGN_RULER # Medb, Ailill, Conchobor",
      "ARCH_SOVEREIGNTY_GODDESS # Medb",
      "ARCH_LOYAL_COMPANION # Láeg (Cú Chulainn's charioteer)",
      "ARCH_TRICKSTER # Fergus, Medb (at times)",
      "ARCH_MENTOR_TEACHER # Fergus (former teacher of Cú Chulainn)",
      "ARCH_TRAGIC_OPPONENT # Fer Diad",
      "ARCH_SHAPESHIFTER # Morrígan",
      "ARCH_HERALD_MESSENGER # Mac Roth",
      "ARCH_THRESHOLD_GUARDIAN # Various champions Cú Chulainn faces",
      "ARCH_SACRIFICIAL_FIGURE # Fer Diad, many warriors",
      "ARCH_WARRIOR_WOMAN # Various female warriors mentioned"
    ]
  },
  {
    "id": "ROM_AENEID_DRYDEN",
    "title": "The Aeneid",
    "titleOriginal": "Aeneis",
    "cultureGroup": "Roman",
    "languageOriginal": "lat",
    "summary": "Virgil's Roman national epic of Aeneas' flight from Troy, underworld descent, divine fate, conflict in Italy, and the mythic foundation of Roman destiny.",
    "sourcePrimary": {
      "title": "Aeneid",
      "author": "Virgil",
      "approx_date": "29-19 BCE"
    },
    "sourceDocument": {
      "text_title": "The Aeneid",
      "translator_author_editor": "John Dryden",
      "publisher": "Project Gutenberg",
      "publication_date": "1697",
      "url": "https://www.gutenberg.org/ebooks/228.txt.utf-8",
      "doi": "null",
      "notes": "Public-domain verse translation from Project Gutenberg eBook 228."
    },
    "mythTypeTags": [
      "MYTHTYPE_FOUNDATION",
      "MYTHTYPE_HERO_SAGA_LEGEND",
      "MYTHTYPE_DIVINE_MYTH"
    ],
    "themeTags": [
      "THM_HERO_JOURNEY",
      "THM_UNDERWORLD_JOURNEY",
      "THM_PROPHECY_FATE",
      "THM_SACRED_MARRIAGE",
      "THM_ORDER_VS_CHAOS"
    ],
    "characterArchetypeTags": [
      "ARCH_HERO",
      "ARCH_SOVEREIGN_RULER",
      "ARCH_WISE_OLD_MENTOR",
      "ARCH_TRANSFORMATIVE_FEMININE"
    ]
  },
  {
    "id": "GRK_ARGONAUTICA_SEATON",
    "title": "The Argonautica",
    "titleOriginal": "Argonautika",
    "cultureGroup": "Greek",
    "languageOriginal": "grc",
    "summary": "Apollonius Rhodius' Hellenistic epic of Jason, Medea, the Argonauts, the Golden Fleece, divine schemes, sea travel, heroic tests, and magical aid.",
    "sourcePrimary": {
      "title": "Argonautica",
      "author": "Apollonius Rhodius",
      "approx_date": "c. 3rd century BCE"
    },
    "sourceDocument": {
      "text_title": "The Argonautica",
      "translator_author_editor": "R. C. Seaton",
      "publisher": "Project Gutenberg",
      "publication_date": "1912",
      "url": "https://www.gutenberg.org/ebooks/830.txt.utf-8",
      "doi": "null",
      "notes": "Public-domain Loeb translation from Project Gutenberg eBook 830."
    },
    "mythTypeTags": [
      "MYTHTYPE_HERO_SAGA_LEGEND",
      "MYTHTYPE_DIVINE_MYTH",
      "MYTHTYPE_ETIOLOGICAL"
    ],
    "themeTags": [
      "THM_HERO_JOURNEY",
      "THM_SACRED_MARRIAGE",
      "THM_TRICKSTER_CYCLE",
      "THM_DIVINE_COMBAT",
      "THM_PROPHECY_FATE"
    ],
    "characterArchetypeTags": [
      "ARCH_HERO",
      "ARCH_TRANSFORMATIVE_FEMININE",
      "ARCH_TRICKSTER",
      "ARCH_THRESHOLD_GUARDIAN"
    ]
  },
  {
    "id": "EGY_BOOK_DEAD_BUDGE",
    "title": "The Egyptian Book of the Dead",
    "titleOriginal": "Book of Coming Forth by Day",
    "cultureGroup": "Egyptian",
    "languageOriginal": "egy",
    "summary": "Collection of funerary spells and prayers to guide the deceased through the underworld to the afterlife, including the famous Weighing of the Heart ceremony. The Book of the Dead provided the deceased with the knowledge and magical power to overcome obstacles and divine judges in the afterlife.",
    "sourcePrimary": {
      "title": "Book of Coming Forth by Day (Papyrus of Ani)",
      "author": "Unknown (priestly compilations from various periods)",
      "approx_date": "Texts range from Old Kingdom (c. 2686-2181 BCE) to New Kingdom (c. 1550-1070 BCE); Papyrus of Ani c. 1250 BCE"
    },
    "sourceDocument": {
      "text_title": "The Book of the Dead: The Papyrus of Ani",
      "translator_author_editor": "E. A. Wallis Budge",
      "publisher": "British Museum",
      "publication_date": "1895",
      "url": "https://www.sacred-texts.com/egy/ebod/",
      "doi": "null",
      "notes": "Translation of the Papyrus of Ani, one of the finest and most complete examples of the Book of the Dead from the 18th Dynasty. Includes hieroglyphic text with transliteration and translation."
    },
    "mythTypeTags": [
      "MYTHTYPE_ESCHATOLOGICAL",
      "MYTHTYPE_RITUAL_TEXT",
      "MYTHTYPE_COSMOGONY",
      "MYTHTYPE_DIVINE_MYTH"
    ],
    "themeTags": [
      "THM_DEATH_ORIGIN",
      "THM_UNDERWORLD_JOURNEY",
      "THM_DIVINE_JUDGMENT",
      "THM_RESURRECTION_REBIRTH",
      "THM_METAMORPHOSIS",
      "THM_CELESTIAL_PHENOMENA",
      "THM_COSMIC_ORDER_MAAT",
      "THM_MAGICAL_POWER",
      "THM_PROTECTION_DEFENSE",
      "THM_IMMORTALITY_AFTERLIFE"
    ],
    "characterArchetypeTags": [
      "ARCH_DECEASED_SOUL",
      "ARCH_PSYCHOPOMP",
      "ARCH_DIVINE_JUDGE",
      "ARCH_SOLAR_DEITY",
      "ARCH_UNDERWORLD_DEITY",
      "ARCH_PROTECTIVE_DEITY",
      "ARCH_THRESHOLD_GUARDIAN",
      "ARCH_DEMONIC_ANTAGONIST"
    ]
  },
  {
    "id": "AKK_GILGAMESH_RCT_EPIC # Akkadian_Gilgamesh_RCThompson_EntireEpic",
    "title": "The Epic of Gilgamesh (Trans. R. Campbell Thompson, 1928)",
    "titleOriginal": "Epic of Gilgamesh\" # Akkadian title varies / often referred to by incipit ša nagba īmuru (\"He who saw the Deep\")",
    "cultureGroup": "Akkadian # Primary language/culture of the Standard Babylonian version text (links to cultures.csv)",
    "languageOriginal": "akk # ISO 639-3 code for Akkadian",
    "summary": "The epic recounts the adventures of Gilgamesh, king of Uruk, and his companion Enkidu. It covers themes of heroism, friendship, loss, the fear of death, and the futile quest for immortality, culminating in Gilgamesh's acceptance of his mortal nature. Includes the famous Mesopotamian flood story.",
    "sourcePrimary": {
      "title": "Epic of Gilgamesh (Standard Babylonian Version)",
      "author": "Unknown (compiler Sin-liqi-unninni is credited for the 12-tablet version c. 1300-1000 BCE)",
      "approx_date": "Standard Version c. 1300-1000 BCE; based on older Sumerian tales (c. 2100 BCE) and Old Babylonian versions (c. 1800 BCE)"
    },
    "sourceDocument": {
      "text_title": "The Epic of Gilgamish",
      "translator_author_editor": "R. Campbell Thompson",
      "publisher": "LUZAC & CO.",
      "publication_date": "1928",
      "url": "https://www.sacred-texts.com/ane/eog/index.htm\" # Or more specific link if available",
      "doi": "null",
      "notes": "A literal translation rendered into English hexameters. Based on Thompson's collation of cuneiform tablets primarily from the British Museum's Nineveh library collection (7th Century BCE). Digitized by sacred-texts.com."
    },
    "mythTypeTags": "# REQUIRED: At least one type.",
    "themeTags": "# REQUIRED: Key themes.",
    "characterArchetypeTags": [
      "ARCH_SOVEREIGN_RULER # Gilgamesh",
      "ARCH_SHADOW_FIGURE # Tyrannical Gilgamesh (early); mortality itself",
      "ARCH_LOYAL_COMPANION # Enkidu",
      "ARCH_WILD_MAN # Enkidu (pre-civilization)",
      "ARCH_WISE_OLD_MENTOR # Ninsun, Siduri, Uta-Napishtim (in parts)",
      "ARCH_TRANSFORMATIVE_FEMININE # Shamhat (civilizing Enkidu); Ishtar (catalyst)",
      "ARCH_HERALD # Hunter (for Enkidu); Ur-shanabi",
      "ARCH_THRESHOLD_GUARDIAN # Scorpion-Men, Humbaba, Siduri (initially)",
      "ARCH_PRIMORDIAL_ANTAGONIST # Humbaba, Bull of Heaven",
      "ARCH_SACRIFICIAL_FIGURE # Enkidu (his death propels Gilgamesh's quest)"
    ]
  },
  {
    "id": "GRK_HOMERIC_HYMNS_EVELYN",
    "title": "The Homeric Hymns",
    "titleOriginal": "Homerikoi Hymnoi",
    "cultureGroup": "Greek",
    "languageOriginal": "grc",
    "summary": "A collection of ancient Greek hymns honoring major deities including Demeter, Apollo, Hermes, Aphrodite, Dionysus, Artemis, Athena, Poseidon, Helios, Selene, and the Dioscuri.",
    "sourcePrimary": {
      "title": "The Homeric Hymns",
      "author": "Anonymous Greek hymnists, traditionally attributed to Homer",
      "approx_date": "c. 7th-5th centuries BCE"
    },
    "sourceDocument": {
      "text_title": "Hesiod, the Homeric Hymns, and Homerica",
      "translator_author_editor": "Hugh G. Evelyn-White",
      "publisher": "Project Gutenberg / Loeb Classical Library source edition",
      "publication_date": "1914",
      "url": "https://www.gutenberg.org/ebooks/348.txt.utf-8",
      "doi": "null",
      "notes": "English public-domain text from Project Gutenberg eBook 348."
    },
    "mythTypeTags": [
      "MYTHTYPE_DIVINE_MYTH",
      "MYTHTYPE_HYMN_PRAYER",
      "MYTHTYPE_ETIOLOGICAL",
      "MYTHTYPE_HERO_SAGA_LEGEND"
    ],
    "themeTags": [
      "THM_DIVINE_INTERVENTION_CONFLICT",
      "THM_SACRED_MARRIAGE",
      "THM_UNDERWORLD_JOURNEY",
      "THM_METAMORPHOSIS",
      "THM_APOTHEOSIS",
      "THM_PROPHECY_FATE"
    ],
    "characterArchetypeTags": [
      "ARCH_SKY_FATHER",
      "ARCH_EARTH_MOTHER",
      "ARCH_DIVINE_CHILD",
      "ARCH_TRICKSTER",
      "ARCH_HERALD",
      "ARCH_SHAPESHIFTER"
    ]
  },
  {
    "id": "GRK_ILIAD_BUTLER",
    "title": "The Iliad",
    "titleOriginal": "Ilias",
    "cultureGroup": "Greek",
    "languageOriginal": "grc",
    "summary": "Homer's epic of wrath, honor, divine intervention, heroic warfare, mortality, and grief during the Trojan War, centered on Achilles, Hector, Agamemnon, Patroclus, Priam, and the gods.",
    "sourcePrimary": {
      "title": "Iliad",
      "author": "Homer",
      "approx_date": "c. 8th century BCE"
    },
    "sourceDocument": {
      "text_title": "The Iliad",
      "translator_author_editor": "Samuel Butler",
      "publisher": "Project Gutenberg",
      "publication_date": "1898",
      "url": "https://www.gutenberg.org/ebooks/2199.txt.utf-8",
      "doi": "null",
      "notes": "Public-domain prose translation from Project Gutenberg eBook 2199."
    },
    "mythTypeTags": [
      "MYTHTYPE_HERO_SAGA_LEGEND",
      "MYTHTYPE_DIVINE_MYTH",
      "MYTHTYPE_ETIOLOGICAL"
    ],
    "themeTags": [
      "THM_HERO_JOURNEY",
      "THM_DIVINE_COMBAT",
      "THM_DEATH_ORIGIN",
      "THM_PROPHECY_FATE",
      "THM_ORDER_VS_CHAOS"
    ],
    "characterArchetypeTags": [
      "ARCH_HERO",
      "ARCH_WARRIOR_HERO",
      "ARCH_SHADOW_ANTAGONIST",
      "ARCH_WISE_OLD_MENTOR",
      "ARCH_HERALD"
    ]
  },
  {
    "id": "FINN_KALEVALA_CRAWFORD",
    "title": "The Kalevala",
    "titleOriginal": "Kalevala",
    "cultureGroup": "Finnish",
    "languageOriginal": "fin",
    "summary": "The Finnish national epic compiled from oral folklore by Elias Lönnrot, recounting the adventures of heroes Väinämöinen, Ilmarinen, and Lemminkäinen. The epic encompasses themes of creation, heroic quests, magical conflicts, and the clash between paganism and Christianity, presenting a comprehensive mythology of ancient Finland.",
    "sourcePrimary": {
      "title": "Kalevala",
      "author": "Compiled by Elias Lönnrot from Finnish oral tradition",
      "approx_date": "First edition 1835; expanded edition 1849 (based on oral traditions dating back millennia)"
    },
    "sourceDocument": {
      "text_title": "The Kalevala",
      "translator_author_editor": "John Martin Crawford",
      "publisher": "The Robert Clarke Company",
      "publication_date": "1888",
      "edition": "Third Edition, 1910",
      "url": "https://www.sacred-texts.com/neu/kveng/index.htm",
      "doi": "null",
      "notes": "English translation in the original trochaic tetrameter verse form. Digitized by sacred-texts.com. Based on Lönnrot's 50-rune edition of 1849 containing 22,795 lines."
    },
    "mythTypeTags": [
      "MYTHTYPE_HERO_SAGA_LEGEND",
      "MYTHTYPE_DIVINE_MYTH",
      "MYTHTYPE_COSMOGONY",
      "MYTHTYPE_ETIOLOGICAL",
      "MYTHTYPE_ESCHATOLOGICAL"
    ],
    "themeTags": [
      "THM_HERO_JOURNEY",
      "THM_CREATION",
      "THM_MAGICAL_CONTEST",
      "THM_QUEST_TREASURE",
      "THM_DEATH_ORIGIN",
      "THM_UNDERWORLD_JOURNEY",
      "THM_FORBIDDEN_LOVE",
      "THM_ORDER_VS_CHAOS",
      "THM_METAMORPHOSIS",
      "THM_DIVINE_COMBAT",
      "THM_MUSIC_COSMIC_POWER",
      "THM_FORGE_CRAFTSMANSHIP",
      "THM_PRIMORDIAL_BATTLE",
      "THM_VIRGIN_BIRTH",
      "THM_SACRED_MARRIAGE",
      "THM_CULTURE_HERO"
    ],
    "characterArchetypeTags": [
      "ARCH_WISE_OLD_MENTOR # Väinämöinen",
      "ARCH_CULTURE_HERO # Väinämöinen",
      "ARCH_TRICKSTER # Lemminkäinen",
      "ARCH_DIVINE_CRAFTSMAN # Ilmarinen",
      "ARCH_TRAGIC_HERO # Kullervo",
      "ARCH_SHADOW_FIGURE # Kullervo, Louhi",
      "ARCH_TRANSFORMATIVE_FEMININE # Aino, Louhi, Mariatta",
      "ARCH_VIRGIN_MOTHER # Mariatta",
      "ARCH_PRIMORDIAL_ANTAGONIST # Louhi, Hiisi",
      "ARCH_SACRIFICIAL_FIGURE # Aino, Kullervo",
      "ARCH_DIVINE_MOTHER # Ilmatar"
    ]
  },
  {
    "id": "JPN_KOJIKI_CHAMBERLAIN",
    "title": "The Kojiki: Records of Ancient Matters",
    "titleOriginal": "古事記 (Kojiki)",
    "cultureGroup": "Japanese",
    "languageOriginal": "jpn # Classical Japanese (Old Japanese)",
    "summary": "The oldest extant chronicle in Japan (712 CE), recording Japanese mythology, legends, and early history from the Age of the Gods through imperial genealogies. Chronicles the creation of the world, the birth of the kami (deities), the founding of Japan, and the reigns of early emperors up to Empress Suiko.",
    "sourcePrimary": {
      "title": "Kojiki (Records of Ancient Matters)",
      "author": "Compiled by Ō no Yasumaro from oral traditions recited by Hieda no Are",
      "approx_date": "Completed 712 CE (Wadō 5); records traditions from mythological age through 628 CE"
    },
    "sourceDocument": {
      "text_title": "The Kojiki: Records of Ancient Matters",
      "translator_author_editor": "Basil Hall Chamberlain",
      "publisher": "Asiatic Society of Japan",
      "publication_date": "1882 # First presented to society; reprinted 1919",
      "url": "https://www.sacred-texts.com/shi/kj/index.htm",
      "doi": "null",
      "notes": "Complete translation of Japan's oldest extant book. Based on 1644 printed edition (first printing) and Motoori Norinaga's monumental 44-volume commentary (1789-1822). Translated from Classical Japanese written in a unique Chinese-character notation system."
    },
    "mythTypeTags": [
      "MYTHTYPE_DIVINE_MYTH # Age of Gods, creation myths",
      "MYTHTYPE_COSMOGONIC # Creation of world and Japan",
      "MYTHTYPE_ETIOLOGICAL # Origins of customs, places, rituals",
      "MYTHTYPE_HERO_SAGA_LEGEND # Tales of culture heroes and early emperors",
      "MYTHTYPE_DYNASTIC_LEGEND # Imperial genealogies and succession"
    ],
    "themeTags": [
      "THM_CREATION_ORIGIN # Creation of world and Japanese islands",
      "THM_DIVINE_INTERVENTION_CONFLICT # Constant interaction between kami and humans",
      "THM_UNDERWORLD_JOURNEY # Izanagi's descent to Yomi",
      "THM_SIBLING_CONFLICT # Amaterasu vs. Susanoo; various imperial conflicts",
      "THM_CULTURE_HERO # Various deities establishing civilization",
      "THM_SOVEREIGNTY_KINGSHIP # Legitimation of imperial line",
      "THM_DESCENT_FROM_HEAVEN # Ninigi's descent; Jimmu's campaigns",
      "THM_METAMORPHOSIS_TRANSFORMATION # Various divine transformations",
      "THM_TABOO_TRANSGRESSION # Looking taboos, ritual violations",
      "THM_TRICKSTER # Susanoo's disruptive behavior",
      "THM_FERTILITY_AGRICULTURE # Rice agriculture, food deities",
      "THM_DEATH_MORTALITY # Origin of death, burial customs"
    ],
    "characterArchetypeTags": [
      "ARCH_CREATOR_DEITY # Izanagi and Izanami",
      "ARCH_SOLAR_DEITY # Amaterasu",
      "ARCH_STORM_DEITY # Susanoo",
      "ARCH_TRICKSTER # Susanoo (destructive phase)",
      "ARCH_CULTURE_HERO # Ōkuninushi, Jimmu, various emperors",
      "ARCH_DIVINE_ANCESTOR # Amaterasu (imperial ancestor)",
      "ARCH_UNDERWORLD_RULER # Izanami (after death)",
      "ARCH_THRESHOLD_GUARDIAN # Various deities at boundaries",
      "ARCH_TRANSFORMER_SHAPESHIFTER # Multiple kami",
      "ARCH_PRIMORDIAL_ANTAGONIST # Yamata-no-Orochi",
      "ARCH_WISE_OLD_MENTOR # Various elder deities",
      "ARCH_SACRIFICIAL_FIGURE # Princess Kushinada (intended), others"
    ]
  },
  {
    "id": "WELSH_MABINOGION_GUEST",
    "title": "The Mabinogion",
    "titleOriginal": "Y Mabinogion",
    "cultureGroup": "Welsh",
    "languageOriginal": "cym # ISO 639-3 code for Middle Welsh",
    "summary": "A collection of eleven medieval Welsh tales, including the Four Branches of the Mabinogi (Pwyll, Branwen, Manawyddan, Math), three Arthurian romances (The Lady of the Fountain, Peredur, Geraint), and four independent tales (Kilhwch and Olwen, The Dream of Rhonabwy, The Dream of Maxen Wledig, Lludd and Llevelys, Taliesin). These tales preserve ancient Celtic mythology, heroic legends, and early Arthurian tradition.",
    "sourcePrimary": {
      "title": "Llyfr Coch Hergest (The Red Book of Hergest)",
      "author": "Unknown (multiple medieval Welsh authors and compilers)",
      "approx_date": "Tales composed c. 1050-1250 CE; Red Book manuscript c. 1382-1410 CE",
      "notes": "The tales draw on much older oral traditions, with some elements dating to pre-Christian Celtic mythology"
    },
    "sourceDocument": {
      "text_title": "The Mabinogion",
      "translator_author_editor": "Lady Charlotte Guest",
      "publisher": "Bernard Quaritch",
      "publication_date": "1877",
      "original_publication": "1838-1849 (first edition)",
      "url": "https://www.sacred-texts.com/neu/celt/mab/index.htm",
      "doi": "null",
      "notes": "Translated from the Llyfr Coch o Hergest (Red Book of Hergest) preserved in Jesus College, Oxford. Guest's translation was the first complete English translation and introduced these tales to the wider world. Digitized by sacred-texts.com."
    },
    "mythTypeTags": [
      "MYTHTYPE_HERO_SAGA_LEGEND",
      "MYTHTYPE_HERO_SAGA_LEGEND",
      "MYTHTYPE_ETIOLOGICAL",
      "MYTHTYPE_OTHERWORLD_JOURNEY",
      "MYTHTYPE_TRANSFORMATION_TALE"
    ],
    "themeTags": [
      "THM_HERO_JOURNEY",
      "THM_SOVEREIGNTY_KINGSHIP",
      "THM_OTHERWORLD_JOURNEY",
      "THM_DIVINE_COMBAT",
      "THM_METAMORPHOSIS",
      "THM_QUEST_ADVENTURE",
      "THM_MAGIC_ENCHANTMENT",
      "THM_HONOR_SHAME",
      "THM_HOSPITALITY_GUESTSHIP",
      "THM_BETRAYAL_REVENGE",
      "THM_LOVE_MARRIAGE",
      "THM_FERTILITY_BARRENNESS",
      "THM_FORBIDDEN_ACT_TRANSGRESSION",
      "THM_PROPHECY_FATE",
      "THM_TRICKSTER_DECEPTION",
      "THM_UNDERWORLD_JOURNEY",
      "THM_MONSTER_SLAYING",
      "THM_SHAPESHIFTING",
      "THM_ANIMALS_HELPERS_TOTEMS",
      "THM_NATURE_SEASONS"
    ],
    "characterArchetypeTags": [
      "ARCH_SOVEREIGN_RULER",
      "ARCH_TRICKSTER_MAGICIAN",
      "ARCH_WISE_OLD_MENTOR",
      "ARCH_SOVEREIGNTY_GODDESS",
      "ARCH_OTHERWORLD_BEING",
      "ARCH_LOYAL_COMPANION",
      "ARCH_THRESHOLD_GUARDIAN",
      "ARCH_SHADOW_FIGURE",
      "ARCH_DIVINE_CHILD",
      "ARCH_SACRIFICIAL_FIGURE",
      "ARCH_WILD_MAN",
      "ARCH_ENCHANTRESS_SORCERESS"
    ]
  },
  {
    "id": "IND_MAHABHARATA_GANGULI",
    "title": "The Mahabharata (Trans. Kisari Mohan Ganguli, 1883-1896)",
    "titleOriginal": "Mahābhārata",
    "cultureGroup": "Indian",
    "languageOriginal": "san # ISO 639-3 code for Sanskrit",
    "summary": "Massive Sanskrit epic recounting the Kurukshetra War between the Pandavas and Kauravas, including the Bhagavad Gita and countless philosophical and mythological digressions. Traditionally attributed to Vyasa, composed c. 400 BCE-400 CE.",
    "sourcePrimary": {
      "title": "Mahābhārata",
      "author": "Vyasa (traditional attribution)",
      "approx_date": "c. 400 BCE - 400 CE (composition spans several centuries)"
    },
    "sourceDocument": {
      "text_title": "The Mahabharata",
      "translator_author_editor": "Kisari Mohan Ganguli",
      "publication_date": "1883-1896",
      "url": "https://www.sacred-texts.com/hin/maha/index.htm",
      "doi": "null",
      "notes": "Complete English prose translation from the Sanskrit. Digitized by sacred-texts.com. This is one of the first complete English translations of the epic."
    },
    "mythTypeTags": [
      "MYTHTYPE_HERO_SAGA_LEGEND",
      "MYTHTYPE_HERO_SAGA_LEGEND",
      "MYTHTYPE_ETIOLOGICAL",
      "MYTHTYPE_COSMOGONY"
    ],
    "themeTags": [
      "THM_HERO_JOURNEY",
      "THM_DHARMA_RIGHTEOUSNESS",
      "THM_WAR_BATTLE",
      "THM_DEATH_ORIGIN",
      "THM_DIVINE_COMBAT",
      "THM_DESTINY_FATE",
      "THM_SACRIFICE",
      "THM_FAMILY_CONFLICT",
      "THM_JUSTICE_REVENGE",
      "THM_CREATION",
      "THM_COSMOLOGY"
    ],
    "characterArchetypeTags": [
      "ARCH_SOVEREIGN_RULER",
      "ARCH_WISE_OLD_MENTOR",
      "ARCH_TRICKSTER_ARCHETYPE",
      "ARCH_SHADOW_FIGURE",
      "ARCH_DIVINE_HERO",
      "ARCH_TRAGIC_FIGURE"
    ]
  },
  {
    "id": "GER_NIBELUNGENLIED",
    "title": "The Nibelungenlied",
    "titleOriginal": "Nibelungenlied",
    "cultureGroup": "Germanic",
    "languageOriginal": "gmh",
    "summary": "Middle High German heroic epic of Siegfried, Kriemhild, Brunhild, Hagen, dragon treasure, marriage politics, betrayal, revenge, and dynastic catastrophe.",
    "sourcePrimary": {
      "title": "Nibelungenlied",
      "author": "Unknown Middle High German poet",
      "approx_date": "c. 1200 CE"
    },
    "sourceDocument": {
      "text_title": "The Nibelungenlied",
      "translator_author_editor": "Daniel B. Shumway",
      "publisher": "Project Gutenberg",
      "publication_date": "1909",
      "url": "https://www.gutenberg.org/ebooks/1151.txt.utf-8",
      "doi": "null",
      "notes": "Public-domain translation from Project Gutenberg eBook 1151."
    },
    "mythTypeTags": [
      "MYTHTYPE_HERO_SAGA_LEGEND",
      "MYTHTYPE_FOUNDATION"
    ],
    "themeTags": [
      "THM_HERO_JOURNEY",
      "THM_DEATH_ORIGIN",
      "THM_PROPHECY_FATE",
      "THM_ORDER_VS_CHAOS"
    ],
    "characterArchetypeTags": [
      "ARCH_SHADOW_FIGURE",
      "ARCH_SOVEREIGN_RULER"
    ]
  },
  {
    "id": "GRK_ODYSSEY_BUTLER",
    "title": "The Odyssey",
    "titleOriginal": "Odysseia",
    "cultureGroup": "Greek",
    "languageOriginal": "grc",
    "summary": "Homer's epic of Odysseus' return from Troy, including sea journeys, monsters, divine opposition, trickery, hospitality, recognition, and restoration of household sovereignty.",
    "sourcePrimary": {
      "title": "Odyssey",
      "author": "Homer",
      "approx_date": "c. 8th century BCE"
    },
    "sourceDocument": {
      "text_title": "The Odyssey",
      "translator_author_editor": "Samuel Butler",
      "publisher": "Project Gutenberg",
      "publication_date": "1900",
      "url": "https://www.gutenberg.org/ebooks/1727.txt.utf-8",
      "doi": "null",
      "notes": "Public-domain prose translation from Project Gutenberg eBook 1727."
    },
    "mythTypeTags": [
      "MYTHTYPE_HERO_SAGA_LEGEND",
      "MYTHTYPE_DIVINE_MYTH",
      "MYTHTYPE_TRICKSTER_NARRATIVE"
    ],
    "themeTags": [
      "THM_HERO_JOURNEY",
      "THM_TRICKSTER_CYCLE",
      "THM_UNDERWORLD_JOURNEY",
      "THM_METAMORPHOSIS",
      "THM_PROPHECY_FATE"
    ],
    "characterArchetypeTags": [
      "ARCH_TRICKSTER",
      "ARCH_HERO",
      "ARCH_WISE_OLD_MENTOR",
      "ARCH_SHAPESHIFTER",
      "ARCH_THRESHOLD_GUARDIAN"
    ]
  },
  {
    "id": "NORSE_POETIC_EDDA_BELLOWS",
    "title": "The Poetic Edda",
    "titleOriginal": "Edda",
    "cultureGroup": "Norse",
    "languageOriginal": "non # ISO 639-3 code for Old Norse",
    "summary": "Collection of Old Norse poems from the Icelandic medieval manuscript Codex Regius, containing mythological and heroic lays. Includes poems about the gods (Voluspo, Hovamol, etc.) and heroes (Volundarkvitha, Helgi lays, Sigurd cycle). These poems preserve ancient Germanic mythology and legend, dating from approximately 850-1050 CE, though based on older oral traditions.",
    "sourcePrimary": {
      "title": "Poetic Edda (Codex Regius and other manuscripts)",
      "author": "Unknown (multiple poets, oral tradition)",
      "approx_date": "c. 850-1050 CE (composition); manuscripts from c. 1270-1300 CE"
    },
    "sourceDocument": {
      "text_title": "The Poetic Edda",
      "translator_author_editor": "Henry Adams Bellows",
      "publisher": "Princeton University Press / American Scandinavian Foundation",
      "publication_date": "1936",
      "url": "https://www.sacred-texts.com/neu/poe/index.htm",
      "doi": "null",
      "notes": "Translation from Old Norse with extensive scholarly notes. Based primarily on Codex Regius (c. 1270) with additional poems from other manuscripts. Digitized by sacred-texts.com. Public domain."
    },
    "mythTypeTags": [
      "MYTHTYPE_DIVINE_MYTH",
      "MYTHTYPE_HERO_SAGA_LEGEND",
      "MYTHTYPE_COSMOGONY",
      "MYTHTYPE_ESCHATOLOGICAL",
      "MYTHTYPE_ETIOLOGICAL"
    ],
    "themeTags": [
      "THM_CREATION",
      "THM_DEATH_ORIGIN",
      "THM_HERO_JOURNEY",
      "THM_DIVINE_COMBAT",
      "THM_PROPHECY_FATE",
      "THM_FATE_DESTINY",
      "THM_UNDERWORLD_JOURNEY",
      "THM_METAMORPHOSIS",
      "THM_ORDER_VS_CHAOS",
      "THM_LOVE_DESIRE",
      "THM_TRICKSTER_CYCLE",
      "THM_COSMIC_ORDER_DESTRUCTION"
    ],
    "characterArchetypeTags": [
      "ARCH_SUPREME_DEITY # Odin",
      "ARCH_TRICKSTER # Loki",
      "ARCH_HERO # Sigurd, Helgi",
      "ARCH_WARRIOR_MAIDEN # Brynhild, Valkyries",
      "ARCH_WISE_WOMAN # Volva, Sigrdrifa",
      "ARCH_TRAGIC_HERO",
      "ARCH_MONSTER_SLAYER"
    ]
  },
  {
    "id": "NORSE_PROSE_EDDA_BRODEUR",
    "title": "The Prose Edda",
    "titleOriginal": "Snorra Edda",
    "cultureGroup": "Norse",
    "languageOriginal": "non # ISO 639-3 code for Old Norse",
    "summary": "13th century compilation of Norse mythology and poetics by Snorri Sturluson. The Gylfaginning (Deception of Gylfi) presents the Norse creation myth and tales of the gods in dialogue form. The Prologue offers a euhemeristic interpretation of the gods as historical figures from Troy. Skáldskaparmál begins with additional mythological narratives before transitioning to poetic instruction.",
    "sourcePrimary": {
      "title": "Prose Edda (Snorra Edda)",
      "author": "Snorri Sturluson",
      "approx_date": "c. 1220 CE (composition); based on c. 13th-14th century manuscripts"
    },
    "sourceDocument": {
      "text_title": "The Prose Edda",
      "translator_author_editor": "Arthur Gilchrist Brodeur",
      "publisher": "The American-Scandinavian Foundation",
      "publication_date": "1916",
      "publication_place": "New York",
      "url": "https://www.sacred-texts.com/neu/pre/index.htm",
      "doi": "null",
      "notes": "Translated from the Icelandic with an Introduction by Arthur Gilchrist Brodeur, Ph.D. Digitized by sacred-texts.com, July 2001."
    },
    "mythTypeTags": [
      "MYTHTYPE_DIVINE_MYTH",
      "MYTHTYPE_COSMOGONIC_CREATION",
      "MYTHTYPE_ETIOLOGICAL",
      "MYTHTYPE_ESCHATOLOGICAL"
    ],
    "themeTags": [
      "THM_CREATION",
      "THM_DEATH_ORIGIN",
      "THM_ESCHATOLOGY_APOCALYPSE",
      "THM_DIVINE_SUCCESSION_CONFLICT",
      "THM_WORLD_TREE_COSMIC_AXIS",
      "THM_GIANT_PRIMORDIAL_BEING",
      "THM_FATE_DESTINY",
      "THM_WISDOM_KNOWLEDGE_QUEST",
      "THM_SACRIFICE_OFFERING",
      "THM_TRICKSTER_CYCLE",
      "THM_METAMORPHOSIS",
      "THM_THEFT_RECOVERY_TREASURE"
    ],
    "characterArchetypeTags": [
      "ARCH_ALLFATHER_SKY_GOD",
      "ARCH_THUNDER_WARRIOR_GOD",
      "ARCH_DYING_RESURRECTING_GOD",
      "ARCH_TRICKSTER_ARCHETYPE",
      "ARCH_WISE_OLD_MENTOR",
      "ARCH_GIANT_PRIMORDIAL",
      "ARCH_FATE_WEAVER",
      "ARCH_THRESHOLD_GUARDIAN",
      "ARCH_WORLD_SERPENT"
    ]
  },
  {
    "id": "EGY_PYRAMID_TEXTS_MERCER # Egyptian_PyramidTexts_Mercer",
    "title": "The Pyramid Texts (Trans. Samuel A. B. Mercer, 1952)",
    "titleOriginal": "Pyramid Texts\" # Ancient Egyptian funerary texts",
    "cultureGroup": "Egyptian # Ancient Egyptian religion",
    "languageOriginal": "egy # ISO 639-3 code for Ancient Egyptian",
    "summary": "The oldest large body of religious texts known to humanity, inscribed in pyramids of Old Kingdom pharaohs (c. 2350-2175 BCE). These sacred texts contain spells, rituals, hymns, and incantations designed to ensure the pharaoh's successful resurrection, ascension to heaven, and eternal life among the gods.",
    "sourcePrimary": {
      "title": "Pyramid Texts (Inscriptions from Old Kingdom Pyramids)",
      "author": "Unknown (compiled by royal scribes and priests)",
      "approx_date": "Inscribed c. 2350-2175 BCE (Fifth-Sixth Dynasties); many texts likely much older, some pre-dating the unification of Egypt (before c. 3000 BCE)",
      "location": "Pyramids at Saqqara (Unas, Teti, Pepi I, Merenre, Pepi II, and queens Neit, Oudjebten, Apouit)"
    },
    "sourceDocument": {
      "text_title": "The Pyramid Texts",
      "translator_author_editor": "Samuel A. B. Mercer",
      "publisher": "Longmans, Green & Co.",
      "publication_date": "1952",
      "publication_place": "New York, London, Toronto",
      "url": "https://www.sacred-texts.com/egy/pyt/index.htm",
      "doi": "null",
      "notes": "First complete English translation with full commentary. Based on Sethe's hieroglyphic edition plus additional texts from pyramids of Neit, Pepi II, and others discovered after Sethe's work. Over 700 utterances comprising approximately 2,500 distinct lines. Digitized by sacred-texts.com, 2004."
    },
    "mythTypeTags": [
      "MYTHTYPE_DIVINE_MYTH # Extensive involvement of gods",
      "MYTHTYPE_RITUAL_TEXT # Funerary and offering rituals",
      "MYTHTYPE_ESCHATOLOGICAL # Focus on death, afterlife, resurrection",
      "MYTHTYPE_COSMOGONIC # Creation myths and cosmic order",
      "MYTHTYPE_ETIOLOGICAL # Explains nature of death, divine kingship"
    ],
    "themeTags": [
      "THM_DEATH_MORTALITY # Central theme",
      "THM_RESURRECTION_REBIRTH # Pharaoh's resurrection",
      "THM_ASCENSION_HEAVEN # Journey to heaven",
      "THM_DIVINE_KINGSHIP # Pharaoh as divine being",
      "THM_UNDERWORLD_JOURNEY # Navigation of the afterlife",
      "THM_SOLAR_THEOLOGY # Re and solar cult",
      "THM_STELLAR_IMMORTALITY # King as star",
      "THM_RITUAL_MAGIC # Magical spells and incantations",
      "THM_BODILY_RESTORATION # Reconstitution of the body",
      "THM_OFFERINGS_SUSTENANCE # Food and drink for the deceased",
      "THM_PROTECTION_DEFENSE # Against serpents, enemies, evil",
      "THM_DIVINE_TRANSFORMATION # King becoming a god",
      "THM_COSMIC_ORDER # Maat and divine order",
      "THM_CREATION_ORIGIN # Cosmogonic elements"
    ],
    "characterArchetypeTags": [
      "ARCH_DIVINE_KING # Deceased pharaoh as god",
      "ARCH_SOLAR_DEITY # Re, Atum, and solar aspects",
      "ARCH_DYING_RISING_GOD # Osiris",
      "ARCH_SKY_GODDESS # Nut",
      "ARCH_EARTH_GOD # Geb",
      "ARCH_PROTECTIVE_DEITY # Isis, Nephthys",
      "ARCH_PSYCHOPOMP # Ferryman, Thoth",
      "ARCH_COSMIC_SERPENT # Apep and protective serpents",
      "ARCH_WISDOM_GOD # Thoth"
    ]
  },
  {
    "id": "IND_RAMAYANA_GRIFFITH # Indian_Ramayana_RalphGriffith_CompleteEpic",
    "title": "The Ramayana (Trans. Ralph T. H. Griffith, 1870-1874)",
    "titleOriginal": "Rāmāyaṇa\" # Sanskrit",
    "cultureGroup": "Indian # Primary culture (links to cultures.csv)",
    "languageOriginal": "san # ISO 639-3 code for Sanskrit",
    "summary": "Ancient Sanskrit epic recounting Prince Rama's exile, the abduction of his wife Sita by demon king Ravana, and the epic war to rescue her. The epic explores themes of dharma (duty), honor, loyalty, and the triumph of good over evil. Composed c. 5th-4th century BCE, it is one of the two great epics of India alongside the Mahabharata.",
    "sourcePrimary": {
      "title": "Rāmāyaṇa (The Story of Rama)",
      "author": "Valmiki (Vālmīki)",
      "approx_date": "c. 5th-4th century BCE; traditional date often given as c. 500 BCE, though composition may have spanned several centuries"
    },
    "sourceDocument": {
      "text_title": "The Rámáyan of Válmíki, Translated into English Verse",
      "translator_author_editor": "Ralph T. H. Griffith",
      "publisher": "Trübner & Co. (London); E. J. Lazarus and Co. (Benares)",
      "publication_date": "1870-1874",
      "url": "https://www.sacred-texts.com/hin/rama/",
      "doi": "null",
      "notes": "Verse translation of Valmiki's Ramayana in six books (Books I-VI). Book VII (Uttara Kánda) was not included in Griffith's edition. Digitized by sacred-texts.com from the 1870-1874 edition. This text is in the public domain."
    },
    "mythTypeTags": "# REQUIRED: At least one type.",
    "themeTags": "# REQUIRED: Key themes.",
    "characterArchetypeTags": [
      "ARCH_DIVINE_HERO # Rama as avatar of Vishnu",
      "ARCH_SOVEREIGN_RULER # Rama as rightful king",
      "ARCH_LOYAL_COMPANION # Lakshmana, Hanuman",
      "ARCH_VIRTUOUS_HEROINE # Sita",
      "ARCH_DARK_ANTAGONIST # Ravana",
      "ARCH_TRICKSTER_SHAPESHIFTER # Various demons (Maricha)",
      "ARCH_WISE_OLD_MENTOR # Various sages (Vishvamitra, Vasistha)",
      "ARCH_DEVOTED_SERVANT # Hanuman",
      "ARCH_TRAGIC_FIGURE # Dasharatha",
      "ARCH_JEALOUS_RIVAL # Kaikeyi (stepmother)"
    ]
  },
  {
    "id": "VED_RG_VEDA_GRIFFITH",
    "title": "The Rig Veda",
    "titleOriginal": "Rgveda",
    "cultureGroup": "Vedic Indian",
    "languageOriginal": "san",
    "summary": "The oldest Vedic collection of hymns, addressed to deities such as Agni, Indra, Soma, Varuna, Ushas, the Maruts, and the Ashvins, preserving ritual, cosmological, and sacrificial poetry from early Indo-Aryan tradition.",
    "sourcePrimary": {
      "title": "Rgveda Samhita",
      "author": "Anonymous Vedic poets and priestly lineages",
      "approx_date": "c. 1500-1200 BCE"
    },
    "sourceDocument": {
      "text_title": "The Rig Veda",
      "translator_author_editor": "Ralph T. H. Griffith",
      "publisher": "Public-domain mirror of sacred-texts.com scan",
      "publication_date": "1896",
      "url": "https://philosophy1.narod.ru/www/html/library/asiatica/indica/sruti/rge/index.html",
      "doi": "null",
      "notes": "Second edition Griffith translation; public-domain mirror used because sacred-texts.com blocks automated download."
    },
    "mythTypeTags": [
      "MYTHTYPE_HYMN_PRAYER",
      "MYTHTYPE_DIVINE_MYTH",
      "MYTHTYPE_COSMOGONY",
      "MYTHTYPE_RITUAL_TEXT",
      "MYTHTYPE_ETIOLOGICAL"
    ],
    "themeTags": [
      "THM_CREATION",
      "THM_COSMOLOGY_STRUCTURE",
      "THM_DIVINE_COMBAT",
      "THM_SACRED_MARRIAGE",
      "THM_CELESTIAL_PHENOMENA",
      "THM_ORDER_VS_CHAOS",
      "THM_FIRE_ORIGIN"
    ],
    "characterArchetypeTags": [
      "ARCH_SKY_FATHER",
      "ARCH_DIVINE_CHILD",
      "ARCH_CULTURE_HERO_ARCHETYPE",
      "ARCH_WARRIOR_HERO",
      "ARCH_EARTH_MOTHER",
      "ARCH_TRICKSTER"
    ]
  },
  {
    "id": "PER_SHAHNAMEH_ATKINSON",
    "title": "The Shah Nameh",
    "titleOriginal": "Shahnameh",
    "cultureGroup": "Persian",
    "languageOriginal": "fas",
    "summary": "Ferdowsi's Persian Book of Kings in James Atkinson's public-domain English rendering, presenting mythic and legendary Iranian kings and heroes including Kaiumers, Husheng, Jemshid, Zahhak, Feridun, Zal, Rustem, Sohrab, Siyawush, and Isfandiyar.",
    "sourcePrimary": {
      "title": "Shahnameh",
      "author": "Ferdowsi",
      "approx_date": "c. 977-1010 CE"
    },
    "sourceDocument": {
      "text_title": "The Persian Literature, Comprising The Shah Nameh, The Rubaiyat, The Divan, and The Gulistan, Volume 1",
      "translator_author_editor": "James Atkinson",
      "publisher": "Project Gutenberg / Colonial Press revised edition source",
      "publication_date": "1909",
      "url": "https://www.gutenberg.org/ebooks/10315.txt.utf-8",
      "doi": "null",
      "notes": "Public-domain abridged prose-and-verse English rendering from Project Gutenberg eBook 10315."
    },
    "mythTypeTags": [
      "MYTHTYPE_HERO_SAGA_LEGEND",
      "MYTHTYPE_FOUNDATION",
      "MYTHTYPE_DIVINE_MYTH",
      "MYTHTYPE_ETIOLOGICAL"
    ],
    "themeTags": [
      "THM_HERO_JOURNEY",
      "THM_DIVINE_COMBAT",
      "THM_PROPHECY_FATE",
      "THM_ORDER_VS_CHAOS",
      "THM_GOLDEN_AGE_LOST",
      "THM_APOTHEOSIS"
    ],
    "characterArchetypeTags": [
      "ARCH_HERO",
      "ARCH_WARRIOR_HERO",
      "ARCH_WISE_OLD_MENTOR",
      "ARCH_SHADOW_ANTAGONIST",
      "ARCH_SOVEREIGN_RULER",
      "ARCH_CULTURE_HERO_ARCHETYPE"
    ]
  },
  {
    "id": "NORSE_VOLSUNGA_SAGA_MAGNUSSON_MORRIS",
    "title": "The Story of the Volsungs",
    "titleOriginal": "Volsunga Saga",
    "cultureGroup": "Norse",
    "languageOriginal": "non",
    "summary": "Legendary Norse saga of the Volsung lineage, Sigurd, Brynhild, Gudrun, dragon-slaying, cursed treasure, vengeance, oaths, heroic fate, and dynastic ruin.",
    "sourcePrimary": {
      "title": "Volsunga Saga",
      "author": "Unknown Icelandic saga compiler",
      "approx_date": "c. 13th century CE"
    },
    "sourceDocument": {
      "text_title": "The Story of the Volsungs",
      "translator_author_editor": "Eiríkr Magnússon and William Morris",
      "publisher": "Project Gutenberg",
      "publication_date": "1888",
      "url": "https://www.gutenberg.org/ebooks/1152.txt.utf-8",
      "doi": "null",
      "notes": "Public-domain translation from Project Gutenberg eBook 1152."
    },
    "mythTypeTags": [
      "MYTHTYPE_HERO_SAGA_LEGEND",
      "MYTHTYPE_MONSTER_LEGEND",
      "MYTHTYPE_DIVINE_MYTH"
    ],
    "themeTags": [
      "THM_HERO_JOURNEY",
      "THM_PROPHECY_FATE",
      "THM_DIVINE_COMBAT",
      "THM_DEATH_ORIGIN",
      "THM_GOLDEN_AGE_LOST"
    ],
    "characterArchetypeTags": [
      "ARCH_HERO",
      "ARCH_SHADOW_ANTAGONIST",
      "ARCH_WISE_OLD_MENTOR",
      "ARCH_TRANSFORMATIVE_FEMININE"
    ]
  },
  {
    "id": "GRK_THEOGONY_HESIOD_EVELYN",
    "title": "Theogony",
    "titleOriginal": "Theogonia",
    "cultureGroup": "Greek",
    "languageOriginal": "grc",
    "summary": "Hesiod's account of the origins, genealogies, and succession struggles of the Greek gods, moving from Chaos and Gaia through the Titans to Zeus's ordering of divine sovereignty.",
    "sourcePrimary": {
      "title": "Theogony",
      "author": "Hesiod",
      "approx_date": "c. 700 BCE"
    },
    "sourceDocument": {
      "text_title": "Hesiod, the Homeric Hymns, and Homerica",
      "translator_author_editor": "Hugh G. Evelyn-White",
      "publisher": "Project Gutenberg / Loeb Classical Library source edition",
      "publication_date": "1914",
      "url": "https://www.gutenberg.org/ebooks/348.txt.utf-8",
      "doi": "null",
      "notes": "English public-domain text from Project Gutenberg eBook 348."
    },
    "mythTypeTags": [
      "MYTHTYPE_THEOGONY",
      "MYTHTYPE_COSMOGONY",
      "MYTHTYPE_DIVINE_MYTH",
      "MYTHTYPE_ETIOLOGICAL"
    ],
    "themeTags": [
      "THM_CREATION",
      "THM_ORDER_VS_CHAOS",
      "THM_DIVINE_COMBAT",
      "THM_SOVEREIGNTY",
      "THM_PROPHECY_FATE",
      "THM_COSMOLOGY_STRUCTURE"
    ],
    "characterArchetypeTags": [
      "ARCH_SKY_FATHER",
      "ARCH_EARTH_MOTHER",
      "ARCH_TRICKSTER",
      "ARCH_CULTURE_HERO_ARCHETYPE",
      "ARCH_SHAPESHIFTER",
      "ARCH_SHADOW_ANTAGONIST"
    ]
  }
];

export const cultureGroups = Array.from(new Set(works.map(w => w.cultureGroup))).sort();
