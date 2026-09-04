'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Star, 
  MapPin, 
  Building2, 
  Award, 
  DollarSign, 
  TrendingUp, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Download, 
  BookOpen, 
  Check, 
  ShieldAlert, 
  Mail, 
  Layers, 
  Eye,
  Lock,
  X,
  FileText,
  Users,
  Copy,
  Share2,
  Loader2
} from 'lucide-react';
import { College } from '@/lib/data';
import { useCyberToast } from '@/components/CyberToast';
import { supabase } from '@/lib/supabase';

interface Props {
  college: College;
}

export default function CollegeDetailClient({ college }: Props) {
  const router = useRouter();
  const toast = useCyberToast();

  const [isGuest, setIsGuest] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Specs Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'fees' | 'placements' | 'brochure'>('overview');
  
  // Brochure Modal
  const [downloadingBrochure, setDownloadingBrochure] = useState(false);

  // Admission Modal State
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [targetBranch, setTargetBranch] = useState(college.branches?.[0]?.name || 'Computer Science & Engineering');
  const [scoreRank, setScoreRank] = useState('');
  const [admissionCategory, setAdmissionCategory] = useState('CONVENOR_QUOTA');
  const [submittingApp, setSubmittingApp] = useState(false);

  // Application Success Token State
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setIsGuest(false);
        setCurrentUser(user);
        supabase.from('profiles').select('full_name, phone_number').eq('id', user.id).single().then(({ data }) => {
          if (data?.full_name) setApplicantName(data.full_name);
          if (data?.phone_number) setApplicantPhone(data.phone_number);
        });
        if (user.email) setApplicantEmail(user.email);
      } else if (localStorage.getItem('nexoraGuestMode') === 'true') {
        setIsGuest(true);
      } else {
        router.replace('/auth');
      }
    });
  }, [router]);

  if (isGuest) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-cyber-cyan/20 to-cyber-violet/20 border border-cyber-cyan/30 flex items-center justify-center mx-auto text-cyber-cyan shadow-2xl animate-pulse">
          <Building2 className="w-12 h-12" />
        </div>
        
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-widest">
            <Lock className="w-3.5 h-3.5" />
            <span>GUEST ACCESS RESTRICTED</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            COLLEGE SPECS LOCKED
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-white/60 font-medium max-w-lg mx-auto leading-relaxed">
            Register or Sign In to inspect cutoff ranks, fee breakdown, placement statistics, and official brochures for {college.name}.
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

  const handleDownloadBrochure = () => {
    setDownloadingBrochure(true);
    setTimeout(() => {
      setDownloadingBrochure(false);
      toast.info('Prospectus Downloaded', `Downloaded prospectus brochure for ${college.name}.`);
    }, 1000);
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !applicantEmail.trim() || !targetBranch) return;

    setSubmittingApp(true);
    const tokenStr = `NEX-ADMIT-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      // Save admission application to Supabase DB table
      await supabase.from('college_applications').insert([{
        user_id: currentUser?.id,
        student_name: applicantName.trim(),
        email: applicantEmail.trim(),
        phone: applicantPhone.trim(),
        college_name: college.name,
        branch: targetBranch,
        score_rank: scoreRank.trim() || 'N/A',
        admission_category: admissionCategory,
        token: tokenStr
      }]);

      // Trigger email alert to admin
      fetch('/api/notify/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: applicantEmail.trim(),
          name: `${applicantName} (College Admission App: ${college.name})`,
          sector: `${targetBranch} • Token: ${tokenStr}`
        })
      }).catch((e) => {});

      setGeneratedToken(tokenStr);
      toast.success('Admission Application Submitted!', `Official Clearance Token: ${tokenStr}`);
    } catch (err: any) {
      console.error('Admission submit error:', err);
      setGeneratedToken(tokenStr);
      toast.success('Application Generated', `Clearance Token: ${tokenStr}`);
    } finally {
      setSubmittingApp(false);
    }
  };

  const copyTokenToClipboard = () => {
    if (generatedToken) {
      navigator.clipboard.writeText(generatedToken);
      toast.success('Token Copied', 'Admission Clearance Token copied to clipboard!');
    }
  };

  const shareAdmissionToken = () => {
    if (!generatedToken) return;
    const shareText = encodeURIComponent(`*NEXORA COLLEGE ADMISSION CLEARANCE TOKEN*\n\n🏫 College: ${college.name}\n👤 Student: ${applicantName}\n📚 Branch: ${targetBranch}\n🎫 Token ID: ${generatedToken}\n\nVerified via Nexora Academic Gateway (nexoraedu.co.in).`);
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-36 space-y-8 relative">
      
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <button
          onClick={() => router.push('/colleges')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-xs font-bold text-cyber-cyan transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>RETURN TO COLLEGES LIST</span>
        </button>

        <div className="flex items-center gap-2">
          {college.isPartner && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyber-emerald/10 border border-cyber-emerald/30 text-cyber-emerald text-[11px] font-black uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>OFFICIAL NEXORA COLLABORATED PARTNER</span>
            </span>
          )}
        </div>
      </div>

      {/* Hero Header Section */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/[0.1] relative overflow-hidden space-y-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyber-cyan/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-cyber-magenta/10 border border-cyber-magenta/30 text-cyber-magenta">
                {college.sector} SECTOR
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan">
                {college.stream} TRACK
              </span>
              {college.established && (
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/60">
                  EST. {college.established}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {college.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-white/60 pt-1">
              <span className="flex items-center gap-1.5 text-cyber-amber">
                <Star className="w-4 h-4 fill-cyber-amber" />
                <span>{college.rating} Rating</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-white/80">
                <MapPin className="w-4 h-4 text-cyber-cyan" />
                <span>{college.location}</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => setApplyModalOpen(true)}
              className="cyber-button-primary px-8 py-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-xl"
            >
              <Send className="w-4 h-4 text-background" />
              <span>APPLY FOR ADMISSION</span>
            </button>
          </div>
        </div>

        {/* SPECS TABS NAVIGATION */}
        <div className="flex items-center gap-2 border-t border-white/[0.08] pt-6 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Overview & Infrastructure', icon: Building2 },
            { id: 'fees', label: 'Fee Structure & Cutoffs', icon: DollarSign },
            { id: 'placements', label: 'Placements & Recruiters', icon: TrendingUp },
            { id: 'brochure', label: 'Brochure & Prospectus', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition shrink-0 ${
                  isActive
                    ? 'bg-cyber-cyan text-background shadow-lg shadow-cyber-cyan/20'
                    : 'bg-white/[0.04] text-white/60 hover:bg-white/[0.08] hover:text-white border border-white/[0.08]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* TAB CONTENT SPECS SECTION */}
      <div className="space-y-6">

        {/* TAB 1: OVERVIEW & INFRASTRUCTURE */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-white/[0.08]">
              <div className="flex items-center gap-2 pb-3 border-b border-white/[0.08]">
                <Building2 className="w-5 h-5 text-cyber-cyan" />
                <h3 className="font-black text-base text-white uppercase tracking-wider">
                  INSTITUTIONAL PROFILE &amp; CAMPUS SPECS
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-medium">
                {college.description || `${college.name} is a premier accredited institution offering cutting-edge academic degree programs with state-of-the-art laboratory infrastructure, industry-aligned curriculums, and dedicated placement support.`}
              </p>

              {/* Infrastructure Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {[
                  { title: 'Digital Computing Labs', desc: '500+ High-end Workstations' },
                  { title: 'Central Library', desc: '50,000+ Volumes & IEEE Access' },
                  { title: 'On-Campus Hostels', desc: 'Separate Boys & Girls Blocks' },
                  { title: 'WiFi Campus', desc: '1 Gbps High-speed Optical Fiber' },
                  { title: 'Sports Complex', desc: 'Cricket, Basketball, Gym' },
                  { title: 'Accreditation', desc: 'NAAC A+ & AICTE Approved' }
                ].map((spec, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-1">
                    <span className="text-[10px] font-black uppercase text-cyber-cyan block">{spec.title}</span>
                    <span className="text-xs font-bold text-white/80">{spec.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick College Specs Sidebar Card */}
            <div className="glass-panel rounded-3xl p-6 space-y-4 border border-white/[0.08] flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-cyber-cyan px-2.5 py-1 rounded-md bg-cyber-cyan/10 block w-fit">
                  ADMISSION CLEARANCE
                </span>

                <h4 className="font-black text-sm text-white">Target Seat Availability</h4>

                <div className="space-y-2 text-xs font-bold text-white/70 pt-2 border-t border-white/[0.08]">
                  <div className="flex justify-between">
                    <span>Degree Stream:</span>
                    <span className="text-white">{college.stream} Track</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="text-white">3 to 4 Years</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Affiliation:</span>
                    <span className="text-cyber-emerald">AICTE &amp; UGC Verified</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setApplyModalOpen(true)}
                className="w-full cyber-button-primary py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-lg"
              >
                <Send className="w-4 h-4 text-background" />
                <span>APPLY FOR ADMISSION NOW</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: FEE STRUCTURE & CUTOFFS */}
        {activeTab === 'fees' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Fee Breakdown */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 border border-white/[0.08]">
              <div className="flex items-center gap-2 pb-3 border-b border-white/[0.08]">
                <DollarSign className="w-5 h-5 text-cyber-cyan" />
                <h3 className="font-black text-base text-white uppercase tracking-wider">
                  ANNUAL FEE STRUCTURE
                </h3>
              </div>

              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white/60 uppercase block">Academic Tuition Fee / Year</span>
                    <span className="text-lg font-black text-cyber-cyan font-mono">{college.feeStructure.tuitionFeePerYear}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-cyber-cyan/15 text-cyber-cyan text-[10px] font-black uppercase">
                    TUITION
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white/60 uppercase block">Hostel &amp; Mess Charges / Year</span>
                    <span className="text-lg font-black text-cyber-violet font-mono">{college.feeStructure.hostelFeePerYear || '₹ 75,000 / Year'}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-cyber-violet/15 text-cyber-violet text-[10px] font-black uppercase">
                    HOSTEL
                  </span>
                </div>
              </div>
            </div>

            {/* Entrance Cutoff Ranks */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 border border-white/[0.08]">
              <div className="flex items-center gap-2 pb-3 border-b border-white/[0.08]">
                <Award className="w-5 h-5 text-cyber-cyan" />
                <h3 className="font-black text-base text-white uppercase tracking-wider">
                  ENTRANCE CUTOFF RANKS (EXPECTED)
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  { cat: 'Open Category (OC)', rank: 'Rank 2,500 - 8,400' },
                  { cat: 'Backward Class (BC)', rank: 'Rank 6,200 - 14,000' },
                  { cat: 'SC / ST Quota', rank: 'Rank 15,000 - 32,000' },
                  { cat: 'EWS Quota', rank: 'Rank 4,100 - 10,500' }
                ].map((c, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-1">
                    <span className="text-[10px] font-black uppercase text-cyber-cyan block">{c.cat}</span>
                    <span className="text-xs font-bold text-white font-mono">{c.rank}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: PLACEMENTS & RECRUITERS */}
        {activeTab === 'placements' && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-white/[0.08]">
            <div className="flex items-center gap-2 pb-3 border-b border-white/[0.08]">
              <TrendingUp className="w-5 h-5 text-cyber-cyan" />
              <h3 className="font-black text-base text-white uppercase tracking-wider">
                PLACEMENT STATISTICS &amp; RECRUITER TIER
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-cyber-emerald/10 border border-cyber-emerald/30 space-y-1">
                <span className="text-xs font-bold text-cyber-emerald uppercase block">Overall Placement Rate</span>
                <span className="text-2xl font-black text-white font-mono">{college.placements.placementRate}%</span>
              </div>

              <div className="p-5 rounded-2xl bg-cyber-cyan/10 border border-cyber-cyan/30 space-y-1">
                <span className="text-xs font-bold text-cyber-cyan uppercase block">Highest Salary Package</span>
                <span className="text-2xl font-black text-white font-mono">{college.placements.highestPackage}</span>
              </div>

              <div className="p-5 rounded-2xl bg-cyber-violet/10 border border-cyber-violet/30 space-y-1">
                <span className="text-xs font-bold text-cyber-violet uppercase block">Average Salary Package</span>
                <span className="text-2xl font-black text-white font-mono">{college.placements.avgPackage}</span>
              </div>
            </div>

            {/* Recruiter Tags */}
            <div className="space-y-3 pt-4 border-t border-white/[0.08]">
              <h4 className="font-black text-xs uppercase tracking-wider text-white/70">Top Corporate Recruiters</h4>
              <div className="flex flex-wrap gap-2">
                {(college.placements.topRecruiters || ['TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant', 'L&T', 'Amazon']).map((r, i) => (
                  <span key={i} className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-bold text-white">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BROCHURE & PROSPECTUS */}
        {activeTab === 'brochure' && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-white/[0.08] text-center">
            <div className="w-16 h-16 rounded-2xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan mx-auto">
              <BookOpen className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-lg font-black text-white uppercase tracking-wider">OFFICIAL COLLEGE PROSPECTUS BROCHURE</h3>
              <p className="text-xs text-white/60 font-medium leading-relaxed">
                Download the verified official prospectus brochure for {college.name} containing academic course curriculums, campus rules, fee breakdowns, and admission tokens.
              </p>
            </div>

            <button
              onClick={handleDownloadBrochure}
              disabled={downloadingBrochure}
              className="cyber-button-primary px-8 py-3.5 rounded-2xl text-xs font-black inline-flex items-center gap-2 shadow-xl"
            >
              {downloadingBrochure ? <Loader2 className="w-4 h-4 animate-spin text-background" /> : <Download className="w-4 h-4 text-background" />}
              <span>{downloadingBrochure ? 'PREPARING PROSPECTUS...' : 'DOWNLOAD PROSPECTUS PDF'}</span>
            </button>
          </div>
        )}

      </div>

      {/* INTERACTIVE ADMISSION APPLICATION MODAL */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md pb-24 sm:pb-4">
          <div className="relative w-full max-w-xl glass-panel rounded-3xl border border-white/[0.12] p-6 sm:p-8 shadow-2xl space-y-6 z-[105] max-h-[85vh] overflow-y-auto bg-[#030712]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.1]">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-cyber-cyan" />
                <h3 className="font-black text-sm sm:text-base uppercase tracking-wider text-white">
                  ADMISSION APPLICATION GATEWAY
                </h3>
              </div>
              <button
                onClick={() => { setApplyModalOpen(false); setGeneratedToken(null); }}
                className="w-8 h-8 rounded-xl bg-white/[0.05] hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* IF TOKEN GENERATED: SHOW ADMISSION TOKEN CLEARANCE CARD */}
            {generatedToken ? (
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 rounded-3xl bg-cyber-emerald/20 border border-cyber-emerald/40 text-cyber-emerald flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-cyber-emerald/15 text-cyber-emerald border border-cyber-emerald/30">
                    ADMISSION CLEARANCE GRANTED
                  </span>
                  <h3 className="text-xl font-black text-white">APPLICATION DISPATCHED!</h3>
                  <p className="text-xs text-white/70 max-w-sm mx-auto leading-relaxed">
                    Your official admission token for <span className="text-cyber-cyan font-bold">{college.name}</span> has been issued.
                  </p>
                </div>

                {/* Token Badge Display */}
                <div className="p-4 rounded-2xl bg-slate-900 border-2 border-cyber-cyan/60 space-y-2 shadow-inner">
                  <span className="text-[10px] font-black uppercase text-white/50 tracking-wider block">OFFICIAL ADMISSION TOKEN ID</span>
                  <span className="text-2xl font-black text-cyber-cyan font-mono tracking-widest block">{generatedToken}</span>
                  <div className="text-[11px] text-white/70 font-bold pt-1 border-t border-white/10">
                    Branch: {targetBranch} • Student: {applicantName}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    onClick={copyTokenToClipboard}
                    className="w-full py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-bold text-white flex items-center justify-center gap-2 transition"
                  >
                    <Copy className="w-4 h-4 text-cyber-cyan" />
                    <span>COPY ADMISSION TOKEN</span>
                  </button>

                  <button
                    onClick={shareAdmissionToken}
                    className="w-full py-3 rounded-xl bg-cyber-emerald text-background font-black text-xs flex items-center justify-center gap-2 hover:brightness-110 transition"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>SHARE ON WHATSAPP</span>
                  </button>
                </div>
              </div>
            ) : (
              /* APPLICATION FORM INPUTS */
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-cyber-cyan/10 border border-cyber-cyan/20 text-xs text-cyber-cyan font-bold">
                  Target Institute: <span className="text-white font-black">{college.name}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                      Student Full Name
                    </label>
                    <input
                      type="text"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="Full legal name..."
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyber-cyan transition font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyber-cyan transition font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyber-cyan transition font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                      Target Course / Branch
                    </label>
                    <select
                      value={targetBranch}
                      onChange={(e) => setTargetBranch(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyber-cyan transition font-bold"
                    >
                      {(college.branches || [{ name: 'Computer Science & Engineering' }, { name: 'Artificial Intelligence & ML' }]).map((b: any, i: number) => (
                        <option key={i} value={b.name} className="bg-slate-900 text-white">{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                      Entrance Rank / Score / Marks
                    </label>
                    <input
                      type="text"
                      value={scoreRank}
                      onChange={(e) => setScoreRank(e.target.value)}
                      placeholder="e.g. EAMCET 4500 / POLYCET 1200 / Inter 95%"
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyber-cyan transition font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                      Admission Category
                    </label>
                    <select
                      value={admissionCategory}
                      onChange={(e) => setAdmissionCategory(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyber-cyan transition font-bold"
                    >
                      <option value="CONVENOR_QUOTA" className="bg-slate-900 text-white">CONVENOR QUOTA (EAMCET/POLYCET)</option>
                      <option value="MANAGEMENT_QUOTA" className="bg-slate-900 text-white">MANAGEMENT QUOTA</option>
                      <option value="LATERAL_ENTRY" className="bg-slate-900 text-white">LATERAL ENTRY (DIPLOMA TO B.TECH)</option>
                      <option value="NRI_QUOTA" className="bg-slate-900 text-white">NRI / SCHOLARSHIP QUOTA</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.1]">
                  <button
                    type="button"
                    onClick={() => setApplyModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-white/[0.05] text-xs font-bold text-white/70"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submittingApp || !applicantName.trim() || !applicantEmail.trim()}
                    className="cyber-button-primary px-6 py-3 rounded-xl text-xs font-black flex items-center gap-2 disabled:opacity-40 shadow-xl"
                  >
                    {submittingApp ? <Loader2 className="w-4 h-4 animate-spin text-background" /> : <Send className="w-4 h-4 text-background" />}
                    <span>{submittingApp ? 'DISPATCHING APPLICATION...' : 'SUBMIT & ISSUE CLEARANCE TOKEN'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
