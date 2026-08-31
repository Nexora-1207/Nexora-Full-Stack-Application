import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SECTOR_TREES } from '@/lib/sectorTrees';
import SectorDetailClient from './SectorDetailClient';

interface PageProps {
  params: {
    sectorId: string;
  };
}

// 1. Static Site Generation (SSG) pre-rendering for all sectors
export async function generateStaticParams() {
  return Object.keys(SECTOR_TREES).map((sectorKey) => ({
    sectorId: sectorKey,
  }));
}

// 2. Dynamic SEO Metadata Generation
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const normalizedKey = params.sectorId.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
  const sector = SECTOR_TREES[normalizedKey] || 
    SECTOR_TREES[params.sectorId.toLowerCase()] || 
    Object.values(SECTOR_TREES).find(s => 
      s.id.toLowerCase() === params.sectorId.toLowerCase() || 
      s.id.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') === normalizedKey
    );

  if (!sector) {
    return {
      title: 'Sector Path Not Found | Nexora',
      description: 'The requested career sector module could not be located on Nexora.',
    };
  }

  const title = `${sector.name} Career Guide 2026 - Salary, Demand, Roles & Pathways`;
  const description = `Explore ${sector.name} career opportunities. Expected Salary: ${sector.awareness.salaryRange}, Market Demand: ${sector.awareness.demand}, Top Roles: ${sector.awareness.roles.slice(0, 3).join(', ')}. Complete guided academic pathway on Nexora.`;
  const url = `https://www.nexoraedu.co.in/sectors/${params.sectorId}`;

  return {
    title,
    description,
    keywords: [
      sector.name,
      `${sector.name} careers`,
      `${sector.name} salary range`,
      `${sector.name} job roles`,
      `${sector.name} market demand`,
      'Career Guidance Nexora',
      'Student Pathfinder',
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Nexora',
      images: [
        {
          url: '/nexora_logo.jpg',
          width: 1200,
          height: 630,
          alt: `${sector.name} Career Guide - Nexora`,
        },
      ],
      locale: 'en_IN',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/nexora_logo.jpg'],
    },
  };
}

export default function SectorPage({ params }: PageProps) {
  const normalizedKey = params.sectorId.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
  const sector = SECTOR_TREES[normalizedKey] || 
    SECTOR_TREES[params.sectorId.toLowerCase()] || 
    Object.values(SECTOR_TREES).find(s => 
      s.id.toLowerCase() === params.sectorId.toLowerCase() || 
      s.id.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') === normalizedKey
    );

  if (!sector) {
    notFound();
  }

  // Schema.org JSON-LD Structured Data for Occupation & Career Sector
  const sectorJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Occupation',
        '@id': `https://www.nexoraedu.co.in/sectors/${params.sectorId}/#occupation`,
        name: sector.name,
        description: sector.awareness.description,
        estimatedSalary: [
          {
            '@type': 'MonetaryAmountDistribution',
            currency: 'INR',
            name: 'Starting Salary Range',
            duration: 'P1Y',
            percentile10: sector.awareness.salaryRange,
          },
        ],
        occupationalCategory: sector.name,
        responsibilities: sector.awareness.marketInsight,
        skillsRequirements: sector.awareness.roles.join(', '),
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
          {
            '@type': 'ListItem',
            position: 3,
            name: sector.name,
            item: `https://www.nexoraedu.co.in/sectors/${params.sectorId}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sectorJsonLd) }}
      />
      <SectorDetailClient sectorId={params.sectorId} />
    </>
  );
}
