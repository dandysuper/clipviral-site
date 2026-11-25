/* ==========================================================================
   ClipViral AI — Interactive Studio Preview & Micro-Interactions
   Zero external dependencies · Keyboard accessible · Reduced-motion aware
   ========================================================================== */

(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --------------------------------------------------------------------------
  // 1. Mobile Navigation Drawer
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
  // 2. Interactive ClipViral Android Studio Preview (Hero)
  // --------------------------------------------------------------------------
  const CLIPS = [
    {
      timecode: "04:18 – 05:02",
      duration: "44s",
      score: 94,
      hook: 96,
      retention: 94,
      share: 92,
      reason: "Sharp curiosity gap in the first 2.1s aligned with top replay spike.",
      banner: "WHY 90% OF SHORTS DIE AT 0:03",
      bracketX: 28,
      bracketW: 36,
      lines: [
        ["Most", "creators", "lose", "viewers", "before", "second", "three."],
        ["Cut", "the", "intro", "and", "start", "on", "the", "payoff."],
      ],
    },
    {
      timecode: "11:42 – 12:19",
      duration: "37s",
      score: 91,
      hook: 90,
      retention: 93,
      share: 89,
      reason: "High audio energy jump paired with clean 1-step workflow reveal.",
      banner: "LOCAL GPU RENDER IN 8 SECONDS",
      bracketX: 123,
      bracketW: 36,
      lines: [
        ["Why", "wait", "ten", "minutes", "in", "a", "cloud", "queue?"],
        ["Your", "phone", "GPU", "renders", "720p", "right", "here."],
      ],
    },
    {
      timecode: "18:05 – 18:48",
      duration: "43s",
      score: 88,
      hook: 87,
      retention: 86,
      share: 92,
      reason: "Polarizing hot take drives comment velocity and repeat views.",
      banner: "STOP PAYING $49/MO TO CLIP",
      bracketX: 186,
      bracketW: 36,
      lines: [
        ["You", "do", "not", "need", "a", "$49", "web", "editor."],
        ["Paste", "the", "link", "and", "ship", "six", "clips", "fast."],
      ],
    },
  ];

  const STYLE_META = {
    karaoke: "Word pop #FFE600",
    boxed: "Dark pill box",
    classic: "Broadcast stroke",
    neon: "Studio glow",
  };

  let activeClipIndex = 0;
  let activeStyle = "karaoke";
  let activeLineIndex = 0;
  let activeWordIndex = 0;
  let isPlaying = !prefersReducedMotion;
  let tickerId = null;

  const captionStage = document.getElementById("captionStage");
  const hookBanner = document.getElementById("hookBanner");
  const clipTimecode = document.getElementById("clipTimecode");
  const clipDuration = document.getElementById("clipDuration");
  const clipReason = document.getElementById("clipReason");
  const scoreNum = document.getElementById("scoreNum");
  const phoneScoreValue = document.getElementById("phoneScoreValue");
  const phoneScoreBadge = document.getElementById("phoneScoreBadge");
  const barHook = document.getElementById("barHook");
  const barRetention = document.getElementById("barRetention");
  const barShare = document.getElementById("barShare");
  const valHook = document.getElementById("valHook");
  const valRetention = document.getElementById("valRetention");
  const valShare = document.getElementById("valShare");
  const progressFill = document.getElementById("progressFill");
  const heatmapBracket = document.getElementById("heatmapBracket");
  const activeStyleMeta = document.getElementById("activeStyleMeta");
  const playbackToggle = document.getElementById("playbackToggle");
  const playbackLabel = document.getElementById("playbackLabel");

  const peakTabs = Array.from(document.querySelectorAll(".peak-tab"));
  const peakDots = Array.from(document.querySelectorAll(".heatmap-dot"));
  const stylePills = Array.from(document.querySelectorAll(".style-pill"));

  function renderCaptionLine() {
    if (!captionStage) return;
    const clip = CLIPS[activeClipIndex];
    const words = clip.lines[activeLineIndex];
    const totalWords = clip.lines[0].length + clip.lines[1].length;
    const absoluteWordPos =
      (activeLineIndex === 0 ? 0 : clip.lines[0].length) + activeWordIndex + 1;

    captionStage.innerHTML = "";
    words.forEach((word, index) => {
      const span = document.createElement("span");
      span.className = index === activeWordIndex ? "cap-word is-active" : "cap-word";
      span.textContent = word;
      captionStage.appendChild(span);
    });

    if (progressFill) {
      const pct = Math.max(8, Math.round((absoluteWordPos / totalWords) * 100));
      progressFill.style.width = `${pct}%`;
    }
  }

  function applyClip(index, announceBump = true) {
    activeClipIndex = index;
    activeLineIndex = 0;
    activeWordIndex = 0;
    const clip = CLIPS[index];

    if (hookBanner) hookBanner.textContent = clip.banner;
    if (clipTimecode) clipTimecode.textContent = clip.timecode;
    if (clipDuration) clipDuration.textContent = clip.duration;
    if (clipReason) clipReason.textContent = clip.reason;
    if (scoreNum) scoreNum.textContent = String(clip.score);
    if (phoneScoreValue) phoneScoreValue.textContent = String(clip.score);

    if (barHook) barHook.style.width = `${clip.hook}%`;
    if (barRetention) barRetention.style.width = `${clip.retention}%`;
    if (barShare) barShare.style.width = `${clip.share}%`;
    if (valHook) valHook.textContent = String(clip.hook);
    if (valRetention) valRetention.textContent = String(clip.retention);
    if (valShare) valShare.textContent = String(clip.share);

    if (heatmapBracket) {
      heatmapBracket.setAttribute("x", String(clip.bracketX));
      heatmapBracket.setAttribute("width", String(clip.bracketW));
    }

    peakTabs.forEach((tab, i) => {
      const selected = i === index;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });

    peakDots.forEach((dot, i) => {
      const selected = i === index;
      dot.classList.toggle("is-active", selected);
      dot.setAttribute("r", selected ? "3.8" : "3.1");
      dot.setAttribute("fill", selected ? "#6BDCD0" : "#B9C3FF");
    });

    if (announceBump && phoneScoreBadge && !prefersReducedMotion) {
      phoneScoreBadge.classList.remove("is-bump");
      void phoneScoreBadge.offsetWidth;
      phoneScoreBadge.classList.add("is-bump");
      window.setTimeout(() => phoneScoreBadge.classList.remove("is-bump"), 220);
    }

    renderCaptionLine();
  }

  function applyCaptionStyle(styleKey) {
    if (!captionStage || !STYLE_META[styleKey]) return;
    activeStyle = styleKey;
    captionStage.className = `caption-stage style-${styleKey}`;

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
      isPlaying ? "Pause caption preview playback" : "Resume caption preview playback"
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

  peakTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const idx = Number(tab.dataset.clipIndex);
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
      if (isPlaying) {
        startTicker();
      } else {
        stopTicker();
      }
    });
  }

  // Initialize hero studio state
  applyClip(0, false);
  applyCaptionStyle("karaoke");
  syncPlaybackUI();
  startTicker();

  // Pause ticker when page is hidden to save battery
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopTicker();
    } else if (isPlaying) {
      startTicker();
    }
  });

  // --------------------------------------------------------------------------
  // 3. Helper for Keyboard Arrow Navigation on Tablists
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

  wireTablistKeyboard(".peak-tab");
  wireTablistKeyboard(".style-pill");
  wireTablistKeyboard(".model-chip");
  wireTablistKeyboard(".tone-pill");
  wireTablistKeyboard(".crypto-pill");

  // --------------------------------------------------------------------------
  // 4. Feature Card 1: Interactive Built-in & BYO AI Model Specs
  // --------------------------------------------------------------------------
  const AI_MODELS = {
    deepseek: {
      provider: "Built-in · Ready out of the box",
      spec: "1M context · Multi-frame Vision · Fast hook & retention reasoning",
    },
    glm: {
      provider: "Built-in · Ready out of the box",
      spec: "524K context · Vision · Ultra-fast highlight scoring & timestamps",
    },
    muse: {
      provider: "Built-in · Ready out of the box",
      spec: "524K context · Vision · Creative hooks & punchy Studio copy",
    },
    toptools: {
      provider: "Built-in · Pro Priority Tier",
      spec: "1M context · Vision · Max quality long-form breakdown (Pro / Max)",
    },
    gemini: {
      provider: "Optional BYO API Key · Native Video",
      spec: "Native MP4 upload directly to Google Gemini 2.5 Flash",
    },
    custom: {
      provider: "Bring Your Own Endpoint",
      spec: "Any OpenAI-compatible base URL, model ID & automatic fallback chain",
    },
  };

  const modelChips = Array.from(document.querySelectorAll(".model-chip"));
  const modelProvider = document.getElementById("modelProvider");
  const modelSpecLine = document.getElementById("modelSpecLine");

  modelChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const key = chip.dataset.model;
      const data = key ? AI_MODELS[key] : null;
      if (!data) return;

      modelChips.forEach((c) => {
        const selected = c === chip;
        c.classList.toggle("is-active", selected);
        c.setAttribute("aria-selected", String(selected));
        c.tabIndex = selected ? 0 : -1;
      });

      if (modelProvider) modelProvider.textContent = data.provider;
      if (modelSpecLine) modelSpecLine.textContent = data.spec;
    });
  });

  // --------------------------------------------------------------------------
  // 5. Feature Card 3: Viral Studio 6-Tone Copy Previewer
  // --------------------------------------------------------------------------
  const TONES = {
    viral: {
      caption:
        '"Most creators kill retention in the first 2 seconds — watch what changes when you open right on the tension."',
      tags: "#shortform #editingtips #creatorworkflow #android",
    },
    meme: {
      caption:
        '"Me waiting for cloud export queues while my Android phone already rendered and posted three Reels."',
      tags: "#videoeditor #contentcreator #reels #clipperlife",
    },
    tips: {
      caption:
        '"3-step mobile clipping formula: pull YouTube replay peaks, skip sponsor reads, burn Karaoke captions at 720p."',
      tags: "#youtubetips #tiktokgrowth #mobileediting #shorts",
    },
    hottake: {
      caption:
        '"Unpopular opinion: paying $49/month for web clipping tools makes zero sense when your phone has a GPU."',
      tags: "#creatoreconomy #podcastclips #hottake #shorts",
    },
    story: {
      caption:
        '"I used to spend two hours scrubbing one podcast episode. Once we wired heatmaps directly into Media3, it took 90 seconds."',
      tags: "#buildinpublic #podcasting #androidapp #creators",
    },
    minimal: {
      caption: '"Long video in. Vertical clip out. Rendered locally."',
      tags: "#clipviral #android #shortform",
    },
  };

  const tonePills = Array.from(document.querySelectorAll(".tone-pill"));
  const toneCaption = document.getElementById("toneCaption");
  const toneTags = document.getElementById("toneTags");

  tonePills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const key = pill.dataset.tone;
      const data = key ? TONES[key] : null;
      if (!data) return;

      tonePills.forEach((p) => {
        const selected = p === pill;
        p.classList.toggle("is-active", selected);
        p.setAttribute("aria-selected", String(selected));
        p.tabIndex = selected ? 0 : -1;
      });

      if (toneCaption) toneCaption.textContent = data.caption;
      if (toneTags) toneTags.textContent = data.tags;
    });
  });

  // --------------------------------------------------------------------------
  // 6. Pricing: Interactive Telegram Crypto Asset Selector
  // --------------------------------------------------------------------------
  const CRYPTO_RAILS = {
    USDT: "Instant <strong>USDT</strong> (TRC-20 / TON / ERC-20) checkout in Telegram via <code>@CryptoBot</code> &amp; <code>@viralclibot</code> — no credit card required.",
    TON: "Instant <strong>TON</strong> native Toncoin checkout in Telegram via <code>@CryptoBot</code> &amp; <code>@viralclibot</code> — settles in seconds with near-zero fees.",
    USDC: "Instant <strong>USDC</strong> stablecoin checkout in Telegram via <code>@CryptoBot</code> &amp; <code>@viralclibot</code> — no credit card required.",
  };

  const cryptoPills = Array.from(document.querySelectorAll(".crypto-pill"));
  const cryptoNote = document.getElementById("cryptoNote");

  cryptoPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const asset = pill.dataset.asset;
      if (!asset || !CRYPTO_RAILS[asset]) return;

      cryptoPills.forEach((p) => {
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
  // 7. Install Section: Working SHA-256 Copy Button
  // --------------------------------------------------------------------------
  const copyBtn = document.getElementById("copyShaBtn");
  const copyLabel = document.getElementById("copyShaLabel");
  const copyLive = document.getElementById("copyStatusLive");

  if (copyBtn) {
    let resetTimer = null;

    const showCopiedState = () => {
      const copyIcon = copyBtn.querySelector(".icon-copy");
      const checkIcon = copyBtn.querySelector(".icon-check");
      copyBtn.classList.add("is-copied");
      if (copyIcon) copyIcon.hidden = true;
      if (checkIcon) checkIcon.hidden = false;
      if (copyLabel) copyLabel.textContent = "Copied";
      if (copyLive) copyLive.textContent = "SHA-256 checksum copied to clipboard.";

      if (resetTimer) window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => {
        copyBtn.classList.remove("is-copied");
        if (copyIcon) copyIcon.hidden = false;
        if (checkIcon) checkIcon.hidden = true;
        if (copyLabel) copyLabel.textContent = "Copy";
        if (copyLive) copyLive.textContent = "";
      }, 2200);
    };

    copyBtn.addEventListener("click", async () => {
      const sha = copyBtn.dataset.sha || "";
      if (!sha) return;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(sha);
          showCopiedState();
          return;
        }
      } catch (_err) {
        // Fall through to execCommand fallback
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
        showCopiedState();
      } finally {
        document.body.removeChild(textarea);
      }
    });
  }
})();
