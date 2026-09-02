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
  Check,
  Lock,
  Plus,
  MessageSquare,
  Paperclip,
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
  Brain
} from 'lucide-react';
import { AI_SUGGESTIONS } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { useCyberToast } from '@/components/CyberToast';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  imageUrl?: string;
  timestamp: string;
}

interface ChatThread {
  id: string;
  title: string;
  updatedAt: string;
  messages: Message[];
}

const renderFormattedText = (text: string, isUser: boolean = false) => {
  if (!text) return null;

  const cleanText = text
    .replace(/\*\*\*/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/^#{1,6}\s+/gm, '');

  const textWithNewlines = cleanText
    .replace(/([^\n])\s*•/g, '$1\n•')
    .replace(/([^\n])\s*(\d+\.)/g, '$1\n$2');

  const lines = textWithNewlines.split('\n').filter((l) => l.trim() !== '');

  return lines.map((line, lineIdx) => {
    const trimmedLine = line.trim();
    const isTitle = lineIdx === 0 && trimmedLine.length < 65 && !trimmedLine.startsWith('•') && !trimmedLine.match(/^\d+\./) && !trimmedLine.includes(':');

    if (isTitle) {
      return (
        <div key={lineIdx} className="text-cyber-cyan font-black text-sm sm:text-base tracking-wide pb-1 mb-2 border-b border-cyber-cyan/20">
          {trimmedLine}
        </div>
      );
    }

    const colonIndex = trimmedLine.indexOf(':');
    if (colonIndex !== -1 && colonIndex < 45) {
      const rawLabel = trimmedLine.substring(0, colonIndex + 1);
      const rawBody = trimmedLine.substring(colonIndex + 1).trim();
      const hasBullet = rawLabel.startsWith('•') || rawLabel.match(/^\d+\./);
      const label = hasBullet ? rawLabel : `• ${rawLabel}`;

      return (
        <div key={lineIdx} className="mb-1.5 leading-relaxed">
          <span className="text-cyber-cyan font-bold mr-1.5">{label}</span>
          {rawBody && (
            <span className="text-slate-800 dark:text-white/90 font-medium">
              {rawBody}
            </span>
          )}
        </div>
      );
    }

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [guestCount, setGuestCount] = useState(0);

  // Chat History Sidebar State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string>('');

  // Active Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initial Auth & Threads Load
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setIsGuest(false);
        loadSavedThreads();
        setLoading(false);
      } else if (localStorage.getItem('nexoraGuestMode') === 'true') {
        setIsGuest(true);
        const count = parseInt(localStorage.getItem('nexoraGuestAiChatCount') || '0', 10);
        setGuestCount(count);
        loadSavedThreads();
        setLoading(false);
      } else {
        router.replace('/auth');
      }
    });
  }, [router]);

  const loadSavedThreads = () => {
    try {
      const stored = localStorage.getItem('nexus_chat_threads');
      if (stored) {
        const parsed: ChatThread[] = JSON.parse(stored);
        setThreads(parsed);
        if (parsed.length > 0) {
          setActiveThreadId(parsed[0].id);
          setMessages(parsed[0].messages);
        } else {
          createNewThread();
        }
      } else {
        createNewThread();
      }
    } catch (e) {
      createNewThread();
    }
  };

  const saveThreadsToStorage = (updatedThreads: ChatThread[]) => {
    setThreads(updatedThreads);
    localStorage.setItem('nexus_chat_threads', JSON.stringify(updatedThreads));
  };

  const createNewThread = () => {
    const newId = `thread_${Date.now()}`;
    const initialMsg: Message = {
      id: 'm-init',
      sender: 'ai',
      text: "Nexus AI Copilot\n\n• Overview: I am Nexus AI, your dedicated academic, business & career guidance copilot.\n• Multi-Modal OCR: Upload handwritten notes, math formulas, circuit diagrams, or document scans for instant decoding and solutions.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newThread: ChatThread = {
      id: newId,
      title: 'New Chat Session',
      updatedAt: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
      messages: [initialMsg]
    };

    const updated = [newThread, ...threads];
    setActiveThreadId(newId);
    setMessages([initialMsg]);
    saveThreadsToStorage(updated);
  };

  const switchThread = (threadId: string) => {
    const target = threads.find((t) => t.id === threadId);
    if (target) {
      setActiveThreadId(threadId);
      setMessages(target.messages);
    }
  };

  const deleteThread = (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = threads.filter((t) => t.id !== threadId);
    if (updated.length === 0) {
      setThreads([]);
      localStorage.removeItem('nexus_chat_threads');
      createNewThread();
    } else {
      saveThreadsToStorage(updated);
      if (activeThreadId === threadId) {
        setActiveThreadId(updated[0].id);
        setMessages(updated[0].messages);
      }
    }
    toast.info('Chat Session Removed', 'Conversation history thread deleted.');
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle File / Handwritten Note Image Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAttachedFileName(file.name);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        setAttachedImage(base64Url);
        toast.success('Image Attached', `Loaded ${file.name} for handwritten OCR decoding.`);
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const textContent = event.target?.result as string;
        setInputText((prev) => (prev ? `${prev}\n\n[ATTACHED FILE: ${file.name}]\n${textContent}` : `[ATTACHED FILE: ${file.name}]\n${textContent}`));
        toast.success('Document Attached', `Extracted text from ${file.name}.`);
      };
      reader.readAsText(file);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if ((!query || !query.trim()) && !attachedImage) return;

    if (isGuest) {
      if (guestCount >= 3) {
        toast.error('Guest AI Limit Reached', 'Guest accounts are limited to 3 AI queries. Please register or sign in to continue.');
        return;
      }
      const newCount = guestCount + 1;
      setGuestCount(newCount);
      localStorage.setItem('nexoraGuestAiChatCount', newCount.toString());
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: query.trim() || 'Inspect and decode attached handwritten note/document:',
      imageUrl: attachedImage || undefined,
      timestamp: timeStr
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setAttachedImage(null);
    setAttachedFileName(null);
    setIsTyping(true);

    // Update thread title if first user message
    let updatedTitle = 'Chat Session';
    const currentThread = threads.find((t) => t.id === activeThreadId);
    if (currentThread && currentThread.messages.length <= 2) {
      updatedTitle = (query.trim() || attachedFileName || 'Handwritten OCR Query').slice(0, 24);
    }

    try {
      const apiPayload = updatedMessages.map((m) => ({
        sender: m.sender,
        text: m.text,
        imageUrl: m.imageUrl
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiPayload })
      });

      if (!res.ok) {
        throw new Error('AI Service temporary unavailability');
      }

      const data = await res.json();
      const aiReplyText = data.reply || 'I processed your query. Please try asking again.';

      const aiMsg: Message = {
        id: Math.random().toString(),
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const finalMessages = [...updatedMessages, aiMsg];
      setMessages(finalMessages);

      // Persist to threads
      const updatedThreads = threads.map((t) => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            title: updatedTitle !== 'Chat Session' ? updatedTitle : t.title,
            updatedAt: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
            messages: finalMessages
          };
        }
        return t;
      });

      saveThreadsToStorage(updatedThreads);
    } catch (err: any) {
      console.error(err);
      const fallbackMsg: Message = {
        id: Math.random().toString(),
        sender: 'ai',
        text: "Nexus AI Copilot\n\n• Status: Service Reconnecting\n• Note: Our neural AI gateway is experiencing high traffic. Please re-send your query.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to Clipboard', 'Text copied successfully.');
    setTimeout(() => setCopiedId(null), 2000);
  };

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

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 pt-2 sm:pt-4 pb-28 sm:pb-24">
      
      {/* FIXED HEIGHT CONTAINER — PREVENTS BROWSER SCREEN SCROLLING */}
      <div className="h-[calc(100vh-140px)] sm:h-[calc(100vh-150px)] flex flex-col md:flex-row overflow-hidden rounded-3xl border border-slate-200 dark:border-white/[0.08] glass-panel relative shadow-2xl">
        
        {/* LEFT CHATGPT-STYLE CHAT HISTORY SIDEBAR */}
        <div 
          className={`w-full md:w-64 bg-slate-900/95 dark:bg-slate-950/95 border-r border-slate-700/50 dark:border-white/[0.08] flex flex-col transition-all duration-300 z-30 shrink-0 ${
            sidebarOpen ? 'block' : 'hidden md:flex'
          }`}
        >
          {/* New Chat Button */}
          <div className="p-3 border-b border-slate-700/50 dark:border-white/[0.08] flex items-center gap-2">
            <button
              onClick={createNewThread}
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyber-cyan/20 to-cyber-violet/20 border border-cyber-cyan/30 hover:border-cyber-cyan text-xs font-black text-white flex items-center justify-center gap-2 transition shadow-sm"
            >
              <Plus className="w-4 h-4 text-cyber-cyan" />
              <span>+ NEW CHAT</span>
            </button>

            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* History List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            <span className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-400 dark:text-white/40 tracking-wider block">
              CHAT HISTORY
            </span>

            {threads.map((t) => (
              <div
                key={t.id}
                onClick={() => switchThread(t.id)}
                className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs font-bold transition-all ${
                  activeThreadId === t.id
                    ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30'
                    : 'text-slate-400 dark:text-white/60 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{t.title}</span>
                </div>

                <button
                  onClick={(e) => deleteThread(t.id, e)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 transition p-1"
                  title="Delete Thread"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Guest Limit Badge */}
          {isGuest && (
            <div className="p-3 border-t border-slate-700/50 dark:border-white/[0.08] bg-amber-500/10 text-amber-300 text-[10px] font-bold">
              <span>Guest Queries: {guestCount} / 3 used</span>
            </div>
          )}
        </div>

        {/* MAIN CHAT AREA — INSIDE SCROLL ONLY */}
        <div className="flex-1 flex flex-col h-full min-w-0 bg-slate-900/40 dark:bg-slate-950/40 relative">
          
          {/* Header Bar inside Chat */}
          <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between bg-white/5 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition"
                title="Toggle Chat History"
              >
                <MessageSquare className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyber-cyan/20 to-cyber-violet/20 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-black text-sm text-slate-900 dark:text-white tracking-wide leading-tight">
                    NEXUS AI COPILOT
                  </h2>
                  <span className="text-[10px] text-cyber-emerald font-bold flex items-center gap-1">
                    <Brain className="w-3 h-3" />
                    <span>Llama 3.2 Vision &amp; Handwritten OCR Ready</span>
                  </span>
                </div>
              </div>
            </div>

            {isGuest && (
              <span className="px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-black uppercase">
                GUEST LOCK ({3 - guestCount} LEFT)
              </span>
            )}
          </div>

          {/* INTERNAL MESSAGES SCROLL CONTAINER ONLY */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 max-w-3xl ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div 
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                    m.sender === 'user'
                      ? 'bg-cyber-cyan text-background font-bold'
                      : 'bg-cyber-violet/20 border border-cyber-violet/40 text-cyber-violet'
                  }`}
                >
                  {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div 
                  className={`group relative rounded-2xl p-4 text-xs sm:text-sm shadow-md transition-all ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-cyber-cyan to-blue-600 text-background font-bold rounded-tr-none'
                      : 'glass-card border border-white/[0.08] text-slate-800 dark:text-white/90 rounded-tl-none'
                  }`}
                >
                  {/* Attached Image if present */}
                  {m.imageUrl && (
                    <div className="mb-3 max-w-xs rounded-xl overflow-hidden border border-white/20 shadow-md">
                      <img src={m.imageUrl} alt="Attached" className="w-full h-auto object-cover max-h-48" />
                    </div>
                  )}

                  {m.sender === 'user' ? (
                    <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                  ) : (
                    <div>{renderFormattedText(m.text)}</div>
                  )}

                  {/* Timestamp & Copy button */}
                  <div className="mt-2 pt-1 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[10px] opacity-70">
                    <span>{m.timestamp}</span>
                    {m.sender === 'ai' && (
                      <button
                        onClick={() => handleCopyText(m.text, m.id)}
                        className="hover:text-cyber-cyan transition flex items-center gap-1"
                      >
                        {copiedId === m.id ? <Check className="w-3 h-3 text-cyber-emerald" /> : <Copy className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyber-violet/20 border border-cyber-violet/40 flex items-center justify-center text-cyber-violet shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="glass-card rounded-2xl px-4 py-3 border border-white/[0.08] text-xs text-cyber-cyan font-bold flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>NEXUS AI IS DECODING &amp; SYNTHESIZING RESPONSE...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT BAR WITH ATTACHMENT BUTTON */}
          <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-white/[0.08] bg-white/5 backdrop-blur-md shrink-0 space-y-2">
            
            {/* Image Preview Badge */}
            {attachedImage && (
              <div className="flex items-center justify-between p-2 rounded-xl bg-cyber-cyan/15 border border-cyber-cyan/30 text-xs text-cyber-cyan">
                <span className="font-bold truncate flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4" />
                  <span>{attachedFileName || 'Handwritten Note / Photo Attached'}</span>
                </span>
                <button onClick={() => { setAttachedImage(null); setAttachedFileName(null); }} className="hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Quick Prompt Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {AI_SUGGESTIONS.slice(0, 3).map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(sug)}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold text-slate-300 dark:text-white/70 hover:text-white transition shrink-0"
                >
                  {sug}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {/* Attachment Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 hover:border-cyber-cyan flex items-center justify-center text-slate-300 dark:text-white/70 hover:text-cyber-cyan transition shrink-0"
                title="Attach Handwritten Note / Photo / Document"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*,.pdf,.txt,.docx"
                className="hidden"
              />

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask Nexus AI or attach a handwritten note photo..."
                className="flex-1 bg-white dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition"
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={isTyping || (!inputText.trim() && !attachedImage)}
                className="w-10 h-10 rounded-2xl bg-gradient-to-r from-cyber-cyan to-cyber-violet text-background font-bold flex items-center justify-center disabled:opacity-40 transition shrink-0 shadow-lg"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
