'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronLeft, 
  Send, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  FolderLock, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  GraduationCap, 
  Award, 
  Building2, 
  Sparkles, 
  AlertCircle,
  Copy,
  Check,
  X
} from 'lucide-react';
import { MOCK_COLLEGES, College, OFFICIAL_NEXORA_EMAIL, INITIAL_VAULT_FILES } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { useCyberToast } from '@/components/CyberToast';
import confetti from 'canvas-confetti';

interface PageProps {
  params: {
    collegeId: string;
  };
}

export default function AdmissionFormPage({ params }: PageProps) {
  const router = useRouter();
  const toast = useCyberToast();
  const collegeId = params.collegeId;
  const college = MOCK_COLLEGES.find((c) => c.id === collegeId) || MOCK_COLLEGES[0];

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submissionReceipt, setSubmissionReceipt] = useState<any>(null);
  const [copiedToken, setCopiedToken] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '2007-05-14',
    gender: 'Male',
    studentPhone: '',
    studentEmail: '',
    address: 'Hyderabad, Telangana, India',
    parentName: '',
    parentPhone: '',
    parentOccupation: 'Business / Private Sector',
    stream: college.stream,
    tenthPercentage: '92.5%',
    entranceRank: 'POLYCET Rank #1420',
    selectedBranch: college.branches[0]?.name || 'Computer Engineering',
    category: 'General',
    hostelNeeded: 'Yes',
    scholarshipClaim: 'Yes',
    attachedVaultDocs: ['Class_10_Marks_Memo.pdf', 'Transfer_Certificate.pdf'],
    signature: '',
    declarationAgreed: true,
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setProfile(data);
              setFormData((prev) => ({
                ...prev,
                fullName: data.full_name || prev.fullName,
                studentEmail: user.email || prev.studentEmail,
                studentPhone: data.phone || '+91 98765 43210',
                parentName: data.parent_name || 'Ramesh Kumar',
                parentPhone: data.parent_phone || '+91 98765 00000',
                signature: data.full_name || prev.fullName
              }));
            }
            setLoading(false);
          }, () => setLoading(false));
      } else {
        // Fallback for guest mode / local storage
        const storedName = localStorage.getItem('user_name') || 'Student Applicant';
        setFormData((prev) => ({
          ...prev,
          fullName: storedName,
          studentEmail: 'student@nexora.edu',
          studentPhone: '+91 98765 43210',
          parentName: 'Ramesh Kumar',
          parentPhone: '+91 98765 00000',
          signature: storedName
        }));
        setLoading(false);
      }
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.studentPhone) {
      toast.warning('Incomplete Candidate Dossier', 'Please provide applicant full name and active student mobile number.');
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      const generatedToken = `NEX-ADM-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      const timestamp = new Date().toLocaleString();

      const receipt = {
        tokenId: generatedToken,
        timestamp,
        collegeName: college.name,
        collegeEmail: college.officialEmail,
        companyEmail: OFFICIAL_NEXORA_EMAIL,
        applicantName: formData.fullName,
        studentPhone: formData.studentPhone,
        parentPhone: formData.parentPhone,
        selectedBranch: formData.selectedBranch,
        status: 'SUBMITTED & DISPATCHED TO COLLEGE DESK',
      };

      setSubmissionReceipt(receipt);

      // Save token file to Document Vault
      try {
        const stored = localStorage.getItem('vault_files');
        let files = stored ? JSON.parse(stored) : INITIAL_VAULT_FILES;

        const vaultDoc = {
          id: Math.random().toString(),
          name: `Admission_Form_${college.shortName}_${generatedToken}.txt`,
          category: 'ADMISSIONS',
          size: '18 KB',
          date: new Date().toISOString().split('T')[0],
          content: `OFFICIAL ADMISSION APPLICATION FORM DOSSIER
INSTITUTION: ${college.name}
ADMISSION TOKEN: ${generatedToken}
COLLEGE CONTACT DESK: ${college.officialEmail}
NEXORA DISPATCH INBOX: ${OFFICIAL_NEXORA_EMAIL}
--------------------------------------------------
APPLICANT: ${formData.fullName}
STUDENT MOBILE: ${formData.studentPhone}
PARENT MOBILE: ${formData.parentPhone}
STREAM & BRANCH: ${formData.selectedBranch} (${formData.stream})
ACADEMIC SCORE: ${formData.tenthPercentage} | ${formData.entranceRank}
TIMESTAMP: ${timestamp}
STATUS: DISPATCHED FOR INSTITUTIONAL COUNSELING REVIEW`
        };

        files.unshift(vaultDoc);
        localStorage.setItem('vault_files', JSON.stringify(files));
        toast.success('Admission Form Dispatched!', `Token ${generatedToken} issued and synced to your Document Vault.`);
      } catch (err) {
        console.error('Vault sync error:', err);
      }

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 }
      });
    }, 1800);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(true);
    toast.success('Token Copied!', 'Admission token copied to clipboard.');
    setTimeout(() => setCopiedToken(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyber-cyan to-cyber-violet animate-spin p-[2px] mb-4">
          <div className="w-full h-full bg-background rounded-[14px]"></div>
        </div>
        <span className="text-xs font-black tracking-widest text-cyber-cyan animate-pulse uppercase">
          GENERATING ADMISSION APPLICATION FORM...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-36 space-y-8">
      
      {/* Back Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <button
          onClick={() => router.push(`/colleges/${college.id}`)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-xs font-bold text-cyber-cyan transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>BACK TO COLLEGE OVERVIEW</span>
        </button>

        <span className="text-xs font-black text-cyber-emerald flex items-center gap-1.5 uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4" />
          OFFICIAL ONLINE ADMISSION GATEWAY
        </span>
      </div>

      {/* FORM CONTAINER WITH AUTHENTIC COLLEGE ADMISSION FORM HEADER */}
      <div className="glass-panel rounded-3xl border border-white/[0.12] overflow-hidden shadow-2xl bg-surface-card/90">
        
        {/* College Official Admission Form Banner Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-background via-surface-card to-background border-b border-white/[0.1] text-center space-y-3 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-[10px] font-black uppercase tracking-widest">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>OFFICIAL ACADEMIC ADMISSION FORM • 2026-2027</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
            {college.name}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-white/60">
            <span>LOCATION: {college.location}</span>
            <span>•</span>
            <span>DESK EMAIL: {college.officialEmail}</span>
            <span>•</span>
            <span className="text-cyber-magenta font-mono font-bold">NEXORA GATEWAY DISPATCH</span>
          </div>
        </div>

        {/* APPLICATION FORM BODY */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">

          {/* SECTION 1: PERSONAL INFORMATION */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
              <User className="w-4 h-4 text-cyber-cyan" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                SECTION A: CANDIDATE PERSONAL DOSSIER
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-white/70">Candidate Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-background border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-cyber-cyan transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-white/70">Date of Birth *</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  className="w-full bg-background border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-cyber-cyan transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-white/70">Student Mobile Phone Number *</label>
                <input
                  type="text"
                  name="studentPhone"
                  value={formData.studentPhone}
                  onChange={handleChange}
                  required
                  placeholder="+91 98765 43210"
                  className="w-full bg-background border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-cyber-cyan transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-white/70">Student Email Address *</label>
                <input
                  type="email"
                  name="studentEmail"
                  value={formData.studentEmail}
                  onChange={handleChange}
                  required
                  placeholder="student@example.com"
                  className="w-full bg-background border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-cyber-cyan transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-white/70">Permanent Residential Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className="w-full bg-background border border-white/[0.1] rounded-xl p-3 text-xs font-bold text-white focus:outline-none focus:border-cyber-cyan transition"
              />
            </div>
          </div>

          {/* SECTION 2: PARENT & GUARDIAN CONTACT */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
              <Phone className="w-4 h-4 text-cyber-violet" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                SECTION B: PARENT / GUARDIAN CONTACT DETAILS
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-white/70">Parent / Guardian Name *</label>
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleChange}
                  required
                  placeholder="Parent Full Name"
                  className="w-full bg-background border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-cyber-cyan transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-white/70">Parent Mobile Contact Number *</label>
                <input
                  type="text"
                  name="parentPhone"
                  value={formData.parentPhone}
                  onChange={handleChange}
                  required
                  placeholder="+91 98765 00000"
                  className="w-full bg-background border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-cyber-cyan transition"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: ACADEMIC CREDENTIALS & BRANCH CHOICE */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
              <GraduationCap className="w-4 h-4 text-cyber-amber" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                SECTION C: ACADEMIC SCORES & DESIRED SPECIALIZATION
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-white/70">Preferred Branch / Specialization *</label>
                <select
                  name="selectedBranch"
                  value={formData.selectedBranch}
                  onChange={handleChange}
                  className="w-full bg-background border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-cyber-cyan transition"
                >
                  {college.branches.map((b, idx) => (
                    <option key={idx} value={b.name}>
                      {b.name} ({b.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-white/70">Class 10th / 12th Percentage / GPA *</label>
                <input
                  type="text"
                  name="tenthPercentage"
                  value={formData.tenthPercentage}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 92% or 9.5 GPA"
                  className="w-full bg-background border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-cyber-cyan transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-white/70">Entrance Hall Ticket / POLYCET Rank</label>
                <input
                  type="text"
                  name="entranceRank"
                  value={formData.entranceRank}
                  onChange={handleChange}
                  placeholder="Rank / Score"
                  className="w-full bg-background border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-cyber-cyan transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-white/70">Hostel Accommodation Needed?</label>
                <select
                  name="hostelNeeded"
                  value={formData.hostelNeeded}
                  onChange={handleChange}
                  className="w-full bg-background border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-cyber-cyan transition"
                >
                  <option value="Yes">Yes - Require On-Campus Hostel Room</option>
                  <option value="No">No - Day Scholar / Self Transport</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 4: NEXORA VAULT CERTIFICATE ATTACHMENTS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
              <div className="flex items-center gap-2">
                <FolderLock className="w-4 h-4 text-cyber-emerald" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  SECTION D: NEXORA VAULT ENCRYPTED CERTIFICATES
                </h3>
              </div>
              <span className="text-[10px] font-black text-cyber-emerald uppercase tracking-wider">
                AUTO-SYNCED FROM VAULT
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
              <p className="text-xs text-white/70">
                The following verified academic certificates from your Nexora Document Vault will be attached to your institutional dispatch:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {formData.attachedVaultDocs.map((docName, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-background border border-white/[0.08] flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-cyber-cyan" />
                      {docName}
                    </span>
                    <span className="text-[9px] font-black text-cyber-emerald px-2 py-0.5 rounded bg-cyber-emerald/10 border border-cyber-emerald/30 uppercase">
                      VERIFIED
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 5: DECLARATION & SIGNATURE */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-cyber-cyan/5 border border-cyber-cyan/20 space-y-3">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="declaration"
                  checked={formData.declarationAgreed}
                  onChange={(e) => setFormData((prev) => ({ ...prev, declarationAgreed: e.target.checked }))}
                  className="mt-0.5 accent-cyber-cyan"
                />
                <label htmlFor="declaration" className="text-xs font-medium text-white/80 leading-relaxed cursor-pointer">
                  I hereby declare that all information supplied in this online admission application form is accurate. I authorize <strong className="text-white">{college.name}</strong> admissions desk to contact me and my guardian directly via phone/email.
                </label>
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-[11px] font-bold text-white/70">Candidate Digital E-Signature *</label>
                <input
                  type="text"
                  name="signature"
                  value={formData.signature}
                  onChange={handleChange}
                  required
                  placeholder="Type your full name to sign"
                  className="w-full bg-background border border-white/[0.1] rounded-xl px-4 py-2 text-xs font-mono font-bold text-cyber-cyan focus:outline-none focus:border-cyber-cyan transition"
                />
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4 border-t border-white/[0.08]">
            <button
              type="submit"
              disabled={submitting || !formData.declarationAgreed}
              className="w-full cyber-button-primary py-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-2xl transition hover:scale-[1.01]"
            >
              {submitting ? (
                <span className="animate-pulse tracking-widest">TRANSMITTING ADMISSION DOSSIER TO COLLEGE...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>SUBMIT & DISPATCH ADMISSION APPLICATION FORM</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>

      {/* SUCCESS RECEIPT & INSTITUTIONAL EMAIL DISPATCH MODAL */}
      {submissionReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-cyber-cyan/40 p-6 sm:p-8 shadow-2xl text-center space-y-6 bg-background/95">
            
            <div className="w-16 h-16 rounded-full bg-cyber-emerald/20 border border-cyber-emerald/40 text-cyber-emerald flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black text-cyber-emerald uppercase tracking-widest">
                DISPATCH SUCCESSFUL
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                ADMISSION APPLICATION SUBMITTED
              </h3>
              <p className="text-xs text-white/70">
                Your completed admission application form has been generated and dispatched to the college admissions committee.
              </p>
            </div>

            {/* Application Token Box */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-cyber-cyan/30 space-y-2">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                UNIQUE ADMISSIONS TOKEN ID
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-mono font-black text-cyber-cyan tracking-widest">
                  {submissionReceipt.tokenId}
                </span>
                <button
                  onClick={() => copyToClipboard(submissionReceipt.tokenId)}
                  className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white/70 transition"
                  title="Copy Token"
                >
                  {copiedToken ? <Check className="w-4 h-4 text-cyber-emerald" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Email Dispatch Info Box */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] text-left space-y-2 text-xs">
              <div className="flex items-center gap-2 text-cyber-magenta font-black uppercase text-[10px] tracking-wider">
                <Mail className="w-3.5 h-3.5" />
                <span>INSTITUTIONAL EMAIL DISPATCH SUMMARY</span>
              </div>
              <div className="space-y-1 text-white/80 font-medium">
                <p>• <strong>To College Desk:</strong> {submissionReceipt.collegeEmail}</p>
                <p>• <strong>Company Copy:</strong> {submissionReceipt.companyEmail}</p>
                <p>• <strong>Applicant Contact:</strong> {submissionReceipt.applicantName} ({submissionReceipt.studentPhone})</p>
                <p>• <strong>Guardian Phone:</strong> {submissionReceipt.parentPhone}</p>
                <p>• <strong>Branch Target:</strong> {submissionReceipt.selectedBranch}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-cyber-amber/10 border border-cyber-amber/30 text-[11px] font-bold text-cyber-amber text-left flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                The college admissions office will review your scores and contact you at <strong className="text-white">{submissionReceipt.studentPhone}</strong> for seat allotment and campus verification.
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => router.push('/vault')}
                className="flex-1 py-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-bold text-white transition flex items-center justify-center gap-2"
              >
                <FolderLock className="w-4 h-4 text-cyber-cyan" />
                <span>VIEW IN VAULT</span>
              </button>

              <button
                onClick={() => router.push('/colleges')}
                className="flex-1 cyber-button-primary py-3.5 rounded-xl text-xs font-black transition shadow-lg"
              >
                DONE
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
