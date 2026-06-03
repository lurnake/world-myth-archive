# World Myth Archive / Corpus Forge: Current To-Do List

Current local state: 25 full-text works, 9,652 generated chunks, and 9,583 chunks carrying at least one controlled tag. Tag quality significantly improved: MYTHTYPE_DIVINE_MYTH down from 97.8% to 26.3% corpus-wide; per-work mythType diversity now 2–4 unique types per work. The archive is still local-file first; database, embeddings, and scholar review remain future layers.

For the fuller progress narrative, current limitations, and "what would make this great" roadmap, see `PROJECT_PROGRESS.md`.

## Immediate Quality Fixes
- [x] Fix Beowulf source cleanup so chunks start at the poem, not publisher front matter
- [x] Correct Beowulf source metadata to Jno. Lesslie Hall / Project Gutenberg eBook 16328
- [x] Regenerate local work metadata and static search index after Beowulf cleanup
- [x] Audit the newly promoted Gutenberg works for stray title-page, contents, glossary, addenda, or license material
- [x] Add a reusable heading-quality report that flags suspicious chunk titles such as publisher locations, all-caps title pages, or repeated generic headings
- [x] Add a corpus QA report for source completeness, chunk counts, tag coverage, and provenance confidence
- [x] Fix Popol Vuh — replaced template/placeholder with complete Lewis Spence translation (Gutenberg eBook 56550)
- [x] Harden QA script to detect placeholder content like `[REMAINING SECTIONS TO BE ADDED]` and network-restriction notes

## Corpus & Source Work
- [x] Promote available public-domain starter texts into `Corpus Forge/works`
- [x] Add major missing public-domain works: Iliad, Odyssey, Aeneid, Argonautica, Beowulf, Nibelungenlied, Volsunga Saga
- [x] Maintain `Corpus Forge/corpus_manifest.json` as the source/status manifest
- [ ] Resolve rights/source path for the Huarochiri Manuscript
- [ ] Identify the next 10-20 high-value missing traditions with lawful source paths
- [x] Normalize promoted text cleanup rules per source family instead of relying on generic all-caps heading conversion

## Tagging & Metadata
- [x] Generate per-chunk controlled-vocabulary tags for myth type, theme, archetype, social function, cognitive function, rite, episode, and Proppian function
- [x] Carry provenance, tag confidence, entities, caveats, and stable citations into the browser index
- [x] Expand central figure and creature records across every indexed work with descriptions, domains, aliases, and notes
- [ ] Create a 50-100 chunk human review set across cultures to evaluate automated tags
- [ ] Add tests for representative excerpts and expected tags/entities
- [ ] Refine the controlled vocabularies where work-level tags created ad hoc codes
- [ ] Add reviewer notes or alternate scholarly interpretations without overwriting machine tags

## Search & Exploration
- [x] Implement local static search index as the temporary search backend
- [x] Improve search facets so all major tag groups are searchable and expandable
- [x] Add work explorer view with original text, per-chunk tags, entities, provenance, and display toggles
- [x] Add per-chunk details and collapsible figure/creature drawers in the work explorer
- [x] Improve within-work filtering over entity aliases, descriptions, roles, ids, citations, and work tags
- [ ] Add a true lexical ranker/reportable score model rather than only UI-side matching heuristics
- [ ] Add embeddings/vector retrieval after local corpus quality is stable
- [ ] Add guided trails and comparison views for curious readers

## Product & Documentation
- [x] Document local MVP data generation and UI workflow
- [x] Document methodology and corpus completion status
- [x] Document the exact generated index schema (`world-mythological-codex-ui/public/search-index-schema.md`)
- [x] Write an editorial policy for source inclusion, translation choice, machine tags, and human review (`EDITORIAL_POLICY.md`)
- [x] Add npm shortcuts for `generate`, `qa`, `build`, `lint`, and `verify`
- [ ] Add CI checks for build, lint, index generation, and corpus QA

## Next Immediate Steps
1. ~~Build `scripts/report-corpus-quality.js`~~ ✅ Done.
2. ~~Run title/source cleanup audits on the seven newly added epics~~ ✅ Done.
3. ~~Fix chunk-level tagging algorithm and ad-hoc tag proliferation~~ ✅ Done.
4. Add a small reviewed gold set for automated tag evaluation.
5. Tighten search scoring and show why a result matched.
