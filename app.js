/* ==========================================================================
   ClipViral AI - Interactive App Controller (Mokagram M3 + Three.js 3D Icon)
   Zero external UI dependencies, keyboard accessible, reduced-motion aware
   ========================================================================== */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// --------------------------------------------------------------------------
// 1. Dark / Light Theme Switcher
// --------------------------------------------------------------------------
const rootEl = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const themeColorMeta = document.getElementById("themeColorMeta");
let icon3dController = null;

function applyTheme(theme, persist = true) {
  const isLight = theme === "light";
  rootEl.setAttribute("data-theme", isLight ? "light" : "dark");

  if (themeColorMeta) {
    themeColorMeta.setAttribute("content", isLight ? "#f1f1f1" : "#151515");
  }

  if (themeToggle) {
    const sunIcon = themeToggle.querySelector(".icon-sun");
    const moonIcon = themeToggle.querySelector(".icon-moon");
    if (sunIcon) sunIcon.hidden = isLight;
    if (moonIcon) moonIcon.hidden = !isLight;
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
  }

  if (icon3dController && typeof icon3dController.setTheme === "function") {
    icon3dController.setTheme(isLight ? "light" : "dark");
  }

  if (persist) {
    try {
      localStorage.setItem("clipviral-theme", isLight ? "light" : "dark");
    } catch (_err) {
      // Ignore private browsing storage restrictions
    }
  }
}

applyTheme(rootEl.getAttribute("data-theme") === "light" ? "light" : "dark", false);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const next = rootEl.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(next, true);
  });
}

// --------------------------------------------------------------------------
// 2. Mobile Navigation Drawer
// --------------------------------------------------------------------------
const menuBtn = document.getElementById("mobileMenuBtn");
const mobileNav = document.getElementById("mobileNav");

if (menuBtn && mobileNav) {
  const closeMenu = () => {
    menuBtn.setAttribute("aria-expanded", "false");
    mobileNav.hidden = true;
  };

  menuBtn.addEventListener("click", () => {
    const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!isOpen));
    mobileNav.hidden = isOpen;
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menuBtn.focus();
    }
  });
}

// --------------------------------------------------------------------------
// 3. Interactive Clip Studio (9:16 Preview + Heatmap + Captions + M3 Switches)
// --------------------------------------------------------------------------
const CLIPS = [
  {
    timecode: "04:18 to 05:02",
    score: 94,
    hook: 96,
    retention: 94,
    share: 92,
    banner: "WHY 90% OF SHORTS DIE AT 0:03",
    bracketX: 68,
    lines: [
      ["Most", "creators", "lose", "viewers", "before", "second", "three."],
      ["Cut", "the", "intro", "and", "start", "on", "the", "payoff."],
    ],
  },
  {
    timecode: "11:42 to 12:19",
    score: 91,
    hook: 90,
    retention: 93,
    share: 89,
    banner: "LOCAL GPU RENDER IN 8 SECONDS",
    bracketX: 292,
    lines: [
      ["Why", "wait", "ten", "minutes", "in", "a", "cloud", "queue?"],
      ["Your", "phone", "GPU", "renders", "720p", "right", "here."],
    ],
  },
  {
    timecode: "18:05 to 18:48",
    score: 88,
    hook: 87,
    retention: 86,
    share: 92,
    banner: "STOP PAYING $49/MO TO CLIP",
    bracketX: 436,
    lines: [
      ["You", "do", "not", "need", "a", "$49", "web", "editor."],
      ["Paste", "the", "link", "and", "ship", "six", "clips", "fast."],
    ],
  },
];

const STYLE_META = {
  karaoke: "Word pop",
  boxed: "Dark pill",
  classic: "Bold outline",
  neon: "Neon glow",
};

let activeClipIndex = 0;
let activeLineIndex = 0;
let activeWordIndex = 0;
let isPlaying = !prefersReducedMotion;
let tickerId = null;

const captionStage = document.getElementById("captionStage");
const hookBanner = document.getElementById("hookBanner");
const clipTimecode = document.getElementById("clipTimecode");
const previewScoreVal = document.getElementById("previewScoreVal");
const previewScoreBadge = document.getElementById("previewScoreBadge");
const previewFrameImg = document.getElementById("previewFrameImg");
const barHook = document.getElementById("barHook");
const barRetention = document.getElementById("barRetention");
const barShare = document.getElementById("barShare");
const valHook = document.getElementById("valHook");
const valRetention = document.getElementById("valRetention");
const valShare = document.getElementById("valShare");
const progressFill = document.getElementById("progressFill");
const heatmapBracket = document.getElementById("heatmapBracket");
const heatmapWrap = document.getElementById("heatmapWrap");
const activeStyleMeta = document.getElementById("activeStyleMeta");
const playbackToggle = document.getElementById("playbackToggle");
const playbackLabel = document.getElementById("playbackLabel");

const peakPills = Array.from(document.querySelectorAll(".peak-pills .seg-pill"));
const peakDots = Array.from(document.querySelectorAll(".heatmap-pin"));
const stylePills = Array.from(document.querySelectorAll(".style-pills .seg-pill"));

function renderCaptionLine() {
  if (!captionStage) return;
  const clip = CLIPS[activeClipIndex];
  const words = clip.lines[activeLineIndex];
  const totalWords = clip.lines[0].length + clip.lines[1].length;
  const absolutePos = (activeLineIndex === 0 ? 0 : clip.lines[0].length) + activeWordIndex + 1;

  captionStage.innerHTML = "";
  words.forEach((word, index) => {
    const span = document.createElement("span");
    span.className = index === activeWordIndex ? "cap-word is-active" : "cap-word";
    span.textContent = word;
    captionStage.appendChild(span);
  });

  if (progressFill) {
    const pct = Math.max(8, Math.round((absolutePos / totalWords) * 100));
    progressFill.style.width = `${pct}%`;
  }
}

function applyClip(index, animateBump = true) {
  activeClipIndex = index;
  activeLineIndex = 0;
  activeWordIndex = 0;
  const clip = CLIPS[index];

  if (hookBanner) hookBanner.textContent = clip.banner;
  if (clipTimecode) clipTimecode.textContent = clip.timecode;
  if (previewScoreVal) previewScoreVal.textContent = String(clip.score);

  if (barHook) barHook.style.width = `${clip.hook}%`;
  if (barRetention) barRetention.style.width = `${clip.retention}%`;
  if (barShare) barShare.style.width = `${clip.share}%`;
  if (valHook) valHook.textContent = String(clip.hook);
  if (valRetention) valRetention.textContent = String(clip.retention);
  if (valShare) valShare.textContent = String(clip.share);

  if (heatmapBracket) {
    heatmapBracket.setAttribute("x", String(clip.bracketX));
  }

  peakPills.forEach((pill, i) => {
    const selected = i === index;
    pill.classList.toggle("is-active", selected);
    pill.setAttribute("aria-selected", String(selected));
    pill.tabIndex = selected ? 0 : -1;
  });

  peakDots.forEach((dot, i) => {
    const selected = i === index;
    dot.classList.toggle("is-active", selected);
    dot.setAttribute("aria-pressed", String(selected));
  });

  if (animateBump && previewScoreBadge && !prefersReducedMotion) {
    previewScoreBadge.classList.remove("is-bump");
    void previewScoreBadge.offsetWidth;
    previewScoreBadge.classList.add("is-bump");
    window.setTimeout(() => previewScoreBadge.classList.remove("is-bump"), 200);
  }

  renderCaptionLine();
}

function applyCaptionStyle(styleKey) {
  if (!captionStage || !STYLE_META[styleKey]) return;
  const wasOff = captionStage.classList.contains("is-off");
  captionStage.className = `caption-stage style-${styleKey}${wasOff ? " is-off" : ""}`;

  stylePills.forEach((pill) => {
    const selected = pill.dataset.captionStyle === styleKey;
    pill.classList.toggle("is-active", selected);
    pill.setAttribute("aria-selected", String(selected));
    pill.tabIndex = selected ? 0 : -1;
  });

  if (activeStyleMeta) {
    activeStyleMeta.textContent = STYLE_META[styleKey];
  }
}

function stepWord() {
  const clip = CLIPS[activeClipIndex];
  const currentLine = clip.lines[activeLineIndex];
  activeWordIndex += 1;
  if (activeWordIndex >= currentLine.length) {
    activeWordIndex = 0;
    activeLineIndex = (activeLineIndex + 1) % clip.lines.length;
  }
  renderCaptionLine();
}

function syncPlaybackUI() {
  if (!playbackToggle) return;
  const pauseIcon = playbackToggle.querySelector(".icon-pause");
  const playIcon = playbackToggle.querySelector(".icon-play");
  playbackToggle.setAttribute("aria-pressed", String(!isPlaying));
  playbackToggle.setAttribute(
    "aria-label",
    isPlaying ? "Pause caption playback" : "Resume caption playback"
  );
  if (pauseIcon) pauseIcon.hidden = !isPlaying;
  if (playIcon) playIcon.hidden = isPlaying;
  if (playbackLabel) playbackLabel.textContent = isPlaying ? "Playing" : "Paused";
}

function startTicker() {
  if (tickerId) window.clearInterval(tickerId);
  if (!isPlaying) return;
  tickerId = window.setInterval(stepWord, 620);
}

function stopTicker() {
  if (tickerId) {
    window.clearInterval(tickerId);
    tickerId = null;
  }
}

peakPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    const idx = Number(pill.dataset.clipIndex);
    if (!Number.isNaN(idx)) applyClip(idx, true);
  });
});

peakDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const idx = Number(dot.dataset.peakDot);
    if (!Number.isNaN(idx)) applyClip(idx, true);
  });
});

stylePills.forEach((pill) => {
  pill.addEventListener("click", () => {
    if (pill.dataset.captionStyle) {
      applyCaptionStyle(pill.dataset.captionStyle);
    }
  });
});

if (playbackToggle) {
  playbackToggle.addEventListener("click", () => {
    isPlaying = !isPlaying;
    syncPlaybackUI();
    if (isPlaying) startTicker();
    else stopTicker();
  });
}

// Authentic 40x24 M3 Toggle Switches wired to live preview
const swSponsor = document.getElementById("swSponsor");
const swCaptions = document.getElementById("swCaptions");
const swBanner = document.getElementById("swBanner");
const swMirror = document.getElementById("swMirror");

if (swSponsor && heatmapWrap) {
  const syncSponsor = () => {
    heatmapWrap.classList.toggle("is-sponsor-off", !swSponsor.checked);
  };
  swSponsor.addEventListener("change", syncSponsor);
  syncSponsor();
}

if (swCaptions && captionStage) {
  const syncCaptions = () => {
    captionStage.classList.toggle("is-off", !swCaptions.checked);
  };
  swCaptions.addEventListener("change", syncCaptions);
  syncCaptions();
}

if (swBanner && hookBanner) {
  const syncBanner = () => {
    hookBanner.classList.toggle("is-off", !swBanner.checked);
  };
  swBanner.addEventListener("change", syncBanner);
  syncBanner();
}

if (swMirror && previewFrameImg) {
  const syncMirror = () => {
    previewFrameImg.classList.toggle("is-mirrored", swMirror.checked);
  };
  swMirror.addEventListener("change", syncMirror);
  syncMirror();
}

applyClip(0, false);
applyCaptionStyle("karaoke");
syncPlaybackUI();
startTicker();

document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopTicker();
  else if (isPlaying) startTicker();
});

// --------------------------------------------------------------------------
// 4. Interactive Three.js 3D ClipViral Play-Button Icon
// --------------------------------------------------------------------------
const icon3dCard = document.getElementById("icon3dCard");
const icon3dStage = document.getElementById("icon3dStage");
const icon3dHint = document.getElementById("icon3dHint");
const playBurstBtn = document.getElementById("playBurstBtn");
const resetViewBtn = document.getElementById("resetViewBtn");
const burstStatus = document.getElementById("burstStatus");
const burstStatusText = document.getElementById("burstStatusText");
let burstBadgeTimer = null;

function resetBurstChip() {
  if (!burstStatus || !burstStatusText) return;
  burstStatus.classList.remove("is-burst");
  burstStatusText.textContent = "Interactive 3D icon";
}

function scheduleBurstChipReset(delayMs = 2000) {
  if (burstBadgeTimer) window.clearTimeout(burstBadgeTimer);
  burstBadgeTimer = window.setTimeout(resetBurstChip, delayMs);
}

function activateIconFallback() {
  if (icon3dCard) icon3dCard.classList.add("is-fallback");
  const fallback = icon3dStage ? icon3dStage.querySelector("[data-icon3d-fallback]") : null;
  if (fallback) fallback.hidden = false;
  if (burstStatusText) burstStatusText.textContent = "ClipViral app icon";
  if (icon3dHint) icon3dHint.textContent = "ClipViral Android v3.0.1";
}

function handlePlayBurstFeedback() {
  const score = CLIPS[activeClipIndex].score;
  if (burstStatus && burstStatusText) {
    burstStatus.classList.add("is-burst");
    burstStatusText.textContent = `Playing clip · ${score} score`;
    scheduleBurstChipReset(2000);
  }
  // Nudge live studio preview smoothly
  if (!isPlaying) {
    isPlaying = true;
    syncPlaybackUI();
    startTicker();
  }
  stepWord();
}

if (icon3dStage) {
  icon3dStage.addEventListener("clipviral:burstfinished", () => {
    if (burstStatus && burstStatus.classList.contains("is-burst")) {
      scheduleBurstChipReset(900);
    }
  });
}

async function mountIcon3D() {
  if (!icon3dStage) return;
  try {
    const mod = await import("./icon3d.js");
    icon3dController = mod.initClipViralIcon3D(icon3dStage, {
      onBurst: handlePlayBurstFeedback,
    });
    if (icon3dController) {
      icon3dController.setTheme(rootEl.getAttribute("data-theme") || "dark");
    } else {
      activateIconFallback();
    }
  } catch (_err) {
    activateIconFallback();
  }
}

mountIcon3D();

if (playBurstBtn) {
  playBurstBtn.addEventListener("click", () => {
    if (icon3dController) {
      icon3dController.triggerBurst();
    } else {
      handlePlayBurstFeedback();
    }
  });
}

if (resetViewBtn) {
  resetViewBtn.addEventListener("click", () => {
    if (icon3dController) {
      icon3dController.resetView();
    }
  });
}

// --------------------------------------------------------------------------
// 5. Keyboard Arrow Navigation on All Tablists
// --------------------------------------------------------------------------
function wireTablistKeyboard(selector) {
  const buttons = Array.from(document.querySelectorAll(selector));
  buttons.forEach((btn, idx) => {
    btn.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const delta = event.key === "ArrowRight" ? 1 : -1;
      const next = buttons[(idx + delta + buttons.length) % buttons.length];
      next.focus();
      next.click();
    });
  });
}

wireTablistKeyboard(".peak-pills .seg-pill");
wireTablistKeyboard(".style-pills .seg-pill");
wireTablistKeyboard("[data-model]");
wireTablistKeyboard("[data-tone]");
wireTablistKeyboard(".currency-pill");

// --------------------------------------------------------------------------
// 6. AI Vision Models Selector
// --------------------------------------------------------------------------
const AI_MODELS = {
  deepseek: {
    provider: "Built-in · Auto-fallback ON",
    spec: "1M context · Vision · Fast hook and retention reasoning",
  },
  glm: {
    provider: "Built-in · Auto-fallback ON",
    spec: "524K context · Vision · Fast highlight timestamps",
  },
  muse: {
    provider: "Built-in · Auto-fallback ON",
    spec: "524K context · Vision · Creative hooks and Studio copy",
  },
  toptools: {
    provider: "Built-in · Pro Priority Tier",
    spec: "1M context · Vision · High detail breakdown for long videos",
  },
  gemini: {
    provider: "Optional API Key · Native Video",
    spec: "Upload MP4 directly to Google Gemini 2.5 Flash",
  },
  custom: {
    provider: "Custom OpenAI Endpoint",
    spec: "Any OpenAI-compatible base URL, model ID, and fallback chain",
  },
};

const modelTabs = Array.from(document.querySelectorAll("[data-model]"));
const modelProvider = document.getElementById("modelProvider");
const modelSpecLine = document.getElementById("modelSpecLine");

modelTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const key = tab.dataset.model;
    const data = key ? AI_MODELS[key] : null;
    if (!data) return;

    modelTabs.forEach((t) => {
      const selected = t === tab;
      t.classList.toggle("is-active", selected);
      t.setAttribute("aria-selected", String(selected));
      t.tabIndex = selected ? 0 : -1;
    });

    if (modelProvider) modelProvider.textContent = data.provider;
    if (modelSpecLine) modelSpecLine.textContent = data.spec;
  });
});

// --------------------------------------------------------------------------
// 7. Viral Studio 6-Tone Copy Previewer
// --------------------------------------------------------------------------
const TONES = {
  viral: {
    caption: '"Most creators lose viewers in two seconds. Start on the tension instead."',
    tags: "#shortform #editingtips #creatorworkflow #android",
  },
  meme: {
    caption: '"Waiting in a cloud render queue while my Android phone already exported three Reels."',
    tags: "#videoeditor #contentcreator #reels #clipperlife",
  },
  tips: {
    caption: '"Three steps: pull YouTube replay peaks, skip sponsor reads, burn Karaoke captions at 720p."',
    tags: "#youtubetips #tiktokgrowth #mobileediting #shorts",
  },
  hottake: {
    caption: '"Paying $49 a month for a web clipper makes little sense when your phone has a GPU."',
    tags: "#creatoreconomy #podcastclips #hottake #shorts",
  },
  story: {
    caption: '"Scrubbing a two-hour podcast used to take all evening. With heatmaps and Media3 it takes 90 seconds."',
    tags: "#buildinpublic #podcasting #androidapp #creators",
  },
  minimal: {
    caption: '"Long video in. Vertical clip out. Rendered locally."',
    tags: "#clipviral #android #shortform",
  },
};

const toneTabs = Array.from(document.querySelectorAll("[data-tone]"));
const toneCaption = document.getElementById("toneCaption");
const toneTags = document.getElementById("toneTags");

toneTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const key = tab.dataset.tone;
    const data = key ? TONES[key] : null;
    if (!data) return;

    toneTabs.forEach((t) => {
      const selected = t === tab;
      t.classList.toggle("is-active", selected);
      t.setAttribute("aria-selected", String(selected));
      t.tabIndex = selected ? 0 : -1;
    });

    if (toneCaption) toneCaption.textContent = data.caption;
    if (toneTags) toneTags.textContent = data.tags;
  });
});

// --------------------------------------------------------------------------
// 8. Pricing Currency Selector (Telegram @CryptoBot & @viralclibot)
// --------------------------------------------------------------------------
const CRYPTO_RAILS = {
  USDT: "Pay in <strong>USDT</strong> (TRC-20, TON, or ERC-20) via <code>@CryptoBot</code> and <code>@viralclibot</code>.",
  TON: "Pay in native <strong>TON</strong> via <code>@CryptoBot</code> and <code>@viralclibot</code> with fast settlement.",
  USDC: "Pay in <strong>USDC</strong> stablecoin via <code>@CryptoBot</code> and <code>@viralclibot</code> with no credit card.",
};

const currencyPills = Array.from(document.querySelectorAll(".currency-pill"));
const cryptoNote = document.getElementById("cryptoNote");

currencyPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    const asset = pill.dataset.asset;
    if (!asset || !CRYPTO_RAILS[asset]) return;

    currencyPills.forEach((p) => {
      const selected = p === pill;
      p.classList.toggle("is-active", selected);
      p.setAttribute("aria-selected", String(selected));
      p.tabIndex = selected ? 0 : -1;
    });

    if (cryptoNote) {
      cryptoNote.innerHTML = CRYPTO_RAILS[asset];
    }
  });
});

// --------------------------------------------------------------------------
// 9. Install Slide-Wrap Disclosure & SHA-256 Copy Button
// --------------------------------------------------------------------------
const toggleReleaseBtn = document.getElementById("toggleReleaseBtn");
const toggleReleaseLabel = document.getElementById("toggleReleaseLabel");
const releaseSlideWrap = document.getElementById("releaseSlideWrap");

if (toggleReleaseBtn && releaseSlideWrap) {
  toggleReleaseBtn.addEventListener("click", () => {
    const isOpen = releaseSlideWrap.classList.toggle("is-open");
    toggleReleaseBtn.setAttribute("aria-expanded", String(isOpen));
    releaseSlideWrap.setAttribute("aria-hidden", String(!isOpen));
    if (toggleReleaseLabel) {
      toggleReleaseLabel.textContent = isOpen ? "Hide checksum" : "Show checksum";
    }
  });
}

const copyBtn = document.getElementById("copyShaBtn");
const copyLabel = document.getElementById("copyShaLabel");
const copyLive = document.getElementById("copyStatusLive");

if (copyBtn) {
  let resetTimer = null;

  const showCopied = () => {
    if (copyLabel) copyLabel.textContent = "Copied hash";
    if (copyLive) copyLive.textContent = "SHA-256 checksum copied to clipboard.";
    if (resetTimer) window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
      if (copyLabel) copyLabel.textContent = "Copy hash";
      if (copyLive) copyLive.textContent = "";
    }, 2200);
  };

  copyBtn.addEventListener("click", async () => {
    const sha = copyBtn.dataset.sha || "";
    if (!sha) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(sha);
        showCopied();
        return;
      }
    } catch (_err) {
      // Fallback below
    }

    const textarea = document.createElement("textarea");
    textarea.value = sha;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      showCopied();
    } finally {
      document.body.removeChild(textarea);
    }
  });
}
