import type { Metadata, Viewport } from 'next';
import { Outfit, Inter } from 'next/font/google';
import '../styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { CyberToastProvider } from '@/components/CyberToast';

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

export const viewport: Viewport = {
  themeColor: '#030712',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.nexoraedu.co.in'),
  title: {
    default: 'Nexora | Premier Student Academic & Career Command Hub',
    template: '%s | Nexora'
  },
  description: 'AI-driven career pathfinder, academic colleges hub, document vault, and placement readiness platform founded by Shaik Nadeem Ahmed (CEO & CTO) and Gudipalli Rakesh Varma (CMO & CFO).',
  keywords: [
    'Nexora', 
    'NEXORAEDU.CO.IN',
    'NexoraEdu',
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
    'Career Pathfinder', 
    'Engineering Colleges', 
    'Polytechnic Diploma Lateral Entry', 
    'Intermediate MPC', 
    'BiPC Pre-Medical', 
    'Student Document Vault', 
    'AI Career Counselor',
    'College Admissions Gateway'
  ],
  authors: [
    { name: 'Shaik. Nadeem Ahmed - CEO & CTO', url: 'https://www.linkedin.com/in/nadeem-shaik-458981343' },
    { name: 'Gudipalli. Rakesh Varma - CMO & CFO', url: 'https://www.linkedin.com/in/rakesh-varma-gudipalli-88b417343' },
    { name: 'Nexora Education Technologies', url: 'https://www.nexoraedu.co.in' }
  ],
  creator: 'Shaik. Nadeem Ahmed & Gudipalli. Rakesh Varma (Nexora)',
  publisher: 'Nexora Education Technologies',
  manifest: '/manifest.webmanifest',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://www.nexoraedu.co.in',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
      { url: '/icon.png', sizes: '640x640', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/logo.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Nexora | Premier Student Academic & Career Command Hub',
    description: 'AI-driven career pathfinder, academic colleges hub, encrypted document vault, and placement readiness platform founded by Shaik Nadeem Ahmed and Gudipalli Rakesh Varma.',
    url: 'https://www.nexoraedu.co.in',
    siteName: 'Nexora',
    images: [
      {
        url: '/nexora_logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Nexora - Student Academic & Career Command Hub',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexora | Academic & Career Command Hub',
    description: 'AI-driven career pathfinder, college directory, and encrypted document vault. Founded by Shaik Nadeem Ahmed and Gudipalli Rakesh Varma.',
    images: ['/nexora_logo.jpg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://www.nexoraedu.co.in/#website',
      url: 'https://www.nexoraedu.co.in',
      name: 'Nexora',
      description: 'Premier Student Academic & Career Command Hub',
      publisher: {
        '@id': 'https://www.nexoraedu.co.in/#organization'
      },
      inLanguage: 'en-IN'
    },
    {
      '@type': 'EducationalOrganization',
      '@id': 'https://www.nexoraedu.co.in/#organization',
      name: 'Nexora',
      alternateName: ['NexoraEdu', 'Nexora Education Technologies'],
      url: 'https://www.nexoraedu.co.in',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.nexoraedu.co.in/logo.png',
        width: '512',
        height: '512'
      },
      image: 'https://www.nexoraedu.co.in/nexora_logo.jpg',
      email: 'nexoraofficial1207@gmail.com',
      description: 'Premier Student Academic & Career Command Hub connecting Intermediate, Polytechnic, and ITI students with top engineering colleges, career pathfinding, and placement readiness.',
      founders: [
        {
          '@type': 'Person',
          '@id': 'https://www.nexoraedu.co.in/#nadeem',
          name: 'Shaik. Nadeem Ahmed',
          givenName: 'Nadeem',
          familyName: 'Shaik',
          jobTitle: 'Co-Founder, Chief Executive Officer (CEO) & Chief Technology Officer (CTO)',
          url: 'https://www.linkedin.com/in/nadeem-shaik-458981343',
          sameAs: [
            'https://www.linkedin.com/in/nadeem-shaik-458981343'
          ],
          description: "Directs Nexora's overall corporate vision, system architecture, product engineering, and technology strategy as CEO & CTO.",
          knowsAbout: ['Full-Stack Engineering', 'Cloud Architecture', 'System Design', 'EdTech Innovation', 'Executive Leadership']
        },
        {
          '@type': 'Person',
          '@id': 'https://www.nexoraedu.co.in/#rakesh',
          name: 'Gudipalli. Rakesh Varma',
          givenName: 'Rakesh Varma',
          familyName: 'Gudipalli',
          jobTitle: 'Co-Founder, Chief Marketing Officer (CMO) & Chief Financial Officer (CFO)',
          url: 'https://www.linkedin.com/in/rakesh-varma-gudipalli-88b417343',
          sameAs: [
            'https://www.linkedin.com/in/rakesh-varma-gudipalli-88b417343'
          ],
          description: "Oversees brand marketing, college partnerships, financial stewardship, operations, and business growth as CMO & CFO.",
          knowsAbout: ['Marketing Strategy', 'Financial Modeling', 'Corporate Operations', 'Institutional Outreach', 'Fiscal Management']
        }
      ],
      knowsAbout: [
        'Career Pathfinder',
        'Engineering Colleges',
        'Polytechnic Lateral Entry',
        'Student Document Vault',
        'AI Career Guidance'
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${outfit.variable} ${inter.variable} bg-background text-foreground min-h-screen relative flex flex-col font-sans selection:bg-cyber-cyan selection:text-background`}>
        {/* Search Engine Schema.org Structured Data (Google / Bing / Edge / Brave Knowledge Graph) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <ThemeProvider>
          <CyberToastProvider>
            {/* Background Ambient Mesh Glows */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
              <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyber-cyan/10 rounded-full blur-[140px] animate-pulse"></div>
              <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyber-violet/10 rounded-full blur-[150px]"></div>
              <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-cyber-magenta/10 rounded-full blur-[140px]"></div>
            </div>

            {/* Top Header & Bottom Liquid Glass Taskbar */}
            <Navbar />

            {/* Page Content Container */}
            <main className="flex-1 relative z-10">
              {children}
            </main>

            {/* Comprehensive SEO & Corporate Footer */}
            <Footer />
          </CyberToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

