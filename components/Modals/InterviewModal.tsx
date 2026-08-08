'use client';

import React, { useState } from 'react';
import { X, Mic, Sparkles, Loader2, MessageSquareCode, CheckCircle2 } from 'lucide-react';

interface InterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InterviewModal({ isOpen, onClose }: InterviewModalProps) {
  const [answer, setAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);

  if (!isOpen) return null;

  const handleEvaluate = () => {
    if (!answer.trim()) return;
    setEvaluating(true);
    setTimeout(() => {
      setEvaluating(false);
      setFeedback({
        score: 'EXCELLENT (92/100)',
        verdict: 'Strong architectural reasoning and methodical diagnostic approach.',
        critique: 'You clearly highlighted isolate-and-conquer debugging techniques. Adding specific monitoring tools (like logic analyzers or unit benchmarks) will elevate your technical score even further.',
        modelResponse: 'A high-impact answer begins by stating the systematic diagnostic steps: (1) reproduce the fault, (2) check input logs and circuit voltages, (3) isolate faulty subroutines, and (4) verify with regression tests.'
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
              <h3 className="font-black text-lg text-white tracking-wide">MOCK INTERVIEW SIMULATOR</h3>
              <p className="text-xs text-white/50">Simulate behavioral and technical interview questions</p>
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
              <span>INTERVIEW QUESTION NODE</span>
            </div>
            <p className="text-sm font-bold text-white leading-relaxed">
              &quot;Explain the exact process you follow when debugging a sudden hardware signal loss or software crash in production.&quot;
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2">
              Your Answer
            </label>
            <textarea
              rows={4}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="State your methodology, tools used, and verification methods..."
              className="w-full bg-surface-card border border-white/[0.1] rounded-2xl p-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyber-magenta transition resize-none"
            />
          </div>

          <button
            onClick={handleEvaluate}
            disabled={!answer.trim() || evaluating}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyber-magenta to-cyber-pink text-white font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition shadow-[0_0_25px_rgba(255,0,138,0.4)]"
          >
            {evaluating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>EVALUATING TECHNICAL RESPONSE...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>SUBMIT FOR AI EVALUATION</span>
              </>
            )}
          </button>

          {/* Feedback Output */}
          {feedback && (
            <div className="mt-6 glass-card rounded-2xl p-5 border border-cyber-magenta/30 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <span className="text-xs font-black tracking-widest text-white/70 uppercase">ASSESSMENT</span>
                <span className="text-sm font-black text-cyber-magenta flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  {feedback.score}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-white/80 block mb-1">Feedback Summary:</span>
                <p className="text-xs text-white/60 leading-relaxed">{feedback.critique}</p>
              </div>

              <div className="pt-2 border-t border-white/[0.08]">
                <span className="text-xs font-bold text-cyber-cyan block mb-1">Standard Reference Model:</span>
                <p className="text-xs text-white/50 italic leading-relaxed">{feedback.modelResponse}</p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
