"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { loadVehicleModel, VehicleKey } from "./ModelLoader";

interface VehicleCanvasProps {
  scrollProgress?: number; // 0 to 1 (legacy fallback)
  scrollProgressRef?: React.RefObject<number>; // Non-re-rendering ref for smooth 60-120fps updates
  onSceneReady?: () => void;
  renderGt3InThree?: boolean;
}

function VehicleCanvasComponent({
  scrollProgress,
  scrollProgressRef,
  onSceneReady,
  renderGt3InThree = true,
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
    gt3?: THREE.Group;
  }>({});

  // Cached materials for smooth opacity transitions
  const vehicleMaterialsRef = useRef<{
    gt3: THREE.Material[];
  }>({ gt3: [] });

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

    // 2. Initialize Camera with Mobile Aspect Ratio Awareness
    const aspect = width / height;
    const isMobile = width < 768 || (typeof window !== "undefined" && window.innerWidth < 768);
    const camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 100);
    camera.position.set(4.8, 1.8, 6.2);
    camera.lookAt(0, 0.45, 0);
    cameraRef.current = camera;

    // 3. Initialize WebGL Renderer with High Showroom Quality on all devices
    const dpr = Math.min(
      typeof window !== "undefined" ? window.devicePixelRatio : 1,
      isMobile ? 1.45 : 1.5
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true, // Native MSAA for crisp silhouettes, spoiler, and wheels
      alpha: true,
      powerPreference: "high-performance",
      precision: "highp", // True 32-bit PBR metallic reflection precision
      stencil: false,
      depth: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);

    // High-fidelity PCF shadow map: hardware-accelerated on mobile, soft Poisson on desktop
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = isMobile ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    // Studio IBL Environment: Softbox and light panel reflections for metallic car paint & wheels
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const envMap = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    scene.environment = envMap;

    // 4. Studio Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    ambientLight.matrixAutoUpdate = false;
    ambientLight.updateMatrix();
    scene.add(ambientLight);

    // Key Light (Overhead front three-quarter)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.85);
    keyLight.position.set(6, 12, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = isMobile ? 512 : 1024;
    keyLight.shadow.mapSize.height = isMobile ? 512 : 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 30;
    keyLight.shadow.camera.left = -6;
    keyLight.shadow.camera.right = 6;
    keyLight.shadow.camera.top = 6;
    keyLight.shadow.camera.bottom = -6;
    keyLight.shadow.bias = -0.0005;
    keyLight.matrixAutoUpdate = false;
    keyLight.updateMatrix();
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    // Fill Light (Left side soft illumination)
    const fillLight = new THREE.DirectionalLight(0xe8eeff, 0.85);
    fillLight.position.set(-8, 5, 4);
    fillLight.matrixAutoUpdate = false;
    fillLight.updateMatrix();
    scene.add(fillLight);

    // Rim / Back Light (Crisp vehicle silhouette edge reflections)
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.45);
    rimLight.position.set(-5, 9, -8);
    rimLight.matrixAutoUpdate = false;
    rimLight.updateMatrix();
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    // Top Overhead Soft Spotlight: Illuminates carbon fiber roof and swan-neck wing on both mobile & desktop
    const topLight = new THREE.PointLight(0xffffff, 1.25, 20);
    topLight.position.set(0, 8, 0);
    topLight.matrixAutoUpdate = false;
    topLight.updateMatrix();
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
    ground.matrixAutoUpdate = false;
    ground.updateMatrix();
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
    contactShadow.matrixAutoUpdate = false;
    contactShadow.updateMatrix();
    scene.add(contactShadow);

    // 6. 3D Circular Halo Ring (Precision Architectural Ring with mobile polygon budget)
    const haloGroup = new THREE.Group();
    haloGroup.position.set(0, 0.65, 0);
    haloGroup.lookAt(camera.position.x, 0.65, camera.position.z);

    // Primary 3D Metallic Ring
    const haloRingGeo = new THREE.TorusGeometry(
      2.1,
      0.015,
      isMobile ? 16 : 32,
      isMobile ? 80 : 160
    );
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
    const outerRingGeo = new THREE.TorusGeometry(
      2.22,
      0.007,
      isMobile ? 8 : 16,
      isMobile ? 80 : 160
    );
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
    const currentOpacities = { gt3: -1 };

    // Helper to adjust opacity of vehicle materials only when target opacity actually changes
    const updateVehicleOpacity = (
      key: "gt3",
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

    // 7. Load 911 GT3 RS Vehicle (with GLB support and procedural fallback)
    let isMounted = true;

    async function loadAllVehicles() {
      const gt3Res = await loadVehicleModel("gt3");

      if (!isMounted) return;

      // Position model firmly grounded on floor (Y = 0) with wheels flush on contact shadow
      gt3Res.group.position.set(0, 0, 0);

      // Cache materials for zero-allocation opacity fading
      vehicleMaterialsRef.current = {
        gt3: collectMaterials(gt3Res.group),
      };

      // Show GT3 (fully opaque) inside halo
      gt3Res.group.visible = true;
      updateVehicleOpacity("gt3", vehicleMaterialsRef.current.gt3, 1.0);

      scene.add(gt3Res.group);

      // Pre-compile all 88 materials and shaders on GPU to eliminate runtime compilation hitches
      renderer.compile(scene, camera);

      vehiclesRef.current = {
        gt3: gt3Res.group,
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

    // Track aspect ratio for responsive portrait framing
    let currentAspect = width / height;

    // 9. Mouse & Touch Parallax & Scoped Drag Orbit Handler
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

    // Mobile touch handling: Horizontal swipe rotates vehicle; vertical swipe preserves fluid native scrolling
    let touchStartX = 0;
    let touchStartY = 0;
    let isTouchHorizontal = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isTouchHorizontal = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const clientX = e.touches[0].clientX;
        const clientY = e.touches[0].clientY;
        const dx = clientX - touchStartX;
        const dy = clientY - touchStartY;

        // Detect horizontal intent for 3D orbit rotation without blocking native vertical scroll
        if (!isTouchHorizontal && Math.abs(dx) > Math.abs(dy) + 4) {
          isTouchHorizontal = true;
          isDragging = true;
        }

        if (isTouchHorizontal) {
          dragRotationY += dx * 0.007;
          touchStartX = clientX;
          touchStartY = clientY;
        }
      }
    };

    const handleTouchEnd = () => {
      isTouchHorizontal = false;
      isDragging = false;
    };

    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    // 10. Debounced Resize Handler with Mobile Address-Bar Shield
    let lastWidth = width;
    let lastHeight = height;
    let resizeTimer: number | null = null;

    const handleResize = () => {
      if (resizeTimer !== null) cancelAnimationFrame(resizeTimer);
      resizeTimer = requestAnimationFrame(() => {
        if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;

        // Ignore address bar expand/collapse jitter on mobile (only resize WebGL framebuffer on true orientation change)
        const isMobileDevice = w < 768 || (typeof window !== "undefined" && window.innerWidth < 768);
        if (isMobileDevice && Math.abs(w - lastWidth) < 2 && Math.abs(h - lastHeight) < 120) {
          currentAspect = w / h;
          cameraRef.current.aspect = currentAspect;
          cameraRef.current.updateProjectionMatrix();
          return;
        }

        lastWidth = w;
        lastHeight = h;
        currentAspect = w / h;
        cameraRef.current.aspect = currentAspect;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(w, h);
      });
    };

    window.addEventListener("resize", handleResize);

    // 11. Single Coordinated Animation & Render Loop (Unified on GSAP Ticker)
    let smoothedP = scrollProgressRef
      ? Math.max(0, Math.min(1, scrollProgressRef.current))
      : 0;

    const animate = (time: number, deltaTime: number) => {
      // Completely pause render pass and GPU compute when off-screen or tab is inactive
      if (!isVisible) return;

      const delta = Math.min((deltaTime || 16.66) / 1000, 0.1);
      const targetP = Math.max(
        0,
        Math.min(
          1,
          scrollProgressRef
            ? scrollProgressRef.current
            : fallbackProgressRef.current
        )
      );

      // Framerate-independent exponential smoothing for buttery-smooth car rotation & transitions
      // Adapts seamlessly to 60Hz, 90Hz, 120Hz ProMotion displays without stepping or lag
      const smoothFactor = 1 - Math.exp(-14 * delta);
      smoothedP += (targetP - smoothedP) * smoothFactor;
      const p = Math.abs(targetP - smoothedP) < 0.00005 ? targetP : smoothedP;

      // Mouse Parallax Smooth Damping (Desktop only)
      if (!isMobile) {
        mouseCurrent.current.x += (mouseTarget.current.x - mouseCurrent.current.x) * 0.05;
        mouseCurrent.current.y += (mouseTarget.current.y - mouseCurrent.current.y) * 0.05;
      }

      // Rotate Halo Ring slowly
      if (haloGroupRef.current) {
        haloGroupRef.current.rotation.z -= delta * 0.08;
      }

      // -----------------------------------------------------------------------
      // REAL-TIME 3D SCROLL CHOREOGRAPHY (911 GT3 RS Showcase)
      // -----------------------------------------------------------------------
      const gt3 = vehiclesRef.current.gt3;

      // Responsive portrait framing: Automatically adapt camera distance for narrow mobile screens
      const mobileScale = Math.min(1.95, Math.max(1.0, 0.88 / currentAspect));

      // Base camera coordinates targeting halo & vehicle mid-height center (Y = 0.65)
      let baseCamX = 4.8;
      let baseCamY = 1.95;
      let baseCamZ = 6.2;
      const targetLookAtY = 0.65;

      // Decay drag rotation smoothly when not actively dragging
      if (!isDragging) {
        dragRotationY *= 0.94;
        if (Math.abs(dragRotationY) < 0.0001) dragRotationY = 0;
      }

      // Dynamic Contact Shadow Opacity
      let currentShadowOpacity = 0.85;

      // =======================================================================
      // 911 GT3 RS: PROPORTIONAL CHOREOGRAPHY (Silky Smooth Scroll Response)
      // Center stage dominance inside halo for p in [0.00, 0.55]
      // Smooth descent towards accessories boutique for p in [0.55, 1.00]
      // =======================================================================
      if (gt3 && renderGt3InThree) {
        gt3.visible = true;
        if (p <= 0.55) {
          // Full center focus inside halo, grounded firmly at Y = 0
          gt3.position.set(0, 0, 0);
          // Continuous, silky smooth scroll-to-car rotation
          gt3.rotation.y = -0.38 + p * 0.55 + dragRotationY;
          gt3.scale.setScalar(1.0);
          currentShadowOpacity = 0.85;
        } else {
          // Smooth glide down into the accessories boutique with cubic ease-in-out
          const rawT = (p - 0.55) / 0.45;
          const t = rawT * rawT * (3 - 2 * rawT);
          gt3.position.set(0, 0, -2.4 * t);
          gt3.rotation.y = -0.38 + 0.55 * 0.55 + 0.15 * t + dragRotationY;
          gt3.scale.setScalar(1.0 - 0.18 * t);
          currentShadowOpacity = Math.max(0.15, 0.85 * (1.0 - t * 0.65));
        }
      }

      // Update Contact Shadow disc opacity only when value meaningfully changes
      if (Math.abs(contactShadow.material.opacity - currentShadowOpacity) > 0.015) {
        contactShadow.material.opacity = currentShadowOpacity;
      }

      // Studio Camera choreography for 911 GT3 RS with smooth cubic ease-in-out
      const rawCamT = Math.min(1, Math.max(0, p / 0.60));
      const camT = rawCamT * rawCamT * (3 - 2 * rawCamT);
      baseCamX = 4.8 + camT * 0.35;
      baseCamY = 1.92 - camT * 0.12;
      baseCamZ = 6.1 - camT * 0.3;

      const targetCamX = baseCamX * mobileScale + mouseCurrent.current.x;
      const targetCamY = baseCamY * (0.85 + 0.15 * mobileScale) + mouseCurrent.current.y;
      const targetCamZ = baseCamZ * mobileScale;

      // Lockstep camera tracking: smooth and unified with car rotation
      camera.position.set(targetCamX, targetCamY, targetCamZ);
      camera.lookAt(0, targetLookAtY, 0);

      // Halo Scale & Position
      if (haloGroupRef.current) {
        const haloScale = 1.0 + Math.sin(p * Math.PI) * 0.08;
        haloGroupRef.current.scale.setScalar(haloScale);
      }

      // Render Scene
      renderer.render(scene, camera);
    };

    // Register with unified GSAP master ticker (guarantees single coordinated frame loop)
    gsap.ticker.add(animate);

    // Cleanup
    return () => {
      isMounted = false;
      gsap.ticker.remove(animate);
      if (resizeTimer !== null) cancelAnimationFrame(resizeTimer);
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
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

      pmremGenerator.dispose();
      envMap.dispose();
      renderer.dispose();
    };
  }, [onSceneReady, renderGt3InThree, scrollProgressRef]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-auto select-none z-0 overflow-hidden cursor-grab active:cursor-grabbing"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block touch-pan-y"
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
