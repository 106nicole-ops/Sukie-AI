import React, { useState, useEffect } from 'react';
import { Category, Scenario } from '../types';
import { X, Save, Plus, AlertCircle, Sparkles } from 'lucide-react';

interface AddScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (scenario: Scenario) => void;
  initialData?: Partial<Scenario> | null; // New prop for pre-filling
}

export const AddScenarioModal: React.FC<AddScenarioModalProps> = ({ isOpen, onClose, onAdd, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: 'learning' as Category,
    tags: '',
    oneLiner: '',
    logic: '',
    sop: ''
  });

  // Load initial data if provided (e.g. from AI)
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData(prev => ({
        ...prev,
        title: initialData.title || '',
        subtitle: initialData.subtitle || '',
        oneLiner: initialData.oneLiner || '',
        logic: initialData.logic || '',
        sop: initialData.sop || '',
        tags: initialData.tags ? initialData.tags.join(', ') : '',
        category: initialData.category || 'learning'
      }));
    } else if (isOpen && !initialData) {
       // Reset if opening fresh
       setFormData({
        title: '',
        subtitle: '',
        category: 'objection',
        tags: '',
        oneLiner: '',
        logic: '',
        sop: ''
      });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newScenario: Scenario = {
      id: Date.now().toString(),
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    };
    onAdd(newScenario);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-3xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              {initialData ? <Sparkles className="w-5 h-5 text-blue-600" /> : <Plus className="w-5 h-5 text-blue-600" />}
              {initialData ? '将 AI 灵感转化为战术' : '录入 Sukie 战术'}
            </h3>
            <p className="text-sm text-slate-500">
              {initialData ? '已自动为您填入 AI 的建议，请根据实际情况微调内容。' : '将实战经验转化为永久知识库'}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-50 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-slate-50">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">场景标题</label>
              <input 
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                placeholder="例如：客户嫌费率太贵"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">副标题 (核心打法)</label>
              <input 
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                placeholder="例如：六边形战士理论"
                value={formData.subtitle}
                onChange={e => setFormData({...formData, subtitle: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">分类</label>
              <div className="relative">
                <select 
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm appearance-none"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value as Category})}
                >
                  <option value="learning">个人战术库 (Long Term Learning)</option>
                  <option value="hook">The Hook (认知重构/开场)</option>
                  <option value="objection">Objection (深度异议)</option>
                  <option value="closing">Closing (促单/升维)</option>
                </select>
                <div className="absolute right-4 top-3.5 pointer-events-none text-slate-400">▼</div>
              </div>
            </div>
             <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">标签 (逗号分隔)</label>
              <input 
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                placeholder="心理博弈, 权威暗示..."
                value={formData.tags}
                onChange={e => setFormData({...formData, tags: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs">Level 1</span> 必杀金句 (One Liner)
            </label>
            <input 
              required
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
              placeholder="一句话让客户闭嘴或震惊"
              value={formData.oneLiner}
              onChange={e => setFormData({...formData, oneLiner: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <span className="bg-sky-100 text-sky-700 px-2 py-0.5 rounded text-xs">Level 2</span> 逻辑拆解
            </label>
            <textarea 
              required
              rows={4}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none shadow-sm leading-relaxed"
              placeholder="解释为什么要这么说，背后的心理学原理..."
              value={formData.logic}
              onChange={e => setFormData({...formData, logic: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs">Level 3</span> SOP 标准话术
            </label>
            <textarea 
              required
              rows={8}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-mono text-sm leading-7 shadow-sm"
              placeholder="输入完整的话术剧本..."
              value={formData.sop}
              onChange={e => setFormData({...formData, sop: e.target.value})}
            />
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 items-start">
             <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
             <p className="text-xs text-blue-700 leading-relaxed">
               <strong>提示：</strong> 您可以随时在列表页点击此战术进行查看。所有数据暂存于浏览器内存中，刷新页面后会重置（演示模式）。
             </p>
          </div>

        </form>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            放弃
          </button>
          <button 
            onClick={handleSubmit}
            className="px-6 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save className="w-4 h-4" /> 确认入库
          </button>
        </div>
      </div>
    </div>
  );
};