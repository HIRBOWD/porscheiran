import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  createMacanModel,
  createBoxsterModel,
  create911Model,
} from "./ProceduralPorsche";

export type VehicleKey = "gt3" | "boxster" | "macan" | "911";

interface ModelConfig {
  key: VehicleKey;
  path: string;
  createFallback: () => THREE.Group;
}

const MODEL_CONFIGS: Record<VehicleKey, ModelConfig> = {
  gt3: {
    key: "gt3",
    path: "/models/porschegt3.glb",
    createFallback: create911Model,
  },
  boxster: {
    key: "boxster",
    path: "/models/Boxster.glb",
    createFallback: createBoxsterModel,
  },
  macan: {
    key: "macan",
    path: "/models/Macan.glb",
    createFallback: createMacanModel,
  },
  911: {
    key: "911",
    path: "/models/911.glb",
    createFallback: create911Model,
  },
};

/**
 * Loads a vehicle model from a GLB file or gracefully falls back to the procedural 3D mesh.
 */
export async function loadVehicleModel(key: VehicleKey): Promise<{
  group: THREE.Group;
  isGlb: boolean;
}> {
  const config = MODEL_CONFIGS[key];
  const loader = new GLTFLoader();

  try {
    // Load actual GLTF / GLB model via GLTFLoader
    const gltf = await new Promise<{ scene: THREE.Group }>((resolve, reject) => {
      loader.load(
        config.path,
        (data) => resolve(data),
        (event) => {
          if (event.lengthComputable && event.total > 0) {
            const pct = Math.round((event.loaded / event.total) * 100);
            if (pct % 25 === 0) {
              console.info(`[Porsche 3D Engine] Loading ${key.toUpperCase()}: ${pct}%`);
            }
          }
        },
        (err) => reject(err)
      );
    });

    const model = gltf.scene;
    model.name = `GLB_${key}`;

    // Force update of all world transformations in the model tree
    model.updateMatrixWorld(true);

    // Compute exact bounding box
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    console.info(`[Porsche 3D Engine] Raw dimensions for ${key}:`, {
      size: [size.x.toFixed(3), size.y.toFixed(3), size.z.toFixed(3)],
      center: [center.x.toFixed(3), center.y.toFixed(3), center.z.toFixed(3)],
    });

    // Normalize scale: Target vehicle length (longitudinal axis) = 4.2 units
    const length = Math.max(size.x, size.z);
    const targetLength = 4.2;
    const scaleFactor = length > 0 ? targetLength / length : 1.0;

    model.scale.setScalar(scaleFactor);

    // Grounding: Offset model vertically by -box.min.y * scaleFactor independently
    // for each vehicle so that the bottom of the wheels/tires sits exactly on the studio floor (Y = 0)
    const groundOffsetY = -box.min.y * scaleFactor;

    model.position.x = -center.x * scaleFactor;
    model.position.y = groundOffsetY;
    model.position.z = -center.z * scaleFactor;

    model.updateMatrixWorld(true);

    // Selective shadow casting: exterior meshes cast shadows, interior meshes skip shadow pass
    model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const nodeName = (child.name || "").toLowerCase();

        // 101 interior meshes never cast visible shadows outside the car
        const isInterior =
          nodeName.includes("interior") ||
          nodeName.includes("seat") ||
          nodeName.includes("carpet") ||
          nodeName.includes("gauge") ||
          nodeName.includes("pedal") ||
          nodeName.includes("dash") ||
          nodeName.includes("shifter") ||
          nodeName.includes("speaker") ||
          nodeName.includes("steering") ||
          nodeName.includes("fabric") ||
          nodeName.includes("int_") ||
          nodeName.includes("clock") ||
          nodeName.includes("stitch") ||
          nodeName.includes("engine");

        mesh.castShadow = !isInterior;
        mesh.receiveShadow = false;
        mesh.frustumCulled = true;

        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((m) => {
            const matName = (m.name || "").toLowerCase();

            // Calibrate PBR properties for studio showroom photorealism
            if (matName.includes("carpaint")) {
              (m as THREE.MeshStandardMaterial).roughness = 0.12; // Glossy clearcoat lacquer
              (m as THREE.MeshStandardMaterial).metalness = 0.78; // GT Silver metallic flake
              (m as THREE.MeshStandardMaterial).envMapIntensity = 1.35;
            } else if (matName.includes("carbon")) {
              (m as THREE.MeshStandardMaterial).roughness = 0.16;
              (m as THREE.MeshStandardMaterial).metalness = 0.35;
              (m as THREE.MeshStandardMaterial).envMapIntensity = 1.25;
            } else if (matName.includes("wheels") || matName.includes("chrome")) {
              (m as THREE.MeshStandardMaterial).roughness = 0.14;
              (m as THREE.MeshStandardMaterial).metalness = 0.88;
              (m as THREE.MeshStandardMaterial).envMapIntensity = 1.4;
            } else if (matName.includes("caliper")) {
              (m as THREE.MeshStandardMaterial).roughness = 0.15;
              (m as THREE.MeshStandardMaterial).metalness = 0.2;
              (m as THREE.MeshStandardMaterial).envMapIntensity = 1.2;
            } else if (matName.includes("brake")) {
              (m as THREE.MeshStandardMaterial).roughness = 0.18;
              (m as THREE.MeshStandardMaterial).metalness = 0.85;
              (m as THREE.MeshStandardMaterial).envMapIntensity = 1.25;
            } else if ("envMapIntensity" in m) {
              (m as THREE.MeshStandardMaterial).envMapIntensity = 1.2;
            }
          });
        }
      }
    });

    const wrapper = new THREE.Group();
    wrapper.name = `Wrapper_${key}`;
    wrapper.add(model);

    console.info(
      `[Porsche 3D Engine] Successfully loaded & centered GLB: ${config.path} (Scale: ${scaleFactor.toFixed(3)})`
    );
    return { group: wrapper, isGlb: true };
  } catch (err) {
    // Graceful procedural 3D fallback
    console.warn(
      `[Porsche 3D Engine] Asset ${config.path} failed to load, using procedural fallback. Error:`,
      err
    );
    const fallbackGroup = config.createFallback();
    return { group: fallbackGroup, isGlb: false };
  }
}

/**
 * Loads the 3D Porsche Crest Logo model from GLB.
 * Normalizes size, centers geometry, and calibrates showroom PBR materials.
 */
export async function loadPorscheLogo(): Promise<{
  group: THREE.Group;
  materials: THREE.Material[];
}> {
  const loader = new GLTFLoader();
  const path = "/models/porsche_logo.glb";

  try {
    const gltf = await new Promise<{ scene: THREE.Group }>((resolve, reject) => {
      loader.load(
        path,
        (data) => resolve(data),
        undefined,
        (err) => reject(err)
      );
    });

    const model = gltf.scene;
    model.name = "GLB_porsche_logo";
    model.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Center model at origin
    model.position.set(-center.x, -center.y, -center.z);

    // Target height ~ 1.45 units (fits elegantly inside 2.1 halo ring)
    const currentHeight = Math.max(size.x, size.z);
    const targetHeight = 1.45;
    const scaleFactor = currentHeight > 0 ? targetHeight / currentHeight : 1.0;

    const innerGroup = new THREE.Group();
    innerGroup.name = "Logo_Rotated";
    innerGroup.add(model);

    // Orientation: rx = 90deg, ry = 180deg
    // "PORSCHE" text is upright at the top (+Y)
    // Pointed shield tip is at the bottom (-Y)
    // Crest faces front (+Z)
    innerGroup.rotation.set(Math.PI / 2, Math.PI, 0);
    innerGroup.scale.setScalar(scaleFactor);

    const materials: THREE.Material[] = [];

    // Traverse and optimize materials
    model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = false;
        mesh.frustumCulled = true;

        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((m) => {
            const std = m as THREE.MeshStandardMaterial;
            std.transparent = true;
            std.alphaTest = 0.05;
            std.depthWrite = true;
            std.roughness = 0.18;
            std.metalness = 0.72;
            std.envMapIntensity = 1.45;
            if (!materials.includes(m)) {
              materials.push(m);
            }
          });
        }
      }
    });

    const wrapper = new THREE.Group();
    wrapper.name = "Wrapper_porsche_logo";
    wrapper.add(innerGroup);

    console.info(`[Porsche 3D Engine] Successfully loaded Porsche 3D Logo`);
    return { group: wrapper, materials };
  } catch (err) {
    console.warn("[Porsche 3D Engine] Failed to load Porsche logo:", err);
    const fallbackGroup = new THREE.Group();
    return { group: fallbackGroup, materials: [] };
  }
}

