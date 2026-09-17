const fs = require('fs');

const rawCatalog = [
  // 1. 911 Carrera 4
  {
    model: "911",
    modelLabel: "911",
    generation: "911-carrera-4",
    generationLabel: "911 Carrera 4",
    compat: "Porsche 911 Carrera 4",
    facelift: [
      "چراغ ماتریکس",
      "سیستم پخش جدید",
      "فرمان جدید",
      "فیس GT3",
      "فیس جلو",
      "فیس عقب کامل"
    ],
    accessories: [
      "پدل شیفتر",
      "پرده بادگیر",
      "جاسوئیچی",
      "قاب ریموت",
      "قاب سر دنده کربن",
      "کاپ رینگ",
      "کف پایی موکتی و لاستیکی"
    ],
    parts: [
      "پمپ هیدرولیک",
      "خنک کن روغن گیربکس و موتور",
      "دسته موتور و گیربکس",
      "رادیاتور آب",
      "ست کامل اورینگ ها و واشر های موتور",
      "سیستم پخش جدید",
      "شلنگ ها",
      "شمع ها",
      "صافی (کارتل) گیربکس مخصوص ماشین پورشه",
      "کمپرسور کولر",
      "کیت تعمیرات زیربندی",
      "موتور فن",
      "هرزگرد ها و تسمه",
      "یونیت ها"
    ]
  },

  // 2. 911 Carrera S 2011–2014
  {
    model: "911",
    modelLabel: "911",
    generation: "911-carrera-s-2011-2014",
    generationLabel: "911 Carrera S 2011–2014",
    compat: "Porsche 911 Carrera S (2011–2014)",
    facelift: [
      "تبدیل کیت کامل RS GT2",
      "چراغ جلو جدید",
      "فرمان جدید",
      "فیس جلو GT3",
      "فیس عقب GT3",
      "فیس عقب به ۲۰۱۹",
      "کاپوت کربن",
      "کربن های بدنه"
    ],
    accessories: [
      "پدل شیفتر",
      "تریم داخلی کربن",
      "جاسوئیچی",
      "قاب ریموت",
      "قاب سر دنده کربن",
      "کاپ رینگ",
      "کف پایی موکتی و لاستیکی"
    ],
    parts: [
      "پمپ هیدرولیک",
      "خنک کن روغن گیربکس و موتور",
      "دسته موتور و گیربکس",
      "رادیاتور آب",
      "ست کامل اورینگ ها و واشر های موتور",
      "شلنگ ها",
      "شمع ها",
      "صافی (کارتل) گیربکس مخصوص ماشین پورشه",
      "کمپرسور کولر",
      "کیت تعمیرات زیربندی",
      "موتور فن",
      "هرزگرد ها و تسمه",
      "یونیت ها"
    ]
  },

  // 3. Boxster 2010–2012
  {
    model: "boxster",
    modelLabel: "Boxster",
    generation: "boxster-2010-2012",
    generationLabel: "Boxster 2010–2012",
    compat: "Porsche Boxster (2010–2012)",
    facelift: [
      "چراغ طرح 718",
      "سیستم پخش جدید (نسخه اصلی پورشه با Apple CarPlay)",
      "سیستم پخش جدید (نسخه Android با Apple CarPlay)",
      "فرمان جدید",
      "کیت GT4"
    ],
    accessories: [
      "پدل شیفتر",
      "جاسوئیچی",
      "قاب ریموت",
      "قاب سر دنده کربن",
      "کاپ رینگ",
      "کف پایی موکتی و لاستیکی"
    ],
    parts: [
      "پمپ هیدرولیک",
      "خنک کن روغن گیربکس و موتور",
      "دسته موتور و گیربکس",
      "رادیاتور آب",
      "ست کامل اورینگ ها و واشر های موتور",
      "شلنگ ها",
      "شمع ها",
      "صافی (کارتل) گیربکس مخصوص ماشین پورشه",
      "کمپرسور کولر",
      "کیت تعمیرات زیربندی",
      "موتور فن",
      "هرزگرد ها و تسمه",
      "یونیت ها"
    ]
  },

  // 4. 718 Boxster S 2017–2018
  {
    model: "boxster",
    modelLabel: "Boxster",
    generation: "boxster-2017-2018",
    generationLabel: "718 Boxster S 2017–2018",
    compat: "Porsche 718 Boxster S (2017–2018)",
    facelift: [
      "اسپورت دیزاین پکیج",
      "چراغ PDLS Plus",
      "چراغ وسط",
      "فرمان جدید",
      "فرمان کربن ویل دار",
      "فیس GT4",
      "کیت کربن بدنه",
      "قطعات کربن بیرون بدنه",
      "کیلومتر دیجیتال"
    ],
    accessories: [
      "پدل شیفتر",
      "تریم داخلی کربن",
      "جاسوئیچی",
      "قاب ریموت",
      "قاب سر دنده کربن",
      "کاپ رینگ",
      "کف پایی موکتی و لاستیکی",
      "کورنوگراف"
    ],
    parts: [
      "خنک کن روغن گیربکس و موتور",
      "دسته موتور و گیربکس",
      "رادیاتور آب",
      "ست کامل اورینگ ها و واشر های موتور",
      "سرویس دوره ای",
      "شلنگ ها",
      "شمع ها",
      "صافی (کارتل) گیربکس مخصوص ماشین پورشه",
      "کمپرسور کولر",
      "کیت تعمیرات زیربندی",
      "موتور فن",
      "هرزگرد ها و تسمه",
      "یونیت ها"
    ]
  },

  // 5. Cayenne 2008–2010
  {
    model: "cayenne",
    modelLabel: "Cayenne",
    generation: "cayenne-2008-2010",
    generationLabel: "Cayenne 2008–2010",
    compat: "Porsche Cayenne (2008–2010)",
    facelift: [
      "چراغ PDLS Plus",
      "سیستم پخش جدید",
      "فیس جلو"
    ],
    accessories: [
      "جاسوئیچی",
      "قاب ریموت",
      "کاپ رینگ",
      "کف پایی موکتی و لاستیکی"
    ],
    parts: [
      "پل گاردان",
      "پمپ هیدرولیک",
      "خنک کن روغن گیربکس و موتور",
      "دسته موتور و گیربکس",
      "رادیاتور آب",
      "ست کامل اورینگ ها و واشر های موتور",
      "سرویس دوره ای کاین",
      "شلنگ ها",
      "شمع ها",
      "صافی (کارتل) گیربکس مخصوص ماشین پورشه",
      "کمپرسور کولر",
      "کیت تعمیرات زیربندی",
      "موتور فن",
      "هرزگرد ها و تسمه",
      "یونیت ها"
    ]
  },

  // 6. Cayenne 2011–2014
  {
    model: "cayenne",
    modelLabel: "Cayenne",
    generation: "cayenne-2011-2014",
    generationLabel: "Cayenne 2011–2014",
    compat: "Porsche Cayenne (2011–2014)",
    facelift: [
      "بال عقب GTS",
      "پنل تاچ وسط",
      "چراغ 3D Matrix",
      "چراغ جلو PDLS PLUS",
      "چراغ عقب LED",
      "سیستم پخش جدید",
      "فرمان جدید",
      "فیس پشت آمپر فول دیجیتال",
      "فیس جلو کاین کامل",
      "فیس داخل کامل",
      "فیس عقب کامل کاین",
      "کیت GTS"
    ],
    accessories: [
      "پدل شیفتر",
      "پرده طاقچه عقب",
      "تریم داخلی با نورپردازی",
      "جاسوئیچی",
      "رکاب",
      "روف ریل",
      "سر اگزوزها",
      "قاب ریموت",
      "کاپ رینگ",
      "کف پایی موکتی و لاستیکی",
      "کورنوگراف",
      "کیت کامل زاپاس",
      "کیت کربن تریم داخل کاین",
      "کیت کربن قسمت خارجی بدنه",
      "لوگو پا دری"
    ],
    parts: [
      "پل گاردان",
      "پمپ هیدرولیک",
      "خنک کن روغن گیربکس و موتور",
      "دسته موتور و گیربکس",
      "رادیاتور آب",
      "ست کامل اورینگ ها و واشر های موتور",
      "سرویس دوره ای کاین",
      "شلنگ ها",
      "شمع ها",
      "صافی (کارتل) گیربکس مخصوص ماشین پورشه",
      "کمپرسور کولر",
      "کمک ها",
      "کیت تعمیرات زیربندی",
      "موتور فن",
      "هرزگرد ها و تسمه",
      "یونیت ها"
    ]
  },

  // 7. Macan
  {
    model: "macan",
    modelLabel: "Macan",
    generation: undefined,
    generationLabel: undefined,
    compat: "Porsche Macan (All Models)",
    facelift: [
      "آپشن ها",
      "پنل فول تاچ",
      "چراغ Pdls Plus",
      "چراغ جلو 3D Matrix",
      "سیستم پخش جدید",
      "فرمان جدید",
      "فیس جلو",
      "فیس دمپر کولر ها",
      "فیس عقب",
      "کیلومتر دیجیتال"
    ],
    accessories: [
      "آینه دو شاخ",
      "پدل شیفتر",
      "تریم داخلی کربن",
      "جاسوئیچی",
      "رکاب ها",
      "قاب ریموت",
      "قاب سر دنده کربن",
      "کاپ رینگ",
      "کربن پا دری",
      "کربن روی درب ها",
      "کف پایی موکتی و لاستیکی",
      "کیت کربن قسمت خارجی بدنه",
      "نورپردازی تریم داخلی"
    ],
    parts: [
      "خنک کن روغن گیربکس و موتور",
      "دسته موتور و گیربکس",
      "رادیاتور آب",
      "ست کامل اورینگ ها و واشر های موتور",
      "سرویس دوره ای",
      "شلنگ ها",
      "شمع ها",
      "صافی (کارتل) گیربکس مخصوص ماشین پورشه",
      "کمپرسور کولر",
      "کمک ها",
      "کیت تعمیرات زیربندی",
      "موتور فن",
      "هرزگرد ها و تسمه",
      "یونیت ها"
    ]
  },

  // 8. Panamera
  {
    model: "panamera",
    modelLabel: "Panamera",
    generation: undefined,
    generationLabel: undefined,
    compat: "Porsche Panamera (All Models)",
    facelift: [
      "تبدیل به فیس توربویی ۲۰۱۵",
      "فقط فیس سپر",
      "فیس پشت آمپر فول دیجیتال",
      "فیس چراغ توربویی ۲۰۱۲",
      "فیس چراغ جدید جلو و عقب",
      "فیس سپر جلو به مدل توربویی یا GTS ای",
      "فیس لیفت جلوی پانامرا",
      "فیس لیفت کامل عقب به ۲۰۲۴",
      "کیت تبدیل فیس سیستم پخش به ۲۰۲۰"
    ],
    accessories: [
      "اگزوز ها",
      "پدل شیفتر",
      "جاسوئیچی",
      "ست کربن بدنه",
      "فرمان جدید",
      "قاب ریموت",
      "قاب سر دنده کربن",
      "کاپ رینگ",
      "کف پایی موکتی و لاستیکی",
      "کیت تریم داخلی کربن",
      "کیت کامل زاپاس",
      "کیت کورنوگراف یا تغییر رنگ آن"
    ],
    parts: [
      "پل گاردان",
      "پمپ هیدرولیک",
      "خنک کن روغن گیربکس و موتور",
      "دسته موتور و گیربکس",
      "رادیاتور آب",
      "ست کامل اورینگ ها و واشر های موتور",
      "سرویس دوره ای",
      "شلنگ ها",
      "شمع ها",
      "صافی (کارتل) گیربکس مخصوص ماشین پورشه",
      "کمپرسور کولر",
      "کمک ها",
      "کیت تعمیرات زیربندی",
      "موتور فن",
      "هرزگرد ها و تسمه",
      "یونیت ها"
    ]
  },

  // 9. Cayman
  {
    model: "cayman",
    modelLabel: "Cayman",
    generation: undefined,
    generationLabel: undefined,
    compat: "Porsche Cayman (All Models)",
    facelift: [
      "چراغ طرح 718",
      "سیستم پخش جدید (نسخه اصلی پورشه با Apple CarPlay)",
      "سیستم پخش جدید (نسخه Android با Apple CarPlay و حافظه داخلی)",
      "فرمان جدید",
      "کیت GT4"
    ],
    accessories: [
      "پدل شیفتر",
      "جاسوئیچی",
      "قاب ریموت",
      "قاب سر دنده کربن",
      "کاپ رینگ",
      "کف پایی موکتی و لاستیکی"
    ],
    parts: [
      "پمپ هیدرولیک",
      "خنک کن روغن گیربکس و موتور",
      "دسته موتور و گیربکس",
      "رادیاتور آب",
      "ست کامل اورینگ ها و واشر های موتور",
      "شلنگ ها",
      "شمع ها",
      "صافی (کارتل) گیربکس",
      "کمپرسور کولر",
      "کیت تعمیرات زیربندی",
      "موتور فن",
      "هرزگرد ها و تسمه",
      "یونیت ها"
    ]
  }
];

// Helper to determine meta details for each product name
function getProductMeta(itemFa, catId, section) {
  const modelName = section.generationLabel || section.modelLabel;
  let enTitle = "";
  let image = "/images/porsche-iran-crest.png";
  let badge = "Genuine OEM";
  let price = 500;
  let desc = `قطعه اصلی و استاندارد پورشه ${modelName} با ضمانت بالاترین سطح کیفیت و تطابق فابریک کارخانه.`;
  let features = [
    `طراحی اختصاصی مهندسی پورشه برای ${modelName}`,
    "تطابق ۱۰۰٪ فابریک و اتصال Plug & Play بدون سیم‌کشی اضافه",
    "تست شده تحت سخت‌ترین استانداردهای کیفی اشتوتگارت",
    "گارانتی سلامت و ضمانت اصالت فیزیکی قطعه"
  ];
  let materials = "OEM High-Grade Porsche Automotive Material";

  // Image & Category mappings
  if (itemFa.includes("جاسوئیچی")) {
    enTitle = `Porsche Crest Leather Keyring - ${modelName}`;
    image = "/images/products/key-pouch.jpg";
    badge = "Tequipment";
    price = 160;
    desc = `جاسوئیچی چرم طبیعی دست‌دوز با نشان کریست برجسته پورشه ویژه مدل ${modelName}.`;
    materials = "Genuine Nappa Leather, Solid Metal Crest";
  } else if (itemFa.includes("قاب ریموت")) {
    enTitle = `Key Fob Side Casing Covers - ${modelName}`;
    image = "/images/products/key-pouch.jpg";
    badge = "Tequipment";
    price = 195;
    desc = `قاب ریموت کلید پورشه با رنگ اختصاصی بدنه و فینیش ضدخش برای ${modelName}.`;
    materials = "High-Gloss Automotive Polycarbonate";
  } else if (itemFa.includes("کاپ رینگ")) {
    enTitle = `Wheel Center Crest Caps - ${modelName}`;
    image = "/images/products/rim-clock.jpg";
    badge = "Exclusive";
    price = 280;
    desc = `کاپ رینگ چهار عددی با نشان رنگی اختصاصی پورشه متناسب با تمامی رینگ‌های ${modelName}.`;
    materials = "Lightweight Cast Alloy with Enamel Crest";
  } else if (itemFa.includes("کورنوگراف")) {
    enTitle = `Sport Chrono Instrument Clock - ${modelName}`;
    image = "/images/products/chronograph.jpg";
    badge = "Sport Chrono";
    price = 1450;
    desc = `ساعت و کرونوگراف عقربه‌ای داشبورد پکیج اسپورت کرونو با نورپردازی هماهنگ برای ${modelName}.`;
    materials = "Sapphire-coated glass, Precision Stepper Mechanism";
  } else if (itemFa.includes("روف ریل") || itemFa.includes("پرده طاقچه")) {
    enTitle = `Cargo & Aerodynamic System - ${modelName}`;
    image = "/images/products/roof-box.jpg";
    badge = "Tequipment";
    price = 780;
    materials = "Reinforced Aluminum & Automotive Composites";
  } else if (itemFa.includes("پدل شیفتر")) {
    enTitle = `Sport Shift Paddles - ${modelName}`;
    badge = "Interior";
    price = 420;
    materials = "CNC Billet Aluminum / Dry Carbon Fiber";
  } else if (itemFa.includes("کف پایی")) {
    enTitle = `All-Weather Floor Mats Set - ${modelName}`;
    badge = "Tequipment";
    price = 320;
    materials = "Dual-layer Velour Carpet & High-Density Rubber";
  } else if (itemFa.includes("فرمان")) {
    enTitle = `New Generation Sport Steering Wheel - ${modelName}`;
    badge = "Custom Craft";
    price = 2600;
    desc = `فرمان ارگونومیک جدید پورشه با کلیدهای مولتی‌فانکشن و کنترل‌های مدرن برای ${modelName}.`;
    materials = "Nappa Leather, Brushed Metal, Carbon Accents";
  } else if (itemFa.includes("چراغ") || itemFa.includes("ماتریکس") || itemFa.includes("PDLS")) {
    enTitle = `Advanced Matrix / PDLS+ LED Lighting - ${modelName}`;
    badge = "Lighting";
    price = 3800;
    desc = `مجموعه چراغ‌های نسل جدید با لنز ماتریکس، دی‌لایت ۴ نقطه‌ای اختصاصی و نورافشانی دینامیک.`;
    materials = "Polycarbonate UV-hardened Lens, Cast Aluminum Heat Sink";
  } else if (itemFa.includes("سیستم پخش")) {
    enTitle = `High-End Touch Infotainment System - ${modelName}`;
    badge = "Tech Retrofit";
    price = 2100;
    desc = `سیستم مالتی‌مدیا و پخش مانیتور لمسی با پشتیبانی کامل از Apple CarPlay، مسیریابی و کنترل صوتی.`;
    materials = "IPS Anti-Glare Glass Panel, Automotive Audio Processor";
  } else if (itemFa.includes("فیس") || itemFa.includes("کیت") || itemFa.includes("تبدیل") || itemFa.includes("اسپورت دیزاین")) {
    enTitle = `Aerodynamic Exterior Facelift Body Kit - ${modelName}`;
    badge = "Aerokit";
    price = 5400;
    desc = `پکیج کامل فیس‌لیفت و ارتقای بدنه مطابق استانداردهای آیرودینامیک پورشه برای ${modelName}.`;
    materials = "OEM Polyurethane RIM / Carbon Composite";
  } else if (itemFa.includes("کربن")) {
    enTitle = `Carbon Fiber Performance Component - ${modelName}`;
    badge = "Lightweight";
    price = 1850;
    materials = "Autoclave Pre-preg Toray Carbon Fiber";
  } else if (itemFa.includes("صافی (کارتل)")) {
    enTitle = `PDK Transmission Filter & Sump Pan - ${modelName}`;
    badge = "Service Kit";
    price = 450;
    materials = "OEM High-Temp PA66-GF30 Composite, Neodymium Magnets";
  } else if (itemFa.includes("شمع")) {
    enTitle = `High-Performance Spark Plugs Set - ${modelName}`;
    badge = "Service Parts";
    price = 180;
    materials = "Double Iridium / Platinum Core";
  } else if (itemFa.includes("رادیاتور") || itemFa.includes("خنک کن")) {
    enTitle = `High-Efficiency Cooling Radiator - ${modelName}`;
    badge = "Cooling System";
    price = 980;
    materials = "Brazed Aluminum Tube & Fin Core";
  } else if (itemFa.includes("پمپ هیدرولیک")) {
    enTitle = `Hydraulic Power Steering Pump - ${modelName}`;
    badge = "Steering OEM";
    price = 850;
    materials = "Cast Aluminum Housing, Hardened Steel Impeller";
  } else if (itemFa.includes("کمپرسور کولر")) {
    enTitle = `A/C Refrigerant Compressor Unit - ${modelName}`;
    badge = "Climate";
    price = 1250;
    materials = "Precision Variable Displacement Aluminum Assembly";
  } else if (itemFa.includes("کمک ها")) {
    enTitle = `Air Suspension Strut Dampers - ${modelName}`;
    badge = "PASM Chassis";
    price = 2400;
    materials = "Multi-chamber Pneumatic Bellows & Electronic Damping Valve";
  } else if (itemFa.includes("پل گاردان")) {
    enTitle = `Cardan Propshaft & Center Support - ${modelName}`;
    badge = "Drivetrain";
    price = 1100;
    materials = "High-Tensile Dynamic Balanced Steel";
  } else if (itemFa.includes("سرویس دوره ای")) {
    enTitle = `Periodic Maintenance Service Package - ${modelName}`;
    badge = "Maintenance";
    price = 620;
    materials = "OEM Porsche Certified Engine Oil, Air/Cabin/Oil Filters";
  } else if (itemFa.includes("کیلومتر دیجیتال") || itemFa.includes("پشت آمپر")) {
    enTitle = `Full Digital Virtual Cockpit Cluster - ${modelName}`;
    badge = "Electronics";
    price = 2800;
    materials = "High-Resolution Ultra-Wide Digital Screen";
  } else if (itemFa.includes("یونیت ها")) {
    enTitle = `Factory ECU / TCU Control Units - ${modelName}`;
    badge = "Electronics";
    price = 1650;
    materials = "Siemens / Bosch Porsche Architecture Modules";
  } else {
    enTitle = `Genuine Component - ${modelName}`;
    badge = "Genuine OEM";
    price = 650;
  }

  return { enTitle, image, badge, price, desc, features, materials };
}

// Sluggify string
function makeSlug(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

let allProducts = [];
let idCounter = 0;

for (const sec of rawCatalog) {
  const groups = [
    { catId: "facelift", catLabel: "فیس لیفت", items: sec.facelift },
    { catId: "accessories", catLabel: "اکسسوری", items: sec.accessories },
    { catId: "parts", catLabel: "لوازم یدکی و مصرفی", items: sec.parts },
  ];

  for (const grp of groups) {
    for (const itemFa of grp.items) {
      idCounter++;
      const meta = getProductMeta(itemFa, grp.catId, sec);
      
      const genSlug = sec.generation || sec.model;
      const slugId = `${genSlug}-${grp.catId}-${idCounter}`;

      const product = {
        id: slugId,
        name: itemFa,
        subtitle: meta.enTitle,
        model: sec.model,
        modelLabel: sec.modelLabel,
        ...(sec.generation ? { generation: sec.generation, generationLabel: sec.generationLabel } : {}),
        category: grp.catId,
        categoryLabel: grp.catLabel,
        price: meta.price,
        image: meta.image,
        badge: meta.badge,
        compatibility: sec.compat,
        description: meta.desc,
        features: meta.features,
        materials: meta.materials,
        inStock: true
      };

      allProducts.push(product);
    }
  }
}

console.log("Total generated products:", allProducts.length);

const outputTS = `export type SubCategoryId = "all" | "accessories" | "facelift" | "parts";

export interface SubCategoryItem {
  id: "accessories" | "facelift" | "parts";
  label: "اکسسوری" | "فیس لیفت" | "لوازم یدکی و مصرفی";
  enLabel: string;
}

export const SUB_CATEGORIES: SubCategoryItem[] = [
  { id: "accessories", label: "اکسسوری", enLabel: "Accessories" },
  { id: "facelift", label: "فیس لیفت", enLabel: "Facelift" },
  { id: "parts", label: "لوازم یدکی و مصرفی", enLabel: "Parts & Consumables" },
];

export interface ModelGeneration {
  id: string;
  name: string;
  years?: string;
  subCategories: SubCategoryItem[];
}

export interface VehicleModelCategory {
  id: "macan" | "cayman" | "cayenne" | "boxster" | "911" | "panamera";
  name: string;
  generations?: ModelGeneration[];
  subCategories: SubCategoryItem[];
}

export const VEHICLE_CATEGORIES: VehicleModelCategory[] = [
  {
    id: "macan",
    name: "Macan",
    subCategories: SUB_CATEGORIES,
  },
  {
    id: "cayman",
    name: "Cayman",
    subCategories: SUB_CATEGORIES,
  },
  {
    id: "cayenne",
    name: "Cayenne",
    generations: [
      {
        id: "cayenne-2008-2010",
        name: "Cayenne 2008–2010",
        years: "2008–2010",
        subCategories: SUB_CATEGORIES,
      },
      {
        id: "cayenne-2011-2014",
        name: "Cayenne 2011–2014",
        years: "2011–2014",
        subCategories: SUB_CATEGORIES,
      },
    ],
    subCategories: SUB_CATEGORIES,
  },
  {
    id: "boxster",
    name: "Boxster",
    generations: [
      {
        id: "boxster-2010-2012",
        name: "Boxster 2010–2012",
        years: "2010–2012",
        subCategories: SUB_CATEGORIES,
      },
      {
        id: "boxster-2017-2018",
        name: "718 Boxster S 2017–2018",
        years: "2017–2018",
        subCategories: SUB_CATEGORIES,
      },
    ],
    subCategories: SUB_CATEGORIES,
  },
  {
    id: "911",
    name: "911",
    generations: [
      {
        id: "911-carrera-4",
        name: "911 Carrera 4",
        years: "All Years",
        subCategories: SUB_CATEGORIES,
      },
      {
        id: "911-carrera-s-2011-2014",
        name: "911 Carrera S 2011–2014",
        years: "2011–2014",
        subCategories: SUB_CATEGORIES,
      },
    ],
    subCategories: SUB_CATEGORIES,
  },
  {
    id: "panamera",
    name: "Panamera",
    subCategories: SUB_CATEGORIES,
  },
];

// Deprecated export for backward compatibility
export const CATEGORIES = [
  { id: "all", label: "همه مدل‌ها • All Models" },
  ...VEHICLE_CATEGORIES.map((c) => ({ id: c.id, label: c.name })),
];

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  model: "macan" | "cayman" | "cayenne" | "boxster" | "911" | "panamera";
  modelLabel: string;
  generation?: string;
  generationLabel?: string;
  category: "accessories" | "facelift" | "parts";
  categoryLabel: "اکسسوری" | "فیس لیفت" | "لوازم یدکی و مصرفی";
  price: number;
  image: string;
  badge?: string;
  compatibility?: string;
  description: string;
  features: string[];
  materials: string;
  dimensions?: string;
  inStock: boolean;
}

export const PRODUCTS: Product[] = ${JSON.stringify(allProducts, null, 2)};
`;

fs.writeFileSync("src/data/products.ts", outputTS, "utf-8");
console.log("src/data/products.ts written successfully with", allProducts.length, "items.");
