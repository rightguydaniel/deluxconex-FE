const FALLBACK_SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') ?? 'https://www.deluxconex.com';

export const seoConfig = {
  siteName: 'DeluxConex',
  siteUrl: FALLBACK_SITE_URL,
  defaultDescription: 'DeluxConex supplies shipping containers for sale, rental, and turnkey modifications across the United States.',
  twitterHandle: (import.meta.env.VITE_TWITTER_HANDLE as string | undefined) ?? '',
};

export const buildCanonicalUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${seoConfig.siteUrl}${normalizedPath}`;
};

export const serializeJsonLd = (data: Record<string, unknown>) => JSON.stringify(data, null, 2);
