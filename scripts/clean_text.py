#!/usr/bin/env python3
"""
Text cleaning utility for mythological texts.
Removes common artifacts from scanned/digitized texts.
"""
import re
import sys
from pathlib import Path


def clean_text(text):
    """
    Clean text by removing common digitization artifacts.

    Args:
        text: Raw text string

    Returns:
        Cleaned text string
    """
    lines = text.split('\n')
    cleaned_lines = []

    # Patterns to skip (headers, footers, page numbers)
    skip_patterns = [
        r'^\s*\[p\.\s*[IVXLCDM\d]+\]\s*$',  # Page numbers like [p. XI] or [p. 42]
        r'^\s*\d+\s*$',  # Standalone page numbers
        r'^\s*[-–—]\s*\d+\s*[-–—]\s*$',  # Page numbers like - 3 -
        r'at sacred-texts\.com',  # Sacred-texts footer
        r'^\s*\(\s*"Agamemnon"',  # Perseus error messages
        r'^\s*No document found\s*$',
        r'^\s*All Search Options',
        r'^\s*Home\s*$',
        r'^\s*Collections/Texts\s*$',
        r'^\s*Perseus Catalog\s*$',
        r'^\s*Research\s*$',
        r'^\s*Grants\s*$',
        r'^\s*Open Source\s*$',
        r'^\s*About\s*$',
        r'^\s*Help\s*$',
        r"^\s*We're sorry, but we were unable",
        r'^\s*=== [^=]+ ===\s*$',  # Section markers like === chunk_1.xml ===
        r'^\s*\[paragraph continues\]',  # Continuation markers
    ]

    prev_blank = False
    for line in lines:
        # Skip lines matching patterns
        if any(re.search(pattern, line) for pattern in skip_patterns):
            continue

        # Skip lines that are just whitespace
        if not line.strip():
            if prev_blank:  # Skip consecutive blank lines
                continue
            prev_blank = True
            cleaned_lines.append('')
            continue

        prev_blank = False

        # Remove page number references within text like [p. 123]
        line = re.sub(r'\[p\.\s*[IVXLCDM\d]+\]', '', line)

        # Clean up common OCR/scan artifacts
        line = re.sub(r'\s+', ' ', line)  # Normalize whitespace
        line = line.strip()

        cleaned_lines.append(line)

    # Join lines and clean up excessive blank lines
    result = '\n'.join(cleaned_lines)
    result = re.sub(r'\n{3,}', '\n\n', result)  # Max 2 consecutive newlines

    return result.strip()


def extract_main_content(text):
    """
    Try to extract main content, skipping front matter and appendices.

    Args:
        text: Cleaned text string

    Returns:
        Main content text
    """
    lines = text.split('\n')

    # Common markers for where main content starts
    start_markers = [
        'Tablet I',
        'TABLET I',
        'Book I',
        'BOOK I',
        'Chapter I',
        'CHAPTER I',
        'Canto I',
        'CANTO I',
        '## Tablet I',
        '## TABLET I',
    ]

    # Common markers for where appendices/notes begin
    end_markers = [
        'Appendix',
        'APPENDIX',
        'Notes',
        'NOTES',
        'Footnotes',
        'FOOTNOTES',
        'Bibliography',
        'BIBLIOGRAPHY',
        'Index',
        'INDEX',
    ]

    start_idx = 0
    end_idx = len(lines)

    # Find start of main content
    for i, line in enumerate(lines):
        if any(marker in line for marker in start_markers):
            # Look back a few lines for a header
            start_idx = max(0, i - 5)
            break

    # Find end of main content
    for i in range(len(lines) - 1, start_idx, -1):
        line = lines[i]
        if any(marker in line for marker in end_markers):
            end_idx = i
            break

    return '\n'.join(lines[start_idx:end_idx])


def main():
    if len(sys.argv) < 2:
        print("Usage: python clean_text.py <input_file> [output_file]")
        sys.exit(1)

    input_file = Path(sys.argv[1])
    if not input_file.exists():
        print(f"Error: File {input_file} not found")
        sys.exit(1)

    # Read input
    with open(input_file, 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()

    # Clean text
    cleaned = clean_text(text)

    # Extract main content
    main_content = extract_main_content(cleaned)

    # Output
    if len(sys.argv) >= 3:
        output_file = Path(sys.argv[2])
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(main_content)
        print(f"Cleaned text written to {output_file}")
    else:
        print(main_content)


if __name__ == '__main__':
    main()
