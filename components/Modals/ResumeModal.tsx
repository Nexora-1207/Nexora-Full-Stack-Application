'use client';

import React, { useState } from 'react';
import { X, FileText, CheckCircle2, AlertTriangle, Sparkles, Loader2 } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolTitle?: string;
  sectorName?: string;
}

export default function ResumeModal({ isOpen, onClose, toolTitle, sectorName }: ResumeModalProps) {
  const [text, setText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (!isOpen) return null;

  const displayTitle = (toolTitle || 'SECTOR DOCUMENT & PORTFOLIO SCANNER').toUpperCase();
  const displaySector = sectorName || 'Academic & Placement';

  const handleAnalyze = () => {
    if (!text.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResult({
        score: Math.floor(82 + Math.random() * 14),
        keywordsDetected: ['Core Domain Competency', 'Practical Project Telemetry', 'Technical Documentation', 'Field Operations', 'Standards Compliance'],
        missingKeywords: ['Advanced Analytics', 'Cross-Domain Certification', 'Industry Protocol Compliance'],
        actionableTips: [
          `Quantify practical outcomes for ${displaySector} benchmarks (e.g. "Improved efficiency by 35%").`,
          `Align technical skills directly with active ${displaySector} requirements.`,
          'Highlight verified diploma, trade, or intermediate coursework distinctions.'
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
              <h3 className="font-black text-lg text-white tracking-wide">{displayTitle}</h3>
              <p className="text-xs text-white/50">Evaluate resume & credentials for {displaySector}</p>
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
              Paste Credentials, Experience / Skills Summary
            </label>
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`Paste details regarding your ${displaySector} coursework, projects, or certifications...`}
              className="w-full bg-surface-card border border-white/[0.1] rounded-2xl p-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition resize-none"
            />
          </div>

          {!result ? (
            <button
              onClick={handleAnalyze}
              disabled={analyzing || !text.trim()}
              className="w-full cyber-button-primary py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-background" />
                  <span>ANALYZING CREDENTIAL COMPATIBILITY...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-background" />
                  <span>RUN SECTOR COMPATIBILITY SCAN</span>
                </>
              )}
            </button>
          ) : (
            <div className="space-y-4 pt-2">
              {/* Score card */}
              <div className="p-4 rounded-2xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-cyber-cyan tracking-wider">SECTOR READINESS SCORE</span>
                  <div className="text-3xl font-black text-white mt-0.5">{result.score}/100</div>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-cyber-cyan border-t-transparent animate-spin p-1">
                  <div className="w-full h-full bg-cyber-cyan rounded-full"></div>
                </div>
              </div>

              {/* Detected */}
              <div>
                <span className="text-xs font-bold text-cyber-emerald uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Detected Key Competencies ({result.keywordsDetected.length})</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.keywordsDetected.map((kw: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-cyber-emerald/15 border border-cyber-emerald/30 text-cyber-emerald text-[11px] font-bold">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing */}
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Recommended Industry Additions</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.missingKeywords.map((kw: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[11px] font-bold">
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] space-y-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">Optimization Recommendations</span>
                <ul className="space-y-1.5 text-xs text-white/70">
                  {result.actionableTips.map((tip: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-cyber-cyan font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setResult(null)}
                className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-bold text-white/80 transition"
              >
                Scan Another Document
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
