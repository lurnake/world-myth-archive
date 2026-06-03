# World Myth Archive

Twenty-five of the world's mythological epics — the *Iliad*, the *Kalevala*, the *Popol Vuh*, the *Mahabharata*, the Eddas, the *Epic of Gilgamesh*, and more — gathered as clean, public-domain full text, broken into ~9,600 searchable passages, and tagged so you can move sideways across them: from one flood story to every other, from one trickster to all his cousins.

It runs entirely in your browser. No backend, no database, no API keys, no account. The whole archive is a folder of Markdown and one generated JSON index that a small React app reads. You can clone it, build it, and host the result on anything that serves static files.

## What it actually does

Search a phrase like *journey to the underworld* and you get ranked passages from across the corpus — Odysseus among the dead, Inanna's descent, the Welsh Annwn — each with its source, its location in the work, and the tags that put it there. Three modes: a weighted lexical search with a small association layer (so "flood" reaches "deluge"), a controlled-vocabulary mode that searches the tags and metadata, and a literal exact-phrase mode.

Or open a single work and read it straight through, passage by passage, with the figures and creatures in each section available in a side panel: who Cú Chulainn is, where else he appears, what the Morrígan's crow signifies. Every passage carries a stable citation back to its source edition.

The cross-referencing is the point. Each of the ~9,600 passages is tagged against controlled vocabularies for myth type, theme, character archetype, social function, cognitive function, rite, narrative episode, and Proppian function. Those tags are what let the archive surface a motif wherever it lives instead of trapping it in one book.

## An honest word about the tags

**The tags and entity links are machine-generated. No scholar has reviewed them.** They are good enough to *find* things and wrong often enough that you should not cite them as fact. A passage tagged `THM_FLOOD` almost certainly concerns a flood; a passage *not* so tagged is not proof of its absence. Treat the tagging as a research aid, not an authority — and treat the original translated text, which is faithful to its public-domain source, as the thing that's actually trustworthy. [`EDITORIAL_POLICY.md`](EDITORIAL_POLICY.md) draws the line between original text, machine interpretation, and reviewed interpretation. [`METHODOLOGY.md`](METHODOLOGY.md) explains how the corpus and tags are built.

## Run it

You need Node 18+ and npm.

```bash
git clone https://github.com/<your-account>/world-myth-archive.git
cd world-myth-archive
npm install --prefix world-mythological-codex-ui   # install UI dependencies
npm run generate:data                              # build works-data + search index from the corpus
npm run ui:dev                                      # serve the app locally
```

`generate:data` reads the Markdown in `Corpus Forge/works/`, extracts each work's metadata, and builds the static `search-index.json` the browser uses. The index is large (~100 MB) and generated, so it is not committed — you build it once, locally.

To produce a deployable static site and run the checks:

```bash
npm run ui:build    # type-check + Vite production build into world-mythological-codex-ui/dist
npm run qa          # corpus quality report (completeness, headings, tag coverage, provenance)
npm run verify      # generate:data + qa + build + lint, end to end
```

## How it's laid out

```
Corpus Forge/
  works/              25 public-domain works as Markdown + rich YAML frontmatter
  lexicons/           controlled vocabularies and entity records (figures, creatures, …)
  corpus_manifest.json  authoritative source/provenance/rights manifest
scripts/
  extract-works-metadata.js   works/*.md  → UI works-data.ts
  build-local-search-index.js works/*.md  → public/search-index.json
  report-corpus-quality.js    the QA report
  legacy/             one-off data-migration scripts kept for the record
world-mythological-codex-ui/  the React/Vite frontend
docs/                 methodology log, roadmap, completion status
```

## Where it's going

This is a local-first MVP, and that's a deliberate stage, not a limitation it's stuck with. The static JSON index is a bridge: it can be swapped for SQLite, embeddings, or a vector store without touching how the corpus is authored. The roadmap — a human-reviewed gold set for measuring tag quality, an explainable ranker that shows *why* a passage matched, entity pages that link a figure to every appearance, guided reading trails across cultures — lives in [`docs/PROJECT_PROGRESS.md`](docs/PROJECT_PROGRESS.md).

## Sources and licensing

The texts are public domain; this project claims no rights over them. Per-work provenance — translator, edition, year, source URL — is in [`SOURCES.md`](SOURCES.md), with notes on the few editions whose public-domain status was worth checking carefully.

Three licenses apply, because three different kinds of thing live here:

- **Source texts** (`Corpus Forge/works/`) — public domain.
- **The curation** — tags, entity records, summaries, lexicons — [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- **The code** — [MIT](LICENSE).

The full breakdown is in [`LICENSE-CONTENT.md`](LICENSE-CONTENT.md).
