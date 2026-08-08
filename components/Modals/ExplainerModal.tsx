'use client';

import React, { useState } from 'react';
import { X, Sparkles, Loader2, Lightbulb, Compass } from 'lucide-react';

interface ExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExplainerModal({ isOpen, onClose }: ExplainerModalProps) {
  const [term, setTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleExplain = () => {
    if (!term.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const lower = term.toLowerCase();
      
      let analogy = 'Think of it as an automated high-precision sculptor. Instead of human chisels, a computer computerizes exact mathematical coordinates to carve components with microscopic tolerance.';
      let summary = 'A cornerstone module in manufacturing automation, mechanical fabrication, and aerospace tooling.';

      if (lower.includes('ohm')) {
        analogy = 'Water flowing through a pipe. Voltage is the water pressure pushing forward, Current is the water flow rate, and Resistance is the narrowing of the pipe.';
        summary = 'Fundamental electrical circuit principle governing power grids, micro-wiring, and semiconductor behavior.';
      } else if (lower.includes('polytechnic') || lower.includes('lateral')) {
        analogy = 'A fast-track technical bridge. Instead of repeating foundational secondary school theory, diploma graduates step right into specialized university branch engineering.';
        summary = 'A government-approved pathway providing direct 2nd-year B.Tech entry for diploma holders.';
      }

      setResult({
        title: term.toUpperCase(),
        analogy,
        summary
      });
    }, 1200);
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
              <h3 className="font-black text-lg text-white tracking-wide">CONCEPT EXPLAINER AI</h3>
              <p className="text-xs text-white/50">Break down complex technical terms into simple analogies</p>
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
              Enter Technical Term or Concept
            </label>
            <div className="relative">
              <input
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="e.g. CNC Tooling, Ohm's Law, Polytechnic Lateral Entry..."
                className="w-full bg-surface-card border border-white/[0.1] rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition"
                onKeyDown={(e) => e.key === 'Enter' && handleExplain()}
              />
            </div>
          </div>

          <button
            onClick={handleExplain}
            disabled={!term.trim() || loading}
            className="w-full cyber-button-primary py-3 rounded-xl flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>GENERATING ANALOGY...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>SIMULATE CONCEPT BREAKDOWN</span>
              </>
            )}
          </button>

          {/* Result */}
          {result && (
            <div className="mt-6 glass-card rounded-2xl p-5 border border-cyber-cyan/30 space-y-4">
              <div className="flex items-center gap-2 text-cyber-cyan font-black text-sm">
                <Compass className="w-4 h-4" />
                <span>{result.title}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase text-cyber-violet tracking-wider block">
                  The Simple Analogy:
                </span>
                <p className="text-xs text-white/80 leading-relaxed font-medium bg-white/[0.03] p-3 rounded-xl border border-white/[0.06]">
                  &quot;{result.analogy}&quot;
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase text-white/50 tracking-wider block">
                  Academic Context:
                </span>
                <p className="text-xs text-white/60 leading-relaxed">
                  {result.summary}
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
