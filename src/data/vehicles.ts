export interface VehicleModel {
  id: string;
  index: string;
  name: string;
  modelCode: string;
  title: string;
  tagline: string;
  colorName: string;
  colorHex: string;
  image: string;
  model3dPath: string; // Drop-in support for Macan.glb, Boxster.glb, 911.glb
  specs: {
    power: string;
    acceleration: string;
    topSpeed: string;
    engine: string;
  };
  halo: {
    scale: number;
    color: string;
    glow: string;
  };
  studioAtmosphere: {
    bgGradient: string;
    floorReflection: number; // opacity
    spotlightIntensity: number;
  };
}

export const VEHICLES: VehicleModel[] = [
  {
    id: "macan",
    index: "01",
    name: "Macan GTS",
    modelCode: "MACAN",
    title: "MACAN",
    tagline: "INTENSE LIFE. COMPACT SPORTING SPIRIT.",
    colorName: "Deep Jet Black Metallic",
    colorHex: "#0D0D11",
    image: "/images/vehicles/macan-black.jpg",
    model3dPath: "/models/Macan.glb",
    specs: {
      power: "434 HP",
      acceleration: "4.1 s",
      topSpeed: "169 MPH",
      engine: "2.9L Twin-Turbo V6",
    },
    halo: {
      scale: 1.0,
      color: "rgba(220, 220, 225, 0.4)",
      glow: "rgba(200, 205, 215, 0.25)",
    },
    studioAtmosphere: {
      bgGradient: "radial-gradient(ellipse at 50% 45%, #FFFFFF 0%, #F5F5F7 50%, #E9E9ED 100%)",
      floorReflection: 0.18,
      spotlightIntensity: 0.85,
    },
  },
  {
    id: "boxster",
    index: "02",
    name: "718 Boxster GTS 4.0",
    modelCode: "BOXSTER",
    title: "BOXSTER",
    tagline: "MID-ENGINE PRECISION. OPEN-TOP FREEDOM.",
    colorName: "GT Silver Metallic",
    colorHex: "#C5C7CA",
    image: "/images/vehicles/boxster-silver.jpg",
    model3dPath: "/models/Boxster.glb",
    specs: {
      power: "394 HP",
      acceleration: "3.8 s",
      topSpeed: "182 MPH",
      engine: "4.0L Naturally Aspirated Boxer-6",
    },
    halo: {
      scale: 1.15,
      color: "rgba(210, 215, 225, 0.5)",
      glow: "rgba(195, 205, 220, 0.3)",
    },
    studioAtmosphere: {
      bgGradient: "radial-gradient(ellipse at 50% 45%, #FFFFFF 0%, #F3F4F6 50%, #E5E7EB 100%)",
      floorReflection: 0.24,
      spotlightIntensity: 0.95,
    },
  },
  {
    id: "911",
    index: "03",
    name: "911 Carrera 4S",
    modelCode: "911",
    title: "911",
    tagline: "ALL-WHEEL PRECISION. TIMELESS ATHLETICISM.",
    colorName: "GT Silver / Crayon",
    colorHex: "#D1CECA",
    image: "/images/vehicles/911-carrera.jpg",
    model3dPath: "/models/911.glb",
    specs: {
      power: "443 HP",
      acceleration: "3.4 s",
      topSpeed: "190 MPH",
      engine: "3.0L Twin-Turbo Boxer-6",
    },
    halo: {
      scale: 1.25,
      color: "rgba(225, 225, 230, 0.55)",
      glow: "rgba(215, 215, 225, 0.35)",
    },
    studioAtmosphere: {
      bgGradient: "radial-gradient(ellipse at 50% 45%, #FFFFFF 0%, #F2F2F5 50%, #E3E3E8 100%)",
      floorReflection: 0.3,
      spotlightIntensity: 1.0,
    },
  },
];
