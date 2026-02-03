import React, { useState } from 'react';
import { SCENARIOS } from './data';
import { Scenario } from './types';
import { ScenarioCard } from './components/ScenarioCard';
import { AILab } from './components/AILab';
import { AddScenarioModal } from './components/AddScenarioModal';
import { getTacticalHint } from './services/geminiService';
import { 
  Shield, Target, Zap, Brain, Sword, Sparkles, 
  Menu, X, PlusCircle, Bookmark, BookOpen
} from 'lucide-react';

const App: React.FC = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>(SCENARIOS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [battleMode, setBattleMode] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [battleHint, setBattleHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);
  const [prefilledScenarioData, setPrefilledScenarioData] = useState<Partial<Scenario> | null>(null);

  const currentScenario = scenarios.find(s => s.id === selectedId);

  const startRandomBattle = () => {
    const random = scenarios[Math.floor(Math.random() * scenarios.length)];
    setSelectedId(random.id);
    setBattleMode(true);
    setShowAnswer(false);
    setBattleHint(null);
    setIsMobileMenuOpen(false);
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setBattleMode(false);
    setShowAnswer(true);
    setBattleHint(null);
    setIsMobileMenuOpen(false);
  };

  const handleGetHint = async () => {
    if (!currentScenario) return;
    setLoadingHint(true);
    const hint = await getTacticalHint(currentScenario.title, currentScenario.logic);
    setBattleHint(hint);
    setLoadingHint(false);
  };

  const handleAddScenario = (newScenario: Scenario) => {
    setScenarios(prev => [newScenario, ...prev]);
    setSelectedId(newScenario.id);
    setBattleMode(false);
    setShowAnswer(true);
    setPrefilledScenarioData(null); // Clear data after adding
  };

  const handleUpdateScenario = (updatedScenario: Scenario) => {
    setScenarios(prev => prev.map(s => s.id === updatedScenario.id ? updatedScenario : s));
  };

  // Logic to parse AI response into Scenario fields
  const handleSaveToLibrary = (text: string) => {
    // 1. Helper to strip Markdown artifacts (###, **, etc.)
    const cleanText = (str: string) => {
        if (!str) return '';
        return str
            .replace(/\*\*/g, '')          // Remove bold markers (**)
            .replace(/^#+\s*/gm, '')       // Remove headers (### ) at start of lines
            .replace(/`/g, '')             // Remove code ticks
            .replace(/^[-*]\s+/gm, '• ')   // Convert list bullets to dots for cleaner plain text
            .trim();
    };

    // 2. Enhanced Extraction Logic
    // We try to match sections loosely, ignoring Markdown headers in the match logic
    
    // Extract Title (If AI provides one explicitly, though usually it doesn't)
    // Assuming user will set title, or we default it.

    // Extract Level 1 (One Liner)
    // Matches: "1. ", "Level 1:", "### 1.", "金句:"
    const oneLinerMatch = text.match(/(?:#*\s*1\.|Level\s*1|The Hook|金句|One Liner)[：:\s]([\s\S]*?)(?=\n\n|\n(?:#*\s*2\.|Level\s*2|Logic|逻辑)|$)/i);
    
    // Extract Level 2 (Logic)
    const logicMatch = text.match(/(?:#*\s*2\.|Level\s*2|Logic|逻辑|Metaphor)[：:\s]([\s\S]*?)(?=\n\n|\n(?:#*\s*3\.|Level\s*3|SOP|话术)|$)/i);

    // Extract Level 3 (SOP)
    const sopMatch = text.match(/(?:#*\s*3\.|Level\s*3|SOP|话术|Closing)[：:\s]([\s\S]*?)$/i);

    let oneLiner = oneLinerMatch ? oneLinerMatch[1] : "";
    let logic = logicMatch ? logicMatch[1] : "";
    let sop = sopMatch ? sopMatch[1] : "";

    // Fallback: If structure is missing, put everything in SOP but still clean it
    if (!oneLiner && !logic && !sop) {
        sop = text;
    }

    const prefilledData: Partial<Scenario> = {
        title: "来自 Sukie AI 的战术", 
        subtitle: "AI 智能生成",
        oneLiner: cleanText(oneLiner),
        logic: cleanText(logic),
        sop: cleanText(sop),
        tags: ['AI生成', '新战术'],
        category: 'learning'
    };

    setPrefilledScenarioData(prefilledData);
    setIsAIModalOpen(false); // Close Chat
    setTimeout(() => setIsAddModalOpen(true), 200); // Open Add Modal with delay
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/30">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900">Sukie AI</h1>
              <p className="text-[10px] text-slate-500 font-mono hidden sm:block font-bold">SALES WARLORD SYSTEM v3.5</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="hidden lg:inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100 font-mono">
              17% IS THE NEW ZERO
            </span>

            <button 
              onClick={() => {
                setPrefilledScenarioData(null);
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-full text-sm font-bold transition-all border border-slate-200 hover:border-slate-300 shadow-sm"
            >
              <PlusCircle className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">录入战术</span>
            </button>

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-900"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-12 flex flex-col lg:flex-row gap-6 h-[calc(100vh-1rem)] lg:h-screen lg:pt-24 lg:pb-6">
        
        {/* Sidebar (Desktop + Mobile) */}
        <aside className={`
          fixed lg:static inset-0 z-30 bg-white lg:bg-transparent lg:w-1/3 lg:block
          transition-transform duration-300 flex flex-col gap-5 lg:overflow-hidden
          ${isMobileMenuOpen ? 'translate-x-0 p-4 pt-20' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full flex flex-col gap-4 lg:pr-2">
             
             {/* New Feature Cards Area */}
             <div className="grid grid-cols-2 gap-3 shrink-0">
                {/* Sukie AI Card (New Location) */}
                <div 
                  onClick={() => setIsAIModalOpen(true)}
                  className="cursor-pointer bg-gradient-to-br from-blue-600 to-indigo-700 p-0.5 rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  <div className="bg-transparent h-full p-4 flex flex-col justify-between relative z-10">
                    <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm mb-3">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight mb-0.5">Sukie AI</h3>
                      <p className="text-[10px] text-blue-100 font-medium">智能拆解异议</p>
                    </div>
                  </div>
                </div>

                {/* Battle Mode Card */}
                <div 
                  onClick={startRandomBattle}
                  className="cursor-pointer bg-white border border-slate-200 p-4 rounded-2xl shadow-sm hover:shadow-md hover:border-rose-200 transition-all duration-300 transform hover:-translate-y-1 group"
                >
                   <div className="bg-rose-50 w-8 h-8 rounded-full flex items-center justify-center mb-3 group-hover:bg-rose-100 transition-colors">
                      <Sword className="w-4 h-4 text-rose-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 leading-tight mb-0.5 group-hover:text-rose-600 transition-colors">模拟对战</h3>
                      <p className="text-[10px] text-slate-400">随机高压训练</p>
                    </div>
                </div>
             </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pb-20 lg:pb-0 bg-white lg:bg-transparent rounded-2xl lg:rounded-none p-4 lg:p-0 border border-slate-100 lg:border-none shadow-sm lg:shadow-none">
               <CategorySection title="个人战术库 (Long Term Learning)" icon={<BookOpen className="w-4 h-4 text-indigo-500"/>} color="indigo">
                  {scenarios.filter(s => s.category === 'learning').map(item => (
                    <SidebarItem key={item.id} item={item} isActive={selectedId === item.id} onClick={() => handleSelect(item.id)} color="indigo" />
                  ))}
               </CategorySection>

               <CategorySection title="The Hook (认知重构)" icon={<Brain className="w-4 h-4 text-sky-500"/>} color="sky">
                  {scenarios.filter(s => s.category === 'hook').map(item => (
                    <SidebarItem key={item.id} item={item} isActive={selectedId === item.id} onClick={() => handleSelect(item.id)} color="sky" />
                  ))}
               </CategorySection>
               
               <CategorySection title="Objection (深度异议)" icon={<Shield className="w-4 h-4 text-rose-500"/>} color="rose">
                  {scenarios.filter(s => s.category === 'objection').map(item => (
                    <SidebarItem key={item.id} item={item} isActive={selectedId === item.id} onClick={() => handleSelect(item.id)} color="rose" />
                  ))}
               </CategorySection>

               <CategorySection title="Closing (促单升维)" icon={<Target className="w-4 h-4 text-emerald-500"/>} color="emerald">
                  {scenarios.filter(s => s.category === 'closing').map(item => (
                    <SidebarItem key={item.id} item={item} isActive={selectedId === item.id} onClick={() => handleSelect(item.id)} color="emerald" />
                  ))}
               </CategorySection>
            </div>
          </div>
        </aside>

        {/* Main Display Area */}
        <section className="flex-1 h-full lg:overflow-hidden">
          {currentScenario ? (
            <ScenarioCard 
              scenario={currentScenario}
              battleMode={battleMode}
              showAnswer={showAnswer}
              onReveal={() => setShowAnswer(true)}
              hint={battleHint}
              loadingHint={loadingHint}
              onGetHint={handleGetHint}
              onUpdate={handleUpdateScenario}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white/50 rounded-[24px] border-2 border-dashed border-slate-200 hover:border-blue-200 transition-colors group">
               <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-slate-200/50 border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                 <Zap className="w-10 h-10 text-slate-300 group-hover:text-blue-500 transition-colors" />
               </div>
               <h3 className="text-2xl font-bold text-slate-800 mb-3">战神待命</h3>
               <p className="text-slate-500 max-w-sm leading-relaxed">
                 请点击左上角的 <span className="font-bold text-blue-600">Sukie AI</span> 询问异议，<br/>
                 或选择一个场景开始训练。
               </p>
            </div>
          )}
        </section>
      </main>

      <AILab 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
        onSaveToLibrary={handleSaveToLibrary}
      />
      <AddScenarioModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddScenario}
        initialData={prefilledScenarioData}
      />
    </div>
  );
};

// Sub-components for cleaner App.tsx
const CategorySection = ({ title, icon, color, children }: any) => (
  <div>
    <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 px-2 flex items-center gap-2 text-${color}-600`}>
      {icon} {title}
    </h3>
    <div className="space-y-1">
      {children}
    </div>
  </div>
);

const SidebarItem = ({ item, isActive, onClick, color }: any) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-3 rounded-xl transition-all duration-200 border group ${
      isActive 
        ? `bg-${color}-50 border-${color}-200 text-slate-900 shadow-sm` 
        : 'bg-white border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-200'
    }`}
  >
    <div className="flex justify-between items-center mb-1">
      <span className="font-bold text-sm truncate">{item.title}</span>
      {isActive && <div className={`w-2 h-2 rounded-full bg-${color}-500 shadow-sm`}></div>}
    </div>
    <p className={`text-xs truncate ${isActive ? `text-${color}-600` : 'text-slate-400 group-hover:text-slate-500'}`}>
      {item.subtitle}
    </p>
  </button>
);

export default App;