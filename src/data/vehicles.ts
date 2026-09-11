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
    id: "boxster",
    index: "01",
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
];
