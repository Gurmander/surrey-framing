# Surrey Framing website

Static marketing site for Surrey Framing, built with Astro, Tailwind CSS and TypeScript.
The project specification, agent instructions and decision log are kept locally in
`doc/` and are not part of this repository.

> This README covers development setup. The owner's editing guide (changing the phone
> number, adding projects, swapping photos, posting jobs, deploying) is written in
> Milestone 6 (SRS FR-70).

## Requirements

- Node.js 22.23 or newer (Netlify uses Node 24)
- npm

## Commands

| Command           | What it does                                  |
| ----------------- | --------------------------------------------- |
| `npm install`     | Install dependencies                          |
| `npm run dev`     | Start the dev server at http://localhost:4321 |
| `npm run build`   | Build the static site into `dist/`            |
| `npm run preview` | Serve the built site locally                  |
| `npm run check`   | Type-check (`astro check`) and lint (ESLint)  |
| `npm run format`  | Format all files with Prettier                |

## Setup

1. Copy `.env.example` to `.env` and fill in the values.
2. Business details (phone, email, address, hours, service areas) are in
   `src/config/site.ts`. Values that are not confirmed yet look like `{{PHONE}}`.
   Before launch, a search for `{{` must return no results outside the docs.

## Where things live

| Path                       | Contents                                                        |
| -------------------------- | --------------------------------------------------------------- |
| `src/config/site.ts`       | Business data (the only place it may appear)                    |
| `src/config/navigation.ts` | Routes and menu links                                           |
| `src/i18n/en.json`         | All interface text and page titles/descriptions                 |
| `src/styles/global.css`    | Design tokens (SRS Section 4)                                   |
| `src/components/`          | Layout, UI and section components                               |
| `src/pages/`               | One file per route                                              |
| `src/content/`             | Services, projects and jobs (one Markdown file each)            |
| `src/data/`                | Reviews, FAQ, stats, process steps, image manifest              |
| `src/assets/images/`       | Photos (`placeholder/` = stock, `projects/` and `team/` = real) |
| `originals/`               | Source photos kept for reference; git-ignored, never published  |

## Images

Pages ask for images by id (for example `hero-home`). `src/data/images.json` maps
each id to a file. To replace a stock photo with a real one:

1. Put the new photo in `src/assets/images/projects/`, about 2400 px wide.
2. In `src/data/images.json`, find the id and change `file` (for example
   `projects/fleetwood-cover.jpg`), update `alt`, and set `placeholder` to `false`.

## Reviews

Reviews live in `src/data/reviews.json`. A review marked `"draft": true` was written for
a client who hasn't approved it yet. It shows in `npm run dev` with an "Awaiting
approval" tag but never on the live site. When the client confirms the wording (or sends
their own), update the text and date and set `"draft": false`. It then goes live.

To show drafts on a preview deploy, set `PUBLIC_SHOW_SAMPLE_CONTENT=true`.
