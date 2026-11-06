/**
 * JSON-LD builders (SRS FR-14, NFR-12). Unfilled {{PLACEHOLDER}} values are
 * dropped, so structured data only ever contains owner-confirmed facts.
 */
import { isPlaceholder, site } from '@/config/site';

export type JsonLd = Record<string, unknown>;

/** Returns undefined for placeholders so JSON.stringify omits the key. */
function confirmed<T>(value: T): T | undefined {
  return isPlaceholder(value) ? undefined : value;
}

export function generalContractorSchema(): JsonLd {
  const { address } = site;
  return {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    '@id': new URL('/#business', site.url).href,
    name: site.name,
    legalName: confirmed(site.legalName),
    description: site.pitch,
    url: new URL('/', site.url).href,
    image: new URL('/og-default.jpg', site.url).href,
    telephone: site.phone.display,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.showStreet ? confirmed(address.street) : undefined,
      addressLocality: address.city,
      addressRegion: address.region,
      postalCode: address.showStreet ? confirmed(address.postalCode) : undefined,
      addressCountry: address.country,
    },
    areaServed: site.serviceAreas.map((area) => ({
      '@type': 'City',
      name: `${area.name}, BC`,
    })),
  };
}

/** Serialise for a <script type="application/ld+json"> block, safe against "</script>". */
export function serializeJsonLd(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export interface Crumb {
  label: string;
  href: string;
}

/** BreadcrumbList for detail pages (NFR-12). */
export function breadcrumbSchema(items: Crumb[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: new URL(item.href, site.url).href,
    })),
  };
}

/** Service schema for service pages (NFR-12). */
export function serviceSchema(name: string, description: string, path: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: new URL(path, site.url).href,
    serviceType: 'Wood-frame construction',
    provider: { '@id': new URL('/#business', site.url).href },
    areaServed: site.serviceAreas.map((area) => ({ '@type': 'City', name: `${area.name}, BC` })),
  };
}

/** FAQPage schema for the Contact page (FR-55). */
export function faqPageSchema(items: { q: string; a: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

/** JobPosting for each open role (FR-66). No salary is published (owner, 2026-11-05). */
export function jobPostingSchema(job: {
  title: string;
  description: string;
  datePosted: Date;
  type: 'Full-time' | 'Contract';
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.datePosted.toISOString().slice(0, 10),
    employmentType: job.type === 'Full-time' ? 'FULL_TIME' : 'CONTRACTOR',
    hiringOrganization: {
      '@type': 'Organization',
      name: site.legalName,
      sameAs: new URL('/', site.url).href,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: site.address.city,
        addressRegion: site.address.region,
        addressCountry: site.address.country,
      },
    },
  };
}
