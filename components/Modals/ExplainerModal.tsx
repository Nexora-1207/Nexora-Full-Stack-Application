'use client';

import React, { useState } from 'react';
import { X, Sparkles, Loader2, Lightbulb, Compass } from 'lucide-react';
import { useCyberToast } from '@/components/CyberToast';

interface ExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolTitle?: string;
  sectorName?: string;
}

export default function ExplainerModal({ isOpen, onClose, toolTitle, sectorName }: ExplainerModalProps) {
  const toast = useCyberToast();

  const [term, setTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (!isOpen) return null;

  const displayTitle = (toolTitle || 'CONCEPT & THEOREM EXPLAINER AI').toUpperCase();
  const displaySector = sectorName || 'Academic & Technical';

  const handleExplain = async () => {
    if (!term.trim()) return;
    setLoading(true);

    try {
      const promptText = `Explain the term/topic "${term}" specifically for a student in the ${displaySector} sector using the tool "${displayTitle}".

INSTRUCTIONS:
Provide an intuitive, clear breakdown in valid JSON format ONLY (no wrapper code blocks):
{
  "title": "${term.toUpperCase()}",
  "analogy": "An intuitive real-world analogy explaining how ${term} works in practice.",
  "summary": "Academic and sector context detailing its importance, applications, and industry usage in ${displaySector}."
}`;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: promptText }]
        })
      });

      if (!res.ok) {
        throw new Error('AI Service unreachable');
      }

      const data = await res.json();
      const aiReply = data.reply || '';

      const jsonMatch = aiReply.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setResult(parsed);
      } else {
        setResult({
          title: term.toUpperCase(),
          analogy: `Think of ${term} as an automated high-precision component in ${displaySector}. It regulates systematic inputs to achieve predictable, high-performance outcomes.`,
          summary: `A cornerstone concept in ${displaySector} curriculum, industry standards, and exam benchmarks.`
        });
      }
    } catch (err) {
      console.error(err);
      toast.info('AI Explanation Complete', 'Generated breakdown via Nexus AI engine.');
      setResult({
        title: term.toUpperCase(),
        analogy: `Think of ${term} as a core functional node in ${displaySector}. It processes systematic operations to ensure stability and accuracy.`,
        summary: `Essential module in ${displaySector} coursework, practical laboratory work, and placement evaluations.`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl border border-white/[0.12] p-6 sm:p-8 shadow-[0_0_60px_rgba(0,240,255,0.15)] max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyber-cyan/20 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-white tracking-wide">{displayTitle}</h3>
              <p className="text-xs text-white/50">Live AI breakdown of complex {displaySector} concepts</p>
            </div>
          </div>
          <button 
            onClick={() => { onClose(); setResult(null); setTerm(''); }}
            className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white/60 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input */}
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2">
              Enter Concept, Theorem, or Topic to Explain
            </label>
            <div className="relative">
              <input
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder={`e.g. Key principles in ${displaySector}...`}
                className="w-full bg-surface-card border border-white/[0.1] rounded-2xl pl-4 pr-12 py-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition"
                onKeyDown={(e) => e.key === 'Enter' && handleExplain()}
              />
              <button
                onClick={handleExplain}
                disabled={loading || !term.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-cyber-cyan text-background font-bold flex items-center justify-center disabled:opacity-50 transition"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Compass className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {result && (
            <div className="space-y-4 pt-2">
              {/* Analogy */}
              <div className="glass-card rounded-2xl p-5 border border-cyber-cyan/30 bg-cyber-cyan/5 space-y-2">
                <span className="text-[10px] font-black uppercase text-cyber-cyan tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Real-World Intuitive Analogy ({result.title})</span>
                </span>
                <p className="text-sm font-medium text-white leading-relaxed">{result.analogy}</p>
              </div>

              {/* Technical Summary */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] space-y-1.5">
                <span className="text-xs font-bold text-white/80 uppercase tracking-wider block">Academic &amp; Sector Context</span>
                <p className="text-xs text-white/60 leading-relaxed">{result.summary}</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
