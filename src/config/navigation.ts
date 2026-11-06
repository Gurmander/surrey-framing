/**
 * Every internal URL in one place. Paths end with a trailing slash to match
 * `trailingSlash: 'always'` in astro.config.mjs (one canonical URL per page).
 */
import type { UIStrings } from '@/i18n';

export const routes = {
  home: '/',
  services: '/services/',
  service: (slug: string) => `/services/${slug}/`,
  projects: '/projects/',
  project: (slug: string) => `/projects/${slug}/`,
  about: '/about/',
  builders: '/builders/',
  serviceAreas: '/service-areas/',
  serviceArea: (slug: string) => `/service-areas/#${slug}`,
  careers: '/careers/',
  contact: '/contact/',
  /** Quote form, optionally pre-selecting a service (FR-21). */
  quote: (serviceSlug?: string) =>
    serviceSlug ? `/contact/?service=${encodeURIComponent(serviceSlug)}` : '/contact/',
  thankYou: '/thank-you/',
  privacy: '/privacy/',
} as const;

type NavKey = keyof UIStrings['nav'];
export interface NavLink {
  key: NavKey;
  href: string;
}

/** Header nav, SRS Section 5 (the "Get a Quote" button is rendered separately). */
export const mainNav: NavLink[] = [
  { key: 'services', href: routes.services },
  { key: 'projects', href: routes.projects },
  { key: 'about', href: routes.about },
  { key: 'builders', href: routes.builders },
  { key: 'careers', href: routes.careers },
  { key: 'contact', href: routes.contact },
];

/** Footer "Company" column, SRS FR-11. */
export const companyNav: NavLink[] = [
  { key: 'about', href: routes.about },
  { key: 'projects', href: routes.projects },
  { key: 'builders', href: routes.builders },
  { key: 'careers', href: routes.careers },
  { key: 'serviceAreas', href: routes.serviceAreas },
];

/**
 * TEMPORARY (Milestone 1): the 8 services from SRS FR-22, used for the footer and
 * the service detail stubs. Milestone 2 replaces this with the `services`
 * content collection so titles live in one place.
 */
export const serviceLinks: { title: string; slug: string }[] = [
  { title: 'New Home Framing', slug: 'new-home-framing' },
  { title: 'Multi-Family & Townhouse Framing', slug: 'multi-family-framing' },
  { title: 'Laneway Homes & Garden Suites', slug: 'laneway-garden-suites' },
  { title: 'Additions & Renovations', slug: 'additions-renovations' },
  { title: 'Basement Framing', slug: 'basement-framing' },
  { title: 'Roof Framing & Trusses', slug: 'roof-framing' },
  { title: 'Decks, Garages & Outbuildings', slug: 'decks-garages' },
  { title: 'Sheathing, Blocking & Framing Repairs', slug: 'sheathing-repairs' },
];

/**
 * Nav state for a link. `page` = this exact page, `section` = a page inside it
 * (e.g. a service detail page under Services).
 */
export function linkState(href: string, pathname: string): 'page' | 'section' | null {
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`;
  if (path === href) return 'page';
  if (href !== '/' && path.startsWith(href)) return 'section';
  return null;
}
