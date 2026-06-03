#!/usr/bin/env python3
"""
Master script to process all mythological texts with proper frontmatter and formatting.
"""
import re
from pathlib import Path
from typing import Dict, Tuple, List


# Define metadata for all works
WORKS_METADATA = {
    'Pyramid_Texts': {
        'doc_id': 'EGY_PYRAMID_TEXTS_MERCER',
        'title': 'The Pyramid Texts',
        'title_original': 'Pyramid Texts',
        'culture_group': 'Egyptian',
        'language_original': 'egy',  # Middle Egyptian
        'summary': 'The oldest large body of religious texts in the world, inscribed in the pyramids of Old Kingdom pharaohs. Contains spells, rituals, and incantations to ensure the pharaoh\'s successful transition to the afterlife and divine status.',
        'source_primary': {
            'title': 'Pyramid Texts',
            'author': 'Unknown (priestly scribes)',
            'approx_date': 'c. 2400-2300 BCE (Old Kingdom, 5th-6th Dynasties)'
        },
        'source_document': {
            'text_title': 'The Pyramid Texts',
            'translator_author_editor': 'Samuel A. B. Mercer',
            'publisher': 'Longmans, Green & Co.',
            'publication_date': 1952,
            'url_doi': 'https://www.sacred-texts.com/egy/pyt/index.htm',
            'notes': 'First complete English translation, based on hieroglyphic inscriptions from pyramids of Unas, Teti, Pepi I, Merenre, Pepi II, and queens\' pyramids.'
        },
        'myth_type_tags': ['MYTHTYPE_FUNERARY', 'MYTHTYPE_DIVINE_MYTH', 'MYTHTYPE_RITUAL_TEXT', 'MYTHTYPE_ESCHATOLOGICAL'],
        'theme_tags': ['THM_DEATH_AFTERLIFE', 'THM_RESURRECTION', 'THM_DIVINE_KINGSHIP', 'THM_COSMIC_ORDER'],
        'start_marker': '1. NUT AND THE DECEASED KING',
        'end_marker': 'EXCURSUS',
    },
    'Book_of_the_Dead': {
        'doc_id': 'EGY_BOOK_DEAD_BUDGE',
        'title': 'The Egyptian Book of the Dead',
        'title_original': 'Book of Coming Forth by Day (Peret em Heru)',
        'culture_group': 'Egyptian',
        'language_original': 'egy',
        'summary': 'Collection of funerary spells, prayers, and incantations designed to guide the deceased through the Duat (underworld) and ensure safe passage to the afterlife. Includes the famous Weighing of the Heart ceremony.',
        'source_primary': {
            'title': 'Book of the Dead (Papyri of Ani and others)',
            'author': 'Unknown (compiled from earlier Coffin Texts and Pyramid Texts)',
            'approx_date': 'c. 1550 BCE - 50 BCE (New Kingdom through Ptolemaic Period)'
        },
        'source_document': {
            'text_title': 'The Book of the Dead',
            'translator_author_editor': 'E. A. Wallis Budge',
            'publisher': 'British Museum',
            'publication_date': 1895,
            'url_doi': 'https://www.sacred-texts.com/egy/ebod/',
            'notes': 'Translation primarily based on the Papyrus of Ani (c. 1250 BCE), one of the most complete versions.'
        },
        'myth_type_tags': ['MYTHTYPE_FUNERARY', 'MYTHTYPE_RITUAL_TEXT', 'MYTHTYPE_ESCHATOLOGICAL'],
        'theme_tags': ['THM_DEATH_AFTERLIFE', 'THM_JUDGMENT', 'THM_RESURRECTION', 'THM_TRANSFORMATION'],
        'start_marker': 'INTRODUCTION|CHAPTER I',
        'end_marker': 'APPENDIX|VOCABULARY',
    },
    'Hesiod_Theogony': {
        'doc_id': 'GRK_THEOGONY_HESIOD_EVELYN',
        'title': 'Theogony',
        'title_original': 'Θεογονία (Theogonia)',
        'culture_group': 'Greek',
        'language_original': 'grc',
        'summary': 'Hesiod\'s account of the origin and genealogy of the Greek gods, from primordial chaos through the Titanomachy to Zeus\'s establishment as supreme deity.',
        'source_primary': {
            'title': 'Theogony',
            'author': 'Hesiod',
            'approx_date': 'c. 700 BCE'
        },
        'source_document': {
            'text_title': 'Hesiod, Theogony',
            'translator_author_editor': 'Hugh G. Evelyn-White',
            'publisher': 'Loeb Classical Library',
            'publication_date': 1914,
            'url_doi': 'https://www.perseus.tufts.edu/hopper/text?doc=Hes.+Th',
            'notes': 'Part of the Loeb Classical Library series.'
        },
        'myth_type_tags': ['MYTHTYPE_THEOGONY', 'MYTHTYPE_COSMOGONY', 'MYTHTYPE_DIVINE_MYTH'],
        'theme_tags': ['THM_CREATION', 'THM_DIVINE_SUCCESSION', 'THM_THEOGONY', 'THM_ORDER_VS_CHAOS'],
        'start_marker': 'From the Heliconian Muses|Shepherds of the wilderness',
        'end_marker': None,  # Single work
    },
}


def clean_common_artifacts(text: str) -> str:
    """Remove common artifacts from sacred-texts.com format."""
    lines = text.split('\n')
    cleaned = []
    prev_blank = False

    skip_patterns = [
        r'^\s*===\s+.*\s+===\s*$',  # Section markers
        r'Sacred Texts',
        r'^\s*Index\s*$',
        r'^\s*Previous\s*$',
        r'^\s*Next\s*$',
        r'^\s*Egypt\s*$',
        r'^\s*p\.\s+[ivxlcdm\d]+\s*$',  # Page numbers
        r'at sacred-texts\.com',
        r'Click to enlarge',
        r'^\s*\d+\s*$',  # Standalone numbers
    ]

    for line in lines:
        # Skip lines matching patterns
        if any(re.search(pat, line, re.IGNORECASE) for pat in skip_patterns):
            continue

        # Skip consecutive blanks
        if not line.strip():
            if prev_blank:
                continue
            prev_blank = True
            cleaned.append('')
            continue

        prev_blank = False
        cleaned.append(line.rstrip())

    return '\n'.join(cleaned)


def extract_main_content(text: str, start_marker: str = None, end_marker: str = None) -> str:
    """Extract main content between markers."""
    lines = text.split('\n')

    start_idx = 0
    end_idx = len(lines)

    if start_marker:
        patterns = start_marker.split('|')
        for i, line in enumerate(lines):
            if any(pattern in line for pattern in patterns):
                start_idx = i
                break

    if end_marker:
        patterns = end_marker.split('|')
        for i in range(len(lines) - 1, start_idx, -1):
            if any(pattern in lines[i] for pattern in patterns):
                end_idx = i
                break

    return '\n'.join(lines[start_idx:end_idx])


def create_frontmatter(metadata: Dict) -> str:
    """Generate YAML frontmatter from metadata dictionary."""
    fm = "---\n"
    fm += "# --- Core Information ---\n\n"
    fm += "# Document Identification & Basic Metadata\n"
    fm += f"doc_id: {metadata['doc_id']}\n"
    fm += f"title: \"{metadata['title']}\"\n"
    fm += f"title_original: \"{metadata['title_original']}\"\n"
    fm += f"culture_group: {metadata['culture_group']}\n"
    fm += f"language_original: {metadata['language_original']}\n"
    fm += f"summary: \"{metadata['summary']}\"\n\n"

    fm += "# Source & Provenance\n"
    fm += "source_primary:\n"
    for key, val in metadata['source_primary'].items():
        fm += f"  {key}: \"{val}\"\n"

    fm += "source_document:\n"
    for key, val in metadata['source_document'].items():
        if key == 'publication_date':
            fm += f"  {key}: {val}\n"
        else:
            fm += f"  {key}: \"{val}\"\n"

    fm += "\n# Core Categorization Tags\n"
    fm += "myth_type_tags:\n"
    for tag in metadata['myth_type_tags']:
        fm += f"  - {tag}\n"

    fm += "\ntheme_tags:\n"
    for tag in metadata['theme_tags']:
        fm += f"  - {tag}\n"

    fm += "\n# Archive Management\n"
    fm += "date_added: 2025-11-19\n"
    fm += "status: complete\n\n"
    fm += "---\n\n"

    return fm


def process_work(work_name: str, input_dir: Path, output_dir: Path) -> None:
    """Process a single work."""
    if work_name not in WORKS_METADATA:
        print(f"No metadata for {work_name}")
        return

    metadata = WORKS_METADATA[work_name]
    input_file = input_dir / f"{work_name}.txt"
    output_file = output_dir / f"{work_name}.md"

    if not input_file.exists():
        print(f"Input file not found: {input_file}")
        return

    print(f"Processing {work_name}...")

    # Read input
    with open(input_file, 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()

    # Clean and extract
    text = clean_common_artifacts(text)
    text = extract_main_content(text,
                               metadata.get('start_marker'),
                               metadata.get('end_marker'))

    # Create frontmatter
    frontmatter = create_frontmatter(metadata)

    # Write output
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(frontmatter)
        f.write(text)

    print(f"✓ Created {output_file}")


def main():
    input_dir = Path('/home/user/world-myth-archive/raw_downloads/consolidated_texts')
    output_dir = Path('/home/user/world-myth-archive/Corpus Forge/works')

    # Process works that have metadata defined
    for work_name in ['Pyramid_Texts', 'Book_of_the_Dead']:
        process_work(work_name, input_dir, output_dir)


if __name__ == '__main__':
    main()
