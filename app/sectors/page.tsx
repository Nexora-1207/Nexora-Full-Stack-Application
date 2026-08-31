import type { Metadata } from 'next';
import { SECTORS } from '@/lib/data';
import SectorsListClient from './SectorsListClient';

export const metadata: Metadata = {
  title: '14 Career Sectors & Academic Pathfinder Matrix 2026 | Nexora',
  description: 'Explore 14 interactive career sector pods including Engineering, Skilled Trades, Computers, Medical Support, Merchant Navy, Fashion Design, Law, and Business. Guided career pathfinder by Nexora.',
  keywords: [
    'Career Sectors India',
    'Engineering Branch Selection',
    'Polytechnic Lateral Entry Pathways',
    'Skilled Trades Vocational Careers',
    'Nexora Career Pathfinder',
    'Student Onboarding Matrix',
  ],
  alternates: {
    canonical: 'https://www.nexoraedu.co.in/sectors',
  },
  openGraph: {
    title: '14 Interactive Career Sectors & Pathfinding Matrix | Nexora',
    description: 'Discover salary ranges, market demand, placement roles, and academic pathfinding across 14 major industries.',
    url: 'https://www.nexoraedu.co.in/sectors',
    siteName: 'Nexora',
    images: [
      {
        url: '/nexora_logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Nexora Career Sectors Matrix',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '14 Career Sectors & Academic Pathfinder | Nexora',
    description: 'Interactive branch decision tree and industry awareness brief across 14 career sectors.',
    images: ['/nexora_logo.jpg'],
  },
};

export default function SectorsPage() {
  // Schema.org ItemList JSON-LD for Sectors Directory
  const sectorsListJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        '@id': 'https://www.nexoraedu.co.in/sectors/#itemlist',
        name: 'Career Sectors & Educational Pathways Matrix',
        description: 'Comprehensive directory of 14 career sectors with guided academic decision trees.',
        numberOfItems: SECTORS.length,
        itemListElement: SECTORS.map((sec, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Occupation',
            name: sec.name,
            url: `https://www.nexoraedu.co.in/sectors/${sec.id.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`,
            description: sec.description,
            occupationalCategory: sec.category,
          },
        })),
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
            name: 'Career Sectors',
            item: 'https://www.nexoraedu.co.in/sectors',
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sectorsListJsonLd) }}
      />
      <SectorsListClient />
    </>
  );
}
