/**
 * JSON-LD builders (SRS FR-14, NFR-12). Unfilled {{PLACEHOLDER}} values are
 * dropped, so structured data only ever contains owner-confirmed facts.
 */
import { activeSocials, isPlaceholder, site } from '@/config/site';

export type JsonLd = Record<string, unknown>;

/** Returns undefined for placeholders so JSON.stringify omits the key. */
function confirmed<T>(value: T): T | undefined {
  return isPlaceholder(value) ? undefined : value;
}

export function generalContractorSchema(): JsonLd {
  const { address, geo } = site;
  const hasGeo = !isPlaceholder(geo.lat) && !isPlaceholder(geo.lng);
  const sameAs = activeSocials().map((s) => s.url);
  const hours = site.hours.schema.filter((h) => !isPlaceholder(h));

  return {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    '@id': new URL('/#business', site.url).href,
    name: site.name,
    legalName: confirmed(site.legalName),
    description: site.pitch,
    url: new URL('/', site.url).href,
    image: new URL('/og-default.jpg', site.url).href,
    telephone: confirmed(site.phone.display),
    email: confirmed(site.email),
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.showStreet ? confirmed(address.street) : undefined,
      addressLocality: address.city,
      addressRegion: address.region,
      postalCode: address.showStreet ? confirmed(address.postalCode) : undefined,
      addressCountry: address.country,
    },
    geo: hasGeo ? { '@type': 'GeoCoordinates', latitude: geo.lat, longitude: geo.lng } : undefined,
    areaServed: site.serviceAreas.map((area) => ({
      '@type': 'City',
      name: `${area.name}, BC`,
    })),
    openingHours: hours.length ? hours : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
  };
}

/** Serialise for a <script type="application/ld+json"> block, safe against "</script>". */
export function serializeJsonLd(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
