# World Myth Archive Progress

Last updated: 2026-05-03

This is the living project log for the local-first World Myth Archive / Corpus Forge work. It summarizes what has been built, what is still provisional, and what would make the archive genuinely useful for curious readers as well as scholars.

## Current Snapshot

- Local corpus: 25 full-text works
- Generated browser chunks: 9,652
- Tagged chunks: 9,583
- Current storage model: Markdown works, CSV lexicons, generated static JSON index
- Current UI: local Vite app in `world-mythological-codex-ui`
- Current editorial status: machine-tagged, not human-reviewed or scholar-reviewed

## What We Have Built

### Corpus

- Promoted and cleaned major public-domain works into `Corpus Forge/works`.
- Added public-domain epics and mythological works including the Iliad, Odyssey, Aeneid, Argonautica, Beowulf, Nibelungenlied, and Volsunga Saga.
- Replaced the partial/template Popol Vuh with the complete Lewis Spence public-domain translation from Project Gutenberg.
- Cleaned Beowulf so chunks begin at the poem instead of publisher front matter.
- Maintained a manifest-driven source/provenance layer in `Corpus Forge/corpus_manifest.json`.
- Kept uncertain or rights-limited works out of the indexed corpus rather than silently bundling questionable text.

### Tagging And Entities

- Generated chunk-level tags for myth type, theme, archetype, social function, cognitive function, rite, episode, and Proppian function.
- Reduced major over-tagging problems, especially the previous tendency to mark nearly everything as divine myth.
- Added tag confidence and interpretation caveats to the generated index.
- Expanded entity handling beyond bare names: entities can now carry type, culture, domains, description, aliases, role in the work, notes, and source.
- Scoped global CSV entities by `works_appeared_in` where available, and supplemented them with work frontmatter and curated seeds.
- Current generated chunk-entity occurrences: 24,549; 4,050 have `roleInWork`; 21,844 have descriptions.
- Expanded central figure and creature records across all 25 indexed works with curated descriptions, domains, aliases, work scoping, and interpretive notes.
- Fixed entity merging so enriched CSV lexicon records are not overwritten by bare work-level seed records during index generation.

### Search And Exploration

- Built a local static search index as the temporary search backend.
- Added faceted search across the major controlled vocabulary groups.
- Added a work explorer where a user can click a work and read its chunks with text, tags, entities, provenance, caveats, and source metadata.
- Added per-chunk details drawers for citation, id, word range, provenance, source quality, work tags, and retrieval text.
- Added per-chunk collapsible figure/creature panels so entity data is available without overwhelming the reading experience.
- Improved within-work filtering so it searches entity names, aliases, descriptions, roles, notes, ids, citations, and work tags.

### QA And Documentation

- Added corpus QA reporting for source completeness, suspicious headings, chunk counts, tag coverage, provenance confidence, and placeholder/template detection.
- Added heading-quality checks to catch bad chunk titles such as publisher locations and repeated generic headings.
- Documented methodology, editorial policy, corpus completion status, and the generated search index schema.
- Added root npm shortcuts for generation, QA, build, lint, and verification.

## What Is Still Provisional

- Tags are machine suggestions. They are useful for discovery, but they should not be treated as scholarly claims until reviewed.
- Entity coverage is much better than at the start, but descriptions are still thin for many figures and creatures.
- Search is still mostly local lexical/facet logic. It does not yet have a proper explainable ranker or vector retrieval.
- The corpus is strong in several canonical public-domain traditions but still uneven globally.
- Some chunk headings remain suspicious or repetitive in QA, especially where source texts have difficult structures.
- Work-level summaries and frontmatter are useful, but not yet consistently scholar-reviewed.

## Known Gaps

- Huarochiri Manuscript: no bundled full text until a lawful source path is chosen.
- Shan Hai Jing: prepared as a desired/pending work, but no lawful public-domain English translation is bundled.
- Human review set: still needed, ideally 50-100 chunks across cultures and genres.
- Entity knowledge: central figures and creatures are now broadly enriched, but places, peoples, sacred objects, dynasties, and minor local figures still need their own curated relationship layer.
- Search scoring: needs a true score model and an "why this matched" explanation for search results.
- Reader guidance: needs curated trails, comparison views, and beginner-friendly entry points.
- Scholarly apparatus: needs citation export, translation comparison where lawful, alternate interpretations, reviewer notes, and bibliography/source notes.
- CI: build, lint, index generation, and QA should run automatically.

## What Would Make This Great

For curious readers:

- Guided trails such as "Underworld journeys", "Trickster thefts", "Flood and renewal", "Creation from chaos", "Dragon/serpent combat", and "Hero and companion".
- Work landing pages that explain what a text is, why it matters, how to read it, and where a good first passage begins.
- Entity pages for figures, creatures, places, peoples, and sacred objects, with appearances across works.
- Side-by-side exploration of related motifs across cultures without implying false equivalence.
- Clear labels separating original text, machine interpretation, and reviewed interpretation.

For scholars:

- Stable chunk citations and exportable references.
- Transparent provenance, source URLs, rights status, translation details, and completeness notes.
- Review workflows for tagging disagreements, alternate readings, and confidence changes.
- A gold set for measuring automated tag/entity quality.
- Explainable search ranking and reproducible index generation.
- Eventually, embeddings as an additional retrieval layer with clear caveats and versioning.

## Recommended Next Steps

1. Create the 50-100 chunk human review gold set.
2. Add an explainable ranker that reports exact text, tag, entity, and semantic-expansion matches.
3. Add entity/work relationship pages so users can move from a figure to every passage where that figure appears.
4. Fix the remaining suspicious headings and tiny/duplicate sections flagged by `corpus-qa-report.json`.
5. Add CI for `npm run verify`.
6. Decide the next 10-20 lawful public-domain/open-source traditions to add.
7. Design a review workflow that preserves machine tags while adding human and scholar layers.

## Useful Commands

```bash
npm run generate:data
npm run qa
npm run verify
npm --prefix world-mythological-codex-ui run dev
```
