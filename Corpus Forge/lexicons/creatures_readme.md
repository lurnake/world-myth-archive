# `creatures.csv` - Lexicon of Mythological Creatures

## Purpose

This lexicon catalogs mythological creatures, encompassing animals with special significance, monsters, chimerical beings, and other non-human entities from world mythologies whose primary definition is their physical nature rather than their narrative agency. Its purpose is to:

1.  **Identify and Categorize:** Provide a unique identifier and name for each creature.
2.  **Facilitate Search:** Allow users to find all mentions or descriptions of specific mythological beings.
3.  **Support Comparative Study:** Enable analysis of creature types, roles, and symbolism across cultures.

## Distinction from Key_figures.csv
Entries in creatures.csv are primarily defined by:

Their non-human physical characteristics
Their supernatural abilities or attributes
Their function as encountered beings rather than narrative agents
Their lack of demonstrated complex personhood or character development

While some creatures may have significance in mythological narratives, they generally:

Do not demonstrate human-like decision-making processes
Are not the focus of psychological or character development
Function as entities to be encountered, overcome, or utilized rather than as narrative drivers

Note: Some entities may appear in stories as both beings with agency and as creature archetypes. In such cases, the specific instance with demonstrated personhood may be included in key_figures.csv, while the generic creature type remains in creatures.csv.

## Structure

The `creatures.csv` file will ideally contain the following columns:

*   `creature_id`: A unique, stable identifier (e.g., `CRT_GRIFFIN_MES`, `CRT_DRAGON_EUR`, `CRT_KAPPA_JPN`).
*   `preferred_name`: The most common or academically preferred name (e.g., "Griffin", "Dragon", "Kappa").
*   `culture_group`: The primary mythological or cultural tradition(s) where the creature features prominently.
*   `creature_type`: A broad classification (e.g., "Monster", "Mythical Animal", "Hybrid", "Spirit Animal", "Fairy Folk").
*   `description_brief`: A short (one sentence) description of the creature's appearance or key characteristics.
*   `symbolism_roles`: Keywords or short phrases describing common symbolic meanings or narrative roles (e.g., "Guardian, Wisdom, Greed"; "Chaos, Destruction"; "Water Spirit, Trickster").
*   `alternate_names`: Other common names or variations.
*   `notes`: Additional contextual information, specific attributes, or important stories associated.

## Example:
creature_id: CRT_GRIFFIN_MESO
preferred_name: Griffin
culture_group: Mesopotamian; Persian; Scythian (later Greek)
creature_type: Hybrid; Mythical Beast
description_brief: A creature with the body, tail, and back legs of a lion; the head and wings of an eagle; and an eagle's talons as its front feet.
symbolism_roles: Guardian of treasure; Divine retribution; Wisdom; Strength; Sun
alternate_names: Gryphon, Griffon
notes: Often depicted in Near Eastern art guarding treasures or the Tree of Life. Associated with deities like Shamash. Its imagery spread widely.

## Curation Process

This list is **not predefined or exhaustive** and will be built iteratively:

1.  **Ingestion-Driven:** New creatures added as identified in texts.
2.  **Scholarly Referencing:** Based on bestiaries, mythological encyclopedias, and folklore studies.
3.  **Clarity of Scope:** Distinguish between truly mythological creatures and ordinary animals mentioned in myths, unless those animals have specific symbolic weight (e.g., "Raven" as a culture hero's companion vs. just a bird).

This ensures the lexicon is focused on beings with distinct mythological significance.