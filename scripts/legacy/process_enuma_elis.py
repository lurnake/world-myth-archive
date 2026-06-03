#!/usr/bin/env python3
"""
Process Enuma Elis text into clean markdown with frontmatter.
"""
import re

def clean_enuma_elis(input_file, output_file):
    """Extract and clean the Enuma Elis text."""

    with open(input_file, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()

    # Find start (line with "The First Tablet") and end (line with "Footnotes" or "II.")
    start_idx = None
    end_idx = None

    for i, line in enumerate(lines):
        if 'The First Tablet' in line and start_idx is None:
            start_idx = i
        if ('Footnotes' in line or line.strip() == 'II.') and start_idx is not None and end_idx is None:
            end_idx = i
            break

    if start_idx is None or end_idx is None:
        print(f"Could not find text boundaries. Start: {start_idx}, End: {end_idx}")
        return

    # Extract the relevant section
    content_lines = lines[start_idx:end_idx]

    # Process lines
    cleaned = []
    skip_next = False

    for i, line in enumerate(content_lines):
        # Skip empty lines at the beginning
        if not cleaned and not line.strip():
            continue

        # Skip lines that are just page markers
        if re.match(r'^\s*\[p\.\s*\d+\]\s*(\[p\.\s*\d+\]\s*)*$', line):
            continue

        # Skip the repeated header
        if 'Seven Tablets of Creation, by Leonard William King' in line:
            continue
        if 'at sacred-texts.com' in line:
            continue

        # Clean page markers within lines
        line = re.sub(r'\[p\.\s*\d+\]', '', line)

        # Clean up tablet headers - make them h2 markdown headers
        if re.match(r'^The (First|Second|Third|Fourth|Fifth|Sixth|Seventh) Tablet\s*$', line.strip()):
            tablet_name = line.strip()
            cleaned.append(f'\n## {tablet_name}\n')
            continue

        # Clean up Epilogue header
        if line.strip() == 'Epilogue':
            cleaned.append('\n## Epilogue\n')
            continue

        # Clean up line numbers and format verses
        # Pattern: "123. Text here" with possible footnote markers [*1]
        match = re.match(r'^(\d+)\.\s+(.+)$', line.strip())
        if match:
            line_num = match.group(1)
            text = match.group(2)
            # Remove footnote markers for now
            text = re.sub(r'\[\*\d+\]', '', text)
            cleaned.append(f'{text}\n')
            continue

        # Handle lines that indicate missing content
        if re.match(r'^\[Lines .+ are wanting\.\]', line.strip()):
            cleaned.append(f'\n*{line.strip()}*\n')
            continue

        # Skip lines that are mostly empty or just whitespace
        if not line.strip():
            # Only add if the previous line wasn't empty
            if cleaned and cleaned[-1].strip():
                cleaned.append('\n')
            continue

        # Keep other lines as-is
        if line.strip():
            cleaned.append(line.strip() + '\n')

    # Remove excessive blank lines
    final_text = ''.join(cleaned)
    final_text = re.sub(r'\n{3,}', '\n\n', final_text)

    # Create frontmatter
    frontmatter = """---
# --- Core Information ---

# Document Identification & Basic Metadata
doc_id: AKK_ENUMA_ELIS_KING
title: "Enūma Eliš (The Seven Tablets of Creation)"
title_original: "Enūma Eliš" # Akkadian: "When on high"
culture_group: Mesopotamian # Babylonian/Akkadian tradition
language_original: akk # ISO 639-3 code for Akkadian
summary: "The Babylonian creation epic narrating the birth of the gods from primeval chaos, the rebellion of Tiamat and her monstrous army, the rise of Marduk as champion of the gods, his defeat of Tiamat, and his creation of the world from her body, culminating in the creation of humanity and the establishment of Marduk's supremacy."

# Source & Provenance
source_primary:
  title: "Enūma Eliš (Seven Tablets of Creation)"
  author: "Unknown (composed during Old Babylonian period)"
  approx_date: "c. 1200 BCE (earliest manuscripts); composition possibly earlier"
source_document:
  text_title: "The Seven Tablets of Creation"
  translator_author_editor: "Leonard William King"
  publisher: "Luzac and Co."
  publication_date: 1902
  url_doi: "https://www.sacred-texts.com/ane/enuma.htm"
  notes: "Translation based on cuneiform tablets from the British Museum, primarily from the library of Ashurbanipal at Nineveh (7th century BCE)."

# Core Categorization Tags
myth_type_tags:
  - MYTHTYPE_COSMOGONY
  - MYTHTYPE_THEOGONY
  - MYTHTYPE_DIVINE_MYTH
  - MYTHTYPE_ETIOLOGICAL

theme_tags:
  - THM_CREATION
  - THM_ORDER_VS_CHAOS
  - THM_DIVINE_COMBAT
  - THM_THEOMACHY
  - THM_COSMOGONY
  - THM_SOVEREIGNTY

# --- Enhanced Information ---

# Deeper Analytical Tags
character_archetype_tags:
  - ARCH_SKY_FATHER # Anu
  - ARCH_EARTH_MOTHER # Tiamat (as primordial mother)
  - ARCH_CULTURE_HERO # Marduk
  - ARCH_PRIMORDIAL_ANTAGONIST # Tiamat, Apsu
  - ARCH_WISE_OLD_MENTOR # Ea
  - ARCH_SOVEREIGN_RULER # Marduk

social_role_tags:
  - FUNC_SOVEREIGNTY # Marduk's kingship
  - FUNC_COSMOGONIC_CREATOR # Marduk
  - FUNC_WARRIOR_HERO # Marduk

cognitive_function_tags:
  - COG_AGENCY_DETECTION # Divine agency in creation
  - COG_INTUITIVE_ONTOLOGY_MANIPULATION # Creation of world, monsters
  - COG_THREAT_ANXIETY_MANAGEMENT # Cosmic battle, order from chaos
  - COG_STATUS_HIERARCHY_LEGITIMATION # Marduk's supremacy

rite_tags:
  - RITE_KINGSHIP # Legitimation of Marduk's kingship
  - RITE_NEW_YEAR # Text recited during Akitu festival

myth_episode_tags:
  - EP_PRIMORDIAL_CHAOS
  - EP_THEOGONY
  - EP_DIVINE_COUNCIL
  - EP_THEOMACHY
  - EP_DIVINE_COMBAT
  - EP_COSMOGONY
  - EP_ANTHROPOGONY

# Linked Entities
key_figures:
  - id: DEITY_APSU_MES
    role_in_work: "Primordial freshwater god, first to rebel against younger gods"
  - id: DEITY_TIAMAT_MES
    role_in_work: "Primordial saltwater goddess, chaos dragon, mother of monsters"
  - id: DEITY_MUMMU_MES
    role_in_work: "Minister and counselor to Apsu"
  - id: DEITY_LAHMU_LAHAMU_MES
    role_in_work: "First divine couple created from chaos"
  - id: DEITY_ANSHAR_MES
    role_in_work: "Grandfather of Marduk, convenes divine council"
  - id: DEITY_KISHAR_MES
    role_in_work: "Consort of Anshar"
  - id: DEITY_ANU_MES
    role_in_work: "Sky god, father of Ea"
  - id: DEITY_EA_MES
    role_in_work: "God of wisdom and water, defeats Apsu, father of Marduk"
  - id: DEITY_MARDUK_MES
    role_in_work: "Hero god, defeats Tiamat, creates world and humanity, supreme deity"
  - id: DEITY_KINGU_MES
    role_in_work: "Consort of Tiamat, leader of her army, holder of Tablets of Destiny"

key_creatures:
  - id: CRT_TIAMAT_MES
    role_in_work: "Chaos dragon, primordial sea"
  - id: CRT_ELEVEN_MONSTERS_MES
    role_in_work: "Monster-serpents, dragons, scorpion-men, etc., created by Tiamat"

# Archive Management
date_added: 2025-11-19
status: complete

---

"""

    # Write output
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(frontmatter)
        f.write(final_text)

    print(f"Successfully processed Enuma Elis to {output_file}")
    print(f"Extracted lines {start_idx} to {end_idx}")

if __name__ == '__main__':
    input_file = '/home/user/world-myth-archive/raw_downloads/consolidated_texts/Enuma_Elis.txt'
    output_file = '/home/user/world-myth-archive/Corpus Forge/works/Enuma_Elis.md'
    clean_enuma_elis(input_file, output_file)
