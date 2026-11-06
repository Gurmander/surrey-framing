interface ImportMetaEnv {
  /** Web3Forms access key (FR-04). */
  readonly PUBLIC_FORM_ACCESS_KEY?: string;
  /** Production URL, e.g. https://surreyframing.ca */
  readonly PUBLIC_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
