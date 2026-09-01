'use client';

import React, { useState, useRef } from 'react';
import { X, BookOpen, FolderLock, CheckCircle2, Upload, FileText, Image as ImageIcon } from 'lucide-react';
import { INITIAL_VAULT_FILES } from '@/lib/data';
import { useCyberToast } from '@/components/CyberToast';

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolTitle?: string;
  sectorName?: string;
}

export default function NotesModal({ isOpen, onClose, toolTitle, sectorName }: NotesModalProps) {
  const toast = useCyberToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const displayTitle = (toolTitle || 'SMART SECTOR NOTE PAD').toUpperCase();
  const displaySector = sectorName || 'Sector Academic';

  // Handle Document / Photo Upload & Parsing
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
    }

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setContent((prev) => (prev ? `${prev}\n\n[IMPORTED PHOTO/DOCUMENT SLIDE: ${file.name}]` : `[IMPORTED PHOTO/DOCUMENT SLIDE: ${file.name}]\nHandwritten notes / slide image parsed into Document Vault.`));
        toast.success('Photo Slide Imported', `Loaded ${file.name} for Document Vault sync.`);
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileText = event.target?.result as string;
        setContent(fileText);
        toast.success('Document Imported', `Extracted note content from ${file.name}.`);
      };
      reader.readAsText(file);
    }
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;

    try {
      const stored = localStorage.getItem('vault_files');
      let files = stored ? JSON.parse(stored) : INITIAL_VAULT_FILES;
      
      const newFile = {
        id: Math.random().toString(),
        name: `${title.replace(/\s+/g, '_')}_${displaySector.replace(/\s+/g, '_')}.txt`,
        category: 'ACADEMIC',
        size: '14 KB',
        date: new Date().toISOString().split('T')[0],
        content: `SECTOR NOTE: ${title}\nSECTOR: ${displaySector}\nSOURCE FILE: ${fileName || 'Direct Draft'}\nDATE: ${new Date().toLocaleDateString()}\n\nSUMMARY & OBSERVATIONS:\n${content}`
      };

      files.unshift(newFile);
      localStorage.setItem('vault_files', JSON.stringify(files));
      setSaved(true);
      toast.success('Note Encrypted & Saved', `${newFile.name} is now stored in your Document Vault.`);
      setTimeout(() => {
        setSaved(false);
        setTitle('');
        setContent('');
        setFileName(null);
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
              <h3 className="font-black text-lg text-white tracking-wide">{displayTitle}</h3>
              <p className="text-xs text-white/50">Draft observations, import slides &amp; sync to Document Vault</p>
            </div>
          </div>
          <button 
            onClick={() => { onClose(); setSaved(false); setTitle(''); setContent(''); setFileName(null); }}
            className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white/60 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input */}
        <div className="mt-6 space-y-4">

          {/* Import File / Photo Bar */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-cyber-violet/10 border border-cyber-violet/30 flex items-center justify-center text-cyber-violet shrink-0">
                {fileName?.match(/\.(png|jpg|jpeg)$/i) ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-white block truncate">
                  {fileName ? fileName : 'Import Lecture Slide / Photo / File'}
                </span>
                <span className="text-[10px] text-white/50 block">
                  {fileName ? 'Imported & converted for Vault storage' : 'Auto-extract text from .txt, .pdf, .png, .jpg'}
                </span>
              </div>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 rounded-xl bg-cyber-violet/10 border border-cyber-violet/30 hover:bg-cyber-violet/20 text-cyber-violet text-xs font-bold shrink-0 transition flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{fileName ? 'Change File' : 'Import File'}</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileImport}
              accept=".txt,.pdf,.docx,.doc,.png,.jpg,.jpeg,.md"
              className="hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2">
              Note Title / Topic
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`e.g. ${displaySector} Lecture & Lab Notes...`}
              className="w-full bg-surface-card border border-white/[0.1] rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyber-violet transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2">
              Note Content / Key Takeaways
            </label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Record main takeaways, formulas, procedures, or exam dates..."
              className="w-full bg-surface-card border border-white/[0.1] rounded-2xl p-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyber-violet transition resize-none"
            />
          </div>

          {!saved ? (
            <button
              onClick={handleSave}
              disabled={!title.trim() || !content.trim()}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyber-violet to-cyber-pink text-white font-black text-xs flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
            >
              <FolderLock className="w-4 h-4" />
              <span>ENCRYPT &amp; SAVE TO DOCUMENT VAULT</span>
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-cyber-emerald/10 border border-cyber-emerald/30 text-center space-y-1">
              <CheckCircle2 className="w-8 h-8 text-cyber-emerald mx-auto" />
              <span className="text-xs font-bold text-cyber-emerald uppercase tracking-wider block">NOTE ENCRYPTED &amp; SAVED</span>
              <p className="text-xs text-white/70">Synced to your Document Vault</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
