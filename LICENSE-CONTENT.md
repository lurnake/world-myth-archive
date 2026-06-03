# Licensing of the corpus and its curation

This repository mixes three different kinds of material, and they are not all under the same license. Read this before you reuse anything.

## The source texts — public domain

Every full text in `Corpus Forge/works/` is a public-domain translation. No one owns these, and this project claims no rights over them. Copy them, sell them, feed them to a model, carve them into stone. Per-work provenance — translator, edition, year, and the exact source URL — lives in [SOURCES.md](SOURCES.md) and in each file's YAML frontmatter.

One note in good faith: a public-domain *translation* is not the same as an out-of-copyright *work*. We selected editions that are public domain in the United States, and two of them required checking renewal records rather than just counting years (see [SOURCES.md](SOURCES.md) for the Pyramid Texts and Poetic Edda). If you are redistributing from a country with different term rules, confirm the status where you are.

## The curation — CC BY 4.0

Everything this project *added* on top of the texts is the creative work here, and it is licensed under the [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/):

- the controlled-vocabulary tags applied to each passage (myth type, theme, archetype, social and cognitive function, rite, episode, Proppian function);
- the entity records — figures, creatures, places, objects — with their descriptions, aliases, domains, and per-work roles;
- the work summaries, editorial notes, provenance manifest, and the lexicons in `Corpus Forge/lexicons/`.

Use it, remix it, build on it. Just credit "World Myth Archive" and link back.

## The code — MIT

The ingestion scripts, the index builder, and the React UI are under the [MIT License](LICENSE). Standard terms; do what you like.

## A standing caveat

The tags and entity links are machine-generated and have not been reviewed by scholars. They are good enough to *find* things and wrong often enough that you should not cite them as authority. See [EDITORIAL_POLICY.md](EDITORIAL_POLICY.md) for where the line sits between the original text, machine interpretation, and reviewed interpretation.
