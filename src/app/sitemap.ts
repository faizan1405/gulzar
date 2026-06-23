import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rishteforever.in';
  
  const routes = [
    '',
    '/about',
    '/contact',
    '/how-it-works',
    '/premium',
    '/safety',
    '/search',
    '/success-stories',
    '/packages/good-profiles',
    '/packages/high-profile',
    '/packages/second-marriage',
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/search' || route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/search' ? 0.9 : 0.8,
  }));
}
