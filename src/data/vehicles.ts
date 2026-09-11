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
    id: "gt3",
    index: "01",
    name: "911 GT3 RS",
    modelCode: "911 GT3 RS",
    title: "911 GT3 RS",
    tagline: "PURE MOTORSPORT DNA. AERODYNAMIC SUPREMACY.",
    colorName: "GT Silver & Carbon Package",
    colorHex: "#C5C7CA",
    image: "/images/vehicles/nineoneone-silver.jpg",
    model3dPath: "/models/porschegt3.glb",
    specs: {
      power: "518 HP",
      acceleration: "3.0 s",
      topSpeed: "184 MPH",
      engine: "4.0L Naturally Aspirated Boxer-6",
    },
    halo: {
      scale: 1.15,
      color: "rgba(220, 225, 235, 0.5)",
      glow: "rgba(205, 215, 230, 0.3)",
    },
    studioAtmosphere: {
      bgGradient: "radial-gradient(ellipse at 50% 45%, #FFFFFF 0%, #F3F4F6 50%, #E5E7EB 100%)",
      floorReflection: 0.24,
      spotlightIntensity: 0.95,
    },
  },
];
