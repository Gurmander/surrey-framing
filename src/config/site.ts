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
  email: string;
  address: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
    /**
     * false = service-area business: the footer shows `serviceAreaLabel`
     * instead of a street address (SRS FR-11, open question in 2.5).
     */
    showStreet: boolean;
  };
  serviceAreaLabel: string;
  geo: { lat: number | Placeholder; lng: number | Placeholder };
  hours: {
    /** Human-readable lines for the footer and contact card. */
    display: string[];
    /** schema.org openingHours values, e.g. "Mo-Fr 07:00-17:00". */
    schema: string[];
  };
  serviceAreas: ServiceArea[];
  /** Only real https:// URLs are rendered; placeholders are skipped. */
  socials: Partial<Record<'facebook' | 'instagram' | 'linkedin' | 'youtube', string>>;
  licences: {
    worksafebc: { covered: boolean; accountNumber: string };
    insurance: { liabilityAmount: string };
  };
  facts: {
    yearsInBusiness: string;
    projectCount: string;
    crewSize: string;
    ownerName: string;
  };
  googleReviewUrl: string;
  /** Web3Forms access key, read from the environment (FR-04, NFR-31). */
  formAccessKey: string;
  credit: { name: string; url: string };
}

export const site: SiteConfig = {
  name: 'Surrey Framing',
  legalName: '{{LEGAL_NAME}}',
  tagline: 'Built square. Built on schedule.',
  pitch:
    'Residential and multi-family framing across Surrey and the Lower Mainland, from laneway homes to townhouse complexes.',
  url: import.meta.env.SITE ?? 'https://surreyframing.ca',

  phone: {
    display: '{{PHONE}}', // e.g. "(604) 555-0123"
    href: 'tel:{{PHONE_E164}}', // e.g. "tel:+16045550123"
  },
  email: '{{EMAIL}}',

  address: {
    street: '{{STREET_ADDRESS}}',
    city: 'Surrey',
    region: 'BC',
    postalCode: '{{POSTAL_CODE}}',
    country: 'CA',
    showStreet: false,
  },
  serviceAreaLabel: 'Serving Metro Vancouver & Fraser Valley',
  geo: { lat: '{{GEO_LAT}}', lng: '{{GEO_LNG}}' },

  hours: {
    display: ['{{HOURS_WEEKDAYS}}', '{{HOURS_WEEKEND}}'], // e.g. "Mon–Fri: 7 am – 5 pm"
    schema: ['{{OPENING_HOURS}}'], // e.g. "Mo-Fr 07:00-17:00"
  },

  // SRS 2.1 — owner to confirm the final list.
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

  socials: {
    facebook: '{{FACEBOOK_URL}}',
    instagram: '{{INSTAGRAM_URL}}',
  },

  licences: {
    worksafebc: { covered: true, accountNumber: '{{WORKSAFEBC_NUMBER}}' },
    insurance: { liabilityAmount: '{{INSURANCE_AMOUNT}}' },
  },

  facts: {
    yearsInBusiness: '{{YEARS}}',
    projectCount: '{{PROJECT_COUNT}}',
    crewSize: '{{CREW_SIZE}}',
    ownerName: '{{OWNER_NAME}}',
  },

  googleReviewUrl: '{{GOOGLE_REVIEW_URL}}',
  formAccessKey: import.meta.env.PUBLIC_FORM_ACCESS_KEY ?? '',
  credit: { name: '{{SITE_BY}}', url: '{{SITE_BY_URL}}' },
};

/** Social links that have a real URL, in display order. */
export function activeSocials(): { network: keyof SiteConfig['socials']; url: string }[] {
  return (Object.entries(site.socials) as [keyof SiteConfig['socials'], string][])
    .filter(([, url]) => url.startsWith('https://'))
    .map(([network, url]) => ({ network, url }));
}
