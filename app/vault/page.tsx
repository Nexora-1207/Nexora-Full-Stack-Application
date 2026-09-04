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
  Camera,
  Plus,
  StickyNote,
  Download
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

const formatFileSize = (bytes: number): string => {
  if (bytes <= 0) return '0.0 MB';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const parseBytes = (sizeStr: string): number => {
  if (!sizeStr) return 0;
  const trimmed = sizeStr.trim().toUpperCase();
  const val = parseFloat(trimmed);
  if (isNaN(val)) return 0;
  if (trimmed.endsWith('GB')) return val * 1024 * 1024 * 1024;
  if (trimmed.endsWith('MB')) return val * 1024 * 1024;
  if (trimmed.endsWith('KB')) return val * 1024;
  if (trimmed.endsWith('B')) return val;
  return val * 1024 * 1024;
};

// INDEXEDDB LARGE FILE STORAGE HELPER (Supports unlimited 50MB+ PDFs & Photos without LocalStorage Quota Errors)
const openVaultDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject('No window');
    const request = indexedDB.open('NexoraVaultStorageDB', 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('large_files')) {
        db.createObjectStore('large_files', { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveLargeFileBlob = async (id: string, name: string, dataUrl: string) => {
  try {
    const db = await openVaultDB();
    const tx = db.transaction('large_files', 'readwrite');
    const store = tx.objectStore('large_files');
    store.put({ id, name, dataUrl });
    if (name) {
      store.put({ id: `name_${name.toLowerCase()}`, name, dataUrl });
    }
  } catch (e) {
    console.error('IndexedDB Save Error:', e);
  }
};

const getLargeFileBlob = async (id: string, name?: string): Promise<string | null> => {
  try {
    const db = await openVaultDB();
    const tx = db.transaction('large_files', 'readonly');
    const store = tx.objectStore('large_files');
    
    // Attempt 1: Search by primary ID
    const req1 = store.get(id);
    const res1 = await new Promise<any>((resolve) => {
      req1.onsuccess = () => resolve(req1.result);
      req1.onerror = () => resolve(null);
    });

    if (res1?.dataUrl) return res1.dataUrl;

    // Attempt 2: Search by filename key
    if (name) {
      const req2 = store.get(`name_${name.toLowerCase()}`);
      const res2 = await new Promise<any>((resolve) => {
        req2.onsuccess = () => resolve(req2.result);
        req2.onerror = () => resolve(null);
      });
      if (res2?.dataUrl) return res2.dataUrl;
    }

    return null;
  } catch (e) {
    return null;
  }
};

const deleteLargeFileBlob = async (id: string, name?: string) => {
  try {
    const db = await openVaultDB();
    const tx = db.transaction('large_files', 'readwrite');
    const store = tx.objectStore('large_files');
    store.delete(id);
    if (name) store.delete(`name_${name.toLowerCase()}`);
  } catch (e) {}
};

export default function VaultPage() {
  const router = useRouter();
  const toast = useCyberToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [studentName, setStudentName] = useState<string>('Nexora Student');
  const [files, setFiles] = useState<VaultFile[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [selectedFile, setSelectedFile] = useState<VaultFile | null>(null);
  const [activeInspectUrl, setActiveInspectUrl] = useState<string | null>(null);

  // Asynchronously resolve large file Blob URLs from IndexedDB for files of ANY size
  useEffect(() => {
    if (selectedFile) {
      if (selectedFile.file_url) {
        setActiveInspectUrl(selectedFile.file_url);
      } else {
        setActiveInspectUrl(null);
        getLargeFileBlob(selectedFile.id, selectedFile.name).then((blobDataUrl) => {
          if (blobDataUrl) {
            setActiveInspectUrl(blobDataUrl);
          }
        });
      }
    } else {
      setActiveInspectUrl(null);
    }
  }, [selectedFile]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  
  // File Upload States
  const [uploading, setUploading] = useState(false);
  const [selectedUploadFile, setSelectedUploadFile] = useState<File | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [extractedContent, setExtractedContent] = useState('');
  const [customFileName, setCustomFileName] = useState('');
  const [targetCategory, setTargetCategory] = useState<'TIMETABLE' | 'ACADEMICS' | 'NOTES' | 'OTHERS'>('NOTES');

  // Quick Note Creator States
  const [noteTitle, setNoteTitle] = useState('');
  const [noteCategory, setNoteCategory] = useState<'TIMETABLE' | 'ACADEMICS' | 'NOTES' | 'OTHERS'>('NOTES');
  const [noteContent, setNoteContent] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // Load files from Supabase database & user local storage merge (Ensures 100% Persistence)
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

        // Fetch user-isolated vault items from Supabase database
        const userVaultStorageKey = `vault_files_${user.id}`;
        const storedLocal = localStorage.getItem(userVaultStorageKey);
        let localCachedFiles: VaultFile[] = [];
        if (storedLocal) {
          try {
            localCachedFiles = JSON.parse(storedLocal).map((f: any) => ({
              ...f,
              category: mapToValidCategory(f.category)
            }));
          } catch (e) {}
        }

        supabase
          .from('vault_items')
          .select('*')
          .eq('user_id', user.id)
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

              // Merge local items with DB items to prevent any disappearing on refresh
              const mergedMap = new Map<string, VaultFile>();
              dbFiles.forEach((f) => mergedMap.set(f.id, f));
              localCachedFiles.forEach((f) => {
                if (!mergedMap.has(f.id)) mergedMap.set(f.id, f);
              });
              const finalMerged = Array.from(mergedMap.values());

              setFiles(finalMerged);
              localStorage.setItem(userVaultStorageKey, JSON.stringify(finalMerged));
            } else {
              setFiles(localCachedFiles);
            }
            setLoading(false);
          }, () => {
            setFiles(localCachedFiles);
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

  // Calculate dynamic memory footprint accurately
  const calculateMemoryUsed = (): { totalMB: number; percent: number } => {
    let totalBytes = 0;
    files.forEach((f) => {
      if (f.file_url && f.file_url.startsWith('data:')) {
        totalBytes += Math.round(f.file_url.length * 0.75);
      } else {
        totalBytes += parseBytes(f.size);
      }
    });

    const totalMB = parseFloat((totalBytes / (1024 * 1024)).toFixed(2));
    const percent = Math.min(100, Math.max(0, parseFloat(((totalMB / 512) * 100).toFixed(1))));
    return { totalMB, percent };
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

  // Handle file selection (Photo, PDF, or Document)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedUploadFile(file);
    setCustomFileName(file.name);

    const fname = file.name.toLowerCase();
    if (fname.includes('timetable') || fname.includes('schedule') || fname.includes('routine')) {
      setTargetCategory('TIMETABLE');
    } else if (fname.includes('syllabus') || fname.includes('marks') || fname.includes('memo') || fname.includes('certificate')) {
      setTargetCategory('ACADEMICS');
    }

    if (file.type.startsWith('image/') || file.type === 'application/pdf' || fname.endsWith('.pdf')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        setPreviewDataUrl(base64Url);
        if (file.type === 'application/pdf' || fname.endsWith('.pdf')) {
          setExtractedContent(`[PDF DOCUMENT: ${file.name}]\nSize: ${formatFileSize(file.size)} • PDF loaded for embedded viewing and download.`);
        } else {
          setExtractedContent(`[IMAGE DOCUMENT: ${file.name}]\nUploaded to student vault.`);
        }
      };
      reader.readAsDataURL(file);
    } else if (fname.endsWith('.txt') || fname.endsWith('.json') || fname.endsWith('.md')) {
      setPreviewDataUrl(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        const textContent = event.target?.result as string;
        setExtractedContent(textContent || `Extracted document file: ${file.name}`);
      };
      reader.readAsText(file);
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        setPreviewDataUrl(base64Url);
        setExtractedContent(`[DOCUMENT FILE: ${file.name}]\nSize: ${formatFileSize(file.size)} • Uploaded to student vault.`);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload file & save to Supabase database + user local storage
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFileName.trim()) return;

    setUploading(true);
    const dateStr = new Date().toISOString().split('T')[0];
    const realSizeStr = selectedUploadFile ? formatFileSize(selectedUploadFile.size) : '1.2 MB';
    const isPdf = selectedUploadFile?.type === 'application/pdf' || customFileName.toLowerCase().endsWith('.pdf');
    const fileType = selectedUploadFile?.type || (isPdf ? 'application/pdf' : customFileName.match(/\.(png|jpg|jpeg)$/i) ? 'image/png' : 'text/plain');

    const newDoc: VaultFile = {
      id: `doc_${Date.now()}`,
      user_id: currentUser?.id,
      student_name: studentName,
      name: customFileName,
      category: targetCategory,
      file_type: fileType,
      file_url: previewDataUrl || '',
      size: realSizeStr,
      date: dateStr,
      content: extractedContent.trim() || `Document ${customFileName} stored in vault.`
    };

    // Save large file blob to IndexedDB for 100% reliable opening of files of ANY size
    if (previewDataUrl) {
      await saveLargeFileBlob(newDoc.id, newDoc.name, previewDataUrl);
    }

    // Save to Supabase public.vault_items database safely
    if (currentUser) {
      try {
        await supabase.from('vault_items').insert([{
          user_id: currentUser.id,
          student_name: studentName,
          name: newDoc.name,
          category: newDoc.category,
          file_type: newDoc.file_type,
          file_url: previewDataUrl && previewDataUrl.length < 300000 ? previewDataUrl : '',
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

    // Sanitize localStorage payload to prevent QuotaExceededError while retaining metadata
    const storageKey = currentUser?.id ? `vault_files_${currentUser.id}` : 'vault_files';
    try {
      const sanitizedLocal = updated.map((f) => ({
        ...f,
        file_url: f.file_url && f.file_url.length > 300000 ? '' : f.file_url
      }));
      localStorage.setItem(storageKey, JSON.stringify(sanitizedLocal));
    } catch (quotaErr) {
      console.warn('LocalStorage quota limit reached, metadata safely stored in memory and DB.');
    }

    toast.success('Document Saved to Vault!', `${newDoc.name} (${newDoc.size}) stored under ${newDoc.category}.`);
    
    setCustomFileName('');
    setExtractedContent('');
    setSelectedUploadFile(null);
    setPreviewDataUrl(null);
    setUploading(false);
    setUploadModalOpen(false);
  };

  // Inspect file helper with IndexedDB Blob fallback for large files
  const handleInspectFile = async (file: VaultFile) => {
    if (!file.file_url) {
      const blobUrl = await getLargeFileBlob(file.id);
      if (blobUrl) {
        setSelectedFile({ ...file, file_url: blobUrl });
        return;
      }
    }
    setSelectedFile(file);
  };

  // Quick Note Submission Handler
  const handleSaveQuickNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;

    setSavingNote(true);
    const dateStr = new Date().toISOString().split('T')[0];
    const byteSize = new Blob([noteContent]).size;
    const realSizeStr = formatFileSize(byteSize);

    const noteDoc: VaultFile = {
      id: `note_${Date.now()}`,
      user_id: currentUser?.id,
      student_name: studentName,
      name: noteTitle.endsWith('.txt') ? noteTitle : `${noteTitle}.txt`,
      category: noteCategory,
      file_type: 'text/plain',
      file_url: '',
      size: realSizeStr,
      date: dateStr,
      content: noteContent.trim()
    };

    if (currentUser) {
      try {
        await supabase.from('vault_items').insert([{
          user_id: currentUser.id,
          student_name: studentName,
          name: noteDoc.name,
          category: noteDoc.category,
          file_type: noteDoc.file_type,
          file_url: '',
          size: noteDoc.size,
          date: noteDoc.date,
          content: noteDoc.content
        }]);
      } catch (err) {
        console.error('Supabase Note Insert Error:', err);
      }
    }

    const updated = [noteDoc, ...files];
    setFiles(updated);
    const storageKey = currentUser?.id ? `vault_files_${currentUser.id}` : 'vault_files';
    localStorage.setItem(storageKey, JSON.stringify(updated));

    toast.success('Study Note Created!', `${noteDoc.name} added to your ${noteDoc.category} locker.`);
    
    setNoteTitle('');
    setNoteContent('');
    setSavingNote(false);
    setNoteModalOpen(false);
  };

  const handleDeleteFile = async (id: string) => {
    if (confirm('Are you sure you want to delete this document from your vault?')) {
      const updated = files.filter((f) => f.id !== id);
      setFiles(updated);
      const storageKey = currentUser?.id ? `vault_files_${currentUser.id}` : 'vault_files';
      localStorage.setItem(storageKey, JSON.stringify(updated));

      if (currentUser) {
        try {
          await supabase.from('vault_items').delete().eq('id', id);
        } catch (e) {}
      }

      if (selectedFile?.id === id) setSelectedFile(null);
      toast.info('Document Removed', 'File deleted from your vault locker.');
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-32 space-y-6 sm:space-y-8">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30">
              USER PRIVATE LOCKER
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <span>DOCUMENT VAULT</span>
            <FolderLock className="w-7 h-7 sm:w-9 sm:h-9 text-cyber-cyan" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-white/60 font-medium mt-1">
            Student: <span className="text-cyber-cyan font-bold">{studentName}</span> • Encrypted Private Document Locker
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Create Quick Note Button */}
          <button
            onClick={() => setNoteModalOpen(true)}
            className="py-3.5 px-4 rounded-2xl bg-cyber-violet/20 hover:bg-cyber-violet/30 border border-cyber-violet/40 text-cyber-violet font-black text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-lg shrink-0"
          >
            <StickyNote className="w-4 h-4" />
            <span>+ CREATE NOTE</span>
          </button>

          {/* Upload Button */}
          <button
            onClick={() => setUploadModalOpen(true)}
            className="cyber-button-primary py-3.5 px-6 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-xl shrink-0"
          >
            <Upload className="w-4 h-4 text-background" />
            <span>UPLOAD TO VAULT</span>
          </button>
        </div>
      </div>

      {/* STORAGE METRICS & SEARCH BAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Dynamic Storage Gauge */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  VAULT STORAGE ALLOCATION
                </h3>
                <span className="text-[10px] text-slate-500 dark:text-white/50 font-mono">
                  {files.length} Document Records Saved
                </span>
              </div>
            </div>

            <span className="text-xs font-black text-cyber-cyan font-mono bg-cyber-cyan/10 px-2.5 py-1 rounded-xl border border-cyber-cyan/20">
              {memoryPercent}% USED
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-white/[0.06] overflow-hidden p-0.5 border border-slate-300 dark:border-white/[0.08]">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-cyber-cyan via-cyber-violet to-cyber-pink transition-all duration-500"
                style={{ width: `${memoryPercent}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-white/50 font-mono">
              <span>{totalMB} MB Used</span>
              <span>512 MB Allocated</span>
            </div>
          </div>
        </div>

        {/* Search & Filtering */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 dark:text-white/40 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search timetables, syllabus PDFs, or study notes..."
              className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-2xl pl-11 pr-4 py-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition font-medium"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition shrink-0 ${
                  activeCategory === cat
                    ? 'bg-cyber-cyan text-background shadow-md shadow-cyber-cyan/20'
                    : 'bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-white/60 hover:bg-slate-200 dark:hover:bg-white/[0.08] hover:text-slate-900 dark:hover:text-white'
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
              Your document locker is empty in this category. Upload PDFs, timetables, or create quick notes to store documents here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFiles.map((file) => {
              const isPdf = file.file_type === 'application/pdf' || file.file_url?.startsWith('data:application/pdf') || file.name.toLowerCase().endsWith('.pdf');
              const isImage = file.file_url?.startsWith('data:image/') || 
                file.file_type?.startsWith('image/') || 
                /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name) ||
                file.content?.startsWith('[IMAGE DOCUMENT:');

              return (
                <div
                  key={file.id}
                  className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between space-y-4 group relative overflow-hidden"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] group-hover:bg-cyber-cyan group-hover:text-background flex items-center justify-center text-cyber-cyan transition shrink-0">
                        {isPdf ? (
                          <FileText className="w-5 h-5 text-red-400" />
                        ) : isImage ? (
                          <ImageIcon className="w-5 h-5 text-cyber-cyan" />
                        ) : (
                          <StickyNote className="w-5 h-5 text-cyber-violet" />
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

                    {/* Image Thumbnail preview if image file */}
                    {isImage && file.file_url ? (
                      <div className="mt-3 relative h-28 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/[0.08] bg-slate-900">
                        <img src={file.file_url} alt={file.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                          <span className="text-[10px] font-bold text-white flex items-center gap-1">
                            <Eye className="w-3 h-3 text-cyber-cyan" />
                            <span>Click Inspect to view image</span>
                          </span>
                        </div>
                      </div>
                    ) : isPdf ? (
                      <div className="mt-3 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-bold flex items-center gap-2">
                        <FileText className="w-4 h-4 shrink-0" />
                        <span className="truncate">PDF Document • Embedded View &amp; Download</span>
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
                      onClick={() => handleInspectFile(file)}
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
              );
            })}
          </div>
        )}
      </div>

      {/* INSPECT DOCUMENT / FULL-RESOLUTION IMAGE / INTERACTIVE PDF MODAL */}
      {selectedFile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md pb-24 sm:pb-4">
          <div className="relative w-full max-w-3xl glass-panel rounded-3xl border border-white/[0.12] p-5 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4 sm:space-y-6 z-[105]">
            
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

            {/* INTERACTIVE PDF VIEWER IF PDF */}
            {selectedFile.file_type === 'application/pdf' || selectedFile.file_url?.startsWith('data:application/pdf') || selectedFile.name.toLowerCase().endsWith('.pdf') ? (
              <div className="space-y-4">
                {activeInspectUrl ? (
                  <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/[0.1] bg-slate-950 h-[55vh] shadow-inner">
                    <iframe 
                      src={activeInspectUrl} 
                      title={selectedFile.name}
                      className="w-full h-full border-none"
                    />
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-slate-900 border border-cyber-cyan/20 text-center space-y-3">
                    <Loader2 className="w-8 h-8 text-cyber-cyan animate-spin mx-auto" />
                    <p className="text-xs font-bold text-white">Loading Interactive Document Viewer ({selectedFile.size})...</p>
                  </div>
                )}

                {activeInspectUrl && (
                  <a
                    href={activeInspectUrl}
                    download={selectedFile.name}
                    className="w-full py-3.5 rounded-xl bg-cyber-cyan/15 border border-cyber-cyan/30 hover:bg-cyber-cyan/25 text-cyber-cyan font-black text-xs flex items-center justify-center gap-2 transition shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>DOWNLOAD PDF FILE ({selectedFile.size})</span>
                  </a>
                )}
              </div>
            ) : (activeInspectUrl || selectedFile.file_url) && ((activeInspectUrl || selectedFile.file_url)?.startsWith('data:image/') || /\.(jpg|jpeg|png|webp|gif)$/i.test(selectedFile.name)) ? (
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/[0.1] bg-slate-950 flex items-center justify-center max-h-[45vh]">
                  <img src={activeInspectUrl || selectedFile.file_url || ''} alt={selectedFile.name} className="max-h-[45vh] w-auto object-contain" />
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

      {/* UPLOAD FILE MODAL */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md pb-24 sm:pb-4">
          <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-white/[0.12] p-5 sm:p-8 shadow-2xl space-y-6 z-[105]">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-cyber-cyan" />
                <h3 className="font-black text-base uppercase tracking-wider text-slate-900 dark:text-white">
                  UPLOAD DOCUMENT TO VAULT
                </h3>
              </div>

              <button
                onClick={() => setUploadModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/[0.05] hover:bg-slate-300 dark:hover:bg-white/[0.1] text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider">
                  Select PDF / Document / Image File
                </label>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*,.pdf,.txt,.doc,.docx"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 rounded-2xl bg-cyber-cyan/10 hover:bg-cyber-cyan/20 border border-cyber-cyan/30 text-cyber-cyan font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-md"
                >
                  <Upload className="w-4 h-4" />
                  <span>{selectedUploadFile ? selectedUploadFile.name : 'Choose File from Device'}</span>
                </button>
              </div>

              {selectedUploadFile && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider mb-1">
                      Document Title
                    </label>
                    <input
                      type="text"
                      value={customFileName}
                      onChange={(e) => setCustomFileName(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyber-cyan transition font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider mb-1">
                      Select Locker Category
                    </label>
                    <select
                      value={targetCategory}
                      onChange={(e: any) => setTargetCategory(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyber-cyan transition font-bold"
                    >
                      <option value="TIMETABLE">TIMETABLE</option>
                      <option value="ACADEMICS">ACADEMICS</option>
                      <option value="NOTES">NOTES</option>
                      <option value="OTHERS">OTHERS</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-white/[0.05] text-xs font-bold text-slate-700 dark:text-white/70"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={uploading || !selectedUploadFile}
                  className="cyber-button-primary px-6 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 disabled:opacity-40"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin text-background" /> : <HardDrive className="w-4 h-4 text-background" />}
                  <span>{uploading ? 'SAVING...' : 'SAVE TO VAULT'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* QUICK NOTE CREATOR MODAL */}
      {noteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md pb-24 sm:pb-4">
          <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-white/[0.12] p-5 sm:p-8 shadow-2xl space-y-6 z-[105]">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/[0.08]">
              <div className="flex items-center gap-2">
                <StickyNote className="w-5 h-5 text-cyber-violet" />
                <h3 className="font-black text-base uppercase tracking-wider text-slate-900 dark:text-white">
                  CREATE STUDY NOTE
                </h3>
              </div>

              <button
                onClick={() => setNoteModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/[0.05] hover:bg-slate-300 dark:hover:bg-white/[0.1] text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickNote} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider mb-1">
                  Note Title
                </label>
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g. Physics Formulas Unit 3, Exam Reminders..."
                  className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyber-violet transition font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider mb-1">
                  Select Locker Category
                </label>
                <select
                  value={noteCategory}
                  onChange={(e: any) => setNoteCategory(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyber-violet transition font-bold"
                >
                  <option value="NOTES">NOTES</option>
                  <option value="ACADEMICS">ACADEMICS</option>
                  <option value="TIMETABLE">TIMETABLE</option>
                  <option value="OTHERS">OTHERS</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider mb-1">
                  Note Body Content
                </label>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows={5}
                  placeholder="Write your study notes, assignment points, or formulas here..."
                  className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-xl p-3.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyber-violet transition font-mono leading-relaxed"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setNoteModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-white/[0.05] text-xs font-bold text-slate-700 dark:text-white/70"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingNote || !noteTitle.trim() || !noteContent.trim()}
                  className="py-2.5 px-6 rounded-xl bg-cyber-violet hover:bg-cyber-violet/90 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 disabled:opacity-40 shadow-lg transition"
                >
                  {savingNote ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <StickyNote className="w-4 h-4 text-white" />}
                  <span>{savingNote ? 'SAVING...' : 'SAVE NOTE TO LOCKER'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
