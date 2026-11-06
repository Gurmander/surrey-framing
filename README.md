# Surrey Framing website

Static marketing site for Surrey Framing, built with Astro, Tailwind CSS and TypeScript.
The full specification is in [SRS.md](SRS.md). Build decisions are in
[DECISIONS.md](DECISIONS.md).

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

| Path                       | Contents                                        |
| -------------------------- | ----------------------------------------------- |
| `src/config/site.ts`       | Business data (the only place it may appear)    |
| `src/config/navigation.ts` | Routes and menu links                           |
| `src/i18n/en.json`         | All interface text and page titles/descriptions |
| `src/styles/global.css`    | Design tokens (SRS Section 4)                   |
| `src/components/`          | Layout, UI and section components               |
| `src/pages/`               | One file per route                              |
