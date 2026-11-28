import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

/**
 * Interactive Three.js r186 3D ClipViral 5.0 tape-mark icon
 * Follows the threejs-animation skill strictly:
 * - THREE.Timer + timer.connect(document) + timer.update()
 * - renderer.setAnimationLoop(animate)
 * - THREE.AnimationMixer + AnimationClip + KeyframeTracks (idle + LoopOnce burst + additive spark)
 * - Procedural pointer parallax, drag-to-orbit, entrance settle & scroll coupling via THREE.MathUtils.damp AFTER mixer.update
 * - Precision-machined back-face recessed emblem so 360 spins & drags look complete from every angle
 * - RoomEnvironment reflections, IntersectionObserver pause, prefers-reduced-motion, WebGL fallback
 */

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

function buildPerimeterCurve(w, h, r, z) {
  const shape = createRoundedRectPath(w, h, r);
  const pts2d = shape.getSpacedPoints(120);
  const pts3d = pts2d.map((p) => new THREE.Vector3(p.x, p.y, z));
  return new THREE.CatmullRomCurve3(pts3d, true, "centripetal");
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
  // 1. Warm-black squircle tile (the 5.0 launcher's ground, #131110)
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

  const tileMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0x15110e),
    roughness: 0.32,
    metalness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.12,
  });
  const tileMesh = new THREE.Mesh(tileGeom, tileMat);
  tileMesh.name = "SquircleTile";
  burstRig.add(tileMesh);

  // Machined bronze rim on the front lip
  const rimCurve = buildPerimeterCurve(tileSize - 0.04, tileSize - 0.04, tileRadius - 0.01, 0.195);
  const rimMat = new THREE.MeshStandardMaterial({
    color: 0x6b5a46,
    emissive: new THREE.Color(0xffa23a),
    emissiveIntensity: 0.12,
    roughness: 0.3,
    metalness: 0.85,
  });
  const rimMesh = new THREE.Mesh(new THREE.TubeGeometry(rimCurve, 128, 0.03, 14, true), rimMat);
  rimMesh.name = "BronzeRim";
  burstRig.add(rimMesh);

  const rearRimCurve = buildPerimeterCurve(tileSize - 0.06, tileSize - 0.06, tileRadius - 0.02, -0.205);
  const rearRimMat = rimMat.clone();
  const rearRimMesh = new THREE.Mesh(new THREE.TubeGeometry(rearRimCurve, 120, 0.024, 12, true), rearRimMat);
  rearRimMesh.name = "RearRim";
  burstRig.add(rearRimMesh);

  // --------------------------------------------------------------------------
  // 2. The tape: an amber strip with punched sprockets and a play window
  //    (ic_launcher_tape.xml in 3D: 68 x 32 strip, 4 + 4 sprockets, a triangle)
  // --------------------------------------------------------------------------
  const stripW = 1.78;
  const stripH = stripW * (32 / 68);
  const u = stripW / 68;
  const stripShape = createRoundedRectPath(stripW, stripH, u * 2);

  const sprocketXs = [5, 21, 37, 53].map((x) => -stripW / 2 + (x + 3) * u);
  const holeW = 6 * u;
  const holeH = 3.2 * u;
  const holeInset = 3.4 * u;
  sprocketXs.forEach((cx) => {
    [stripH / 2 - holeInset, -stripH / 2 + holeInset].forEach((cy) => {
      const hole = new THREE.Path();
      const x0 = cx - holeW / 2;
      const y0 = cy - holeH / 2;
      hole.moveTo(x0, y0);
      hole.lineTo(x0, y0 + holeH);
      hole.lineTo(x0 + holeW, y0 + holeH);
      hole.lineTo(x0 + holeW, y0);
      hole.lineTo(x0, y0);
      stripShape.holes.push(hole);
    });
  });

  // Play window: the same triangle as the launcher (26,8.5 → 26,23.5 → 39.5,16)
  const triPts = [
    new THREE.Vector2(-stripW / 2 + 26 * u, stripH / 2 - 8.5 * u),
    new THREE.Vector2(-stripW / 2 + 39.5 * u, stripH / 2 - 16 * u),
    new THREE.Vector2(-stripW / 2 + 26 * u, stripH / 2 - 23.5 * u),
  ];
  stripShape.holes.push(createRoundedPolygonPath(triPts, 0.03, true));

  const stripGeom = new THREE.ExtrudeGeometry(stripShape, {
    depth: 0.07,
    bevelEnabled: true,
    bevelThickness: 0.018,
    bevelSize: 0.014,
    bevelSegments: 4,
    curveSegments: 12,
  });
  stripGeom.center();

  const playMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xffa23a),
    emissive: new THREE.Color(0xff8a1f),
    emissiveIntensity: 0.08,
    roughness: 0.26,
    metalness: 0.12,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
  });

  const playGroup = new THREE.Group();
  playGroup.name = "PlayGroup";
  playGroup.position.z = 0.28;
  burstRig.add(playGroup);

  const stripMesh = new THREE.Mesh(stripGeom, playMat);
  stripMesh.name = "TapeStrip";
  playGroup.add(stripMesh);

  // The same strip on the back, so a spin or a drag never shows a blank face
  const backPlayMat = playMat.clone();
  const backStrip = new THREE.Mesh(stripGeom, backPlayMat);
  backStrip.name = "RearTapeStrip";
  backStrip.position.z = -0.255;
  backStrip.rotation.y = Math.PI;
  burstRig.add(backStrip);

  // Groups the animation clips address; the tape mark has no sparks or ribbons
  const sparkGroup = new THREE.Group();
  sparkGroup.name = "SparkGroup";
  burstRig.add(sparkGroup);

  const ribbonGroup = new THREE.Group();
  ribbonGroup.name = "RibbonGroup";
  burstRig.add(ribbonGroup);

  const sparklesGroup = new THREE.Group();
  sparklesGroup.name = "SparklesGroup";
  burstRig.add(sparklesGroup);

  return {
    orbitPivot,
    iconRig,
    burstRig,
    playGroup,
    sparkGroup,
    ribbonGroup,
    sparklesGroup,
    materials: { playMat, rimMat, rearRimMat, backPlayMat, tileMat },
    textures: [],
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

function isWebGLAvailable() {
  try {
    const testCanvas = document.createElement("canvas");
    const gl =
      testCanvas.getContext("webgl2") ||
      testCanvas.getContext("webgl") ||
      testCanvas.getContext("experimental-webgl");
    if (!gl) return false;
    const lose = gl.getExtension("WEBGL_lose_context");
    if (lose) lose.loseContext();
    return true;
  } catch (_err) {
    return false;
  }
}

export function initClipViralIcon3D(stageEl, options = {}) {
  if (!stageEl) return null;

  const fallbackEl = stageEl.querySelector("[data-icon3d-fallback]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Pre-probe WebGL before constructing THREE.WebGLRenderer so disabled-WebGL logs 0 errors
  if (!isWebGLAvailable()) {
    if (fallbackEl) fallbackEl.hidden = false;
    return null;
  }

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
    "Interactive 3D ClipViral icon. Click to spin it or drag to turn it."
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

  // Balanced studio lighting (front + subtle rear accent so back-face emblem shines on spin/orbit)
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.15);
  keyLight.position.set(3.2, 4.4, 5.2);
  scene.add(keyLight);

  const rearFillLight = new THREE.DirectionalLight(0xffe2bd, 0.7);
  rearFillLight.position.set(-2.5, 2.2, -4.5);
  scene.add(rearFillLight);

  const fillHemi = new THREE.HemisphereLight(0xfff1de, 0x2a1d10, 0.65);
  scene.add(fillHemi);

  // Warm lamp light only: the 5.0 accent is amber, never violet or cyan
  const lampRim = new THREE.PointLight(0xffa23a, 4.2, 12);
  lampRim.position.set(-3.2, 1.4, 2.8);
  scene.add(lampRim);

  const warmRim = new THREE.PointLight(0xffd3a1, 3.4, 12);
  warmRim.position.set(3.2, 0.6, 2.8);
  scene.add(warmRim);

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

  // Sizing via ResizeObserver using layout dimensions (clientWidth/clientHeight / contentRect)
  // so CSS entrance transforms (scale/rotate on .logo-tilt) never shrink the drawing buffer.
  function updateSize(entries) {
    const entry = Array.isArray(entries) ? entries[0] : null;
    const rawW = entry && entry.contentRect ? entry.contentRect.width : stageEl.clientWidth;
    const rawH = entry && entry.contentRect ? entry.contentRect.height : stageEl.clientHeight;
    const w = Math.max(1, Math.round(rawW || stageEl.offsetWidth || 320));
    const h = Math.max(1, Math.round(rawH || stageEl.offsetHeight || 320));
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const minSideRatio = Math.min(1, w / Math.max(1, h));
    camera.position.z = minSideRatio < 0.85 ? 5.65 : 5.05;
    camera.updateProjectionMatrix();
    if (prefersReducedMotion) {
      renderer.render(scene, camera);
    }
  }

  const resizeObserver = new ResizeObserver((entries) => updateSize(entries));
  resizeObserver.observe(stageEl);
  updateSize();

  // Procedural state (applied AFTER mixer.update via THREE.MathUtils.damp)
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

  // Entrance settle & scroll-coupled motion state
  const useEntrance = Boolean(options.deferEntrance) && !prefersReducedMotion;
  let targetEntranceScale = useEntrance ? 0.86 : 1.0;
  let currentEntranceScale = targetEntranceScale;
  let targetEntranceYaw = useEntrance ? -0.45 : 0;
  let currentEntranceYaw = targetEntranceYaw;

  let targetScrollProgress = 0;
  let currentScrollProgress = 0;

  function playEntrance() {
    targetEntranceScale = 1.0;
    targetEntranceYaw = 0;
  }

  function setScrollProgress(p) {
    if (prefersReducedMotion) {
      targetScrollProgress = 0;
      return;
    }
    targetScrollProgress = THREE.MathUtils.clamp(Number(p) || 0, 0, 1);
  }

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
    renderer.toneMappingExposure = isLight ? 0.99 : 1.05;
    fillHemi.intensity = isLight ? 0.74 : 0.66;
    if (prefersReducedMotion) {
      renderer.render(scene, camera);
    }
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
    currentEntranceScale = THREE.MathUtils.damp(currentEntranceScale, targetEntranceScale, 5.2, delta);
    currentEntranceYaw = THREE.MathUtils.damp(currentEntranceYaw, targetEntranceYaw, 5.0, delta);
    currentScrollProgress = THREE.MathUtils.damp(currentScrollProgress, targetScrollProgress, 6.0, delta);

    const scrollYaw = currentScrollProgress * 0.42;
    const scrollPitch = currentScrollProgress * 0.12;
    const scrollY = currentScrollProgress * 0.12;

    const goalRotX = dragRotX + scrollPitch + (isDragging ? 0 : targetHoverX);
    const goalRotY = dragRotY + currentEntranceYaw + scrollYaw + (isDragging ? 0 : targetHoverY);
    const rotLambda = isDragging ? 18 : 6.5;

    currentRotX = THREE.MathUtils.damp(currentRotX, goalRotX, rotLambda, delta);
    currentRotY = THREE.MathUtils.damp(currentRotY, goalRotY, rotLambda, delta);

    rig.orbitPivot.rotation.set(currentRotX, currentRotY, 0);
    rig.orbitPivot.position.y = scrollY;
    rig.orbitPivot.scale.setScalar(currentEntranceScale);

    // Tactile hover lift on the sculpted Play Triangle
    const playTargetZ = isHovering ? 0.36 : 0.28;
    currentPlayZ = THREE.MathUtils.damp(currentPlayZ, playTargetZ, 9, delta);
    rig.playGroup.position.z = currentPlayZ;

    // Emissive burst flash envelope
    burstFlash = THREE.MathUtils.damp(burstFlash, 0, 5.2, delta);
    const hoverBoost = isHovering ? 0.14 : 0;
    rig.materials.playMat.emissiveIntensity = 0.08 + hoverBoost * 0.6 + burstFlash * 0.4;
    rig.materials.backPlayMat.emissiveIntensity = 0.08 + burstFlash * 0.35;
    rig.materials.rimMat.emissiveIntensity = 0.12 + hoverBoost * 0.5 + burstFlash * 0.4;
    rig.materials.rearRimMat.emissiveIntensity = 0.1 + burstFlash * 0.3;

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

  // Pause animation & WebGL rendering when scrolled offscreen (or permanently under reduced motion)
  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      isVisible = Boolean(entry && entry.isIntersecting);
      renderer.setAnimationLoop(isVisible && !prefersReducedMotion ? animate : null);
    },
    { threshold: 0.02 }
  );
  intersectionObserver.observe(stageEl);

  // Initial synchronous frame so canvas is never blank on first paint
  if (fallbackEl) fallbackEl.hidden = true;
  timer.update();
  mixer.update(0);
  rig.orbitPivot.rotation.set(HERO_ROT_X, HERO_ROT_Y + currentEntranceYaw, 0);
  rig.orbitPivot.scale.setScalar(currentEntranceScale);
  renderer.render(scene, camera);
  if (!prefersReducedMotion) {
    renderer.setAnimationLoop(animate);
  }

  if (typeof options.onReady === "function") {
    options.onReady();
  }

  return {
    triggerBurst,
    resetView,
    playEntrance,
    setScrollProgress,
    setTheme,
    // Expose deterministic angle helper for inspecting rear hardware emblem during QA
    setOrbitAngle(rx, ry) {
      dragRotX = rx;
      dragRotY = ry;
      currentRotX = rx;
      currentRotY = ry;
      rig.orbitPivot.rotation.set(rx, ry, 0);
      renderer.render(scene, camera);
    },
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
