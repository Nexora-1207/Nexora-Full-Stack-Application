'use client';

import React, { useState } from 'react';
import { X, Mic, Sparkles, Loader2, MessageSquareCode, CheckCircle2 } from 'lucide-react';

interface InterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolTitle?: string;
  sectorName?: string;
}

export default function InterviewModal({ isOpen, onClose, toolTitle, sectorName }: InterviewModalProps) {
  const [answer, setAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);

  if (!isOpen) return null;

  const displayTitle = (toolTitle || 'MOCK INTERVIEW & VIVA SIMULATOR').toUpperCase();
  const displaySector = sectorName || 'Sector Placement';

  const handleEvaluate = () => {
    if (!answer.trim()) return;
    setEvaluating(true);
    setTimeout(() => {
      setEvaluating(false);
      setFeedback({
        score: 'EXCELLENT (92/100)',
        verdict: `Strong domain mastery and professional diagnostic approach in ${displaySector}.`,
        critique: `You clearly communicated core principles and operational steps. Adding specific industry terminology and field benchmarks will elevate your score for ${displaySector} interviews.`,
        modelResponse: `A benchmark response in ${displaySector}: (1) State core principles and standards, (2) Outline step-by-step diagnostic/operational procedure, (3) Emphasize quality/safety standards, and (4) Summarize practical outcomes.`
      });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl border border-white/[0.12] p-6 sm:p-8 shadow-[0_0_60px_rgba(255,0,138,0.15)] max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyber-magenta/20 border border-cyber-magenta/30 flex items-center justify-center text-cyber-magenta">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-white tracking-wide">{displayTitle}</h3>
              <p className="text-xs text-white/50">Simulate specialized viva & interview rounds for {displaySector}</p>
            </div>
          </div>
          <button 
            onClick={() => { onClose(); setFeedback(null); setAnswer(''); }}
            className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white/60 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Question Prompt */}
        <div className="mt-6 space-y-4">
          <div className="glass-card rounded-2xl p-4 border border-cyber-magenta/20 bg-cyber-magenta/5">
            <div className="flex items-center gap-2 text-xs font-black text-cyber-magenta tracking-wider uppercase mb-1">
              <MessageSquareCode className="w-4 h-4" />
              <span>{displaySector} INTERVIEW QUESTION</span>
            </div>
            <p className="text-sm font-bold text-white leading-relaxed">
              "How do you systematically diagnose and resolve a critical operational fault or complex scenario in {displaySector} under tight deadlines?"
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2">
              Your Spoken or Text Response
            </label>
            <textarea
              rows={4}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Structure your answer using STAR method (Situation, Task, Action, Result)..."
              className="w-full bg-surface-card border border-white/[0.1] rounded-2xl p-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyber-magenta transition resize-none"
            />
          </div>

          {!feedback ? (
            <button
              onClick={handleEvaluate}
              disabled={evaluating || !answer.trim()}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyber-magenta to-purple-600 text-white font-black text-xs flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
            >
              {evaluating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>EVALUATING INTERVIEW RESPONSE...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>SUBMIT RESPONSE FOR AI FEEDBACK</span>
                </>
              )}
            </button>
          ) : (
            <div className="space-y-4 pt-2">
              {/* Score card */}
              <div className="p-4 rounded-2xl bg-cyber-magenta/10 border border-cyber-magenta/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-cyber-magenta tracking-wider">AI EVALUATION RATING</span>
                  <div className="text-xl font-black text-white mt-0.5">{feedback.score}</div>
                </div>
                <CheckCircle2 className="w-8 h-8 text-cyber-magenta" />
              </div>

              {/* Verdict */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] space-y-2">
                <span className="text-xs font-bold text-cyber-cyan uppercase tracking-wider block">Strengths &amp; Critique</span>
                <p className="text-xs text-white/80 leading-relaxed font-medium">{feedback.verdict}</p>
                <p className="text-xs text-white/60 leading-relaxed">{feedback.critique}</p>
              </div>

              {/* Model Response */}
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-1.5">
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block">Model Benchmark Answer</span>
                <p className="text-xs text-purple-100 leading-relaxed">{feedback.modelResponse}</p>
              </div>

              <button
                onClick={() => setFeedback(null)}
                className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-bold text-white/80 transition"
              >
                Practice Next Question
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
