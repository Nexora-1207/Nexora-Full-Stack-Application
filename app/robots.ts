import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const allowedPublic = [
    '/',
    '/founders',
    '/colleges',
    '/colleges/*',
    '/sectors',
    '/sectors/*',
    '/ai',
  ];

  const disallowedPrivate = [
    '/dashboard',
    '/profile',
    '/vault',
    '/auth',
    '/auth/*',
    '/api/*',
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: allowedPublic,
        disallow: disallowedPrivate,
      },
      {
        userAgent: 'Googlebot',
        allow: allowedPublic,
        disallow: disallowedPrivate,
      },
      {
        userAgent: 'Bingbot',
        allow: allowedPublic,
        disallow: disallowedPrivate,
      },
      {
        userAgent: 'Bravebot',
        allow: allowedPublic,
        disallow: disallowedPrivate,
      },
    ],
    sitemap: 'https://www.nexoraedu.co.in/sitemap.xml',
  };
}
