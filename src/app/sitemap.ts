import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rishteforever.in';

  const routes = [
    '',
    '/about',
    '/contact',
    '/faq',
    '/how-it-works',
    '/packages',
    '/safety',
    '/search',
    '/success-stories',
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/search' || route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/search' ? 0.9 : 0.8,
  }));
}
