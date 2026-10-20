# swimparty10km.com

Static site for [SwimParty 10km](https://swimparty10km.com) — open water swimming race, Algarve, Portugal.

Built with [Astro v6](https://astro.build) + [Tailwind CSS v4](https://tailwindcss.com), hosted on GitHub Pages.

---

## Development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # production build → dist/
npm run preview    # preview the build locally
```

---

## Deployment

Push to `main` → GitHub Actions builds the site → GitHub Pages publishes it automatically.

Workflow: `.github/workflows/deploy.yml`
Custom domain configured in: `public/CNAME` (`swimparty10km.com`)

---

## Pages

| Route | File |
|---|---|
| `/` | `src/pages/index.astro` |
| `/race` | `src/pages/race.astro` |
| `/regulations` | `src/pages/regulations.astro` |
| `/plan` | `src/pages/plan.astro` |
| `/team` | `src/pages/team.astro` |
| `/gallery` | `src/pages/gallery.astro` |
| `/faq` | `src/pages/faq.astro` |
| `/contact` | `src/pages/contact.astro` |

---

## Images

All static assets live in `public/` and are served as-is.

```
public/images/
  bg.jpg                  # full-page background (aim for 2500px+ wide)
  logo-white.png          # footer logo
  logo-black.png
  content/                # home page sections
  team/                   # org team
  gallery/
    2024/                 # full-resolution originals — filenames listed in src/pages/gallery.astro
    2025/
    2026/                 # ^ these three stay committed to the repo
                           # (2026-gotit originals live on R2 instead — see below)
  route/                  # route map images (used on race page)
  partners/               # partner logos
```

### Adding gallery photos

1. Drop the `.jpg` files into `public/images/gallery/2026/` (or whichever year/section folder)
2. Add each filename to the matching array in `src/pages/gallery.astro` (`gallery2026`, `gallery2026_gotit`, `gallery2025`, `gallery2024`)
3. Run `npm run thumbnails` (see below) to generate thumbnails for the new photos
4. Run `./scripts/upload-gallery-to-r2.sh` to push thumbnails (and 2026-gotit originals) to R2 — see "Image hosting (R2)" below
5. Commit and push the code changes (NOT the files under `gallery-thumbs/` or `gallery/2026-gotit/` — those aren't meant to be committed, see below)

Photographer credits: add an entry to the `credits` object at the top of `src/pages/gallery.astro` (name, Instagram handle, URL, optional `albumUrl` for a full-album link) to enable the lightbox disclaimer and the Download + copy-credit panel for that section. Currently: `2026` (Paradiso Studio) and `2026-gotit` (gotit.shots).

### Gallery thumbnails

The gallery grid serves small, compressed thumbnails (not the full-resolution originals) to avoid a heavy, jumpy initial page load. These are generated, not hand-created:

```bash
npm run thumbnails   # runs scripts/generate-thumbnails.mjs
```

This resizes every photo under `public/images/gallery/<section>/` to a 640px-max JPEG and writes it to the matching path under `public/images/gallery-thumbs/<section>/`, and writes each thumbnail's real width/height to `src/data/gallery-dimensions.json` (used to set `width`/`height` on the `<img>` tags so the layout doesn't reflow as images load). It skips files that are already up to date, so re-running after adding a few new photos is fast.

The lightbox and the Download button always use the full-resolution original (via a `data-full` attribute), never the compressed thumbnail — no quality is lost when viewing/downloading a photo.

### Image hosting (R2)

Thumbnails (all sections) and the `2026-gotit` full-resolution originals are **not committed to the repo** — they're hosted on Cloudflare R2 and referenced by absolute URL (`R2_BASE` constant at the top of `src/pages/gallery.astro`). `2024`/`2025`/`2026` (Paradiso Studio) full-resolution originals stay committed as before.

- Bucket: `swimparty10km-gallery` (Cloudflare account: `s.zadedyurina@gmail.com`)
- Public URL (R2.dev dev domain, temporary): `https://pub-5a0d7153c5e2423396f5b734133d0bff.r2.dev`
- Upload: `./scripts/upload-gallery-to-r2.sh` (uploads `gallery-thumbs/` + `gallery/2026-gotit/`, requires `npx wrangler login` once per machine)

**TODO (pending):** move to a custom subdomain (`images.swimparty10km.com`) instead of the `r2.dev` URL. This requires adding `swimparty10km.com` as a Cloudflare DNS zone (already done in the dashboard) and changing the domain's nameservers at the registrar (GoDaddy) from GoDaddy's defaults to Cloudflare's — blocked as of this writing because GoDaddy's nameserver field wasn't editable on first attempt (worth checking domain lock / "custom nameservers" toggle). Once the zone is active, bind the custom domain to the bucket in R2 settings and update `R2_BASE` in `gallery.astro` — no other code changes needed.

Since `public/images/gallery-thumbs/` and `public/images/gallery/2026-gotit/` are generated/downloaded rather than committed, a fresh clone needs: `npm run thumbnails` (regenerates thumbnails for whatever originals exist locally) — but note `2026-gotit` originals themselves aren't in git either, so to fully reproduce locally you'd re-download that curated set, or just rely on the R2 copies (the live site doesn't need a local copy at all).

---

## Contact & integrations

| What | Where |
|---|---|
| Contact email | `swimparty10km@gmail.com` |
| Mailchimp list | endpoint in `src/pages/contact.astro` (subscribe form) |
| Registration | [multicrono.com/v1/swim-party-algarve-2026/](https://multicrono.com/v1/swim-party-algarve-2026/) |
| PDF regulations | `public/terms/regulation-en.pdf`, `regulation-pt.pdf` |

---

## DNS (GitHub Pages)

```
A     @     185.199.108.153
A     @     185.199.109.153
A     @     185.199.110.153
A     @     185.199.111.153
CNAME www   datasveta.github.io
```
