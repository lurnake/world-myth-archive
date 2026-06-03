Data model – what every chunk knows about itself
key	type	why it matters in a mythological corpus
chunk_id	ULID / UUID	stable cursor for pagination & deduping
work_id	FK → works table	fast grouping by text‑level metadata
culture	enum ("Greek", "Maya", …)	primary facet filter
region	enum ("Mesoamerica", "Northern Europe", …)	coarse geo filter & map overlay
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

A work table (1‑row per text) keeps the heavier stuff—copyright, synopsis, recommended citation, etc.

2  Auto‑tagging – how to populate those arrays
2.1 Controlled vocabularies
list	source	notes
Deity & hero lexicon	scrape from Wikipedia deity categories; merge with open data sets (e.g. Wikidata Q2993361 “Greek deities”).	Normalize to one canonical label + aliases[] so a query for “Zeus” also hits “Jove” & “Jupiter”.
Mythic creatures	same approach; include taxonomies like “dragon”, “naga”, “ahuizotl”.	
Motif codes	Stith Thompson / Aarne–Thompson–Uther motif index → CSV (code, short_label).	Keeps cross‑cultural mapping academic‑grade.
Theme tags	Short human‑readable list: creation, flood, underworld, trickster, hero’s journey, apotheosis, cosmology, eclipse, duel, sacred‑marriage.	
Place names	GeoNames dump filtered for archaeological / historical sites; hand‑add mythical locales.

Strongest possible chunk metadata schema, perhaps something like this:

key	type	why a scholar would care
chunk_id	ULID	unchanging permalink
work_id	string	link to work‑level metadata
witness_id	string	if you ingest more than one manuscript/translation
original_lang	ISO‑639‑3	enables parallel‑text view
translator / translation_year	string/int	citation, stylistic filtering
edition_source	URI	verify against critical edition
cts_passage	URN	line‑level citation (urn:cts:greekLit:tlg0012.tlg001:1.1‑1.5)
section_title	string	meaningful nav label (“Tablet XI” / “Book 3”)
token_start / token_end	int	precise vector <-> text alignment
motif_codes	string[]	Thompson / TR‑2021
atu_types	string[]	if any
myth_episode	string[]	creation, flood, trickster…
function_tag	string	e.g. SOV1 (sovereignty), FERT (fertility)
entity_tags	string[]	deities, heroes, places
geo_tags	lat/lon or GeoJSON	plot myths on a map
rite_tags	string[]	sacrifice, initiation, coronation
theme_tags	string[]	love, revenge, liminal, cosmology
morphology	int	Propp function number if applicable
embedding	float32[]	dense vector
bm25_text	string	feed for keyword index
checksum	SHA‑256	integrity check
timestamp_ingested	ISO‑8601	provenance