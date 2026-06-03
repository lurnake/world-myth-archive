#!/usr/bin/env node

/**
 * Extract works metadata from Corpus Forge markdown files
 * Generates a TypeScript data file for the UI
 */

const fs = require('fs');
const path = require('path');

const WORKS_DIR = path.join(__dirname, '../Corpus Forge/works');
const OUTPUT_FILE = path.join(__dirname, '../world-mythological-codex-ui/src/data/works-data.ts');

function parseSimpleYaml(yamlText) {
  const result = {};
  const lines = yamlText.split('\n');
  let currentKey = null;
  let currentArray = null;
  let currentObject = null;
  let objectKey = null;

  for (let line of lines) {
    // Skip comments and empty lines
    if (line.trim().startsWith('#') || line.trim() === '') continue;

    // Handle arrays
    if (line.trim().startsWith('- ')) {
      if (currentArray) {
        const value = line.trim().substring(2).trim();
        // Remove quotes if present
        currentArray.push(value.replace(/^["']|["']$/g, ''));
      }
      continue;
    }

    // Handle key-value pairs
    const match = line.match(/^(\s*)([a-z_]+):\s*(.*)$/i);
    if (match) {
      const indent = match[1].length;
      const key = match[2];
      let value = match[3].trim();

      // Remove quotes
      value = value.replace(/^["']|["']$/g, '');

      if (indent === 0) {
        // Top level key
        if (value === '' || value === 'null') {
          // This might be an array or object
          currentKey = key;
          currentArray = [];
          currentObject = null;
          result[key] = currentArray;
        } else {
          result[key] = value;
          currentKey = null;
          currentArray = null;
          currentObject = null;
        }
      } else if (indent === 2 && currentKey) {
        // Second level - might be object property
        if (!currentObject) {
          currentObject = {};
          result[currentKey] = currentObject;
          currentArray = null;
        }
        currentObject[key] = value;
      }
    }
  }

  return result;
}

function extractFrontmatter(content) {
  const trimmed = content.replace(/^\s+/, '');
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = trimmed.match(frontmatterRegex);

  if (!match) {
    return null;
  }

  try {
    return parseSimpleYaml(match[1]);
  } catch (error) {
    console.error('Error parsing frontmatter:', error);
    return null;
  }
}

function processWorksDirectory() {
  const files = fs.readdirSync(WORKS_DIR);
  const works = [];

  files.forEach(file => {
    if (!file.endsWith('.md') || file.includes('readme') || file.includes('AUDIT') || file.includes('draft')) {
      return;
    }

    const filePath = path.join(WORKS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const frontmatter = extractFrontmatter(content);

    if (!frontmatter) {
      console.warn(`No frontmatter found in ${file}`);
      return;
    }

    // Extract essential metadata
    const work = {
      id: frontmatter.doc_id || file.replace('.md', ''),
      title: frontmatter.title || 'Untitled',
      titleOriginal: frontmatter.title_original,
      cultureGroup: frontmatter.culture_group,
      languageOriginal: frontmatter.language_original,
      summary: frontmatter.summary,
      sourcePrimary: frontmatter.source_primary,
      sourceDocument: frontmatter.source_document,
      mythTypeTags: frontmatter.myth_type_tags || [],
      themeTags: frontmatter.theme_tags || [],
      characterArchetypeTags: frontmatter.character_archetype_tags || [],
    };

    works.push(work);
  });

  return works.sort((a, b) => a.title.localeCompare(b.title));
}

function generateTypeScriptFile(works) {
  const tsContent = `/**
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

export const works: Work[] = ${JSON.stringify(works, null, 2)};

export const cultureGroups = Array.from(new Set(works.map(w => w.cultureGroup))).sort();
`;

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, tsContent, 'utf-8');
  console.log(`✅ Generated ${OUTPUT_FILE} with ${works.length} works`);
}

// Main execution
try {
  const works = processWorksDirectory();
  generateTypeScriptFile(works);
  console.log(`\n📚 Extracted ${works.length} works:`);
  works.forEach(w => console.log(`  - ${w.title} (${w.cultureGroup})`));
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}
