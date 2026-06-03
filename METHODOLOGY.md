# Methodology

Last updated: 2026-05-03

World Myth Archive separates three layers that should not be blurred:

1. Source text: public-domain or open source translated passages, with provenance.
2. Interpretation: controlled-vocabulary tags and entities, currently assigned by automated local heuristics.
3. Retrieval: local hybrid search over exact text, weighted lexical fields, tags, entities, and curated semantic expansions.

## Editorial Status

Each work has a status in `Corpus Forge/corpus_manifest.json`:

- `raw`: text exists, not cleaned.
- `cleaned`: readable Markdown exists.
- `metadata_complete`: work-level provenance and controlled metadata are present.
- `machine_tagged`: chunk-level automated tags are generated.
- `human_reviewed`: a human editor has reviewed text and tags.
- `scholar_reviewed`: a domain specialist has reviewed text and tags.
- `metadata_only`: the work is part of the intended scope but no local full text is bundled.

The current corpus is intentionally marked `machine_tagged`, not scholar-reviewed.

## Chunk Tags

The local index builder reads the controlled vocabularies in `Corpus Forge/lexicons` and assigns tags per chunk:

- myth type
- theme
- character archetype
- social function
- cognitive function
- rite
- myth episode
- Proppian function

Tags are scored from passage text, section headings, work-level tags, controlled labels, notes, and curated keyword hints. They are discovery aids, not final claims.

## Hybrid Retrieval

Search currently combines:

- exact phrase matching against translated text
- weighted lexical matching against passage text
- controlled vocabulary matching
- entity matching where lexicons exist
- small curated semantic expansions for common concepts such as flood, underworld, creation, hero, death, trickster, transformation

This is deliberately local and transparent. A later vector layer should augment this, not replace it.

## Public And Scholarly Use

For curious readers, guided trails offer entry points such as flood myths, underworld journeys, trickster thefts, creation from chaos, and hero-companion stories.

For scholarly readers, each result exposes:

- stable citation id
- work title
- culture
- source URL
- rights/completeness status
- editorial confidence
- tag-review caveat

## Known Limits

- Automated tags can overmatch or undermatch, especially in fragmentary, poetic, or formulaic passages.
- Entity lexicons are currently strongest for the Gilgamesh materials and should be expanded across traditions.
- Some works are abridged or partial translations, and the manifest marks this.
- The Huarochiri Manuscript remains metadata-only until a lawful full-text source is selected.
