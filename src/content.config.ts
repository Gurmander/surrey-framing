/**
 * Content collections (SRS FR-03, Section 7.4). Every collection has a Zod
 * schema, so a missing or malformed field fails the build instead of shipping.
 * Image fields reference ids in src/data/images.json (CT-04).
 */
import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { file, glob } from 'astro/loaders';
import { site } from '@/config/site';

/** NFR-11: titles ≤ 60 characters, descriptions 140–160. */
const seoTitle = z.string().max(60);
const seoDescription = z.string().min(140).max(160);

const areaSlugs = site.serviceAreas.map((area) => area.slug) as [string, ...string[]];

export const PROJECT_TYPES = [
  'New Homes',
  'Multi-Family',
  'Laneway',
  'Additions',
  'Commercial',
] as const;

export const FAQ_CATEGORIES = ['General', 'Pricing', 'Process', 'Builders'] as const;

const images = defineCollection({
  loader: file('src/data/images.json'),
  schema: z.object({
    /** Path under src/assets/images/, e.g. "placeholder/hero-framed-house.jpg". */
    file: z.string(),
    alt: z.string(),
    /** Where a stock photo came from; omitted for generated placeholders. */
    source: z.url().optional(),
    credit: z.string(),
    placeholder: z.boolean(),
    usedOn: z.array(z.string()).default([]),
    /** Optional grouping on project galleries (FR-26). */
    stage: z.enum(['before', 'during', 'after']).optional(),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    order: z.number().int(),
    summary: z.string().max(140),
    /** Lucide icon name, e.g. "house". */
    icon: z.string(),
    image: reference('images'),
    includes: z.array(z.string()).min(3),
    idealFor: z.array(z.string()).min(2),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).length(3),
    seoTitle,
    seoDescription,
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: z.object({
    /** ≤ 43 chars so "{title} | Surrey Framing" fits in 60 (NFR-11). */
    title: z.string().max(43),
    slug: z.string(),
    /** Display location, e.g. "Surrey (Fleetwood)". */
    city: z.string(),
    /** Service area this project belongs to (links from /service-areas/). */
    area: z.enum(areaSlugs),
    type: z.enum(PROJECT_TYPES),
    serviceSlug: reference('services'),
    summary: z.string().max(160),
    sizeSqFt: z.number().int().positive(),
    duration: z.string(),
    year: z.number().int(),
    scope: z.string(),
    cover: reference('images'),
    gallery: z.array(reference('images')).min(1),
    featured: z.boolean().default(false),
    placeholder: z.boolean().default(false),
    draft: z.boolean().default(false),
    seoDescription,
  }),
});

const jobs = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/jobs' }),
  schema: z.object({
    title: z.string(),
    type: z.enum(['Full-time', 'Contract']),
    location: z.string(),
    requirements: z.array(z.string()).min(1),
    open: z.boolean(),
    datePosted: z.coerce.date(),
  }),
});

const reviews = defineCollection({
  loader: file('src/data/reviews.json'),
  schema: z.object({
    name: z.string(),
    city: z.string(),
    projectType: z.string(),
    rating: z.number().int().min(1).max(5),
    text: z.string().max(300),
    date: z.coerce.date(),
    source: z.enum(['Google', 'Direct']),
    /** Sample content, never a real person. */
    placeholder: z.boolean().default(false),
    /**
     * Text drafted for a real client who has not yet approved it. Hidden in
     * production until set to false (the client confirms the words are theirs).
     */
    draft: z.boolean().default(false),
  }),
});

const faq = defineCollection({
  loader: file('src/data/faq.json'),
  schema: z.object({
    q: z.string(),
    a: z.string(),
    category: z.enum(FAQ_CATEGORIES),
    showOnHome: z.boolean(),
    /** Draft answer that states a business policy; owner must confirm. */
    needsReview: z.boolean().default(false),
  }),
});

const stats = defineCollection({
  loader: file('src/data/stats.json'),
  schema: z.object({
    order: z.number().int(),
    /** A number counts up; text (e.g. "8–10") is shown as-is. */
    value: z.union([z.number(), z.string()]),
    suffix: z.enum(['+', '%', '']),
    label: z.string(),
  }),
});

const process = defineCollection({
  loader: file('src/data/process.json'),
  schema: z.object({
    step: z.number().int(),
    title: z.string(),
    text: z.string(),
    icon: z.string(),
  }),
});

/** Legal pages such as the privacy policy (FR-16). */
const legal = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/legal' }),
  schema: z.object({
    title: z.string(),
    description: seoDescription,
    updated: z.coerce.date(),
  }),
});

export const collections = {
  images,
  services,
  projects,
  jobs,
  reviews,
  faq,
  stats,
  process,
  legal,
};
