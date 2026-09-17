const fs = require('fs');
const path = require('path');
const { PRODUCTS, VEHICLE_CATEGORIES, SUB_CATEGORIES } = require('../src/data/products.ts');

const modelsConfig = [
  { slug: "911-carrera-4", name: "911 Carrera 4", model: "911", gen: "911-carrera-4" },
  { slug: "911-carrera-s-2011-2014", name: "911 Carrera S 2011–2014", model: "911", gen: "911-carrera-s-2011-2014" },
  { slug: "boxster-2010-2012", name: "Boxster 2010–2012", model: "boxster", gen: "boxster-2010-2012" },
  { slug: "718-boxster-s-2017-2018", name: "718 Boxster S 2017–2018", model: "boxster", gen: "boxster-2017-2018" },
  { slug: "cayenne-2008-2010", name: "Cayenne 2008–2010", model: "cayenne", gen: "cayenne-2008-2010" },
  { slug: "cayenne-2011-2014", name: "Cayenne 2011–2014", model: "cayenne", gen: "cayenne-2011-2014" },
  { slug: "macan", name: "Macan", model: "macan", gen: undefined },
  { slug: "panamera", name: "Panamera", model: "panamera", gen: undefined },
  { slug: "cayman", name: "Cayman", model: "cayman", gen: undefined },
];

const subCats = [
  { id: "facelift", fa: "فیس‌لیفت", en: "Facelift" },
  { id: "accessories", fa: "اکسسوری", en: "Accessories" },
  { id: "parts", fa: "لوازم یدکی و مصرفی", en: "Parts & Consumables" },
];

const publicImagesDir = path.join(__dirname, '../public/images');
const productsDir = path.join(publicImagesDir, 'products');

// 1. Ensure top-level category folders exist
subCats.forEach(sc => {
  const topCatDir = path.join(publicImagesDir, sc.id);
  if (!fs.existsSync(topCatDir)) {
    fs.mkdirSync(topCatDir, { recursive: true });
    fs.writeFileSync(path.join(topCatDir, '.gitkeep'), '');
  }
});

let createdCount = 0;

// 2. Create model-specific folders with facelift, accessories, parts
modelsConfig.forEach(m => {
  const modelBaseDir = path.join(productsDir, m.slug);
  if (!fs.existsSync(modelBaseDir)) {
    fs.mkdirSync(modelBaseDir, { recursive: true });
  }

  subCats.forEach(sc => {
    const targetDir = path.join(modelBaseDir, sc.id);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    createdCount++;

    // Find products belonging to this model and category
    const prods = PRODUCTS.filter(p => {
      const matchModel = p.model === m.model;
      const matchGen = m.gen ? p.generation === m.gen : !p.generation;
      const matchCat = p.category === sc.id;
      return matchModel && matchGen && matchCat;
    });

    // Write a guide inside the folder
    let guideContent = `=====================================================================\n`;
    guideContent += `PORSCHE IRAN | کاتالوگ تصاویر: ${m.name} > ${sc.fa} (${sc.en})\n`;
    guideContent += `مسیر پوشه: public/images/products/${m.slug}/${sc.id}/\n`;
    guideContent += `=====================================================================\n\n`;
    guideContent += `شما می‌توانید تصاویر مربوط به این بخش را در این پوشه قرار دهید.\n`;
    guideContent += `فرمت‌های پشتیبانی شده: .jpg, .jpeg, .png, .webp, .avif\n\n`;
    guideContent += `لیست قطعات این دسته‌بندی و نام پیشنهادی فایل‌ها:\n`;
    guideContent += `---------------------------------------------------------------------\n`;

    prods.forEach((p, idx) => {
      const suggestedSlug = p.id;
      guideContent += `[${idx + 1}] ${p.name}\n`;
      guideContent += `    کد محصول: ${p.id}\n`;
      guideContent += `    نام پیشنهادی فایل: ${suggestedSlug}.jpg  (یا شماره ${idx + 1}.jpg)\n\n`;
    });

    guideContent += `پس از قرار دادن تصاویر، با اجرای دستور npm run sync-images تصاویر به طور خودکار به محصولات متصل می‌شوند.\n`;

    fs.writeFileSync(path.join(targetDir, 'راهنما_و_لیست_قطعات.txt'), guideContent, 'utf-8');
    fs.writeFileSync(path.join(targetDir, '.gitkeep'), '');
  });
});

console.log(`Successfully created/verified ${createdCount} category folders across 9 models!`);
