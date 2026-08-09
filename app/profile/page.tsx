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
  Award,
  BookOpen,
  Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [userId, setUserId] = useState('');
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [school, setSchool] = useState('');
  const [college, setCollege] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [sector, setSector] = useState('ENGINEERING');
  const [stream, setStream] = useState('MPC');

  // Career Skillsets
  const [skills, setSkills] = useState<string[]>(['Python', 'Robotics', 'C++', 'Circuit Design']);
  const [newSkill, setNewSkill] = useState('');

  // Load profile from Supabase
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setFullName(data.full_name || '');
              setBio(data.bio || 'Aspiring engineer dedicated to robotics, automation systems, and hardware-software integration.');
              setSchool(data.school || 'St. Xavier Technical Academy');
              setCollege(data.college || 'Nexora Institute of Technology');
              setPhone(data.phone || '+91 98765 43210');
              setAddress(data.address || 'Tech Corridor Block 4, Bangalore');
              setLinkedin(data.linkedin || 'https://linkedin.com/in/student');
              setSector(data.sector || 'ENGINEERING');
              setStream(data.stream || 'MPC');
              if (data.skills && Array.isArray(data.skills)) {
                setSkills(data.skills);
              }
            }
            setLoading(false);
          });
      } else if (localStorage.getItem('nexoraGuestMode') === 'true') {
        // Demo guest — show pre-filled demo profile (read-only feel)
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
        const { error } = await supabase.from('profiles').upsert({
          id: user.id,
          full_name: fullName,
          bio,
          school,
          college,
          phone,
          address,
          linkedin,
          sector,
          stream,
          skills,
          updated_at: new Date()
        });

        if (error) throw error;
      }

      setSaving(false);
      setSaveSuccess(true);
      confetti({
        particleCount: 70,
        spread: 50,
        origin: { y: 0.6 }
      });
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setSaving(false);
      alert('Profile saved locally. Check connection for cloud sync.');
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 space-y-8">
      
      {/* PROFESSIONAL BANNER & HEADER */}
      <div className="glass-panel rounded-3xl overflow-hidden relative shadow-2xl">
        
        {/* Banner Gradient */}
        <div className="h-36 sm:h-48 bg-gradient-to-r from-cyber-cyan/30 via-cyber-violet/30 to-cyber-pink/30 relative">
          <div className="absolute inset-0 bg-cyber-mesh opacity-50"></div>
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/[0.1] text-[10px] font-black uppercase tracking-widest text-cyber-cyan">
            {sector} • {stream} TRACK
          </div>
        </div>

        {/* Profile Info Overlay */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            
            {/* Avatar */}
            <div className="relative">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-white dark:bg-surface border-4 border-white dark:border-background p-1 shadow-2xl overflow-hidden">
                <div className="w-full h-full bg-gradient-to-tr from-cyber-cyan to-cyber-violet rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-black text-background">
                  {fullName ? fullName.charAt(0).toUpperCase() : 'S'}
                </div>
              </div>
              <span className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-cyber-emerald border-2 border-white dark:border-background shadow-md"></span>
            </div>

            {/* Placement Readiness Badge */}
            <div className="glass-card px-4 py-2.5 rounded-2xl border border-cyber-cyan/30 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyber-cyan/15 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-slate-500 dark:text-white/50 tracking-wider block">PLACEMENT READINESS</span>
                <span className="text-sm font-black text-cyber-cyan">94% MATRICULATED</span>
              </div>
            </div>

          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{fullName || 'Nexora Student'}</h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-white/60 font-medium max-w-2xl leading-relaxed">{bio}</p>
          </div>
        </div>

      </div>

      {/* EDITABLE DOSSIER FORM */}
      <form onSubmit={handleSaveProfile} className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        
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

        {/* Bio textarea */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider mb-1.5">
            Student Mission & Bio Statement
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-xl p-4 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyber-cyan transition resize-none leading-relaxed"
          />
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
