import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Scenario } from '../types';
import { Zap, Brain, MessageSquare, Copy, Check, Play, Volume2, Pencil, Save, X, Share2, Loader2, Shield } from 'lucide-react';

interface ScenarioCardProps {
  scenario: Scenario;
  battleMode: boolean;
  showAnswer: boolean;
  onReveal: () => void;
  hint: string | null;
  loadingHint: boolean;
  onGetHint: () => void;
  onUpdate: (updated: Scenario) => void;
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({
  scenario,
  battleMode,
  showAnswer,
  onReveal,
  hint,
  loadingHint,
  onGetHint,
  onUpdate
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Scenario>(scenario);
  const [isSharing, setIsSharing] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  // Sync formData when scenario prop changes (e.g. user selects different card)
  useEffect(() => {
    setFormData(scenario);
    setIsEditing(false);
  }, [scenario]);

  const handleCopy = () => {
    navigator.clipboard.writeText(scenario.sop);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(scenario);
    setIsEditing(false);
  };

  const handleShare = async () => {
    setIsSharing(true);
    // Give React time to render the hidden share view
    setTimeout(async () => {
        if (shareRef.current) {
            try {
                const canvas = await html2canvas(shareRef.current, {
                    scale: 2, // Higher resolution
                    backgroundColor: '#ffffff',
                    useCORS: true,
                });
                
                // Trigger download
                const url = canvas.toDataURL('image/png');
                const a = document.createElement('a');
                a.href = url;
                a.download = `Sukie_Tactic_${scenario.title.replace(/\s+/g, '_')}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } catch (err) {
                console.error("Share failed:", err);
            }
        }
        setIsSharing(false);
    }, 100);
  };

  // Render content based on mode
  const renderContent = () => {
    if (battleMode && !showAnswer) {
        return (
          <div className="flex flex-col items-center justify-center py-12 gap-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="relative">
                <div className="absolute -inset-4 bg-blue-500/10 rounded-full blur-xl"></div>
                <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Brain className="w-12 h-12 text-slate-300 group-hover:text-blue-600 transition-all duration-500 transform group-hover:scale-110" />
                </div>
            </div>
            
            <div className="max-w-md mx-auto space-y-5">
              <h3 className="text-2xl font-bold text-slate-900">客户抛出了异议...</h3>
              <p className="text-slate-500 text-lg leading-relaxed">
                不要急着回答。
                <br/>
                运用 Sukie 的<span className="text-slate-800 font-semibold">“底层逻辑”</span>构思你的反击。
              </p>
              
              {!hint ? (
                <button 
                  onClick={onGetHint}
                  disabled={loadingHint}
                  className="mt-4 px-6 py-2 rounded-full text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors disabled:opacity-50 font-semibold border border-blue-100"
                >
                  {loadingHint ? 'AI 军师正在分析局势...' : '🔮 求助 AI 军师 (获取提示)'}
                </button>
              ) : (
                <div className="bg-indigo-50/80 border border-indigo-100 rounded-xl p-5 text-indigo-800 text-base animate-in fade-in slide-in-from-top-4 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-400"></div>
                  <span className="font-bold block mb-1 text-xs uppercase tracking-widest opacity-70">Hint</span>
                  {hint}
                </div>
              )}
            </div>

            <button 
              onClick={onReveal}
              className="mt-4 bg-slate-900 hover:bg-blue-600 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-slate-900/10 hover:shadow-blue-600/30 transform hover:-translate-y-1"
            >
              揭晓战神话术
            </button>
          </div>
        );
    }

    if (isEditing) {
        return (
            <div className="space-y-8 animate-in fade-in duration-300">
                {/* Level 1 Edit */}
                <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="bg-amber-100 p-1 rounded-md"><Zap className="w-3.5 h-3.5 text-amber-600" /></span> Level 1: 必杀金句
                    </h4>
                    <input
                        value={formData.oneLiner}
                        onChange={(e) => setFormData({...formData, oneLiner: e.target.value})}
                        className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-lg font-serif italic text-slate-800"
                    />
                </div>

                 {/* Level 2 Edit */}
                 <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="bg-sky-100 p-1 rounded-md"><Brain className="w-3.5 h-3.5 text-sky-600" /></span> Level 2: 逻辑拆解
                    </h4>
                    <textarea
                        rows={5}
                        value={formData.logic}
                        onChange={(e) => setFormData({...formData, logic: e.target.value})}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none leading-relaxed"
                    />
                </div>

                 {/* Level 3 Edit */}
                 <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="bg-emerald-100 p-1 rounded-md"><MessageSquare className="w-3.5 h-3.5 text-emerald-600" /></span> Level 3: SOP 标准话术
                    </h4>
                    <textarea
                        rows={10}
                        value={formData.sop}
                        onChange={(e) => setFormData({...formData, sop: e.target.value})}
                        className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-mono text-sm leading-7 text-slate-200"
                    />
                </div>
                
                {/* Edit Actions */}
                <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                    <button 
                        onClick={handleCancel}
                        className="px-6 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-bold transition-colors flex items-center gap-2"
                    >
                        <X className="w-4 h-4" /> 取消
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" /> 保存修改
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Level 1 */}
            <section className="animate-in slide-in-from-bottom-4 duration-500">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="bg-amber-100 p-1 rounded-md"><Zap className="w-3.5 h-3.5 text-amber-600" /></span> Level 1: 必杀金句
              </h4>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-700"></div>
                <div className="relative p-8 bg-white rounded-2xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
                  <p className="text-xl md:text-3xl font-serif italic text-slate-800 leading-relaxed">
                    {scenario.oneLiner}
                  </p>
                </div>
              </div>
            </section>

            {/* Level 2 */}
            <section className="animate-in slide-in-from-bottom-6 duration-700 delay-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="bg-sky-100 p-1 rounded-md"><Brain className="w-3.5 h-3.5 text-sky-600" /></span> Level 2: 逻辑拆解
              </h4>
              <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200/60 text-slate-700 leading-loose text-base shadow-inner">
                {scenario.logic}
              </div>
            </section>

            {/* Level 3 */}
            <section className="animate-in slide-in-from-bottom-8 duration-700 delay-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="bg-emerald-100 p-1 rounded-md"><MessageSquare className="w-3.5 h-3.5 text-emerald-600" /></span> Level 3: SOP 标准话术
                </h4>
                <button 
                  onClick={handleCopy}
                  className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-all font-medium shadow-sm"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? '已复制' : '复制话术'}
                </button>
              </div>
              <div className="p-8 bg-slate-900 rounded-2xl border border-slate-800 text-slate-200 font-mono text-[15px] leading-8 whitespace-pre-line select-text shadow-xl shadow-slate-900/10">
                {scenario.sop}
              </div>
            </section>

             {/* Level 4 Mockup */}
             <section className="animate-in slide-in-from-bottom-10 duration-700 delay-300 pb-4 opacity-50 hover:opacity-100 transition-opacity">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="bg-slate-100 p-1 rounded-md"><Volume2 className="w-3.5 h-3.5 text-slate-500" /></span> Level 4: 实战录音
                </h4>
                <div className="bg-white rounded-xl p-4 flex items-center gap-4 border border-slate-200 shadow-sm cursor-not-allowed group">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-200 transition-colors">
                    <Play className="w-4 h-4 ml-0.5" />
                  </div>
                  <div className="flex-1">
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden w-full">
                      <div className="h-full w-0 bg-blue-500"></div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">Coming Soon</span>
                </div>
              </section>
        </>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-[24px] overflow-hidden relative border border-slate-200 shadow-xl shadow-slate-200/60 ring-1 ring-slate-100">
      {/* Header */}
      <div className="p-8 pb-6 border-b border-slate-100 bg-gradient-to-b from-slate-50/80 to-white flex justify-between items-start">
        <div className="flex-1 mr-4">
            <div className="flex flex-wrap items-center gap-2 mb-5">
            {scenario.tags.map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100/50 shadow-sm">
                {tag}
                </span>
            ))}
            {battleMode && (
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-50 text-rose-500 border border-rose-100 animate-pulse">
                ⚔️ 对战模式
                </span>
            )}
            </div>
            {isEditing ? (
                <div className="space-y-3 mb-3">
                    <input 
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full text-3xl font-extrabold text-slate-900 border-b border-slate-200 focus:border-blue-500 outline-none py-1 bg-transparent"
                        placeholder="标题"
                    />
                    <input 
                        value={formData.subtitle}
                        onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                        className="w-full text-lg text-slate-500 font-medium border-b border-slate-200 focus:border-blue-500 outline-none py-1 bg-transparent"
                        placeholder="副标题"
                    />
                </div>
            ) : (
                <>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight leading-tight">{scenario.title}</h2>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed">{scenario.subtitle}</p>
                </>
            )}
        </div>
        
        {/* Header Actions */}
        {!battleMode && !isEditing && (
            <div className="flex gap-2 shrink-0">
                 <button 
                    onClick={handleShare}
                    className="p-2.5 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100 group"
                    title="生成分享图片"
                >
                    {isSharing ? <Loader2 className="w-5 h-5 animate-spin text-blue-600" /> : <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                </button>
                <button 
                    onClick={() => setIsEditing(true)}
                    className="p-2.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200 group"
                    title="编辑战术"
                >
                    <Pencil className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
            </div>
        )}
      </div>

      {/* Content */}
      <div className="p-8 space-y-10 flex-1 overflow-y-auto custom-scrollbar bg-white">
        {renderContent()}
      </div>

      {/* Hidden Share View (Generated Image Template) */}
      {isSharing && (
        <div ref={shareRef} className="fixed left-[-9999px] top-0 w-[800px] bg-slate-50 p-12 rounded-none">
            {/* Share Header */}
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-200">
                <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-500/30">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Sukie AI</h1>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Sales Warlord System</p>
                </div>
            </div>

            {/* Share Content */}
            <div className="space-y-8">
                <div>
                    <h2 className="text-4xl font-extrabold text-slate-900 mb-2">{scenario.title}</h2>
                    <p className="text-xl text-slate-500 font-medium">{scenario.subtitle}</p>
                    <div className="flex gap-2 mt-4">
                        {scenario.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-blue-100 text-blue-700">
                            {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" /> 必杀金句
                    </h4>
                    <p className="text-2xl font-serif italic text-slate-800 leading-relaxed">
                        {scenario.oneLiner}
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Brain className="w-4 h-4 text-sky-500" /> 逻辑拆解
                    </h4>
                    <p className="text-slate-700 leading-loose text-lg">
                        {scenario.logic}
                    </p>
                </div>

                <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-emerald-500" /> SOP 标准话术
                    </h4>
                    <p className="font-mono text-base leading-8 text-slate-200 whitespace-pre-line">
                        {scenario.sop}
                    </p>
                </div>
            </div>

            {/* Share Footer */}
            <div className="mt-10 pt-6 border-t border-slate-200 flex justify-between items-center text-slate-400 text-sm font-medium">
                <p>Generated by Sukie AI</p>
                <p>sukie-ai.app</p>
            </div>
        </div>
      )}
    </div>
  );
};