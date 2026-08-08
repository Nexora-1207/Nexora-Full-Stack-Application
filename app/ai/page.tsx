'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Terminal, 
  Lightbulb, 
  Loader2,
  Trash2,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { AI_SUGGESTIONS, AI_RESPONSES } from '@/lib/data';
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-init',
      sender: 'ai',
      text: "👋 Greetings, Engineer! I am **Nexora S-Node AI**, your dedicated academic & career intelligence unit.\n\nAsk me anything about **Intermediate MPC**, **BiPC medical lines**, **Polytechnic 3-year diplomas**, **lateral entry into 2nd-year B.Tech**, syllabus reviews, or placement preparation strategy.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (queryToSend?: string) => {
    const textToSend = (queryToSend || inputText).trim();
    if (!textToSend || isTyping) return;

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI Typewriter Response
    setTimeout(() => {
      const lower = textToSend.toLowerCase();
      let responseText = AI_RESPONSES[lower];

      if (!responseText) {
        if (lower.includes('polytechnic') || lower.includes('diploma') || lower.includes('lateral')) {
          responseText = AI_RESPONSES["what is polytechnic lateral entry?"];
        } else if (lower.includes('mpc') || lower.includes('math') || lower.includes('physics')) {
          responseText = AI_RESPONSES["what careers open with intermediate mpc?"];
        } else if (lower.includes('bipc') || lower.includes('biology') || lower.includes('medical') || lower.includes('neet')) {
          responseText = AI_RESPONSES["explain bipc medical research path"];
        } else if (lower.includes('vault') || lower.includes('token') || lower.includes('timetable')) {
          responseText = AI_RESPONSES["how does the college document vault work?"];
        } else {
          responseText = `### 🛰️ Telemetry Directive for "${textToSend}"\n\nYour query has been processed against our academic knowledge base.\n\n- **Target Career Sector**: Engineering & Advanced Tech.\n- **Recommended Strategy**: Check the **Colleges Hub** for institute match ratings and save admissions tokens to your **Document Vault**.\n- **Preparation Tip**: Focus on hands-on practical lab modules and numerical problem-solving to maximize campus placement readiness.`;
        }
      }

      // Stream words with typewriter animation
      const aiMessageId = `ai-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: aiMessageId,
          sender: 'ai',
          text: '',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      const words = responseText.split(' ');
      let currentWordIndex = 0;

      const interval = setInterval(() => {
        if (currentWordIndex < words.length) {
          const currentText = words.slice(0, currentWordIndex + 1).join(' ');
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId ? { ...msg, text: currentText } : msg
            )
          );
          currentWordIndex++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 30);
    }, 600);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'm-init',
        sender: 'ai',
        text: "⚡ Chat context reset. Ready for new telemetry queries.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 sm:pt-8 flex flex-col h-[calc(100vh-140px)]">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyber-cyan to-cyber-violet p-[1.5px] shadow-[0_0_20px_rgba(0,240,255,0.4)]">
            <div className="w-full h-full bg-background rounded-[14px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyber-cyan" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-lg text-white tracking-wider">NEXORA S-NODE AI</h1>
              <span className="w-2 h-2 rounded-full bg-cyber-emerald shadow-[0_0_8px_#10B981] animate-pulse"></span>
            </div>
            <p className="text-[11px] text-white/40 font-bold uppercase tracking-wider">
              QUANTUM REASONING & CAREER ADVISOR
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-white/50 hover:text-white flex items-center justify-center transition"
          title="Reset Conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-2">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
            >
              {isAi && (
                <div className="w-8 h-8 rounded-xl bg-cyber-cyan/15 border border-cyber-cyan/30 text-cyber-cyan flex items-center justify-center shrink-0 mt-1 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div className={`relative max-w-[85%] sm:max-w-[75%] rounded-3xl p-5 ${
                isAi
                  ? 'glass-panel border border-white/[0.1] text-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.4)]'
                  : 'bg-gradient-to-r from-cyber-cyan to-cyber-violet text-background font-bold shadow-lg shadow-cyber-cyan/20'
              }`}>
                {/* Markdown text rendering */}
                <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {msg.text}
                </div>

                <div className={`flex items-center justify-between mt-2 pt-2 border-t text-[10px] ${
                  isAi ? 'border-white/[0.06] text-white/30' : 'border-black/10 text-black/60'
                }`}>
                  <span>{msg.timestamp}</span>
                  {isAi && (
                    <button
                      onClick={() => handleCopy(msg.text, msg.id)}
                      className="hover:text-cyber-cyan transition flex items-center gap-1"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-cyber-emerald" />
                          <span className="text-cyber-emerald">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {!isAi && (
                <div className="w-8 h-8 rounded-xl bg-white/[0.08] border border-white/[0.12] text-white/80 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyber-cyan/15 border border-cyber-cyan/30 text-cyber-cyan flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
            </div>
            <div className="glass-panel px-4 py-3 rounded-2xl border border-white/[0.1] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-[11px] font-bold text-white/40 ml-1">S-Node Reasoning...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips & Input Dock */}
      <div className="shrink-0 pt-3 pb-2 space-y-3">
        
        {/* Suggestion Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {AI_SUGGESTIONS.map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSend(sug)}
              className="px-3.5 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-cyber-cyan/40 text-[11px] font-bold text-white/70 hover:text-white transition shrink-0 whitespace-nowrap"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask S-Node AI about MPC, BiPC, lateral entry, or college admissions..."
              className="w-full bg-surface-card border border-white/[0.12] rounded-2xl pl-5 pr-12 py-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="w-12 h-12 rounded-2xl cyber-button-primary flex items-center justify-center shrink-0 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-cyber-cyan/20 transition-transform active:scale-95"
          >
            {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>

      </div>

    </div>
  );
}
