// scripts/export-pages.mjs
import sharp from "sharp";
import {globby} from "globby";
import pLimit from "p-limit";
import {basename, extname, join} from "node:path";
import {mkdir, writeFile} from "node:fs/promises";

const SRC = "masters";                        // your 400-dpi TIFFs
const OUT = "public/books/thailand-adventure/pages";      // Angular assets path
const sizes = [
  {suffix: "-1600", width: 1600},
  {suffix: "-2600", width: 2600},
];

const limit = pLimit(4); // parallelism
await mkdir(OUT, {recursive: true});

const files = await globby(["**/*.tif", "**/*.tiff"], {cwd: SRC, absolute: true});

const tasks = [];

for (const file of files) {
  const base = basename(file, extname(file)); // e.g., 0001

  for (const {suffix, width} of sizes) {
    // Build the base pipeline once per size
    const basePipe = sharp(file, {unlimited: true})
      .greyscale() // remove if you prefer to keep RGB
      .resize({width, withoutEnlargement: true});

    // Wrap the work in a limited-concurrency promise and push the promise
    tasks.push(
      limit(async () => {
        const [avif, webp, jpeg] = await Promise.all([
          basePipe.clone().avif({quality: 50, effort: 6}).toBuffer(),
          basePipe.clone().webp({quality: 78}).toBuffer(),
          basePipe.clone().jpeg({quality: 82, mozjpeg: true}).toBuffer(),
        ]);

        await Promise.all([
          writeFile(join(OUT, `${base}${suffix}.avif`), avif),
          writeFile(join(OUT, `${base}${suffix}.webp`), webp),
          writeFile(join(OUT, `${base}${suffix}.jpg`), jpeg),
        ]);
      })
    );
  }
}

// ⬇️ Await the promises directly (no extra function call)
await Promise.all(tasks);

console.log(`Done: ${files.length} pages × ${sizes.length} sizes × 3 formats.`);
