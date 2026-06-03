import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Database, Network, ArrowRight, Share2, Layers, Compass } from 'lucide-react';
import SearchPage from './mythology-search-page';
import MethodologyPage from './methodology-page';
import WorkExplorerPage from './work-explorer-page';
import { WorksCollection } from './components/WorksCollection';
import './App.css';

const CodexHero = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        setMousePos({ x, y });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 pt-20">
      {/* Sacred Geometry Background */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] animate-spin-slow" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.2" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="1 2" />
          <path d="M50 5 L95 95 H5 Z" fill="none" stroke="currentColor" strokeWidth="0.2" />
          <path d="M50 95 L95 5 H5 Z" fill="none" stroke="currentColor" strokeWidth="0.2" />
        </svg>
      </div>

      {/* Floating Sigils */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i}
            className="absolute border border-codex-gold/20 rounded-full w-64 h-64"
            style={{
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) rotate(${i * 60 + mousePos.x * 20}deg) scale(${1 + i * 0.5})`,
              transition: 'transform 0.5s ease-out'
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="z-10 text-center max-w-5xl mx-auto space-y-12">
        <div className="space-y-6">
          <p className="text-codex-gold tracking-[0.3em] text-sm uppercase font-serif animate-fade-in-up">
            Archive of Human Belief
          </p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display tracking-tight leading-none text-codex-paper relative">
            <span className="block transform hover:scale-105 transition-transform duration-700 cursor-default">
              MYTHOLOGICAL
            </span>
            <span className="block text-codex-gold/90 transform hover:scale-105 transition-transform duration-700 delay-75 cursor-default">
              CODEX
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-codex-paper/60 font-light font-serif leading-relaxed">
            A computational interface for the comparative study of universal patterns, archetypes, and cognitive structures in human mythology.
          </p>
        </div>

        {/* Action Area */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center pt-8">
          <button 
            onClick={() => onNavigate('search')}
            className="group relative px-8 py-4 bg-codex-gold/10 hover:bg-codex-gold/20 border border-codex-gold/30 text-codex-gold font-display tracking-widest uppercase transition-all hover:tracking-[0.2em] overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              Enter the Archive <ArrowRight className="w-4 h-4" />
            </span>
            <div className="absolute inset-0 bg-codex-gold/5 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
          </button>
          
          <button 
            onClick={() => onNavigate('methodology')}
            className="group px-8 py-4 text-codex-paper/60 hover:text-codex-paper font-serif italic hover:italic border-b border-transparent hover:border-codex-paper/30 transition-all"
          >
            Examine Methodology
          </button>
        </div>
      </div>

      {/* Decorative Footer Elements */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-between px-12 text-xs text-codex-paper/20 font-mono uppercase tracking-widest">
        <div>Fig. 01 — Interface</div>
        <div>v.2.0.24</div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: number }) => (
  <div 
    className="group relative p-8 border border-codex-border bg-codex-bg/50 backdrop-blur-sm hover:border-codex-gold/30 transition-colors duration-500"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <Compass className="w-6 h-6 text-codex-gold/20 animate-spin-slow" />
    </div>
    <div className="mb-6 text-codex-gold/80 group-hover:text-codex-gold transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-display text-codex-paper mb-3 tracking-wide">{title}</h3>
    <p className="text-codex-paper/60 font-serif leading-relaxed">{desc}</p>
  </div>
);

const TaxonomyGrid = () => {
  const taxonomies = [
    { id: '01', name: 'Archetypes', count: '17', desc: 'Jungian & Campbellian Roles' },
    { id: '02', name: 'Functions', count: '14', desc: 'Dumézilian Social Structures' },
    { id: '03', name: 'Cognition', count: '12', desc: 'Evolutionary Psychology' },
    { id: '04', name: 'Themes', count: '20', desc: 'Stith Thompson Motifs' },
    { id: '05', name: 'Rites', count: '17', desc: 'Van Gennep Rituals' },
    { id: '06', name: 'Narrative', count: '31', desc: 'Proppian Morphology' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
      {taxonomies.map((tax) => (
        <div key={tax.id} className="relative aspect-square border border-codex-border p-6 flex flex-col justify-between group hover:bg-codex-gold/5 transition-colors cursor-crosshair">
          <div className="flex justify-between items-start">
            <span className="font-mono text-xs text-codex-gold/40">{tax.id}</span>
            <span className="font-mono text-xs text-codex-paper/40">{tax.count}</span>
          </div>
          <div>
            <h4 className="font-display text-lg text-codex-paper mb-1 group-hover:text-codex-gold transition-colors">{tax.name}</h4>
            <p className="text-xs text-codex-paper/40 font-serif italic">{tax.desc}</p>
          </div>
          <div className="absolute inset-0 border border-codex-gold/0 group-hover:border-codex-gold/20 transition-colors" />
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial load sequence
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-codex-bg flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border border-codex-gold/20 rotate-45" />
          <div className="absolute inset-0 border border-codex-gold/40 animate-ping" />
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-codex-gold/60 font-mono text-xs tracking-widest">
            INITIALIZING
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'search') {
    return <SearchPage onNavigateHome={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'methodology') {
    return <MethodologyPage onNavigateHome={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'work') {
    return <WorkExplorerPage initialWorkId={selectedWorkId} onNavigateHome={() => setCurrentPage('home')} />;
  }

  return (
    <div className="min-h-screen bg-codex-bg text-codex-paper selection:bg-codex-gold/30 selection:text-codex-gold">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center mix-blend-difference">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 bg-codex-gold rotate-45" />
          <span className="font-display tracking-widest text-sm text-codex-paper/80">W.M.C.</span>
        </div>
        <div className="flex gap-8 text-xs font-mono tracking-widest text-codex-paper/60">
          <button onClick={() => setCurrentPage('search')} className="hover:text-codex-gold transition-colors">ARCHIVE</button>
          <button onClick={() => setCurrentPage('work')} className="hover:text-codex-gold transition-colors">WORKS</button>
          <button onClick={() => setCurrentPage('methodology')} className="hover:text-codex-gold transition-colors">INDEX</button>
        </div>
      </nav>

      <CodexHero onNavigate={setCurrentPage} />

      {/* Works Collection */}
      <WorksCollection onSelectWork={(workId) => {
        setSelectedWorkId(workId);
        setCurrentPage('work');
      }} />

      {/* Framework Section */}
      <section className="py-32 border-t border-codex-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="space-y-8 sticky top-32">
              <h2 className="text-4xl font-display text-codex-gold">Taxonomic Framework</h2>
              <p className="text-xl font-serif text-codex-paper/80 leading-relaxed">
                The Codex utilizes a rigorous multi-layered tagging system derived from seven decades of scholarship. 
                Each narrative is dissected into constituent atomic units of meaning.
              </p>
              <div className="space-y-4 pt-8">
                <div className="flex items-center gap-4 text-sm font-mono text-codex-paper/60 border-b border-codex-border pb-4">
                  <Database className="w-4 h-4 text-codex-gold" />
                  <span>111+ Controlled Vocabulary Terms</span>
                </div>
                <div className="flex items-center gap-4 text-sm font-mono text-codex-paper/60 border-b border-codex-border pb-4">
                  <Layers className="w-4 h-4 text-codex-gold" />
                  <span>3 Levels of Abstraction</span>
                </div>
                <div className="flex items-center gap-4 text-sm font-mono text-codex-paper/60 border-b border-codex-border pb-4">
                  <Network className="w-4 h-4 text-codex-gold" />
                  <span>Graph-Based Relationships</span>
                </div>
              </div>
            </div>
            <TaxonomyGrid />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-codex-obsidian relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-codex-gold/30 to-transparent" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              delay={0}
              icon={<BookOpen className="w-8 h-8" />}
              title="Comparative Synthesis"
              desc="Cross-reference narratives from Mesopotamia to Mesoamerica using a unified structural ontology."
            />
            <FeatureCard 
              delay={100}
              icon={<Layers className="w-8 h-8" />}
              title="Deep Semantics"
              desc="Beyond keyword search. Vector embeddings capture the conceptual essence of mythological motifs."
            />
            <FeatureCard 
              delay={200}
              icon={<Share2 className="w-8 h-8" />}
              title="Open Scholarship"
              desc="A fully transparent methodology with reproducible data structures for academic research."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-codex-border bg-codex-bg text-center">
        <div className="max-w-2xl mx-auto px-6 space-y-8">
          <div className="w-4 h-4 border border-codex-gold/40 rotate-45 mx-auto" />
          <p className="font-serif text-codex-paper/40 text-sm italic">
            "Myths are public dreams, dreams are private myths."
          </p>
          <div className="text-xs font-mono text-codex-paper/20 tracking-widest">
            WORLD MYTHOLOGICAL CODEX © 2024
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
