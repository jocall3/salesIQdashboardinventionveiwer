
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Book, 
  FileText, 
  ChevronRight, 
  Search, 
  Menu, 
  X, 
  Brain,
  Zap,
  Activity,
  Award
} from 'lucide-react';
import { marked } from 'marked';
import mermaid from 'mermaid';

// --- Configuration ---
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'Courier Prime, monospace',
  flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' }
});

const BOOK_FILES = [
  "page-001-intro.md",
  "page-002-genui.md",
  "page-003-context.md",
  "001_generative_ui_background.md",
  "002_ai_contextual_prompt_suggestion.md",
  "003_narrative_generative_image_editing.md",
  "004_ai_financial_plan_for_goals.md",
  "005_biometric_confirmation_flow.md",
  "006_ai_subscription_detection.md",
  "007_ai_ad_copy_generation.md",
  "008_ai_business_plan_analysis.md",
  "009_ai_financial_simulation.md",
  "010_unified_crisis_communications_generation.md",
  "011_cognitive_load_balancing.md",
  "012_holographic_meeting_scribe.md",
  "013_post_quantum_cryptography_generation.md",
  "014_ai_concept_nft_minting.md",
  "015_adaptive_ui_layout_generation.md",
  "016_multi_objective_urban_planning.md",
  "017_personal_archive_querying.md",
  "018_ai_debate_adversary.md",
  "019_cultural_communication_simulation.md",
  "020_dynamic_audio_soundscape.md",
  "021_ai_legal_document_comparison.md",
  "021_advanced_prompt_engineering_details.md",
  "022_ai_technical_specification_comparison.md",
  "022_generative_financial_instrument_design.md",
  "023_ai_git_archeology.md",
  "024_predictive_supply_chain_disruption.md",
  "025_autonomous_code_refactoring_agent.md",
  "026_ethical_governor_for_ai_systems.md",
  "027_cybersecurity_action_governor.md",
  "027_semantic_data_compression.md"
];

// --- Components ---

// Fix: Explicitly type MermaidBlock as React.FC to allow standard React props like 'key' in .map()
const MermaidBlock: React.FC<{ code: string }> = ({ code }) => {
  const [svg, setSvg] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!code) return;
    const render = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, code);
        setSvg(svg);
      } catch (err) {
        console.error("Mermaid failed:", err);
      }
    };
    render();
  }, [code]);

  return (
    <div className="mermaid-wrapper my-8 bg-black/40 rounded-xl border border-white/10 p-4 overflow-x-auto flex justify-center">
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
};

const ContentRenderer = ({ content }: { content: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Split content by mermaid blocks to render them with the specific component
  const parts = content.split(/```mermaid([\s\S]*?)```/gm);

  return (
    <div ref={containerRef} className="prose prose-invert max-w-none">
      {parts.map((part, index) => {
        // Even indices are regular markdown
        if (index % 2 === 0) {
          return (
            <div 
              key={index} 
              dangerouslySetInnerHTML={{ __html: marked(part) }} 
            />
          );
        } else {
          // Odd indices are mermaid code
          return <MermaidBlock key={index} code={part.trim()} />;
        }
      })}
    </div>
  );
};

const App = () => {
  const [selectedFile, setSelectedFile] = useState<string>(BOOK_FILES[0]);
  const [fileContent, setFileContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadFile = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`book/${selectedFile}`);
        if (!response.ok) throw new Error("File not found");
        const text = await response.text();
        setFileContent(text);
      } catch (err) {
        setFileContent("# Error\nFailed to load documentation.");
      } finally {
        setIsLoading(false);
      }
    };
    loadFile();
  }, [selectedFile]);

  const filteredFiles = BOOK_FILES.filter(f => 
    f.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 flex overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-80' : 'w-0'
        } transition-all duration-300 border-r border-white/5 bg-[#0a0a0a] flex flex-col z-50`}
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="text-yellow-500 w-6 h-6" />
            <span className="font-black tracking-tighter uppercase text-white">Infinite Ledger</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-600" size={16} />
            <input 
              type="text"
              placeholder="Search Knowledge Base..."
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-yellow-500/50 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/5 px-2 pb-6">
          <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-4 mb-2 mt-4">
            Documentation
          </div>
          {filteredFiles.map((file) => (
            <button
              key={file}
              onClick={() => setSelectedFile(file)}
              className={`w-full text-left px-4 py-2 rounded-lg text-xs transition-all flex items-center justify-between group ${
                selectedFile === file 
                  ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' 
                  : 'text-gray-500 hover:bg-white/5 hover:text-gray-200'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <FileText size={14} className={selectedFile === file ? 'text-yellow-500' : 'text-gray-600'} />
                <span className="truncate">{file.replace('.md', '').replace(/_/g, ' ')}</span>
              </div>
              {selectedFile === file && <ChevronRight size={12} />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="bg-yellow-500/5 rounded-xl p-3 border border-yellow-500/10">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={14} className="text-yellow-500" />
              <span className="text-[10px] font-black text-white uppercase">System Status</span>
            </div>
            <p className="text-[9px] text-gray-500 leading-tight">Neural Link Stable. 100+ AIs Operational.</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 flex items-center px-8 justify-between bg-black/20 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className={`p-2 hover:bg-white/5 rounded-lg transition-colors ${isSidebarOpen ? 'hidden' : 'block'}`}
            >
              <Menu size={20} />
            </button>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-[0.2em]">Provenance Explorer</span>
              <h2 className="text-sm font-bold text-white uppercase tracking-tight">{selectedFile.replace('.md', '').replace(/_/g, ' ')}</h2>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2 text-gray-600 text-xs font-bold border border-white/10 px-3 py-1 rounded-full bg-white/5">
               <Activity size={12} className="text-emerald-500" /> LIVE NODE
             </div>
             <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-1.5 rounded-lg text-xs font-black uppercase transition-all active:scale-95">
               Export PDF
             </button>
          </div>
        </header>

        {/* Scrollable Document Area */}
        <div className="flex-1 overflow-y-auto p-10 bg-[#050505] scrollbar-thin scrollbar-thumb-white/5">
          <div className="max-w-4xl mx-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4" />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-600">Reconstructing Semantic Map...</span>
              </div>
            ) : (
              <div className="script-page shadow-2xl shadow-yellow-500/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ContentRenderer content={fileContent} />
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Footer */}
        <footer className="h-10 border-t border-white/5 flex items-center px-8 bg-black/40 justify-between text-[10px] font-bold text-gray-600 uppercase tracking-widest">
          <div>Ref: {selectedFile.toUpperCase()}</div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Award size={12} /> SECURE CRYPTOGRAPHIC HASH: {hashString(selectedFile)}</span>
            <span className="text-yellow-500/50">GEN-AI ARCHITECT 3.0</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

// Helper: Simple deterministic hash for UI fluff
function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).toUpperCase();
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
