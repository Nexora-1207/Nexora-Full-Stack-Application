'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Lightbulb, 
  Loader2,
  Trash2,
  Copy,
  Check
} from 'lucide-react';
import { AI_SUGGESTIONS } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { useCyberToast } from '@/components/CyberToast';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const renderFormattedText = (text: string, isUser: boolean = false) => {
  if (!text) return null;

  // Complete cleanup: strip out all asterisks (*), double-asterisks (**), triple-asterisks (***), and hashtags (#)
  const cleanText = text
    .replace(/\*\*\*/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/^#{1,6}\s+/gm, '');

  // Force newlines before any bullet • or numbered list item 1. that isn't on its own newline
  const textWithNewlines = cleanText
    .replace(/([^\n])\s*•/g, '$1\n•')
    .replace(/([^\n])\s*(\d+\.)/g, '$1\n$2');

  const lines = textWithNewlines.split('\n').filter((l) => l.trim() !== '');

  return lines.map((line, lineIdx) => {
    const trimmedLine = line.trim();

    // First line is ONLY Title if lineIdx === 0 AND short (< 65 chars) AND doesn't contain a bullet or colon
    const isTitle = lineIdx === 0 && trimmedLine.length < 65 && !trimmedLine.startsWith('•') && !trimmedLine.match(/^\d+\./) && !trimmedLine.includes(':');

    if (isTitle) {
      return (
        <div key={lineIdx} className="text-cyber-cyan font-black text-sm sm:text-base tracking-wide pb-1 mb-2 border-b border-cyber-cyan/20">
          {trimmedLine}
        </div>
      );
    }

    // Check for colon separator in bullet points or subheaders (e.g. "• Overview: description" or "• Key Features:")
    const colonIndex = trimmedLine.indexOf(':');

    if (colonIndex !== -1 && colonIndex < 45) {
      const rawLabel = trimmedLine.substring(0, colonIndex + 1); // e.g. "• Overview:" or "Key Features:"
      const rawBody = trimmedLine.substring(colonIndex + 1).trim();

      // Ensure bullet prefix if missing
      const hasBullet = rawLabel.startsWith('•') || rawLabel.match(/^\d+\./);
      const label = hasBullet ? rawLabel : `• ${rawLabel}`;

      return (
        <div key={lineIdx} className="mb-1.5 leading-relaxed">
          <span className="text-cyber-cyan font-bold mr-1.5">{label}</span>
          {rawBody && (
            <span className={isUser ? 'text-slate-950 font-bold' : 'text-slate-800 dark:text-white/90 font-medium'}>
              {rawBody}
            </span>
          )}
        </div>
      );
    }

    // Regular line fallback
    const hasBullet = trimmedLine.startsWith('•') || trimmedLine.match(/^\d+\./);
    const lineWithBullet = hasBullet ? trimmedLine : `• ${trimmedLine}`;

    return (
      <div key={lineIdx} className="mb-1.5 leading-relaxed text-slate-800 dark:text-white/90 font-medium">
        {lineWithBullet}
      </div>
    );
  });
};

export default function AiClient() {
  const router = useRouter();
  const toast = useCyberToast();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-init',
      sender: 'ai',
      text: "Nexus AI Copilot\n\n• Overview: I am Nexus AI, your dedicated academic, business & career guidance copilot.\n• Knowledge Scope: Intermediate MPC/BiPC, Polytechnic diplomas, lateral entry, college selection, academic doubts, and business startups.",
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
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setLoading(false);
      } else if (localStorage.getItem('nexoraGuestMode') === 'true') {
        setLoading(false);
      } else {
        router.replace('/auth');
      }
    });
  }, [router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyber-cyan to-cyber-violet animate-spin p-[2px] mb-4">
          <div className="w-full h-full bg-background rounded-[14px]"></div>
        </div>
        <span className="text-xs font-black tracking-widest text-cyber-cyan animate-pulse uppercase">
          INITIALIZING NEXUS AI AGENT...
        </span>
      </div>
    );
  }

  const handleSend = async (overrideText?: string) => {
    const query = (overrideText || inputText).trim();
    if (!query || isTyping) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!overrideText) setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      const data = await response.json();
      
      const aiReplyText = data.reply || data.error || "Nexus AI could not generate a response. Please try again.";

      const aiMsg: Message = {
        id: Math.random().toString(),
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Nexus AI Chat Error:', err);
      const errorMsg: Message = {
        id: Math.random().toString(),
        sender: 'ai',
        text: "Nexus AI Network Status\n\n• Connection: Encountered temporary connectivity issue. Please retry.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    const cleanTextToCopy = text.replace(/\*/g, '');
    navigator.clipboard.writeText(cleanTextToCopy);
    setCopiedId(id);
    toast.info('Copied', 'Nexus AI response copied to clipboard.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'm-init',
        sender: 'ai',
        text: "Nexus AI Reset\n\n• Session: History cleared.\n• Status: Ready for your academic, business, and study doubt queries.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    toast.info('Cleared', 'Nexus AI chat session reset.');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-32 space-y-6">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-[11px] font-black uppercase tracking-widest mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NEXUS AI INTELLIGENCE UNIT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            ACADEMIC, BUSINESS & CAREER COPILOT
          </h1>
        </div>

        <button
          onClick={handleClearHistory}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-500 dark:text-white/60 hover:text-red-400 hover:border-red-500/30 transition text-xs font-bold flex items-center gap-2"
          title="Clear Session"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Reset Session</span>
        </button>
      </div>

      {/* Chat Container */}
      <div className="glass-panel rounded-3xl border border-slate-200 dark:border-white/[0.1] p-4 sm:p-6 min-h-[500px] flex flex-col justify-between space-y-4 shadow-xl">
        
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 max-h-[60vh]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyber-cyan to-cyber-violet p-[2px] shrink-0 mt-1 shadow-md">
                  <div className="w-full h-full bg-background rounded-[14px] flex items-center justify-center">
                    <Bot className="w-5 h-5 text-cyber-cyan" />
                  </div>
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 space-y-2 relative group shadow-md ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-cyber-cyan to-cyber-violet text-slate-950 font-bold rounded-tr-none'
                    : 'bg-white dark:bg-surface-card border border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-white rounded-tl-none'
                }`}
              >
                <div className="flex items-center justify-between gap-4 border-b border-black/10 dark:border-white/10 pb-2 mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-wider ${m.sender === 'user' ? 'text-slate-950 font-bold' : 'text-cyber-cyan'}`}>
                    {m.sender === 'user' ? 'STUDENT INQUIRY' : 'NEXUS AI'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-mono ${m.sender === 'user' ? 'text-slate-950/80 font-bold' : 'text-slate-400 dark:text-white/40'}`}>
                      {m.timestamp}
                    </span>
                    {m.sender === 'ai' && (
                      <button
                        onClick={() => handleCopyText(m.id, m.text)}
                        className="text-slate-400 hover:text-slate-600 dark:text-white/40 dark:hover:text-white transition opacity-0 group-hover:opacity-100"
                        title="Copy text"
                      >
                        {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-cyber-emerald" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>

                {m.sender === 'user' ? (
                  <div className="text-xs sm:text-sm font-sans font-bold text-slate-950 leading-relaxed tracking-wide">
                    {m.text}
                  </div>
                ) : (
                  <div className="text-xs sm:text-sm font-sans font-normal">
                    {renderFormattedText(m.text, false)}
                  </div>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-9 h-9 rounded-2xl bg-white dark:bg-white/[0.1] border border-slate-200 dark:border-white/[0.15] flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <User className="w-5 h-5 text-slate-700 dark:text-white" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyber-cyan to-cyber-violet p-[2px] shrink-0 animate-pulse">
                <div className="w-full h-full bg-background rounded-[14px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-cyber-cyan" />
                </div>
              </div>
              <div className="glass-card rounded-2xl px-4 py-3 border border-slate-200 dark:border-white/[0.08] flex items-center gap-2 text-xs font-bold text-cyber-cyan">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Nexus AI is synthesizing response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-white/[0.06]">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-white/40 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-cyber-amber" />
            <span>RECOMMENDED INQUIRY VECTORS</span>
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {AI_SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sug)}
                disabled={isTyping}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] hover:border-cyber-cyan/40 hover:bg-slate-200 dark:hover:bg-white/[0.08] text-xs font-medium text-slate-700 dark:text-white/80 shrink-0 transition"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 pt-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask Nexus AI about studies, business, career roadmaps, or doubts..."
            className="flex-1 bg-white dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition shadow-sm"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="cyber-button-primary px-6 py-3.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg disabled:opacity-40 transition"
          >
            <span>SEND</span>
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
}
