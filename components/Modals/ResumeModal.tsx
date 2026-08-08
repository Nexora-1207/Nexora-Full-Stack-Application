'use client';

import React, { useState } from 'react';
import { X, FileText, CheckCircle2, AlertTriangle, Sparkles, Loader2 } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const [text, setText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleAnalyze = () => {
    if (!text.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResult({
        score: Math.floor(78 + Math.random() * 18),
        keywordsDetected: ['Data Structures', 'Micro-architecture', 'C++', 'System Design', 'Git'],
        missingKeywords: ['CI/CD Telemetry', 'Docker Containers', 'Microprocessor Programming'],
        actionableTips: [
          'Quantify project outcomes (e.g. "Improved processing throughput by 35%").',
          'Align technical skill tags directly with target engineering branch requirements.',
          'Highlight diploma or intermediate coursework distinctions.'
        ]
      });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl border border-white/[0.12] p-6 sm:p-8 shadow-[0_0_60px_rgba(0,240,255,0.15)] max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyber-amber/20 border border-cyber-amber/30 flex items-center justify-center text-cyber-amber">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-white tracking-wide">RESUME AI SCANNER</h3>
              <p className="text-xs text-white/50">Evaluate resume compatibility for engineering placements</p>
            </div>
          </div>
          <button 
            onClick={() => { onClose(); setResult(null); setText(''); }}
            className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white/60 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2">
              Paste Resume / Skills Summary
            </label>
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Completed Diploma in Computer Engineering. Proficient in Python, C++, React Native, and SQL. Built IoT home automation and neural classification system..."
              className="w-full bg-surface-card border border-white/[0.1] rounded-2xl p-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition resize-none"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!text.trim() || analyzing}
            className="w-full cyber-button-primary py-3 rounded-xl flex items-center justify-center gap-2 text-sm"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>EXTRACTING TELEMETRY METRICS...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>ANALYZE RESUME DOSSIER</span>
              </>
            )}
          </button>

          {/* Result Card */}
          {result && (
            <div className="mt-6 glass-card rounded-2xl p-5 border border-cyber-cyan/30 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <span className="text-xs font-black tracking-widest text-white/70 uppercase">MATCH SCORE</span>
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-emerald">
                  {result.score}% COMPATIBLE
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-cyber-emerald flex items-center gap-1 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Key Skillsets Detected:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.keywordsDetected.map((kw: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-cyber-emerald/10 border border-cyber-emerald/30 text-[11px] font-bold text-cyber-emerald">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-cyber-amber flex items-center gap-1 mb-2">
                  <AlertTriangle className="w-3.5 h-3.5" /> Recommended Additions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.missingKeywords.map((kw: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-cyber-amber/10 border border-cyber-amber/30 text-[11px] font-bold text-cyber-amber">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.08] space-y-1.5">
                <span className="text-xs font-bold text-white/70 block">Actionable Suggestions:</span>
                {result.actionableTips.map((tip: string, i: number) => (
                  <p key={i} className="text-xs text-white/60 leading-relaxed">• {tip}</p>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
