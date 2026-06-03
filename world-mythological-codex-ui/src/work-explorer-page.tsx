import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Database,
  ExternalLink,
  Eye,
  EyeOff,
  Hash,
  Info,
  Layers,
  Search,
  Tag,
  Users,
} from 'lucide-react';

interface WorkExplorerProps {
  initialWorkId?: string | null;
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

interface IndexedWork {
  id: string;
  title: string;
  culture: string;
  languageOriginal: string | null;
  summary: string;
  sourceUrl: string | null;
  sourceTitle: string | null;
  translator: string | null;
  chunkCount: number;
  tags: ChunkTags;
  provenance: Provenance;
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
  stableCitation: string;
  sectionTitle: string;
  wordStart?: number;
  wordEnd?: number;
  chunkIndex: number;
  workId: string;
  workTitle?: string;
  culture?: string;
  sourceUrl?: string | null;
  text: string;
  tokenCount: number;
  tags: ChunkTags;
  tagConfidence: Record<keyof ChunkTags, Record<string, number>>;
  workTags?: ChunkTags;
  provenance: Provenance;
  entities: {
    figures: IndexedEntity[];
    creatures: IndexedEntity[];
  };
  interpretation: {
    caveat: string;
    method: string;
    reviewedBy: string;
  };
  bm25Text?: string;
}

interface SearchIndex {
  works: IndexedWork[];
  chunks: IndexedChunk[];
}

type WorkView = 'work' | 'passages' | 'entities';

interface EntityOccurrence {
  id: string;
  entity: IndexedEntity;
  category: 'figure' | 'creature';
  count: number;
  chunkIds: Set<string>;
  citations: string[];
  sections: string[];
}

const TAG_GROUPS: Array<{ key: keyof ChunkTags; label: string }> = [
  { key: 'mythType', label: 'Myth Type' },
  { key: 'theme', label: 'Theme' },
  { key: 'archetype', label: 'Archetype' },
  { key: 'social', label: 'Function' },
  { key: 'cognitive', label: 'Cognition' },
  { key: 'rite', label: 'Rite' },
  { key: 'episode', label: 'Episode' },
  { key: 'proppian', label: 'Propp' },
];

function normalizeLabel(value: string) {
  return value
    .replace(/^(THM|ARCH|FUNC|COG|RITE|EP|MYTHTYPE)_/, '')
    .replace(/^PROPP_\d+_/, '')
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function compact(value: string) {
  return value.replace(/_/g, ' ');
}

function entitySourceLabel(source?: string) {
  if (!source) return '';
  if (source.includes('csv')) return 'Lexicon';
  if (source === 'csv') return 'Lexicon';
  if (source.startsWith('frontmatter:')) return 'Work Metadata';
  if (source.startsWith('work-seed:')) return 'Curated Seed';
  return source;
}

function entitySearchText(entities: IndexedEntity[]) {
  return entities
    .flatMap((entity) => [
      entity.name,
      entity.type,
      entity.culture,
      entity.domains,
      entity.description,
      entity.roleInWork,
      entity.notes,
      ...(entity.aliases || []),
    ])
    .filter(Boolean)
    .join(' ');
}

function entitySummary(entities: IndexedEntity[]) {
  if (entities.length === 0) return 'None';
  const names = entities.slice(0, 4).map((entity) => entity.name).join(', ');
  return entities.length > 4 ? `${names}, +${entities.length - 4}` : names;
}

function allChunkEntities(chunk: IndexedChunk) {
  return [
    ...chunk.entities.figures.map((entity) => ({ entity, category: 'figure' as const })),
    ...chunk.entities.creatures.map((entity) => ({ entity, category: 'creature' as const })),
  ];
}

function mergeEntityDetails(current: IndexedEntity, incoming: IndexedEntity) {
  const aliases = Array.from(new Set([...(current.aliases || []), ...(incoming.aliases || [])].filter(Boolean)));
  return {
    ...current,
    ...Object.fromEntries(
      Object.entries(incoming).filter(([, value]) => {
        if (Array.isArray(value)) return value.length > 0;
        return value !== undefined && value !== null && value !== '';
      })
    ),
    aliases,
  };
}

function entityOccurrenceSearchText(occurrence: EntityOccurrence) {
  return [
    occurrence.entity.name,
    occurrence.entity.id,
    occurrence.entity.type,
    occurrence.entity.culture,
    occurrence.entity.domains,
    occurrence.entity.description,
    occurrence.entity.roleInWork,
    occurrence.entity.notes,
    ...(occurrence.entity.aliases || []),
    ...occurrence.citations,
    ...occurrence.sections,
  ].filter(Boolean).join(' ').toLowerCase();
}

function EntityField({ label, value }: { label: string; value?: React.ReactNode }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="min-w-0">
      <div className="text-[10px] font-mono uppercase text-codex-paper/30">{label}</div>
      <div className="mt-1 text-sm text-codex-paper/62 leading-relaxed break-words">{value}</div>
    </div>
  );
}

function EntityCard({ entity }: { entity: IndexedEntity }) {
  const aliases = (entity.aliases || []).filter((alias) => alias && alias !== entity.name);
  const sourceLabel = entitySourceLabel(entity.source);

  return (
    <div className="border border-codex-border bg-codex-bg/35 p-3 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-display text-codex-gold leading-tight">{entity.name}</div>
          <div className="text-xs font-mono text-codex-paper/35 mt-1 break-all">{entity.id}</div>
        </div>
        {sourceLabel && (
          <span className="shrink-0 text-[10px] font-mono uppercase text-codex-paper/30 border border-codex-border px-1.5 py-0.5">
            {sourceLabel}
          </span>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <EntityField label="Type" value={entity.type} />
        <EntityField label="Culture" value={entity.culture} />
        <EntityField label="Domains" value={entity.domains} />
        <EntityField label="Aliases" value={aliases.length ? aliases.join(', ') : undefined} />
      </div>

      <div className="space-y-3">
        <EntityField label="Role In Work" value={entity.roleInWork} />
        <EntityField label="Description" value={entity.description} />
        <EntityField label="Notes" value={entity.notes} />
      </div>
    </div>
  );
}

function MetadataValue({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="min-w-0">
      <div className="text-[10px] font-mono uppercase text-codex-paper/30">{label}</div>
      <div className="mt-1 text-xs font-mono text-codex-paper/55 break-words">{value}</div>
    </div>
  );
}

function ChunkMetadata({ chunk }: { chunk: IndexedChunk }) {
  const wordRange =
    typeof chunk.wordStart === 'number' && typeof chunk.wordEnd === 'number'
      ? `${chunk.wordStart}-${chunk.wordEnd}`
      : null;
  const workTags = chunk.workTags ? Object.values(chunk.workTags).flat() : [];
  const retrievalText = chunk.bm25Text && chunk.bm25Text !== chunk.text ? chunk.bm25Text : null;

  return (
    <div className="border border-codex-border bg-codex-bg/35 p-4 space-y-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetadataValue label="Chunk ID" value={chunk.id} />
        <MetadataValue label="Chunk Index" value={chunk.chunkIndex} />
        <MetadataValue label="Citation" value={chunk.stableCitation} />
        <MetadataValue label="Word Range" value={wordRange} />
        <MetadataValue label="Work" value={chunk.workTitle} />
        <MetadataValue label="Culture" value={chunk.culture} />
        <MetadataValue label="Source Quality" value={compact(chunk.provenance.sourceQuality)} />
        <MetadataValue label="Editorial Status" value={compact(chunk.provenance.editorialStatus)} />
        <MetadataValue label="Tag Review" value={compact(chunk.provenance.tagReview)} />
        <MetadataValue label="Rights" value={compact(chunk.provenance.rights)} />
        <MetadataValue label="Completeness" value={compact(chunk.provenance.completeness)} />
        <MetadataValue label="Translation" value={compact(chunk.provenance.translationCompleteness)} />
      </div>

      {chunk.sourceUrl && (
        <a
          href={chunk.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase text-codex-paper/50 hover:text-codex-gold"
        >
          <ExternalLink className="w-3 h-3" />
          Source URL
        </a>
      )}

      {workTags.length > 0 && (
        <div className="space-y-2">
          <div className="text-[10px] font-mono uppercase text-codex-paper/30">Work Tags On This Chunk Record</div>
          <div className="flex flex-wrap gap-2">
            {workTags.map((tag) => (
              <span key={tag} className="border border-codex-border px-2 py-1 text-xs font-mono text-codex-paper/45">
                {normalizeLabel(tag)}
              </span>
            ))}
          </div>
        </div>
      )}

      {retrievalText && (
        <details className="text-xs font-mono text-codex-paper/45">
          <summary className="cursor-pointer text-codex-gold/70">Retrieval Text</summary>
          <p className="mt-2 whitespace-pre-wrap leading-relaxed">{retrievalText}</p>
        </details>
      )}
    </div>
  );
}

function ToggleButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 border px-3 py-2 text-xs font-mono uppercase transition-colors ${
        active
          ? 'border-codex-gold bg-codex-gold/10 text-codex-gold'
          : 'border-codex-border text-codex-paper/45 hover:border-codex-gold/40 hover:text-codex-paper'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

export default function WorkExplorerPage({ initialWorkId, onNavigateHome }: WorkExplorerProps) {
  const [index, setIndex] = useState<SearchIndex | null>(null);
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(initialWorkId || null);
  const [workView, setWorkView] = useState<WorkView>('work');
  const [query, setQuery] = useState('');
  const [entityQuery, setEntityQuery] = useState('');
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [expandedChunks, setExpandedChunks] = useState<Set<string>>(new Set());
  const [expandedEntityChunks, setExpandedEntityChunks] = useState<Set<string>>(new Set());
  const [expandedMetadataChunks, setExpandedMetadataChunks] = useState<Set<string>>(new Set());
  const [showText, setShowText] = useState(true);
  const [showTags, setShowTags] = useState(true);
  const [showEntities, setShowEntities] = useState(true);
  const [showProvenance, setShowProvenance] = useState(true);
  const [showInterpretation, setShowInterpretation] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch('/search-index.json')
      .then((response) => response.json() as Promise<SearchIndex>)
      .then((data) => {
        if (!mounted) return;
        setIndex(data);
        setSelectedWorkId((current) => current || data.works[0]?.id || null);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (initialWorkId) setSelectedWorkId(initialWorkId);
  }, [initialWorkId]);

  const works = index?.works || [];
  const selectedWork = works.find((work) => work.id === selectedWorkId) || works[0];

  useEffect(() => {
    setSelectedEntityId(null);
    setExpandedChunks(new Set());
    setExpandedEntityChunks(new Set());
    setExpandedMetadataChunks(new Set());
  }, [selectedWorkId]);

  const selectedWorkChunks = useMemo(() => {
    if (!index || !selectedWork) return [];
    return index.chunks.filter((chunk) => chunk.workId === selectedWork.id);
  }, [index, selectedWork]);

  const entityDirectory = useMemo(() => {
    const occurrences = new Map<string, EntityOccurrence>();

    for (const chunk of selectedWorkChunks) {
      for (const { entity, category } of allChunkEntities(chunk)) {
        const existing = occurrences.get(entity.id);
        if (existing) {
          existing.entity = mergeEntityDetails(existing.entity, entity);
          existing.count += 1;
          existing.chunkIds.add(chunk.id);
          if (!existing.citations.includes(chunk.stableCitation)) existing.citations.push(chunk.stableCitation);
          if (!existing.sections.includes(chunk.sectionTitle)) existing.sections.push(chunk.sectionTitle);
          continue;
        }

        occurrences.set(entity.id, {
          id: entity.id,
          entity,
          category,
          count: 1,
          chunkIds: new Set([chunk.id]),
          citations: [chunk.stableCitation],
          sections: [chunk.sectionTitle],
        });
      }
    }

    return Array.from(occurrences.values()).sort((a, b) => b.count - a.count || a.entity.name.localeCompare(b.entity.name));
  }, [selectedWorkChunks]);

  const visibleEntities = useMemo(() => {
    const normalizedQuery = entityQuery.trim().toLowerCase();
    if (!normalizedQuery) return entityDirectory;
    return entityDirectory.filter((occurrence) => entityOccurrenceSearchText(occurrence).includes(normalizedQuery));
  }, [entityDirectory, entityQuery]);

  const selectedEntity = entityDirectory.find((occurrence) => occurrence.id === selectedEntityId) || null;

  const chunks = useMemo(() => {
    if (!selectedWork) return [];
    const normalizedQuery = query.trim().toLowerCase();
    return selectedWorkChunks
      .filter((chunk) => {
        if (!selectedEntityId) return true;
        return allChunkEntities(chunk).some(({ entity }) => entity.id === selectedEntityId);
      })
      .filter((chunk) => {
        if (workView !== 'entities' || selectedEntityId) return true;
        return allChunkEntities(chunk).length > 0;
      })
      .filter((chunk) => {
        if (!normalizedQuery) return true;
        return [
          chunk.text,
          chunk.sectionTitle,
          chunk.stableCitation,
          chunk.id,
          Object.values(chunk.tags).flat().map(normalizeLabel).join(' '),
          Object.values(chunk.workTags || {}).flat().map(normalizeLabel).join(' '),
          entitySearchText(chunk.entities.figures),
          entitySearchText(chunk.entities.creatures),
        ].join(' ').toLowerCase().includes(normalizedQuery);
      });
  }, [query, selectedEntityId, selectedWork, selectedWorkChunks, workView]);

  const aggregateTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const chunk of selectedWorkChunks) {
      for (const tag of Object.values(chunk.tags).flat()) {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      }
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 24);
  }, [selectedWorkChunks]);

  const toggleChunk = (id: string) => {
    setExpandedChunks((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectEntity = (entityId: string) => {
    setSelectedEntityId(entityId);
    setWorkView('entities');
    setShowEntities(true);
  };

  const toggleEntityChunk = (id: string) => {
    setExpandedEntityChunks((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleMetadataChunk = (id: string) => {
    setExpandedMetadataChunks((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!index || !selectedWork) {
    return (
      <div className="min-h-screen bg-codex-bg text-codex-paper flex items-center justify-center">
        <div className="font-display tracking-widest text-codex-gold">LOADING WORK INDEX</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-codex-bg text-codex-paper">
      <header className="sticky top-0 z-40 bg-codex-bg/95 backdrop-blur-md border-b border-codex-border">
        <div className="px-6 py-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4 min-w-0">
            <BookOpen className="w-5 h-5 text-codex-gold shrink-0" />
            <div className="min-w-0">
              <h1 className="font-display text-lg text-codex-gold uppercase tracking-widest truncate">Work Explorer</h1>
              <p className="text-xs font-mono text-codex-paper/40 truncate">
                {selectedWork.title} / {chunks.length} visible chunks / {entityDirectory.length} entities
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateHome}
            className="group flex items-center gap-2 text-xs font-mono tracking-widest text-codex-paper/60 hover:text-codex-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            RETURN
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-[320px_1fr] min-h-[calc(100vh-65px)]">
        <aside className="border-r border-codex-border bg-codex-obsidian/35 p-6 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-codex-gold/50" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={selectedEntity ? `Filter ${selectedEntity.entity.name} passages...` : 'Filter inside work...'}
              className="w-full bg-codex-bg border border-codex-border pl-10 pr-3 py-2 text-sm text-codex-paper outline-none focus:border-codex-gold"
            />
          </div>

          <div className="space-y-3">
            <h2 className="text-xs font-display uppercase tracking-widest text-codex-gold">Explore As</h2>
            <div className="grid grid-cols-3 border border-codex-border bg-codex-bg/60">
              {[
                { id: 'work' as WorkView, label: 'Work', icon: <BookOpen className="w-3 h-3" /> },
                { id: 'passages' as WorkView, label: 'Parts', icon: <Layers className="w-3 h-3" /> },
                { id: 'entities' as WorkView, label: 'Entities', icon: <Users className="w-3 h-3" /> },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setWorkView(mode.id)}
                  className={`flex items-center justify-center gap-1 px-2 py-2 text-[10px] font-mono uppercase transition-colors ${
                    workView === mode.id
                      ? 'bg-codex-gold text-codex-bg'
                      : 'text-codex-paper/45 hover:text-codex-gold'
                  }`}
                  title={`Explore by ${mode.label.toLowerCase()}`}
                >
                  {mode.icon}
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xs font-display uppercase tracking-widest text-codex-gold">Works</h2>
            <div className="max-h-[38vh] overflow-y-auto no-scrollbar border border-codex-border">
              {works.map((work) => (
                <button
                  key={work.id}
                  onClick={() => setSelectedWorkId(work.id)}
                  className={`w-full text-left px-3 py-3 border-b border-codex-border last:border-b-0 transition-colors ${
                    selectedWork.id === work.id
                      ? 'bg-codex-gold/10 text-codex-gold'
                      : 'text-codex-paper/60 hover:bg-codex-gold/5 hover:text-codex-paper'
                  }`}
                >
                  <span className="block text-sm font-display leading-tight">{work.title}</span>
                  <span className="block text-xs font-mono opacity-55 mt-1">{work.culture} / {work.chunkCount} chunks</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xs font-display uppercase tracking-widest text-codex-gold">Visible Layers</h2>
            <div className="grid grid-cols-2 gap-2">
              <ToggleButton active={showText} icon={showText ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />} label="Text" onClick={() => setShowText(!showText)} />
              <ToggleButton active={showTags} icon={<Tag className="w-3 h-3" />} label="Tags" onClick={() => setShowTags(!showTags)} />
              <ToggleButton active={showEntities} icon={<Users className="w-3 h-3" />} label="Entities" onClick={() => setShowEntities(!showEntities)} />
              <ToggleButton active={showProvenance} icon={<Database className="w-3 h-3" />} label="Source" onClick={() => setShowProvenance(!showProvenance)} />
              <ToggleButton active={showInterpretation} icon={<Info className="w-3 h-3" />} label="Caveats" onClick={() => setShowInterpretation(!showInterpretation)} />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xs font-display uppercase tracking-widest text-codex-gold">Entities</h2>
              {selectedEntity && (
                <button
                  onClick={() => setSelectedEntityId(null)}
                  className="text-[10px] font-mono uppercase text-codex-paper/35 hover:text-codex-gold"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="relative">
              <Users className="absolute left-3 top-2.5 w-3 h-3 text-codex-gold/50" />
              <input
                value={entityQuery}
                onChange={(event) => setEntityQuery(event.target.value)}
                placeholder="Find character or entity..."
                className="w-full bg-codex-bg border border-codex-border pl-9 pr-3 py-2 text-xs text-codex-paper outline-none focus:border-codex-gold"
              />
            </div>
            <div className="max-h-[32vh] overflow-y-auto no-scrollbar border border-codex-border">
              {visibleEntities.slice(0, 80).map((occurrence) => (
                <button
                  key={occurrence.id}
                  onClick={() => selectEntity(occurrence.id)}
                  className={`w-full text-left px-3 py-3 border-b border-codex-border last:border-b-0 transition-colors ${
                    selectedEntityId === occurrence.id
                      ? 'bg-codex-gold/10 text-codex-gold'
                      : 'text-codex-paper/60 hover:bg-codex-gold/5 hover:text-codex-paper'
                  }`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-display leading-tight">{occurrence.entity.name}</span>
                    <span className="shrink-0 text-[10px] font-mono text-codex-gold/70">{occurrence.count}</span>
                  </span>
                  <span className="mt-1 block truncate text-[10px] font-mono uppercase opacity-50">
                    {occurrence.category} / {occurrence.entity.type || occurrence.entity.domains || occurrence.entity.id}
                  </span>
                </button>
              ))}
              {visibleEntities.length === 0 && (
                <div className="px-3 py-4 text-xs font-mono text-codex-paper/35">No matching entities.</div>
              )}
            </div>
          </div>
        </aside>

        <main className="overflow-y-auto">
          <section className="border-b border-codex-border bg-codex-bg px-8 py-8">
            <div className="max-w-6xl space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="space-y-3 max-w-3xl">
                  <p className="text-xs font-mono uppercase tracking-widest text-codex-paper/40">{selectedWork.culture} / {selectedWork.languageOriginal || 'language unknown'}</p>
                  <h2 className="text-4xl font-display text-codex-gold">{selectedWork.title}</h2>
                  <p className="text-lg font-serif leading-relaxed text-codex-paper/75">{selectedWork.summary}</p>
                </div>
                {selectedWork.sourceUrl && (
                  <a
                    href={selectedWork.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-codex-border px-4 py-2 text-xs font-mono uppercase text-codex-paper/60 hover:border-codex-gold hover:text-codex-gold transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Source
                  </a>
                )}
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                {[
                  ['Chunks', selectedWork.chunkCount],
                  ['Entities', entityDirectory.length],
                  ['Confidence', `${Math.round(selectedWork.provenance.confidence * 100)}%`],
                  ['Completeness', compact(selectedWork.provenance.completeness)],
                  ['Review', compact(selectedWork.provenance.tagReview)],
                ].map(([label, value]) => (
                  <div key={label} className="border border-codex-border px-4 py-3">
                    <div className="text-xs font-mono text-codex-paper/40 uppercase">{label}</div>
                    <div className="text-lg font-display text-codex-paper mt-1 capitalize">{value}</div>
                  </div>
                ))}
              </div>

              {showProvenance && (
                <div className="border border-codex-border p-5 grid md:grid-cols-2 gap-4 text-sm text-codex-paper/60">
                  <p><span className="font-mono text-codex-gold">Translation:</span> {selectedWork.translator || 'Unknown'}</p>
                  <p><span className="font-mono text-codex-gold">Source:</span> {selectedWork.sourceTitle || 'Unknown'}</p>
                  <p><span className="font-mono text-codex-gold">Rights:</span> {compact(selectedWork.provenance.rights)}</p>
                  <p><span className="font-mono text-codex-gold">Notes:</span> {selectedWork.provenance.notes}</p>
                </div>
              )}

              {showTags && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-display uppercase tracking-widest text-codex-gold">
                    <Layers className="w-4 h-4" />
                    Work-Level Tag Profile
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {aggregateTags.map(([tag, count]) => (
                      <span key={tag} className="border border-codex-border px-2 py-1 text-xs font-mono text-codex-paper/55">
                        {normalizeLabel(tag)} <span className="text-codex-gold/70">{count}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="border border-codex-border bg-codex-obsidian/25 p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-display uppercase tracking-widest text-codex-gold">Interaction Layer</div>
                    <p className="mt-1 text-sm text-codex-paper/55">
                      Move between the whole text, filtered passages, and the character/entity index generated from this work.
                    </p>
                  </div>
                  <div className="flex border border-codex-border bg-codex-bg/70">
                    {[
                      { id: 'work' as WorkView, label: 'Full Work' },
                      { id: 'passages' as WorkView, label: 'Parts' },
                      { id: 'entities' as WorkView, label: 'Entities' },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setWorkView(mode.id)}
                        className={`px-3 py-2 text-xs font-mono uppercase transition-colors ${
                          workView === mode.id
                            ? 'bg-codex-gold text-codex-bg'
                            : 'text-codex-paper/50 hover:text-codex-gold'
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedEntity && (
                  <div className="grid lg:grid-cols-[1fr_280px] gap-5 border-t border-codex-border pt-4">
                    <EntityCard entity={selectedEntity.entity} />
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="border border-codex-border px-3 py-2">
                          <div className="text-[10px] font-mono uppercase text-codex-paper/30">Passages</div>
                          <div className="mt-1 text-xl font-display text-codex-gold">{selectedEntity.count}</div>
                        </div>
                        <div className="border border-codex-border px-3 py-2">
                          <div className="text-[10px] font-mono uppercase text-codex-paper/30">Kind</div>
                          <div className="mt-1 text-sm font-display text-codex-paper capitalize">{selectedEntity.category}</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-mono uppercase text-codex-paper/30 mb-2">First Citations</div>
                        <div className="flex flex-wrap gap-2">
                          {selectedEntity.citations.slice(0, 8).map((citation) => (
                            <span key={citation} className="border border-codex-border px-2 py-1 text-xs font-mono text-codex-paper/45">
                              {citation}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="px-8 py-8 space-y-4 max-w-6xl">
            {workView === 'entities' && (
              <div className="space-y-5 pb-4">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-display text-codex-paper">Entity Browser</h3>
                    <p className="mt-1 text-sm text-codex-paper/50">
                      {selectedEntity
                        ? `Showing passages where ${selectedEntity.entity.name} appears.`
                        : 'Choose an entity to pivot from the work into its appearances and metadata.'}
                    </p>
                  </div>
                  {selectedEntity && (
                    <button
                      onClick={() => setSelectedEntityId(null)}
                      className="border border-codex-border px-3 py-2 text-xs font-mono uppercase text-codex-paper/50 hover:border-codex-gold hover:text-codex-gold"
                    >
                      Show All Entities
                    </button>
                  )}
                </div>

                {!selectedEntity && (
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {visibleEntities.slice(0, 36).map((occurrence) => (
                      <button
                        key={occurrence.id}
                        onClick={() => selectEntity(occurrence.id)}
                        className="border border-codex-border bg-codex-obsidian/20 p-4 text-left hover:border-codex-gold/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-display text-codex-gold truncate">{occurrence.entity.name}</div>
                            <div className="mt-1 text-[10px] font-mono uppercase text-codex-paper/35">
                              {occurrence.category} / {occurrence.count} passages
                            </div>
                          </div>
                          <Users className="w-4 h-4 text-codex-gold/50 shrink-0" />
                        </div>
                        <p className="mt-3 line-clamp-3 text-sm text-codex-paper/55 leading-relaxed">
                          {occurrence.entity.roleInWork || occurrence.entity.description || occurrence.entity.domains || occurrence.entity.id}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-xl font-display text-codex-paper">
                {workView === 'work' && 'Full Work Sequence'}
                {workView === 'passages' && 'Passage Browser'}
                {workView === 'entities' && (selectedEntity ? `${selectedEntity.entity.name} Passages` : 'All Entity-Indexed Passages')}
              </h3>
              <div className="text-xs font-mono uppercase text-codex-paper/35">
                {chunks.length} chunks visible
              </div>
            </div>

            {chunks.map((chunk) => {
              const expanded = expandedChunks.has(chunk.id);
              const entitiesExpanded = expandedEntityChunks.has(chunk.id);
              const metadataExpanded = expandedMetadataChunks.has(chunk.id);
              const figureCount = chunk.entities.figures.length;
              const creatureCount = chunk.entities.creatures.length;
              const hasEntities = figureCount > 0 || creatureCount > 0;
              const text = expanded ? chunk.text : `${chunk.text.slice(0, 760)}${chunk.text.length > 760 ? '...' : ''}`;
              return (
                <article key={chunk.id} className="border border-codex-border bg-codex-obsidian/20">
                  <button
                    onClick={() => toggleChunk(chunk.id)}
                    className="w-full px-5 py-4 flex items-start justify-between gap-4 border-b border-codex-border text-left"
                  >
                    <div>
                      <h3 className="font-display text-codex-gold">{chunk.sectionTitle}</h3>
                      <p className="text-xs font-mono text-codex-paper/35 uppercase mt-1">{chunk.stableCitation} / {chunk.tokenCount} words</p>
                    </div>
                    {expanded ? <ChevronUp className="w-4 h-4 text-codex-paper/40" /> : <ChevronDown className="w-4 h-4 text-codex-paper/40" />}
                  </button>

                  <div className="p-5 space-y-5">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => toggleMetadataChunk(chunk.id)}
                        className="inline-flex items-center gap-2 border border-codex-border px-3 py-2 text-xs font-mono uppercase text-codex-paper/50 hover:border-codex-gold/50 hover:text-codex-gold transition-colors"
                      >
                        {metadataExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        Details
                      </button>
                      {showEntities && hasEntities && (
                        <button
                          onClick={() => toggleEntityChunk(chunk.id)}
                          className="inline-flex min-w-0 items-center gap-2 border border-codex-border px-3 py-2 text-xs font-mono uppercase text-codex-paper/50 hover:border-codex-gold/50 hover:text-codex-gold transition-colors"
                        >
                          {entitiesExpanded ? <ChevronDown className="w-3 h-3 shrink-0" /> : <ChevronRight className="w-3 h-3 shrink-0" />}
                          <Users className="w-3 h-3 shrink-0" />
                          <span>{figureCount} Figures / {creatureCount} Creatures</span>
                          <span className="hidden md:inline min-w-0 truncate normal-case text-codex-paper/35">
                            {entitySummary([...chunk.entities.figures, ...chunk.entities.creatures])}
                          </span>
                        </button>
                      )}
                    </div>

                    {metadataExpanded && <ChunkMetadata chunk={chunk} />}

                    {showText && <p className="font-serif text-lg leading-relaxed text-codex-paper/78 whitespace-pre-wrap">{text}</p>}

                    {showTags && (
                      <div className="space-y-3">
                        {TAG_GROUPS.map((group) => {
                          const values = chunk.tags[group.key] || [];
                          if (values.length === 0) return null;
                          return (
                            <div key={group.key} className="flex flex-wrap gap-2 items-center">
                              <span className="text-xs font-mono text-codex-gold/70 w-24">{group.label}</span>
                              {values.map((tag) => (
                                <span key={tag} title={`${Math.round((chunk.tagConfidence[group.key]?.[tag] || chunk.provenance.confidence) * 100)}% confidence`} className="border border-codex-border px-2 py-1 text-xs font-mono text-codex-paper/55">
                                  {normalizeLabel(tag)}
                                </span>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {showEntities && hasEntities && entitiesExpanded && (
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        {figureCount > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-mono text-codex-gold uppercase"><Users className="w-3 h-3" /> Figures</div>
                            <div className="grid gap-2">
                              {chunk.entities.figures.map((entity) => <EntityCard key={entity.id} entity={entity} />)}
                            </div>
                          </div>
                        )}
                        {creatureCount > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-mono text-codex-gold uppercase"><Hash className="w-3 h-3" /> Creatures</div>
                            <div className="grid gap-2">
                              {chunk.entities.creatures.map((entity) => <EntityCard key={entity.id} entity={entity} />)}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {showInterpretation && (
                      <div className="border border-codex-border p-3 text-xs font-mono text-codex-paper/45 leading-relaxed">
                        {chunk.interpretation.caveat} Method: {chunk.interpretation.method}. Review: {chunk.interpretation.reviewedBy}.
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        </main>
      </div>
    </div>
  );
}
