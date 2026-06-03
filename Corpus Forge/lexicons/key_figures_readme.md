# `key_figures.csv` - Lexicon of Mythological Figures

## Purpose
This lexicon provides a curated list of deities, heroes, spirits, significant mortals, and other key figures encountered in world mythologies who demonstrate personhood, agency, and character development. Its primary purpose is to:

Identify and Disambiguate: Provide a unique identifier, canonical name, and type for each figure.
Facilitate Cross-Referencing: Allow users to find all mentions or aspects related to a specific figure across texts.
Support Analysis: Enable study of figure roles, types, domains, and relationships across cultures and works.

Distinction from Creatures.csv
The key distinction between entries in key_figures.csv and creatures.csv is:

Key Figures: Beings with personhood, agency, character development, and who function as actors in mythological narratives. They typically have human-like consciousness, make decisions, and have personal motivations that drive narrative events.
Creatures: Primarily defined by their non-human physical characteristics or supernatural abilities rather than by their personhood or narrative agency.

Decision Criteria for Borderline Cases
For borderline cases (such as monster protagonists or sentient mythical animals), consider:

Personhood and Agency: Does the entity demonstrate clear personhood with human-like consciousness, decision-making, and speech?
Narrative Role: Is the entity a primary actor who drives the narrative forward through choices, rather than simply being encountered?
Character Development: Does the entity undergo character development or transformation beyond simple physical changes?
Relationship to Humanity: Does the entity engage in complex social relationships with human or divine figures?

## Examples of borderline cases:

A monster like Grendel in Beowulf, despite being antagonistic, would be included in key_figures.csv because he possesses agency, motivation, and a complex relationship to the narrative.
Similarly, a sentient dragon who functions as a protagonist with clear motivations and character development would be included in key_figures.csv.
Conversely, the serpent that steals Gilgamesh's plant belongs in creatures.csv because, despite affecting the narrative, it lacks demonstrated personhood and complex motivations.

## Structure

The `key_figures.csv` file will ideally contain the following columns:

*   `figure_id`: A unique, stable identifier for the figure (e.g., `FIG_ZEUS_GRK`, `FIG_GILGAMESH_MES`, `FIG_HUMBABA_MES`). Format: `FIG_[NAME]_[CULTURECODE]`.
*   `preferred_name`: The most common or academically preferred name (e.g., "Zeus", "Gilgamesh", "Humbaba").
*   `figure_type`: A controlled vocabulary term describing the general nature of the figure. This helps in categorization and filtering. (e.g., "Deity", "Hero", "Demigod", "Spirit", "Human (Significant)", "Deified Human").
*   `culture_group`: The primary mythological or cultural tradition associated with the figure (e.g., "Greek", "Norse", "Egyptian", "Mesopotamian"). This might link to a separate `cultures.csv`.
*   `domains`: Keywords or short phrases describing the figure's primary areas of influence, powers, or associations (e.g., "Sky, Thunder, Kingship"; "Kingship, Wisdom, Immortality Quest"; "Guardian of Cedar Forest"). This could be a semi-colon separated list.
*   `alternate_names`: Other common names, epithets, or regional variations (e.g., for Zeus: "Jove"; for Gilgamesh: "Bilgames"). Semi-colon separated.
*   `description_brief`: A very short (one-two sentences) description of the figure's core identity or role.
*   `notes`: Any additional contextual information, important relationships (e.g., "Two-thirds divine, one-third mortal, King of Uruk"), or disambiguation notes.

## `figure_type` Usage and Examples:

The `figure_type` column helps classify figures for better understanding and app functionality (like filtering or specific icon display). Here's a starting list of types (this can be expanded):

*   **Deity:** Primary gods and goddesses with significant power and often worship (e.g., Anu, Ishtar, Zeus, Odin).
*   **Demigod:** Offspring of a deity and a mortal, possessing extraordinary abilities (e.g., Heracles; Gilgamesh is often described this way).
*   **Hero:** Figures known for courage, outstanding achievements, or noble qualities, often central to sagas (e.g., Odysseus, Beowulf; Gilgamesh also fits here).
*   **Spirit:** Non-corporeal or ethereal beings, can be nature spirits, ghosts, minor deities, etc. (e.g., Nymphs, Enkidu's spirit in Tablet XII).
*   **Human (Significant):** Mortals who play a crucial role in the narrative, even if not divine or heroic in the traditional sense (e.g., Uta-Napishtim *before* deification, Shamhat).
*   **Deified Human:** Mortals who attain divinity or immortality (e.g., Uta-Napishtim, Heracles after death).
*   **Primordial Being:** Entities existing at the dawn of creation, often personifications of fundamental forces or chaos (e.g., Tiamat, Chaos).

These values will be added using existing lexicons and only used where appropriate:
Character Level (key_figures.csv)

character_archetype_tags: Primary archetypal role (1-2 tags max per character)
social_role_tags: Social/cultural role in society/narrative (1-3 tags)
cognitive_function_tags: Only when a character specifically embodies a cognitive function (e.g., Shamash as supernatural prosocial punishment)

This categorization allows users to, for example, filter myths that prominently feature "Monsters" or compare the "Domains" of different "Deities."

## Example Entry

figure_id,preferred_name,figure_type,culture_group,domains,alternate_names,description_brief,notes
FIG_ANU_MES,Anu,Deity,Mesopotamian,"Sky, Kingship, Divine Authority",An,"Supreme sky god in the Mesopotamian pantheon, father of Ishtar. Resides in the highest heaven.",Member of the primary triad with Enlil and Ea.
FIG_GILGAMESH_MES,Gilgamesh,Hero;Demigod,Mesopotamian,"Kingship, Strength, Quest for Immortality, Walls of Uruk",Bilgames,"Legendary king of Uruk, two-thirds god and one-third man, who undertakes epic adventures.",Protagonist of the Epic of Gilgamesh. Son of Lugalbanda and Ninsun.

Note: For non-human entities that function as protagonists or major characters with demonstrated personhood and agency (e.g., certain monsters or mythical beings), they may be classified under appropriate figure types like "Hero" or "Antagonist" rather than automatically being relegated to the creatures.csv file.

## Curation Process

This list is **not predefined or exhaustive**. It will be built iteratively:

1.  **Ingestion-Driven:** New deities will be added as they are identified in the texts being processed for the codex.
2.  **Scholarly Referencing:** Identification and naming will be based on reputable mythological dictionaries, encyclopedias, and academic sources (e.g., Oxford Classical Dictionary, standard works on specific mythologies).
3.  **Disambiguation:** Care will be taken to distinguish between different deities with similar names or to note syncretic relationships.
4.  **Community Contribution/Review (Optional):** Depending on the project's nature, a review process for new entries might be implemented.

This approach ensures the lexicon remains relevant to the actual content of the codex and grows organically.