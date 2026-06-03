import React, { useState } from 'react';
import { BookOpen, Users, Brain, Scroll, Hash, Sparkles, Database, ChevronDown, FileText, Zap, ArrowLeft } from 'lucide-react';

interface MethodologyPageProps {
  onNavigateHome: () => void;
}

const MethodologyPage: React.FC<MethodologyPageProps> = ({ onNavigateHome }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedLexicon, setExpandedLexicon] = useState<string | null>(null);

  const sections = [
    { id: 'overview', label: 'Overview', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'theoretical', label: 'Theoretical Framework', icon: <Brain className="w-4 h-4" /> },
    { id: 'lexicons', label: 'Controlled Vocabularies', icon: <Database className="w-4 h-4" /> },
    { id: 'application', label: 'Application Guidelines', icon: <FileText className="w-4 h-4" /> },
    { id: 'technical', label: 'Technical Implementation', icon: <Hash className="w-4 h-4" /> },
    { id: 'citations', label: 'References', icon: <Scroll className="w-4 h-4" /> }
  ];

  const lexicons = [
    {
      id: 'themes',
      name: 'Theme Tags',
      count: 20,
      icon: <Sparkles className="w-5 h-5" />,
      purpose: 'To identify high-level, recurring conceptual motifs or central ideas that appear across diverse mythologies.',
      sources: [
        { author: 'Stith Thompson', work: 'Motif-Index of Folk-Literature', year: '1955', detail: 'Six-volume comprehensive index providing foundational narrative elements' },
        { author: 'Michael Witzel', work: 'The Origins of the World\'s Mythologies', year: '2012', detail: 'Global mythological patterns and "Laurasian" mythology framework' }
      ],
      rationale: 'Distilled from these sources to provide a manageable yet comprehensive set of tags for common thematic concerns found in global mythologies.',
      examples: ['THEME_CREATION', 'THEME_DEATH_MORTALITY', 'THEME_TRANSFORMATION_METAMORPHOSIS']
    },
    {
      id: 'archetypes',
      name: 'Character Archetype Tags',
      count: 17,
      icon: <Users className="w-5 h-5" />,
      purpose: 'To identify recurring symbolic character roles or patterns that appear across myths and represent fundamental human experiences.',
      sources: [
        { author: 'Carl Jung', work: 'Archetypes and the Collective Unconscious', year: '1959', detail: 'Psychoanalytic concept of primordial images in the collective unconscious' },
        { author: 'Joseph Campbell', work: 'The Hero with a Thousand Faces', year: '1949', detail: 'Popularized archetypal analysis applied to hero myths worldwide' },
      ],
      rationale: 'Helps understand symbolic roles characters play beyond literal actions, connecting to potentially universal patterns of human experience.',
      examples: ['ARCH_HERO_ARCHETYPE', 'ARCH_TRICKSTER_ARCHETYPE', 'ARCH_WISE_OLD_MAN_WOMAN_ARCHETYPE']
    },
    {
      id: 'cognitive',
      name: 'Cognitive Function Tags',
      count: 12,
      icon: <Brain className="w-5 h-5" />,
      purpose: 'To categorize myths based on hypothesized cognitive, evolutionary, and social functions explaining their emergence and persistence.',
      sources: [
        { author: 'Pascal Boyer', work: 'Religion Explained', year: '2001', detail: 'HADD and MCI concepts' },
        { author: 'Joseph Henrich', work: 'The Secret of Our Success', year: '2015', detail: 'Cultural evolution and adaptive cultural mechanisms' }
      ],
      rationale: 'Reveals why certain narratives are "sticky" - they tap into cognitive biases or reinforce crucial social norms.',
      examples: ['COGFUNC_HADD', 'COGFUNC_MCI_CONCEPTS', 'COGFUNC_COSTLY_SIGNALING']
    },
    {
      id: 'functions',
      name: 'Social Function Tags',
      count: 14,
      icon: <Hash className="w-5 h-5" />,
      purpose: 'To identify symbolic roles or societal principles embodied by mythological elements from a socio-cultural perspective.',
      sources: [
        { author: 'Georges Dumézil', work: 'Trifunctional Hypothesis', year: '1958', detail: 'Three core societal functions: sovereignty, warrior, fertility' }
      ],
      rationale: 'Analyzes deeper symbolic roles and societal/cosmic principles represented in myths.',
      examples: ['FUNC_SOVEREIGNTY_JUSTICE', 'FUNC_WARRIOR_PROTECTOR', 'FUNC_FERTILITY_ABUNDANCE']
    },
    {
      id: 'rites',
      name: 'Rite Tags',
      count: 17,
      icon: <Scroll className="w-5 h-5" />,
      purpose: 'To categorize human ritual actions, structures, and symbolic meanings as described in mythological narratives.',
      sources: [
        { author: 'Arnold van Gennep', work: 'The Rites of Passage', year: '1909', detail: 'Tripartite structure: separation, liminality, incorporation' }
      ],
      rationale: 'Identifies and classifies ritualistic elements, phases, and common types of ritual practice in mythological contexts.',
      examples: ['RITE_INITIATION', 'RITE_LIMINALITY', 'RITE_SACRIFICE']
    },
    {
      id: 'proppian',
      name: 'Proppian Functions',
      count: 31,
      icon: <BookOpen className="w-5 h-5" />,
      purpose: 'To identify specific narrative functions according to Vladimir Propp\'s morphological analysis.',
      sources: [
        { author: 'Vladimir Propp', work: 'Morphology of the Folktale', year: '1928', detail: '31 functions of dramatis personae' }
      ],
      rationale: 'Historical importance and utility for structural analysis of heroic quest narratives.',
      examples: ['PROPP_08_VILLAINY', 'PROPP_12_FIRST_DONOR_FUNCTION', 'PROPP_19_LIQUIDATION']
    }
  ];

  const toggleLexicon = (id: string) => {
    setExpandedLexicon(expandedLexicon === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-codex-bg text-codex-paper font-serif selection:bg-codex-gold/30 selection:text-codex-gold">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-codex-bg/90 backdrop-blur-md border-b border-codex-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-display tracking-widest text-codex-gold uppercase">
            Methodology & Framework
            </h1>
            <button 
              onClick={onNavigateHome}
            className="group flex items-center gap-2 text-xs font-mono tracking-widest text-codex-paper/60 hover:text-codex-gold transition-colors"
            >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            RETURN TO ARCHIVE
            </button>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-73px)]">
        {/* Sidebar Navigation */}
        <aside className="hidden md:block w-72 sticky top-[73px] h-[calc(100vh-73px)] border-r border-codex-border bg-codex-bg/50 overflow-y-auto no-scrollbar">
          <nav className="p-6 space-y-2">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-4 px-4 py-4 text-left transition-all border-l-2 ${
                  activeSection === section.id 
                    ? 'border-codex-gold bg-codex-gold/5 text-codex-gold' 
                    : 'border-transparent text-codex-paper/50 hover:text-codex-paper hover:bg-codex-paper/5'
                }`}
              >
                <span className={`${activeSection === section.id ? 'text-codex-gold' : 'text-codex-paper/40'}`}>
                {section.icon}
                </span>
                <span className="font-display tracking-wide text-sm uppercase">{section.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-4xl mx-auto px-8 py-12 overflow-y-auto">
          
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="animate-fade-in-up space-y-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-display text-codex-paper mb-6">Systematic Analysis</h2>
                <p className="text-xl text-codex-paper/80 leading-relaxed font-light">
                  The World Myth Archive employs a rigorous, multi-layered analytical framework that synthesizes 
                  over seven decades of scholarship in mythology, folklore, anthropology, and cognitive science. 
                  The methodology enables systematic, reproducible analysis of mythological narratives across cultures.
                </p>
                      </div>

              <div className="grid gap-8">
                <div className="p-8 border border-codex-border bg-codex-obsidian/50 backdrop-blur-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-codex-gold/50" />
                  <h3 className="text-2xl font-display text-codex-gold mb-4">Core Principles</h3>
                  <ul className="space-y-4">
                    {[
                      { title: 'Theory-Driven Design', desc: 'Every tag grounded in established academic work.' },
                      { title: 'Multi-Dimensional Analysis', desc: 'Character, Episode, and Work level scaling.' },
                      { title: 'Controlled Vocabularies', desc: 'Machine-readable taxonomies with unique IDs.' },
                      { title: 'Extensibility', desc: 'Designed to accommodate new corpora and theories.' }
                    ].map((item, i) => (
                      <li key={i} className="flex gap-4 items-start">
                        <span className="text-codex-gold/50 font-serif italic mt-1">0{i+1}.</span>
                      <div>
                          <strong className="text-codex-paper block mb-1 font-display tracking-wide text-sm">{item.title}</strong>
                          <span className="text-codex-paper/60 text-sm">{item.desc}</span>
                      </div>
                    </li>
                    ))}
                  </ul>
                </div>
                  </div>
                  
              <div className="space-y-8">
                <h3 className="text-2xl font-display text-codex-paper border-b border-codex-border pb-4">Three-Tiered Analytical Approach</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { 
                      level: 'Character', 
                      color: 'text-codex-gold', 
                      desc: 'Archetypal roles, social functions, and cognitive biases.',
                      items: ['Archetypes', 'Social Functions', 'Cognitive Traits']
                    },
                    { 
                      level: 'Episode', 
                      color: 'text-codex-paper', 
                      desc: 'Narrative segments, ritual elements, and thematic content.',
                      items: ['Proppian Functions', 'Ritual Elements', 'Themes']
                    },
                    { 
                      level: 'Work', 
                      color: 'text-codex-paper', 
                      desc: 'Overall patterns, cultural functions, and comparative elements.',
                      items: ['Thematic Patterns', 'Structural Org', 'Cultural Function']
                    }
                  ].map((tier, i) => (
                    <div key={i} className="p-6 border border-codex-border bg-codex-bg hover:border-codex-gold/30 transition-colors">
                      <h4 className={`text-lg font-display mb-3 ${tier.color}`}>{tier.level} Level</h4>
                      <p className="text-sm text-codex-paper/60 mb-4 leading-relaxed">
                        {tier.desc}
                      </p>
                      <ul className="space-y-2">
                        {tier.items.map((item, j) => (
                          <li key={j} className="text-xs font-mono text-codex-paper/40 flex items-center gap-2">
                            <div className="w-1 h-1 bg-codex-gold/50 rounded-full" />
                            {item}
                          </li>
                        ))}
                    </ul>
                  </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Theoretical Framework */}
          {activeSection === 'theoretical' && (
            <div className="animate-fade-in-up space-y-12">
              <div>
                <h2 className="text-4xl font-display text-codex-paper mb-6">Theoretical Framework</h2>
                <p className="text-xl text-codex-paper/80 leading-relaxed font-light">
                  The archive treats myth as a layered cultural object: a transmitted text, a set of narrative
                  actions, a map of persons and powers, and a carrier of social and cognitive work. No single
                  theory is allowed to explain everything. Instead, each framework contributes a constrained lens
                  that can be compared, challenged, and traced back to the passage where it was applied.
                </p>
                  </div>

              <div className="border border-codex-border bg-codex-obsidian/40 p-8">
                <h3 className="text-2xl font-display text-codex-gold mb-4">How To Read The Framework</h3>
                <div className="grid md:grid-cols-3 gap-6 text-sm text-codex-paper/62 leading-relaxed">
                  <p>
                    <span className="block font-display text-codex-paper mb-2">Text First</span>
                    The translated passage remains the primary evidence. Tags, entity links, and summaries are
                    indexes into the corpus, not replacements for reading the work itself.
                  </p>
                  <p>
                    <span className="block font-display text-codex-paper mb-2">Plural Lenses</span>
                    Structural, ritual, social, archetypal, and cognitive tags can coexist on one passage because
                    they answer different questions: what happens, who acts, what social order is implied, and why
                    the scene may be memorable.
                  </p>
                  <p>
                    <span className="block font-display text-codex-paper mb-2">Bounded Claims</span>
                    Tags expose patterns for discovery. They do not assert that cultures share one origin,
                    psychology, or meaning. Confidence and review metadata make that uncertainty visible.
                  </p>
                </div>
              </div>

              <div className="grid gap-6">
                {[
                  {
                    icon: <BookOpen className="w-6 h-6" />,
                    title: "Narrative Structure",
                    desc: "How a myth is organized as action, sequence, conflict, and transformation.",
                    subs: [
                      { t: "Proppian Morphology", d: "Used narrowly for recurring action functions such as departure, interdiction, donor testing, struggle, return, and recognition. It is most reliable for quest-like or heroic materials, and less reliable for hymns, cosmogonies, genealogies, or ritual spells." },
                      { t: "Episode Typing", d: "Segments passages by mythic action: creation, divine succession, monster combat, underworld descent, culture-founding, catastrophe, restoration, and other repeatable scene types." }
                    ]
                  },
                  {
                    icon: <Users className="w-6 h-6" />,
                    title: "Persons, Powers, and Roles",
                    desc: "How characters, deities, creatures, places, and objects operate inside a work.",
                    subs: [
                      { t: "Entity-Centered Reading", d: "Figures and creatures are indexed as durable objects of interpretation. A user can move from an entity dossier to every passage where that entity appears, then compare roles, domains, aliases, and narrative contexts." },
                      { t: "Archetypal Caution", d: "Archetype tags describe recurring literary and symbolic roles. They help comparison, but they are not treated as proof of universal psychology or as substitutes for local cultural meaning." }
                    ]
                  },
                  {
                    icon: <Hash className="w-6 h-6" />,
                    title: "Social and Ritual Function",
                    desc: "What a narrative does for institutions, hierarchy, memory, obligation, and ritual life.",
                    subs: [
                      { t: "Dumezilian Functions", d: "Sovereignty, force, and fertility/prosperity are useful comparative categories, especially in Indo-European material. The interface keeps them as one lens rather than a universal template." },
                      { t: "Ritual Process", d: "Rite tags track sacrifice, invocation, initiation, divination, lament, purification, liminality, and incorporation so mythic narrative can be read alongside ritual action." },
                      { t: "Charter and Legitimacy", d: "Some passages explain why a king rules, a custom exists, a taboo binds, or a lineage matters. These tags surface mythology as social argument as well as story." },
                      { t: "Comparative Constraint", d: "Functional tags are strongest when the passage explicitly names offices, rites, obligations, genealogies, punishments, or social consequences." }
                    ]
                  },
                  {
                    icon: <Brain className="w-6 h-6" />,
                    title: "Cognitive and Cultural Transmission",
                    desc: "Why particular mythic forms may be memorable, repeatable, and socially durable.",
                    subs: [
                      { t: "Minimally Counterintuitive Concepts", d: "Gods, talking objects, immortal beings, impossible transformations, and living-dead figures violate expectations in controlled ways that can make narratives easier to remember and transmit." },
                      { t: "Agency and Threat", d: "The framework marks scenes where invisible agents, danger, death, pollution, taboo, or divine punishment organize attention and behavior." },
                      { t: "Cultural Evolution", d: "Narratives can encode practical knowledge, moral norms, prestige models, cooperation rules, and group identity. These claims are tagged as hypotheses for retrieval, not final explanations." },
                      { t: "Memory Technologies", d: "Repetition, formulaic speech, catalogues, ritualized scenes, and named genealogies are treated as mechanisms that help oral or textual traditions preserve complex material." }
                    ]
                  },
                  {
                    icon: <Sparkles className="w-6 h-6" />,
                    title: "Motif and Theme",
                    desc: "Broad conceptual patterns that let readers compare works without flattening them.",
                    subs: [
                      { t: "Motif Indexing", d: "Theme tags borrow from motif-index traditions while staying small enough to be useful in an interface: creation, flood, metamorphosis, divine combat, fate, trickster cycles, world axis, and related patterns." },
                      { t: "Work-Level Texture", d: "Work tags describe the recurring concerns of a whole text, while passage tags keep local scenes searchable. This is why the archive supports full-work, part-level, and entity-level reading." }
                    ]
                  }
                ].map((theory, i) => (
                  <div key={i} className="border border-codex-border p-8 bg-codex-bg/50">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-codex-gold/10 text-codex-gold rounded-sm">
                        {theory.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-display text-codex-paper">{theory.title}</h3>
                        <p className="text-sm text-codex-paper/60">{theory.desc}</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                      {theory.subs.map((sub, j) => (
                        <div key={j}>
                          <h4 className="font-display text-codex-gold text-sm mb-2 tracking-wide">{sub.t}</h4>
                          <p className="text-sm text-codex-paper/60 leading-relaxed">{sub.d}</p>
                  </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="border border-codex-border p-8 bg-codex-bg">
                  <h3 className="text-xl font-display text-codex-paper mb-4">Unit Of Analysis</h3>
                  <p className="text-sm text-codex-paper/60 leading-relaxed mb-5">
                    The archive uses three linked units. The work level preserves cultural, source, and provenance
                    context. The passage level makes narrative movement searchable. The entity level lets readers
                    follow characters, deities, creatures, places, and objects across the passages where they matter.
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {['Work', 'Passage', 'Entity'].map((unit) => (
                      <div key={unit} className="border border-codex-border px-3 py-3">
                        <div className="text-xs font-mono uppercase text-codex-gold">{unit}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-codex-border p-8 bg-codex-bg">
                  <h3 className="text-xl font-display text-codex-paper mb-4">Interpretive Guardrails</h3>
                  <ul className="space-y-3 text-sm text-codex-paper/60 leading-relaxed">
                    <li>Automated tags are discovery aids and carry review/confidence metadata.</li>
                    <li>Comparative similarity does not imply direct influence, shared origin, or equivalent meaning.</li>
                    <li>Culture-specific categories are preferred where the data supports them.</li>
                    <li>Entity records keep aliases and roles visible so users can inspect why a match appeared.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Controlled Vocabularies */}
          {activeSection === 'lexicons' && (
            <div className="animate-fade-in-up space-y-12">
              <div>
                <h2 className="text-4xl font-display text-codex-paper mb-6">Controlled Vocabularies</h2>
                <p className="text-xl text-codex-paper/80 leading-relaxed font-light">
                  Eight carefully curated lexicons provide the foundation for systematic analysis, 
                  ensuring theoretical rigor and scholarly validity.
                </p>
              </div>

              <div className="space-y-4">
                {lexicons.map(lexicon => (
                  <div 
                    key={lexicon.id}
                    className={`border transition-all duration-300 ${
                      expandedLexicon === lexicon.id 
                        ? 'border-codex-gold bg-codex-gold/5' 
                        : 'border-codex-border bg-codex-bg hover:border-codex-gold/30'
                    }`}
                  >
                    <button
                      onClick={() => toggleLexicon(lexicon.id)}
                      className="w-full p-6 flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-6">
                        <div className={`p-3 rounded-sm transition-colors ${
                          expandedLexicon === lexicon.id ? 'bg-codex-gold text-codex-bg' : 'bg-codex-gold/10 text-codex-gold'
                        }`}>
                          {lexicon.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-display text-codex-paper">{lexicon.name}</h3>
                          <p className="text-xs font-mono text-codex-paper/40 uppercase tracking-widest mt-1">
                            {typeof lexicon.count === 'number' ? `${lexicon.count} Terms` : lexicon.count}
                          </p>
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-codex-paper/40 transition-transform duration-300 ${
                        expandedLexicon === lexicon.id ? 'rotate-180 text-codex-gold' : ''
                      }`} />
                    </button>

                    {expandedLexicon === lexicon.id && (
                      <div className="px-6 pb-8 border-t border-codex-gold/10 ml-[4.5rem]">
                        <div className="pt-6 space-y-6">
                          <div>
                            <h4 className="text-xs font-mono text-codex-gold uppercase tracking-widest mb-2">Purpose</h4>
                            <p className="text-sm text-codex-paper/70 leading-relaxed">{lexicon.purpose}</p>
                          </div>

                          <div className="grid md:grid-cols-2 gap-8">
                          <div>
                              <h4 className="text-xs font-mono text-codex-gold uppercase tracking-widest mb-3">Primary Sources</h4>
                              <ul className="space-y-4">
                              {lexicon.sources.map((source, idx) => (
                                <li key={idx} className="text-sm">
                                    <div className="font-display text-codex-paper">{source.author}</div>
                                    <div className="text-codex-paper/60 italic">{source.work} <span className="text-codex-paper/40 not-italic">({source.year})</span></div>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                              <h4 className="text-xs font-mono text-codex-gold uppercase tracking-widest mb-3">Example Tags</h4>
                            <div className="flex flex-wrap gap-2">
                              {lexicon.examples.map(example => (
                                  <code key={example} className="text-xs px-2 py-1 border border-codex-border text-codex-paper/60 font-mono">
                                  {example}
                                </code>
                              ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Application Guidelines */}
          {activeSection === 'application' && (
            <div className="animate-fade-in-up space-y-12">
              <h2 className="text-4xl font-display text-codex-paper">Application Guidelines</h2>
              
              <div className="grid gap-8">
                <div className="border border-codex-border p-8 bg-codex-bg relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-codex-gold via-codex-paper to-codex-gold opacity-20" />
                  <h3 className="text-xl font-display text-codex-paper mb-6">Hierarchical Tagging Strategy</h3>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { title: 'Character', rules: ['Max 2 archetypes', 'Max 3 functions', 'Explicit cognitive tags only'] },
                      { title: 'Episode', rules: ['Sequential Proppian funcs', 'Relevant rite tags', 'Max 5 dominant themes'] },
                      { title: 'Work', rules: ['Overarching themes', 'Primary cognitive funcs', 'Macro-functional patterns'] }
                    ].map((level, i) => (
                      <div key={i} className="bg-codex-obsidian/40 p-6 border border-codex-border/50">
                        <h4 className="font-display text-codex-gold mb-4 text-lg">{level.title}</h4>
                        <ul className="space-y-2">
                          {level.rules.map((rule, j) => (
                            <li key={j} className="text-xs text-codex-paper/60 flex gap-2">
                              <span className="text-codex-gold/50">•</span> {rule}
                          </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                        </div>
                      </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="border border-codex-border p-8">
                    <h3 className="font-display text-codex-paper mb-4">Context Sensitivity</h3>
                    <p className="text-sm text-codex-paper/60 leading-relaxed mb-4">
                      <strong className="text-codex-gold">Caution:</strong> Dumézil's trifunctional system is Indo-European specific. 
                      Proppian functions are best suited for heroic quest narratives.
                    </p>
                    <div className="text-xs font-mono text-codex-paper/40 border-l-2 border-codex-gold/30 pl-4">
                      ALWAYS VALIDATE AGAINST CULTURAL CONTEXT
                    </div>
                  </div>

                  <div className="border border-codex-border p-8">
                    <h3 className="font-display text-codex-paper mb-4">Precision &gt; Quantity</h3>
                    <ul className="space-y-3 text-sm">
                      <li className="flex gap-3">
                        <span className="text-green-500/80">✓</span>
                        <span className="text-codex-paper/80">Gilgamesh: <span className="font-mono text-xs text-codex-gold">ARCH_CULTURE_HERO</span></span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-red-500/80">✗</span>
                        <span className="text-codex-paper/40">Gilgamesh: [10 generic tags diluting analytical clarity]</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Technical Implementation */}
          {activeSection === 'technical' && (
            <div className="animate-fade-in-up space-y-12">
              <h2 className="text-4xl font-display text-codex-paper">Technical Architecture</h2>

                <div className="space-y-8">
                <div className="p-8 border border-codex-border bg-codex-obsidian/80">
                  <div className="flex items-center gap-3 mb-6">
                    <Database className="w-5 h-5 text-codex-gold" />
                    <h3 className="text-xl font-display text-codex-paper">PostgreSQL + pgvector</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <ul className="space-y-3 text-sm text-codex-paper/60">
                      <li className="flex gap-2"><span className="text-codex-gold">•</span> Structured storage for texts & taxonomies</li>
                      <li className="flex gap-2"><span className="text-codex-gold">•</span> 1536-dim Vector embeddings (OpenAI)</li>
                      <li className="flex gap-2"><span className="text-codex-gold">•</span> JSONB for flexible metadata</li>
                        </ul>
                    <div className="font-mono text-xs text-codex-paper/40 bg-black/40 p-4 border border-codex-border/50">
                      works (id, title, origin)<br/>
                      ├── chunks (embedding, text)<br/>
                      └── tags (entity_id, code)
                    </div>
                  </div>
                      </div>
                      
                <div className="p-8 border border-codex-border bg-codex-obsidian/80">
                  <div className="flex items-center gap-3 mb-6">
                    <Zap className="w-5 h-5 text-codex-gold" />
                    <h3 className="text-xl font-display text-codex-paper">Hybrid Search</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                      <div>
                      <h4 className="font-display text-codex-paper text-sm mb-2">Semantic</h4>
                      <p className="text-sm text-codex-paper/50 leading-relaxed">
                        Cosine similarity search for conceptual discovery ("heroes facing mortality").
                      </p>
                    </div>
                    <div>
                      <h4 className="font-display text-codex-paper text-sm mb-2">Structured</h4>
                      <p className="text-sm text-codex-paper/50 leading-relaxed">
                        Exact filtering using controlled vocabulary codes for precise retrieval.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Citations */}
          {activeSection === 'citations' && (
            <div className="animate-fade-in-up space-y-12">
              <h2 className="text-4xl font-display text-codex-paper">Bibliography</h2>
              
              <div className="space-y-12">
                <div className="space-y-6">
                  {[
                    "Atran, Scott. In Gods We Trust: The Evolutionary Landscape of Religion. Oxford University Press, 2002.",
                    "Bell, Catherine. Ritual: Perspectives and Dimensions. Oxford University Press, 1997.",
                    "Boyer, Pascal. Religion Explained. Basic Books, 2001.",
                    "Campbell, Joseph. The Hero with a Thousand Faces. Princeton University Press, 1949.",
                    "Dumézil, Georges. L'Idéologie Tripartie des Indo-Européens. Latomus, 1958.",
                    "Eliade, Mircea. The Myth of the Eternal Return. Princeton University Press, 1954.",
                    "Henrich, Joseph. The Secret of Our Success. Princeton University Press, 2015.",
                    "Propp, Vladimir. Morphology of the Folktale. University of Texas Press, 1968.",
                    "Thompson, Stith. Motif-Index of Folk-Literature. Indiana University Press, 1955-1958.",
                    "Witzel, Michael. The Origins of the World's Mythologies. Oxford University Press, 2012."
                  ].map((citation, i) => (
                    <div key={i} className="text-sm text-codex-paper/70 pl-8 -indent-8 leading-relaxed font-serif">
                      {citation}
                    </div>
                  ))}
                  </div>

                <div className="border-t border-codex-border pt-8 text-center">
                  <button className="inline-flex items-center gap-3 px-8 py-3 border border-codex-gold text-codex-gold hover:bg-codex-gold hover:text-codex-bg transition-all font-display text-sm uppercase tracking-widest">
                    <FileText className="w-4 h-4" />
                    Download Full Bibliography
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default MethodologyPage;
