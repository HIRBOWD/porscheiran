export type SubCategoryId = "all" | "accessories" | "facelift" | "parts";

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
        name: "Boxster 2017–2018",
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
        name: "Carrera 4",
        years: "All Years",
        subCategories: SUB_CATEGORIES,
      },
      {
        id: "911-carrera-s-2011-2014",
        name: "Carrera S 2011–2014",
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

export const PRODUCTS: Product[] = [];
