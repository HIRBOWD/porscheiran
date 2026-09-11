"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { loadVehicleModel, VehicleKey } from "./ModelLoader";

interface VehicleCanvasProps {
  scrollProgress?: number; // 0 to 1 (legacy fallback)
  scrollProgressRef?: React.RefObject<number>; // Non-re-rendering ref for smooth 60-120fps updates
  onSceneReady?: () => void;
  renderMacanInThree?: boolean;
  renderBoxsterInThree?: boolean;
  renderNineElevenInThree?: boolean;
}

function VehicleCanvasComponent({
  scrollProgress,
  scrollProgressRef,
  onSceneReady,
  renderMacanInThree = true,
  renderBoxsterInThree = true,
  renderNineElevenInThree = true,
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

  // Cached materials for smooth opacity transitions
  const vehicleMaterialsRef = useRef<{
    macan: THREE.Material[];
    boxster: THREE.Material[];
    nineEleven: THREE.Material[];
  }>({ macan: [], boxster: [], nineEleven: [] });

  // 3D Halo Ring
  const haloGroupRef = useRef<THREE.Group | null>(null);

  // Lighting references for dynamic studio shifts
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const rimLightRef = useRef<THREE.DirectionalLight | null>(null);

  // Fallback normalized scroll ref when prop is used
  const fallbackProgressRef = useRef(scrollProgress ?? 0);
  useEffect(() => {
    if (scrollProgress !== undefined) {
      fallbackProgressRef.current = scrollProgress;
    }
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

    // 3. Initialize WebGL Renderer (Capped DPR to 1.5 to eliminate Retina GPU fill-rate lag)
    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 1.5);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    // 4. Studio Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    // Key Light (Overhead front three-quarter, optimized 1024x1024 shadow map)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(6, 12, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
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
    haloGroup.position.set(0, 0.65, 0);
    haloGroup.lookAt(camera.position.x, 0.65, camera.position.z);

    // Primary 3D Metallic Ring
    const haloRingGeo = new THREE.TorusGeometry(2.1, 0.015, 32, 160);
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
    const outerRingGeo = new THREE.TorusGeometry(2.22, 0.007, 16, 160);
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
      const tickGeo = new THREE.BoxGeometry(0.015, 0.12, 0.015);
      const tick = new THREE.Mesh(tickGeo, haloRingMat);
      tick.position.x = Math.cos(angle) * 2.1;
      tick.position.y = Math.sin(angle) * 2.1;
      tick.rotation.z = angle;
      haloGroup.add(tick);
    }

    // Porsche Red Accent Marker at Apex
    const markerGeo = new THREE.SphereGeometry(0.035, 16, 16);
    const markerMat = new THREE.MeshBasicMaterial({ color: 0xd5001c });
    const apexMarker = new THREE.Mesh(markerGeo, markerMat);
    apexMarker.position.set(0, 2.1, 0.02);
    haloGroup.add(apexMarker);

    scene.add(haloGroup);
    haloGroupRef.current = haloGroup;

    // Helper to collect materials from group for smooth opacity fading
    const collectMaterials = (group: THREE.Group): THREE.Material[] => {
      const mats: THREE.Material[] = [];
      group.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            list.forEach((m) => {
              if (!mats.includes(m)) {
                if (m.userData.origTransparent === undefined) {
                  m.userData.origTransparent = m.transparent;
                  m.userData.origDepthWrite = m.depthWrite;
                }
                mats.push(m);
              }
            });
          }
        }
      });
      return mats;
    };

    // Cached opacity levels to eliminate per-frame material iteration churn
    const currentOpacities = { macan: -1, boxster: -1, nineEleven: -1 };

    // Helper to adjust opacity of vehicle materials only when target opacity actually changes
    const updateVehicleOpacity = (
      key: "macan" | "boxster" | "nineEleven",
      materials: THREE.Material[],
      opacity: number
    ) => {
      const clamped = Math.max(0, Math.min(1, opacity));
      if (Math.abs(currentOpacities[key] - clamped) < 0.003) {
        return; // Skip redundant property iterations
      }
      currentOpacities[key] = clamped;

      const isFullyOpaque = clamped >= 0.995;
      for (let i = 0; i < materials.length; i++) {
        const mat = materials[i];
        mat.opacity = clamped;
        if (isFullyOpaque) {
          mat.transparent = mat.userData.origTransparent ?? false;
          mat.depthWrite = mat.userData.origDepthWrite ?? true;
        } else {
          mat.transparent = true;
          mat.depthWrite = clamped > 0.45;
        }
      }
    };

    // 7. Load all 3 Vehicles (with GLB support and procedural fallback)
    let isMounted = true;

    async function loadAllVehicles() {
      const keys: VehicleKey[] = ["macan", "boxster", "911"];
      const results = await Promise.all(keys.map((k) => loadVehicleModel(k)));

      if (!isMounted) return;

      const [macanRes, boxsterRes, nineElevenRes] = results;

      // Position models firmly grounded on floor (Y = 0) with wheels flush on contact shadow
      macanRes.group.position.set(0, 0, 0);
      boxsterRes.group.position.set(0, 0, 0);
      nineElevenRes.group.position.set(0, 0, 0);

      // Cache materials for zero-allocation opacity fading
      vehicleMaterialsRef.current = {
        macan: collectMaterials(macanRes.group),
        boxster: collectMaterials(boxsterRes.group),
        nineEleven: collectMaterials(nineElevenRes.group),
      };

      // Initially show only Macan (fully opaque), hide others
      macanRes.group.visible = true;
      boxsterRes.group.visible = false;
      nineElevenRes.group.visible = false;
      updateVehicleOpacity("macan", vehicleMaterialsRef.current.macan, 1.0);
      updateVehicleOpacity("boxster", vehicleMaterialsRef.current.boxster, 0.0);
      updateVehicleOpacity("nineEleven", vehicleMaterialsRef.current.nineEleven, 0.0);

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

    // 8. Visibility & Viewport Observer (Halts WebGL rendering when scrolled out of view)
    let isVisible = true;
    const container = containerRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.01 }
    );
    observer.observe(container);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isVisible = false;
      } else if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        isVisible = rect.bottom > 0 && rect.top < window.innerHeight;
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 9. Mouse Parallax & Scoped Drag Orbit Handler
    let isDragging = false;
    let prevMouseX = 0;
    let dragRotationY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        isDragging = true;
        prevMouseX = e.clientX;
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseTarget.current.x = normX * 0.35;
      mouseTarget.current.y = normY * 0.2;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        dragRotationY += deltaX * 0.005;
        prevMouseX = e.clientX;
      }
    };

    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // 10. Debounced Resize Handler
    let resizeTimer: number | null = null;
    const handleResize = () => {
      if (resizeTimer !== null) cancelAnimationFrame(resizeTimer);
      resizeTimer = requestAnimationFrame(() => {
        if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(w, h);
      });
    };

    window.addEventListener("resize", handleResize);

    // 11. Animation & Render Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Completely pause render pass and GPU compute when off-screen or tab is inactive
      if (!isVisible) return;

      const delta = clock.getDelta();
      const p = scrollProgressRef ? scrollProgressRef.current : fallbackProgressRef.current;

      // Mouse Parallax Smooth Damping
      mouseCurrent.current.x += (mouseTarget.current.x - mouseCurrent.current.x) * 0.05;
      mouseCurrent.current.y += (mouseTarget.current.y - mouseCurrent.current.y) * 0.05;

      // Rotate Halo Ring slowly
      if (haloGroupRef.current) {
        haloGroupRef.current.rotation.z -= delta * 0.08;
      }

      // -----------------------------------------------------------------------
      // REAL-TIME 3D SCROLL CHOREOGRAPHY (Clean Handoffs, Zero Mesh Collision)
      // -----------------------------------------------------------------------
      const macan = vehiclesRef.current.macan;
      const boxster = vehiclesRef.current.boxster;
      const nineEleven = vehiclesRef.current.nineEleven;
      const mats = vehicleMaterialsRef.current;

      // Base camera coordinates targeting halo & vehicle mid-height center (Y = 0.65)
      let targetCamX = 4.8 + mouseCurrent.current.x;
      let targetCamY = 1.95 + mouseCurrent.current.y;
      let targetCamZ = 6.2;
      const targetLookAtY = 0.65;

      // Decay drag rotation smoothly when not actively dragging
      if (!isDragging) {
        dragRotationY *= 0.94;
      }

      // Dynamic Contact Shadow Opacity
      let currentShadowOpacity = 0.85;

      // =======================================================================
      // PHASE 1: MACAN (p in [0.00, 0.30])
      // Full dominance in [0.00, 0.18], cinematic receding exit in [0.18, 0.30]
      // Completely hidden at p >= 0.305 -> Zero overlap with Boxster
      // =======================================================================
      if (p < 0.305 && renderMacanInThree) {
        if (macan) {
          macan.visible = true;
          if (p <= 0.18) {
            // Full center focus inside halo, grounded at Y = 0
            macan.position.set(0, 0, 0);
            macan.rotation.y = -0.32 + p * 0.22 + dragRotationY;
            macan.scale.setScalar(1.0);
            updateVehicleOpacity("macan", mats.macan, 1.0);
          } else {
            // Controlled cinematic exit: recedes smoothly into background depth
            const t = (p - 0.18) / 0.12; // 0 to 1
            const tSmooth = t * t; // Smooth acceleration curve
            macan.position.set(-1.4 * tSmooth, 0, -4.5 * tSmooth);
            macan.rotation.y = -0.28 + 0.35 * tSmooth + dragRotationY;
            macan.scale.setScalar(1.0 - 0.32 * tSmooth);
            const opacity = 1.0 - tSmooth;
            updateVehicleOpacity("macan", mats.macan, opacity);
            currentShadowOpacity = Math.max(0.08, 0.85 * opacity);
          }
        }
      } else {
        if (macan) {
          macan.visible = false;
          updateVehicleOpacity("macan", mats.macan, 0.0);
        }
      }

      // =======================================================================
      // PHASE 2: BOXSTER (p in [0.31, 0.645])
      // Enters at p = 0.31 after Macan has fully exited and cleared the center
      // Full dominance in [0.42, 0.53], cinematic receding exit in [0.53, 0.645]
      // Completely hidden at p < 0.31 and p >= 0.645 -> Zero collision
      // =======================================================================
      if (p >= 0.31 && p < 0.645 && renderBoxsterInThree) {
        if (boxster) {
          boxster.visible = true;
          if (p < 0.42) {
            // Controlled cinematic entrance: glides from perspective into center
            const t = (p - 0.31) / 0.11; // 0 to 1
            const tEase = 1 - (1 - t) * (1 - t); // Smooth deceleration curve
            boxster.position.set(1.2 * (1 - tEase), 0, 3.6 * (1 - tEase));
            boxster.rotation.y = -0.65 + 0.35 * tEase + dragRotationY;
            boxster.scale.setScalar(0.85 + 0.15 * tEase);
            const opacity = tEase;
            updateVehicleOpacity("boxster", mats.boxster, opacity);
            currentShadowOpacity = Math.max(0.08, 0.85 * opacity);
          } else if (p >= 0.42 && p <= 0.53) {
            // Full center focus inside halo, grounded at Y = 0
            boxster.position.set(0, 0, 0);
            boxster.rotation.y = -0.30 + (p - 0.42) * 0.20 + dragRotationY;
            boxster.scale.setScalar(1.0);
            updateVehicleOpacity("boxster", mats.boxster, 1.0);
            currentShadowOpacity = 0.85;
          } else {
            // Controlled cinematic exit: recedes smoothly into background depth
            const t = (p - 0.53) / 0.115; // 0 to 1
            const tSmooth = t * t;
            boxster.position.set(1.4 * tSmooth, 0, -4.5 * tSmooth);
            boxster.rotation.y = -0.278 - 0.35 * tSmooth + dragRotationY;
            boxster.scale.setScalar(1.0 - 0.32 * tSmooth);
            const opacity = 1.0 - tSmooth;
            updateVehicleOpacity("boxster", mats.boxster, opacity);
            currentShadowOpacity = Math.max(0.08, 0.85 * opacity);
          }
        }
      } else {
        if (boxster) {
          boxster.visible = false;
          updateVehicleOpacity("boxster", mats.boxster, 0.0);
        }
      }

      // =======================================================================
      // PHASE 3: 911 (p >= 0.65)
      // Enters at p = 0.65 after Boxster has fully exited and cleared the center
      // Full iconic focus in [0.75, 0.88], graceful descent into boutique store for p > 0.88
      // Completely hidden at p < 0.65 -> Zero collision
      // =======================================================================
      if (p >= 0.65 && renderNineElevenInThree) {
        if (nineEleven) {
          nineEleven.visible = true;
          if (p < 0.75) {
            // Controlled cinematic entrance: glides from perspective into center
            const t = (p - 0.65) / 0.10; // 0 to 1
            const tEase = 1 - (1 - t) * (1 - t);
            nineEleven.position.set(-1.2 * (1 - tEase), 0, 3.6 * (1 - tEase));
            nineEleven.rotation.y = -0.65 + 0.35 * tEase + dragRotationY;
            nineEleven.scale.setScalar(0.85 + 0.15 * tEase);
            const opacity = tEase;
            updateVehicleOpacity("nineEleven", mats.nineEleven, opacity);
            currentShadowOpacity = Math.max(0.08, 0.85 * opacity);
          } else if (p >= 0.75 && p <= 0.88) {
            // Full iconic center focus inside halo, grounded at Y = 0
            nineEleven.position.set(0, 0, 0);
            nineEleven.rotation.y = -0.30 + (p - 0.75) * 0.20 + dragRotationY;
            nineEleven.scale.setScalar(1.0);
            updateVehicleOpacity("nineEleven", mats.nineEleven, 1.0);
            currentShadowOpacity = 0.85;
          } else {
            // Gliding smoothly into the accessories boutique
            const t = (p - 0.88) / 0.12;
            nineEleven.position.set(0, 0, -2.2 * t);
            nineEleven.rotation.y = -0.274 + 0.15 * t + dragRotationY;
            nineEleven.scale.setScalar(1.0 - 0.15 * t);
            const opacity = 1.0 - 0.65 * t;
            updateVehicleOpacity("nineEleven", mats.nineEleven, opacity);
            currentShadowOpacity = Math.max(0.15, 0.85 * opacity);
          }
        }
      } else {
        if (nineEleven) {
          nineEleven.visible = false;
          updateVehicleOpacity("nineEleven", mats.nineEleven, 0.0);
        }
      }

      // Update Contact Shadow disc opacity
      contactShadow.material.opacity = currentShadowOpacity;

      // Studio Camera choreography based on scroll progress
      if (p <= 0.33) {
        targetCamX = 4.8 + p * 0.7 + mouseCurrent.current.x;
        targetCamY = 1.95 - p * 0.2 + mouseCurrent.current.y;
        targetCamZ = 6.2 - p * 0.5;
      } else if (p > 0.33 && p <= 0.66) {
        const p2 = (p - 0.33) / 0.33;
        targetCamX = 4.5 - p2 * 0.3 + mouseCurrent.current.x;
        targetCamY = 1.75 + p2 * 0.2 + mouseCurrent.current.y;
        targetCamZ = 5.8 - p2 * 0.2;
      } else {
        const p3 = (p - 0.66) / 0.34;
        targetCamX = 4.6 + p3 * 0.5 + mouseCurrent.current.x;
        targetCamY = 1.85 - p3 * 0.15 + mouseCurrent.current.y;
        targetCamZ = 5.9 + p3 * 0.3;
      }

      // Interpolate camera smoothly towards target
      camera.position.x += (targetCamX - camera.position.x) * 0.1;
      camera.position.y += (targetCamY - camera.position.y) * 0.1;
      camera.position.z += (targetCamZ - camera.position.z) * 0.1;
      camera.lookAt(0, targetLookAtY, 0);

      // Halo Scale & Position
      if (haloGroupRef.current) {
        const haloScale = 1.0 + Math.sin(p * Math.PI) * 0.08;
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
      if (resizeTimer !== null) cancelAnimationFrame(resizeTimer);
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
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
  }, [onSceneReady, renderMacanInThree, renderBoxsterInThree, renderNineElevenInThree, scrollProgressRef]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-auto select-none z-0 overflow-hidden cursor-grab active:cursor-grabbing"
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

const VehicleCanvas = React.memo(VehicleCanvasComponent);
export default VehicleCanvas;
