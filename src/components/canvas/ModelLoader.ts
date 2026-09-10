import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  createMacanModel,
  createBoxsterModel,
  create911Model,
} from "./ProceduralPorsche";

export type VehicleKey = "macan" | "boxster" | "911";

interface ModelConfig {
  key: VehicleKey;
  path: string;
  createFallback: () => THREE.Group;
}

const MODEL_CONFIGS: Record<VehicleKey, ModelConfig> = {
  macan: {
    key: "macan",
    path: "/models/Macan.glb",
    createFallback: createMacanModel,
  },
  boxster: {
    key: "boxster",
    path: "/models/Boxster.glb",
    createFallback: createBoxsterModel,
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
    // Check if the GLB file exists by attempting to fetch headers first
    const checkRes = await fetch(config.path, { method: "HEAD" });
    if (!checkRes.ok) {
      throw new Error(`GLB asset not found at ${config.path} (HTTP ${checkRes.status})`);
    }

    // Load actual GLTF / GLB model
    const gltf = await new Promise<{ scene: THREE.Group }>((resolve, reject) => {
      loader.load(
        config.path,
        (data) => resolve(data),
        undefined,
        (err) => reject(err)
      );
    });

    const model = gltf.scene;
    model.name = `GLB_${key}`;

    // Compute bounding box and normalize scale & position
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Scale to match automotive proportions (~4.5 units long)
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
      const scaleFactor = 4.5 / maxDim;
      model.scale.setScalar(scaleFactor);
      model.position.sub(center.multiplyScalar(scaleFactor));
    }

    // Enable shadows on all child meshes
    model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    const wrapper = new THREE.Group();
    wrapper.add(model);
    console.info(`[Porsche 3D Engine] Successfully loaded external GLB model: ${config.path}`);
    return { group: wrapper, isGlb: true };
  } catch {
    // Graceful procedural 3D fallback
    console.info(
      `[Porsche 3D Engine] Asset ${config.path} is not present in /public/models/. Using procedural 3D Porsche ${key.toUpperCase()} model. Drop ${key}.glb into /public/models/ to override.`
    );
    const fallbackGroup = config.createFallback();
    return { group: fallbackGroup, isGlb: false };
  }
}
