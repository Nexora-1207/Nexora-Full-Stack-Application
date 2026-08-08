import type { Metadata } from 'next';
import { Outfit, Inter } from 'next/font/google';
import '@/styles/globals.css';
import Navbar from '@/components/Navbar';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nexora | Premier Student Academic & Career Command Hub',
  description: 'AI-driven career pathfinder, academic colleges hub, document vault, and placement readiness platform for engineering, polytechnic, and vocational students.',
  keywords: ['Nexora', 'Career Pathfinder', 'Engineering Colleges', 'Polytechnic Diploma', 'Intermediate MPC', 'Student Vault', 'AI Career Agent'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} ${inter.variable} bg-background text-slate-100 min-h-screen relative flex flex-col font-sans selection:bg-cyber-cyan selection:text-background`}>
        
        {/* Background Cyber Mesh Glows */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyber-cyan/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyber-violet/10 rounded-full blur-[140px]"></div>
          <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-cyber-magenta/10 rounded-full blur-[130px]"></div>
        </div>

        {/* Global Navigation */}
        <Navbar />

        {/* Page Content Container */}
        <main className="flex-1 relative z-10 pb-24 md:pb-12">
          {children}
        </main>
      </body>
    </html>
  );
}
