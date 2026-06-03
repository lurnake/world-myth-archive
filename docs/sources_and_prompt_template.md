# ATU and TMI sources:
https://github.com/KatjaMellmann/TMI_as_CSV
https://github.com/j-hagedorn/trilogy
https://github.com/j-hagedorn/mythos

# Mythological Sources – preferred downloadable editions

Below is a starter set of primary myth texts in the public domain, each pointing to a **plain‑text or HTML edition** that survives Pandoc with minimal cleanup.

| #  | Work (English edition)                            | Culture        | Year          | Cleanest URL                                                                                                     |
| -- | ------------------------------------------------- | -------------- | ------------- | ---------------------------------------------------------------------------------------------------------------- |
| 1  | **Epic of Gilgamesh** (tr. M. Kovacs)             | Mesopotamian   | ≈ 2100 BCE    | [https://www.sacred-texts.com/ane/eog.htm](https://www.sacred-texts.com/ane/eog.htm)                             |
| 2  | **Enūma Eliš** (Babylonian Creation)              | Mesopotamian   | c. 12th c BCE | [https://www.sacred-texts.com/ane/enuma.htm](https://www.sacred-texts.com/ane/enuma.htm)                         |
| 3  | **Pyramid Texts** (tr. Faulkner)                  | Egyptian       | 24‑23 c BCE   | [https://www.sacred-texts.com/egy/pyt/index.htm](https://www.sacred-texts.com/egy/pyt/index.htm)                 |
| 4  | **Book of the Dead** (tr. Wallis Budge)           | Egyptian       | 16 c BCE      | [https://www.sacred-texts.com/egy/ebod/](https://www.sacred-texts.com/egy/ebod/)                                 |
| 5  | **Hesiod – Theogony** (tr. Evelyn‑White)          | Greek          | 7 c BCE       | [https://www.perseus.tufts.edu/hopper/text?doc=Hes.+Th](https://www.perseus.tufts.edu/hopper/text?doc=Hes.+Th).  |
| 6  | **Homeric Hymns** (tr. Evelyn‑White)              | Greek          | 7‑5 c BCE     | [https://www.sacred-texts.com/cla/hh/index.htm](https://www.sacred-texts.com/cla/hh/index.htm)                   |
| 7  | **Ovid – Metamorphoses** (tr. Brookes More)       | Roman          | 8 CE          | [https://www.perseus.tufts.edu/hopper/text?doc=Ov.+Met](https://www.perseus.tufts.edu/hopper/text?doc=Ov.+Met).  |
| 8  | **Poetic Edda** (tr. Henry Adams Bellows)         | Norse          | 13 c CE       | [https://www.sacred-texts.com/neu/poe/index.htm](https://www.sacred-texts.com/neu/poe/index.htm)                 |
| 9  | **Prose Edda** (tr. Brodeur)                      | Norse          | 13 c CE       | [https://www.sacred-texts.com/neu/pre/index.htm](https://www.sacred-texts.com/neu/pre/index.htm)                 |
| 10 | **Mabinogion** (tr. Lady Guest)                   | Welsh          | 12‑13 c       | [https://www.sacred-texts.com/neu/celt/mab/index.htm](https://www.sacred-texts.com/neu/celt/mab/index.htm)       |
| 11 | **Táin Bó Cúailnge** (tr. Kinsella)               | Irish          | 12 c          | [https://celt.ucc.ie/published/T301035/index.html](https://celt.ucc.ie/published/T301035/index.html)             |
| 12 | **Kalevala** (tr. Crawford, 1888)                 | Finnish        | 1835/49       | [https://www.sacred-texts.com/neu/kveng/index.htm](https://www.sacred-texts.com/neu/kveng/index.htm)             |
| 13 | **Shāhnāmeh** (tr. D. Davis, prose)               | Persian        | 10 c CE       | [https://archive.org/details/shaahnaamedepers00ferduoft](https://archive.org/details/shaahnaamedepers00ferduoft) |
| 14 | **Ṛg Veda** (tr. Ralph Griffith)                  | Vedic          | 1500 BCE      | [https://www.sacred-texts.com/hin/rigveda/](https://www.sacred-texts.com/hin/rigveda/)                           |
| 15 | **Mahābhārata** (tr. Ganguli, unabridged)         | Indian         | 400 BCE       | [https://www.sacred-texts.com/hin/maha/index.htm](https://www.sacred-texts.com/hin/maha/index.htm)               |
| 16 | **Rāmāyaṇa** (tr. Griffith)                       | Indian         | 5‑3 c BCE     | [https://www.sacred-texts.com/hin/rama/](https://www.sacred-texts.com/hin/rama/)                                 |
| 17 | **Shan Hai Jing** (Classic of Mountains & Seas)   | Chinese        | 4 c BCE       | [https://ctext.org/shan-hai-jing](https://ctext.org/shan-hai-jing)                                               |
| 18 | **Kojiki** (tr. Chamberlain)                      | Japanese       | 712 CE        | [https://www.sacred-texts.com/shi/kj/index.htm](https://www.sacred-texts.com/shi/kj/index.htm)                   |
| 19 | **Popol Vuh** (tr. A. Goetz & S. Morley)          | Maya           | 16 c CE       | [https://www.sacred-texts.com/nam/pvuheng.htm](https://www.sacred-texts.com/nam/pvuheng.htm)                     |
| 20 | **Huarochirí Manuscript** (tr. Salomon & Urioste) | Quechua/Andean | 1598 CE       | [https://archive.org/details/huarochirimanusc00salo](https://archive.org/details/huarochirimanusc00salo)         |

*(Feel free to append more rows—same format—before sending to the LLM.)*

---

## Prompt template for conversion via LLM

> **System**: *You are an expert text‑cleaning assistant. Your job is to receive a source myth text and output a clean Markdown file suitable for downstream chunking, with accurate metadata front‑matter.*
>
> **Instructions** (follow **all**):
>
> 1. **Read the supplied raw text exactly as provided. Do not summarise or re‑write.**
> 2. **Strip** the following noise artefacts:
>
>    * Running page headers or footers (e.g. book title, translator name repeated).
>    * Page numbers.
>    * Line‑scan artefacts like “—  3  —”.
>    * Consecutive blank lines (> 2).
> 3. **Preserve** any original book divisions (Tablets, Books, Cantos, Chapters). Mark them with `##` level‑2 headings.
> 4. **Do NOT modernise spelling**—keep translator’s diction intact.
> 5. **Metadata** – prepend a YAML block **exactly** like:
>
>    ```yaml
>    ---
>    work_id: "ILIAD"              # short code, ALL‑CAPS, no spaces
>    title: "Iliad"
>    culture: "Greek"
>    original_language: "grc"
>    date_composed: "-0750"
>    translator: "Samuel Butler"
>    translation_year: 1898
>    source_url: "https://projectgutenberg.org/ebooks/6130"
>    licence: "Public Domain"
>    ---
>    ```
> 6. After YAML, output **pure Markdown** body, starting with the opening section heading.
> 7. Use back‑ticks to preserve any verse indentation **only** where the source displays it.
> 8. End with a single newline—no extra commentary.
>
> **Example call‑and‑response** snippets are included below for reference.

*(Insert example snip if helpful.)*

---

### Usage notes

* For PDF sources: OCR with `pdftotext -layout` *before* feeding to the LLM to preserve line breaks.
* If a text is verse and you want one line per verse, run a pre‑step regex to collapse wrap‑around lines.
* For HTML sources (sacred‑texts, Perseus) pipe through `lynx -dump -nolist` or `pandoc -f html -t plain` to hand the LLM a clean plain‑text payload.

> **Pipeline stub**

```bash
curl -L "$URL" -o raw.txt
cat raw.txt | python send_to_llm.py > work/Iliad.md
```
