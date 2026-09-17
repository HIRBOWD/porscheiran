const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../src/data/products.ts');
const publicDir = path.join(__dirname, '../public');
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
// Extract JSON array
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

    // Read files in folder
    const files = fs.readdirSync(dir).filter(f => {
      const ext = path.extname(f).toLowerCase();
      return imageExts.has(ext);
    });

    if (files.length === 0) return;

    files.forEach(file => {
      const parsed = path.parse(file);
      const baseName = parsed.name.toLowerCase().trim();
      const relativePath = `/images/products/${m.slug}/${sc}/${file}`;

      // 1. Try matching exact product ID
      let target = prods.find(p => p.id.toLowerCase() === baseName);

      // 2. Try matching by index number (e.g., 1.jpg -> prods[0])
      if (!target && /^\d+$/.test(baseName)) {
        const num = parseInt(baseName, 10);
        if (num >= 1 && num <= prods.length) {
          target = prods[num - 1];
        }
      }

      // 3. Try matching Persian name or English subtitle words
      if (!target) {
        target = prods.find(p => {
          const pName = p.name.toLowerCase();
          const pSub = p.subtitle.toLowerCase();
          return pName.includes(baseName) || baseName.includes(pName) || pSub.includes(baseName);
        });
      }

      if (target) {
        if (target.image !== relativePath) {
          target.image = relativePath;
          updatedCount++;
          console.log(`[LINKED] Product "${target.name}" -> ${relativePath}`);
        }
      }
    });
  });
});

if (updatedCount > 0) {
  const newContent = header + JSON.stringify(products, null, 2) + ";\n";
  fs.writeFileSync(productsFilePath, newContent, 'utf-8');
  console.log(`Updated ${updatedCount} product image references in products.ts!`);
} else {
  console.log("Image sync check completed. No new images to link.");
}
