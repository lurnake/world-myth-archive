import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BarChart,
  BookOpen,
  Brain,
  ChevronDown,
  Database,
  ExternalLink,
  Filter,
  Globe,
  Hash,
  Info,
  List,
  Loader2,
  Search,
  Settings,
  Sparkles,
  Users,
  X,
  Zap,
} from 'lucide-react';

interface SearchPageProps {
  onNavigateHome: () => void;
}

interface ChunkTags {
  mythType: string[];
  theme: string[];
  archetype: string[];
  social: string[];
  cognitive: string[];
  rite: string[];
  episode: string[];
  proppian: string[];
}

interface IndexedWork {
  id: string;
  title: string;
  culture: string;
  sourceUrl: string | null;
  translator: string | null;
  chunkCount: number;
  tags: ChunkTags;
  provenance: Provenance;
}

interface Provenance {
  rights: string;
  sourceQuality: string;
  completeness: string;
  translationCompleteness: string;
  editorialStatus: string;
  tagReview: string;
  notes: string;
  confidence: number;
}

interface IndexedEntity {
  id: string;
  name: string;
  type?: string;
  culture?: string;
  domains?: string;
  description?: string;
  roleInWork?: string;
  aliases?: string[];
  notes?: string;
  source?: string;
}

interface IndexedChunk {
  id: string;
  sectionTitle: string;
  chunkIndex: number;
  workId: string;
  workTitle: string;
  culture: string;
  sourceUrl: string | null;
  text: string;
  tokenCount: number;
  tags: ChunkTags;
  tagConfidence: Record<keyof ChunkTags, Record<string, number>>;
  provenance: Provenance;
  interpretation: {
    method: string;
    reviewedBy: string;
    caveat: string;
  };
  stableCitation: string;
  bm25Text: string;
  entities: {
    figures: IndexedEntity[];
    creatures: IndexedEntity[];
  };
}

interface GuidedTrail {
  id: string;
  title: string;
  audience: 'curious' | 'scholarly' | 'both';
  description: string;
  query: string;
  tags: string[];
}

interface SearchIndex {
  generatedAt: string;
  stats: {
    workCount: number;
    chunkCount: number;
    taggedChunkCount?: number;
  };
  facets: {
    tags: Record<keyof ChunkTags, string[]>;
  };
  methodology?: {
    sourceTextLayer: string;
    interpretationLayer: string;
    retrievalLayer: string;
    caveat: string;
  };
  guidedTrails?: GuidedTrail[];
  works: IndexedWork[];
  chunks: IndexedChunk[];
}

interface SearchResult extends IndexedChunk {
  score: number;
  excerptHtml: string;
  matchedTerms: string[];
}

const FACET_CONFIG = [
  { id: 'mythTypes', key: 'mythType', label: 'Myth Types', icon: Database },
  { id: 'themes', key: 'theme', label: 'Themes', icon: Sparkles },
  { id: 'archetypes', key: 'archetype', label: 'Archetypes', icon: Users },
  { id: 'functions', key: 'social', label: 'Functions', icon: Hash },
  { id: 'proppian', key: 'proppian', label: 'Proppian', icon: List },
  { id: 'cognitives', key: 'cognitive', label: 'Cognition', icon: Brain },
  { id: 'rites', key: 'rite', label: 'Rites', icon: BookOpen },
  { id: 'episodes', key: 'episode', label: 'Episodes', icon: Globe },
] as const;

type FacetId = typeof FACET_CONFIG[number]['id'];
type SearchMode = 'semantic' | 'lexicon' | 'exact';
type ViewMode = 'results' | 'analysis' | 'network';

const EMPTY_FILTERS: Record<FacetId, string[]> = {
  mythTypes: [],
  themes: [],
  archetypes: [],
  functions: [],
  proppian: [],
  cognitives: [],
  rites: [],
  episodes: [],
};

const SEMANTIC_EXPANSIONS: Record<string, string[]> = {
  afterlife: ['underworld', 'dead', 'death', 'duat', 'hades', 'immortal', 'judgment'],
  creation: ['origin', 'beginning', 'created', 'made', 'born', 'cosmos', 'world'],
  death: ['dead', 'mortality', 'funeral', 'afterlife', 'underworld', 'slain'],
  flood: ['deluge', 'waters', 'rain', 'ark', 'submerged', 'sea'],
  hero: ['champion', 'warrior', 'quest', 'battle', 'victory', 'journey'],
  king: ['sovereign', 'ruler', 'throne', 'lord', 'queen', 'royal'],
  magic: ['spell', 'incantation', 'charm', 'sorcery', 'enchantment'],
  monster: ['serpent', 'dragon', 'giant', 'beast', 'demon', 'creature'],
  transformation: ['metamorphosis', 'changed', 'became', 'shape', 'form'],
  trickster: ['cunning', 'deception', 'deceit', 'clever', 'wily'],
  underworld: ['afterlife', 'hades', 'duat', 'dead', 'death', 'below'],
};

function normalizeLabel(value: string) {
  return value
    .replace(/^(THM|ARCH|FUNC|COG|RITE|EP|MYTHTYPE)_/, '')
    .replace(/^PROPP_\d+_/, '')
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function EntityPill({ entity }: { entity: IndexedEntity }) {
  const detail = entity.roleInWork || entity.description || entity.domains || entity.type || entity.id;
  const tooltip = [
    entity.name,
    entity.id,
    entity.type ? `Type: ${entity.type}` : '',
    entity.culture ? `Culture: ${entity.culture}` : '',
    entity.domains ? `Domains: ${entity.domains}` : '',
    entity.aliases?.length ? `Aliases: ${entity.aliases.join(', ')}` : '',
    entity.roleInWork ? `Role: ${entity.roleInWork}` : '',
    entity.description ? `Description: ${entity.description}` : '',
    entity.notes ? `Notes: ${entity.notes}` : '',
    entity.source ? `Source: ${entity.source}` : '',
  ].filter(Boolean).join('\n');

  return (
    <span
      className="inline-flex max-w-full items-center gap-2 border border-codex-border bg-codex-bg/40 px-2 py-1 text-xs font-mono text-codex-paper/55"
      title={tooltip}
    >
      <Users className="w-3 h-3 text-codex-gold/70 shrink-0" />
      <span className="text-codex-gold/80 shrink-0">{entity.name}</span>
      <span className="truncate text-codex-paper/35">{detail}</span>
    </span>
  );
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function queryTerms(query: string) {
  return Array.from(new Set(query.toLowerCase().match(/[a-z\u00c0-\u024f0-9']{2,}/g) || []));
}

function expandedTerms(terms: string[]) {
  return Array.from(new Set(terms.flatMap((term) => [term, ...(SEMANTIC_EXPANSIONS[term] || [])])));
}

function allTagValues(tags: ChunkTags) {
  return Object.values(tags).flat();
}

function chunkHaystack(chunk: IndexedChunk) {
  return [
    chunk.text,
    chunk.bm25Text,
    chunk.workTitle,
    chunk.culture,
    ...allTagValues(chunk.tags).map(normalizeLabel),
  ].join(' ').toLowerCase();
}

function matchingFilter(chunk: IndexedChunk, activeFilters: Record<FacetId, string[]>) {
  return FACET_CONFIG.every((facet) => {
    const selected = activeFilters[facet.id];
    if (selected.length === 0) return true;
    return selected.some((tag) => chunk.tags[facet.key].includes(tag));
  });
}

function scoreChunk(chunk: IndexedChunk, query: string, mode: SearchMode) {
  const cleanQuery = query.trim().toLowerCase();
  const terms = queryTerms(cleanQuery);
  const semanticTerms = mode === 'semantic' ? expandedTerms(terms) : terms;
  const haystack = chunkHaystack(chunk);
  const text = chunk.text.toLowerCase();
  const tagText = allTagValues(chunk.tags).map(normalizeLabel).join(' ').toLowerCase();
  const bm25Text = chunk.bm25Text?.toLowerCase() || haystack;

  if (!cleanQuery && mode !== 'lexicon') return 0;
  if (mode === 'exact') return text.includes(cleanQuery) ? 100 : 0;

  let score = 0;
  const matched = new Set<string>();

  if (cleanQuery && haystack.includes(cleanQuery)) {
    score += mode === 'lexicon' ? 20 : 35;
    matched.add(cleanQuery);
  }

  for (const term of semanticTerms) {
    if (text.includes(term)) {
      score += terms.includes(term) ? 9 : 4;
      matched.add(term);
    }
    if (bm25Text.includes(term)) {
      score += terms.includes(term) ? 3 : 1;
      matched.add(term);
    }
    if (tagText.includes(term)) {
      score += terms.includes(term) ? 16 : 7;
      matched.add(term);
    }
    if (chunk.workTitle.toLowerCase().includes(term) || chunk.culture.toLowerCase().includes(term)) {
      score += 12;
      matched.add(term);
    }
  }

  if (mode === 'lexicon' && matched.size === 0) return 0;
  if (terms.length > 1 && terms.every((term) => haystack.includes(term))) score += 18;

  return score;
}

function confidenceLabel(value: number) {
  if (value >= 0.85) return 'Scholar-grade';
  if (value >= 0.7) return 'Reviewed';
  if (value >= 0.55) return 'Machine-tagged';
  return 'Needs review';
}

function excerptFor(chunk: IndexedChunk, query: string, matchedTerms: string[]) {
  const lowerText = chunk.text.toLowerCase();
  const cleanQuery = query.trim().toLowerCase();
  const firstMatch = cleanQuery ? lowerText.indexOf(cleanQuery) : -1;
  const termMatch = matchedTerms.map((term) => lowerText.indexOf(term)).find((index) => index >= 0) ?? -1;
  const anchor = firstMatch >= 0 ? firstMatch : termMatch >= 0 ? termMatch : 0;
  const start = Math.max(0, anchor - 260);
  const end = Math.min(chunk.text.length, anchor + 520);
  const prefix = start > 0 ? '...' : '';
  const suffix = end < chunk.text.length ? '...' : '';
  const rawExcerpt = `${prefix}${chunk.text.slice(start, end)}${suffix}`;
  const highlightTerms = Array.from(new Set([cleanQuery, ...matchedTerms].filter((term) => term.length > 1))).slice(0, 8);

  if (highlightTerms.length === 0) return escapeHtml(rawExcerpt);

  const pattern = new RegExp(`(${highlightTerms.map(escapeRegExp).join('|')})`, 'gi');
  return escapeHtml(rawExcerpt).replace(pattern, '<mark class="bg-codex-gold/20 text-codex-gold">$1</mark>');
}

const SearchPage: React.FC<SearchPageProps> = ({ onNavigateHome }) => {
  const [searchIndex, setSearchIndex] = useState<SearchIndex | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<SearchMode>('semantic');
  const [selectedWorkId, setSelectedWorkId] = useState('all');
  const [selectedAudience, setSelectedAudience] = useState<'all' | 'curious' | 'scholarly'>('all');
  const [minimumConfidence, setMinimumConfidence] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<FacetId, string[]>>(EMPTY_FILTERS);
  const [viewMode, setViewMode] = useState<ViewMode>('results');
  const [showFilters, setShowFilters] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [facetSearch, setFacetSearch] = useState<Record<FacetId, string>>({
    mythTypes: '',
    themes: '',
    archetypes: '',
    functions: '',
    proppian: '',
    cognitives: '',
    rites: '',
    episodes: '',
  });
  const [expandedFacets, setExpandedFacets] = useState<Record<FacetId, boolean>>({
    mythTypes: false,
    themes: false,
    archetypes: false,
    functions: false,
    proppian: false,
    cognitives: false,
    rites: false,
    episodes: false,
  });
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetch('/search-index.json')
      .then((response) => {
        if (!response.ok) throw new Error(`Search index returned ${response.status}`);
        return response.json() as Promise<SearchIndex>;
      })
      .then((index) => {
        if (isMounted) setSearchIndex(index);
      })
      .catch((error: unknown) => {
        if (isMounted) setLoadError(error instanceof Error ? error.message : 'Unable to load search index');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const facetValues = useMemo(() => {
    if (!searchIndex) return EMPTY_FILTERS;

    return Object.fromEntries(
      FACET_CONFIG.map((facet) => [
        facet.id,
        (searchIndex.facets.tags[facet.key] || []).sort(),
      ])
    ) as Record<FacetId, string[]>;
  }, [searchIndex]);

  const works = searchIndex?.works || [];
  const isIndexReady = Boolean(searchIndex && !loadError);

  const runSearch = () => {
    if (!searchIndex) return;

    setIsSearching(true);
    setHasSearched(true);

    window.setTimeout(() => {
      const terms = expandedTerms(queryTerms(searchQuery));
      const results = searchIndex.chunks
        .filter((chunk) => selectedWorkId === 'all' || chunk.workId === selectedWorkId)
        .filter((chunk) => chunk.provenance.confidence >= minimumConfidence)
        .filter((chunk) => matchingFilter(chunk, activeFilters))
        .map((chunk) => {
          const score = scoreChunk(chunk, searchQuery, searchMode);
          const matchedTerms = terms.filter((term) => chunkHaystack(chunk).includes(term)).slice(0, 8);
          return {
            ...chunk,
            score,
            matchedTerms,
            excerptHtml: excerptFor(chunk, searchQuery, matchedTerms),
          };
        })
        .filter((result) => result.score > 0 || (!searchQuery.trim() && Object.values(activeFilters).some((values) => values.length > 0)))
        .sort((a, b) => b.score - a.score || a.workTitle.localeCompare(b.workTitle))
        .slice(0, 60);

      setSearchResults(results);
      setIsSearching(false);
    }, 40);
  };

  const toggleFilter = (facetId: FacetId, value: string) => {
    setActiveFilters((previous) => ({
      ...previous,
      [facetId]: previous[facetId].includes(value)
        ? previous[facetId].filter((item) => item !== value)
        : [...previous[facetId], value],
    }));
  };

  const clearFilters = () => {
    setActiveFilters(EMPTY_FILTERS);
    setSelectedWorkId('all');
    setMinimumConfidence(0);
  };

  const startTrail = (trail: GuidedTrail) => {
    setSearchQuery(trail.query);
    setSearchMode('semantic');
    setSelectedAudience(trail.audience === 'scholarly' ? 'scholarly' : trail.audience === 'curious' ? 'curious' : 'all');
    setActiveFilters((previous) => {
      const next = { ...EMPTY_FILTERS };
      for (const facet of FACET_CONFIG) {
        next[facet.id] = trail.tags.filter((tag) => (searchIndex?.facets.tags[facet.key] || []).includes(tag));
      }
      return Object.values(next).some((values) => values.length) ? next : previous;
    });
    window.setTimeout(runSearch, 0);
  };

  const visibleTrails = (searchIndex?.guidedTrails || []).filter((trail) => (
    selectedAudience === 'all' || trail.audience === selectedAudience || trail.audience === 'both'
  ));

  const resultCountsByWork = useMemo(() => {
    const counts = new Map<string, number>();
    for (const result of searchResults) counts.set(result.workTitle, (counts.get(result.workTitle) || 0) + 1);
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [searchResults]);

  const frequentTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const result of searchResults) {
      for (const tag of [...result.tags.mythType, ...result.tags.theme, ...result.tags.archetype, ...result.tags.episode, ...result.tags.proppian]) {
        const label = normalizeLabel(tag);
        counts.set(label, (counts.get(label) || 0) + 1);
      }
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 18);
  }, [searchResults]);

  return (
    <div className="min-h-screen bg-codex-bg text-codex-paper font-serif selection:bg-codex-gold/30 selection:text-codex-gold">
      <header className="sticky top-0 z-40 bg-codex-bg/90 backdrop-blur-md border-b border-codex-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-6 min-w-0">
              <h1 className="text-xl font-display tracking-widest text-codex-gold uppercase shrink-0">
                Archive Search
              </h1>
              <span className="text-xs font-mono text-codex-paper/40 border-l border-codex-border pl-6 py-1 truncate">
                {isIndexReady
                  ? `${searchIndex?.stats.workCount} TEXTS / ${searchIndex?.stats.chunkCount} LOCAL CHUNKS`
                  : loadError
                    ? 'INDEX UNAVAILABLE'
                    : 'LOADING LOCAL INDEX'}
              </span>
            </div>

            <div className="flex items-center gap-6 shrink-0">
              <div className="flex items-center border border-codex-border bg-codex-obsidian/50">
                {[
                  { id: 'results' as ViewMode, icon: <List className="w-4 h-4" /> },
                  { id: 'analysis' as ViewMode, icon: <BarChart className="w-4 h-4" /> },
                  { id: 'network' as ViewMode, icon: <Globe className="w-4 h-4" /> },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id)}
                    className={`p-2 transition-colors ${
                      viewMode === mode.id
                        ? 'bg-codex-gold text-codex-bg'
                        : 'text-codex-paper/40 hover:text-codex-gold hover:bg-codex-gold/5'
                    }`}
                    title={`${mode.id.charAt(0).toUpperCase() + mode.id.slice(1)} View`}
                  >
                    {mode.icon}
                  </button>
                ))}
              </div>

              <button
                onClick={onNavigateHome}
                className="group flex items-center gap-2 text-xs font-mono tracking-widest text-codex-paper/60 hover:text-codex-gold transition-colors"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                RETURN
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="border-b border-codex-border bg-codex-obsidian/30">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex gap-1 mb-6">
            {[
              { id: 'semantic' as SearchMode, icon: <Zap className="w-3 h-3" />, label: 'Semantic' },
              { id: 'lexicon' as SearchMode, icon: <Database className="w-3 h-3" />, label: 'Lexicon' },
              { id: 'exact' as SearchMode, icon: <Search className="w-3 h-3" />, label: 'Exact' },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSearchMode(mode.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-display tracking-wider uppercase transition-all border-t border-l border-r ${
                  searchMode === mode.id
                    ? 'border-codex-gold text-codex-gold bg-codex-gold/5'
                    : 'border-transparent text-codex-paper/40 hover:text-codex-paper border-b border-b-codex-border'
                }`}
              >
                {mode.icon}
                <span>{mode.label}</span>
              </button>
            ))}
            <div className="flex-1 border-b border-codex-border" />
          </div>

          <div className="mb-6 grid lg:grid-cols-[1fr_auto] gap-4 items-start">
            <div className="flex flex-wrap gap-2">
              {visibleTrails.slice(0, 6).map((trail) => (
                <button
                  key={trail.id}
                  onClick={() => startTrail(trail)}
                  className="group text-left max-w-[260px] border border-codex-border bg-codex-bg/70 px-4 py-3 hover:border-codex-gold/50 transition-colors"
                  title={trail.description}
                >
                  <span className="block text-xs font-display text-codex-gold uppercase tracking-wider truncate">{trail.title}</span>
                  <span className="block text-xs text-codex-paper/45 font-serif mt-1 line-clamp-2">{trail.description}</span>
                </button>
              ))}
            </div>

            <div className="flex border border-codex-border bg-codex-bg/70">
              {[
                { id: 'all' as const, label: 'All' },
                { id: 'curious' as const, label: 'Curious' },
                { id: 'scholarly' as const, label: 'Scholar' },
              ].map((audience) => (
                <button
                  key={audience.id}
                  onClick={() => setSelectedAudience(audience.id)}
                  className={`px-3 py-2 text-xs font-mono uppercase transition-colors ${
                    selectedAudience === audience.id
                      ? 'bg-codex-gold text-codex-bg'
                      : 'text-codex-paper/50 hover:text-codex-gold'
                  }`}
                >
                  {audience.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative group">
            <div className={`absolute inset-0 bg-codex-gold/5 blur-xl transition-opacity duration-500 ${isSearching ? 'opacity-100' : 'opacity-0'}`} />
            <div className="relative flex items-center">
              <Search className="absolute left-6 w-5 h-5 text-codex-gold/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && runSearch()}
                placeholder={
                  searchMode === 'semantic'
                    ? "Query the conceptual space, e.g. 'heroes who face mortality'"
                    : searchMode === 'lexicon'
                      ? "Search controlled tags, e.g. 'underworld journey'"
                      : "Find an exact phrase in the translated texts"
                }
                className="w-full pl-16 pr-32 py-6 bg-codex-bg border border-codex-border focus:border-codex-gold focus:outline-none text-lg font-serif text-codex-paper placeholder:text-codex-paper/20 transition-colors"
              />
              <button
                onClick={runSearch}
                disabled={!isIndexReady || isSearching || (!searchQuery.trim() && Object.values(activeFilters).every((values) => values.length === 0))}
                className="absolute right-2 px-6 py-3 bg-codex-gold hover:bg-codex-gold-dim disabled:bg-codex-border disabled:text-codex-paper/20 text-codex-bg font-display tracking-widest uppercase text-xs transition-colors"
              >
                {isSearching ? 'Scanning...' : 'Search'}
              </button>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-start gap-6">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-xs font-mono text-codex-paper/40 hover:text-codex-gold transition-colors"
            >
              <Settings className="w-3 h-3" />
              ADVANCED PARAMETERS
              <ChevronDown className={`w-3 h-3 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </button>

            <div className="text-xs font-mono text-codex-paper/40 text-right">
              {searchMode === 'semantic' && 'LOCAL_WEIGHTED_LEXICAL_SEMANTICS'}
              {searchMode === 'lexicon' && 'CONTROLLED_VOCABULARY_MATCH'}
              {searchMode === 'exact' && 'TRANSLATION_LITERAL_MATCH'}
            </div>
          </div>

          {showAdvanced && (
            <div className="mt-4 p-6 bg-codex-bg border border-codex-border grid md:grid-cols-4 gap-6 animate-fade-in">
              <div className="space-y-2">
                <label className="text-xs font-mono text-codex-gold uppercase">Target Corpus</label>
                <select
                  value={selectedWorkId}
                  onChange={(event) => setSelectedWorkId(event.target.value)}
                  className="w-full bg-codex-obsidian border border-codex-border p-2 text-sm text-codex-paper focus:border-codex-gold outline-none font-serif"
                >
                  <option value="all">All Collections</option>
                  {works.map((work) => (
                    <option key={work.id} value={work.id}>{work.title}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-codex-gold uppercase">Loaded Index</label>
                <div className="text-sm text-codex-paper/60 font-mono border border-codex-border bg-codex-obsidian px-3 py-2">
                  {searchIndex ? new Date(searchIndex.generatedAt).toLocaleString() : 'Pending'}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-codex-gold uppercase">Editorial Confidence</label>
                <select
                  value={minimumConfidence}
                  onChange={(event) => setMinimumConfidence(Number(event.target.value))}
                  className="w-full bg-codex-obsidian border border-codex-border p-2 text-sm text-codex-paper focus:border-codex-gold outline-none font-serif"
                >
                  <option value={0}>All statuses</option>
                  <option value={0.55}>Machine-tagged+</option>
                  <option value={0.7}>Reviewed+</option>
                  <option value={0.85}>Scholar-grade</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-codex-gold uppercase">Controls</label>
                <button
                  onClick={clearFilters}
                  className="w-full border border-codex-border bg-codex-obsidian px-3 py-2 text-xs font-mono text-codex-paper/60 hover:border-codex-gold hover:text-codex-gold transition-colors"
                >
                  CLEAR FILTERS
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex h-[calc(100vh-300px)] min-h-[560px]">
        <aside className={`${showFilters ? 'w-80' : 'w-0'} transition-all duration-300 border-r border-codex-border bg-codex-bg/50 overflow-hidden flex flex-col`}>
          <div className="p-6 border-b border-codex-border flex justify-between items-center">
            <h2 className="font-display text-sm text-codex-gold uppercase tracking-widest">Filters</h2>
            <button onClick={() => setShowFilters(false)} className="text-codex-paper/40 hover:text-codex-paper">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
            {FACET_CONFIG.map((facet) => {
              const Icon = facet.icon;
              const filterText = facetSearch[facet.id].trim().toLowerCase();
              const allValues = facetValues[facet.id];
              const filteredValues = allValues.filter((value) => normalizeLabel(value).toLowerCase().includes(filterText) || value.toLowerCase().includes(filterText));
              const values = expandedFacets[facet.id] || filterText ? filteredValues : filteredValues.slice(0, 8);

              return (
                <div key={facet.id}>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <h3 className="flex items-center gap-2 font-display text-xs text-codex-paper/60 uppercase tracking-wide">
                      <Icon className="w-3 h-3" />
                      {facet.label}
                    </h3>
                    <span className="text-[10px] font-mono text-codex-paper/30">{filteredValues.length}</span>
                  </div>
                  <input
                    value={facetSearch[facet.id]}
                    onChange={(event) => setFacetSearch((previous) => ({ ...previous, [facet.id]: event.target.value }))}
                    placeholder={`Find ${facet.label.toLowerCase()}...`}
                    className="mb-3 w-full bg-codex-obsidian border border-codex-border px-2 py-1.5 text-xs text-codex-paper/70 outline-none focus:border-codex-gold"
                  />
                  <div className="space-y-2 pl-2 border-l border-codex-border/50">
                    {values.map((value) => (
                      <label key={value} className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center mt-1">
                          <input
                            type="checkbox"
                            className="peer appearance-none w-3 h-3 border border-codex-border bg-codex-obsidian checked:bg-codex-gold checked:border-codex-gold transition-colors"
                            checked={activeFilters[facet.id].includes(value)}
                            onChange={() => toggleFilter(facet.id, value)}
                          />
                        </div>
                        <span className="text-sm text-codex-paper/60 group-hover:text-codex-paper transition-colors leading-tight">
                          {normalizeLabel(value)}
                        </span>
                      </label>
                    ))}
                  </div>
                  {filteredValues.length > 8 && !filterText && (
                    <button
                      onClick={() => setExpandedFacets((previous) => ({ ...previous, [facet.id]: !previous[facet.id] }))}
                      className="mt-3 text-xs font-mono text-codex-gold/60 hover:text-codex-gold transition-colors"
                    >
                      {expandedFacets[facet.id] ? 'SHOW LESS' : `SHOW ALL ${filteredValues.length}`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-codex-bg relative">
          {!showFilters && (
            <button
              onClick={() => setShowFilters(true)}
              className="absolute top-4 left-4 z-10 p-2 bg-codex-bg border border-codex-border hover:border-codex-gold text-codex-paper/60 hover:text-codex-gold transition-colors"
            >
              <Filter className="w-4 h-4" />
            </button>
          )}

          {viewMode === 'results' && (
            <div className="max-w-4xl mx-auto p-8">
              {!isIndexReady && (
                <div className="text-center py-24 opacity-60">
                  <Loader2 className="w-10 h-10 text-codex-gold mx-auto mb-6 animate-spin" />
                  <p className="font-display text-codex-paper tracking-widest">
                    {loadError || 'LOADING LOCAL CORPUS INDEX'}
                  </p>
                </div>
              )}

              {isIndexReady && searchResults.length === 0 && !isSearching && (
                <div className="text-center py-24 opacity-40">
                  <div className="w-24 h-24 border border-codex-border rotate-45 mx-auto mb-8 flex items-center justify-center">
                    <Search className="w-8 h-8 text-codex-paper -rotate-45" />
                  </div>
                  <p className="font-display text-codex-paper tracking-widest">
                    {hasSearched ? 'NO LOCAL MATCHES FOUND' : 'ARCHIVE AWAITING QUERY'}
                  </p>
                </div>
              )}

              {isSearching && (
                <div className="text-center py-24">
                  <Loader2 className="w-10 h-10 text-codex-gold mx-auto mb-6 animate-spin" />
                  <p className="font-display text-codex-paper/60 tracking-widest">SCANNING TEXTUAL STRATA</p>
                </div>
              )}

              {!isSearching && searchResults.length > 0 && (
                <div className="space-y-6">
                  <div className="text-xs font-mono text-codex-paper/40 uppercase tracking-widest">
                    {searchResults.length} ranked passages / automated tags visible as interpretive aids
                  </div>

                  {searchResults.map((result) => (
                    <article
                      key={result.id}
                      className="group relative p-8 bg-codex-obsidian/20 border border-codex-border hover:border-codex-gold/50 transition-all duration-500"
                    >
                      <div className="flex items-baseline justify-between gap-4 mb-4 border-b border-codex-border/50 pb-4">
                        <div className="min-w-0">
                          <h3 className="font-display text-codex-gold text-lg truncate">{result.sectionTitle}</h3>
                          <p className="text-xs font-mono text-codex-paper/40 uppercase mt-1">
                            {result.workTitle} / {result.culture} / {result.stableCitation}
                          </p>
                          <p className="text-xs font-mono text-codex-paper/35 uppercase mt-2 flex flex-wrap gap-x-3 gap-y-1">
                            <span>{confidenceLabel(result.provenance.confidence)} {Math.round(result.provenance.confidence * 100)}%</span>
                            <span>{result.provenance.completeness.replace(/_/g, ' ')}</span>
                            <span>{result.provenance.rights.replace(/_/g, ' ')}</span>
                          </p>
                        </div>
                        <div className="font-mono text-xs text-codex-gold/60 shrink-0">
                          {Math.min(99, Math.round(result.score))}% MATCH
                        </div>
                      </div>

                      <div
                        className="text-codex-paper/80 leading-relaxed font-serif text-lg mb-6"
                        dangerouslySetInnerHTML={{ __html: result.excerptHtml }}
                      />

                      <div className="flex flex-wrap gap-2">
                        {[...result.tags.mythType, ...result.tags.theme, ...result.tags.archetype, ...result.tags.social, ...result.tags.episode, ...result.tags.proppian].slice(0, 12).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 border border-codex-border text-codex-paper/50 font-mono hover:border-codex-gold/30 hover:text-codex-gold transition-colors"
                            title={`Automated tag confidence: ${Math.round((Object.values(result.tagConfidence).find((group) => group[tag])?.[tag] || result.provenance.confidence) * 100)}%`}
                          >
                            {normalizeLabel(tag)}
                          </span>
                        ))}
                      </div>

                      {(result.entities.figures.length > 0 || result.entities.creatures.length > 0) && (
                        <div className="mt-4 space-y-2">
                          <div className="text-xs font-mono uppercase tracking-widest text-codex-gold/70">
                            Entities in Passage
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {[...result.entities.figures, ...result.entities.creatures].slice(0, 8).map((entity) => (
                              <EntityPill key={entity.id} entity={entity} />
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-5 pt-4 border-t border-codex-border/50 flex items-start gap-3 text-xs text-codex-paper/40 font-mono leading-relaxed">
                        <Info className="w-4 h-4 text-codex-gold/60 shrink-0 mt-0.5" />
                        <p>
                          {result.interpretation.caveat} Source: {result.provenance.sourceQuality.replace(/_/g, ' ')}; tag review: {result.provenance.tagReview.replace(/_/g, ' ')}.
                        </p>
                      </div>

                      {result.sourceUrl && (
                        <a
                          href={result.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-codex-gold"
                          title="Open source text"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {viewMode === 'analysis' && (
            <div className="p-8 max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 border border-codex-border bg-codex-obsidian/20">
                  <h3 className="font-display text-codex-gold mb-6 uppercase tracking-widest text-sm">Distribution by Work</h3>
                  <div className="space-y-4">
                    {resultCountsByWork.length === 0 && (
                      <p className="text-sm text-codex-paper/40 font-mono">Run a search to populate this panel.</p>
                    )}
                    {resultCountsByWork.map(([title, count]) => {
                      const percent = Math.max(8, Math.round((count / Math.max(1, searchResults.length)) * 100));
                      return (
                        <div key={title} className="group">
                          <div className="flex justify-between text-sm text-codex-paper/60 mb-1 gap-4">
                            <span className="truncate">{title}</span>
                            <span className="font-mono">{count}</span>
                          </div>
                          <div className="h-1 bg-codex-border w-full overflow-hidden">
                            <div className="h-full bg-codex-gold/60" style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-6 border border-codex-border bg-codex-obsidian/20">
                  <h3 className="font-display text-codex-gold mb-6 uppercase tracking-widest text-sm">Taxonomy Frequency</h3>
                  <div className="flex flex-wrap gap-2">
                    {frequentTags.length === 0 && (
                      <p className="text-sm text-codex-paper/40 font-mono">Matched tags will appear here.</p>
                    )}
                    {frequentTags.map(([tag, count]) => (
                      <div key={tag} className="px-3 py-2 border border-codex-border text-codex-paper/60 text-sm flex gap-2 items-center">
                        <span>{tag}</span>
                        <span className="text-xs font-mono text-codex-gold">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 border border-codex-border bg-codex-obsidian/20 md:col-span-2">
                  <h3 className="font-display text-codex-gold mb-4 uppercase tracking-widest text-sm">Methodology Notes</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm text-codex-paper/55 font-serif leading-relaxed">
                    <p>{searchIndex?.methodology?.sourceTextLayer}</p>
                    <p>{searchIndex?.methodology?.interpretationLayer}</p>
                    <p>{searchIndex?.methodology?.retrievalLayer}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'network' && (
            <div className="h-full flex items-center justify-center opacity-50">
              <div className="text-center max-w-md px-6">
                <div className="w-32 h-32 border border-dashed border-codex-gold rounded-full mx-auto mb-6 animate-spin-slow" />
                <p className="font-display text-codex-paper tracking-widest mb-3">GRAPH LAYER NOT YET MATERIALIZED</p>
                <p className="text-sm text-codex-paper/50 font-serif">
                  The local index is ready for motif co-occurrence edges; the current build focuses on passage retrieval first.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchPage;
