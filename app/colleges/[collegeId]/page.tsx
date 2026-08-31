import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MOCK_COLLEGES } from '@/lib/data';
import CollegeDetailClient from './CollegeDetailClient';

interface PageProps {
  params: {
    collegeId: string;
  };
}

// 1. Static Site Generation (SSG) pre-rendering for all colleges
export async function generateStaticParams() {
  return MOCK_COLLEGES.map((college) => ({
    collegeId: college.id,
  }));
}

// 2. Dynamic SEO Metadata Generation
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const college = MOCK_COLLEGES.find((c) => c.id === params.collegeId);

  if (!college) {
    return {
      title: 'College Not Found | Nexora',
      description: 'The requested college page could not be located on Nexora.',
    };
  }

  const title = `${college.name} (${college.shortName}) Admissions 2026 - Fees, Courses, Cutoff & Placements`;
  const description = `${college.name} in ${college.location}. Tuition Fee: ${college.feeStructure.tuitionFeePerYear}, Placement Rate: ${college.placements.placementRate}%, Avg Package: ${college.placements.avgPackage}. Apply via Nexora Academic Gateway.`;
  const url = `https://www.nexoraedu.co.in/colleges/${college.id}`;

  return {
    title,
    description,
    keywords: [
      college.name,
      college.shortName,
      `${college.name} fees`,
      `${college.name} placements`,
      `${college.name} admission 2026`,
      `${college.stream} colleges in ${college.location}`,
      college.sector,
      'Nexora College Hub',
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
          alt: `${college.name} - Nexora College Hub`,
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

export default function CollegePage({ params }: PageProps) {
  const college = MOCK_COLLEGES.find((c) => c.id === params.collegeId);

  if (!college) {
    notFound();
  }

  // Schema.org JSON-LD Structured Data for College/University
  const collegeJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'EducationalOrganization',
        '@id': `https://www.nexoraedu.co.in/colleges/${college.id}/#organization`,
        name: college.name,
        alternateName: college.shortName,
        url: `https://www.nexoraedu.co.in/colleges/${college.id}`,
        description: college.description,
        address: {
          '@type': 'PostalAddress',
          addressLocality: college.location,
          addressCountry: 'IN',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: college.rating,
          reviewCount: '128',
          bestRating: '5',
          worstRating: '1',
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Academic Courses & Seat Matrix',
          itemListElement: college.branches.map((b, i) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'EducationalOccupationalProgram',
              name: b.name,
              educationalProgramMode: 'Full-time',
              timeToComplete: `P${b.durationYears}Y`,
              programPrerequisites: college.requirements,
            },
            position: i + 1,
          })),
        },
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
          {
            '@type': 'ListItem',
            position: 3,
            name: college.name,
            item: `https://www.nexoraedu.co.in/colleges/${college.id}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collegeJsonLd) }}
      />
      <CollegeDetailClient college={college} />
    </>
  );
}
