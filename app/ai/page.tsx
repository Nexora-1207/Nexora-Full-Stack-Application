'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
import { AI_SUGGESTIONS } from '@/lib/data';
import { processNexoraAIQuery } from '@/lib/aiEngine';
import { supabase } from '@/lib/supabase';
import { useCyberToast } from '@/components/CyberToast';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export default function AIPage() {
  const router = useRouter();
  const toast = useCyberToast();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-init',
      sender: 'ai',
      text: "👋 Greetings! I am **Nexora AI**, your dedicated academic & career guidance assistant.\n\nI am configured **strictly for educational & career queries**. Ask me anything about **career roadmaps**, **resume building**, **self-introductions**, **Intermediate MPC vs BiPC**, **Polytechnic 3-year diplomas**, **lateral entry into 2nd-year B.Tech**, entrance exams, or college admissions.",
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
          VERIFYING ACCESS AUTHORIZATION...
        </span>
      </div>
    );
  }

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

    // Process query through Nexora API / Educational AI Engine
    setTimeout(async () => {
      let responseText = '';
      try {
        const res = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: textToSend })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.text) {
            responseText = data.text;
          }
        }
      } catch (err) {
        console.error('API route call failed:', err);
      }

      if (!responseText) {
        const aiResult = processNexoraAIQuery(textToSend);
        responseText = aiResult.text;
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
      }, 15);
    }, 300);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Response Copied', 'Nexora AI response copied to clipboard.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'm-init',
        sender: 'ai',
        text: "⚡ Chat context reset. Ready for your queries.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    toast.info('Chat Context Reset', 'Nexora AI conversation reset to default state.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 sm:pt-8 flex flex-col h-[calc(100vh-160px)]">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/[0.08] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyber-cyan to-cyber-violet p-[1.5px] shadow-md">
            <div className="w-full h-full bg-background rounded-[14px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyber-cyan" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-lg text-slate-900 dark:text-white tracking-wider">NEXORA AI</h1>
              <span className="w-2 h-2 rounded-full bg-cyber-emerald shadow-[0_0_8px_#10B981] animate-pulse"></span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-white/40 font-bold uppercase tracking-wider">
              ACADEMIC & CAREER AI ADVISOR
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.08] text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition"
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
                <div className="w-8 h-8 rounded-xl bg-cyber-cyan/15 border border-cyber-cyan/30 text-cyber-cyan flex items-center justify-center shrink-0 mt-1 shadow-md">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div className={`relative max-w-[85%] sm:max-w-[75%] rounded-3xl p-5 ${
                isAi
                  ? 'glass-panel text-slate-800 dark:text-white/90 shadow-lg'
                  : 'bg-gradient-to-r from-cyber-cyan to-cyber-violet text-background font-bold shadow-md'
              }`}>
                {/* Markdown text rendering */}
                <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {msg.text}
                </div>

                <div className={`flex items-center justify-between mt-2 pt-2 border-t text-[10px] ${
                  isAi ? 'border-slate-200 dark:border-white/[0.06] text-slate-400 dark:text-white/30' : 'border-black/10 text-black/60'
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
                <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-white/[0.08] border border-slate-300 dark:border-white/[0.12] text-slate-700 dark:text-white/80 flex items-center justify-center shrink-0 mt-1">
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
            <div className="glass-panel px-4 py-3 rounded-2xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-[11px] font-bold text-slate-500 dark:text-white/40 ml-1">Nexora AI is thinking...</span>
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
              className="px-3.5 py-1.5 rounded-full bg-white dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/[0.08] hover:border-cyber-cyan/40 text-[11px] font-bold text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white transition shrink-0 whitespace-nowrap shadow-sm"
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
              placeholder="Ask Nexora AI about career roadmaps, resume building, streams, or admissions..."
              className="w-full bg-white dark:bg-surface-card border border-slate-200 dark:border-white/[0.12] rounded-2xl pl-5 pr-12 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="w-12 h-12 rounded-2xl cyber-button-primary flex items-center justify-center shrink-0 disabled:opacity-30 disabled:cursor-not-allowed shadow-md transition-transform active:scale-95"
          >
            {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>

      </div>

    </div>
  );
}
