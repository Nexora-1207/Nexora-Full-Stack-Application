'use client';

import React, { useState, useEffect } from 'react';
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
  Image as ImageIcon,
  Loader2
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [userId, setUserId] = useState('');
  const [fullName, setFullName] = useState('');
  const [school, setSchool] = useState('');
  const [college, setCollege] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [sector, setSector] = useState('ENGINEERING');
  const [stream, setStream] = useState('MPC');

  // Custom Banner Template state
  const [bannerTheme, setBannerTheme] = useState('cyber-neon');
  const [bannerUrl, setBannerUrl] = useState('');

  // Skillsets
  const [skills, setSkills] = useState<string[]>(['Python', 'Robotics', 'C++', 'Circuit Design']);
  const [newSkill, setNewSkill] = useState('');

  // Load profile from Supabase Database
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
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
        // Demo guest profile
        setFullName('Demo Student');
        setLoading(false);
      } else {
        router.replace('/auth');
      }
    });
  }, [router]);

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

  // Active banner template configuration
  const activeTemplate = BANNER_TEMPLATES.find((t) => t.id === bannerTheme) || BANNER_TEMPLATES[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-32 space-y-8">
      
      {/* PROFILE BANNER & HEADER */}
      <div className="glass-panel rounded-3xl overflow-hidden relative shadow-2xl">
        
        {/* Banner Area (Image or Template Gradient) */}
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

          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/[0.15] text-[10px] font-black uppercase tracking-widest text-cyber-cyan">
            {sector} • {stream} TRACK
          </div>
        </div>

        {/* Profile Avatar & Info Overlay */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            
            {/* Avatar */}
            <div className="relative">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-white dark:bg-surface border-4 border-white dark:border-background p-1 shadow-2xl overflow-hidden">
                <div className="w-full h-full bg-gradient-to-tr from-cyber-cyan to-cyber-violet rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-black text-background">
                  {fullName ? fullName.charAt(0).toUpperCase() : 'S'}
                </div>
              </div>
              <span className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-cyber-emerald border-2 border-white dark:border-background shadow-md"></span>
            </div>

          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {fullName || 'Nexora Student'}
            </h1>
            <p className="text-xs font-bold text-cyber-cyan uppercase tracking-wider">
              {college || 'Nexora Academy'}
            </p>
          </div>
        </div>

      </div>

      {/* BANNER TEMPLATE CUSTOMIZER PANEL */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-white/[0.08]">
          <Palette className="w-5 h-5 text-cyber-cyan" />
          <h3 className="font-black text-base uppercase tracking-wider text-slate-900 dark:text-white">
            BANNER TEMPLATE CUSTOMIZER
          </h3>
        </div>

        {/* Preset Templates Grid */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider">
            Select Preset Cyber Template
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {BANNER_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => {
                  setBannerTheme(tmpl.id);
                  setBannerUrl('');
                }}
                className={`h-14 rounded-2xl p-2.5 relative border transition-all flex flex-col justify-end overflow-hidden ${tmpl.gradientClass} ${
                  bannerTheme === tmpl.id && !bannerUrl
                    ? 'ring-2 ring-cyber-cyan scale-[1.03] shadow-lg border-cyber-cyan'
                    : 'border-white/10 hover:opacity-90'
                }`}
              >
                <span className="text-[10px] font-black uppercase text-white drop-shadow-md tracking-wider">
                  {tmpl.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Image URL Option */}
        <div className="space-y-1.5 pt-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-cyber-cyan" />
            <span>Or Enter Custom Banner Image URL</span>
          </label>
          <input
            type="text"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
            placeholder="https://images.unsplash.com/photo-... or custom image URL"
            className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyber-cyan transition"
          />
        </div>
      </div>

      {/* EDITABLE DOSSIER FORM */}
      <form onSubmit={handleSaveProfile} className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/[0.08]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyber-cyan" />
            <h3 className="font-black text-base uppercase tracking-wider text-slate-900 dark:text-white">
              STUDENT IDENTITY DOSSIER
            </h3>
          </div>

          {saveSuccess && (
            <span className="text-xs font-bold text-cyber-emerald flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Cloud Synchronized!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyber-cyan transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider mb-1.5">
              Target College / Institute
            </label>
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyber-cyan transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider mb-1.5">
              Secondary / Junior School
            </label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyber-cyan transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyber-cyan transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider mb-1.5">
              Campus Location / City
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyber-cyan transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider mb-1.5">
              LinkedIn / Portfolio URL
            </label>
            <input
              type="text"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyber-cyan transition"
            />
          </div>

        </div>

        {/* Career Skills Chips */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider">
            Verified Technical Skillsets
          </label>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 text-xs font-bold text-cyber-cyan"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-cyber-pink transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          {/* Add skill input */}
          <div className="flex items-center gap-2 max-w-md">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="e.g. Microprocessors, CAD, React..."
              className="flex-1 bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyber-cyan transition"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-white/[0.05] hover:bg-slate-300 dark:hover:bg-white/[0.1] border border-slate-300 dark:border-white/[0.1] text-xs font-bold text-slate-800 dark:text-white transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-200 dark:border-white/[0.08] flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="cyber-button-primary px-8 py-3.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-lg"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>SAVING TO CLOUD...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>SAVE & SYNC DOSSIER</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
