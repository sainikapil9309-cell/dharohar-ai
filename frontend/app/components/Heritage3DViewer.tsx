"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export type ViewMode = "mesh" | "pointcloud" | "panorama";

interface Heritage3DViewerProps {
  imageUrl: string;
  title: string;
  subtitle?: string;
  initialDepthMapUrl?: string;
  onClose: () => void;
}

// Turbo / Magma style depth colorizer for LiDAR heatmap mode
function depthToColor(normDepth: number): [number, number, number] {
  // normDepth: 0.0 (far / deep) to 1.0 (near / relief)
  // 0.0 -> deep purple/blue, 0.5 -> emerald/amber, 1.0 -> bright gold/white
  const t = Math.max(0, Math.min(1, normDepth));
  if (t < 0.25) {
    const s = t / 0.25;
    return [0.1 + 0.1 * s, 0.1 + 0.3 * s, 0.5 + 0.4 * s]; // Deep Indigo to Cyan
  } else if (t < 0.5) {
    const s = (t - 0.25) / 0.25;
    return [0.2 + 0.1 * s, 0.4 + 0.4 * s, 0.9 - 0.5 * s]; // Cyan to Green
  } else if (t < 0.75) {
    const s = (t - 0.5) / 0.25;
    return [0.3 + 0.6 * s, 0.8 + 0.1 * s, 0.4 - 0.3 * s]; // Green to Amber/Yellow
  } else {
    const s = (t - 0.75) / 0.25;
    return [0.9 + 0.1 * s, 0.9 - 0.3 * s, 0.1 + 0.5 * s]; // Amber to Warm Gold/White
  }
}

// Fast browser-side Canvas depth fallback to ensure instant (<30ms) scene load
function generateClientDepthMap(img: HTMLImageElement): { depthData: Float32Array; width: number; height: number; dataUrl: string } {
  const canvas = document.createElement("canvas");
  const maxDim = 256;
  const scale = Math.min(maxDim / Math.max(img.width, img.height), 1.0);
  const w = Math.max(32, Math.floor(img.width * scale));
  const h = Math.max(32, Math.floor(img.height * scale));
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { depthData: new Float32Array(w * h).fill(0.5), width: w, height: h, dataUrl: "" };
  }

  ctx.drawImage(img, 0, 0, w, h);
  const imgData = ctx.getImageData(0, 0, w, h);
  const pixels = imgData.data;
  const depthData = new Float32Array(w * h);
  const outImgData = ctx.createImageData(w, h);

  for (let y = 0; y < h; y++) {
    const yNorm = 1.0 - y / (h - 1); // 1.0 bottom, 0.0 top
    const yPrior = 0.4 + 0.5 * yNorm;
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const r = pixels[idx];
      const g = pixels[idx + 1];
      const b = pixels[idx + 2];
      const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0;

      // Center perspective weighting
      const xNorm = (x / (w - 1)) * 2.0 - 1.0;
      const xDist = 1.0 - 0.25 * (xNorm * xNorm);

      const d = Math.max(0, Math.min(1, 0.5 * yPrior * xDist + 0.5 * lum));
      const pos = y * w + x;
      depthData[pos] = d;

      const outIdx = pos * 4;
      const grayByte = Math.floor(d * 255);
      outImgData.data[outIdx] = grayByte;
      outImgData.data[outIdx + 1] = grayByte;
      outImgData.data[outIdx + 2] = grayByte;
      outImgData.data[outIdx + 3] = 255;
    }
  }

  ctx.putImageData(outImgData, 0, 0);
  return { depthData, width: w, height: h, dataUrl: canvas.toDataURL("image/jpeg", 0.8) };
}

export default function Heritage3DViewer({
  imageUrl,
  title,
  subtitle,
  initialDepthMapUrl,
  onClose,
}: Heritage3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const [viewMode, setViewMode] = useState<ViewMode>("mesh");
  const [extrusion, setExtrusion] = useState<number>(0.9);
  const [pointSize, setPointSize] = useState<number>(2.2);
  const [pointCloudColorMode, setPointCloudColorMode] = useState<"photo" | "heatmap">("photo");
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [showDepthPiP, setShowDepthPiP] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [depthMapSrc, setDepthMapSrc] = useState<string>(initialDepthMapUrl || "");
  const [modelStatus, setModelStatus] = useState<string>("Initializing WebGL 3D...");

  // Refs for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const pointCloudRef = useRef<THREE.Points | null>(null);
  const panoramaMeshRef = useRef<THREE.Mesh | null>(null);

  const depthGridRef = useRef<{ data: Float32Array; width: number; height: number } | null>(null);
  const photoTextureRef = useRef<THREE.Texture | null>(null);
  const aspectRef = useRef<number>(1.33);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Main Three.js Scene Setup & Depth Fetch
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    let animationFrameId: number;
    let isDisposed = false;

    // 1. Setup Three.js Scene, Camera, Renderer
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfcfbf9); // Dharohar AI warm white theme
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.2;
    controls.maxDistance = 15;
    controls.minDistance = 0.5;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const dirLightWarm = new THREE.DirectionalLight(0xfff6ea, 1.25);
    dirLightWarm.position.set(4, 6, 6);
    scene.add(dirLightWarm);

    const dirLightCool = new THREE.DirectionalLight(0xe0f2fe, 0.5);
    dirLightCool.position.set(-4, -2, 4);
    scene.add(dirLightCool);

    // Subtle Ground Grid
    const gridHelper = new THREE.GridHelper(8, 20, 0xe2e8f0, 0xf1f5f9);
    gridHelper.position.y = -1.6;
    scene.add(gridHelper);

    // 2. Load Image & Compute Depth
    setIsLoading(true);
    setModelStatus("Generating monocular depth estimation...");

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = async () => {
      if (isDisposed) return;
      const aspect = img.width / img.height;
      aspectRef.current = aspect;

      // Immediate client-side fallback depth map
      const clientDepth = generateClientDepthMap(img);
      depthGridRef.current = { data: clientDepth.depthData, width: clientDepth.width, height: clientDepth.height };
      if (!depthMapSrc) {
        setDepthMapSrc(clientDepth.dataUrl);
      }

      // Load texture for Three.js
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(imageUrl, (tex) => {
        if (isDisposed) return;
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.colorSpace = THREE.SRGBColorSpace;
        photoTextureRef.current = tex;

        build3DModels(scene, tex, depthGridRef.current!, aspect, extrusion, pointSize, pointCloudColorMode);
        setIsLoading(false);
        setModelStatus("Monocular 3D view rendered successfully");
      });

      // Now query backend /api/depth-estimate for bilateral edge-preserved depth upgrade
      try {
        const formData = new FormData();
        formData.append("image_url", imageUrl);

        const rawApiBase = (process.env.NEXT_PUBLIC_API_URL || "").trim().replace(/\/$/, "");
        const depthEndpoint = rawApiBase ? `${rawApiBase}/api/depth-estimate` : "/api/depth-estimate";
        const resp = await fetch(depthEndpoint, {
          method: "POST",
          body: formData,
        });

        if (resp.ok) {
          const json = await resp.json();
          if (json.status === "success" && json.depth_map_base64 && !isDisposed) {
            setDepthMapSrc(json.depth_map_base64);

            // Decode high-res backend depth map to update vertex heights
            const depthImg = new Image();
            depthImg.src = json.depth_map_base64;
            depthImg.onload = () => {
              if (isDisposed) return;
              const dCanvas = document.createElement("canvas");
              dCanvas.width = depthImg.width;
              dCanvas.height = depthImg.height;
              const dCtx = dCanvas.getContext("2d");
              if (dCtx) {
                dCtx.drawImage(depthImg, 0, 0);
                const dData = dCtx.getImageData(0, 0, depthImg.width, depthImg.height).data;
                const newFloat = new Float32Array(depthImg.width * depthImg.height);
                for (let k = 0; k < newFloat.length; k++) {
                  newFloat[k] = dData[k * 4] / 255.0;
                }
                depthGridRef.current = { data: newFloat, width: depthImg.width, height: depthImg.height };

                if (photoTextureRef.current) {
                  build3DModels(scene, photoTextureRef.current, depthGridRef.current, aspect, extrusion, pointSize, pointCloudColorMode);
                }
                setModelStatus("Enhanced with Guided Bilateral Depth Estimation");
              }
            };
          }
        }
      } catch {
        // Client-side fallback depth continues uninterrupted
        setModelStatus("Displaying high-performance client depth model");
      }
    };

    // 3. Render Animation Loop
    function animate() {
      if (isDisposed) return;
      animationFrameId = requestAnimationFrame(animate);
      if (controlsRef.current) controlsRef.current.update();
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    }
    animate();

    // 4. Resize Listener
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
      }
    };
  }, [imageUrl]);

  // Construct or Rebuild 3D Meshes, Point Cloud, and Panorama
  function build3DModels(
    scene: THREE.Scene,
    texture: THREE.Texture,
    depth: { data: Float32Array; width: number; height: number },
    aspect: number,
    extrudeScale: number,
    ptSize: number,
    colorMode: "photo" | "heatmap"
  ) {
    // Clean up previous objects
    if (meshRef.current) {
      scene.remove(meshRef.current);
      meshRef.current.geometry.dispose();
      meshRef.current = null;
    }
    if (pointCloudRef.current) {
      scene.remove(pointCloudRef.current);
      pointCloudRef.current.geometry.dispose();
      pointCloudRef.current = null;
    }
    if (panoramaMeshRef.current) {
      scene.remove(panoramaMeshRef.current);
      panoramaMeshRef.current.geometry.dispose();
      panoramaMeshRef.current = null;
    }

    const planeW = aspect >= 1 ? 3.0 : 3.0 * aspect;
    const planeH = aspect >= 1 ? 3.0 / aspect : 3.0;
    const segsX = 140;
    const segsY = 140;

    // --- 1. 3D Relief Mesh ---
    const planeGeo = new THREE.PlaneGeometry(planeW, planeH, segsX, segsY);
    const posAttr = planeGeo.attributes.position;
    const uvAttr = planeGeo.attributes.uv;

    for (let i = 0; i < posAttr.count; i++) {
      const u = uvAttr.getX(i);
      const v = uvAttr.getY(i);
      const dX = Math.floor(u * (depth.width - 1));
      const dY = Math.floor((1.0 - v) * (depth.height - 1));
      const dVal = depth.data[dY * depth.width + dX] || 0;
      posAttr.setZ(i, (dVal - 0.5) * extrudeScale);
    }
    planeGeo.computeVertexNormals();

    const meshMat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.7,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
    const reliefMesh = new THREE.Mesh(planeGeo, meshMat);
    reliefMesh.castShadow = true;
    reliefMesh.receiveShadow = true;
    meshRef.current = reliefMesh;

    // --- 2. Textured Point Cloud (LiDAR style) ---
    const ptStep = 1;
    const ptCols = Math.floor(segsX / ptStep);
    const ptRows = Math.floor(segsY / ptStep);
    const totalPoints = ptCols * ptRows;

    const ptPositions = new Float32Array(totalPoints * 3);
    const ptColors = new Float32Array(totalPoints * 3);

    // Sample pixel RGB from texture image
    const canvas = document.createElement("canvas");
    canvas.width = depth.width;
    canvas.height = depth.height;
    const ctx = canvas.getContext("2d");
    if (texture.image && ctx) {
      try {
        ctx.drawImage(texture.image as unknown as CanvasImageSource, 0, 0, depth.width, depth.height);
      } catch {
        // Fallback if cross-origin
      }
    }
    const colorData = ctx ? ctx.getImageData(0, 0, depth.width, depth.height).data : null;

    let pIdx = 0;
    for (let py = 0; py < ptRows; py++) {
      const v = py / (ptRows - 1);
      const y = (v - 0.5) * planeH;
      const dY = Math.floor((1.0 - v) * (depth.height - 1));

      for (let px = 0; px < ptCols; px++) {
        const u = px / (ptCols - 1);
        const x = (u - 0.5) * planeW;
        const dX = Math.floor(u * (depth.width - 1));

        const dVal = depth.data[dY * depth.width + dX] || 0;
        const z = (dVal - 0.5) * extrudeScale;

        ptPositions[pIdx * 3] = x;
        ptPositions[pIdx * 3 + 1] = y;
        ptPositions[pIdx * 3 + 2] = z;

        if (colorMode === "heatmap") {
          const [hr, hg, hb] = depthToColor(dVal);
          ptColors[pIdx * 3] = hr;
          ptColors[pIdx * 3 + 1] = hg;
          ptColors[pIdx * 3 + 2] = hb;
        } else if (colorData) {
          const cPos = (dY * depth.width + dX) * 4;
          ptColors[pIdx * 3] = (colorData[cPos] || 180) / 255.0;
          ptColors[pIdx * 3 + 1] = (colorData[cPos + 1] || 160) / 255.0;
          ptColors[pIdx * 3 + 2] = (colorData[cPos + 2] || 140) / 255.0;
        } else {
          ptColors[pIdx * 3] = 0.85;
          ptColors[pIdx * 3 + 1] = 0.65;
          ptColors[pIdx * 3 + 2] = 0.45;
        }
        pIdx++;
      }
    }

    const ptGeo = new THREE.BufferGeometry();
    ptGeo.setAttribute("position", new THREE.BufferAttribute(ptPositions, 3));
    ptGeo.setAttribute("color", new THREE.BufferAttribute(ptColors, 3));

    const ptMat = new THREE.PointsMaterial({
      size: ptSize * 0.015,
      vertexColors: true,
      sizeAttenuation: true,
    });
    const pointCloud = new THREE.Points(ptGeo, ptMat);
    pointCloudRef.current = pointCloud;

    // --- 3. 360° Spherical / Cylindrical Panorama ---
    // Curved projection wrapping 180-240 degrees around the viewer
    const cylinderRadius = 2.8;
    const cylinderGeo = new THREE.CylinderGeometry(
      cylinderRadius,
      cylinderRadius,
      planeH * 1.3,
      64,
      1,
      true,
      Math.PI * 0.65,
      Math.PI * 0.7
    );
    cylinderGeo.scale(-1, 1, 1); // Flip inside out so texture is visible inside

    const panoMat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,
    });
    const panoMesh = new THREE.Mesh(cylinderGeo, panoMat);
    panoMesh.position.set(0, 0, 0);
    panoramaMeshRef.current = panoMesh;

    // Activate the selected mode
    updateActiveViewMode(viewMode, reliefMesh, pointCloud, panoMesh);
  }

  // Update which 3D object is visible based on mode
  function updateActiveViewMode(
    mode: ViewMode,
    mesh = meshRef.current,
    pts = pointCloudRef.current,
    pano = panoramaMeshRef.current
  ) {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    // Remove all 3 first
    if (mesh && scene.children.includes(mesh)) scene.remove(mesh);
    if (pts && scene.children.includes(pts)) scene.remove(pts);
    if (pano && scene.children.includes(pano)) scene.remove(pano);

    if (mode === "mesh" && mesh) {
      scene.add(mesh);
      if (controlsRef.current) {
        controlsRef.current.minDistance = 0.8;
        controlsRef.current.maxDistance = 12;
      }
    } else if (mode === "pointcloud" && pts) {
      scene.add(pts);
      if (controlsRef.current) {
        controlsRef.current.minDistance = 0.8;
        controlsRef.current.maxDistance = 12;
      }
    } else if (mode === "panorama" && pano) {
      scene.add(pano);
      if (controlsRef.current) {
        controlsRef.current.minDistance = 0.1;
        controlsRef.current.maxDistance = 6;
      }
    }
  }

  // Handle View Mode switch
  const handleModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    updateActiveViewMode(mode);
    if (mode === "panorama" && cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 0, 0.1);
      controlsRef.current.target.set(0, 0, -2);
      controlsRef.current.update();
    } else if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 0, 4.2);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  // Real-time Extrusion depth update without rebuilding whole scene
  useEffect(() => {
    if (!meshRef.current || !depthGridRef.current) return;
    const mesh = meshRef.current;
    const depth = depthGridRef.current;
    const posAttr = mesh.geometry.attributes.position;
    const uvAttr = mesh.geometry.attributes.uv;

    for (let i = 0; i < posAttr.count; i++) {
      const u = uvAttr.getX(i);
      const v = uvAttr.getY(i);
      const dX = Math.floor(u * (depth.width - 1));
      const dY = Math.floor((1.0 - v) * (depth.height - 1));
      const dVal = depth.data[dY * depth.width + dX] || 0;
      posAttr.setZ(i, (dVal - 0.5) * extrusion);
    }
    posAttr.needsUpdate = true;
    mesh.geometry.computeVertexNormals();

    // Also update point cloud Z values if present
    if (pointCloudRef.current) {
      const ptPos = pointCloudRef.current.geometry.attributes.position;
      const count = ptPos.count;
      for (let p = 0; p < count; p++) {
        // Z is in array index p * 3 + 2
        const rawZ = ptPos.getZ(p);
        const ratio = extrusion / (rawZ !== 0 ? Math.abs(rawZ) : 1);
        // rescale towards extrusion
        ptPos.setZ(p, rawZ * (extrusion > 0 ? extrusion : 0.1));
      }
      ptPos.needsUpdate = true;
    }
  }, [extrusion]);

  // Point size update
  useEffect(() => {
    if (pointCloudRef.current) {
      const mat = pointCloudRef.current.material as THREE.PointsMaterial;
      mat.size = pointSize * 0.015;
      mat.needsUpdate = true;
    }
  }, [pointSize]);

  // Color mode switch (Photo vs Heatmap)
  useEffect(() => {
    if (!sceneRef.current || !photoTextureRef.current || !depthGridRef.current) return;
    build3DModels(
      sceneRef.current,
      photoTextureRef.current,
      depthGridRef.current,
      aspectRef.current,
      extrusion,
      pointSize,
      pointCloudColorMode
    );
  }, [pointCloudColorMode]);

  // Auto-rotate toggle
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Reset Camera View
  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      if (viewMode === "panorama") {
        cameraRef.current.position.set(0, 0, 0.1);
        controlsRef.current.target.set(0, 0, -2);
      } else {
        cameraRef.current.position.set(0, 0, 4.2);
        controlsRef.current.target.set(0, 0, 0);
      }
      controlsRef.current.update();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/70 backdrop-blur-md p-2 sm:p-4 animate-fade-in">
      <div className="relative flex flex-col h-[94vh] w-full max-w-6xl rounded-3xl border border-stone-200 bg-white shadow-2xl overflow-hidden">
        
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 px-6 py-4 bg-white/95">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-xl text-amber-600 border border-amber-500/20 shadow-xs">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg font-bold text-stone-900 sm:text-xl">{title}</h2>
                <span className="hidden sm:inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                  Monocular 3D Engine
                </span>
              </div>
              <p className="text-xs text-stone-500">
                {subtitle || "Single-photo depth estimation & textured 3D spatial reconstruction"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center rounded-xl bg-stone-100 p-1 border border-stone-200 text-xs font-medium">
              <button
                onClick={() => handleModeChange("mesh")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
                  viewMode === "mesh"
                    ? "bg-white text-stone-900 font-bold shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
                title="Displaced 3D mesh surface from monocular depth"
              >
                <span>🏛️</span>
                <span>3D Relief Mesh</span>
              </button>

              <button
                onClick={() => handleModeChange("pointcloud")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
                  viewMode === "pointcloud"
                    ? "bg-white text-stone-900 font-bold shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
                title="LiDAR photogrammetry point-cloud view"
              >
                <span>✨</span>
                <span>Point Cloud</span>
              </button>

              <button
                onClick={() => handleModeChange("panorama")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
                  viewMode === "panorama"
                    ? "bg-white text-stone-900 font-bold shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
                title="Immersive 360-degree curved panorama projection"
              >
                <span>🌐</span>
                <span>360° Panorama</span>
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-200 hover:text-stone-900 transition"
              title="Close 3D View (Esc)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 3D Canvas Viewport */}
        <div className="relative flex-1 w-full bg-stone-50 overflow-hidden cursor-grab active:cursor-grabbing">
          <div ref={containerRef} className="h-full w-full" />

          {/* Loading Indicator */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xs z-20">
              <div className="h-10 w-10 animate-spin rounded-full border-3 border-amber-500 border-t-transparent" />
              <p className="mt-3 text-sm font-semibold text-stone-800">{modelStatus}</p>
              <p className="text-xs text-stone-500">Computing perspective prior & bilateral contours...</p>
            </div>
          )}

          {/* Interactive Top-Left Status Badge */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 rounded-xl bg-white/90 backdrop-blur-md px-3 py-1.5 text-xs text-stone-700 shadow-sm border border-stone-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-stone-900">
                {viewMode === "mesh"
                  ? "3D Architectural Relief"
                  : viewMode === "pointcloud"
                  ? "LiDAR Photogrammetric Points"
                  : "Curved 360° Panorama"}
              </span>
              <span className="text-stone-400">|</span>
              <span className="text-[11px] text-stone-500">Drag to orbit • Scroll to zoom</span>
            </div>
          </div>

          {/* Picture-in-Picture Monocular Depth Map Preview */}
          {depthMapSrc && showDepthPiP && (
            <div className="absolute bottom-20 left-4 z-10 rounded-2xl border border-stone-200/90 bg-white/95 p-2 shadow-lg backdrop-blur-md transition-all sm:bottom-6">
              <div className="flex items-center justify-between pb-1 px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                  🧠 Monocular Depth Map
                </span>
                <button
                  onClick={() => setShowDepthPiP(false)}
                  className="text-stone-400 hover:text-stone-700 text-xs px-1"
                  title="Hide PiP"
                >
                  ✕
                </button>
              </div>
              <div className="relative h-24 w-32 overflow-hidden rounded-lg bg-stone-900 border border-stone-200">
                <img
                  src={depthMapSrc}
                  alt="Depth Map"
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 text-[9px] font-mono text-white">
                  DEPTH Z
                </span>
              </div>
            </div>
          )}

          {/* Button to restore Depth PiP if closed */}
          {depthMapSrc && !showDepthPiP && (
            <button
              onClick={() => setShowDepthPiP(true)}
              className="absolute bottom-20 left-4 z-10 rounded-xl border border-stone-200 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-stone-700 shadow-sm backdrop-blur-md hover:bg-stone-100 sm:bottom-6"
            >
              🗺️ Show Depth Map PiP
            </button>
          )}
        </div>

        {/* Bottom Interactive HUD Controls */}
        <div className="border-t border-stone-200/80 bg-white/95 px-6 py-3.5 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Left Controls: Depth Slider & Point Options */}
            <div className="flex flex-wrap items-center gap-5 text-xs text-stone-700">
              {viewMode !== "panorama" && (
                <div className="flex items-center gap-2.5 bg-stone-50 rounded-xl px-3 py-1.5 border border-stone-200">
                  <span className="font-semibold text-stone-800">Depth Relief Extrusion:</span>
                  <input
                    type="range"
                    min="0.1"
                    max="2.5"
                    step="0.05"
                    value={extrusion}
                    onChange={(e) => setExtrusion(parseFloat(e.target.value))}
                    className="h-1.5 w-28 cursor-pointer accent-amber-600 bg-stone-300 rounded-lg"
                  />
                  <span className="font-mono text-xs font-bold text-amber-700 w-8">
                    {extrusion.toFixed(2)}x
                  </span>
                </div>
              )}

              {/* Point Cloud specific controls */}
              {viewMode === "pointcloud" && (
                <>
                  <div className="flex items-center gap-2.5 bg-stone-50 rounded-xl px-3 py-1.5 border border-stone-200">
                    <span className="font-semibold text-stone-800">Point Density:</span>
                    <input
                      type="range"
                      min="1.0"
                      max="5.0"
                      step="0.2"
                      value={pointSize}
                      onChange={(e) => setPointSize(parseFloat(e.target.value))}
                      className="h-1.5 w-20 cursor-pointer accent-emerald-600 bg-stone-300 rounded-lg"
                    />
                    <span className="font-mono text-xs font-bold text-emerald-700 w-7">
                      {pointSize.toFixed(1)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 bg-stone-100 rounded-xl p-0.5 border border-stone-200">
                    <button
                      onClick={() => setPointCloudColorMode("photo")}
                      className={`px-2 py-1 rounded-lg transition ${
                        pointCloudColorMode === "photo"
                          ? "bg-white font-bold text-stone-900 shadow-2xs"
                          : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      📷 Photo Color
                    </button>
                    <button
                      onClick={() => setPointCloudColorMode("heatmap")}
                      className={`px-2 py-1 rounded-lg transition ${
                        pointCloudColorMode === "heatmap"
                          ? "bg-white font-bold text-emerald-800 shadow-2xs"
                          : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      🌈 LiDAR Heatmap
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Right Controls: Auto-orbit & Reset */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                  autoRotate
                    ? "border-amber-300 bg-amber-50 text-amber-900"
                    : "border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100"
                }`}
              >
                <span>🔄</span>
                <span>{autoRotate ? "Auto-Orbit On" : "Auto-Orbit Paused"}</span>
              </button>

              <button
                onClick={handleResetCamera}
                className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition"
                title="Reset Camera Position"
              >
                <span>🎯</span>
                <span>Reset View</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
