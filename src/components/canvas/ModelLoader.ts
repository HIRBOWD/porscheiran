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
export async function loadVehicleModel(
  key: VehicleKey,
  onProgress?: (percent: number) => void
): Promise<{
  group: THREE.Group;
  isGlb: boolean;
}> {
  const config = MODEL_CONFIGS[key];
  const loader = new GLTFLoader();

  try {
    // Generous timeout to allow real 18MB Porsche GLB asset to download smoothly over any connection
    const timeoutMs = 40000;

    // Load actual GLTF / GLB model via GLTFLoader with progress tracking and safety timeout
    const gltf = await new Promise<{ scene: THREE.Group }>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`[Porsche 3D Engine] Loading ${key} timed out (${timeoutMs}ms)`));
      }, timeoutMs);

      loader.load(
        config.path,
        (data) => {
          clearTimeout(timer);
          resolve(data);
        },
        (event) => {
          if (event.lengthComputable && event.total > 0) {
            const pct = Math.round((event.loaded / event.total) * 100);
            onProgress?.(pct);
            if (pct % 25 === 0) {
              console.info(`[Porsche 3D Engine] Loading ${key.toUpperCase()}: ${pct}%`);
            }
          }
        },
        (err) => {
          clearTimeout(timer);
          reject(err);
        }
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
