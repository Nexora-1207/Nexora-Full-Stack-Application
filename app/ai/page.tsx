import type { Metadata } from 'next';
import AiClient from './AiClient';

export const metadata: Metadata = {
  title: 'Nexus AI | Academic, Business & Career Copilot',
  description: 'Instant AI guidance for Engineering entrance, Polytechnic lateral entry, BiPC medical lines, business startups, academic doubts, and placement preparation.',
  keywords: [
    'Nexus AI',
    'AI Career Counselor',
    'Nexora Nexus AI',
    'Engineering Branch Predictor AI',
    'Polytechnic ECET Guidance',
    'Business Startup AI Guidance',
    'Academic Doubts AI Assistant',
  ],
  alternates: {
    canonical: 'https://www.nexoraedu.co.in/ai',
  },
  openGraph: {
    title: 'Nexus AI | Academic, Business & Career Copilot',
    description: 'Get instant answers on college admissions, entrance exams, business startups, academic doubts, and career roadmaps.',
    url: 'https://www.nexoraedu.co.in/ai',
    siteName: 'Nexora',
    images: [
      {
        url: '/nexora_logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Nexus AI Academic & Business Copilot',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexus AI Copilot',
    description: 'AI-driven academic counseling, business guidance, and placement roadmap advisor for students.',
    images: ['/nexora_logo.jpg'],
  },
};

export default function AIPage() {
  const aiJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://www.nexoraedu.co.in/ai/#application',
        name: 'Nexus AI Academic & Business Copilot',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web, Android, iOS',
        description: 'AI intelligence agent helping students evaluate engineering branches, polytechnic lateral entry, business concepts, academic doubts, and placement roadmaps.',
        url: 'https://www.nexoraedu.co.in/ai',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://www.nexoraedu.co.in',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Nexus AI',
            item: 'https://www.nexoraedu.co.in/ai',
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aiJsonLd) }}
      />
      <AiClient />
    </>
  );
}
