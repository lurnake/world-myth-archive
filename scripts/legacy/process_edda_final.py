#!/usr/bin/env python3
"""
Final clean processor for Poetic Edda - captures all verse lines.
"""

import re

def clean_line(text):
    """Remove line numbers and page markers."""
    text = re.sub(r'^\s*\d+→', '', text)
    text = re.sub(r'\[p\.\s*\d+\]', '', text)
    return text.rstrip()

def is_poem_title(line):
    """Check if line is an actual poem title."""
    s = line.strip()
    if not s.isupper():
        return False
    if len(s) < 5 or len(s) > 60:
        return False
    # Exclude section headers
    excludes = ['INTRODUCTORY NOTE', 'INTRODUCTORY NOTES', 'INTRODUCTORY PROSE',
                'VOLUME I', 'VOLUME II', 'LAYS OF THE GODS', 'LAYS OF THE HEROES',
                'INTRODUCTION', 'GENERAL INTRODUCTION', 'CONTENTS', 'ACKNOWLEDGEMENT']
    return s not in excludes

def is_stanza_start(line):
    """Check if line starts a numbered stanza."""
    return re.match(r'^\d+\.\s+.+\|', line.strip()) is not None

def is_likely_verse(line):
    """Check if line is likely verse (not prose commentary)."""
    s = line.strip()
    if not s:
        return False

    # Skip brackets (footnotes)
    if s.startswith('['):
        return False

    # Skip very long lines (prose)
    if len(s) > 150:
        return False

    # Skip lines with scholarly markers
    scholarly = ['cf.', 'stanza', 'Snorri', 'editor', 'manuscript',
                 'Regius', 'Hauksbok', 'interpolat', 'Bugge',
                 'probably', 'possibly', 'apparently', 'Prose Edda',
                 'quoted', 'paraphrase', 'Some editors', 'Many editors']
    for marker in scholarly:
        if marker in s:
            return False

    return True

def extract_poems(input_file):
    """Extract poems from Poetic Edda."""
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = [clean_line(line) for line in f]

    poems = []
    i = 0

    # Find start (VOLUSPO)
    while i < len(lines):
        if lines[i].strip() == 'VOLUSPO':
            break
        i += 1

    while i < len(lines):
        line = lines[i].strip()

        # Check for poem title
        if is_poem_title(line):
            poem = {'title': line, 'subtitle': '', 'verses': []}

            i += 1
            # Skip empty lines
            while i < len(lines) and not lines[i].strip():
                i += 1

            # Get subtitle if present
            if i < len(lines):
                subtitle = lines[i].strip()
                if (not subtitle.isupper() and
                    len(subtitle) < 100 and
                    any(w in subtitle.lower() for w in ['lay', 'song', 'prophecy', 'sayings',
                                                         'poem', 'ballad', 'words', 'tale',
                                                         'spell', 'of', 'the'])):
                    poem['subtitle'] = subtitle
                    i += 1

            # Skip to first numbered verse (skip INTRODUCTORY NOTE section)
            while i < len(lines):
                if is_stanza_start(lines[i]):
                    break
                if is_poem_title(lines[i].strip()):
                    break
                i += 1

            # Collect all verses for this poem
            current_stanza = []

            while i < len(lines):
                l = lines[i].strip()

                # Check for next poem
                if is_poem_title(l):
                    break

                # Skip footnotes
                if l.startswith('['):
                    i += 1
                    continue

                # Check for stanza start
                if is_stanza_start(l):
                    # Save previous stanza
                    if current_stanza:
                        poem['verses'].append('\n'.join(current_stanza))
                        current_stanza = []

                    # Start new stanza
                    current_stanza = [l]
                    i += 1

                    # Collect continuation lines
                    while i < len(lines):
                        next_line = lines[i].strip()

                        # Empty line ends stanza
                        if not next_line:
                            break

                        # New stanza or poem
                        if is_stanza_start(next_line) or is_poem_title(next_line):
                            break

                        # Footnote
                        if next_line.startswith('['):
                            i += 1
                            continue

                        # Check if it's verse
                        if is_likely_verse(next_line):
                            current_stanza.append(next_line)
                            i += 1
                        else:
                            # Hit prose commentary, end stanza
                            break

                    continue

                # Empty line
                if not l:
                    if current_stanza:
                        poem['verses'].append('\n'.join(current_stanza))
                        current_stanza = []

                i += 1

            # Save last stanza
            if current_stanza:
                poem['verses'].append('\n'.join(current_stanza))

            # Add poem if it has verses
            if poem['verses']:
                poems.append(poem)

        else:
            i += 1

    return poems

def write_markdown(poems, output_file):
    """Write poems to markdown with frontmatter."""
    lines = [
        '---',
        '# --- Core Information ---',
        '',
        '# Document Identification & Basic Metadata',
        'doc_id: NORSE_POETIC_EDDA_BELLOWS',
        'title: "The Poetic Edda"',
        'title_original: "Edda"',
        'culture_group: Norse',
        'language_original: non # ISO 639-3 code for Old Norse',
        'summary: "Collection of Old Norse poems from the Icelandic medieval manuscript Codex Regius, containing mythological and heroic lays. Includes poems about the gods (Voluspo, Hovamol, etc.) and heroes (Volundarkvitha, Helgi lays, Sigurd cycle). These poems preserve ancient Germanic mythology and legend, dating from approximately 850-1050 CE, though based on older oral traditions."',
        '',
        '# Source & Provenance',
        'source_primary:',
        '  title: "Poetic Edda (Codex Regius and other manuscripts)"',
        '  author: "Unknown (multiple poets, oral tradition)"',
        '  approx_date: "c. 850-1050 CE (composition); manuscripts from c. 1270-1300 CE"',
        'source_document:',
        '  text_title: "The Poetic Edda"',
        '  translator_author_editor: "Henry Adams Bellows"',
        '  publisher: "Princeton University Press / American Scandinavian Foundation"',
        '  publication_date: 1936',
        '  url: "https://www.sacred-texts.com/neu/poe/index.htm"',
        '  doi: null',
        '  notes: "Translation from Old Norse with extensive scholarly notes. Based primarily on Codex Regius (c. 1270) with additional poems from other manuscripts. Digitized by sacred-texts.com. Public domain."',
        '',
        '# Core Categorization Tags',
        'myth_type_tags:',
        '  - MYTHTYPE_DIVINE_MYTH',
        '  - MYTHTYPE_HERO_SAGA_LEGEND',
        '  - MYTHTYPE_COSMOGONIC',
        '  - MYTHTYPE_ESCHATOLOGICAL',
        '  - MYTHTYPE_ETIOLOGICAL',
        'theme_tags:',
        '  - THM_CREATION_ORIGIN',
        '  - THM_DEATH_MORTALITY',
        '  - THM_HERO_JOURNEY',
        '  - THM_DIVINE_INTERVENTION_CONFLICT',
        '  - THM_PROPHECY_OMENS_DREAMS',
        '  - THM_FATE_DESTINY',
        '  - THM_WISDOM_KNOWLEDGE',
        '  - THM_UNDERWORLD_JOURNEY',
        '  - THM_METAMORPHOSIS_TRANSFORMATION',
        '  - THM_REVENGE_JUSTICE',
        '  - THM_LOVE_DESIRE',
        '  - THM_TRICKSTER',
        '  - THM_COSMIC_ORDER_DESTRUCTION',
        '',
        '# Enhanced Information',
        'character_archetype_tags:',
        '  - ARCH_SUPREME_DEITY # Odin',
        '  - ARCH_TRICKSTER # Loki',
        '  - ARCH_HERO # Sigurd, Helgi',
        '  - ARCH_WARRIOR_MAIDEN # Brynhild, Valkyries',
        '  - ARCH_WISE_WOMAN # Volva, Sigrdrifa',
        '  - ARCH_TRAGIC_HERO',
        '  - ARCH_MONSTER_SLAYER',
        '',
        'literary_form_tags:',
        '  - FORM_VERSE_POETRY',
        '  - FORM_EPIC_LONG_NARRATIVE',
        '  - FORM_DIALOGUE_EXCHANGE',
        '  - FORM_PROPHETIC_VISION',
        '  - FORM_WISDOM_LITERATURE',
        '',
        'geographical_tags:',
        '  - GEO_ICELAND',
        '  - GEO_NORWAY',
        '  - GEO_SCANDINAVIA',
        '',
        'temporal_context:',
        '  - PERIOD_VIKING_AGE',
        '  - PERIOD_MEDIEVAL',
        '',
        '# Metadata',
        'version: "1.0"',
        'last_updated: "2025-11-19"',
        'processing_notes: "Extracted verse text only, removing all scholarly apparatus, footnotes, introductory notes, and navigation elements. Preserved original stanza numbering and verse structure."',
        '---',
        '',
        '# The Poetic Edda',
        '',
        '*Translated from the Icelandic by Henry Adams Bellows (1936)*',
        ''
    ]

    # Add poems
    for poem in poems:
        lines.append(f"## {poem['title']}")
        if poem['subtitle']:
            lines.append(f"*{poem['subtitle']}*")
        lines.append('')

        for verse in poem['verses']:
            lines.append(verse)
            lines.append('')

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))

    print(f"\n{'='*70}")
    print(f"POETIC EDDA PROCESSING COMPLETE")
    print(f"{'='*70}\n")
    print(f"Successfully processed {len(poems)} poems:\n")
    for i, poem in enumerate(poems, 1):
        subtitle = f" - {poem['subtitle'][:40]}" if poem['subtitle'] else ""
        print(f"{i:2d}. {poem['title']:35s} ({len(poem['verses']):3d} stanzas){subtitle}")
    print(f"\n{'='*70}")
    print(f"Output: {output_file}")
    print(f"{'='*70}\n")

if __name__ == '__main__':
    input_file = '/home/user/world-myth-archive/raw_downloads/consolidated_texts/Poetic_Edda.txt'
    output_file = '/home/user/world-myth-archive/Corpus Forge/works/Poetic_Edda.md'

    poems = extract_poems(input_file)
    write_markdown(poems, output_file)
