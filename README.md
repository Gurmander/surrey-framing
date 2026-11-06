# Surrey Framing website

Static marketing site for Surrey Framing, built with Astro, Tailwind CSS and TypeScript.
The project specification, agent instructions and decision log are kept locally in
`doc/` and are not part of this repository.

## Editing the site

Every change follows the same routine:

1. Edit the file described below.
2. Run `npm run dev` and check the change at http://localhost:4321.
3. Commit and push to `main`. The live site rebuilds automatically (see
   [Deploying](#deploying)).

If you make a mistake in a content file, the build stops with a message naming the file
and the field, and nothing broken goes live.

### Change the phone number, email or business details

Open `src/config/site.ts`. The phone number, email, WhatsApp number, legal name, service
areas and company facts (years in business, projects, crew size) are all in one block.
The whole site reads them from there, so change them once. The phone has two fields:
`display` is what people see, and `href` is the dialling version (`tel:+1…`).

### Change text on a page

- Page wording, buttons and headings: `src/i18n/en.json`.
- A service page: its Markdown file in `src/content/services/`. The text below the
  `---` lines is the page body; the lines above it are the summary, the checklists and
  the FAQs.
- The privacy policy: `src/content/legal/privacy.md`. Update the `updated:` date.

### Add a project (with photos)

1. Put the photos in `src/assets/images/projects/`, roughly 2400 px wide JPGs (a phone
   photo is fine).
2. In `src/data/images.json`, add one entry per photo with a new `id` (for example
   `proj-10`, `proj-10-a`, `proj-10-b`), the `file` (for example
   `projects/langley-duplex-1.jpg`), a short `alt` description of what the photo shows,
   `"credit": "Surrey Framing"` and `"placeholder": false`.
3. Copy any file in `src/content/projects/`, rename it (the file name becomes the web
   address) and fill in the details. Set `cover` and `gallery` to the new image ids,
   and set `placeholder: false` and `featured: true` to show it on the home page (6 at
   most).

The nine current projects are samples. Replace them with real jobs before launch.

### Replace a stock photo

In `src/data/images.json`, find the entry (the `id` says where it is used, such as
`hero-home` or `svc-roof`). Put your photo in `src/assets/images/projects/`, change
`file` to point at it, update `alt`, and set `placeholder` to `false`. Files left in
`src/assets/images/` are published even if unused, so delete stock photos you no
longer need.

The social share image `public/og-default.jpg` uses the current hero photo. Ask your
developer to regenerate it when the hero photo changes.

### Add a review

Add an entry to `src/data/reviews.json`: name, city, project type, rating (1–5),
text (300 characters at most), date and `"source": "Direct"`. Only publish reviews the
client has written or approved. A review marked `"draft": true` shows only in
`npm run dev` with an "Awaiting approval" tag. Set it to `false` once the client
agrees.

### Post a job

The careers page takes applications by email. To list a job, open the file in
`src/content/jobs/`, edit the details and set `open: true`. Set it back to `false` when
the job is filled. To add a different role, copy one of the files.

## Deploying

The site is designed for Netlify (free tier). The build settings and security headers
are in `netlify.toml`.

1. In Netlify, choose **Add new site → Import an existing project** and pick this GitHub
   repository. The settings fill in from `netlify.toml`. The site deploys to a free
   `https://<name>.netlify.app` address with no further setup.
2. When ready, add the variables below in **Site configuration → Environment
   variables**, then **Deploys → Trigger deploy → Deploy site**. Set them in the
   dashboard only: a value written in `netlify.toml` overrides the dashboard.
3. In **Domain management**, add the custom domain (e.g. `surreyframing.ca`). HTTPS is
   automatic, and Netlify redirects `www` to the main domain.
4. Every push to `main` deploys. Pull requests get a preview link.

After the first deploy, submit `https://<domain>/sitemap-index.xml` in Google Search
Console.

All variables are optional:

| Variable                   | What it is                                               | If not set                        |
| -------------------------- | -------------------------------------------------------- | --------------------------------- |
| `PUBLIC_SITE_URL`          | The live address, e.g. `https://surreyframing.ca`        | The Netlify address is used       |
| `PUBLIC_FORM_ACCESS_KEY`   | Web3Forms key: enter the business email on web3forms.com | Forms ask the visitor to call     |
| `PUBLIC_GA_MEASUREMENT_ID` | Google Analytics ID (`G-…`): Admin → Data streams → Web  | No analytics and no cookie banner |

For local work, copy `.env.example` to `.env` and fill in the same values. Never commit
`.env`. Google Analytics loads only after a visitor clicks "Allow analytics".

## Development

Requires Node.js 22.23 or newer (Netlify uses Node 24) and npm.

| Command           | What it does                                  |
| ----------------- | --------------------------------------------- |
| `npm install`     | Install dependencies                          |
| `npm run dev`     | Start the dev server at http://localhost:4321 |
| `npm run build`   | Build the static site into `dist/`            |
| `npm run preview` | Serve the built site locally                  |
| `npm run check`   | Type-check (`astro check`) and lint (ESLint)  |
| `npm run format`  | Format all files with Prettier                |

The Content Security Policy only runs in a build, so test changes involving scripts,
fonts or third-party services with `npm run build && npm run preview`.

### Where things live

| Path                       | Contents                                                        |
| -------------------------- | --------------------------------------------------------------- |
| `src/config/site.ts`       | Business data (the only place it may appear)                    |
| `src/config/navigation.ts` | Routes and menu links                                           |
| `src/i18n/en.json`         | All interface text and page titles/descriptions                 |
| `src/styles/global.css`    | Design tokens (SRS Section 4)                                   |
| `src/components/`          | Layout, UI, section and form components                         |
| `src/pages/`               | One file per route                                              |
| `src/content/`             | Services, projects, jobs and legal pages (Markdown)             |
| `src/data/`                | Reviews, FAQ, stats, process steps, image manifest              |
| `src/assets/images/`       | Photos (`placeholder/` = stock, `projects/` and `team/` = real) |
| `public/`                  | Favicon, share image and other files served as-is               |
| `originals/`               | Source photos kept for reference; git-ignored, never published  |
