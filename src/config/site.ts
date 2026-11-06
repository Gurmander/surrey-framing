/**
 * Single source of truth for business data (SRS FR-01, FR-02, C-5).
 *
 * Pages and components must read phone, email, address, etc. from here and never
 * hard-code them. Values the owner has not confirmed yet stay as {{PLACEHOLDER}}
 * strings (SRS 1.3). Before launch, searching the repo for "{{" must return 0 hits
 * outside docs (SRS 9.2).
 */

/** A value the owner still has to supply, e.g. "{{PHONE}}". */
export type Placeholder = `{{${string}}}`;

/** True while a value is still an unfilled {{PLACEHOLDER}}. */
export function isPlaceholder(value: unknown): value is Placeholder {
  return typeof value === 'string' && /^\{\{[A-Z0-9_]+\}\}$/.test(value);
}

export interface ServiceArea {
  name: string;
  /** Anchor id on /service-areas/, e.g. "white-rock" → /service-areas/#white-rock */
  slug: string;
}

export interface SiteConfig {
  name: string;
  legalName: string;
  tagline: string;
  /** One-line pitch used in the footer and as the default meta description base. */
  pitch: string;
  url: string;
  phone: { display: string; href: string };
  /** WhatsApp number in international format, digits only (FR-42). */
  whatsapp: string;
  email: string;
  address: {
    /** Only needed if `showStreet` is true. */
    street?: string;
    city: string;
    region: string;
    postalCode?: string;
    country: string;
    /**
     * false = service-area business: the footer shows `serviceAreaLabel`
     * instead of a street address (SRS FR-11, open question in 2.5).
     */
    showStreet: boolean;
  };
  serviceAreaLabel: string;
  serviceAreas: ServiceArea[];
  /** Coverage is stated on the site; account numbers and amounts are not published. */
  licences: { worksafebc: boolean; insured: boolean };
  facts: {
    yearsInBusiness: number;
    /** Shown as "200+". */
    projectCount: number;
    crewSize: string;
    ownerName: string;
    /** Shown as "more than 15 years". */
    ownerExperienceYears: number;
  };
  /** Web3Forms access key, read from the environment (FR-04, NFR-31). */
  formAccessKey: string;
  /** Google Analytics 4 measurement ID (G-…); empty = no analytics, no banner. */
  ga4Id: string;
  /** Footer "Site by" credit; `url` may be empty (no link). */
  credit: { name: string; url: string };
}

export const site: SiteConfig = {
  name: 'Surrey Framing',
  legalName: 'Surrey Framing Ltd.',
  tagline: 'Built square. Built on schedule.',
  pitch:
    'Residential and multi-family framing across Surrey and the Lower Mainland, from laneway homes to townhouse complexes.',
  url: import.meta.env.SITE ?? 'https://surreyframing.ca',

  phone: {
    display: '(604) 652-3965',
    href: 'tel:+16046523965',
  },
  whatsapp: '16046523965',
  email: 'surreyframing@gmail.com',

  // Service-area business: no street address or opening hours are published (owner, 2026-11-05).
  address: {
    city: 'Surrey',
    region: 'BC',
    country: 'CA',
    showStreet: false,
  },
  serviceAreaLabel: 'Serving Metro Vancouver & Fraser Valley',

  serviceAreas: [
    { name: 'Surrey', slug: 'surrey' },
    { name: 'Langley', slug: 'langley' },
    { name: 'Delta', slug: 'delta' },
    { name: 'White Rock', slug: 'white-rock' },
    { name: 'Abbotsford', slug: 'abbotsford' },
    { name: 'Coquitlam', slug: 'coquitlam' },
    { name: 'Burnaby', slug: 'burnaby' },
    { name: 'New Westminster', slug: 'new-westminster' },
    { name: 'Maple Ridge', slug: 'maple-ridge' },
    { name: 'Richmond', slug: 'richmond' },
  ],

  licences: { worksafebc: true, insured: true },

  facts: {
    yearsInBusiness: 20,
    projectCount: 200,
    crewSize: '8–10',
    ownerName: 'Kimatpal Shergill',
    ownerExperienceYears: 15,
  },

  formAccessKey: import.meta.env.PUBLIC_FORM_ACCESS_KEY ?? '',
  ga4Id: import.meta.env.PUBLIC_GA_MEASUREMENT_ID ?? '',
  // Temporary link until Ceebub has its own site (owner, 2026-11-05).
  credit: { name: 'Ceebub', url: 'https://github.com/Gurmander' },
};

/** WhatsApp click-to-chat link that opens a chat with an optional pre-filled message. */
export function whatsappHref(message?: string): string {
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
