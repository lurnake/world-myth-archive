import { useState } from 'react';
import { BookOpen, Calendar, ExternalLink, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { works, type Work } from '../data/works-data';

const WorkCard = ({ work, onSelectWork }: { work: Work; onSelectWork?: (workId: string) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Clean up culture group (remove comments)
  const cleanCultureGroup = work.cultureGroup.split('#')[0].trim();

  return (
    <div className="group relative border border-codex-border bg-codex-bg/50 backdrop-blur-sm hover:border-codex-gold/30 transition-all duration-500 overflow-hidden">
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-transparent via-codex-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="p-6 space-y-4">
        {/* Culture badge */}
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 text-xs font-mono tracking-wider border border-codex-gold/30 text-codex-gold/80 uppercase">
            {cleanCultureGroup}
          </span>
          {work.sourceDocument?.url && (
            <a
              href={work.sourceDocument.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-codex-paper/40 hover:text-codex-gold transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h3 className="text-xl font-display text-codex-paper group-hover:text-codex-gold transition-colors leading-tight">
            {work.title}
          </h3>
          {work.titleOriginal && (
            <p className="text-sm font-serif italic text-codex-paper/50">
              {work.titleOriginal.replace(/["#].*$/g, '').trim()}
            </p>
          )}
        </div>

        {/* Summary */}
        <p className={`text-sm font-serif text-codex-paper/70 leading-relaxed ${!isExpanded && 'line-clamp-3'}`}>
          {work.summary}
        </p>

        {/* Metadata row */}
        <div className="space-y-2 text-xs font-mono text-codex-paper/50">
          {work.sourcePrimary && (
            <div className="flex items-start gap-2">
              <Calendar className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>{work.sourcePrimary.approx_date}</span>
            </div>
          )}
          {work.sourceDocument && (
            <div className="flex items-start gap-2">
              <BookOpen className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-1">
                Trans. {work.sourceDocument.translator_author_editor}
                {work.sourceDocument.publication_date && ` (${work.sourceDocument.publication_date})`}
              </span>
            </div>
          )}
        </div>

        {/* Expandable details */}
        {isExpanded && (
          <div className="pt-4 border-t border-codex-border space-y-3 animate-fade-in">
            {Array.isArray(work.mythTypeTags) && work.mythTypeTags.length > 0 && (
              <div>
                <p className="text-xs font-mono text-codex-gold/60 mb-2">MYTH TYPES</p>
                <div className="flex flex-wrap gap-1">
                  {work.mythTypeTags.slice(0, 4).map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 text-xs bg-codex-gold/10 text-codex-gold/80 border border-codex-gold/20">
                      {tag.replace('MYTHTYPE_', '').replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {Array.isArray(work.themeTags) && work.themeTags.length > 0 && (
              <div>
                <p className="text-xs font-mono text-codex-gold/60 mb-2">KEY THEMES</p>
                <div className="flex flex-wrap gap-1">
                  {work.themeTags.slice(0, 6).map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 text-xs bg-codex-paper/5 text-codex-paper/60 border border-codex-paper/10">
                      {tag.replace('THM_', '').replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Expand/Collapse button */}
        <div className="pt-3 grid grid-cols-2 gap-2 border-t border-codex-border/50">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center gap-2 text-xs font-mono text-codex-gold/60 hover:text-codex-gold transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3 h-3" />
                <span>SHOW LESS</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" />
                <span>SHOW MORE</span>
              </>
            )}
          </button>
          <button
            onClick={() => onSelectWork?.(work.id)}
            className="flex items-center justify-center gap-2 text-xs font-mono text-codex-paper/55 hover:text-codex-gold transition-colors border-l border-codex-border/50"
          >
            <span>EXPLORE</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Corner decoration */}
      <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-codex-gold/0 group-hover:border-codex-gold/20 transition-colors" />
      <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-codex-gold/0 group-hover:border-codex-gold/20 transition-colors" />
    </div>
  );
};

export const WorksCollection = ({ onSelectWork }: { onSelectWork?: (workId: string) => void }) => {
  const [selectedCulture, setSelectedCulture] = useState<string>('all');

  // Filter works by culture
  const filteredWorks = selectedCulture === 'all'
    ? works
    : works.filter(w => w.cultureGroup.toLowerCase().includes(selectedCulture.toLowerCase()));

  // Extract unique cultures for filter
  const cultures = ['all', ...Array.from(new Set(works.map(w =>
    w.cultureGroup.split('#')[0].trim()
  )))].sort();

  return (
    <section className="py-32 border-t border-codex-border bg-codex-obsidian relative overflow-hidden">
      {/* Decorative top line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-codex-gold/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-block">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-codex-gold/50" />
              <BookOpen className="w-6 h-6 text-codex-gold" />
              <div className="w-8 h-px bg-codex-gold/50" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-display text-codex-gold">
            The Collection
          </h2>
          <p className="max-w-2xl mx-auto text-xl font-serif text-codex-paper/80 leading-relaxed">
            Explore {works.length} foundational mythological texts spanning cultures from ancient Mesopotamia to medieval Scandinavia.
          </p>
        </div>

        {/* Culture Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {cultures.map((culture) => (
            <button
              key={culture}
              onClick={() => setSelectedCulture(culture)}
              className={`px-4 py-2 text-xs font-mono tracking-wider uppercase transition-all duration-300 border ${
                selectedCulture === culture
                  ? 'bg-codex-gold/20 border-codex-gold text-codex-gold'
                  : 'bg-codex-bg/30 border-codex-border text-codex-paper/60 hover:border-codex-gold/30 hover:text-codex-paper'
              }`}
            >
              {culture}
            </button>
          ))}
        </div>

        {/* Works Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorks.map((work) => (
            <WorkCard key={work.id} work={work} onSelectWork={onSelectWork} />
          ))}
        </div>

        {/* Collection Stats */}
        <div className="mt-16 pt-16 border-t border-codex-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <div className="text-3xl font-display text-codex-gold">{works.length}</div>
              <div className="text-xs font-mono text-codex-paper/50 tracking-widest uppercase">Texts</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-display text-codex-gold">{cultures.length - 1}</div>
              <div className="text-xs font-mono text-codex-paper/50 tracking-widest uppercase">Cultures</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-display text-codex-gold">4000+</div>
              <div className="text-xs font-mono text-codex-paper/50 tracking-widest uppercase">Years</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-display text-codex-gold">∞</div>
              <div className="text-xs font-mono text-codex-paper/50 tracking-widest uppercase">Wisdom</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
