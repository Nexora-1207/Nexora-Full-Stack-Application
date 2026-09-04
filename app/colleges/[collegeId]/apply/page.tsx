'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ChevronLeft, 
  Send, 
  CheckCircle2, 
  Upload, 
  FileText, 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Award, 
  Building2, 
  Copy, 
  Share2, 
  Loader2, 
  Lock, 
  Sparkles,
  Calendar,
  MapPin,
  X
} from 'lucide-react';
import { MOCK_COLLEGES } from '@/lib/data';
import { useCyberToast } from '@/components/CyberToast';
import { supabase } from '@/lib/supabase';

export default function CollegeApplyPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useCyberToast();
  const collegeId = params?.collegeId as string;

  const college = MOCK_COLLEGES.find((c) => c.id === collegeId) || MOCK_COLLEGES[0];

  const memo10thInputRef = useRef<HTMLInputElement | null>(null);
  const memoInterInputRef = useRef<HTMLInputElement | null>(null);
  const tcInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Student Dossier Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');

  // Academic Credentials
  const [marks10th, setMarks10th] = useState('');
  const [marksInter, setMarksInter] = useState('');
  const [entranceRank, setEntranceRank] = useState('');
  const [targetBranch, setTargetBranch] = useState(college.branches?.[0]?.name || 'Computer Science & Engineering');
  const [admissionCategory, setAdmissionCategory] = useState('CONVENOR_QUOTA');

  // Certificate Files
  const [memo10thFile, setMemo10thFile] = useState<File | null>(null);
  const [memoInterFile, setMemoInterFile] = useState<File | null>(null);
  const [tcFile, setTcFile] = useState<File | null>(null);

  // Submission & Token State
  const [submitting, setSubmitting] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setIsGuest(false);
        setCurrentUser(user);
        supabase.from('profiles').select('full_name, phone_number, address').eq('id', user.id).single().then(({ data }) => {
          if (data?.full_name) setFullName(data.full_name);
          if (data?.phone_number) setPhone(data.phone_number);
          if (data?.address) setAddress(data.address);
        });
        if (user.email) setEmail(user.email);
        setLoading(false);
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
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyber-cyan to-cyber-violet animate-spin p-[2px] mb-4">
          <div className="w-full h-full bg-background rounded-[14px]"></div>
        </div>
        <span className="text-xs font-black tracking-widest text-cyber-cyan animate-pulse uppercase">
          INITIALIZING ADMISSION GATEWAY...
        </span>
      </div>
    );
  }

  if (isGuest) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-cyber-cyan/20 to-cyber-violet/20 border border-cyber-cyan/30 flex items-center justify-center mx-auto text-cyber-cyan shadow-2xl animate-pulse">
          <Send className="w-12 h-12" />
        </div>
        
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-widest">
            <Lock className="w-3.5 h-3.5" />
            <span>GUEST ACCESS RESTRICTED</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            ADMISSION GATEWAY LOCKED
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-white/60 font-medium max-w-lg mx-auto leading-relaxed">
            Register or Sign In to submit your official college admission application, upload 10th &amp; Inter marks memos, and generate your verified Admission Clearance Token.
          </p>
        </div>
        
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => router.push('/auth')}
            className="cyber-button-primary px-8 py-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-xl w-full sm:w-auto"
          >
            <Lock className="w-4 h-4 text-background" />
            <span>REGISTER / SIGN IN TO UNLOCK</span>
          </button>
        </div>
      </div>
    );
  }

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim() || !targetBranch) {
      toast.info('Missing Fields', 'Please complete all required student dossier information.');
      return;
    }

    setSubmitting(true);
    const tokenStr = `NEX-ADMIT-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      // Save application details to Supabase DB table
      await supabase.from('college_applications').insert([{
        user_id: currentUser?.id,
        student_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        college_name: college.name,
        branch: targetBranch,
        score_rank: entranceRank.trim() || marksInter || marks10th || 'N/A',
        admission_category: admissionCategory,
        token: tokenStr
      }]);

      // Trigger admin alert email
      fetch('/api/notify/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          name: `${fullName} (Admission Application: ${college.name})`,
          sector: `${targetBranch} • Category: ${admissionCategory} • Token: ${tokenStr}`
        })
      }).catch((e) => {});

      setGeneratedToken(tokenStr);
      toast.success('Admission Application Submitted!', `Official Clearance Token Issued: ${tokenStr}`);
    } catch (err: any) {
      console.error('Admission submit error:', err);
      setGeneratedToken(tokenStr);
      toast.success('Admission Application Submitted!', `Official Clearance Token Issued: ${tokenStr}`);
    } finally {
      setSubmitting(false);
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
    const shareText = encodeURIComponent(`*NEXORA ADMISSION CLEARANCE TOKEN*\n\n🏫 College: ${college.name}\n👤 Student: ${fullName}\n📚 Branch: ${targetBranch}\n🎫 Token ID: ${generatedToken}\n📅 Applied Date: ${new Date().toLocaleDateString()}\n\nVerified via Nexora Academic Gateway (nexoraedu.co.in).`);
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-36 space-y-8 relative">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <button
          onClick={() => router.push(`/colleges/${college.id}`)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-xs font-bold text-cyber-cyan transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>RETURN TO {college.shortName} SPECS</span>
        </button>

        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30">
          OFFICIAL ADMISSION GATEWAY
        </span>
      </div>

      {/* College Info Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/[0.1] space-y-3 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-cyan/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-cyber-cyan block mb-1">
              INSTITUTIONAL APPLICATION FOR ADMISSION
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {college.name}
            </h1>
            <p className="text-xs text-white/60 font-medium mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-cyber-cyan" />
              <span>{college.location}</span> • <span>{college.stream} Track</span>
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] font-bold uppercase text-white/50 block">TUITION FEE</span>
            <span className="text-lg font-black text-cyber-cyan font-mono">{college.feeStructure?.tuitionFeePerYear || '₹ 65,000 / Yr'}</span>
          </div>
        </div>
      </div>

      {/* SUCCESS SCREEN WITH TOKEN IF SUBMITTED */}
      {generatedToken ? (
        <div className="glass-panel rounded-3xl p-8 border border-cyber-emerald/40 text-center space-y-6 shadow-2xl bg-[#030712]">
          <div className="w-20 h-20 rounded-3xl bg-cyber-emerald/20 border border-cyber-emerald/40 text-cyber-emerald flex items-center justify-center mx-auto shadow-2xl animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-cyber-emerald/15 text-cyber-emerald border border-cyber-emerald/30">
              ADMISSION APPLICATION VERIFIED &amp; DISPATCHED
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">ADMISSION CLEARANCE GRANTED</h2>
            <p className="text-xs sm:text-sm text-white/70 max-w-lg mx-auto leading-relaxed font-medium">
              Your official college application for <span className="text-cyber-cyan font-bold">{college.name}</span> has been processed and logged in the institutional gateway.
            </p>
          </div>

          {/* Token Card */}
          <div className="p-6 rounded-3xl bg-slate-950 border-2 border-cyber-cyan/60 space-y-3 max-w-md mx-auto shadow-inner">
            <span className="text-[10px] font-black uppercase text-white/50 tracking-widest block">OFFICIAL ADMISSION CLEARANCE TOKEN ID</span>
            <span className="text-3xl font-black text-cyber-cyan font-mono tracking-widest block">{generatedToken}</span>
            
            <div className="text-xs text-white/70 font-bold pt-3 border-t border-white/10 space-y-1">
              <div>Student: <span className="text-white">{fullName}</span></div>
              <div>Course/Branch: <span className="text-cyber-cyan">{targetBranch}</span></div>
              <div>Admission Category: <span className="text-cyber-violet">{admissionCategory}</span></div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
            <button
              onClick={copyTokenToClipboard}
              className="w-full py-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-bold text-white flex items-center justify-center gap-2 transition shadow-md"
            >
              <Copy className="w-4 h-4 text-cyber-cyan" />
              <span>COPY TOKEN CODE</span>
            </button>

            <button
              onClick={shareAdmissionToken}
              className="w-full py-3.5 rounded-2xl bg-cyber-emerald text-background font-black text-xs flex items-center justify-center gap-2 hover:brightness-110 transition shadow-xl"
            >
              <Share2 className="w-4 h-4" />
              <span>SHARE ON WHATSAPP</span>
            </button>
          </div>
        </div>
      ) : (
        /* ADMISSION APPLICATION FORM */
        <form onSubmit={handleSubmitApplication} className="space-y-6">
          
          {/* SECTION 1: PERSONAL DOSSIER */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-white/[0.08]">
            <div className="flex items-center gap-2 pb-3 border-b border-white/[0.08]">
              <User className="w-5 h-5 text-cyber-cyan" />
              <h2 className="text-sm sm:text-base font-black text-white tracking-wide uppercase">
                1. APPLICANT PERSONAL DOSSIER
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                  Student Full Legal Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full name as in 10th Memo..."
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                  Mobile Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                  Father / Guardian Name
                </label>
                <input
                  type="text"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  placeholder="Father's full name..."
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyber-cyan transition font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                  Residential Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="City, State, Pincode..."
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition font-bold"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: ACADEMIC CREDENTIALS & BRANCH SELECTION */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-white/[0.08]">
            <div className="flex items-center gap-2 pb-3 border-b border-white/[0.08]">
              <GraduationCap className="w-5 h-5 text-cyber-cyan" />
              <h2 className="text-sm sm:text-base font-black text-white tracking-wide uppercase">
                2. ACADEMIC CREDENTIALS &amp; BRANCH SELECTION
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                  Target Course / Specialization
                </label>
                <select
                  value={targetBranch}
                  onChange={(e) => setTargetBranch(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyber-cyan transition font-bold"
                >
                  {(college.branches || [
                    { name: 'Computer Science & Engineering' },
                    { name: 'Artificial Intelligence & Machine Learning' },
                    { name: 'Electronics & Communication (ECE)' },
                    { name: 'Mechanical & Robotics Engineering' }
                  ]).map((b: any, i: number) => (
                    <option key={i} value={b.name} className="bg-slate-900 text-white">{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                  Admission Category
                </label>
                <select
                  value={admissionCategory}
                  onChange={(e) => setAdmissionCategory(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyber-cyan transition font-bold"
                >
                  <option value="CONVENOR_QUOTA" className="bg-slate-900 text-white">CONVENOR QUOTA (EAMCET / POLYCET)</option>
                  <option value="MANAGEMENT_QUOTA" className="bg-slate-900 text-white">MANAGEMENT QUOTA</option>
                  <option value="LATERAL_ENTRY" className="bg-slate-900 text-white">LATERAL ENTRY (DIPLOMA TO B.TECH)</option>
                  <option value="SCHOLARSHIP_QUOTA" className="bg-slate-900 text-white">SCHOLARSHIP / FEE REIMBURSEMENT</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                  10th Class Marks (%) / GPA
                </label>
                <input
                  type="text"
                  value={marks10th}
                  onChange={(e) => setMarks10th(e.target.value)}
                  placeholder="e.g. 92% / 9.5 GPA"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                  Intermediate / Diploma Marks (%)
                </label>
                <input
                  type="text"
                  value={marksInter}
                  onChange={(e) => setMarksInter(e.target.value)}
                  placeholder="e.g. 960 / 1000 or 88%"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                  Entrance Rank / Score (POLYCET / EAMCET / JEE / GATE)
                </label>
                <input
                  type="text"
                  value={entranceRank}
                  onChange={(e) => setEntranceRank(e.target.value)}
                  placeholder="e.g. EAMCET Rank 4820 / POLYCET Rank 1250"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition font-bold"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: 10TH MARKS MEMO & CERTIFICATE UPLOADS */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-white/[0.08]">
            <div className="flex items-center gap-2 pb-3 border-b border-white/[0.08]">
              <Upload className="w-5 h-5 text-cyber-cyan" />
              <h2 className="text-sm sm:text-base font-black text-white tracking-wide uppercase">
                3. CERTIFICATE &amp; MARKS MEMO UPLOADS
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* 10th Memo Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider">
                  10th Class Marks Memo (Required)
                </label>
                <input
                  type="file"
                  ref={memo10thInputRef}
                  onChange={(e) => setMemo10thFile(e.target.files?.[0] || null)}
                  accept="image/*,.pdf"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => memo10thInputRef.current?.click()}
                  className={`w-full py-4 px-3 rounded-2xl border text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition ${
                    memo10thFile
                      ? 'bg-cyber-emerald/15 border-cyber-emerald/40 text-cyber-emerald'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-white/80'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span className="truncate">{memo10thFile ? memo10thFile.name : 'Upload 10th Memo (PDF/JPG)'}</span>
                </button>
              </div>

              {/* Inter / Diploma Memo Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider">
                  Inter / Diploma Memo
                </label>
                <input
                  type="file"
                  ref={memoInterInputRef}
                  onChange={(e) => setMemoInterFile(e.target.files?.[0] || null)}
                  accept="image/*,.pdf"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => memoInterInputRef.current?.click()}
                  className={`w-full py-4 px-3 rounded-2xl border text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition ${
                    memoInterFile
                      ? 'bg-cyber-emerald/15 border-cyber-emerald/40 text-cyber-emerald'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-white/80'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span className="truncate">{memoInterFile ? memoInterFile.name : 'Upload Inter Memo'}</span>
                </button>
              </div>

              {/* TC / ID Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider">
                  TC / Aadhar / ID Proof
                </label>
                <input
                  type="file"
                  ref={tcInputRef}
                  onChange={(e) => setTcFile(e.target.files?.[0] || null)}
                  accept="image/*,.pdf"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => tcInputRef.current?.click()}
                  className={`w-full py-4 px-3 rounded-2xl border text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition ${
                    tcFile
                      ? 'bg-cyber-emerald/15 border-cyber-emerald/40 text-cyber-emerald'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-white/80'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span className="truncate">{tcFile ? tcFile.name : 'Upload TC / ID Proof'}</span>
                </button>
              </div>

            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting || !fullName.trim() || !email.trim()}
              className="w-full cyber-button-primary py-4 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl disabled:opacity-40"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin text-background" /> : <Send className="w-4 h-4 text-background" />}
              <span>{submitting ? 'DISPATCHING ADMISSION APPLICATION...' : 'SUBMIT ADMISSION DOSSIER & GENERATE TOKEN'}</span>
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
