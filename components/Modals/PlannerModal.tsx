'use client';

import React, { useState } from 'react';
import { X, CalendarPlus, CheckCircle2 } from 'lucide-react';
import { useCyberToast } from '@/components/CyberToast';

interface PlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: { time: string; title: string; location: string }) => void;
}

export default function PlannerModal({ isOpen, onClose, onAdd }: PlannerModalProps) {
  const toast = useCyberToast();
  const [time, setTime] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!time.trim() || !title.trim()) return;

    onAdd({
      time: time.trim(),
      title: title.trim(),
      location: location.trim() || 'Main Academic Block'
    });

    toast.success('Routine Entry Added', `${title.trim()} scheduled at ${time.trim()}`);
    setTime('');
    setTitle('');
    setLocation('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md glass-panel rounded-3xl border border-white/[0.12] p-6 sm:p-8 shadow-[0_0_60px_rgba(0,240,255,0.15)]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyber-cyan/20 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan">
              <CalendarPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-white tracking-wide">ADD DAILY ROUTINE</h3>
              <p className="text-xs text-white/50">Schedule classes, labs, and study checkpoints</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white/60 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2">
              Time
            </label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 09:30 AM or 02:00 PM"
              className="w-full bg-surface-card border border-white/[0.1] rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2">
              Class / Activity Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Engineering Mechanics Lab"
              className="w-full bg-surface-card border border-white/[0.1] rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2">
              Location / Block
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Workshop Block 3 / Zoom Link"
              className="w-full bg-surface-card border border-white/[0.1] rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition"
            />
          </div>

          <button
            type="submit"
            className="w-full cyber-button-primary py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm mt-4"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>SAVE TO ROUTINE</span>
          </button>
        </form>

      </div>
    </div>
  );
}
