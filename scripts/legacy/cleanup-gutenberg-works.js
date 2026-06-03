#!/usr/bin/env node

/**
 * Clean up stray boilerplate in promoted Gutenberg works.
 * Strips contents pages, prefaces, and final endnotes
 * while preserving the actual mythological text.
 */

const fs = require('fs');
const path = require('path');

const WORKS_DIR = path.join(__dirname, '..', 'Corpus Forge', 'works');

function normalizeText(text) {
  return text
    .replace(/^\uFEFF/, '')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function wordCount(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function extractHeadingsWithContext(body) {
  const lines = body.split('\n');
  const headings = [];
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$/);
    if (match) {
      let words = 0;
      for (let j = i + 1; j < lines.length; j++) {
        if (/^\s{0,3}#{1,6}\s/.test(lines[j])) break;
        words += lines[j].split(/\s+/).filter(Boolean).length;
      }
      headings.push({ line: i, text: match[1].trim(), wordsAfter: words });
    }
  }
  return headings;
}

function findFirstRealContent(body, startPatterns, minWordsAfter = 100) {
  const headings = extractHeadingsWithContext(body);
  for (const h of headings) {
    for (const pattern of startPatterns) {
      if (pattern.test(h.text) && h.wordsAfter > minWordsAfter) {
        return h.line;
      }
    }
  }
  return 0;
}

function findFinalEndnotes(body) {
  const lines = body.split('\n');
  const totalLines = lines.length;
  const cutoff = Math.floor(totalLines * 0.85); // Only consider last 15% of file

  // Find the first ENDNOTES/FOOTNOTES marker in the last 15%
  for (let i = cutoff; i < totalLines; i++) {
    if (/^\s{0,3}#{1,6}\s+(ENDNOTES|FOOTNOTES|ADDENDA|GLOSSARY|INDEX|APPENDIX)/i.test(lines[i])) {
      return i;
    }
    if (/^(ENDNOTES|FOOTNOTES):/i.test(lines[i].trim())) {
      return i;
    }
  }
  return -1;
}

function stripAfter(body, lineIndex) {
  if (lineIndex < 0) return body;
  const lines = body.split('\n');
  return lines.slice(0, lineIndex).join('\n').trim();
}

function stripBefore(body, lineIndex) {
  const lines = body.split('\n');
  return lines.slice(lineIndex).join('\n').trim();
}

function cleanWork(fileName, options = {}) {
  const filePath = path.join(WORKS_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${fileName} (not found)`);
    return;
  }

  const fullText = fs.readFileSync(filePath, 'utf8');
  const frontmatterMatch = fullText.match(/^---\r?\n[\s\S]*?\r?\n---/);
  if (!frontmatterMatch) {
    console.log(`Skipping ${fileName} (no frontmatter)`);
    return;
  }

  const frontmatter = frontmatterMatch[0];
  let body = fullText.slice(frontmatter.length).trim();
  let changes = [];

  // Strip before first real content
  if (options.startPatterns) {
    const startLine = findFirstRealContent(body, options.startPatterns, options.minWordsAfter || 100);
    if (startLine > 0) {
      body = stripBefore(body, startLine);
      changes.push(`stripped ${startLine} lines before first real content`);
    }
  }

  // Strip final endnotes/footnotes/addenda (only in last 15% of file)
  if (options.stripEndnotes !== false) {
    const endLine = findFinalEndnotes(body);
    if (endLine >= 0) {
      body = stripAfter(body, endLine);
      changes.push(`stripped final endnotes at line ${endLine}`);
    }
  }

  const newText = `${frontmatter}\n\n${normalizeText(body)}\n`;
  const oldWords = wordCount(fullText.slice(frontmatter.length));
  const newWords = wordCount(body);

  if (newText !== fullText) {
    fs.writeFileSync(filePath, newText, 'utf8');
    console.log(`✅ Cleaned ${fileName}: ${oldWords} → ${newWords} words (${changes.join(', ')})`);
  } else {
    console.log(`⏭️ No changes needed for ${fileName}`);
  }
}

const WORKS = [
  {
    file: 'Iliad.md',
    startPatterns: [/^BOOK I\.?$/i],
  },
  {
    file: 'Odyssey.md',
    startPatterns: [/^BOOK I\.?$/i],
  },
  {
    file: 'Aeneid.md',
    startPatterns: [/^BOOK I\b/i],
  },
  {
    file: 'Argonautica.md',
    startPatterns: [/^BOOK I\b/i],
  },
  {
    file: 'Nibelungenlied.md',
    startPatterns: [/^ADVENTURE I\b/i],
  },
  {
    file: 'Volsunga_Saga.md',
    startPatterns: [/^CHAPTER I\b/i, /^THE STORY OF THE VOLSUNGS\b/i],
  },
];

function main() {
  for (const work of WORKS) {
    cleanWork(work.file, work);
  }
  console.log('\nDone.');
}

main();
