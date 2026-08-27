import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldCheck, 
  Linkedin, 
  Mail, 
  Sparkles, 
  Compass, 
  GraduationCap, 
  Building2, 
  ArrowRight,
  ExternalLink,
  Code2,
  TrendingUp,
  Award,
  Globe
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Founders of Nexora | Executive Leadership & Vision',
  description: 'Meet the founders of Nexora (NexoraEdu): Shaik Nadeem Ahmed (Co-Founder, CEO & CTO) and Gudipalli Rakesh Varma (Co-Founder, CMO & CFO). Learn about Nexora Education Technologies, our mission, and leadership.',
  keywords: [
    'Founders of Nexora',
    'Founders of NexoraEdu',
    'Nexora Founders',
    'Shaik Nadeem Ahmed',
    'Shaik. Nadeem Ahmed',
    'Nadeem Shaik',
    'Nexora CEO',
    'Nexora CTO',
    'Gudipalli Rakesh Varma',
    'Gudipalli. Rakesh Varma',
    'Rakesh Varma Gudipalli',
    'Nexora CMO',
    'Nexora CFO',
    'Nexora Education Technologies',
    'nexoraedu.co.in'
  ],
  alternates: {
    canonical: 'https://www.nexoraedu.co.in/about',
  },
  openGraph: {
    title: 'Founders of Nexora | Shaik Nadeem Ahmed & Gudipalli Rakesh Varma',
    description: 'Executive leadership, vision, and founders of Nexora (NexoraEdu) — the premier student academic & career command hub.',
    url: 'https://www.nexoraedu.co.in/about',
    images: ['/nexora_logo.jpg'],
  },
};

const foundersJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  '@id': 'https://www.nexoraedu.co.in/about#aboutpage',
  url: 'https://www.nexoraedu.co.in/about',
  name: 'Founders of Nexora | Shaik Nadeem Ahmed & Gudipalli Rakesh Varma',
  description: 'Official biography and executive profiles of the founders of Nexora (NexoraEdu).',
  mainEntity: {
    '@type': 'EducationalOrganization',
    '@id': 'https://www.nexoraedu.co.in/#organization',
    name: 'Nexora',
    alternateName: 'NexoraEdu',
    url: 'https://www.nexoraedu.co.in',
    logo: 'https://www.nexoraedu.co.in/logo.png',
    email: 'nexoraofficial1207@gmail.com',
    founders: [
      {
        '@type': 'Person',
        name: 'Shaik. Nadeem Ahmed',
        givenName: 'Nadeem',
        familyName: 'Shaik',
        jobTitle: 'Co-Founder, Chief Executive Officer (CEO) & Chief Technology Officer (CTO)',
        url: 'https://www.linkedin.com/in/nadeem-shaik-458981343',
        sameAs: ['https://www.linkedin.com/in/nadeem-shaik-458981343'],
        worksFor: {
          '@type': 'EducationalOrganization',
          name: 'Nexora'
        },
        description: 'Co-Founder, CEO and CTO of Nexora. Directs overall corporate strategy, cloud software architecture, AI engines, and platform engineering.',
        knowsAbout: ['Software Architecture', 'Full-Stack Engineering', 'Cloud Infrastructure', 'Artificial Intelligence', 'EdTech Innovation']
      },
      {
        '@type': 'Person',
        name: 'Gudipalli. Rakesh Varma',
        givenName: 'Rakesh Varma',
        familyName: 'Gudipalli',
        jobTitle: 'Co-Founder, Chief Marketing Officer (CMO) & Chief Financial Officer (CFO)',
        url: 'https://www.linkedin.com/in/rakesh-varma-gudipalli-88b417343',
        sameAs: ['https://www.linkedin.com/in/rakesh-varma-gudipalli-88b417343'],
        worksFor: {
          '@type': 'EducationalOrganization',
          name: 'Nexora'
        },
        description: 'Co-Founder, CMO and CFO of Nexora. Leads institutional partnerships, marketing strategies, user acquisition, and financial management.',
        knowsAbout: ['Growth Marketing', 'Brand Strategy', 'Financial Modeling', 'Institutional Outreach', 'Operations Leadership']
      }
    ]
  }
};

export default function AboutFoundersPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(foundersJsonLd) }}
      />

      {/* Decorative ambient gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-cyber-cyan/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-cyber-magenta/10 rounded-full blur-[160px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-16">
        
        {/* Top Breadcrumb & Return Nav */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-6">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-cyber-cyan hover:text-cyber-cyan/80 transition-colors uppercase tracking-widest"
          >
            ← Return to Nexora Hub
          </Link>
          <div className="flex items-center gap-2 text-xs text-white/50 font-mono">
            <Globe className="w-3.5 h-3.5 text-cyber-cyan" />
            <span>NEXORAEDU.CO.IN</span>
          </div>
        </div>

        {/* HERO SECTION */}
        <header className="text-center space-y-5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Official Leadership & Corporate Dossier
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Founders of <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyber-cyan via-cyber-violet to-cyber-magenta">Nexora</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 dark:text-slate-400 font-medium leading-relaxed">
            Empowering students with AI-guided career pathways, direct college admissions gateways, and encrypted academic vaults. Founded with vision and precision by industry-leading innovators.
          </p>
        </header>

        {/* FOUNDERS GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* FOUNDER 1: Shaik Nadeem Ahmed */}
          <article className="group relative rounded-3xl p-8 sm:p-10 bg-slate-900/80 border border-cyber-cyan/30 shadow-2xl backdrop-blur-xl hover:border-cyber-cyan transition-all duration-300 flex flex-col justify-between">
            <div className="absolute -top-3 right-8 px-3 py-1 rounded-full bg-cyber-cyan text-slate-950 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-cyber-cyan/30">
              CEO & CTO
            </div>

            <div className="space-y-6">
              {/* Header Profile */}
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyber-cyan to-blue-600 p-0.5 shadow-xl shadow-cyber-cyan/20 flex-shrink-0">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-2xl text-cyber-cyan">
                    SN
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-wide group-hover:text-cyber-cyan transition-colors">
                    Shaik. Nadeem Ahmed
                  </h2>
                  <p className="text-xs font-bold text-cyber-cyan uppercase tracking-wider mt-1">
                    Co-Founder • CEO & CTO
                  </p>
                  <p className="text-[11px] text-white/50 font-mono mt-0.5">
                    Technology & Product Strategy Lead
                  </p>
                </div>
              </div>

              {/* Bio & Responsibilities */}
              <p className="text-sm text-slate-300 dark:text-slate-400 leading-relaxed">
                Shaik Nadeem Ahmed serves as the Chief Executive Officer and Chief Technology Officer at Nexora. He architects the end-to-end full-stack technology stack, cloud infrastructure, AI counselor models, and security protocols powering the platform.
              </p>

              {/* Focus Areas */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest">Core Disciplines</h3>
                <div className="flex flex-wrap gap-2">
                  {['Cloud Architecture', 'Full-Stack Systems', 'AI Intelligence', 'Platform Design', 'Cyber Security'].map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/[0.04] border border-white/[0.08] text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions & Verified LinkedIn */}
            <div className="pt-8 mt-6 border-t border-white/[0.08] flex items-center justify-between">
              <a 
                href="https://www.linkedin.com/in/nadeem-shaik-458981343" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0077B5] hover:bg-[#006097] text-white font-bold text-xs shadow-lg shadow-[#0077B5]/30 transition-all group-hover:scale-105"
              >
                <Linkedin className="w-4 h-4" />
                Connect on LinkedIn
                <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
              </a>
              <span className="text-[10px] font-mono text-cyber-cyan font-bold tracking-widest uppercase">
                Verified Founder
              </span>
            </div>
          </article>

          {/* FOUNDER 2: Gudipalli Rakesh Varma */}
          <article className="group relative rounded-3xl p-8 sm:p-10 bg-slate-900/80 border border-cyber-magenta/30 shadow-2xl backdrop-blur-xl hover:border-cyber-magenta transition-all duration-300 flex flex-col justify-between">
            <div className="absolute -top-3 right-8 px-3 py-1 rounded-full bg-cyber-magenta text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-cyber-magenta/30">
              CMO & CFO
            </div>

            <div className="space-y-6">
              {/* Header Profile */}
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyber-magenta to-purple-600 p-0.5 shadow-xl shadow-cyber-magenta/20 flex-shrink-0">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-2xl text-cyber-magenta">
                    RV
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-wide group-hover:text-cyber-magenta transition-colors">
                    Gudipalli. Rakesh Varma
                  </h2>
                  <p className="text-xs font-bold text-cyber-magenta uppercase tracking-wider mt-1">
                    Co-Founder • CMO & CFO
                  </p>
                  <p className="text-[11px] text-white/50 font-mono mt-0.5">
                    Marketing & Financial Operations Lead
                  </p>
                </div>
              </div>

              {/* Bio & Responsibilities */}
              <p className="text-sm text-slate-300 dark:text-slate-400 leading-relaxed">
                Gudipalli Rakesh Varma serves as the Chief Marketing Officer and Chief Financial Officer at Nexora. He spearheads enterprise academic partnerships, university outreach, user expansion strategies, and fiscal management.
              </p>

              {/* Focus Areas */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest">Core Disciplines</h3>
                <div className="flex flex-wrap gap-2">
                  {['Institutional Alliances', 'Growth Strategy', 'Financial Modeling', 'Brand Marketing', 'Student Outreach'].map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/[0.04] border border-white/[0.08] text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions & Verified LinkedIn */}
            <div className="pt-8 mt-6 border-t border-white/[0.08] flex items-center justify-between">
              <a 
                href="https://www.linkedin.com/in/rakesh-varma-gudipalli-88b417343" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0077B5] hover:bg-[#006097] text-white font-bold text-xs shadow-lg shadow-[#0077B5]/30 transition-all group-hover:scale-105"
              >
                <Linkedin className="w-4 h-4" />
                Connect on LinkedIn
                <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
              </a>
              <span className="text-[10px] font-mono text-cyber-magenta font-bold tracking-widest uppercase">
                Verified Founder
              </span>
            </div>
          </article>
        </section>

        {/* ABOUT NEXORA COMPANY DOSSIER */}
        <section className="rounded-3xl p-8 sm:p-12 bg-slate-900/60 border border-white/[0.08] backdrop-blur-xl space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
            <div>
              <span className="text-xs font-mono font-bold text-cyber-cyan tracking-widest uppercase">
                Corporate Mission
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                About Nexora (NexoraEdu)
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                Official Portal: nexoraedu.co.in
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Career Decision Trees</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Multi-branch roadmaps mapping 10th pass, Intermediate (MPC/BiPC), Polytechnic diplomas, and ITI trades to high-paying engineering & tech careers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyber-violet/10 border border-cyber-violet/30 flex items-center justify-center text-cyber-violet">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Direct College Directory</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Verified accreditation, NIRF ratings, fee structures, cutoffs, and 1-click application tokens directly synchronized to top universities.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyber-magenta/10 border border-cyber-magenta/30 flex items-center justify-center text-cyber-magenta">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">S-Node AI Counselor</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dedicated 24/7 student AI intelligence unit providing tailored syllabus reviews, mock interviews, and personalized admission guidance.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>
              Corporate Inquiries: <a href="mailto:nexoraofficial1207@gmail.com" className="text-cyber-cyan hover:underline font-mono">nexoraofficial1207@gmail.com</a>
            </p>
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyber-cyan to-blue-600 text-slate-950 font-black tracking-wider uppercase text-xs hover:opacity-95 shadow-lg shadow-cyber-cyan/20"
            >
              Launch Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
