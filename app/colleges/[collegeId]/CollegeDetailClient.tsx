'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  X
} from 'lucide-react';
import { College } from '@/lib/data';
import { useCyberToast } from '@/components/CyberToast';

interface Props {
  college: College;
}

export default function CollegeDetailClient({ college }: Props) {
  const router = useRouter();
  const toast = useCyberToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'fees' | 'placements' | 'brochure'>('overview');
  const [brochurePage, setBrochurePage] = useState(1);
  const [showBrochureModal, setShowBrochureModal] = useState(false);
  const [downloadingBrochure, setDownloadingBrochure] = useState(false);

  const handleDownloadBrochure = () => {
    setDownloadingBrochure(true);
    setTimeout(() => {
      setDownloadingBrochure(false);
      toast.info('Prospectus Ready', `Downloading verified digital prospectus: ${college.brochure.filename}`);
    }, 1200);
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
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/[0.1] relative overflow-hidden space-y-6">
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
              <span>•</span>
              <span className="flex items-center gap-1.5 text-white/80">
                <Mail className="w-4 h-4 text-cyber-magenta" />
                <span>{college.officialEmail}</span>
              </span>
            </div>
          </div>

          {/* Quick CTA & Match Gauge */}
          <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-4 border-t lg:border-t-0 border-white/[0.08] pt-4 lg:pt-0 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-cyber-cyan/10 border-2 border-cyber-cyan flex flex-col items-center justify-center shadow-lg">
                <span className="text-lg font-black text-white">{college.matchRate}%</span>
                <span className="text-[9px] font-black text-cyber-cyan tracking-wider">MATCH</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">ADMISSION RATE</span>
                <span className="text-xs font-bold text-white">{college.acceptanceRate || '25% Selective'}</span>
              </div>
            </div>

            <Link
              href={`/colleges/${college.id}/apply`}
              className="cyber-button-primary px-6 py-3.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-xl hover:scale-105 transition"
            >
              <Send className="w-4 h-4" />
              <span>PROCEED TO ADMISSION FORM</span>
            </Link>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-3 rounded-2xl text-xs font-black tracking-wider uppercase transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'overview'
              ? 'bg-gradient-to-r from-cyber-cyan to-cyber-violet text-background shadow-lg shadow-cyber-cyan/20 scale-105'
              : 'bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>OVERVIEW & FACILITIES</span>
        </button>

        <button
          onClick={() => setActiveTab('fees')}
          className={`px-5 py-3 rounded-2xl text-xs font-black tracking-wider uppercase transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'fees'
              ? 'bg-gradient-to-r from-cyber-cyan to-cyber-violet text-background shadow-lg shadow-cyber-cyan/20 scale-105'
              : 'bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>FEES & SCHOLARSHIPS</span>
        </button>

        <button
          onClick={() => setActiveTab('placements')}
          className={`px-5 py-3 rounded-2xl text-xs font-black tracking-wider uppercase transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'placements'
              ? 'bg-gradient-to-r from-cyber-cyan to-cyber-violet text-background shadow-lg shadow-cyber-cyan/20 scale-105'
              : 'bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>CAMPUS PLACEMENTS</span>
        </button>

        <button
          onClick={() => setActiveTab('brochure')}
          className={`px-5 py-3 rounded-2xl text-xs font-black tracking-wider uppercase transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'brochure'
              ? 'bg-gradient-to-r from-cyber-cyan to-cyber-violet text-background shadow-lg shadow-cyber-cyan/20 scale-105'
              : 'bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>OFFICIAL BROCHURE</span>
        </button>
      </div>

      {/* TAB CONTENT PANELS */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Directive & Description */}
              <div className="glass-panel rounded-3xl p-6 space-y-4 border border-white/[0.08]">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyber-cyan" />
                  <span>COLLEGE OVERVIEW & ACADEMIC MISSION</span>
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                  {college.description}
                </p>

                <div className="p-4 rounded-2xl bg-white/[0.03] border-l-4 border-cyber-cyan space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                    MISSION STATEMENT
                  </span>
                  <p className="text-xs sm:text-sm text-white italic">
                    &quot;{college.mission}&quot;
                  </p>
                </div>
              </div>

              {/* Specializations & Seat Matrix */}
              <div className="glass-panel rounded-3xl p-6 space-y-4 border border-white/[0.08]">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-cyber-magenta" />
                  <span>AVAILABLE BRANCHES & SEAT MATRIX</span>
                </h3>
                <div className="space-y-3">
                  {college.branches.map((b, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-white">{b.name}</h4>
                        <span className="text-[10px] font-black text-cyber-cyan uppercase tracking-wider">
                          CODE: {b.code} • {b.durationYears} YEARS DURATION
                        </span>
                      </div>
                      <div className="px-3 py-1.5 rounded-xl bg-cyber-magenta/10 border border-cyber-magenta/30 text-cyber-magenta text-xs font-black shrink-0">
                        {b.seats} SEATS
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Facilities */}
            <div className="space-y-6">
              <div className="glass-panel rounded-3xl p-6 space-y-4 border border-white/[0.08]">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-cyber-amber" />
                  <span>CAMPUS INFRASTRUCTURE</span>
                </h3>
                <div className="space-y-2.5">
                  {college.facilities.map((fac, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-white/90 font-medium p-2 rounded-xl bg-white/[0.02]">
                      <CheckCircle2 className="w-4 h-4 text-cyber-emerald shrink-0" />
                      <span>{fac}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel rounded-3xl p-6 space-y-4 border border-white/[0.08]">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-cyber-cyan" />
                  <span>GATEWAY REQUIREMENTS</span>
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  {college.requirements}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. FEES & SCHOLARSHIPS TAB */}
      {activeTab === 'fees' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel rounded-3xl p-6 border border-white/[0.08] space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ANNUAL TUITION FEE</span>
              <h4 className="text-2xl font-black text-cyber-cyan">{college.feeStructure.tuitionFeePerYear}</h4>
              <p className="text-xs text-white/50">Covers laboratory credits, digital study materials, and academic instruction.</p>
            </div>

            <div className="glass-panel rounded-3xl p-6 border border-white/[0.08] space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HOSTEL & RESIDENCE</span>
              <h4 className="text-2xl font-black text-cyber-violet">{college.feeStructure.hostelFeePerYear}</h4>
              <p className="text-xs text-white/50">Includes 24/7 security, high-speed Wi-Fi, and 3-course dining hall meal plan.</p>
            </div>

            <div className="glass-panel rounded-3xl p-6 border border-white/[0.08] space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ADMISSION PROCESSING</span>
              <h4 className="text-2xl font-black text-white">{college.feeStructure.admissionFee}</h4>
              <p className="text-xs text-white/50">One-time registration and Nexora digital vault token authorization fee.</p>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-white/[0.08] space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-cyber-amber" />
              <span>NEXORA SCHOLARSHIP SCHEMES & GOVERNMENT SUBSIDIES</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {college.feeStructure.scholarships.map((sch, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-cyber-pink/5 border border-cyber-pink/20 space-y-1">
                  <span className="text-[10px] font-black text-cyber-pink uppercase tracking-wider block">SCHOLARSHIP #{idx + 1}</span>
                  <p className="text-xs font-bold text-white leading-relaxed">{sch}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. PLACEMENTS TAB */}
      {activeTab === 'placements' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass-panel rounded-3xl p-6 border border-white/[0.08] text-center space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PLACEMENT SUCCESS RATE</span>
              <h4 className="text-4xl font-black text-cyber-emerald">{college.placements.placementRate}%</h4>
              <span className="text-[10px] font-bold text-cyber-emerald uppercase">VERIFIED CAMPUS AUDIT</span>
            </div>

            <div className="glass-panel rounded-3xl p-6 border border-white/[0.08] text-center space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AVERAGE PACKAGE</span>
              <h4 className="text-3xl font-black text-cyber-cyan">{college.placements.avgPackage}</h4>
              <span className="text-[10px] font-bold text-white/50 uppercase">PER ANNUM</span>
            </div>

            <div className="glass-panel rounded-3xl p-6 border border-white/[0.08] text-center space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HIGHEST RECRUITMENT PACKAGE</span>
              <h4 className="text-3xl font-black text-cyber-amber">{college.placements.highestPackage}</h4>
              <span className="text-[10px] font-bold text-cyber-amber uppercase">GLOBAL NODE CONTRACT</span>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-white/[0.08] space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-cyber-cyan" />
              <span>MARQUEE RECRUITING PARTNERS & INDUSTRY NODES</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {college.placements.topRecruiters.map((rec, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-center space-y-1">
                  <span className="text-xs font-black text-white block">{rec}</span>
                  <span className="text-[9px] font-bold text-cyber-cyan uppercase">RECRUITMENT PARTNER</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. OFFICIAL BROCHURE TAB */}
      {activeTab === 'brochure' && (
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan">
                  {college.brochure.academicYear}
                </span>
                <span className="text-xs text-white/50 font-medium">{college.brochure.filename}</span>
              </div>
              <h3 className="text-xl font-black text-white">{college.brochure.title}</h3>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowBrochureModal(true)}
                className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-bold text-cyber-cyan flex items-center gap-2 transition"
              >
                <Eye className="w-4 h-4" />
                <span>FULLSCREEN VIEWER</span>
              </button>

              <button
                onClick={handleDownloadBrochure}
                disabled={downloadingBrochure}
                className="cyber-button-primary px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>{downloadingBrochure ? 'PREPARING PDF...' : 'DOWNLOAD BROCHURE'}</span>
              </button>
            </div>
          </div>

          {/* SIMULATED PDF BROCHURE VIEWER CONTAINER */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyber-cyan/30 space-y-6 relative overflow-hidden bg-surface-card/80">
            <div className="flex items-center justify-between border-b border-white/[0.1] pb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyber-cyan" />
                <span className="text-xs font-black text-white tracking-widest uppercase">
                  PAGE {brochurePage} OF {college.brochure.pages.length}
                </span>
              </div>

              {/* Page Nav Buttons */}
              <div className="flex items-center gap-2">
                <button
                  disabled={brochurePage === 1}
                  onClick={() => setBrochurePage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded-lg bg-white/[0.05] disabled:opacity-30 text-xs font-bold text-white hover:bg-white/[0.1]"
                >
                  PREV
                </button>
                <button
                  disabled={brochurePage === college.brochure.pages.length}
                  onClick={() => setBrochurePage((p) => Math.min(college.brochure.pages.length, p + 1))}
                  className="px-3 py-1 rounded-lg bg-white/[0.05] disabled:opacity-30 text-xs font-bold text-white hover:bg-white/[0.1]"
                >
                  NEXT
                </button>
              </div>
            </div>

            {/* Document Page Display Sheet */}
            <div className="min-h-[300px] p-6 sm:p-8 rounded-2xl bg-background border border-white/[0.08] space-y-4 shadow-inner">
              <div className="border-b border-white/[0.08] pb-3 flex items-center justify-between">
                <span className="text-[10px] font-black text-cyber-magenta tracking-widest uppercase">
                  OFFICIAL PROSPECTUS SECTION #{brochurePage}
                </span>
                <span className="text-xs font-mono text-white/40">{college.shortName}</span>
              </div>

              <h4 className="text-lg font-black text-white">
                {college.brochure.pages[brochurePage - 1]?.title || 'Campus Overview'}
              </h4>

              <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                {college.brochure.pages[brochurePage - 1]?.content}
              </p>

              {brochurePage === 1 && (
                <div className="pt-4 space-y-2">
                  <span className="text-[10px] font-black uppercase text-cyber-cyan block tracking-wider">KEY HIGHLIGHTS</span>
                  <div className="space-y-1.5">
                    {college.brochure.highlights.map((hl, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-medium text-white/90">
                        <Check className="w-3.5 h-3.5 text-cyber-emerald" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM STICKY FLOATING ADMISSION CTA BAR */}
      <div className="fixed bottom-20 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-2xl glass-panel rounded-2xl p-3 sm:p-4 border border-cyber-cyan/40 shadow-2xl flex items-center justify-between gap-4 bg-background/90 backdrop-blur-xl">
          <div className="hidden sm:block">
            <span className="text-[10px] font-black text-cyber-cyan uppercase tracking-widest block">READY TO JOIN?</span>
            <h4 className="text-xs font-black text-white truncate">{college.name}</h4>
          </div>

          <Link
            href={`/colleges/${college.id}/apply`}
            className="w-full sm:w-auto cyber-button-primary px-8 py-3.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition"
          >
            <Send className="w-4 h-4" />
            <span>PROCEED TO ONLINE ADMISSION FORM</span>
          </Link>
        </div>
      </div>

      {/* FULLSCREEN BROCHURE MODAL */}
      {showBrochureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-4xl glass-panel rounded-3xl border border-white/[0.12] p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-[10px] font-black text-cyber-cyan uppercase tracking-widest">OFFICIAL COLLEGE DOCUMENT</span>
                <h3 className="text-xl font-black text-white">{college.brochure.title}</h3>
              </div>
              <button
                onClick={() => setShowBrochureModal(false)}
                className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6">
              {college.brochure.pages.map((p) => (
                <div key={p.pageNumber} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <span className="text-[10px] font-black text-cyber-magenta uppercase tracking-wider">SECTION {p.pageNumber}: {p.title}</span>
                  <p className="text-xs text-white/80 leading-relaxed">{p.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
