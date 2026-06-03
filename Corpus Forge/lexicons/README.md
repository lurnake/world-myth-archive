# World Myth Archive - Controlled Vocabularies

This directory contains CSV files defining controlled vocabularies (lexicons) used to tag and categorize content within the World Myth Archive. These vocabularies are designed to enhance discoverability, support comparative analysis, and ensure academic robustness in the study of global mythologies.

## General Principles

*   **Sources:** Each vocabulary is derived from, or inspired by, established academic works in mythology, folklore, anthropology, and ritual studies. Specific sources and the rationale for term selection are noted for each lexicon.
*   **Structure:** CSV files generally follow a `code,label,notes` structure. Fields containing internal commas are enclosed in double quotes (`"`) to ensure correct parsing.
    *   `code`: A unique, machine-readable identifier (ALL-CAPS_SNAKE_CASE).
    *   `label`: A human-readable display name.
    *   `notes`: A brief explanation of the term's meaning, scope, or source-specific context, crucial for consistent application and LLM understanding.
*   **Application:** These vocabularies are intended to be used for tagging:
    *   Entire mythological narratives or texts.
    *   Specific "chunks" or segments within texts (e.g., paragraphs, episodes).
    *   This allows for both high-level categorization and fine-grained analysis, including semantic search via embeddings of these tagged chunks.
*   **Extensibility:** These lists are foundational but can be extended. When adding new terms:
    *   Append new rows to the relevant CSV.
    *   Ensure `code` is unique and follows the ALL-CAPS_SNAKE_CASE format.
    *   Provide a clear `notes` entry to define the term's intended meaning and scope.
    *   Consider if a new term genuinely adds a new dimension or if an existing term can be clarified/broadened.
*   **LLM Interaction:**
    1.  Load each CSV into a lookup dictionary.
    2.  When prompting an LLM for tagging, provide the relevant list of codes/labels (e.g., "Select **only** from the following `theme_tags` list: ...").
    3.  Validate LLM output strings against the dictionary keys/labels to ensure only controlled terms are used.

## Core Vocabularies

---

### 1. `theme_tags.csv`

*   **Purpose:** To identify high-level, recurring conceptual motifs or central ideas that appear across diverse mythologies. Themes represent the "what" – the core subjects or concerns addressed by myths.
*   **Key Source(s) & Inspiration:**
    *   **Stith Thompson, *Motif-Index of Folk-Literature* (Rev. ed., 6 vols., Indiana University Press, 1955-1958):** The top-level categories of this monumental work provide a foundational list of widely recognized narrative elements.
    *   **Michael Witzel, Comparative Mythological Studies:** Concepts from Witzel's work on global mythological patterns, particularly ideas that informed his book *The Origins of the World's Mythologies* (Oxford University Press, 2012) and related papers (e.g., his discussions on "Laurasian" mythology motifs), helped shape the selection and scope of themes with a view towards broad, cross-cultural applicability.
*   **Rationale:** The terms in this lexicon are distilled from these sources to provide a manageable yet comprehensive set of tags for common thematic concerns found in global mythologies. The aim is to group myths by their fundamental subject matter.
*   **CSV File:** `theme_tags.csv`

---

### 2. `rite_tags.csv`

*   **Purpose:** To categorize human ritual actions, their structures, and their symbolic meanings as described in or related to mythological narratives.
*   **Key Source(s):**
    *   **Arnold van Gennep, *The Rites of Passage* (Engl. trans., University of Chicago Press, 1960; orig. French 1909):** Van Gennep's classic work provides the tripartite structure of rites of passage (separation, transition/liminality, incorporation/aggregation).
    *   **Catherine Bell, *Ritual: Perspectives and Dimensions* (Oxford University Press, 1997):** Bell's comprehensive analysis of ritual theory and types informs the broader categories of ritual practice included.
*   **Rationale:** Based on these seminal works in ritual studies, these tags help identify and classify ritualistic elements, their phases, and common types of ritual practice.
*   **CSV File:** `rite_tags.csv`

---

### 3. `proppian_functions.csv`

*   **Purpose:** To identify specific narrative functions or plot elements according to Vladimir Propp's morphological analysis of a specific set of tales.
*   **Key Source(s):**
    *   **Vladimir Propp, *Morphology of the Folktale* (Engl. trans., 2nd ed., University of Texas Press, 1968; orig. Russian 1928):** This vocabulary directly implements Propp's 31 "functions" of the dramatis personae.
*   **Rationale:** Propp's functions offer a detailed framework for structural analysis. This vocabulary is included for its historical importance and its utility in dissecting narratives that conform to the specific structure he identified.
*   **Important Application Note:** Propp developed his morphology for a corpus of Russian fairy tales (roughly corresponding to Aarne-Thompson types 300-749). While highly influential, **it is not a universal grammar for all myths and tales.** These tags should be applied judiciously, primarily to narratives that fit the heroic quest/fairy tale structure. **Consider especially carefully before applying Proppian functions to non-European texts**, as the morphology was derived from a specific cultural tradition and may not map well onto other narrative structures and cultural frameworks. It is recommended to note explicitly in any analysis when Proppian functions are being used.
*   **CSV File:** `proppian_functions.csv`

---

### 4. `myth_episode.csv`

*   **Purpose:** To identify common narrative building blocks, scenes, or sequential plot segments that recur in mythic storytelling. Episodes focus on plot components rather than overarching themes.
*   **Key Source(s) & Inspiration:**
    *   **Michael Witzel, *The Origins of the World's Mythologies* (Oxford University Press, 2012):** Witzel's overarching "novel" framework (Creation > Primeval/Ages of Gods/Heroes > Destruction) provides a spine for identifying large-scale episodic sequences common in many traditions.
    *   **Joseph Campbell, *The Hero with a Thousand Faces* (Princeton University Press, 1st ed. 1949):** While `theme_tags.csv` includes the Campbellian Hero's Journey as a theme, specific stages or common episodes from heroic narratives (e.g., descent to underworld, monster slaying) are also relevant here as narrative units, inspired by Campbell's detailing of heroic arcs.
    *   **General Comparative Mythology:** The selection also includes widely recognized narrative episodes (e.g., Flood, Theft of Fire) from general comparative studies.
*   **Rationale:** These tags help break down larger narratives into recognizable episodic units, facilitating comparison of narrative structures and common story beats across different mythologies.
*   **CSV File:** `myth_episode.csv`

---

### 5. `social_role_tags.csv` (Socio-Cultural Roles)

*   **Purpose:** To identify the symbolic roles or societal principles embodied by characters, deities, or elements within a myth, often reflecting culturally recognized structures, values, or existential concerns from a socio-cultural perspective. These tags focus on the dramatis personae—what roles characters perform within the story world.
*   **Key Source(s) & Inspiration:**
    *   **Georges Dumézil, Trifunctional Hypothesis:** Dumézil's extensive work (e.g., *Mitra-Varuna*, 1948; *L'Idéologie Tripartie des Indo-Européens*, 1958) identified three core societal functions (sovereignty, warrior, fertility/production) as central to Indo-European ideology and mythology. These are included with clear indication of their primary domain.
    *   **Roman Jakobson, Structuralist Approaches:** Jakobson's work on the functions of language and his structuralist analyses provide a broader inspiration for identifying fundamental functional roles within narrative from a communications perspective, such as the Trickster or Civilizer/Culture Hero.
    *   **General Mythological Analysis:** Other roles (e.g., Cosmic Orderer, Psychopomp) are derived from commonly identified roles of figures in diverse mythologies.
*   **Rationale:** These tags help analyze the deeper symbolic roles and societal or cosmic principles represented in myths, as understood within their cultural or historical context. This vocabulary is distinct from `cognitive_function_tags.csv`, which focuses on hypothesized underlying cognitive or evolutionary purposes.
*   **Important Application Note:** Dumézil's trifunctional system is primarily an analytical framework for **Indo-European** societies. While insightful for that context, it should be applied with caution to non-Indo-European myths. The other roles listed generally have broader cross-cultural applicability.
*   **CSV File:** `social_role_tags.csv`

---

### 6. `myth_type_tags.csv`

*   **Purpose:** To categorize mythological narratives based on their overall genre, primary purpose, or structural form as commonly understood in folkloristics and myth studies.
*   **Key Source(s) & Inspiration:**
    *   **General Folkloristics and Myth Studies:** This vocabulary draws on common classifications used in the study of myth and folklore.
    *   **Alan Dundes, (e.g., in *Sacred Narrative: Readings in the Theory of Myth*, University of California Press, 1984):** Dundes' work on distinguishing genres like myth, legend, and folktale, and his emphasis on etic (analytical) categories informs the approach.
    *   **Lauri Honko, "The Problem of Defining Myth" (in Dundes, *Sacred Narrative*, 1984):** Honko's criteria for what constitutes a myth (e.g., dealing with cosmogony, sacred beings, setting precedents) influence the definition of several types.
    *   **Bronisław Malinowski, *Myth in Primitive Psychology* (1926):** His concept of myth as a "social charter" is represented by the `MYTHTYPE_CHARTER` tag.
*   **Rationale:** Provides a high-level classification of the narratives themselves, helping to understand their purported role, the kind of explanation they offer, or their narrative framing.
*   **CSV File:** `myth_type_tags.csv`

---

### 7. `character_archetype_tags.csv`

*   **Purpose:** To identify recurring symbolic character roles or patterns of being that appear across myths and stories. Archetypes represent fundamental human experiences or universal aspects of the psyche as expressed in narrative.
*   **Key Source(s) & Inspiration:**
    *   **Carl Jung, *Archetypes and the Collective Unconscious (Collected Works Vol. 9 Part 1)*, and other writings:** Jung's psychoanalytic concept of archetypes as primordial images or patterns in the collective unconscious is a primary inspiration.
    *   **Joseph Campbell, *The Hero with a Thousand Faces* and other works:** Campbell popularized and applied archetypal analysis to hero myths worldwide.
    *   **Mircea Eliade, (e.g., *The Myth of the Eternal Return*, 1954; *Patterns in Comparative Religion*, 1958):** Eliade's work on recurring patterns and symbols in religious and mythological phenomena also informs an archetypal perspective.
    *   **General Comparative Mythology:** The list includes archetypes commonly recognized by scholars in comparative mythology beyond direct Jungian interpretation, representing frequently observed character patterns.
*   **Rationale:** These tags help in understanding the symbolic roles characters play beyond their literal actions, connecting them to potentially universal patterns of human experience and storytelling. An archetype is distinct from a character's socio-cultural role (from `social_role_tags.csv`) or their hypothesized cognitive function.
*   **CSV File:** `character_archetype_tags.csv`

---

### 8. `cognitive_function_tags.csv`

*   **Purpose:** To categorize myths based on hypothesized cognitive, evolutionary, and social functions that may explain why particular narratives emerge, persist, and are compelling to the human mind. These tags go beyond thematic surface elements or socio-cultural roles to address underlying cognitive and adaptive purposes.
*   **Key Source(s) & Inspiration:**
    *   **Pascal Boyer, *Religion Explained: The Evolutionary Origins of Religious Thought* (Basic Books, 2001):** Provides foundational concepts like Hyperactive Agency Detection (HADD) and the role of minimally counterintuitive (MCI) concepts in the memorability of religious/mythical ideas.
    *   **Scott Atran, *In Gods We Trust: The Evolutionary Landscape of Religion* (Oxford University Press, 2002):** Explores the evolutionary basis of religious belief, including costly signaling, coalition building, and the byproducts of cognitive mechanisms.
    *   **Joseph Henrich, *The Secret of Our Success: How Culture Is Driving Human Evolution, Domesticating Our Species, and Making Us Smarter* (Princeton University Press, 2015) and *The WEIRDest People in the World: How the West Became Psychologically Peculiar and Particularly Prosperous* (Farrar, Straus and Giroux, 2020):** These works highlight the role of cultural evolution, social learning, and how myths and rituals can function as adaptive cultural mechanisms for cooperation, norm transmission, and knowledge accumulation.
*   **Rationale:** Cognitive and evolutionary approaches offer hypotheses for why certain mythic narratives and structures are widespread or particularly "sticky": they may tap into innate cognitive biases (e.g., agency detection), leverage memory systems effectively (e.g., MCI concepts), solve adaptive problems (e.g., facilitating cooperation, managing threats), or reinforce social norms crucial for group survival. Tagging myths by these hypothesized functions can deepen comparative analysis, revealing potential insights into human psychology, social behavior, and cultural evolution.
*   **CSV File:** `cognitive_function_tags.csv` (example provided below)

---

## Entity Vocabularies (Open-Ended)

These vocabularies are for specific named entities and will grow continuously as new texts are ingested. They are curated rather than predefined exhaustive lists. Their individual README files (`deities_readme.md`, `creatures_readme.md`, `places_readme.md`) detail their structure and curation process.

*   **`key_figures.csv`**: For deities, spirits, and significant divine beings.
*   **`creatures.csv`**: For mythological animals, monsters, and other non-human, non-divine beings.
*   **`places.csv`**: For significant mythological locations, realms, and geographical features.

## Where to use which lexicon:

## Character Level (key_figures.csv)

character_archetype_tags: Primary archetypal role (1-2 tags max per character)
social_role_tags: Social/cultural role in society/narrative (1-3 tags)
cognitive_function_tags: Only when a character specifically embodies a cognitive function (e.g., Shamash as supernatural prosocial punishment)

## Episode/Chunk Level

proppian_functions: The sequential narrative functions (multiple per chunk)
rite_tags: When specific ritual actions occur
theme_tags: Dominant themes in that section
cognitive_function_tags: When the chunk serves specific cognitive functions

## Work Level

theme_tags: Overarching themes of the entire work
cognitive_function_tags: The work's primary cognitive/social functions
social_role_tags: Overall social role patterns

## Specific Recommendations

Character Archetypes: Use these as primary character classifiers. For Gilgamesh, I'd suggest: ARCH_CULTURE_HERO_ARCHETYPE (primary) + ARCH_SOVEREIGN_RULER
Avoid Over-Tagging: Set limits - maybe 2 archetype tags, 3 social role tags, and 5 theme tags maximum per entity to maintain clarity.

Hierarchical Tagging: Consider primary vs. secondary tags. Gilgamesh is primarily a Culture Hero, secondarily a Sovereign.

Cross-Referencing: Some characters embody multiple social roles - Shamash is both FUNC_ORACLE_PROPHET_FUNCTION and FUNC_GUARDIAN_PROTECTOR.

Potential Refinements

Resolve Overlaps: "Culture Hero" appears in both archetype and social role tags - consider making one primary
Application Guidelines: Create rules for when to apply cognitive function tags (when explicitly serving that function vs. just happening to do so)