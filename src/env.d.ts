interface ImportMetaEnv {
  /** Web3Forms access key (FR-04). */
  readonly PUBLIC_FORM_ACCESS_KEY?: string;
  /** Production URL, e.g. https://surreyframing.ca */
  readonly PUBLIC_SITE_URL?: string;
  /** Google Analytics 4 measurement ID, e.g. G-XXXXXXXXXX (FR-75). */
  readonly PUBLIC_GA_MEASUREMENT_ID?: string;
  /** "true" = show placeholder reviews/labels in a build (preview deploys only). */
  readonly PUBLIC_SHOW_SAMPLE_CONTENT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
