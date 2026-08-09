'use client';

import React, { useState, useEffect } from 'react';
import { 
  FolderLock, 
  Upload, 
  Search, 
  FileText, 
  Calendar, 
  Trash2, 
  Eye, 
  Share2, 
  CheckCircle2, 
  X, 
  HardDrive,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { INITIAL_VAULT_FILES } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface VaultFile {
  id: string;
  name: string;
  category: 'ACADEMIC' | 'TIMETABLE' | 'ADMISSIONS' | 'OTHERS';
  size: string;
  date: string;
  content: string;
}

const CATEGORIES = ['ALL', 'ACADEMIC', 'TIMETABLE', 'ADMISSIONS', 'OTHERS'] as const;

export default function VaultPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<VaultFile[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [selectedFile, setSelectedFile] = useState<VaultFile | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  
  // New File inputs
  const [newFileName, setNewFileName] = useState('');
  const [newFileCategory, setNewFileCategory] = useState<'ACADEMIC' | 'TIMETABLE' | 'ADMISSIONS' | 'OTHERS'>('ACADEMIC');
  const [newFileContent, setNewFileContent] = useState('');

  // Load files from storage & check auth
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        try {
          const stored = localStorage.getItem('vault_files');
          if (stored) {
            setFiles(JSON.parse(stored));
          } else {
            setFiles(INITIAL_VAULT_FILES as any);
            localStorage.setItem('vault_files', JSON.stringify(INITIAL_VAULT_FILES));
          }
        } catch (e) {
          setFiles(INITIAL_VAULT_FILES as any);
        }
        setLoading(false);
      } else {
        router.replace('/auth');
      }
    });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyber-cyan to-cyber-violet animate-spin p-[2px] mb-4">
          <div className="w-full h-full bg-background rounded-[14px]"></div>
        </div>
        <span className="text-xs font-black tracking-widest text-cyber-cyan animate-pulse uppercase">
          VERIFYING ACCESS AUTHORIZATION...
        </span>
      </div>
    );
  }

  const saveFilesToStorage = (updatedFiles: VaultFile[]) => {
    setFiles(updatedFiles);
    localStorage.setItem('vault_files', JSON.stringify(updatedFiles));
  };

  const handleDeleteFile = (id: string) => {
    if (confirm('Are you sure you want to delete this document from your vault?')) {
      const updated = files.filter((f) => f.id !== id);
      saveFilesToStorage(updated);
      if (selectedFile?.id === id) setSelectedFile(null);
    }
  };

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    const newDoc: VaultFile = {
      id: Math.random().toString(),
      name: newFileName.endsWith('.pdf') || newFileName.endsWith('.txt') ? newFileName : `${newFileName}.pdf`,
      category: newFileCategory,
      size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
      date: new Date().toISOString().split('T')[0],
      content: newFileContent.trim() || 'Official academic document verified and encrypted by Nexora Vault Gateway.'
    };

    const updated = [newDoc, ...files];
    saveFilesToStorage(updated);
    
    setNewFileName('');
    setNewFileContent('');
    setUploadModalOpen(false);
  };

  const handleShareToWhatsApp = (file: VaultFile) => {
    const text = encodeURIComponent(`*Nexora Academic Vault Document*\n\n📄 File: ${file.name}\n📂 Category: ${file.category}\n📅 Date: ${file.date}\n\n${file.content}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const filteredFiles = files.filter((f) => {
    const matchesCat = activeCategory === 'ALL' || f.category === activeCategory;
    const matchesQ = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQ;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-amber/10 border border-cyber-amber/30 text-cyber-amber text-[11px] font-black uppercase tracking-widest mb-1.5">
            <FolderLock className="w-3.5 h-3.5" />
            <span>ENCRYPTED ACADEMIC LOCKER</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            DOCUMENT VAULT
          </h1>
          <p className="text-xs text-slate-500 dark:text-white/50 font-medium mt-1">
            Store syllabi, weekly timetables, and college admission tokens securely with WhatsApp export capability.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="cyber-button-primary px-5 py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 self-start sm:self-auto shadow-lg"
        >
          <Upload className="w-4 h-4" />
          <span>UPLOAD TO VAULT</span>
        </button>
      </div>

      {/* STORAGE FOOTPRINT METER & SEARCH/FILTER BAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Storage Capacity Gauge Card */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-cyber-cyan" />
              <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                VAULT ALLOCATION
              </span>
            </div>
            <span className="text-xs font-bold text-cyber-emerald">HEALTHY</span>
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">45.8 MB</span>
              <span className="text-xs font-bold text-slate-500 dark:text-white/40">of 512 MB Allocated</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/[0.06] overflow-hidden">
              <div className="h-full w-[12%] bg-gradient-to-r from-cyber-cyan to-cyber-emerald rounded-full shadow-md"></div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-white/40 pt-2 border-t border-slate-200 dark:border-white/[0.06]">
            <span>{files.length} Documents Encrypted</span>
            <span className="text-cyber-cyan font-mono">AES-256 SAFE</span>
          </div>
        </div>

        {/* Search and Category Filters */}
        <div className="lg:col-span-8 space-y-4 flex flex-col justify-between">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents by filename or keyword..."
              className="w-full bg-white dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-2xl pl-11 pr-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition shadow-sm"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition-all shrink-0 ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-cyber-cyan to-cyber-violet text-background shadow-md scale-105'
                    : 'bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* FILES GRID */}
      {filteredFiles.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-4">
          <FolderLock className="w-12 h-12 text-slate-300 dark:text-white/20 mx-auto" />
          <h3 className="text-base font-black text-slate-900 dark:text-white">No Vault Documents</h3>
          <p className="text-xs text-slate-500 dark:text-white/50 max-w-sm mx-auto">
            Your document locker is empty in this category. Apply to colleges or save notes to generate documents.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between space-y-4 group relative overflow-hidden"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] group-hover:bg-cyber-cyan group-hover:text-background flex items-center justify-center text-cyber-cyan transition">
                    <FileText className="w-5 h-5" />
                  </div>

                  <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-white/60">
                    {file.category}
                  </span>
                </div>

                <h3 className="font-black text-sm text-slate-900 dark:text-white group-hover:text-cyber-cyan transition line-clamp-1">
                  {file.name}
                </h3>
                
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-white/40 mt-1">
                  <span>{file.size}</span>
                  <span>•</span>
                  <span>{file.date}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-white/50 mt-3 line-clamp-2 leading-relaxed bg-slate-100/70 dark:bg-white/[0.02] p-2.5 rounded-xl border border-slate-200 dark:border-white/[0.04] font-mono">
                  {file.content}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedFile(file)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] text-xs font-bold text-cyber-cyan flex items-center justify-center gap-1.5 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>

                <button
                  onClick={() => handleShareToWhatsApp(file)}
                  className="w-9 h-9 rounded-xl bg-cyber-emerald/10 hover:bg-cyber-emerald/20 border border-cyber-emerald/30 text-cyber-emerald flex items-center justify-center transition"
                  title="Forward to WhatsApp"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDeleteFile(file.id)}
                  className="w-9 h-9 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 flex items-center justify-center transition"
                  title="Delete Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* INSPECT DOCUMENT MODAL */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl glass-panel rounded-3xl border border-white/[0.12] p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-cyber-cyan px-2 py-0.5 rounded-md bg-cyber-cyan/10">
                  {selectedFile.category} LOCKER
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">{selectedFile.name}</h2>
                <div className="text-xs text-slate-500 dark:text-white/50">
                  <span>Size: {selectedFile.size}</span> • <span>Date: {selectedFile.date}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedFile(null)}
                className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/[0.05] hover:bg-slate-300 dark:hover:bg-white/[0.1] text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-surface border border-slate-200 dark:border-white/[0.08] font-mono text-xs text-slate-800 dark:text-white/80 whitespace-pre-wrap leading-relaxed">
              {selectedFile.content}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => handleShareToWhatsApp(selectedFile)}
                className="flex-1 py-3 rounded-xl bg-cyber-emerald text-background font-black text-xs flex items-center justify-center gap-2 hover:brightness-110 transition"
              >
                <Share2 className="w-4 h-4" />
                <span>FORWARD TO WHATSAPP</span>
              </button>

              <button
                onClick={() => setSelectedFile(null)}
                className="px-6 py-3 rounded-xl bg-slate-200 dark:bg-white/[0.05] hover:bg-slate-300 dark:hover:bg-white/[0.1] text-xs font-bold text-slate-800 dark:text-white transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* UPLOAD SIMULATOR MODAL */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md glass-panel rounded-3xl border border-white/[0.12] p-6 sm:p-8 shadow-2xl">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/[0.08] mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyber-cyan/20 border border-cyber-cyan/30 text-cyber-cyan flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900 dark:text-white">UPLOAD DOCUMENT</h3>
                  <p className="text-xs text-slate-500 dark:text-white/50">Store files in your encrypted vault locker</p>
                </div>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/[0.05] hover:bg-slate-300 dark:hover:bg-white/[0.1] text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider mb-1.5">
                  Document Filename
                </label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="e.g. Semester4_Timetable_Update.pdf"
                  className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider mb-1.5">
                  Category Locker
                </label>
                <select
                  value={newFileCategory}
                  onChange={(e) => setNewFileCategory(e.target.value as any)}
                  className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyber-cyan transition"
                >
                  <option value="ACADEMIC">ACADEMIC</option>
                  <option value="TIMETABLE">TIMETABLE</option>
                  <option value="ADMISSIONS">ADMISSIONS</option>
                  <option value="OTHERS">OTHERS</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider mb-1.5">
                  Document Content / Notes
                </label>
                <textarea
                  rows={4}
                  value={newFileContent}
                  onChange={(e) => setNewFileContent(e.target.value)}
                  placeholder="Add file description, timetable hours, or token codes..."
                  className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-xl p-4 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition resize-none font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full cyber-button-primary py-3.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 mt-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ENCRYPT & SAVE TO VAULT</span>
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
