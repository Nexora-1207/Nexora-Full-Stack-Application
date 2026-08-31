import { MetadataRoute } from 'next';
import { MOCK_COLLEGES } from '@/lib/data';
import { SECTOR_TREES } from '@/lib/sectorTrees';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.nexoraedu.co.in';

  // 1. Core Public Landing & Command Hub Pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/colleges`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/sectors`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/ai`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // 2. Dynamic College Detail Pages (/colleges/[collegeId])
  const collegePages: MetadataRoute.Sitemap = MOCK_COLLEGES.map((college) => ({
    url: `${baseUrl}/colleges/${college.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  // 3. Dynamic Sector Guidance Pages (/sectors/[sectorId])
  const sectorPages: MetadataRoute.Sitemap = Object.keys(SECTOR_TREES).map((sectorKey) => ({
    url: `${baseUrl}/sectors/${sectorKey}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [...staticPages, ...collegePages, ...sectorPages];
}
