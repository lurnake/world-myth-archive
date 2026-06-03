---
# --- Core Information ---

# Document Identification & Basic Metadata
doc_id: UNIQUE_MYTH_CODE # REQUIRED: A unique identifier for this document (e.g., GRK_COSMOGONY_HESIOD_01)
title: "Display Title of the Myth" # REQUIRED: The primary human-readable title for this entry.
title_original: "Original Title (if known/different)" # Optional: Title in the original language or source text.
culture_group: CodeFromCulturesList # REQUIRED: Code representing the primary culture (e.g., Greek, Norse, Yoruba). Link to a controlled list/ontology if possible.
language_original: ISO-639-Code # Optional: ISO 639-1 or 639-3 code for the original language (e.g., 'grc' for Ancient Greek, 'non' for Old Norse).
summary: "A brief (1-3 sentence) abstract or summary of the myth's content." # REQUIRED: For quick previews and understanding.

# Source & Provenance (Crucial for Academic Use)
source_primary: # Information about the original source text/tradition
  title: "Title of Ancient/Primary Source" # Optional: E.g., "Theogony", "Poetic Edda", "Oral Tradition Recording"
  author: "Author/Compiler (if known)" # Optional: E.g., "Hesiod", "Snorri Sturluson", "Collector Name"
  approx_date: "Date/Period of Original Source" # Optional: E.g., "c. 700 BCE", "13th Century CE", "Collected 1950"
source_document: # Information about the specific version/translation used in *this* .md file
  text_title: "Title of Book/Article Containing This Version" # REQUIRED: E.g., "Hesiod: Theogony, Works and Days, Shield"
  translator_author_editor: "Translator/Author/Editor Name(s)" # REQUIRED if applicable: E.g., "M. L. West", "A. S. Kline"
  publisher: "Publisher Name" # Optional: E.g., "Oxford University Press"
  publication_date: YYYY # Optional: Year of publication for this specific version.
  url_doi: "URL or DOI if applicable" # Optional: Link to online source or digital object identifier.
  notes: "Brief notes on this specific version (e.g., specific edition, translation focus)." # Optional

# Core Categorization Tags (Using Controlled Vocabularies)
myth_type_tags: # REQUIRED: At least one type. Use codes from myth_type_tags.csv
  - MYTHTYPE_COSMOGONY
  # - MYTHTYPE_THEOGONY

theme_tags: # REQUIRED: Key themes. Use codes from theme_tags.csv
  - THM_CREATION
  - THM_ORDER_VS_CHAOS
  # - THM_DIVINE_COMBAT

# --- Enhanced Information ---

# Deeper Analytical Tags (Using Controlled Vocabularies)
character_archetype_tags: # Optional: Key archetypes present. Use codes from character_archetype_tags.csv
  # - ARCH_SKY_FATHER
  # - ARCH_EARTH_MOTHER
social_role_tags: # Optional: Relevant socio-cultural roles. Use codes from social_role_tags.csv
  # - FUNC_SOVEREIGNTY_MAGICAL
cognitive_function_tags: # Optional: Relevant cognitive/evolutionary functions. Use codes from cognitive_function_tags.csv
  # - COG_AGENCY_DETECTION
  # - COG_STATUS_HIERARCHY_LEGITIMATION
rite_tags: # Optional: If the myth centrally describes or explains a ritual. Use codes from rite_tags.csv
  # - RITE_SACRIFICE
myth_episode_tags: # Optional: Highlight major episodes covered in this text. Use codes from myth_episode.csv
  # - EP_PRIMORDIAL_CHAOS
  # - EP_THEOMACHY

# Linked Entities (Using Controlled Vocabulary Codes/IDs)
key_deities: # Optional: List codes/IDs of major deities involved. Link to deities.csv
  # - DEITY_ZEUS_GRK
  # - DEITY_GAIA_GRK
key_creatures: # Optional: List codes/IDs of major creatures involved. Link to creatures.csv
  # - CRT_CYCLOPES_GRK
key_places: # Optional: List codes/IDs of major locations involved. Link to places.csv
  # - PLC_TARTARUS_GRK

# Relationships & Context
related_myths: # Optional: List doc_id's of closely related myths in the archive.
  # - GRK_TITANOMACHY_HESIOD_01
keywords: # Optional: Free-text keywords for additional searchability.
  - "Succession Myth"
  - "Primordial Gods"
  - "Castration"

# Archive Management
date_added: YYYY-MM-DD # Optional: Date this entry was added to the archive.
date_updated: YYYY-MM-DD # Optional: Date this entry was last significantly updated.
status: draft # Optional: Workflow status (e.g., draft, review, complete, published).
internal_notes: "Curator/editor notes about this document, issues, translation choices etc." # Optional: Not typically for public display.

---

## Explanation of Fields:

**Core Information:**

*   `doc_id`: **Essential.** Must be unique. A structured format (e.g., `CULTURE_TOPIC_SOURCE_SEQ`) helps.
*   `title`: **Essential.** Clear display name.
*   `title_original`: Useful for scholarly reference.
*   `culture_group`: **Essential.** Primary filter. Needs a controlled list.
*   `language_original`: Important context for linguistic analysis or finding original texts. Use standard codes.
*   `summary`: **Essential.** Allows users to quickly grasp the content.
*   `source_primary`: Crucial for tracing the myth's origins. Even if approximate ("Oral Tradition, collected X"), it provides context.
*   `source_document`: **Essential for academic rigor.** Cites the *exact* text file you are creating, enabling verification and acknowledging translators/editors.
*   `myth_type_tags`: **Essential.** High-level categorization. Use your lexicon codes.
*   `theme_tags`: **Essential.** Core subjects of the myth. Use your lexicon codes.

**Enhanced Information (Super Useful):**

*   **Analytical Tags (`character_archetype_tags`, `social_role_tags`, `cognitive_function_tags`, `rite_tags`, `myth_episode_tags`):** This is where the power of your controlled vocabularies comes in for deep analysis and finding patterns across the archive. Use the codes from your CSVs. Tagging the *entire* document provides an overview, complementing potential chunk-level tagging later.
*   **Linked Entities (`key_deities`, `key_creatures`, `key_places`):** Allows building knowledge graphs, finding all myths featuring a specific entity, etc. Use the unique IDs/codes you define in your entity CSVs.
*   `related_myths`: Creates explicit links between narratives (e.g., different versions, prequel/sequel myths). Uses the `doc_id`.
*   `keywords`: Catches nuances or specific terms not covered by controlled vocabularies. Good for flexible searching.
*   **Archive Management (`date_added`, `date_updated`, `status`, `internal_notes`):** Helpful for maintaining the archive, tracking progress, and internal communication.

**Why this structure is useful:**

*   **Structured Data:** YAML is machine-readable, allowing you to easily parse this metadata for database ingestion, website generation, or analytical scripts.
*   **Comprehensive:** Covers identification, context, source, analysis, and relationships.
*   **Leverages Lexicons:** Directly integrates your controlled vocabularies for consistent tagging.
*   **Academic Soundness:** Emphasis on sourcing (`source_primary`, `source_document`) is critical.
*   **Flexibility:** Optional fields allow for varying levels of detail depending on available information. Lists (`- item`) accommodate multiple tags/entities gracefully.

This frontmatter provides a solid foundation. You can adapt it based on the specific needs and focus of the World Myth Archive as it develops.