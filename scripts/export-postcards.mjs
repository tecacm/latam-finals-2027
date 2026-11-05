// Renders every art/*.svg postcard to responsive WebP files in public/postcards/.
// Keep WIDTHS in sync with POSTCARD_WIDTHS in src/lib/postcardAssets.ts.
import { mkdir, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const artDir = path.join(root, 'art');
const outDir = path.join(root, 'public', 'postcards');
const WIDTHS = [800, 1600];
const QUALITY = 82;

async function exportPostcard(file) {
  const id = path.basename(file, '.svg');
  const svg = await readFile(path.join(artDir, file));
  const { width: baseWidth } = await sharp(svg).metadata();
  if (!baseWidth) throw new Error(`${file}: could not read the SVG width`);

  for (const width of WIDTHS) {
    // Rasterize at a density high enough that we only ever scale down.
    const density = Math.max(72, Math.ceil((72 * width) / baseWidth));
    const outFile = path.join(outDir, `${id}-${width}.webp`);
    const info = await sharp(svg, { density })
      .resize({ width })
      .webp({ quality: QUALITY })
      .toFile(outFile);
    console.log(`${path.relative(root, outFile)}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
  }
}

const files = (await readdir(artDir)).filter((f) => f.endsWith('.svg')).sort();
if (files.length === 0) throw new Error(`No SVG postcards found in ${artDir}`);
await mkdir(outDir, { recursive: true });
for (const file of files) {
  await exportPostcard(file);
}
