/**
 * Typed, sorted access to the content collections, so pages don't repeat
 * sorting and filtering rules.
 */
import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Sample (placeholder) content is shown in `npm run dev`, and in a build only
 * when PUBLIC_SHOW_SAMPLE_CONTENT=true (e.g. a preview deploy). Production builds
 * never show placeholder reviews (SRS FR-50, launch checklist 9.2).
 */
export const showSamples =
  import.meta.env.DEV || import.meta.env.PUBLIC_SHOW_SAMPLE_CONTENT === 'true';

export type Service = CollectionEntry<'services'>;
export type Project = CollectionEntry<'projects'>;
export type Review = CollectionEntry<'reviews'>;
export type Faq = CollectionEntry<'faq'>;

export async function getServices(): Promise<Service[]> {
  const services = await getCollection('services');
  return services.sort((a, b) => a.data.order - b.data.order);
}

/** Published projects, newest first. */
export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection('projects', ({ data }) => !data.draft);
  return projects.sort(
    (a, b) => b.data.year - a.data.year || a.data.title.localeCompare(b.data.title),
  );
}

export async function getFeaturedProjects(limit = 6): Promise<Project[]> {
  return (await getProjects()).filter((p) => p.data.featured).slice(0, limit);
}

/** True for a review the client has approved (not a sample, not an unapproved draft). */
function isApproved(review: Review): boolean {
  return !review.data.placeholder && !review.data.draft;
}

/**
 * Reviews safe to display: approved ones always; samples and drafts awaiting
 * approval only when samples are on (dev or preview builds).
 */
export async function getReviews(): Promise<Review[]> {
  const reviews = await getCollection('reviews', (review) => showSamples || isApproved(review));
  return reviews.sort(
    (a, b) =>
      b.data.date.getTime() - a.data.date.getTime() || a.data.name.localeCompare(b.data.name),
  );
}

export async function getFaqs(filter?: (faq: Faq) => boolean): Promise<Faq[]> {
  const faqs = await getCollection('faq');
  return filter ? faqs.filter(filter) : faqs;
}

export async function getStats() {
  return (await getCollection('stats')).sort((a, b) => a.data.order - b.data.order);
}

export async function getProcessSteps() {
  return (await getCollection('process')).sort((a, b) => a.data.step - b.data.step);
}

export async function getOpenJobs() {
  return (await getCollection('jobs', ({ data }) => data.open)).sort(
    (a, b) => b.data.datePosted.getTime() - a.data.datePosted.getTime(),
  );
}

/** URL-safe key for a project type, e.g. "New Homes" → "new-homes" (used in ?type=). */
export function typeKey(type: string): string {
  return type.toLowerCase().replace(/\s+/g, '-');
}
