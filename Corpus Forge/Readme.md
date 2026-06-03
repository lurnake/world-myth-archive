Project 1 – “Corpus Forge”
Build a clean, richly‑tagged, embedding‑ready myth corpus.

Why this repo exists

We are going to use the input from this project to build a full app that allows the user to explore different types of myths across cultures and history.

Everything the app does later—semantic search, motif breadcrumbs, “Roll the Bones”—stands or falls on the quality of the underlying data. Project 1 is a one‑way production line: raw PDFs/HTML → pristine Markdown → overlapping text chunks, each carrying motifs, entities, and an embedding vector. The output is a set of data files that any front‑end or search stack can consume without knowing a thing about regexes, Pandoc quirks, or API keys.

Action plan

Folders:
source/          # raw downloads & licence notes
work/            # cleaned .md, one per work
build/           # temp artefacts
data/            # final products
scripts/         # python entry points
lexicons/        # csv/json for tagging
Set up Poetry or pipenv; pin Python 3.11.

Phase 1 Ingestion & cleaning
Download script (scripts/fetch_sources.py)

Reads a manifest CSV: title, url, licence.

Saves into source/, renaming files deterministically.

Conversion pipeline (scripts/clean_to_md.py)

pandoc per file → Markdown.

Strip page numbers, headers, footers with regex.

Insert YAML front‑matter stub:

yaml
Copy
Edit
---
work_id: ILIAD
title: Iliad
culture: Greek
date_composed: -0750
translator: Samuel Butler
source_url: ...
licence: Public Domain
---
Manual review checklist (docs/REVIEW.md) – contributors tick off encoding issues, missing lines, etc.

Phase 2 Lexicon & tagger prep
Build lexicons in lexicons/

deities.csv, creatures.csv, motifs.csv, places.csv.

Scrape scripts + manual curation PRs.

NER + motif tagger (scripts/tag_chunk.py)

spaCy pipeline with EntityRuler for deities/places.

Motif classifier stub using OpenAI embeddings → logistic‑reg; store model in models/.

Unit test with pytest on 5 sample excerpts.

Phase 3 Chunk & embed

Data model for chunk and embed:
key	type	why it matters in a mythological corpus
chunk_id	ULID / UUID	stable cursor for pagination & deduping
work_id	FK → works table	fast grouping by text‑level metadata
culture	enum ("Greek", "Maya", …)	primary facet filter
language_source	ISO‑639 ("grc", "ota")	multilingual ties
language_edition	ISO‑639 of translation	
date_composed	ISO date or −1300 for BCE	timeline plotting
translator	string	citation, text style
section	freeform ("Tablet XI", "Bk 3. lines 1–50")	scroll‑to anchor
line_start / line_end	int	highlight range in UI
motif_codes	string[] (e.g. ["A1312","F300"])	cross‑culture motif jump links
entity_tags	string[] (canonical deity/hero/creature names)	“who’s on stage?”
theme_tags	string[] (creation, flood, trickster, world‑tree …)	broad topic facets
geo_tags	string[] (Mount Olympus, Tigris, Kur)	map overlay pins
cosmogony_stage	enum (chaos → creation → age of gods → age of heroes)	story‑arc filter
token_count	int	chunk size sanity
vector	float32[]	semantic retrieval
source_url	string	attributions / deep link

Chunker (scripts/chunk_and_embed.py)

Tokenize with tiktoken.

Sliding window size=800, stride=200.

Generates:

json

{
  "chunk_id": "01HT…",
  "work_id": "ILIAD",
  "culture": "Greek",
  "section": "Bk 1 (0‑800)",
  "text": "…",
  "motif_codes": ["B223", "A1000"],
  "entity_tags": ["Zeus", "Achilles"],
  "theme_tags": ["anger", "war"],
  "page_number": "..."
  "embedding": [0.0123, …]
}
Stream to data/chunks.jsonl.

Embeddings fetched with OPENAI_API_KEY env var; retries & local cache so reruns are free.

Phase 4 Graph & statistics
Motif co‑occurrence builder (scripts/build_motif_graph.py)

Reads data/chunks.jsonl, updates motif_edges.csv, motif_to_cultures.json.

Saves both to data/.

Quality report (scripts/report.py)

Prints counts per culture, avg tokens/chunk, missing motif ratios.

Fails CI if any culture < 80 % chunks tagged with ≥ 1 motif.

Phase 5 Packaging & CI
Makefile shortcuts

make
Copy
Edit
make fetch   # download raw texts
make build   # clean → md → chunks → embeddings → graphs
make test    # run pytest
make report  # print dataset summary