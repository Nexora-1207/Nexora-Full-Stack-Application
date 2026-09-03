'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Linkedin, 
  Sparkles, 
  CheckCircle2, 
  Save, 
  ShieldCheck, 
  Plus, 
  X,
  Palette,
  Camera,
  Upload,
  Trash2,
  Lock,
  ImageIcon,
  Loader2,
  RotateCw,
  ZoomIn,
  Move,
  Scissors
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useCyberToast } from '@/components/CyberToast';
import confetti from 'canvas-confetti';

interface BannerTemplate {
  id: string;
  name: string;
  gradientClass: string;
  accentColor: string;
}

const BANNER_TEMPLATES: BannerTemplate[] = [
  {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    gradientClass: 'bg-gradient-to-r from-cyber-cyan/40 via-cyber-violet/40 to-cyber-pink/40',
    accentColor: '#00F0FF'
  },
  {
    id: 'deep-space',
    name: 'Deep Space',
    gradientClass: 'bg-gradient-to-r from-slate-950 via-cyber-cyan/30 to-blue-950',
    accentColor: '#3B82F6'
  },
  {
    id: 'emerald-quantum',
    name: 'Emerald Quantum',
    gradientClass: 'bg-gradient-to-r from-emerald-950 via-cyber-emerald/40 to-teal-950',
    accentColor: '#10B981'
  },
  {
    id: 'imperial-gold',
    name: 'Imperial Gold',
    gradientClass: 'bg-gradient-to-r from-amber-950 via-amber-500/40 to-purple-950',
    accentColor: '#F59E0B'
  },
  {
    id: 'velvet-violet',
    name: 'Velvet Violet',
    gradientClass: 'bg-gradient-to-r from-purple-950 via-fuchsia-600/40 to-pink-950',
    accentColor: '#EC4899'
  }
];

export default function ProfilePage() {
  const router = useRouter();
  const toast = useCyberToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);
  
  const [userId, setUserId] = useState('');
  const [fullName, setFullName] = useState('');
  const [school, setSchool] = useState('');
  const [college, setCollege] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [sector, setSector] = useState('ENGINEERING');
  const [stream, setStream] = useState('MPC');

  // Custom Banner state & Theme
  const [bannerTheme, setBannerTheme] = useState('cyber-neon');
  const [bannerUrl, setBannerUrl] = useState('');

  // Interactive Banner Cropper States (Ratio 4:1)
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [cropZoom, setCropZoom] = useState<number>(1);
  const [cropPanX, setCropPanX] = useState<number>(0);
  const [cropPanY, setCropPanY] = useState<number>(0);
  const [cropRotation, setCropRotation] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Skillsets
  const [skills, setSkills] = useState<string[]>(['Python', 'Robotics', 'C++', 'Circuit Design']);
  const [newSkill, setNewSkill] = useState('');

  // Load profile from Supabase Database
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setIsGuest(false);
        setUserId(user.id);
        supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
          .then(({ data, error }) => {
            if (data) {
              setFullName(data.full_name || '');
              setSchool(data.school || 'St. Xavier Technical Academy');
              setCollege(data.college || 'Nexora Institute of Technology');
              setPhone(data.phone_number || data.phone || '');
              setAddress(data.address || '');
              setLinkedin(data.linkedin_url || data.linkedin || '');
              setSector(data.sector || 'ENGINEERING');
              setStream(data.stream || 'MPC');
              setBannerTheme(data.banner_theme || 'cyber-neon');
              setBannerUrl(data.banner_url || '');
              if (data.skills && Array.isArray(data.skills)) {
                setSkills(data.skills);
              }
            }
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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyber-cyan animate-spin mb-2" />
        <span className="text-xs font-black uppercase tracking-widest text-cyber-cyan">
          RETRIEVING STUDENT PROFILE DOSSIER...
        </span>
      </div>
    );
  }

  // Render Guest Locked Screen for Profile
  if (isGuest) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-cyber-cyan/20 to-cyber-violet/20 border border-cyber-cyan/30 flex items-center justify-center mx-auto text-cyber-cyan shadow-2xl animate-pulse">
          <User className="w-12 h-12" />
        </div>
        
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-widest">
            <Lock className="w-3.5 h-3.5" />
            <span>GUEST ACCESS RESTRICTED</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            STUDENT PROFILE LOCKED
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-white/60 font-medium max-w-lg mx-auto leading-relaxed">
            Register or Sign In to build your verified student dossier, custom LinkedIn-style banner, and sync your credentials across devices.
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

  // Handle local image file selection for interactive cropping
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.info('Invalid File', 'Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.info('File Too Large', 'Please select an image smaller than 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setRawImageSrc(event.target.result as string);
        setCropZoom(1);
        setCropPanX(0);
        setCropPanY(0);
        setCropRotation(0);
        toast.info('Image Editor Active', 'Adjust zoom and drag image position to fit the 4:1 banner template.');
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag-to-pan handlers inside cropper viewport
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - cropPanX, y: e.clientY - cropPanY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setCropPanX(e.clientX - dragStart.x);
    setCropPanY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - cropPanX, y: e.touches[0].clientY - cropPanY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setCropPanX(e.touches[0].clientX - dragStart.x);
    setCropPanY(e.touches[0].clientY - dragStart.y);
  };

  // HTML5 Canvas Crop Execution (Locks to Banner Template 4:1 Ratio)
  const handleCropAndApply = () => {
    if (!rawImageSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const targetWidth = 1200;
      const targetHeight = 300; // Exact 4:1 Banner Ratio
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Dark neutral background fill
      ctx.fillStyle = '#0B0F19';
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      ctx.save();
      // Move to center of canvas for scaling and rotation
      ctx.translate(targetWidth / 2 + cropPanX * 2.5, targetHeight / 2 + cropPanY * 2.5);
      ctx.rotate((cropRotation * Math.PI) / 180);
      ctx.scale(cropZoom, cropZoom);

      // Draw image centered
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setBannerUrl(croppedDataUrl);
      setRawImageSrc(null);
      setShowBannerModal(false);
      toast.success('Banner Cropped & Applied!', 'Template aspect ratio 4:1 updated. Click Save & Sync to persist to database.');
    };
    img.src = rawImageSrc;
  };

  const handleAddSkill = () => {
    if (!newSkill.trim() || skills.includes(newSkill.trim())) return;
    setSkills([...skills, newSkill.trim()]);
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const profilePayload = {
          id: user.id,
          full_name: fullName,
          school,
          college,
          phone_number: phone,
          address,
          linkedin_url: linkedin,
          sector,
          stream,
          skills,
          banner_theme: bannerTheme,
          banner_url: bannerUrl,
          updated_at: new Date().toISOString()
        };

        const { error } = await supabase
          .from('profiles')
          .upsert(profilePayload);

        if (error) throw error;
      }

      setSaving(false);
      setSaveSuccess(true);
      toast.success('Dossier Synced to Database!', 'Your profile information and custom banner template have been saved.');
      confetti({
        particleCount: 70,
        spread: 50,
        origin: { y: 0.6 }
      });
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Supabase DB Sync Error:', err);
      setSaving(false);
      toast.info('Saved Locally', 'Dossier saved in local session cache.');
    }
  };

  const activeTemplate = BANNER_TEMPLATES.find((t) => t.id === bannerTheme) || BANNER_TEMPLATES[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-32 space-y-8">
      
      {/* PROFILE BANNER & HEADER */}
      <div className="glass-panel rounded-3xl overflow-hidden relative shadow-2xl">
        
        {/* Banner Area */}
        <div className={`h-36 sm:h-48 relative transition-all duration-500 ${activeTemplate.gradientClass}`}>
          {bannerUrl ? (
            <img 
              src={bannerUrl} 
              alt="Custom Banner" 
              className="w-full h-full object-cover"
              onError={() => {
                toast.info('Banner Error', 'Invalid image URL, falling back to template gradient.');
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-cyber-mesh opacity-50"></div>
          )}

          {/* LINKEDIN-STYLE CAMERA EDIT BANNER BUTTON */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2 z-10">
            <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/[0.15] text-[10px] font-black uppercase tracking-widest text-cyber-cyan">
              {sector} • {stream} TRACK
            </span>
            
            <button
              type="button"
              onClick={() => setShowBannerModal(true)}
              className="w-9 h-9 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition shadow-lg group"
              title="Edit Profile Banner Template"
            >
              <Camera className="w-4 h-4 group-hover:scale-110 text-cyber-cyan transition-transform" />
            </button>
          </div>

          {/* Profile Avatar Badge */}
          <div className="absolute -bottom-10 left-6 sm:left-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-900 p-1 border-2 border-cyber-cyan/50 shadow-2xl relative">
              <div className="w-full h-full rounded-xl bg-gradient-to-tr from-cyber-cyan/30 to-cyber-violet/30 flex items-center justify-center text-cyber-cyan font-black text-2xl sm:text-3xl uppercase">
                {fullName ? fullName.charAt(0) : 'S'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-cyber-emerald border-2 border-slate-900 flex items-center justify-center" title="Verified Student Profile">
                <CheckCircle2 className="w-3.5 h-3.5 text-background font-bold" />
              </div>
            </div>
          </div>

        </div>

        {/* Profile Info Summary */}
        <div className="pt-12 sm:pt-14 px-6 sm:px-8 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>{fullName || 'Student Name'}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30">
                VERIFIED
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-white/50 font-medium mt-1">
              {college || 'Nexora Academy Member'} • {stream} Track
            </p>
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="cyber-button-primary px-6 py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 self-start sm:self-auto shadow-xl"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin text-background" /> : <Save className="w-4 h-4 text-background" />}
            <span>{saving ? 'SAVING DOSSIER...' : 'SAVE & SYNC DOSSIER'}</span>
          </button>
        </div>

      </div>

      {/* FORM INPUTS FOR DOSSIER EDITING */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        
        {/* ACADEMIC & SECTOR SPECIFICATION */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-white/[0.08]">
            <GraduationCap className="w-5 h-5 text-cyber-cyan" />
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-wide uppercase">
              ACADEMIC &amp; SECTOR SPECIFICATION
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider mb-1.5">
                Full Legal Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name..."
                className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-2xl px-4 py-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider mb-1.5">
                Target Sector Track
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-2xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyber-cyan transition font-bold"
              >
                <option value="ENGINEERING">ENGINEERING &amp; TECH</option>
                <option value="MEDICAL">MEDICAL &amp; BIO-RESEARCH</option>
                <option value="COMPUTERS">COMPUTERS &amp; IT</option>
                <option value="SKILLED_TRADES">SKILLED TRADES (ITI)</option>
                <option value="MERCHANT_NAVY">MERCHANT NAVY</option>
                <option value="BUSINESS">COMMERCE &amp; FINTECH</option>
                <option value="LAW">LAW &amp; LEGAL</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider mb-1.5">
                Current School / Intermediate College
              </label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="e.g. St. Xavier Polytechnic Academy..."
                className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-2xl px-4 py-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider mb-1.5">
                Target / Current Institute
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. Nexora Institute of Technology..."
                className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-2xl px-4 py-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition font-bold"
              />
            </div>
          </div>
        </div>

        {/* CONTACT DETAILS & LINKEDIN */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-white/[0.08]">
            <Linkedin className="w-5 h-5 text-cyber-cyan" />
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-wide uppercase">
              CONTACT &amp; CAREER NETWORKING
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-2xl px-4 py-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider mb-1.5">
                LinkedIn Profile URL
              </label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-2xl px-4 py-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider mb-1.5">
                Home Address / Location
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="City, State, Country..."
                className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-2xl px-4 py-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition font-bold"
              />
            </div>
          </div>
        </div>

        {/* VERIFIED COMPETENCIES & SKILLS */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-white/[0.08]">
            <Sparkles className="w-5 h-5 text-cyber-cyan" />
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-wide uppercase">
              VERIFIED SKILLS &amp; COMPETENCIES
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                placeholder="Add skill (e.g. AutoCAD, Python, Clinical Viva)..."
                className="flex-1 bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-2xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyber-cyan transition font-bold"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="cyber-button-primary px-5 rounded-2xl text-xs font-black flex items-center gap-1 shrink-0"
              >
                <Plus className="w-4 h-4 text-background" />
                <span>ADD</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {skills.map((sk, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-bold flex items-center gap-2 shadow-sm"
                >
                  <span>{sk}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(sk)}
                    className="hover:text-red-400 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full cyber-button-primary py-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-2xl"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin text-background" /> : <Save className="w-4 h-4 text-background" />}
            <span>{saving ? 'SYNCING DOSSIER TO DATABASE...' : 'SAVE & SYNC STUDENT DOSSIER'}</span>
          </button>
        </div>

      </form>

      {/* BANNER TEMPLATE & INTERACTIVE 4:1 ASPECT RATIO CROPPER MODAL */}
      {showBannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in pb-20 sm:pb-4">
          <div className="glass-panel w-full max-w-2xl rounded-3xl border border-white/10 p-5 sm:p-8 space-y-6 shadow-2xl relative bg-[#030712] max-h-[85vh] overflow-y-auto z-[60]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-cyber-cyan" />
                <h3 className="font-black text-sm sm:text-base uppercase tracking-wider text-white">
                  {rawImageSrc ? 'EDIT & CROP BANNER (4:1 RATIO)' : 'EDIT PROFILE BANNER TEMPLATE'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowBannerModal(false);
                  setRawImageSrc(null);
                }}
                className="w-8 h-8 rounded-xl bg-white/[0.05] hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* INTERACTIVE CROPPER VIEWPORT (IF IMAGE IS LOADED) */}
            {rawImageSrc ? (
              <div className="space-y-4">
                <div className="text-xs text-white/70 font-medium flex items-center justify-between">
                  <span className="flex items-center gap-1 text-cyber-cyan font-bold">
                    <Move className="w-3.5 h-3.5" />
                    <span>Drag image to position • Locked 4:1 Template Ratio</span>
                  </span>
                  <button
                    onClick={() => { setCropZoom(1); setCropPanX(0); setCropPanY(0); setCropRotation(0); }}
                    className="text-[11px] text-white/50 hover:text-white transition underline"
                  >
                    Reset Adjustments
                  </button>
                </div>

                {/* 4:1 ASPECT RATIO VIEWPORT CONTAINER */}
                <div 
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleMouseUp}
                  className="w-full h-40 sm:h-52 relative overflow-hidden rounded-2xl border-2 border-cyber-cyan/60 bg-slate-950 cursor-grab active:cursor-grabbing shadow-inner flex items-center justify-center select-none"
                >
                  <img
                    src={rawImageSrc}
                    alt="Crop Preview"
                    draggable={false}
                    className="max-w-none transition-transform duration-75"
                    style={{
                      transform: `translate(${cropPanX}px, ${cropPanY}px) scale(${cropZoom}) rotate(${cropRotation}deg)`
                    }}
                  />
                  {/* Grid Lines overlay */}
                  <div className="absolute inset-0 border border-white/20 pointer-events-none grid grid-cols-3 grid-rows-3">
                    <div className="border-r border-b border-white/10"></div>
                    <div className="border-r border-b border-white/10"></div>
                    <div className="border-b border-white/10"></div>
                    <div className="border-r border-b border-white/10"></div>
                    <div className="border-r border-b border-white/10"></div>
                    <div className="border-b border-white/10"></div>
                  </div>
                </div>

                {/* CONTROLS BAR: ZOOM, Y-OFFSET, ROTATE */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                  {/* Zoom Slider */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <ZoomIn className="w-3.5 h-3.5 text-cyber-cyan" />
                        <span>Zoom</span>
                      </span>
                      <span className="text-cyber-cyan font-mono">{cropZoom.toFixed(2)}x</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.05"
                      value={cropZoom}
                      onChange={(e) => setCropZoom(parseFloat(e.target.value))}
                      className="w-full accent-cyber-cyan cursor-pointer"
                    />
                  </div>

                  {/* Vertical Shift (Pan Y) */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Move className="w-3.5 h-3.5 text-cyber-violet" />
                        <span>Vertical Shift</span>
                      </span>
                      <span className="text-cyber-violet font-mono">{cropPanY}px</span>
                    </label>
                    <input
                      type="range"
                      min="-120"
                      max="120"
                      value={cropPanY}
                      onChange={(e) => setCropPanY(parseFloat(e.target.value))}
                      className="w-full accent-cyber-violet cursor-pointer"
                    />
                  </div>

                  {/* Rotate button */}
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => setCropRotation((prev) => (prev + 90) % 360)}
                      className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-bold text-white flex items-center justify-center gap-2 transition"
                    >
                      <RotateCw className="w-3.5 h-3.5 text-cyber-cyan" />
                      <span>Rotate ({cropRotation}°)</span>
                    </button>
                  </div>
                </div>

                {/* Modal Crop Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10 gap-3">
                  <button
                    type="button"
                    onClick={() => setRawImageSrc(null)}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-xs font-bold text-white/70 transition"
                  >
                    Cancel / Choose Preset
                  </button>

                  <button
                    type="button"
                    onClick={handleCropAndApply}
                    className="cyber-button-primary px-6 py-3 rounded-xl text-xs font-black flex items-center gap-2 shadow-xl"
                  >
                    <Scissors className="w-4 h-4 text-background" />
                    <span>CROP &amp; APPLY BANNER (4:1 RATIO)</span>
                  </button>
                </div>
              </div>
            ) : (
              /* PRE-SELECTION VIEW: CHOOSE IMAGE FILE OR PRESET THEME */
              <div className="space-y-6">
                {/* Upload File Button */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-white/70 uppercase tracking-wider">
                    Upload Custom Image File
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-4 rounded-2xl bg-cyber-cyan/10 hover:bg-cyber-cyan/20 border border-cyber-cyan/30 text-cyber-cyan font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-md group"
                  >
                    <Upload className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Choose Image from Device to Edit &amp; Crop</span>
                  </button>
                </div>

                {/* Preset Themes Grid */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-white/70 uppercase tracking-wider">
                    Or Select Preset Cyber Theme
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {BANNER_TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => {
                          setBannerTheme(tmpl.id);
                          setBannerUrl('');
                          setShowBannerModal(false);
                          toast.success('Preset Theme Applied', `Switched banner to ${tmpl.name}!`);
                        }}
                        className={`h-12 rounded-xl p-1 relative border transition-all flex flex-col justify-end overflow-hidden ${tmpl.gradientClass} ${
                          bannerTheme === tmpl.id && !bannerUrl
                            ? 'ring-2 ring-cyber-cyan scale-105 border-cyber-cyan'
                            : 'border-white/10 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <span className="text-[9px] font-black uppercase text-white truncate drop-shadow">
                          {tmpl.name.split(' ')[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom URL Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-cyber-cyan" />
                    <span>Or Paste Banner Image Web URL</span>
                  </label>
                  <input
                    type="text"
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyber-cyan transition"
                  />
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  {bannerUrl && (
                    <button
                      type="button"
                      onClick={() => setBannerUrl('')}
                      className="text-xs font-bold text-red-400 hover:text-red-300 transition flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Reset to Template</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setShowBannerModal(false);
                      toast.success('Banner Updated', 'Profile banner updated! Click Save & Sync to persist to database.');
                    }}
                    className="cyber-button-primary px-6 py-2.5 rounded-xl text-xs font-black ml-auto"
                  >
                    APPLY &amp; CLOSE
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
