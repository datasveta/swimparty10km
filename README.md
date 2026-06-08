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
  content/
    coast.jpg             # home page sections
    swimming.jpg
    support.jpg
  team/
    mariana.jpg
    svetlana.jpg
    daniela.jpg
  gallery/
    2024/                 # filenames listed in src/pages/gallery.astro
    2025/
  route/                  # route map images (used on race page)
  partners/               # partner logos
```

### Adding gallery photos

1. Drop the `.jpg` files into `public/images/gallery/2025/` (or `2024/`)
2. Add each filename to the `gallery2025` (or `gallery2024`) array in `src/pages/gallery.astro`
3. Commit and push — the gallery and lightbox update automatically

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
