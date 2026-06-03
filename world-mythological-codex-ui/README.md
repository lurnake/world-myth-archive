# World Mythological Codex UI

React/Vite interface for the World Myth Archive corpus. The current MVP runs fully locally: Corpus Forge markdown files are converted into a static passage index, then searched in the browser with weighted lexical, controlled-vocabulary, and exact-match modes.

## Current Corpus

- 25 mythological works
- ~9,600 local passage chunks
- Work-level provenance, culture, translator/source URL, and controlled-vocabulary tags
- Per-chunk controlled tags for myth type, theme, archetype, social function, cognitive function, rite, myth episode, and Proppian function
- Local index file: `public/search-index.json`

## Search Modes

- `Semantic`: local weighted lexical search with a small synonym/association layer for concepts such as creation, death, flood, underworld, hero, transformation, and trickster.
- `Lexicon`: prioritizes matches against controlled vocabulary tags and work metadata.
- `Exact`: literal phrase search against translated passage text.

## Local Data Flow

From the repository root:

```bash
npm run generate:data
```

This runs:

```bash
node scripts/extract-works-metadata.js
node scripts/build-local-search-index.js
```

Outputs:

- `src/data/works-data.ts` for the collection cards
- `public/search-index.json` for browser search

## Development

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm run generate:data
npm run build
npm run lint
npm run preview
```

From the repository root, equivalent shortcuts are available:

```bash
npm run generate:data
npm run ui:dev
npm run ui:build
npm run ui:lint
```

## Architecture

- `src/App.tsx`: home, navigation, collection entry points
- `src/mythology-search-page.tsx`: local search, filters, ranked excerpts, result analysis
- `src/components/WorksCollection.tsx`: corpus collection cards
- `src/data/works-data.ts`: generated work metadata
- `public/search-index.json`: generated local passage index

The local index is deliberately plain JSON so it can later be replaced or augmented by SQLite, embeddings, or a vector database without changing the corpus authoring format.
