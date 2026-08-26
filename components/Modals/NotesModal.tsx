'use client';

import React, { useState } from 'react';
import { X, BookOpen, FolderLock, CheckCircle2 } from 'lucide-react';
import { INITIAL_VAULT_FILES } from '@/lib/data';
import { useCyberToast } from '@/components/CyberToast';

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotesModal({ isOpen, onClose }: NotesModalProps) {
  const toast = useCyberToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;

    try {
      const stored = localStorage.getItem('vault_files');
      let files = stored ? JSON.parse(stored) : INITIAL_VAULT_FILES;
      
      const newFile = {
        id: Math.random().toString(),
        name: `${title.replace(/\s+/g, '_')}_Notes.txt`,
        category: 'ACADEMIC',
        size: '12 KB',
        date: new Date().toISOString().split('T')[0],
        content: `LECTURE NOTE: ${title}\nDATE: ${new Date().toLocaleDateString()}\n\nSUMMARY:\n${content}`
      };

      files.unshift(newFile);
      localStorage.setItem('vault_files', JSON.stringify(files));
      setSaved(true);
      toast.success('Note Encrypted & Saved', `${newFile.name} is now stored in your Document Vault.`);
      setTimeout(() => {
        setSaved(false);
        setTitle('');
        setContent('');
        onClose();
      }, 1500);
    } catch (e) {
      console.error(e);
      toast.error('Save Failed', 'Could not save note to local vault.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl border border-white/[0.12] p-6 sm:p-8 shadow-[0_0_60px_rgba(168,85,247,0.15)] max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyber-violet/20 border border-cyber-violet/30 flex items-center justify-center text-cyber-violet">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-white tracking-wide">SMART NOTE PAD</h3>
              <p className="text-xs text-white/50">Draft lecture notes with 1-click sync to your Document Vault</p>
            </div>
          </div>
          <button 
            onClick={() => { onClose(); setSaved(false); }}
            className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white/60 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2">
              Note Subject / Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Electrical Transformers & Faraday's Law"
              className="w-full bg-surface-card border border-white/[0.1] rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyber-violet transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2">
              Note Content
            </label>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Record formula equations, lecture takeaways, lab observations..."
              className="w-full bg-surface-card border border-white/[0.1] rounded-2xl p-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyber-violet transition resize-none font-mono"
            />
          </div>

          {saved ? (
            <div className="p-3.5 rounded-xl bg-cyber-emerald/10 border border-cyber-emerald/30 text-cyber-emerald flex items-center justify-center gap-2 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>NOTE ENCRYPTED & SYNCHRONIZED TO VAULT LOCKER!</span>
            </div>
          ) : (
            <button
              onClick={handleSave}
              disabled={!title.trim() || !content.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyber-violet to-cyber-pink text-white font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition shadow-[0_0_25px_rgba(168,85,247,0.4)]"
            >
              <FolderLock className="w-4 h-4" />
              <span>SAVE TO DOCUMENT VAULT</span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
}
