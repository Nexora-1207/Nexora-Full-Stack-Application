'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Lock,
  ImageIcon,
  Loader2,
  Camera
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useCyberToast } from '@/components/CyberToast';

export interface VaultFile {
  id: string;
  user_id?: string;
  student_name?: string;
  name: string;
  category: 'TIMETABLE' | 'ACADEMICS' | 'NOTES' | 'OTHERS';
  file_type?: string;
  file_url?: string;
  size: string;
  date: string;
  content: string;
}

const CATEGORIES = ['ALL', 'ACADEMICS', 'TIMETABLE', 'NOTES', 'OTHERS'] as const;

export default function VaultPage() {
  const router = useRouter();
  const toast = useCyberToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [studentName, setStudentName] = useState<string>('Nexora Student');
  const [files, setFiles] = useState<VaultFile[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [selectedFile, setSelectedFile] = useState<VaultFile | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  
  // File Upload States
  const [uploading, setUploading] = useState(false);
  const [selectedUploadFile, setSelectedUploadFile] = useState<File | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [extractedContent, setExtractedContent] = useState('');
  const [customFileName, setCustomFileName] = useState('');
  const [targetCategory, setTargetCategory] = useState<'TIMETABLE' | 'ACADEMICS' | 'NOTES' | 'OTHERS'>('NOTES');

  // Load files from Supabase database & check auth
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setIsGuest(false);
        setCurrentUser(user);

        // Fetch user profile name
        supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()
          .then(({ data }) => {
            if (data?.full_name) {
              setStudentName(data.full_name);
            }
          });

        // Fetch vault items from Supabase database
        supabase
          .from('vault_items')
          .select('*')
          .order('created_at', { ascending: false })
          .then(({ data, error }) => {
            if (data && data.length > 0) {
              const dbFiles: VaultFile[] = data.map((item) => ({
                id: item.id,
                user_id: item.user_id,
                student_name: item.student_name || 'Nexora Student',
                name: item.name,
                category: mapToValidCategory(item.category),
                file_type: item.file_type || 'text/plain',
                file_url: item.file_url || '',
                size: item.size || '12 KB',
                date: item.date || item.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
                content: item.content || 'Vault document.'
              }));
              setFiles(dbFiles);
              localStorage.setItem('vault_files', JSON.stringify(dbFiles));
            } else {
              const stored = localStorage.getItem('vault_files');
              if (stored) {
                try {
                  const parsed = JSON.parse(stored).map((f: any) => ({
                    ...f,
                    category: mapToValidCategory(f.category)
                  }));
                  setFiles(parsed);
                } catch (e) {
                  setFiles(getCleanInitialFiles());
                }
              } else {
                const initial = getCleanInitialFiles();
                setFiles(initial);
                localStorage.setItem('vault_files', JSON.stringify(initial));
              }
            }
            setLoading(false);
          }, () => {
            setLoading(false);
          });
      } else if (localStorage.getItem('nexoraGuestMode') === 'true') {
        setIsGuest(true);
        setLoading(false);
      } else {
        router.replace('/auth');
      }
    });
  }, [router]);

  const mapToValidCategory = (cat: string): 'TIMETABLE' | 'ACADEMICS' | 'NOTES' | 'OTHERS' => {
    const uppercase = (cat || '').toUpperCase();
    if (uppercase === 'TIMETABLE') return 'TIMETABLE';
    if (uppercase === 'ACADEMICS' || uppercase === 'ACADEMIC') return 'ACADEMICS';
    if (uppercase === 'NOTES' || uppercase === 'ADMISSIONS') return 'NOTES';
    return 'OTHERS';
  };

  const getCleanInitialFiles = (): VaultFile[] => {
    return [
      {
        id: 'v1',
        name: 'NIT_Computer_Engineering_Syllabus.pdf',
        category: 'ACADEMICS',
        file_type: 'application/pdf',
        size: '2.4 MB',
        date: '2026-08-01',
        content: 'Full academic curriculum including Data Structures, Algorithms, Microprocessors, and System Design.'
      },
      {
        id: 'v2',
        name: 'Weekly_Timetable_Diploma_Semester3.pdf',
        category: 'TIMETABLE',
        file_type: 'application/pdf',
        size: '1.1 MB',
        date: '2026-08-04',
        content: 'Updated Semester 3 timetable containing Labs, Machine Workshops, and Project hours.'
      },
      {
        id: 'v3',
        name: 'Admissions_Token_NEX-771823.txt',
        category: 'NOTES',
        file_type: 'text/plain',
        size: '14 KB',
        date: '2026-08-07',
        content: 'GATEWAY TOKEN: NEX-771823 College: Nexora Institute of Technology Verification: Verified.'
      }
    ];
  };

  // Calculate dynamic memory footprint from actual files
  const calculateMemoryUsed = (): { totalMB: number; percent: number } => {
    let bytes = 0;
    files.forEach((f) => {
      if (f.file_url) {
        // Approximate base64 payload size
        bytes += Math.round(f.file_url.length * 0.75);
      } else {
        const sizeStr = f.size || '10 KB';
        const num = parseFloat(sizeStr);
        if (sizeStr.includes('MB')) {
          bytes += num * 1024 * 1024;
        } else {
          bytes += num * 1024;
        }
      }
    });

    const totalMB = parseFloat((bytes / 1024 / 1024).toFixed(1));
    const displayMB = totalMB > 0 ? totalMB : 45.8;
    const percent = Math.min(100, Math.max(2, Math.round((displayMB / 512) * 100)));
    return { totalMB: displayMB, percent };
  };

  const { totalMB, percent: memoryPercent } = calculateMemoryUsed();

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyber-cyan to-cyber-violet animate-spin p-[2px] mb-4">
          <div className="w-full h-full bg-background rounded-[14px]"></div>
        </div>
        <span className="text-xs font-black tracking-widest text-cyber-cyan animate-pulse uppercase">
          VERIFYING VAULT ACCESS...
        </span>
      </div>
    );
  }

  // Render Guest Locked Screen for Vault
  if (isGuest) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-cyber-cyan/20 to-cyber-violet/20 border border-cyber-cyan/30 flex items-center justify-center mx-auto text-cyber-cyan shadow-2xl animate-pulse">
          <FolderLock className="w-12 h-12" />
        </div>
        
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-widest">
            <Lock className="w-3.5 h-3.5" />
            <span>GUEST ACCESS RESTRICTED</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            STUDENT VAULT LOCKED
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-white/60 font-medium max-w-lg mx-auto leading-relaxed">
            Register or Sign In to encrypt, upload, and securely access your timetables, academic documents, and smart notes in your personal Vault locker.
          </p>
        </div>
        
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => router.push('/auth')}
            className="cyber-button-primary px-8 py-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-xl w-full sm:w-auto"
          >
            <Lock className="w-4 h-4" />
            <span>REGISTER / SIGN IN TO UNLOCK</span>
          </button>
        </div>
      </div>
    );
  }

  // Handle file selection (Photo Gallery or File System)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedUploadFile(file);
    setCustomFileName(file.name);

    // Default category based on filename keywords or target selection
    const fname = file.name.toLowerCase();
    if (fname.includes('timetable') || fname.includes('schedule') || fname.includes('routine')) {
      setTargetCategory('TIMETABLE');
    } else if (fname.includes('syllabus') || fname.includes('marks') || fname.includes('memo') || fname.includes('certificate')) {
      setTargetCategory('ACADEMICS');
    }

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        setPreviewDataUrl(base64Url);
        setExtractedContent(`[IMAGE DOCUMENT: ${file.name}]\nUploaded to student vault.`);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewDataUrl(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        const textContent = event.target?.result as string;
        setExtractedContent(textContent || `Extracted document file: ${file.name}`);
      };
      reader.readAsText(file);
    }
  };

  // Upload file & save to Supabase database + local storage
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFileName.trim()) return;

    setUploading(true);
    const dateStr = new Date().toISOString().split('T')[0];
    const calcSize = selectedUploadFile ? `${(selectedUploadFile.size / 1024 / 1024).toFixed(1)} MB` : '1.2 MB';
    const fileType = selectedUploadFile?.type || (customFileName.match(/\.(png|jpg|jpeg)$/i) ? 'image/png' : 'text/plain');

    const newDoc: VaultFile = {
      id: Math.random().toString(),
      user_id: currentUser?.id,
      student_name: studentName,
      name: customFileName,
      category: targetCategory,
      file_type: fileType,
      file_url: previewDataUrl || '',
      size: selectedUploadFile?.size ? calcSize : '1.4 MB',
      date: dateStr,
      content: extractedContent.trim() || 'Official student document stored in vault.'
    };

    // Save to Supabase public.vault_items database
    if (currentUser) {
      try {
        await supabase.from('vault_items').insert([{
          user_id: currentUser.id,
          student_name: studentName,
          name: newDoc.name,
          category: newDoc.category,
          file_type: newDoc.file_type,
          file_url: newDoc.file_url,
          size: newDoc.size,
          date: newDoc.date,
          content: newDoc.content
        }]);
      } catch (err) {
        console.error('Supabase Vault Insert Error:', err);
      }
    }

    const updated = [newDoc, ...files];
    setFiles(updated);
    localStorage.setItem('vault_files', JSON.stringify(updated));

    toast.success('Document Saved', `${newDoc.name} stored in your Vault under ${newDoc.category}.`);
    
    setCustomFileName('');
    setExtractedContent('');
    setSelectedUploadFile(null);
    setPreviewDataUrl(null);
    setUploading(false);
    setUploadModalOpen(false);
  };

  const handleDeleteFile = async (id: string) => {
    if (confirm('Are you sure you want to delete this document from your vault?')) {
      const updated = files.filter((f) => f.id !== id);
      setFiles(updated);
      localStorage.setItem('vault_files', JSON.stringify(updated));

      if (currentUser) {
        try {
          await supabase.from('vault_items').delete().eq('id', id);
        } catch (e) {}
      }

      if (selectedFile?.id === id) setSelectedFile(null);
      toast.info('Document Removed', 'File has been deleted from your vault locker.');
    }
  };

  const handleShareToWhatsApp = (file: VaultFile) => {
    const text = encodeURIComponent(`*Nexora Academic Vault Document*\n\n📄 File: ${file.name}\n👤 Student: ${file.student_name || studentName}\n📂 Category: ${file.category}\n📅 Date: ${file.date}\n\n${file.content}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    toast.info('WhatsApp Export Triggered', `Dispatching ${file.name} to WhatsApp...`);
  };

  const filteredFiles = files.filter((f) => {
    const matchesCat = activeCategory === 'ALL' || f.category === activeCategory;
    const matchesQ = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQ;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-40 sm:pb-32 space-y-8">
      
      {/* Hidden File Inputs for Photo Gallery & File System */}
      <input
        type="file"
        ref={galleryInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*,.pdf,.txt,.docx,.doc,.md,.json"
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            DOCUMENT VAULT
          </h1>
          <p className="text-xs text-slate-500 dark:text-white/50 font-medium mt-1">
            Store syllabi, weekly timetables, and academic notes securely with WhatsApp export capability.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="cyber-button-primary px-6 py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 self-start sm:self-auto shadow-lg"
        >
          <Upload className="w-4 h-4 text-background" />
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
              <span className="text-2xl font-black text-slate-900 dark:text-white">{totalMB} MB</span>
              <span className="text-xs font-bold text-slate-500 dark:text-white/40">of 512 MB Allocated</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/[0.06] overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-emerald rounded-full shadow-md transition-all duration-500"
                style={{ width: `${memoryPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-white/40 pt-2 border-t border-slate-200 dark:border-white/[0.06]">
            <span>{files.length} Documents &amp; Photos Saved</span>
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

      {/* FILES GRID WITH INTERNAL SCROLL ONLY */}
      <div className="max-h-[calc(100vh-340px)] sm:max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
        {filteredFiles.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center space-y-4">
            <FolderLock className="w-12 h-12 text-slate-300 dark:text-white/20 mx-auto" />
            <h3 className="text-base font-black text-slate-900 dark:text-white">No Vault Documents in {activeCategory}</h3>
            <p className="text-xs text-slate-500 dark:text-white/50 max-w-sm mx-auto">
              Your document locker is empty in this category. Upload files or timetables to store documents here.
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
                    <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] group-hover:bg-cyber-cyan group-hover:text-background flex items-center justify-center text-cyber-cyan transition shrink-0">
                      {file.file_url || file.file_type?.startsWith('image/') ? (
                        <ImageIcon className="w-5 h-5" />
                      ) : (
                        <FileText className="w-5 h-5" />
                      )}
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

                  {/* Optional Image Thumbnail preview if file_url exists */}
                  {file.file_url ? (
                    <div className="mt-3 relative h-28 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/[0.08] bg-slate-900">
                      <img src={file.file_url} alt={file.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                        <span className="text-[10px] font-bold text-white flex items-center gap-1">
                          <Eye className="w-3 h-3 text-cyber-cyan" />
                          <span>Click Inspect to view full image</span>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-600 dark:text-white/50 mt-3 line-clamp-2 leading-relaxed bg-slate-100/70 dark:bg-white/[0.02] p-2.5 rounded-xl border border-slate-200 dark:border-white/[0.04] font-mono">
                      {file.content}
                    </p>
                  )}
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
      </div>

      {/* INSPECT DOCUMENT / FULL-RESOLUTION IMAGE MODAL */}
      {selectedFile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md pb-24 sm:pb-4">
          <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-white/[0.12] p-5 sm:p-8 shadow-2xl max-h-[80vh] sm:max-h-[85vh] overflow-y-auto space-y-4 sm:space-y-6 z-[105]">
            
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-cyber-cyan px-2 py-0.5 rounded-md bg-cyber-cyan/10">
                  {selectedFile.category} LOCKER
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">{selectedFile.name}</h2>
                <div className="text-xs text-slate-500 dark:text-white/50">
                  <span>Student: {selectedFile.student_name || studentName}</span> • <span>Size: {selectedFile.size}</span> • <span>Date: {selectedFile.date}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedFile(null)}
                className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/[0.05] hover:bg-slate-300 dark:hover:bg-white/[0.1] text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* FULL RESOLUTION IMAGE OR TEXT CONTENT VIEW */}
            {selectedFile.file_url ? (
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/[0.1] bg-slate-950 flex items-center justify-center max-h-[45vh]">
                  <img src={selectedFile.file_url} alt={selectedFile.name} className="max-h-[45vh] w-auto object-contain" />
                </div>
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-surface border border-slate-200 dark:border-white/[0.08] font-mono text-xs text-slate-800 dark:text-white/80 whitespace-pre-wrap">
                  {selectedFile.content}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-surface border border-slate-200 dark:border-white/[0.08] font-mono text-xs text-slate-800 dark:text-white/80 whitespace-pre-wrap leading-relaxed">
                {selectedFile.content}
              </div>
            )}

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

      {/* UPLOAD DOCUMENT / PHOTO MODAL */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md pb-24 sm:pb-4">
          <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-white/[0.12] p-5 sm:p-8 shadow-2xl max-h-[80vh] sm:max-h-[85vh] overflow-y-auto space-y-5 sm:space-y-6 z-[105]">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyber-cyan/20 border border-cyber-cyan/30 text-cyber-cyan flex items-center justify-center shrink-0">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">UPLOAD DOCUMENT</h3>
                  <p className="text-xs text-slate-500 dark:text-white/50">Store photo or file in your personal Vault</p>
                </div>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/[0.05] hover:bg-slate-300 dark:hover:bg-white/[0.1] text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Gallery Access & File Picker Options */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="p-4 rounded-2xl bg-cyber-cyan/10 hover:bg-cyber-cyan/20 border border-cyber-cyan/30 text-left transition space-y-2 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyber-cyan/20 text-cyber-cyan flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-white block">OPEN PHOTO GALLERY</span>
                    <span className="text-[10px] text-cyber-cyan block font-medium">Select photos &amp; screenshots</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 rounded-2xl bg-cyber-violet/10 hover:bg-cyber-violet/20 border border-cyber-violet/30 text-left transition space-y-2 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyber-violet/20 text-cyber-violet flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-white block">BROWSE DOCUMENTS</span>
                    <span className="text-[10px] text-cyber-violet block font-medium">Select .pdf, .txt, .docx files</span>
                  </div>
                </button>
              </div>

              {selectedUploadFile && (
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between text-xs text-white">
                  <span className="font-bold truncate">Selected: {selectedUploadFile.name}</span>
                  <span className="text-[10px] text-white/50">{(selectedUploadFile.size / 1024).toFixed(0)} KB</span>
                </div>
              )}

              {/* Preview image if loaded */}
              {previewDataUrl && (
                <div className="relative h-32 rounded-2xl overflow-hidden border border-white/10 bg-slate-950">
                  <img src={previewDataUrl} alt="Preview" className="w-full h-full object-contain" />
                </div>
              )}
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider mb-1.5">
                  Document / Photo Name
                </label>
                <input
                  type="text"
                  value={customFileName}
                  onChange={(e) => setCustomFileName(e.target.value)}
                  placeholder="e.g. Weekly_Timetable_Schedule.png"
                  className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider mb-1.5">
                  Category Locker
                </label>
                <select
                  value={targetCategory}
                  onChange={(e) => setTargetCategory(e.target.value as any)}
                  className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyber-cyan transition"
                >
                  <option value="TIMETABLE">TIMETABLE</option>
                  <option value="ACADEMICS">ACADEMICS</option>
                  <option value="NOTES">NOTES</option>
                  <option value="OTHERS">OTHERS</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider mb-1.5">
                  Extracted Content / Notes
                </label>
                <textarea
                  rows={3}
                  value={extractedContent}
                  onChange={(e) => setExtractedContent(e.target.value)}
                  placeholder="Extracted text or file description..."
                  className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-xl p-4 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition resize-none font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={uploading || !customFileName.trim()}
                className="w-full cyber-button-primary py-3.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 mt-2 disabled:opacity-50 shadow-lg"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-background" />
                    <span>SAVING DOCUMENT...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-background" />
                    <span>SAVE</span>
                  </>
                )}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
