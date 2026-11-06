/**
 * Image lookup by manifest id (SRS CT-03, CT-04). Components never import image
 * files directly: they ask for an id such as "hero-home", and the manifest
 * (src/data/images.json) says which file to use. Replacing a photo means changing
 * one `file` value.
 */
import type { ImageMetadata } from 'astro';
import { getEntry, type CollectionEntry } from 'astro:content';

const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

export type ImageRef = string | { id: string };

export type ResolvedImage = CollectionEntry<'images'>['data'] & {
  id: string;
  src: ImageMetadata;
};

export async function resolveImage(ref: ImageRef): Promise<ResolvedImage> {
  const id = typeof ref === 'string' ? ref : ref.id;
  const entry = await getEntry('images', id);
  if (!entry) throw new Error(`Image id "${id}" is not listed in src/data/images.json`);

  const mod = files[`/src/assets/images/${entry.data.file}`];
  if (!mod) {
    throw new Error(
      `Image "${id}" points to "${entry.data.file}", which is not in src/assets/images/`,
    );
  }
  return { ...entry.data, id, src: mod.default };
}
