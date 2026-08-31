import type { Metadata } from 'next';
import { MOCK_COLLEGES } from '@/lib/data';
import CollegesListClient from './CollegesListClient';

export const metadata: Metadata = {
  title: 'Engineering, Polytechnic & ITI Colleges Hub 2026 | Nexora',
  description: 'Explore premier engineering colleges, polytechnic diploma institutes, and lateral entry universities across India. Check fees, placement statistics, scholarships, and apply through Nexora.',
  keywords: [
    'Engineering Colleges India',
    'Polytechnic Diploma Colleges',
    'Lateral Entry B.Tech Admission',
    'Intermediate MPC BiPC Colleges',
    'College Fees and Placements',
    'Nexora College Hub',
    'Direct Admission Gateway',
  ],
  alternates: {
    canonical: 'https://www.nexoraedu.co.in/colleges',
  },
  openGraph: {
    title: 'Engineering & Polytechnic Colleges Directory 2026 | Nexora',
    description: 'Compare college fees, placement statistics, cutoff metrics, and scholarships across top institutions.',
    url: 'https://www.nexoraedu.co.in/colleges',
    siteName: 'Nexora',
    images: [
      {
        url: '/nexora_logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Nexora Colleges Directory',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Engineering & Polytechnic Colleges Directory | Nexora',
    description: 'Compare college fees, placement statistics, cutoff metrics, and apply directly via Nexora.',
    images: ['/nexora_logo.jpg'],
  },
};

export default function CollegesPage() {
  // Schema.org ItemList JSON-LD for Colleges Directory
  const collegesListJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        '@id': 'https://www.nexoraedu.co.in/colleges/#itemlist',
        name: 'Featured Engineering & Vocational Colleges Directory',
        description: 'Comprehensive directory of top accredited engineering, polytechnic, and vocational institutes.',
        numberOfItems: MOCK_COLLEGES.length,
        itemListElement: MOCK_COLLEGES.map((col, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'EducationalOrganization',
            name: col.name,
            url: `https://www.nexoraedu.co.in/colleges/${col.id}`,
            address: {
              '@type': 'PostalAddress',
              addressLocality: col.location,
              addressCountry: 'IN',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: col.rating,
              bestRating: '5',
            },
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
            name: 'Colleges Directory',
            item: 'https://www.nexoraedu.co.in/colleges',
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collegesListJsonLd) }}
      />
      <CollegesListClient />
    </>
  );
}
