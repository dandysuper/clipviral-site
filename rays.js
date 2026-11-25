/**
 * Self-made WebGL volumetric corner light rays for ClipViral AI hero.
 * Implements top-left & top-right fanning blue light shafts (#0a74ff -> #2b83ff),
 * calibrated per theme (light vs dark), maxDevicePixelRatio = 1, paused offscreen
 * via IntersectionObserver and static under prefers-reduced-motion.
 */

const VERT_SRC = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG_SRC = `
precision highp float;

varying vec2 vUv;

uniform vec2 uRes;
uniform float uTime;
uniform float uSide;       // 0.0 = top-left, 1.0 = top-right
uniform float uIntensity;  // 1.7 light, 2.4 dark
uniform float uIsDark;     // 0.0 light, 1.0 dark

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float rayShaft(float angle, float dist, float t) {
  float n1 = noise(vec2(angle * 4.2 + t * 0.19, dist * 1.15 - t * 0.11));
  float n2 = noise(vec2(angle * 8.6 - t * 0.14 + 3.7, dist * 1.85 - t * 0.08));
  float n3 = noise(vec2(angle * 15.0 + t * 0.09 + 9.1, dist * 2.4));
  float w = n1 * 0.54 + n2 * 0.31 + n3 * 0.15;
  // Crisp yet airy volumetric shaft contrast (sharpness ~0.5)
  float band = smoothstep(0.24, 0.86, w);
  float fine = pow(max(0.0, sin(angle * 11.5 + t * 0.35) * 0.5 + 0.5), 2.4) * 0.24;
  return band + fine;
}

void main() {
  float aspect = uRes.x / max(1.0, uRes.y);
  // Origin placed slightly outside top corner so rays fan diagonally across hero
  vec2 origin = vec2(mix(-0.08, 1.08, uSide), 1.12);
  vec2 delta = vUv - origin;
  delta.x *= aspect;

  float dist = length(delta);
  // Fan angle measured downward-inward from corner
  float dirX = mix(delta.x, -delta.x, uSide);
  float angle = atan(-delta.y, max(0.0001, dirX));

  // Soft angular envelope covering the upper-outer quadrant (spread 2.3)
  float angEnv = smoothstep(-0.18, 0.42, angle) * smoothstep(1.75, 0.72, angle);

  // Radial falloff + soft source bloom (glow 1.1)
  float radial = exp(-dist * 1.48);
  float coreGlow = exp(-dist * 2.65) * 0.48;

  float t = uTime * 1.2;
  float shaftA = rayShaft(angle * 1.65, dist, t);
  float shaftB = rayShaft(angle * 2.45 + 1.4, dist * 1.2, t * 0.82);
  float field = mix(shaftA, shaftB, 0.42);

  float energy = (field * radial * 1.15 + coreGlow) * angEnv;

  vec3 col1 = vec3(0.039, 0.455, 1.000); // #0a74ff
  vec3 col2 = vec3(0.169, 0.514, 1.000); // #2b83ff
  vec3 colBright = vec3(0.45, 0.74, 1.0);

  vec3 col = mix(col1, col2, clamp(field * 0.8 + dist * 0.35, 0.0, 1.0));
  col = mix(col, colBright, smoothstep(0.65, 1.25, energy) * 0.38);

  // Calibrate opacity cleanly for light (#fbfbfb) vs dark (#141414)
  float alphaScale = mix(0.32, 0.34, uIsDark) * (uIntensity / 2.0);
  float alpha = clamp(energy * alphaScale, 0.0, mix(0.54, 0.62, uIsDark));

  // Premultiplied alpha for crisp compositing over both light and dark themes
  gl_FragColor = vec4(col * alpha, alpha);
}
`;

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
  if (!vs || !fs) return null;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

function mountRayCanvas(canvas, side) {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: true,
    preserveDrawingBuffer: false,
    powerPreference: "low-power",
  });
  if (!gl) return null;

  const prog = createProgram(gl);
  if (!prog) return null;

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  );

  const aPos = gl.getAttribLocation(prog, "aPos");
  const uRes = gl.getUniformLocation(prog, "uRes");
  const uTime = gl.getUniformLocation(prog, "uTime");
  const uSide = gl.getUniformLocation(prog, "uSide");
  const uIntensity = gl.getUniformLocation(prog, "uIntensity");
  const uIsDark = gl.getUniformLocation(prog, "uIsDark");

  gl.useProgram(prog);
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  let width = 1;
  let height = 1;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    // maxDevicePixelRatio = 1 per LAYOUT.md spec
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    gl.viewport(0, 0, width, height);
  }

  function render(timeSec, isDark) {
    gl.viewport(0, 0, width, height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(prog);
    gl.uniform2f(uRes, width, height);
    gl.uniform1f(uTime, timeSec);
    gl.uniform1f(uSide, side);
    gl.uniform1f(uIntensity, isDark ? 2.4 : 1.7);
    gl.uniform1f(uIsDark, isDark ? 1.0 : 0.0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  resize();

  return {
    resize,
    render,
    dispose() {
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    },
  };
}

export function initHeroRays(heroEl, leftCanvas, rightCanvas) {
  if (!heroEl || !leftCanvas || !rightCanvas) return null;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const left = mountRayCanvas(leftCanvas, 0.0);
  const right = mountRayCanvas(rightCanvas, 1.0);

  if (!left && !right) {
    // Clean CSS fallback when WebGL is disabled
    heroEl.classList.add("rays-fallback");
    return {
      setTheme() {},
      dispose() {},
    };
  }

  let isDark = document.documentElement.getAttribute("data-theme") === "dark";
  let isVisible = true;
  let rafId = null;
  const startMs = performance.now();

  function drawFrame(nowMs) {
    const elapsed = prefersReducedMotion ? 1.8 : (nowMs - startMs) * 0.001;
    if (left) left.render(elapsed, isDark);
    if (right) right.render(elapsed, isDark);
  }

  function loop(nowMs) {
    if (!isVisible || prefersReducedMotion) {
      rafId = null;
      return;
    }
    drawFrame(nowMs);
    rafId = window.requestAnimationFrame(loop);
  }

  function start() {
    if (prefersReducedMotion) {
      drawFrame(performance.now());
      return;
    }
    if (!rafId && isVisible) {
      rafId = window.requestAnimationFrame(loop);
    }
  }

  function stop() {
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  const ro = new ResizeObserver(() => {
    if (left) left.resize();
    if (right) right.resize();
    drawFrame(performance.now());
  });
  ro.observe(heroEl);

  const io = new IntersectionObserver(
    (entries) => {
      isVisible = Boolean(entries[0] && entries[0].isIntersecting);
      if (isVisible) start();
      else stop();
    },
    { threshold: 0.01 }
  );
  io.observe(heroEl);

  drawFrame(performance.now());
  start();

  return {
    setTheme(theme) {
      isDark = theme === "dark";
      drawFrame(performance.now());
    },
    dispose() {
      stop();
      ro.disconnect();
      io.disconnect();
      if (left) left.dispose();
      if (right) right.dispose();
    },
  };
}
