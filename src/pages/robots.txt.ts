/**
 * robots.txt, generated so the sitemap URL follows the configured site URL
 * (NFR-13). /thank-you/ is kept out of search with a noindex meta tag instead of
 * a Disallow rule, so crawlers can still see the noindex.
 */
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site).href;
  const body = ['User-agent: *', 'Allow: /', '', `Sitemap: ${sitemap}`, ''].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
