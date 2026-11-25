import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

/**
 * Interactive Three.js r186 3D ClipViral Play-Button Icon
 * Follows the threejs-animation skill:
 * - THREE.Timer + timer.connect(document) + timer.update()
 * - renderer.setAnimationLoop(animate)
 * - THREE.AnimationMixer + AnimationClip + KeyframeTracks (idle + additive burst)
 * - Procedural pointer parallax & drag-to-orbit via THREE.MathUtils.damp AFTER mixer.update
 * - RoomEnvironment reflections, IntersectionObserver pause, prefers-reduced-motion, WebGL fallback
 */

function makeCanvasTexture(width, height, drawFn) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  drawFn(ctx, width, height);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function createRoundedRectPath(w, h, r) {
  const x = -w / 2;
  const y = -h / 2;
  const path = new THREE.Shape();
  path.moveTo(x + r, y);
  path.lineTo(x + w - r, y);
  path.quadraticCurveTo(x + w, y, x + w, y + r);
  path.lineTo(x + w, y + h - r);
  path.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  path.lineTo(x + r, y + h);
  path.quadraticCurveTo(x, y + h, x, y + h - r);
  path.lineTo(x, y + r);
  path.quadraticCurveTo(x, y, x + r, y);
  return path;
}

function createRoundedPolygonPath(points, cornerRadius, isHole = false) {
  const path = isHole ? new THREE.Path() : new THREE.Shape();
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const prev = points[(i - 1 + n) % n];
    const curr = points[i];
    const next = points[(i + 1) % n];

    const v1 = new THREE.Vector2().subVectors(prev, curr);
    const v2 = new THREE.Vector2().subVectors(next, curr);
    const len1 = v1.length();
    const len2 = v2.length();
    const r = Math.min(cornerRadius, len1 * 0.42, len2 * 0.42);

    const startPt = curr.clone().add(v1.normalize().multiplyScalar(r));
    const endPt = curr.clone().add(v2.normalize().multiplyScalar(r));

    if (i === 0) {
      path.moveTo(startPt.x, startPt.y);
    } else {
      path.lineTo(startPt.x, startPt.y);
    }
    path.quadraticCurveTo(curr.x, curr.y, endPt.x, endPt.y);
  }
  path.closePath();
  return path;
}

function applyPlanarUVs(geometry, bounds) {
  geometry.computeBoundingBox();
  const bb = bounds || geometry.boundingBox;
  const pos = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  const dx = Math.max(0.0001, bb.max.x - bb.min.x);
  const dy = Math.max(0.0001, bb.max.y - bb.min.y);

  for (let i = 0; i < pos.count; i++) {
    const u = THREE.MathUtils.clamp((pos.getX(i) - bb.min.x) / dx, 0, 1);
    const v = THREE.MathUtils.clamp((pos.getY(i) - bb.min.y) / dy, 0, 1);
    uv.setXY(i, u, v);
  }
  uv.needsUpdate = true;
}

function buildPerimeterCurve(w, h, r, z) {
  const shape = createRoundedRectPath(w, h, r);
  const pts2d = shape.getSpacedPoints(120);
  const pts3d = pts2d.map((p) => new THREE.Vector3(p.x, p.y, z));
  return new THREE.CatmullRomCurve3(pts3d, true, "centripetal");
}

function createTaperedRibbonGeometry(curve, tubularSegments, maxRadius, radialSegments) {
  const frames = curve.computeFrenetFrames(tubularSegments, false);
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  const P = new THREE.Vector3();
  const N = new THREE.Vector3();
  const vertex = new THREE.Vector3();

  for (let i = 0; i <= tubularSegments; i++) {
    const u = i / tubularSegments;
    curve.getPointAt(u, P);

    // Smoothly taper both ends so the wave flows seamlessly inside the squircle edge
    const edgeFade = Math.sin(Math.pow(u, 0.85) * Math.PI);
    const r = maxRadius * (0.18 + 0.82 * Math.pow(edgeFade, 0.55));

    const normal = frames.normals[i];
    const binormal = frames.binormals[i];

    for (let j = 0; j <= radialSegments; j++) {
      const v = (j / radialSegments) * Math.PI * 2;
      const sin = Math.sin(v);
      const cos = -Math.cos(v);

      N.x = cos * normal.x + sin * binormal.x;
      N.y = cos * normal.y + sin * binormal.y;
      N.z = cos * normal.z + sin * binormal.z;
      N.normalize();

      vertex.x = P.x + r * N.x;
      vertex.y = P.y + r * N.y;
      vertex.z = P.z + r * 0.72 * N.z; // Slightly ribbon-flattened profile

      positions.push(vertex.x, vertex.y, vertex.z);
      normals.push(N.x, N.y, N.z);
      uvs.push(u, j / radialSegments);
    }
  }

  for (let j = 1; j <= tubularSegments; j++) {
    for (let i = 1; i <= radialSegments; i++) {
      const a = (radialSegments + 1) * (j - 1) + (i - 1);
      const b = (radialSegments + 1) * j + (i - 1);
      const c = (radialSegments + 1) * j + i;
      const d = (radialSegments + 1) * (j - 1) + i;
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geom = new THREE.BufferGeometry();
  geom.setIndex(indices);
  geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geom.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geom.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geom.computeVertexNormals();
  return geom;
}

function createViralBurstShape() {
  // Crisp jagged energy burst erupting top-right from play triangle shoulder
  const s = new THREE.Shape();
  s.moveTo(-0.34, -0.02);
  s.quadraticCurveTo(-0.15, 0.03, -0.06, 0.28);
  s.lineTo(0.03, 0.08);
  s.lineTo(0.39, 0.44);
  s.lineTo(0.18, 0.02);
  s.lineTo(0.41, -0.07);
  s.lineTo(0.16, -0.16);
  s.lineTo(0.30, -0.35);
  s.quadraticCurveTo(0.06, -0.22, -0.05, -0.14);
  s.quadraticCurveTo(-0.15, -0.06, -0.34, -0.02);
  s.closePath();
  return s;
}

function createFourPointStarGeometry(outerR = 0.072, innerR = 0.02, depth = 0.018) {
  const shape = new THREE.Shape();
  const spikes = 4;
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (i * Math.PI) / spikes;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  const geom = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.007,
    bevelSize: 0.005,
    bevelSegments: 2,
  });
  geom.center();
  return geom;
}

function buildClipViralIconSculpture() {
  const orbitPivot = new THREE.Group();
  orbitPivot.name = "OrbitPivot";

  const iconRig = new THREE.Group();
  iconRig.name = "IconRig";
  orbitPivot.add(iconRig);

  const burstRig = new THREE.Group();
  burstRig.name = "BurstRig";
  iconRig.add(burstRig);

  // --------------------------------------------------------------------------
  // 1. Deep Obsidian-Indigo Glass Squircle Tile (24% corner radius)
  // --------------------------------------------------------------------------
  const tileSize = 2.38;
  const tileRadius = tileSize * 0.24;
  const tileShape = createRoundedRectPath(tileSize, tileSize, tileRadius);
  const tileGeom = new THREE.ExtrudeGeometry(tileShape, {
    depth: 0.28,
    bevelEnabled: true,
    bevelThickness: 0.085,
    bevelSize: 0.07,
    bevelSegments: 8,
    curveSegments: 28,
  });
  tileGeom.center();

  const tileGlassMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0x0d122d),
    emissive: new THREE.Color(0x090d24),
    emissiveIntensity: 0.22,
    roughness: 0.14,
    metalness: 0.16,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
    transmission: 0.22,
    thickness: 0.9,
    ior: 1.48,
    reflectivity: 0.95,
  });
  const tileMesh = new THREE.Mesh(tileGeom, tileGlassMat);
  tileMesh.name = "SquircleTile";
  burstRig.add(tileMesh);

  // Deep midnight-indigo interior plate with rich diagonal glass sheen & subtle radial glow
  const backTex = makeCanvasTexture(512, 512, (ctx, w, h) => {
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0.0, "#1c0e45");
    bg.addColorStop(0.42, "#0b102c");
    bg.addColorStop(0.8, "#071937");
    bg.addColorStop(1.0, "#210a38");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Subtle soft glowing aura behind the play button
    const aura = ctx.createRadialGradient(w * 0.46, h * 0.5, w * 0.06, w * 0.46, h * 0.5, w * 0.46);
    aura.addColorStop(0.0, "rgba(0, 216, 255, 0.22)");
    aura.addColorStop(0.45, "rgba(124, 58, 237, 0.20)");
    aura.addColorStop(1.0, "rgba(10, 14, 34, 0)");
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, w, h);

    // Crisp diagonal crystal glass specular reflection across upper-left
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w * 0.56, 0);
    ctx.lineTo(w * 0.28, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    const sheen = ctx.createLinearGradient(0, 0, w * 0.46, h);
    sheen.addColorStop(0.0, "rgba(196, 216, 255, 0.13)");
    sheen.addColorStop(0.55, "rgba(168, 85, 247, 0.04)");
    sheen.addColorStop(1.0, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = sheen;
    ctx.fill();
    ctx.restore();
  });

  const innerPlateShape = createRoundedRectPath(tileSize - 0.14, tileSize - 0.14, tileRadius - 0.05);
  const innerPlateGeom = new THREE.ShapeGeometry(innerPlateShape, 24);
  applyPlanarUVs(innerPlateGeom);
  const innerPlateMat = new THREE.MeshStandardMaterial({
    map: backTex,
    emissive: new THREE.Color(0xffffff),
    emissiveMap: backTex,
    emissiveIntensity: 0.34,
    roughness: 0.28,
    metalness: 0.12,
  });
  const innerPlateMesh = new THREE.Mesh(innerPlateGeom, innerPlateMat);
  innerPlateMesh.position.z = 0.045;
  burstRig.add(innerPlateMesh);

  // Glowing saturated gradient rim hugging the front bevel of the squircle
  const rimTex = makeCanvasTexture(512, 32, (ctx, w, h) => {
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0.0, "#4F46E5");
    grad.addColorStop(0.18, "#E11D9E");
    grad.addColorStop(0.34, "#00D8FF");
    grad.addColorStop(0.54, "#38BDF8");
    grad.addColorStop(0.74, "#A855F7");
    grad.addColorStop(0.88, "#7C3AED");
    grad.addColorStop(1.0, "#4F46E5");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  });

  const rimCurve = buildPerimeterCurve(tileSize - 0.04, tileSize - 0.04, tileRadius - 0.01, 0.195);
  const rimGeom = new THREE.TubeGeometry(rimCurve, 128, 0.032, 14, true);
  const rimMat = new THREE.MeshStandardMaterial({
    map: rimTex,
    emissive: new THREE.Color(0xffffff),
    emissiveMap: rimTex,
    emissiveIntensity: 0.56,
    roughness: 0.18,
    metalness: 0.15,
  });
  const rimMesh = new THREE.Mesh(rimGeom, rimMat);
  rimMesh.name = "SquircleRim";
  burstRig.add(rimMesh);

  // Subtle recessed dark groove ring inside the tile
  const grooveShape = createRoundedRectPath(tileSize - 0.42, tileSize - 0.42, tileRadius - 0.11);
  const grooveHole = createRoundedRectPath(tileSize - 0.52, tileSize - 0.52, tileRadius - 0.13);
  grooveShape.holes.push(grooveHole);
  const grooveGeom = new THREE.ShapeGeometry(grooveShape, 24);
  const grooveMat = new THREE.MeshBasicMaterial({
    color: 0x050714,
    transparent: true,
    opacity: 0.5,
  });
  const grooveMesh = new THREE.Mesh(grooveGeom, grooveMat);
  grooveMesh.position.z = 0.21;
  burstRig.add(grooveMesh);

  // --------------------------------------------------------------------------
  // 2. Hero 3D Sculpted Play Triangle with Hollow Inner Triangle Cutout
  // --------------------------------------------------------------------------
  const playGroup = new THREE.Group();
  playGroup.name = "PlayGroup";
  playGroup.position.set(-0.08, 0.02, 0.28);
  burstRig.add(playGroup);

  const outerPts = [
    new THREE.Vector2(-0.56, 0.68),
    new THREE.Vector2(0.70, 0.0),
    new THREE.Vector2(-0.56, -0.68),
  ];
  const innerPts = [
    new THREE.Vector2(-0.27, 0.30),
    new THREE.Vector2(0.28, 0.0),
    new THREE.Vector2(-0.27, -0.30),
  ];

  const playShape = createRoundedPolygonPath(outerPts, 0.19, false);
  const playHole = createRoundedPolygonPath(innerPts, 0.075, true);
  playShape.holes.push(playHole);

  const playGeom = new THREE.ExtrudeGeometry(playShape, {
    depth: 0.16,
    bevelEnabled: true,
    bevelThickness: 0.055,
    bevelSize: 0.048,
    bevelSegments: 7,
    curveSegments: 24,
  });
  playGeom.center();
  applyPlanarUVs(playGeom);

  const playTex = makeCanvasTexture(512, 512, (ctx, w, h) => {
    // Rich saturated royal-violet -> electric-cobalt -> vibrant cyan (matching app-icon.png)
    const grad = ctx.createLinearGradient(0, h * 0.85, w, h * 0.18);
    grad.addColorStop(0.0, "#7C1EFF");
    grad.addColorStop(0.24, "#6D28D9");
    grad.addColorStop(0.5, "#2563EB");
    grad.addColorStop(0.76, "#06B6D4");
    grad.addColorStop(1.0, "#22E6FF");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Vivid violet-magenta edge luminance along left spine
    const leftEdge = ctx.createLinearGradient(0, 0, w * 0.3, 0);
    leftEdge.addColorStop(0.0, "rgba(236, 72, 232, 0.52)");
    leftEdge.addColorStop(1.0, "rgba(236, 72, 232, 0)");
    ctx.fillStyle = leftEdge;
    ctx.fillRect(0, 0, w * 0.32, h);

    // Subtle crisp glass facet gloss across top-left
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w * 0.58, 0);
    ctx.lineTo(w * 0.24, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    const gloss = ctx.createLinearGradient(0, 0, w * 0.45, h * 0.65);
    gloss.addColorStop(0.0, "rgba(255, 255, 255, 0.22)");
    gloss.addColorStop(0.55, "rgba(255, 255, 255, 0.04)");
    gloss.addColorStop(1.0, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gloss;
    ctx.fill();
    ctx.restore();
  });

  const playMat = new THREE.MeshPhysicalMaterial({
    map: playTex,
    emissive: new THREE.Color(0xffffff),
    emissiveMap: playTex,
    emissiveIntensity: 0.34,
    roughness: 0.12,
    metalness: 0.06,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    reflectivity: 1.0,
  });

  const playMesh = new THREE.Mesh(playGeom, playMat);
  playMesh.name = "PlayTriangleMesh";
  playGroup.add(playMesh);

  // --------------------------------------------------------------------------
  // 3. Top-Right Viral Energy Spark / Burst (Neon Magenta -> Deep Orchid)
  // --------------------------------------------------------------------------
  const sparkGroup = new THREE.Group();
  sparkGroup.name = "SparkGroup";
  sparkGroup.position.set(0.55, 0.54, 0.32);
  burstRig.add(sparkGroup);

  const burstShape = createViralBurstShape();
  const burstGeom = new THREE.ExtrudeGeometry(burstShape, {
    depth: 0.085,
    bevelEnabled: true,
    bevelThickness: 0.026,
    bevelSize: 0.022,
    bevelSegments: 4,
    curveSegments: 16,
  });
  burstGeom.center();
  applyPlanarUVs(burstGeom);

  const sparkTex = makeCanvasTexture(256, 256, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, h, w, 0);
    g.addColorStop(0.0, "#5B21B6");
    g.addColorStop(0.32, "#A21CAF");
    g.addColorStop(0.68, "#EC25A5");
    g.addColorStop(1.0, "#FF66CC");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });

  const sparkMat = new THREE.MeshPhysicalMaterial({
    map: sparkTex,
    emissive: new THREE.Color(0xffffff),
    emissiveMap: sparkTex,
    emissiveIntensity: 0.44,
    roughness: 0.14,
    metalness: 0.06,
    clearcoat: 0.95,
  });

  const sparkMesh = new THREE.Mesh(burstGeom, sparkMat);
  sparkMesh.name = "SparkBurstMesh";
  sparkGroup.add(sparkMesh);

  const dashMat = new THREE.MeshStandardMaterial({
    color: 0xff3eb5,
    emissive: new THREE.Color(0xec25a5),
    emissiveIntensity: 0.65,
    roughness: 0.18,
  });

  const dash1 = new THREE.Mesh(new THREE.CapsuleGeometry(0.019, 0.10, 6, 10), dashMat);
  dash1.position.set(0.08, 0.44, 0.02);
  dash1.rotation.z = -0.18;
  sparkGroup.add(dash1);

  const dash2 = new THREE.Mesh(new THREE.CapsuleGeometry(0.019, 0.085, 6, 10), dashMat);
  dash2.position.set(0.44, 0.13, 0.02);
  dash2.rotation.z = -1.2;
  sparkGroup.add(dash2);

  // --------------------------------------------------------------------------
  // 4. Sweeping Bottom-Right Tapered Dual Wave Ribbons (Cyan + Magenta)
  // --------------------------------------------------------------------------
  const ribbonGroup = new THREE.Group();
  ribbonGroup.name = "RibbonGroup";
  burstRig.add(ribbonGroup);

  const cyanCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.28, -1.06, 0.21),
    new THREE.Vector3(0.06, -0.90, 0.25),
    new THREE.Vector3(0.32, -0.62, 0.28),
    new THREE.Vector3(0.70, -0.45, 0.27),
    new THREE.Vector3(0.99, -0.20, 0.24),
    new THREE.Vector3(1.10, 0.12, 0.20),
  ]);

  const cyanRibbonTex = makeCanvasTexture(256, 32, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0.0, "#4F46E5");
    g.addColorStop(0.32, "#0284C7");
    g.addColorStop(0.68, "#00D8FF");
    g.addColorStop(1.0, "#38F2FF");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });

  const cyanRibbonMat = new THREE.MeshPhysicalMaterial({
    map: cyanRibbonTex,
    emissive: new THREE.Color(0xffffff),
    emissiveMap: cyanRibbonTex,
    emissiveIntensity: 0.44,
    roughness: 0.14,
    metalness: 0.08,
    clearcoat: 1.0,
  });

  const cyanRibbonMesh = new THREE.Mesh(
    createTaperedRibbonGeometry(cyanCurve, 64, 0.072, 16),
    cyanRibbonMat
  );
  cyanRibbonMesh.name = "CyanRibbon";
  ribbonGroup.add(cyanRibbonMesh);

  const magentaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.02, -1.10, 0.21),
    new THREE.Vector3(0.30, -0.94, 0.25),
    new THREE.Vector3(0.56, -0.72, 0.27),
    new THREE.Vector3(0.88, -0.57, 0.26),
    new THREE.Vector3(1.08, -0.34, 0.22),
  ]);

  const magentaRibbonTex = makeCanvasTexture(256, 32, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0.0, "#6D28D9");
    g.addColorStop(0.38, "#C026D3");
    g.addColorStop(0.75, "#F01EA5");
    g.addColorStop(1.0, "#FF52C5");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });

  const magentaRibbonMat = new THREE.MeshPhysicalMaterial({
    map: magentaRibbonTex,
    emissive: new THREE.Color(0xffffff),
    emissiveMap: magentaRibbonTex,
    emissiveIntensity: 0.44,
    roughness: 0.14,
    metalness: 0.08,
    clearcoat: 1.0,
  });

  const magentaRibbonMesh = new THREE.Mesh(
    createTaperedRibbonGeometry(magentaCurve, 56, 0.068, 16),
    magentaRibbonMat
  );
  magentaRibbonMesh.name = "MagentaRibbon";
  ribbonGroup.add(magentaRibbonMesh);

  // --------------------------------------------------------------------------
  // 5. Delicate Floating 4-Point Micro-Star Sparkles
  // --------------------------------------------------------------------------
  const sparklesGroup = new THREE.Group();
  sparklesGroup.name = "SparklesGroup";
  burstRig.add(sparklesGroup);

  const starGeom = createFourPointStarGeometry(0.07, 0.02, 0.016);
  const starSpecs = [
    { pos: [-1.42, 0.56, 0.18], scale: 1.02, color: 0xa855f7 },
    { pos: [-1.34, -0.72, 0.24], scale: 0.72, color: 0x22d3ee },
    { pos: [1.44, 0.72, 0.16], scale: 0.84, color: 0x38bdf8 },
    { pos: [1.46, -0.68, 0.26], scale: 1.05, color: 0xec4899 },
    { pos: [1.26, 0.96, 0.28], scale: 0.58, color: 0x67e8f9 },
    { pos: [-1.22, 1.04, 0.22], scale: 0.55, color: 0xd946ef },
  ];

  starSpecs.forEach((spec, idx) => {
    const mat = new THREE.MeshStandardMaterial({
      color: spec.color,
      emissive: new THREE.Color(spec.color),
      emissiveIntensity: 0.72,
      roughness: 0.2,
    });
    const star = new THREE.Mesh(starGeom, mat);
    star.name = `Sparkle_${idx}`;
    star.position.set(spec.pos[0], spec.pos[1], spec.pos[2]);
    star.scale.setScalar(spec.scale);
    sparklesGroup.add(star);
  });

  return {
    orbitPivot,
    iconRig,
    burstRig,
    playGroup,
    sparkGroup,
    ribbonGroup,
    sparklesGroup,
    materials: {
      playMat,
      sparkMat,
      rimMat,
      cyanRibbonMat,
      magentaRibbonMat,
      tileGlassMat,
    },
    textures: [backTex, rimTex, playTex, sparkTex, cyanRibbonTex, magentaRibbonTex],
  };
}

function buildAnimationClips() {
  // 1. Idle Clip (4.0s smooth breathing float, gentle 3D tilt, subtle spark scale pulse)
  const idleBob = new THREE.NumberKeyframeTrack(
    ".position[y]",
    [0, 1.0, 2.0, 3.0, 4.0],
    [0, 0.065, 0, -0.055, 0]
  );
  idleBob.setInterpolation(THREE.InterpolateSmooth);

  const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.05, -0.14, 0.01));
  const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.04, 0.12, -0.02));
  const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.03, 0.06, 0.02));
  const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.03, -0.10, -0.01));

  const idleTilt = new THREE.QuaternionKeyframeTrack(
    ".quaternion",
    [0, 1.0, 2.0, 3.0, 4.0],
    [
      q0.x, q0.y, q0.z, q0.w,
      q1.x, q1.y, q1.z, q1.w,
      q2.x, q2.y, q2.z, q2.w,
      q3.x, q3.y, q3.z, q3.w,
      q0.x, q0.y, q0.z, q0.w,
    ]
  );

  const idleSparkScale = new THREE.VectorKeyframeTrack(
    "SparkGroup.scale",
    [0, 1.0, 2.0, 3.0, 4.0],
    [
      1.0, 1.0, 1.0,
      1.07, 1.07, 1.07,
      0.98, 0.98, 0.98,
      1.05, 1.05, 1.05,
      1.0, 1.0, 1.0,
    ]
  );
  idleSparkScale.setInterpolation(THREE.InterpolateSmooth);

  const idleClip = new THREE.AnimationClip("idle", 4.0, [
    idleBob,
    idleTilt,
    idleSparkScale,
  ]);
  idleClip.validate();

  // 2. Play Burst Clip (0.96s LoopOnce: tactile press recoil + full celebratory 360 Y-spin + elastic pop)
  const burstZ = new THREE.NumberKeyframeTrack(
    "BurstRig.position[z]",
    [0, 0.11, 0.34, 0.68, 0.96],
    [0, -0.28, 0.18, 0.04, 0]
  );
  burstZ.setInterpolation(THREE.InterpolateSmooth);

  const burstScale = new THREE.VectorKeyframeTrack(
    "BurstRig.scale",
    [0, 0.11, 0.32, 0.65, 0.96],
    [
      1.0, 1.0, 1.0,
      0.88, 0.88, 0.88,
      1.09, 1.09, 1.09,
      1.01, 1.01, 1.01,
      1.0, 1.0, 1.0,
    ]
  );
  burstScale.setInterpolation(THREE.InterpolateSmooth);

  const qb0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
  const qb1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), (Math.PI * 2) / 3);
  const qb2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), (Math.PI * 4) / 3);
  const qb3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);

  const burstSpin = new THREE.QuaternionKeyframeTrack(
    "BurstRig.quaternion",
    [0, 0.10, 0.36, 0.66, 0.96],
    [
      qb0.x, qb0.y, qb0.z, qb0.w,
      qb0.x, qb0.y, qb0.z, qb0.w,
      qb1.x, qb1.y, qb1.z, qb1.w,
      qb2.x, qb2.y, qb2.z, qb2.w,
      qb3.x, qb3.y, qb3.z, qb3.w,
    ]
  );

  const ribbonPop = new THREE.VectorKeyframeTrack(
    "RibbonGroup.scale",
    [0, 0.14, 0.38, 0.72, 0.96],
    [
      1.0, 1.0, 1.0,
      0.95, 0.95, 0.95,
      1.10, 1.10, 1.10,
      1.02, 1.02, 1.02,
      1.0, 1.0, 1.0,
    ]
  );
  ribbonPop.setInterpolation(THREE.InterpolateSmooth);

  const playBurstClip = new THREE.AnimationClip("playBurst", 0.96, [
    burstZ,
    burstScale,
    burstSpin,
    ribbonPop,
  ]);
  playBurstClip.validate();

  // 3. Additive Spark Burst Clip (layers cleanly on top of idleClip's SparkGroup.scale)
  const sparkAddScale = new THREE.VectorKeyframeTrack(
    "SparkGroup.scale",
    [0, 0.12, 0.32, 0.65, 0.96],
    [
      1.0, 1.0, 1.0,
      0.86, 0.86, 0.86,
      1.42, 1.42, 1.42,
      1.08, 1.08, 1.08,
      1.0, 1.0, 1.0,
    ]
  );
  sparkAddScale.setInterpolation(THREE.InterpolateSmooth);

  const sparkBurstClip = new THREE.AnimationClip("sparkBurst", 0.96, [sparkAddScale]);
  THREE.AnimationUtils.makeClipAdditive(sparkBurstClip);
  sparkBurstClip.validate();

  return { idleClip, playBurstClip, sparkBurstClip };
}

export function initClipViralIcon3D(stageEl, options = {}) {
  if (!stageEl) return null;

  const fallbackEl = stageEl.querySelector("[data-icon3d-fallback]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
  } catch (_err) {
    if (fallbackEl) fallbackEl.hidden = false;
    return null;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;

  const canvas = renderer.domElement;
  canvas.className = "icon3d-canvas";
  canvas.setAttribute("role", "img");
  canvas.setAttribute(
    "aria-label",
    "Interactive 3D ClipViral play button icon. Click to trigger play burst or drag to orbit."
  );
  stageEl.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
  camera.position.set(0, 0.02, 6.2);

  // Studio reflections via RoomEnvironment (zero external HDR assets)
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.72;
  pmremGenerator.dispose();

  // Balanced saturated studio lighting (preserves deep violet/cyan/magenta jewel tones)
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.15);
  keyLight.position.set(3.2, 4.4, 5.2);
  scene.add(keyLight);

  const fillHemi = new THREE.HemisphereLight(0xc7d2fe, 0x1e1b4b, 0.65);
  scene.add(fillHemi);

  const violetRim = new THREE.PointLight(0x8b5cf6, 4.5, 12);
  violetRim.position.set(-3.2, 1.4, 2.8);
  scene.add(violetRim);

  const cyanRim = new THREE.PointLight(0x06b6d4, 4.5, 12);
  cyanRim.position.set(3.2, 0.6, 2.8);
  scene.add(cyanRim);

  const magentaKiss = new THREE.PointLight(0xec4899, 3.2, 10);
  magentaKiss.position.set(1.8, -2.6, 2.4);
  scene.add(magentaKiss);

  // Build sculpture & animation system
  const rig = buildClipViralIconSculpture();
  scene.add(rig.orbitPivot);

  const mixer = new THREE.AnimationMixer(rig.iconRig);
  const { idleClip, playBurstClip, sparkBurstClip } = buildAnimationClips();

  const idleAction = mixer.clipAction(idleClip);
  const burstAction = mixer.clipAction(playBurstClip);
  burstAction.setLoop(THREE.LoopOnce, 1);
  burstAction.clampWhenFinished = false;

  const sparkBurstAction = mixer.clipAction(sparkBurstClip);
  sparkBurstAction.setLoop(THREE.LoopOnce, 1);
  sparkBurstAction.clampWhenFinished = false;

  mixer.addEventListener("finished", (e) => {
    if (e.action === burstAction) {
      stageEl.dispatchEvent(new CustomEvent("clipviral:burstfinished", { bubbles: true }));
    }
  });

  if (!prefersReducedMotion) {
    idleAction.play();
  }

  // Sizing via ResizeObserver
  function updateSize() {
    const rect = stageEl.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const minSideRatio = Math.min(1, w / Math.max(1, h));
    camera.position.z = minSideRatio < 0.85 ? 6.8 : 6.1;
    camera.updateProjectionMatrix();
  }

  const resizeObserver = new ResizeObserver(updateSize);
  resizeObserver.observe(stageEl);
  updateSize();

  // Procedural pointer parallax + drag-to-orbit state (applied AFTER mixer.update)
  const HERO_ROT_X = 0.08;
  const HERO_ROT_Y = -0.18;

  let isHovering = false;
  let isDragging = false;
  let pointerDownX = 0;
  let pointerDownY = 0;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let didDragMove = false;

  let targetHoverX = 0;
  let targetHoverY = 0;
  let dragRotX = HERO_ROT_X;
  let dragRotY = HERO_ROT_Y;
  let currentRotX = HERO_ROT_X;
  let currentRotY = HERO_ROT_Y;
  let currentPlayZ = 0.28;
  let burstFlash = 0;

  function triggerBurst() {
    burstFlash = 1.0;
    if (!prefersReducedMotion) {
      burstAction.reset().play();
      sparkBurstAction.reset().play();
    }
    if (typeof options.onBurst === "function") {
      options.onBurst();
    }
    stageEl.dispatchEvent(new CustomEvent("clipviral:playburst", { bubbles: true }));
  }

  function resetView() {
    dragRotX = HERO_ROT_X;
    dragRotY = HERO_ROT_Y;
    targetHoverX = 0;
    targetHoverY = 0;
  }

  function setTheme(theme) {
    const isLight = theme === "light";
    renderer.toneMappingExposure = isLight ? 0.98 : 1.04;
    fillHemi.intensity = isLight ? 0.72 : 0.65;
  }

  // Pointer interactions (hover parallax, drag-to-orbit, tap/click play burst)
  canvas.addEventListener("pointerenter", () => {
    isHovering = true;
  });

  canvas.addEventListener("pointerleave", () => {
    isHovering = false;
    targetHoverX = 0;
    targetHoverY = 0;
  });

  canvas.addEventListener("pointerdown", (e) => {
    isDragging = true;
    didDragMove = false;
    pointerDownX = e.clientX;
    pointerDownY = e.clientY;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
    stageEl.classList.add("is-dragging");
  });

  canvas.addEventListener("pointermove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
    const ny = ((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1;

    if (isDragging) {
      const dx = e.clientX - lastPointerX;
      const dy = e.clientY - lastPointerY;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;

      if (Math.hypot(e.clientX - pointerDownX, e.clientY - pointerDownY) > 6) {
        didDragMove = true;
      }

      dragRotY += dx * 0.0095;
      dragRotX = THREE.MathUtils.clamp(dragRotX + dy * 0.008, -0.78, 0.78);
    } else if (!prefersReducedMotion) {
      targetHoverY = nx * 0.24;
      targetHoverX = ny * 0.18;
    }
  });

  function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;
    stageEl.classList.remove("is-dragging");
    if (canvas.hasPointerCapture(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId);
    }
    if (!didDragMove) {
      triggerBurst();
    }
  }

  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);

  // THREE.Timer (r186 standard, never THREE.Clock)
  const timer = new THREE.Timer();
  timer.connect(document);

  let isVisible = true;

  function animate() {
    timer.update();
    const delta = Math.min(timer.getDelta(), 0.05);
    const elapsed = timer.getElapsed();

    // 1. Keyframe animation system updates first
    mixer.update(delta);

    // 2. Procedural motion runs AFTER mixer.update via THREE.MathUtils.damp
    const goalRotX = dragRotX + (isDragging ? 0 : targetHoverX);
    const goalRotY = dragRotY + (isDragging ? 0 : targetHoverY);
    const rotLambda = isDragging ? 18 : 6.5;

    currentRotX = THREE.MathUtils.damp(currentRotX, goalRotX, rotLambda, delta);
    currentRotY = THREE.MathUtils.damp(currentRotY, goalRotY, rotLambda, delta);
    rig.orbitPivot.rotation.set(currentRotX, currentRotY, 0);

    // Tactile hover lift on the sculpted Play Triangle
    const playTargetZ = isHovering ? 0.36 : 0.28;
    currentPlayZ = THREE.MathUtils.damp(currentPlayZ, playTargetZ, 9, delta);
    rig.playGroup.position.z = currentPlayZ;

    // Emissive burst flash envelope
    burstFlash = THREE.MathUtils.damp(burstFlash, 0, 5.2, delta);
    const hoverBoost = isHovering ? 0.14 : 0;
    rig.materials.playMat.emissiveIntensity = 0.34 + hoverBoost + burstFlash * 0.52;
    rig.materials.sparkMat.emissiveIntensity = 0.44 + hoverBoost * 0.5 + burstFlash * 0.65;
    rig.materials.rimMat.emissiveIntensity = 0.56 + hoverBoost * 0.4 + burstFlash * 0.45;
    rig.materials.cyanRibbonMat.emissiveIntensity = 0.44 + burstFlash * 0.48;
    rig.materials.magentaRibbonMat.emissiveIntensity = 0.44 + burstFlash * 0.48;

    // Gentle twinkle on outer micro-sparkles
    if (!prefersReducedMotion) {
      rig.sparklesGroup.children.forEach((star, i) => {
        const phase = elapsed * 2.2 + i * 1.15;
        const pulse = 0.82 + Math.sin(phase) * 0.22 + burstFlash * 0.35;
        star.rotation.z = phase * 0.32;
        star.scale.setScalar(pulse * (i % 2 === 0 ? 0.92 : 0.72));
      });
    }

    renderer.render(scene, camera);
  }

  // Pause animation & WebGL rendering when scrolled offscreen
  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      isVisible = Boolean(entry && entry.isIntersecting);
      renderer.setAnimationLoop(isVisible ? animate : null);
    },
    { threshold: 0.02 }
  );
  intersectionObserver.observe(stageEl);

  // Initial synchronous frame so canvas is never blank on first paint
  if (fallbackEl) fallbackEl.hidden = true;
  timer.update();
  mixer.update(0);
  rig.orbitPivot.rotation.set(HERO_ROT_X, HERO_ROT_Y, 0);
  renderer.render(scene, camera);
  renderer.setAnimationLoop(animate);

  return {
    triggerBurst,
    resetView,
    setTheme,
    dispose() {
      renderer.setAnimationLoop(null);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      timer.disconnect();
      mixer.stopAllAction();
      mixer.uncacheRoot(rig.iconRig);
      envTex.dispose();
      rig.textures.forEach((t) => t.dispose());
      renderer.dispose();
      canvas.remove();
    },
  };
}
