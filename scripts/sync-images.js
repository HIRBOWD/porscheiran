const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../src/data/products.ts');
const productsDir = path.join(__dirname, '../public/images/products');
const imageExts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg']);

// Read products
const fileContent = fs.readFileSync(productsFilePath, 'utf-8');
const marker = 'export const PRODUCTS: Product[] = ';
const idx = fileContent.indexOf(marker);
if (idx === -1) {
  console.error("Marker not found in products.ts");
  process.exit(1);
}

const header = fileContent.substring(0, idx + marker.length);
const rawJson = fileContent.substring(idx + marker.length).trim().replace(/;$/, '');
let products = JSON.parse(rawJson);

const modelsConfig = [
  { slug: "911-carrera-4", model: "911", gen: "911-carrera-4" },
  { slug: "911-carrera-s-2011-2014", model: "911", gen: "911-carrera-s-2011-2014" },
  { slug: "boxster-2010-2012", model: "boxster", gen: "boxster-2010-2012" },
  { slug: "718-boxster-s-2017-2018", model: "boxster", gen: "boxster-2017-2018" },
  { slug: "cayenne-2008-2010", model: "cayenne", gen: "cayenne-2008-2010" },
  { slug: "cayenne-2011-2014", model: "cayenne", gen: "cayenne-2011-2014" },
  { slug: "macan", model: "macan", gen: undefined },
  { slug: "panamera", model: "panamera", gen: undefined },
  { slug: "cayman", model: "cayman", gen: undefined },
];

const subCats = ["facelift", "accessories", "parts"];

let updatedCount = 0;

modelsConfig.forEach(m => {
  subCats.forEach(sc => {
    const dir = path.join(productsDir, m.slug, sc);
    if (!fs.existsSync(dir)) return;

    // Filter products for this model & subcat
    const prods = products.filter(p => {
      const matchModel = p.model === m.model;
      const matchGen = m.gen ? p.generation === m.gen : !p.generation;
      const matchCat = p.category === sc;
      return matchModel && matchGen && matchCat;
    });

    // Read all files in folder
    let rawFiles = fs.readdirSync(dir);

    // Normalize any files with leading/trailing spaces or double extensions
    rawFiles.forEach(f => {
      let cleaned = f.trim();
      cleaned = cleaned.replace(/\.(jpg|jpeg|png|webp|avif)\s+\.(jpg|jpeg|png|webp|avif)$/i, '.$1');
      cleaned = cleaned.replace(/\.(jpg|jpeg|png|webp|avif)\.(jpg|jpeg|png|webp|avif)$/i, '.$1');
      if (cleaned !== f) {
        const oldPath = path.join(dir, f);
        const newPath = path.join(dir, cleaned);
        try {
          fs.renameSync(oldPath, newPath);
          console.log(`[CLEANUP] Renamed "${f}" -> "${cleaned}"`);
        } catch (err) {
          console.error("Rename error:", err);
        }
      }
    });

    // Re-read files after trim
    const files = fs.readdirSync(dir).filter(f => {
      const ext = path.extname(f).toLowerCase();
      return imageExts.has(ext);
    });

    if (files.length === 0) return;

    files.forEach(file => {
      const parsed = path.parse(file);
      const baseName = parsed.name.toLowerCase().trim();
      const relativePath = `/images/products/${m.slug}/${sc}/${file}`;

      let target = null;
      let normalizedBase = baseName;
      if (normalizedBase.startsWith("anamera-")) normalizedBase = "p" + normalizedBase;

      // 1. Exact product ID match
      target = prods.find(p => p.id.toLowerCase() === normalizedBase);

      // 2. Exact integer (e.g. 1.jpg, 01.jpg)
      if (!target && /^\d+$/.test(normalizedBase)) {
        const num = parseInt(normalizedBase, 10);
        if (num >= 1 && num <= prods.length) {
          target = prods[num - 1];
        }
      }

      // 3. Category prefix with number (e.g. accessories-1, accessories-01, accessories_1, acc-1, facelift-2, parts-3)
      if (!target) {
        const numMatch = normalizedBase.match(/(?:facelift|accessories|accessory|parts|part)[-_ ]*(\d+)/i);
        if (numMatch) {
          const num = parseInt(numMatch[1], 10);
          if (num >= 1 && num <= prods.length) {
            target = prods[num - 1];
          }
        }
      }

      // 4. Any standalone trailing number (e.g. item-1, p-1, c4-acc-1)
      if (!target) {
        const trailingMatch = normalizedBase.match(/[-_ ](\d+)$/);
        if (trailingMatch) {
          const num = parseInt(trailingMatch[1], 10);
          if (num >= 1 && num <= prods.length) {
            target = prods[num - 1];
          }
        }
      }

      // 5. Phonetic / Fingilish aliases
      if (!target) {
        const fingilishMap = [
          { keys: ["komak", "strut"], test: (p) => p.name.includes("کمک") },
          { keys: ["motorfan"], test: (p) => p.name.includes("موتور فن") },
          { keys: ["oringvasher", "oring", "vasher"], test: (p) => p.name.includes("اورینگ") },
          { keys: ["polgard", "gardan"], test: (p) => p.name.includes("پل گاردان") },
          { keys: ["pumphed", "pump"], test: (p) => p.name.includes("پمپ هیدرولیک") },
          { keys: ["radiat"], test: (p) => p.name.includes("رادیاتور آب") },
          { keys: ["sahme", "sham"], test: (p) => p.name.includes("شمع") },
          { keys: ["shelng", "shilang"], test: (p) => p.name.includes("شلنگ") },
          { keys: ["tasme", "harzgard"], test: (p) => p.name.includes("تسمه") || p.name.includes("هرزگرد") },
          { keys: ["unit", "ecu"], test: (p) => p.name.includes("یونیت") },
          { keys: ["zirbandi"], test: (p) => p.name.includes("زیربندی") },
          { keys: ["cooler", "khenak"], test: (p) => p.name.includes("خنک کن") },
          { keys: ["daste"], test: (p) => p.name.includes("دسته موتور") },
          { keys: ["safi", "kartel"], test: (p) => p.name.includes("صافی") || p.name.includes("کارتل") },
          { keys: ["kompresor", "compressor"], test: (p) => p.name.includes("کمپرسور کولر") },
          { keys: ["servis"], test: (p) => p.name.includes("سرویس دوره ای") },
        ];

        for (const entry of fingilishMap) {
          if (entry.keys.some(k => normalizedBase.includes(k))) {
            target = prods.find(entry.test);
            if (target) break;
          }
        }
      }

      // 6. Persian name match or English subtitle match
      if (!target) {
        target = prods.find(p => {
          const pName = p.name.toLowerCase();
          const pSub = p.subtitle.toLowerCase();
          return pName.includes(normalizedBase) || normalizedBase.includes(pName) || pSub.includes(normalizedBase);
        });
      }

      if (target) {
        if (target.image !== relativePath) {
          target.image = relativePath;
          updatedCount++;
          console.log(`[LINKED] [${m.slug} > ${sc}] "${target.name}" -> ${relativePath}`);
        }
      }
    });
  });
});

// 6. Safety check: ensure all product image files exist on disk, fallback to crest if deleted
const publicDir = path.join(__dirname, '../public');
products.forEach(p => {
  const fullPath = path.join(publicDir, p.image);
  if (!fs.existsSync(fullPath)) {
    if (p.image !== "/images/porsche-iran-crest.png") {
      console.log(`[FALLBACK] Missing "${p.name}" (${p.image}) -> reverted to Porsche Crest`);
      p.image = "/images/porsche-iran-crest.png";
      updatedCount++;
    }
  }
});

if (updatedCount > 0) {
  const newContent = header + JSON.stringify(products, null, 2) + ";\n";
  fs.writeFileSync(productsFilePath, newContent, 'utf-8');
  console.log(`\nSUCCESS: Updated ${updatedCount} product image references in products.ts!`);
} else {
  console.log("\nImage sync check completed. All present images are already linked.");
}
