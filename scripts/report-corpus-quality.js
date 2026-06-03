#!/usr/bin/env node

/**
 * Corpus QA quality report.
 * Flags suspicious chunk titles, stray boilerplate, source completeness issues,
 * tag coverage gaps, and provenance confidence problems.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const WORKS_DIR = path.join(ROOT_DIR, 'Corpus Forge', 'works');
const MANIFEST_FILE = path.join(ROOT_DIR, 'Corpus Forge', 'corpus_manifest.json');
const SEARCH_INDEX_FILE = path.join(ROOT_DIR, 'world-mythological-codex-ui', 'public', 'search-index.json');
const TAG_FIELDS = ['mythType', 'theme', 'archetype', 'social', 'cognitive', 'rite', 'episode', 'proppian'];

const SUSPICIOUS_HEADING_PATTERNS = [
  { regex: /^contents?$/i, name: 'contents-page' },
  { regex: /^glossary$/i, name: 'glossary' },
  { regex: /^addenda$/i, name: 'addenda' },
  { regex: /^appendix/i, name: 'appendix' },
  { regex: /^index$/i, name: 'index' },
  { regex: /^endnotes?$/i, name: 'endnotes' },
  { regex: /^footnotes?$/i, name: 'footnotes' },
  { regex: /^preface$/i, name: 'preface' },
  { regex: /^introduction$/i, name: 'introduction' },
  { regex: /^publisher/i, name: 'publisher-info' },
  { regex: /^transcriber/i, name: 'transcriber-note' },
  { regex: /^note by the transcriber/i, name: 'transcriber-note' },
  { regex: /^preface to (first|second|third) edition$/i, name: 'preface-edition' },
  { regex: /^book [ivxlc]+\.?\s*$/i, name: 'generic-book-heading' },
  { regex: /^chapter [ivxlc0-9]+\.?\s*$/i, name: 'generic-chapter-heading' },
  { regex: /^\d+\s*$/i, name: 'number-only-heading' },
  { regex: /^(the )?(project gutenberg|gutenberg)/i, name: 'gutenberg-boilerplate' },
  { regex: /^(rendered into|translated by|by\s+\w+)$/i, name: 'translator-credit-heading' },
  { regex: /^copyright/i, name: 'copyright-notice' },
];

const GENERIC_SECTION_TITLES = new Set([
  'opening', 'text', 'untitled', 'introduction', 'preface',
]);

function parseFrontmatter(markdown) {
  const trimmed = markdown.replace(/^\s+/, '');
  const match = trimmed.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { frontmatter: {}, body: trimmed };

  const lines = match[1].split(/\r?\n/);
  const frontmatter = {};
  let currentKey = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) continue;

    const keyValue = line.match(/^(\w+):\s*(.*)$/);
    if (keyValue) {
      const key = keyValue[1];
      const value = keyValue[2].trim();
      if (value === '' || value === 'null') {
        frontmatter[key] = [];
        currentKey = key;
      } else if (value.startsWith('"') && value.endsWith('"')) {
        frontmatter[key] = value.slice(1, -1);
        currentKey = null;
      } else {
        frontmatter[key] = value.split('#')[0].trim();
        currentKey = null;
      }
      continue;
    }

    const listItem = line.match(/^\s+-\s+(.+)$/);
    if (listItem && currentKey && Array.isArray(frontmatter[currentKey])) {
      frontmatter[currentKey].push(listItem[1].trim().split('#')[0].trim());
    }
  }

  return {
    frontmatter,
    body: trimmed.slice(match[0].length).trim(),
  };
}

function extractHeadings(body) {
  const headings = [];
  const lines = body.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$/);
    if (match) {
      headings.push({ line: i + 1, text: match[1].trim() });
    }
  }
  return headings;
}

function wordCount(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

const PLACEHOLDER_PATTERNS = [
  { regex: /\[REMAINING SECTIONS TO BE ADDED\]/i, name: 'remaining-sections-placeholder' },
  { regex: /\[NOTE TO USER:/i, name: 'note-to-user-placeholder' },
  { regex: /\[TO BE COMPLETED\]/i, name: 'to-be-completed-placeholder' },
  { regex: /\[TO BE SPECIFIED\]/i, name: 'to-be-specified-placeholder' },
  { regex: /\[TO BE ADDED\]/i, name: 'to-be-added-placeholder' },
  { regex: /\*\*\[REMAINING/i, name: 'remaining-placeholder' },
  { regex: /due to network restrictions preventing download/i, name: 'network-restriction-placeholder' },
  { regex: /the full narrative content cannot be completed/i, name: 'incomplete-narrative-placeholder' },
];

function findSuspiciousChunks(body, workId) {
  const issues = [];
  const headings = extractHeadings(body);
  const lines = body.split(/\r?\n/);

  for (const h of headings) {
    for (const pattern of SUSPICIOUS_HEADING_PATTERNS) {
      if (pattern.regex.test(h.text)) {
        issues.push({
          workId,
          type: 'suspicious-heading',
          subtype: pattern.name,
          line: h.line,
          text: h.text,
        });
        break;
      }
    }
  }

  // Check for placeholder content in body
  for (const pattern of PLACEHOLDER_PATTERNS) {
    const match = body.match(pattern.regex);
    if (match) {
      issues.push({
        workId,
        type: 'placeholder-content',
        subtype: pattern.name,
        text: match[0].slice(0, 100),
      });
    }
  }

  // Check for empty or near-empty sections
  let lastHeadingLine = -1;
  let lastHeadingText = '';
  for (let i = 0; i < lines.length; i++) {
    const headingMatch = lines[i].match(/^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$/);
    if (headingMatch) {
      if (lastHeadingLine >= 0) {
        const sectionLines = lines.slice(lastHeadingLine, i);
        const sectionBody = sectionLines.slice(1).join('\n');
        const wc = wordCount(sectionBody);
        if (wc > 0 && wc < 30) {
          issues.push({
            workId,
            type: 'tiny-section',
            line: lastHeadingLine + 1,
            text: lastHeadingText,
            wordCount: wc,
          });
        }
      }
      lastHeadingLine = i;
      lastHeadingText = headingMatch[1].trim();
    }
  }
  // Check final section
  if (lastHeadingLine >= 0 && lastHeadingLine < lines.length - 1) {
    const sectionLines = lines.slice(lastHeadingLine);
    const sectionBody = sectionLines.slice(1).join('\n');
    const wc = wordCount(sectionBody);
    if (wc > 0 && wc < 30) {
      issues.push({
        workId,
        type: 'tiny-section',
        line: lastHeadingLine + 1,
        text: lastHeadingText,
        wordCount: wc,
      });
    }
  }

  return issues;
}

function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'));
  const manifestByDocId = new Map(manifest.works.map((w) => [w.docId, w]));
  const searchIndex = fs.existsSync(SEARCH_INDEX_FILE)
    ? JSON.parse(fs.readFileSync(SEARCH_INDEX_FILE, 'utf8'))
    : null;
  const chunksByWork = new Map();
  if (searchIndex) {
    for (const chunk of searchIndex.chunks || []) {
      if (!chunksByWork.has(chunk.workId)) chunksByWork.set(chunk.workId, []);
      chunksByWork.get(chunk.workId).push(chunk);
    }
  }

  const files = fs
    .readdirSync(WORKS_DIR)
    .filter((f) => f.endsWith('.md') && !/readme|audit|draft|notes/i.test(f));

  const report = {
    generatedAt: new Date().toISOString(),
    worksChecked: files.length,
    summary: {
      totalIssues: 0,
      worksWithIssues: 0,
      issueTypes: {},
    },
    works: [],
  };

  for (const file of files.sort()) {
    const filePath = path.join(WORKS_DIR, file);
    const markdown = fs.readFileSync(filePath, 'utf8');
    const { frontmatter, body } = parseFrontmatter(markdown);
    const workId = frontmatter.doc_id || path.basename(file, '.md');
    const manifestRecord = manifestByDocId.get(workId) || {};
    const bodyWordCount = wordCount(body);
    const headings = extractHeadings(body);

    const issues = findSuspiciousChunks(body, workId);
    const indexedChunks = chunksByWork.get(workId) || [];

    if (searchIndex && indexedChunks.length === 0) {
      issues.push({
        workId,
        type: 'index-missing-work',
        text: 'No chunks for this work in search-index.json',
      });
    }

    if (indexedChunks.length > 0) {
      const taggedChunks = indexedChunks.filter((chunk) => TAG_FIELDS.some((field) => chunk.tags?.[field]?.length));
      const entityChunks = indexedChunks.filter((chunk) => chunk.entities?.figures?.length || chunk.entities?.creatures?.length);
      const figureCount = new Set(indexedChunks.flatMap((chunk) => (chunk.entities?.figures || []).map((entity) => entity.id))).size;
      const entityCoverage = entityChunks.length / indexedChunks.length;
      const tagCoverage = taggedChunks.length / indexedChunks.length;

      if (tagCoverage < 0.95) {
        issues.push({
          workId,
          type: 'low-tag-coverage',
          text: `${taggedChunks.length}/${indexedChunks.length} chunks have at least one tag`,
        });
      }

      if (entityCoverage < 0.15 && bodyWordCount > 10000) {
        issues.push({
          workId,
          type: 'low-entity-coverage',
          text: `${entityChunks.length}/${indexedChunks.length} chunks have entities; ${figureCount} distinct figures`,
        });
      }

      if (figureCount < 3 && bodyWordCount > 10000) {
        issues.push({
          workId,
          type: 'low-figure-variety',
          text: `${figureCount} distinct figures in index`,
        });
      }
    }

      // Check manifest completeness flags
    if (manifestRecord.completeness === 'partial' || manifestRecord.completeness === 'abridged') {
      issues.push({
        workId,
        type: 'completeness-caveat',
        subtype: manifestRecord.completeness,
        notes: manifestRecord.notes || '',
      });
    }

    // Check for very low word count
    if (bodyWordCount < 5000) {
      issues.push({
        workId,
        type: 'short-body',
        wordCount: bodyWordCount,
      });
    }

    // Check for duplicate headings
    const headingTexts = headings.map((h) => h.text.toLowerCase());
    const seen = new Set();
    const duplicates = new Set();
    for (const ht of headingTexts) {
      if (seen.has(ht)) duplicates.add(ht);
      seen.add(ht);
    }
    for (const dup of duplicates) {
      issues.push({ workId, type: 'duplicate-heading', text: dup });
    }

    for (const issue of issues) {
      report.summary.issueTypes[issue.type] = (report.summary.issueTypes[issue.type] || 0) + 1;
    }
    report.summary.totalIssues += issues.length;
    if (issues.length > 0) {
      report.summary.worksWithIssues += 1;
    }

    report.works.push({
      file,
      workId,
      title: frontmatter.title || file,
      bodyWordCount,
      headingCount: headings.length,
      manifestStatus: manifestRecord.status || 'unknown',
      manifestCompleteness: manifestRecord.completeness || 'unknown',
      index: indexedChunks.length > 0 ? {
        chunkCount: indexedChunks.length,
        taggedChunks: indexedChunks.filter((chunk) => TAG_FIELDS.some((field) => chunk.tags?.[field]?.length)).length,
        entityChunks: indexedChunks.filter((chunk) => chunk.entities?.figures?.length || chunk.entities?.creatures?.length).length,
        distinctFigures: new Set(indexedChunks.flatMap((chunk) => (chunk.entities?.figures || []).map((entity) => entity.id))).size,
        distinctCreatures: new Set(indexedChunks.flatMap((chunk) => (chunk.entities?.creatures || []).map((entity) => entity.id))).size,
      } : null,
      issues,
    });
  }

  // Print report
  console.log('\n=== CORPUS QA REPORT ===\n');
  console.log(`Works checked: ${report.worksChecked}`);
  if (searchIndex) {
    const taggedChunks = searchIndex.chunks.filter((chunk) => TAG_FIELDS.some((field) => chunk.tags?.[field]?.length)).length;
    const entityChunks = searchIndex.chunks.filter((chunk) => chunk.entities?.figures?.length || chunk.entities?.creatures?.length).length;
    console.log(`Indexed works/chunks: ${searchIndex.works.length}/${searchIndex.chunks.length}`);
    console.log(`Tagged chunks: ${taggedChunks}/${searchIndex.chunks.length}`);
    console.log(`Entity-bearing chunks: ${entityChunks}/${searchIndex.chunks.length}`);
    console.log(`Indexed figures/creatures: ${searchIndex.facets.entities.figures.length}/${searchIndex.facets.entities.creatures.length}`);
  }
  console.log(`Works with issues: ${report.summary.worksWithIssues}`);
  console.log(`Total issues: ${report.summary.totalIssues}\n`);

  console.log('Issue breakdown:');
  for (const [type, count] of Object.entries(report.summary.issueTypes).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${type}: ${count}`);
  }
  console.log('');

  const worksBySeverity = report.works
    .filter((w) => w.issues.length > 0)
    .sort((a, b) => b.issues.length - a.issues.length);

  for (const work of worksBySeverity) {
    console.log(`\n${work.file} (${work.bodyWordCount} words, ${work.headingCount} headings)`);
    console.log(`  Status: ${work.manifestStatus} | Completeness: ${work.manifestCompleteness}`);
    for (const issue of work.issues) {
      let detail = `  [${issue.type}]`;
      if (issue.subtype) detail += ` (${issue.subtype})`;
      if (issue.line) detail += ` line ${issue.line}`;
      if (issue.text) detail += `: "${issue.text}"`;
      if (issue.wordCount !== undefined) detail += ` — ${issue.wordCount} words`;
      if (issue.notes) detail += ` — ${issue.notes}`;
      console.log(detail);
    }
  }

  console.log('\n=== END REPORT ===\n');

  // Write JSON report for CI
  const reportPath = path.join(ROOT_DIR, 'corpus-qa-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(`JSON report written to ${reportPath}`);
}

try {
  main();
} catch (err) {
  console.error(err);
  process.exit(1);
}
