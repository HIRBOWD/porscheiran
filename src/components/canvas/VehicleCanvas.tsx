"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { loadVehicleModel, VehicleKey } from "./ModelLoader";

interface VehicleCanvasProps {
  scrollProgress: number; // 0 to 1
  onSceneReady?: () => void;
  renderMacanInThree?: boolean;
  renderNineElevenInThree?: boolean;
}

export default function VehicleCanvas({
  scrollProgress,
  onSceneReady,
  renderMacanInThree = false,
  renderNineElevenInThree = false,
}: VehicleCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mouse parallax coordinates
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseCurrent = useRef({ x: 0, y: 0 });

  const [isLoading, setIsLoading] = useState(true);

  // Store references to Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Vehicle 3D groups
  const vehiclesRef = useRef<{
    macan?: THREE.Group;
    boxster?: THREE.Group;
    nineEleven?: THREE.Group;
  }>({});

  // 3D Halo Ring
  const haloGroupRef = useRef<THREE.Group | null>(null);

  // Lighting references for dynamic studio shifts
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const rimLightRef = useRef<THREE.DirectionalLight | null>(null);

  // Normalized scroll ref
  const progressRef = useRef(scrollProgress);
  useEffect(() => {
    progressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Initialize Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Soft studio background color & subtle fog
    scene.background = new THREE.Color(0xf6f6f8);
    scene.fog = new THREE.FogExp2(0xf6f6f8, 0.035);

    // 2. Initialize Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(4.8, 1.8, 6.2);
    camera.lookAt(0, 0.45, 0);
    cameraRef.current = camera;

    // 3. Initialize WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    rendererRef.current = renderer;

    // 4. Studio Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    // Key Light (Overhead front three-quarter)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(6, 12, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 30;
    keyLight.shadow.camera.left = -6;
    keyLight.shadow.camera.right = 6;
    keyLight.shadow.camera.top = 6;
    keyLight.shadow.camera.bottom = -6;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    // Fill Light (Left side soft illumination)
    const fillLight = new THREE.DirectionalLight(0xe8eeff, 0.85);
    fillLight.position.set(-8, 5, 4);
    scene.add(fillLight);

    // Rim / Back Light (Crisp vehicle silhouette edge reflections)
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.4);
    rimLight.position.set(-5, 9, -8);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    // Top Overhead Soft Spotlight
    const topLight = new THREE.PointLight(0xffffff, 1.2, 20);
    topLight.position.set(0, 8, 0);
    scene.add(topLight);

    // 5. Studio Ground Plane & Contact Shadow Disc
    const groundGeo = new THREE.PlaneGeometry(80, 80);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xf3f3f6,
      roughness: 0.65,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // Soft Radial Ground Contact Shadow Texture
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 512;
    shadowCanvas.height = 512;
    const ctx = shadowCanvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 250);
      grad.addColorStop(0, "rgba(0, 0, 0, 0.42)");
      grad.addColorStop(0.35, "rgba(0, 0, 0, 0.22)");
      grad.addColorStop(0.65, "rgba(0, 0, 0, 0.07)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(6.8, 4.4);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.set(0, 0.015, 0);
    scene.add(contactShadow);

    // 6. 3D Circular Halo Ring (Precision Architectural Ring)
    const haloGroup = new THREE.Group();
    haloGroup.position.set(0, 1.2, 0);
    haloGroup.rotation.x = 0.2; // Slight tilt for depth

    // Primary 3D Metallic Ring
    const haloRingGeo = new THREE.TorusGeometry(3.6, 0.022, 32, 160);
    const haloRingMat = new THREE.MeshStandardMaterial({
      color: 0xd6d9e0,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x222630,
      emissiveIntensity: 0.3,
    });
    const haloRing = new THREE.Mesh(haloRingGeo, haloRingMat);
    haloGroup.add(haloRing);

    // Outer Hairline Ring
    const outerRingGeo = new THREE.TorusGeometry(3.8, 0.008, 16, 160);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x999da8,
      transparent: true,
      opacity: 0.45,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    haloGroup.add(outerRing);

    // Cardinal Ticks
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 12;
      const tickGeo = new THREE.BoxGeometry(0.015, 0.16, 0.015);
      const tick = new THREE.Mesh(tickGeo, haloRingMat);
      tick.position.x = Math.cos(angle) * 3.6;
      tick.position.y = Math.sin(angle) * 3.6;
      tick.rotation.z = angle;
      haloGroup.add(tick);
    }

    // Porsche Red Accent Marker at Apex
    const markerGeo = new THREE.SphereGeometry(0.04, 16, 16);
    const markerMat = new THREE.MeshBasicMaterial({ color: 0xd5001c });
    const apexMarker = new THREE.Mesh(markerGeo, markerMat);
    apexMarker.position.set(0, 3.6, 0.02);
    haloGroup.add(apexMarker);

    scene.add(haloGroup);
    haloGroupRef.current = haloGroup;

    // 7. Load all 3 Vehicles (with GLB support and procedural fallback)
    let isMounted = true;

    async function loadAllVehicles() {
      const keys: VehicleKey[] = ["macan", "boxster", "911"];
      const results = await Promise.all(keys.map((k) => loadVehicleModel(k)));

      if (!isMounted) return;

      const [macanRes, boxsterRes, nineElevenRes] = results;

      // Position models at center
      macanRes.group.position.set(0, 0, 0);
      boxsterRes.group.position.set(0, 0, 0);
      nineElevenRes.group.position.set(0, 0, 0);

      // Initially show only Macan
      macanRes.group.visible = true;
      boxsterRes.group.visible = false;
      nineElevenRes.group.visible = false;

      scene.add(macanRes.group);
      scene.add(boxsterRes.group);
      scene.add(nineElevenRes.group);

      vehiclesRef.current = {
        macan: macanRes.group,
        boxster: boxsterRes.group,
        nineEleven: nineElevenRes.group,
      };

      setIsLoading(false);
      onSceneReady?.();
    }

    loadAllVehicles();

    // 8. Mouse Parallax Handler
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseTarget.current.x = normX * 0.4;
      mouseTarget.current.y = normY * 0.25;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // 9. Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // 10. Animation & Render Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = progressRef.current; // 0 to 1

      // Mouse Parallax Smooth Damping
      mouseCurrent.current.x += (mouseTarget.current.x - mouseCurrent.current.x) * 0.05;
      mouseCurrent.current.y += (mouseTarget.current.y - mouseCurrent.current.y) * 0.05;

      // Rotate Halo Ring slowly
      if (haloGroupRef.current) {
        haloGroupRef.current.rotation.z -= delta * 0.08;
      }

      // -----------------------------------------------------------------------
      // REAL-TIME 3D SCROLL CHOREOGRAPHY (Continuous Seamless Interpolation)
      // -----------------------------------------------------------------------
      const macan = vehiclesRef.current.macan;
      const boxster = vehiclesRef.current.boxster;
      const nineEleven = vehiclesRef.current.nineEleven;

      // Base camera coordinates
      let targetCamX = 4.8 + mouseCurrent.current.x;
      let targetCamY = 1.8 + mouseCurrent.current.y;
      let targetCamZ = 6.2;
      let targetLookAtY = 0.45;

      // --- PHASE 1: MACAN (0.00 -> 0.33) ---
      if (p <= 0.34 && renderMacanInThree) {
        if (macan) {
          macan.visible = true;
          if (p <= 0.16) {
            // At rest
            macan.position.set(0, 0, 0);
            macan.rotation.y = -0.32 + p * 0.4;
            macan.scale.setScalar(1.0 - p * 0.3);
          } else {
            // Dissolving into Boxster
            const subP = (p - 0.16) / 0.18; // 0 to 1
            macan.position.set(0, -subP * 0.8, -subP * 1.5);
            macan.rotation.y = -0.26 + subP * 0.6;
            macan.scale.setScalar(0.95 - subP * 0.25);
          }
        }
      } else {
        if (macan) macan.visible = false;
      }

      // --- PHASE 2: BOXSTER (0.22 -> 0.68) ---
      if (p >= 0.20 && p <= 0.68) {
        if (boxster) {
          boxster.visible = true;
          if (p < 0.36) {
            // Emerging from exact center point
            const emergeP = (p - 0.20) / 0.16; // 0 to 1
            boxster.position.set(0, -0.6 * (1 - emergeP), 1.2 * (1 - emergeP));
            boxster.rotation.y = -0.8 + emergeP * 0.5;
            boxster.scale.setScalar(0.78 + emergeP * 0.22);
          } else if (p >= 0.36 && p <= 0.52) {
            // Full center focus
            boxster.position.set(0, 0, 0);
            boxster.rotation.y = -0.3 + (p - 0.36) * 0.3;
            boxster.scale.setScalar(1.0);
          } else {
            // Dissolving into 911
            const exitP = (p - 0.52) / 0.16;
            boxster.position.set(0, -exitP * 0.7, -exitP * 1.6);
            boxster.rotation.y = -0.25 + exitP * 0.6;
            boxster.scale.setScalar(1.0 - exitP * 0.24);
          }
        }
      } else {
        if (boxster) boxster.visible = false;
      }

      // --- PHASE 3: 911 (0.54 -> 1.00) ---
      if (p >= 0.54 && renderNineElevenInThree) {
        if (nineEleven) {
          nineEleven.visible = true;
          if (p < 0.70) {
            // Emerging from exact center point
            const emergeP = (p - 0.54) / 0.16;
            nineEleven.position.set(0, -0.6 * (1 - emergeP), 1.2 * (1 - emergeP));
            nineEleven.rotation.y = -0.85 + emergeP * 0.55;
            nineEleven.scale.setScalar(0.8 + emergeP * 0.2);
          } else if (p >= 0.70 && p <= 0.88) {
            // Full iconic focus
            nineEleven.position.set(0, 0, 0);
            nineEleven.rotation.y = -0.3 + (p - 0.70) * 0.35;
            nineEleven.scale.setScalar(1.0);
          } else {
            // Gliding gently upward into accessories boutique
            const outP = (p - 0.88) / 0.12;
            nineEleven.position.set(0, outP * 0.6, -outP * 0.8);
            nineEleven.rotation.y = -0.24 + outP * 0.2;
            nineEleven.scale.setScalar(1.0 - outP * 0.08);
          }
        }
      } else {
        if (nineEleven) nineEleven.visible = false;
      }

      // Camera choreography based on scroll progress
      if (p <= 0.33) {
        targetCamX = 4.8 + p * 0.8 + mouseCurrent.current.x;
        targetCamY = 1.8 - p * 0.3 + mouseCurrent.current.y;
        targetCamZ = 6.2 - p * 0.6;
      } else if (p > 0.33 && p <= 0.66) {
        const p2 = (p - 0.33) / 0.33;
        targetCamX = 4.4 - p2 * 0.4 + mouseCurrent.current.x;
        targetCamY = 1.5 + p2 * 0.2 + mouseCurrent.current.y;
        targetCamZ = 5.8 - p2 * 0.3;
      } else {
        const p3 = (p - 0.66) / 0.34;
        targetCamX = 4.6 + p3 * 0.6 + mouseCurrent.current.x;
        targetCamY = 1.6 - p3 * 0.2 + mouseCurrent.current.y;
        targetCamZ = 5.9 + p3 * 0.4;
      }

      // Interpolate camera smoothly
      camera.position.x += (targetCamX - camera.position.x) * 0.1;
      camera.position.y += (targetCamY - camera.position.y) * 0.1;
      camera.position.z += (targetCamZ - camera.position.z) * 0.1;
      camera.lookAt(0, targetLookAtY, 0);

      // Halo Scale & Position
      if (haloGroupRef.current) {
        const haloScale = 1.0 + Math.sin(p * Math.PI) * 0.22;
        haloGroupRef.current.scale.setScalar(haloScale);
      }

      // Render Scene
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material?.dispose();
          }
        }
      });

      renderer.dispose();
    };
  }, [onSceneReady]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block touch-none"
        style={{ width: "100%", height: "100%" }}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#F6F6F8] z-30 transition-opacity duration-700">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-neutral-300 border-t-neutral-900 animate-spin" />
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-500">
              INITIALIZING PORSCHE 3D WEBGL STUDIO...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
