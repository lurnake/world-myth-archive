/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Search, Sparkles, BookOpen, Globe, ArrowRight, Layers, Database, Network } from 'lucide-react';

const LandingPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        setIsVisible(prev => ({
          ...prev,
          [entry.target.id]: entry.isIntersecting
        }));
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-animate]').forEach(el => {
      observer.observe(el);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const features = [
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Multi-Layered Analysis",
      description: "6 comprehensive taxonomies covering archetypes, functions, themes, and cognitive patterns"
    },
    {
      icon: <Network className="w-6 h-6" />,
      title: "Cross-Cultural Framework",
      description: "Systematic comparison across mythological traditions from Mesopotamian to Modern"
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Digital Scholarship",
      description: "Computational methods meet traditional mythology studies"
    }
  ];

  const stats = [
    { number: "6", label: "Analytical Frameworks" },
    { number: "37+", label: "Analyzed Figures" },
    { number: "111", label: "Taxonomic Categories" }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated background gradient - mythological theme */}
      <div className="fixed inset-0 opacity-30">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-amber-900 via-purple-900 to-indigo-900"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900 via-purple-900 to-amber-900 mix-blend-multiply" />
      </div>

      {/* Ancient script particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-amber-400/20 text-2xl animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          >
            {['𒀭', '𒌦', '𒊩', '𒈨', '𒆠'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>

      {/* Ancient ruins silhouette */}
      <div className="fixed bottom-0 left-0 right-0 h-96 pointer-events-none overflow-hidden">
        <svg viewBox="0 0 1440 400" className="absolute bottom-0 w-full h-full opacity-10">
          <path d="M0,400 L0,350 L100,340 L100,300 L150,300 L150,280 L200,280 L200,340 L300,340 L300,250 L350,250 L350,240 L400,240 L400,250 L450,250 L450,340 L550,340 L550,320 L600,320 L600,280 L650,280 L650,320 L700,320 L700,340 L800,340 L800,300 L850,300 L850,260 L900,260 L900,300 L950,300 L950,340 L1050,340 L1050,310 L1100,310 L1100,270 L1150,270 L1150,310 L1200,310 L1200,340 L1300,340 L1300,320 L1350,320 L1350,300 L1400,300 L1400,340 L1440,340 L1440,400 Z" 
                fill="url(#ruins-gradient)" />
          <defs>
            <linearGradient id="ruins-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{stopColor:'rgb(251, 191, 36)', stopOpacity:0.2}} />
              <stop offset="100%" style={{stopColor:'rgb(251, 191, 36)', stopOpacity:0}} />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="max-w-7xl mx-auto text-center z-10">
          {/* Animated title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 relative">
            <span className="inline-block animate-fade-in-up">Mythological</span>{' '}
            <span className="inline-block animate-fade-in-up animation-delay-200">Analysis</span>{' '}
            <span className="inline-block animate-fade-in-up animation-delay-400 bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 bg-clip-text text-transparent">
              Framework
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto animate-fade-in-up animation-delay-600 leading-relaxed">
            A revolutionary digital humanities project combining cognitive science, anthropology, and computational methods to decode the universal patterns of human mythology.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => window.location.href = '/search'}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-600 to-red-600 rounded-full text-lg font-semibold transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/25 animate-fade-in-up animation-delay-800"
          >
            <BookOpen className="w-5 h-5" />
            <span>Start Exploring</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            
            {/* Button glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-600 to-red-600 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
          </button>

          {/* Subtitle badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 animate-fade-in-up animation-delay-1000">
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20">
              Epic of Gilgamesh Pilot
            </span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20">
              Open Source
            </span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20">
              Academic Research
            </span>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-scroll" />
            </div>
          </div>
        </div>
      </section>

      {/* What We Analyze Section */}
      <section id="analysis" data-animate className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-4xl md:text-5xl font-bold text-center mb-16 transition-all duration-1000 ${
            isVisible.analysis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Three-Tiered Analytical Framework
          </h2>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className={`text-center transition-all duration-700 ${
              isVisible.analysis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <div className="text-6xl mb-4">👤</div>
              <h3 className="text-2xl font-semibold mb-3 text-amber-400">Character Level</h3>
              <p className="text-gray-400 mb-4">Archetypal roles, divine functions, and psychological patterns of mythological figures</p>
              <div className="text-xs text-gray-500 italic">
                e.g., Gilgamesh: Culture Hero (Jung), Sovereignty Function (Dumézil), Costly Signaling (Boyer)
              </div>
            </div>
            <div className={`text-center transition-all duration-700 delay-200 ${
              isVisible.analysis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <div className="text-6xl mb-4">📜</div>
              <h3 className="text-2xl font-semibold mb-3 text-orange-400">Episode Level</h3>
              <p className="text-gray-400 mb-4">Narrative functions, ritual elements, and thematic content of story segments</p>
              <div className="text-xs text-gray-500 italic">
                e.g., Cedar Forest: Violation (Propp #8), Hero's Trial, Liminal Space (van Gennep)
              </div>
            </div>
            <div className={`text-center transition-all duration-700 delay-400 ${
              isVisible.analysis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-semibold mb-3 text-red-400">Work Level</h3>
              <p className="text-gray-400 mb-4">Overall patterns, cultural functions, and comparative elements across texts</p>
              <div className="text-xs text-gray-500 italic">
                e.g., Epic of Gilgamesh: Mortality Theme, Social Charter (Malinowski), Memory Enhancement (Henrich)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Taxonomies Section */}
      <section id="taxonomies" data-animate className="relative py-24 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-4xl md:text-5xl font-bold text-center mb-8 transition-all duration-1000 ${
            isVisible.taxonomies ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Eight Research-Based Lexicons
          </h2>
          <p className={`text-xl text-gray-400 text-center mb-16 max-w-4xl mx-auto transition-all duration-1000 ${
            isVisible.taxonomies ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Each controlled vocabulary is rigorously derived from established academic works in mythology, anthropology, folklore, and cognitive science
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Theme Tags",
                count: 20,
                source: "Thompson & Witzel",
                example: "Creation, Death, Transformation",
                description: "From Stith Thompson's Motif-Index and Michael Witzel's comparative studies"
              },
              {
                name: "Proppian Functions",
                count: 31,
                source: "Vladimir Propp",
                example: "Departure, Violation, Victory",
                description: "Complete implementation of Propp's Morphology of the Folktale (1928)"
              },
              {
                name: "Character Archetypes",
                count: 17,
                source: "Jung & Campbell",
                example: "Hero, Shadow, Trickster",
                description: "Jungian archetypes and Campbell's monomyth patterns"
              },
              {
                name: "Ritual Categories",
                count: 17,
                source: "van Gennep & Bell",
                example: "Initiation, Liminality, Sacrifice",
                description: "Based on van Gennep's rites of passage and Bell's ritual theory"
              },
              {
                name: "Cognitive Functions",
                count: 12,
                source: "Boyer, Atran & Henrich",
                example: "HADD, MCI Concepts, Costly Signaling",
                description: "Evolutionary psychology of religion and cultural transmission"
              },
              {
                name: "Social Functions",
                count: 14,
                source: "Dumézil & Jakobson",
                example: "Sovereignty, Warrior, Fertility",
                description: "Including Dumézil's trifunctional hypothesis and structuralist analysis"
              }
            ].map((taxonomy, index) => (
              <div
                key={index}
                className={`group relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10 transition-all duration-700 hover:scale-105 hover:border-amber-500/50 ${
                  isVisible.taxonomies ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold">{taxonomy.name}</h3>
                  <span className="text-2xl font-bold text-amber-500">{taxonomy.count}</span>
                </div>
                <p className="text-xs text-amber-400 mb-2">{taxonomy.source}</p>
                <p className="text-sm text-gray-400 italic mb-3">{taxonomy.example}</p>
                <p className="text-xs text-gray-500">{taxonomy.description}</p>
                
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-600/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
              </div>
            ))}
          </div>

          <div className={`mt-12 text-center transition-all duration-1000 ${
            isVisible.taxonomies ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`} style={{ transitionDelay: '600ms' }}>
            <p className="text-gray-400 mb-4">
              Plus specialized vocabularies for Myth Episodes (Witzel), Myth Types (Dundes, Honko), and extensible entity catalogs
            </p>
            <a href="/methodology" className="text-amber-400 hover:text-amber-300 transition-colors underline">
              View Full Methodology →
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" data-animate className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-4xl md:text-5xl font-bold text-center mb-16 transition-all duration-1000 ${
            isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Rigorous Methodology Meets Digital Innovation
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Layers className="w-6 h-6" />,
                title: "Theory-Driven Design",
                description: "Integrates 70+ years of scholarship from Propp (1928) to Henrich (2020), ensuring each tag has clear academic provenance and theoretical justification"
              },
              {
                icon: <Network className="w-6 h-6" />,
                title: "Comparative Framework",
                description: "Enables systematic cross-cultural analysis using controlled vocabularies validated against established folkloristic and anthropological categories"
              },
              {
                icon: <Database className="w-6 h-6" />,
                title: "Computational Rigor",
                description: "Machine-readable taxonomies with unique identifiers, enabling reproducible research, semantic embeddings, and large-scale corpus analysis"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`group relative p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 transition-all duration-700 hover:bg-white/10 hover:scale-105 hover:border-white/20 ${
                  isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-600/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" data-animate className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className={`text-4xl md:text-5xl font-bold mb-16 transition-all duration-1000 ${
            isVisible.impact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Academic Applications & Research Impact
          </h2>

          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div className={`transition-all duration-700 ${
              isVisible.impact ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
              <div className="text-5xl mb-4">🎓</div>
              <h3 className="text-2xl font-semibold mb-3">Research Innovation</h3>
              <p className="text-gray-400">Enable new research questions through systematic tagging: trace archetypal evolution, map ritual transformations, quantify narrative structures</p>
            </div>
            <div className={`transition-all duration-700 delay-200 ${
              isVisible.impact ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-semibold mb-3">Quantitative Analysis</h3>
              <p className="text-gray-400">Statistical analysis of mythological patterns, network analysis of character relationships, computational testing of theoretical hypotheses</p>
            </div>
            <div className={`transition-all duration-700 delay-400 ${
              isVisible.impact ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-2xl font-semibold mb-3">Interdisciplinary Bridge</h3>
              <p className="text-gray-400">Connect folklore studies, religious studies, anthropology, psychology, and digital humanities through shared analytical framework</p>
            </div>
          </div>

          {/* Use Cases */}
          <div className={`bg-white/5 rounded-2xl p-8 mb-12 transition-all duration-1000 ${
            isVisible.impact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`} style={{ transitionDelay: '600ms' }}>
            <h3 className="text-xl font-semibold mb-6">Example Research Applications</h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="flex gap-3">
                <span className="text-amber-400">•</span>
                <div>
                  <strong className="text-gray-200">Cognitive Anthropology:</strong>
                  <span className="text-gray-400"> Test Boyer's MCI hypothesis across 50+ mythological traditions</span>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-amber-400">•</span>
                <div>
                  <strong className="text-gray-200">Comparative Literature:</strong>
                  <span className="text-gray-400"> Trace hero archetype variations from Gilgamesh to modern narratives</span>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-amber-400">•</span>
                <div>
                  <strong className="text-gray-200">Digital Folkloristics:</strong>
                  <span className="text-gray-400"> Apply Proppian analysis at scale to identify structural patterns</span>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-amber-400">•</span>
                <div>
                  <strong className="text-gray-200">Religious Studies:</strong>
                  <span className="text-gray-400"> Map ritual transformations and their mythological representations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 py-12 border-t border-b border-white/10">
            {[
              { number: "8", label: "Theory-Based Lexicons" },
              { number: "111+", label: "Controlled Terms" },
              { number: "3", label: "Analytical Levels" }
            ].map((stat, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  isVisible.impact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-400 to-red-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Ready to Transform Your Research?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Access 111+ controlled terms across 8 theoretical frameworks. Analyze mythological narratives with unprecedented precision and scholarly rigor.
          </p>
          
          <button
            onClick={() => window.location.href = '/search'}
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full text-lg font-bold transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/25"
          >
            <Search className="w-6 h-6" />
            <span>Explore the Archive</span>
            <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
          </button>

          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Open Source</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              <span>Peer-Reviewed Sources</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>API Available</span>
            </div>
          </div>

          <p className="mt-8 text-gray-500 text-sm">
            Currently featuring the Epic of Gilgamesh • Greek & Norse mythologies coming Q2 2025
          </p>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </section>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(5deg);
          }
          66% {
            transform: translateY(-5px) rotate(-5deg);
          }
        }

        @keyframes scroll {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(10px);
            opacity: 0;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-600 {
          animation-delay: 600ms;
        }

        .animation-delay-800 {
          animation-delay: 800ms;
        }

        .animation-delay-1000 {
          animation-delay: 1000ms;
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-scroll {
          animation: scroll 1.5s ease-in-out infinite;
        }

        .delay-200 {
          transition-delay: 200ms;
        }

        .delay-400 {
          transition-delay: 400ms;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
