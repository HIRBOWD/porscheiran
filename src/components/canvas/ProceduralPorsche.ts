import * as THREE from "three";

/**
 * Creates an authentic automotive wheel assembly (tire, alloy rim, brake disc, Porsche red caliper)
 */
function createWheel(): THREE.Group {
  const wheel = new THREE.Group();

  // Rubber tire
  const tireGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.28, 32);
  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x18181a,
    roughness: 0.85,
    metalness: 0.1,
  });
  const tire = new THREE.Mesh(tireGeo, tireMat);
  tire.rotation.z = Math.PI / 2;
  tire.castShadow = true;
  wheel.add(tire);

  // Wheel rim lip
  const rimGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.282, 32);
  const rimMat = new THREE.MeshStandardMaterial({
    color: 0x333338,
    metalness: 0.9,
    roughness: 0.2,
  });
  const rim = new THREE.Mesh(rimGeo, rimMat);
  rim.rotation.z = Math.PI / 2;
  wheel.add(rim);

  // Spokes
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5;
    const spokeGeo = new THREE.BoxGeometry(0.04, 0.25, 0.03);
    const spoke = new THREE.Mesh(spokeGeo, rimMat);
    spoke.position.x = 0.14;
    spoke.position.y = Math.cos(angle) * 0.12;
    spoke.position.z = Math.sin(angle) * 0.12;
    spoke.rotation.x = -angle;
    wheel.add(spoke);
  }

  // Brake disc
  const discGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.04, 24);
  const discMat = new THREE.MeshStandardMaterial({
    color: 0x99999f,
    metalness: 0.95,
    roughness: 0.3,
  });
  const disc = new THREE.Mesh(discGeo, discMat);
  disc.rotation.z = Math.PI / 2;
  disc.position.x = 0.05;
  wheel.add(disc);

  // Porsche Red Caliper
  const caliperGeo = new THREE.BoxGeometry(0.06, 0.12, 0.07);
  const caliperMat = new THREE.MeshStandardMaterial({
    color: 0xd5001c, // Iconic Porsche Guards Red
    metalness: 0.5,
    roughness: 0.3,
  });
  const caliper = new THREE.Mesh(caliperGeo, caliperMat);
  caliper.position.set(0.07, 0.14, 0);
  wheel.add(caliper);

  return wheel;
}

/**
 * Creates 4 wheels positioned at wheelbase and track dimensions
 */
function attachWheels(car: THREE.Group, trackWidth: number, wheelBase: number, yOffset: number) {
  const positions = [
    [-trackWidth / 2, yOffset, wheelBase / 2], // Front Left
    [trackWidth / 2, yOffset, wheelBase / 2],  // Front Right
    [-trackWidth / 2, yOffset, -wheelBase / 2], // Rear Left
    [trackWidth / 2, yOffset, -wheelBase / 2],  // Rear Right
  ];

  positions.forEach(([x, y, z], idx) => {
    const wheel = createWheel();
    wheel.position.set(x, y, z);
    if (x > 0) {
      wheel.rotation.y = Math.PI; // Face outwards
    }
    car.add(wheel);
  });
}

// -----------------------------------------------------------------------------
// 01. PORSCHE MACAN GTS (Deep Jet Black SUV)
// -----------------------------------------------------------------------------
export function createMacanModel(): THREE.Group {
  const car = new THREE.Group();
  car.name = "Macan";

  // Automotive Paint Material: Deep Jet Black Metallic
  const paintMat = new THREE.MeshPhysicalMaterial({
    color: 0x0c0d10,
    metalness: 0.88,
    roughness: 0.16,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    reflectivity: 0.95,
  });

  const trimMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1c,
    roughness: 0.6,
    metalness: 0.4,
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x050508,
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.8,
    opacity: 0.9,
    transparent: true,
  });

  // Lower Chassis / Underbody
  const chassisGeo = new THREE.BoxGeometry(1.85, 0.38, 4.3);
  const chassis = new THREE.Mesh(chassisGeo, trimMat);
  chassis.position.y = 0.42;
  chassis.castShadow = true;
  car.add(chassis);

  // Main Muscular Body
  const bodyGeo = new THREE.BoxGeometry(1.88, 0.48, 4.2);
  const body = new THREE.Mesh(bodyGeo, paintMat);
  body.position.y = 0.72;
  body.castShadow = true;
  car.add(body);

  // Curved Front Hood
  const hoodGeo = new THREE.BoxGeometry(1.82, 0.22, 1.4);
  const hood = new THREE.Mesh(hoodGeo, paintMat);
  hood.position.set(0, 0.88, 1.35);
  hood.rotation.x = 0.08;
  hood.castShadow = true;
  car.add(hood);

  // Front Grille & Air Intakes
  const grilleGeo = new THREE.BoxGeometry(1.5, 0.28, 0.1);
  const grilleMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.9 });
  const grille = new THREE.Mesh(grilleGeo, grilleMat);
  grille.position.set(0, 0.52, 2.12);
  car.add(grille);

  // Cabin & Greenhouse (SUV roofline)
  const cabinGeo = new THREE.BoxGeometry(1.55, 0.56, 2.3);
  const cabin = new THREE.Mesh(cabinGeo, paintMat);
  cabin.position.set(0, 1.2, -0.2);
  cabin.castShadow = true;
  car.add(cabin);

  // Windshield
  const windshieldGeo = new THREE.BoxGeometry(1.5, 0.5, 0.08);
  const windshield = new THREE.Mesh(windshieldGeo, glassMat);
  windshield.position.set(0, 1.15, 0.95);
  windshield.rotation.x = -0.55;
  car.add(windshield);

  // Rear Window
  const rearWindow = new THREE.Mesh(windshieldGeo, glassMat);
  rearWindow.position.set(0, 1.15, -1.35);
  rearWindow.rotation.x = 0.6;
  car.add(rearWindow);

  // Side Glass
  const sideGlassGeo = new THREE.BoxGeometry(0.04, 0.38, 1.9);
  const sideGlassL = new THREE.Mesh(sideGlassGeo, glassMat);
  sideGlassL.position.set(-0.78, 1.2, -0.2);
  car.add(sideGlassL);
  const sideGlassR = new THREE.Mesh(sideGlassGeo, glassMat);
  sideGlassR.position.set(0.78, 1.2, -0.2);
  car.add(sideGlassR);

  // LED Headlights (4-point signature)
  const headLightMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xddeeff,
    emissiveIntensity: 2.2,
  });
  const headLightGeo = new THREE.BoxGeometry(0.32, 0.12, 0.08);
  const hlLeft = new THREE.Mesh(headLightGeo, headLightMat);
  hlLeft.position.set(-0.68, 0.85, 2.05);
  car.add(hlLeft);
  const hlRight = new THREE.Mesh(headLightGeo, headLightMat);
  hlRight.position.set(0.68, 0.85, 2.05);
  car.add(hlRight);

  // Continuous Rear Light Strip
  const tailLightMat = new THREE.MeshStandardMaterial({
    color: 0xff0022,
    emissive: 0xff0022,
    emissiveIntensity: 2.0,
  });
  const tailLightGeo = new THREE.BoxGeometry(1.7, 0.08, 0.06);
  const tailLight = new THREE.Mesh(tailLightGeo, tailLightMat);
  tailLight.position.set(0, 0.9, -2.12);
  car.add(tailLight);

  // Quad Exhaust Pipes
  const exhaustMat = new THREE.MeshStandardMaterial({ color: 0x88888e, metalness: 0.9, roughness: 0.2 });
  const exhaustGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.12, 16);
  [-0.65, -0.54, 0.54, 0.65].forEach((x) => {
    const tip = new THREE.Mesh(exhaustGeo, exhaustMat);
    tip.rotation.x = Math.PI / 2;
    tip.position.set(x, 0.35, -2.14);
    car.add(tip);
  });

  // Attach 4 wheels
  attachWheels(car, 1.84, 2.65, 0.38);

  return car;
}

// -----------------------------------------------------------------------------
// 02. PORSCHE 718 BOXSTER GTS (GT Silver Roadster)
// -----------------------------------------------------------------------------
export function createBoxsterModel(): THREE.Group {
  const car = new THREE.Group();
  car.name = "Boxster";

  // Automotive Paint: GT Silver Metallic
  const paintMat = new THREE.MeshPhysicalMaterial({
    color: 0xc4c7cb,
    metalness: 0.9,
    roughness: 0.18,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
    reflectivity: 0.92,
  });

  const interiorMat = new THREE.MeshStandardMaterial({
    color: 0x1c1c1f,
    roughness: 0.7,
    metalness: 0.2,
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x0a0a0f,
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.85,
    opacity: 0.85,
    transparent: true,
  });

  // Low-slung roadster body
  const bodyGeo = new THREE.BoxGeometry(1.82, 0.42, 4.1);
  const body = new THREE.Mesh(bodyGeo, paintMat);
  body.position.y = 0.52;
  body.castShadow = true;
  car.add(body);

  // Sculpted Hood
  const hoodGeo = new THREE.BoxGeometry(1.72, 0.16, 1.35);
  const hood = new THREE.Mesh(hoodGeo, paintMat);
  hood.position.set(0, 0.66, 1.25);
  hood.rotation.x = 0.06;
  hood.castShadow = true;
  car.add(hood);

  // Open Cockpit Well
  const cockpitGeo = new THREE.BoxGeometry(1.4, 0.3, 1.4);
  const cockpit = new THREE.Mesh(cockpitGeo, interiorMat);
  cockpit.position.set(0, 0.65, -0.15);
  car.add(cockpit);

  // Sport Bucket Seats
  const seatGeo = new THREE.BoxGeometry(0.42, 0.45, 0.35);
  [-0.32, 0.32].forEach((x) => {
    const seat = new THREE.Mesh(seatGeo, interiorMat);
    seat.position.set(x, 0.85, -0.3);
    car.add(seat);
  });

  // Roll-Over Safety Hoops
  const hoopGeo = new THREE.TorusGeometry(0.18, 0.035, 16, 24, Math.PI);
  const hoopMat = new THREE.MeshStandardMaterial({ color: 0x333338, metalness: 0.8, roughness: 0.3 });
  [-0.32, 0.32].forEach((x) => {
    const hoop = new THREE.Mesh(hoopGeo, hoopMat);
    hoop.position.set(x, 1.05, -0.5);
    car.add(hoop);
  });

  // Roadster Raked Windshield
  const windshieldGeo = new THREE.BoxGeometry(1.48, 0.44, 0.06);
  const windshield = new THREE.Mesh(windshieldGeo, glassMat);
  windshield.position.set(0, 0.88, 0.65);
  windshield.rotation.x = -0.68;
  car.add(windshield);

  // Mid-Engine Side Air Scoops
  const scoopGeo = new THREE.BoxGeometry(0.08, 0.18, 0.45);
  const scoopMat = new THREE.MeshStandardMaterial({ color: 0x111114, roughness: 0.8 });
  [-0.92, 0.92].forEach((x) => {
    const scoop = new THREE.Mesh(scoopGeo, scoopMat);
    scoop.position.set(x, 0.55, -0.4);
    car.add(scoop);
  });

  // Oval Headlights
  const headLightMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xddeeff,
    emissiveIntensity: 2.2,
  });
  const headLightGeo = new THREE.BoxGeometry(0.28, 0.1, 0.08);
  [-0.64, 0.64].forEach((x) => {
    const hl = new THREE.Mesh(headLightGeo, headLightMat);
    hl.position.set(x, 0.68, 1.98);
    car.add(hl);
  });

  // Thin 3D Rear Light Bar with Porsche logo bar
  const tailLightMat = new THREE.MeshStandardMaterial({
    color: 0xff0022,
    emissive: 0xff0022,
    emissiveIntensity: 2.0,
  });
  const tailLightGeo = new THREE.BoxGeometry(1.65, 0.07, 0.05);
  const tailLight = new THREE.Mesh(tailLightGeo, tailLightMat);
  tailLight.position.set(0, 0.68, -2.06);
  car.add(tailLight);

  // Center Dual Sport Exhaust Pipes
  const exhaustMat = new THREE.MeshStandardMaterial({ color: 0x88888e, metalness: 0.9, roughness: 0.2 });
  const exhaustGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.12, 16);
  [-0.08, 0.08].forEach((x) => {
    const tip = new THREE.Mesh(exhaustGeo, exhaustMat);
    tip.rotation.x = Math.PI / 2;
    tip.position.set(x, 0.32, -2.08);
    car.add(tip);
  });

  // Attach 4 wheels
  attachWheels(car, 1.80, 2.48, 0.34);

  return car;
}

// -----------------------------------------------------------------------------
// 03. PORSCHE 911 GT3 (Crayon / Chalk Grey Fastback Coupe)
// -----------------------------------------------------------------------------
export function create911Model(): THREE.Group {
  const car = new THREE.Group();
  car.name = "NineEleven";

  // Automotive Paint: Crayon / Chalk Grey Metallic
  const paintMat = new THREE.MeshPhysicalMaterial({
    color: 0xd2cfca,
    metalness: 0.85,
    roughness: 0.18,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    reflectivity: 0.94,
  });

  const trimMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.5,
    metalness: 0.5,
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x050508,
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.85,
    opacity: 0.88,
    transparent: true,
  });

  // Lower aerodynamic chassis
  const chassisGeo = new THREE.BoxGeometry(1.85, 0.32, 4.35);
  const chassis = new THREE.Mesh(chassisGeo, trimMat);
  chassis.position.y = 0.42;
  chassis.castShadow = true;
  car.add(chassis);

  // Main 911 Body
  const bodyGeo = new THREE.BoxGeometry(1.86, 0.38, 4.25);
  const body = new THREE.Mesh(bodyGeo, paintMat);
  body.position.y = 0.58;
  body.castShadow = true;
  car.add(body);

  // Low Front Nose & Sloping Hood
  const hoodGeo = new THREE.BoxGeometry(1.75, 0.16, 1.45);
  const hood = new THREE.Mesh(hoodGeo, paintMat);
  hood.position.set(0, 0.65, 1.35);
  hood.rotation.x = 0.1;
  hood.castShadow = true;
  car.add(hood);

  // Iconic Flared Rear Fenders (911 wide hips)
  const rearArchGeo = new THREE.BoxGeometry(1.96, 0.36, 1.25);
  const rearArch = new THREE.Mesh(rearArchGeo, paintMat);
  rearArch.position.set(0, 0.6, -1.1);
  rearArch.castShadow = true;
  car.add(rearArch);

  // Iconic Fastback Flyline (Curved teardrop roofline)
  const roofGeo = new THREE.BoxGeometry(1.46, 0.48, 2.1);
  const roof = new THREE.Mesh(roofGeo, paintMat);
  roof.position.set(0, 1.0, -0.25);
  roof.rotation.x = -0.15; // Smooth rearward slope
  roof.castShadow = true;
  car.add(roof);

  // Sloping Rear Decklid
  const decklidGeo = new THREE.BoxGeometry(1.5, 0.18, 1.1);
  const decklid = new THREE.Mesh(decklidGeo, paintMat);
  decklid.position.set(0, 0.78, -1.45);
  decklid.rotation.x = -0.38;
  decklid.castShadow = true;
  car.add(decklid);

  // Rear Engine Decklid Louvers
  const louverMat = new THREE.MeshStandardMaterial({ color: 0x111114, roughness: 0.9 });
  const louverGeo = new THREE.BoxGeometry(1.1, 0.04, 0.65);
  const louver = new THREE.Mesh(louverGeo, louverMat);
  louver.position.set(0, 0.85, -1.35);
  louver.rotation.x = -0.38;
  car.add(louver);

  // Curved Windshield
  const windshieldGeo = new THREE.BoxGeometry(1.42, 0.46, 0.06);
  const windshield = new THREE.Mesh(windshieldGeo, glassMat);
  windshield.position.set(0, 0.95, 0.78);
  windshield.rotation.x = -0.62;
  car.add(windshield);

  // Fastback Rear Window
  const rearGlassGeo = new THREE.BoxGeometry(1.36, 0.7, 0.06);
  const rearGlass = new THREE.Mesh(rearGlassGeo, glassMat);
  rearGlass.position.set(0, 0.96, -0.98);
  rearGlass.rotation.x = 0.58;
  car.add(rearGlass);

  // Iconic 911 Round Headlights
  const headLightMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xddeeff,
    emissiveIntensity: 2.4,
  });
  const headLightGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.06, 24);
  [-0.65, 0.65].forEach((x) => {
    const hl = new THREE.Mesh(headLightGeo, headLightMat);
    hl.rotation.x = Math.PI / 2 - 0.15;
    hl.position.set(x, 0.75, 2.05);
    car.add(hl);
  });

  // Continuous Seamless Red Taillight Strip
  const tailLightMat = new THREE.MeshStandardMaterial({
    color: 0xff0022,
    emissive: 0xff0022,
    emissiveIntensity: 2.2,
  });
  const tailLightGeo = new THREE.BoxGeometry(1.78, 0.05, 0.06);
  const tailLight = new THREE.Mesh(tailLightGeo, tailLightMat);
  tailLight.position.set(0, 0.72, -2.14);
  car.add(tailLight);

  // Center Dual GT3 Exhaust Pipes
  const exhaustMat = new THREE.MeshStandardMaterial({ color: 0x88888e, metalness: 0.95, roughness: 0.2 });
  const exhaustGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.14, 16);
  [-0.09, 0.09].forEach((x) => {
    const tip = new THREE.Mesh(exhaustGeo, exhaustMat);
    tip.rotation.x = Math.PI / 2;
    tip.position.set(x, 0.34, -2.16);
    car.add(tip);
  });

  // Attach 4 wheels with wide rear track
  attachWheels(car, 1.84, 2.52, 0.35);

  return car;
}
