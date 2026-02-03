import React, { useState, useRef, useEffect } from 'react';
import { generateSukieResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { X, Sparkles, Send, Loader2, User, Bot, RefreshCw, BookmarkPlus } from 'lucide-react';

interface AILabProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveToLibrary: (text: string) => void;
}

// Robust Markdown Parser Component
const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
  const processText = (input: string) => {
    const lines = input.split('\n');
    return lines.map((line, index) => {
      let content = line.trim(); // Handle leading whitespace
      
      // Handle Headers (###, ####, etc.)
      // Regex to catch 3 or more hashes followed by text
      const headerMatch = content.match(/^(#{3,6})\s+(.*)/);
      if (headerMatch) {
          const level = headerMatch[1].length;
          const headerText = headerMatch[2];
          
          if (level === 3) {
             return <h3 key={index} className="text-lg font-bold text-blue-100 mt-6 mb-3">{processInline(headerText)}</h3>;
          }
          if (level >= 4) {
             return <h4 key={index} className="text-sm font-bold text-blue-300 mt-4 mb-2 uppercase tracking-wide border-l-2 border-blue-500 pl-2">{processInline(headerText)}</h4>;
          }
      }

      // Handle Lists (- )
      if (content.startsWith('- ') || content.startsWith('* ')) {
        return (
          <div key={index} className="flex gap-3 ml-1 mb-2">
             <span className="text-blue-400 mt-1.5 shrink-0">•</span>
             <p className="leading-relaxed text-slate-100">{processInline(content.replace(/^[-*]\s+/, ''))}</p>
          </div>
        );
      }

      // Handle separator (---)
      if (content === '---' || content === '***') {
        return <hr key={index} className="border-white/10 my-6" />;
      }

      // Empty lines
      if (content === '') {
        return <div key={index} className="h-3" />;
      }

      return <p key={index} className="leading-8 mb-2 text-[15px]">{processInline(content)}</p>;
    });
  };

  const processInline = (text: string): React.ReactNode[] => {
    // Regex matches **bold**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-extrabold text-white bg-blue-500/30 px-1.5 py-0.5 rounded text-shadow-sm box-decoration-clone">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return <div>{processText(text)}</div>;
};

export const AILab: React.FC<AILabProps> = ({ isOpen, onClose, onSaveToLibrary }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'model', text: '我是 Sukie。给我一个最刁钻的异议，我教你如何用降维打击的方式赢回来。' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textInput: string = input) => {
    if (!textInput.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: textInput };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
        const context = messages.map(m => `${m.role}: ${m.text}`).join('\n');
        const responseText = await generateSukieResponse(userMsg.text, context);
        const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
        setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
        const errorMsg: ChatMessage = { id: Date.now().toString(), role: 'model', text: "网络连接似乎中断了，请稍后再试。" };
        setMessages(prev => [...prev, errorMsg]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (isLoading || messages.length === 0) return;
    
    // Ensure the last message is from the model before regenerating
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role !== 'model') return;

    setIsLoading(true);

    // Get history excluding the last AI message we want to replace
    const historyWithoutLastAI = messages.slice(0, -1);
    const lastUserMsg = historyWithoutLastAI[historyWithoutLastAI.length - 1];

    if (!lastUserMsg || lastUserMsg.role !== 'user') {
        setIsLoading(false);
        return;
    }

    // Optimistically update UI to remove old message
    setMessages(historyWithoutLastAI);

    try {
        // Construct context from previous messages
        const context = historyWithoutLastAI.slice(0, -1).map(m => `${m.role}: ${m.text}`).join('\n');
        // Call API again
        const responseText = await generateSukieResponse(lastUserMsg.text, context);
        
        const aiMsg: ChatMessage = { id: Date.now().toString(), role: 'model', text: responseText };
        setMessages([...historyWithoutLastAI, aiMsg]);
    } catch (e) {
        // Restore old message if fail? Or show error.
        setMessages([...historyWithoutLastAI, { id: Date.now().toString(), role: 'model', text: "重新生成失败，请重试。" }]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-6xl h-[92vh] rounded-[32px] border border-white/20 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 ring-1 ring-slate-900/5">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-100 bg-white/80 backdrop-blur-md flex justify-between items-center shrink-0 z-10">
          <div className="flex items-center gap-5">
            <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 p-3 rounded-2xl shadow-lg shadow-blue-500/30 flex items-center justify-center">
                   <Sparkles className="w-6 h-6 text-white" />
                </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Sukie AI 
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">Beta</span>
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <p className="text-xs text-slate-500 font-medium">Gemini 3.0 Pro 连接正常</p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors p-3 hover:bg-slate-100 rounded-full group">
            <X className="w-7 h-7 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar bg-slate-50 scroll-smooth">
          {messages.map((msg, idx) => (
            <div key={msg.id} className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''} group animate-in slide-in-from-bottom-4 duration-500`}>
              
              {/* Avatar */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm border-4 ${
                  msg.role === 'user' 
                  ? 'bg-white border-white shadow-slate-200' 
                  : 'bg-gradient-to-br from-blue-600 to-indigo-700 border-white shadow-blue-200'
              }`}>
                {msg.role === 'user' ? <User className="w-6 h-6 text-slate-600" /> : <Bot className="w-6 h-6 text-white" />}
              </div>

              {/* Bubble Container */}
              <div className={`flex flex-col gap-2 max-w-[85%] lg:max-w-[75%]`}>
                <div className={`rounded-[28px] p-8 shadow-sm relative ${
                    msg.role === 'user' 
                    ? 'bg-white text-slate-800 rounded-tr-none border border-slate-100' 
                    : 'bg-slate-900 text-slate-100 rounded-tl-none shadow-blue-900/10'
                }`}>
                    {msg.role === 'model' ? (
                        <SimpleMarkdown text={msg.text} />
                    ) : (
                        <p className="leading-8 whitespace-pre-wrap text-[16px]">{msg.text}</p>
                    )}
                </div>
                
                {/* Action Bar for AI Messages */}
                {msg.role === 'model' && (
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity pl-2">
                        {/* Only show regenerate for the latest message to avoid confusion */}
                        {idx === messages.length - 1 && (
                            <button 
                                onClick={handleRegenerate}
                                disabled={isLoading}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 text-xs font-bold transition-all shadow-sm hover:shadow-md"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                                不满意？重新生成
                            </button>
                        )}
                        
                        <button 
                            onClick={() => onSaveToLibrary(msg.text)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 text-xs font-bold transition-all shadow-sm hover:shadow-md"
                        >
                            <BookmarkPlus className="w-3.5 h-3.5" />
                            存入战术库
                        </button>
                    </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-6 animate-in fade-in duration-300">
               <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20 border-4 border-white">
                 <Loader2 className="w-6 h-6 text-white animate-spin" />
               </div>
               <div className="bg-white text-slate-500 rounded-[28px] rounded-tl-none p-6 text-sm font-medium border border-slate-100 shadow-sm flex items-center gap-3">
                 <div className="flex gap-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></span>
                 </div>
                 <span className="text-slate-400">Sukie 正在构思新战术...</span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-8 bg-white border-t border-slate-100 shrink-0 shadow-[0_-20px_60px_rgba(0,0,0,0.02)] z-10">
          <div className="relative group max-w-4xl mx-auto">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="请给我一个刁钻的异议，或者输入您想学习的销售场景..."
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-blue-500/50 rounded-2xl pl-6 pr-16 py-5 text-slate-800 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none h-24 custom-scrollbar text-lg leading-relaxed shadow-inner"
            />
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="absolute right-3 bottom-3 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95"
            >
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-4 text-center flex items-center justify-center gap-1.5">
             <RefreshCw className="w-3.5 h-3.5" /> 提示：尝试告诉 AI “客户说太贵了”，看 Sukie 如何用“六边形战士”理论反击。
          </p>
        </div>
      </div>
    </div>
  );
};
