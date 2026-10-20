// Generates small/compressed thumbnails for the photo gallery so the grid
// doesn't have to load full-resolution originals (300KB-3MB each) just to
// show a preview. Also records each thumbnail's actual output width/height
// so gallery.astro can set <img width height> and avoid layout shift.
//
// Re-run any time new photos are added (npm run thumbnails) -- existing
// up-to-date thumbnails are skipped, so it's fast on repeat runs.

import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const srcRoot = path.join(root, 'public/images/gallery');
const outRoot = path.join(root, 'public/images/gallery-thumbs');
const dimsPath = path.join(root, 'src/data/gallery-dimensions.json');

const years = ['2024', '2025', '2026', '2026-gotit'];
const THUMB_MAX = 640;

fs.mkdirSync(path.dirname(dimsPath), { recursive: true });

const dims = fs.existsSync(dimsPath)
  ? JSON.parse(fs.readFileSync(dimsPath, 'utf8'))
  : {};

let totalSrcBytes = 0;
let totalThumbBytes = 0;
const perYear = {};

for (const year of years) {
  const srcDir = path.join(srcRoot, year);
  const outDir = path.join(outRoot, year);
  if (!fs.existsSync(srcDir)) continue;
  fs.mkdirSync(outDir, { recursive: true });

  const files = fs.readdirSync(srcDir).filter(f => /\.(jpe?g|png)$/i.test(f));
  perYear[year] = { count: 0, srcBytes: 0, thumbBytes: 0, generated: 0, skipped: 0 };

  for (const file of files) {
    const srcPath = path.join(srcDir, file);
    const outPath = path.join(outDir, file);
    const key = `${year}/${file}`;

    const srcStat = fs.statSync(srcPath);
    perYear[year].count++;
    perYear[year].srcBytes += srcStat.size;
    totalSrcBytes += srcStat.size;

    const upToDate =
      fs.existsSync(outPath) &&
      fs.statSync(outPath).mtimeMs >= srcStat.mtimeMs &&
      dims[key];

    if (upToDate) {
      perYear[year].skipped++;
      perYear[year].thumbBytes += fs.statSync(outPath).size;
      totalThumbBytes += fs.statSync(outPath).size;
      continue;
    }

    const info = await sharp(srcPath)
      .rotate() // respect EXIF orientation before resizing
      .resize({ width: THUMB_MAX, height: THUMB_MAX, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 72, mozjpeg: true })
      .toFile(outPath);

    dims[key] = { w: info.width, h: info.height };
    perYear[year].generated++;
    perYear[year].thumbBytes += info.size;
    totalThumbBytes += info.size;
  }
}

fs.writeFileSync(dimsPath, JSON.stringify(dims, null, 2));

console.log('\nThumbnail pipeline summary\n' + '-'.repeat(40));
for (const [year, s] of Object.entries(perYear)) {
  const fmt = n => (n / 1024 / 1024).toFixed(1) + 'MB';
  console.log(
    `${year}: ${s.count} photos | generated ${s.generated}, skipped ${s.skipped} | ` +
    `${fmt(s.srcBytes)} -> ${fmt(s.thumbBytes)}`
  );
}
const fmt = n => (n / 1024 / 1024).toFixed(1) + 'MB';
console.log('-'.repeat(40));
console.log(`TOTAL: ${fmt(totalSrcBytes)} -> ${fmt(totalThumbBytes)} ` +
  `(${(100 - (totalThumbBytes / totalSrcBytes) * 100).toFixed(0)}% smaller)`);
console.log(`Dimensions map written to ${path.relative(root, dimsPath)}`);
