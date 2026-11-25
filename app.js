/* ==========================================================================
   ClipViral AI (Iteration 4 - Rulebook Edition)
   Bilingual EN/RU, Theme Sync, html.fw Guard, Staged Goo Nav, 20-Card Bento,
   12-Col Engine Goo Grid, WebGL Rays, and Three.js r186 3D Play-Button Icon
   ========================================================================== */

import { ICONS } from "./icons.js";
import { initHeroRays } from "./rays.js";

const APK_URL = "https://github.com/dandysuper/clipviral-site/releases/latest/download/ClipViral.apk";
const PRO_BOT_URL = "https://t.me/viralclibot";
const APK_SHA256 = "7ba12d2bc0f807e1edb3b76312931239f05636c91a7a3018bef5f80a8c18196f";

const docEl = document.documentElement;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// --------------------------------------------------------------------------
// 1. Bilingual Copy Dictionary (EN + RU, declarative sentence-case voice)
// --------------------------------------------------------------------------
const COPY = {
  en: {
    skip: "Skip to content",
    themeLabel: "Theme",
    langLabel: "Language",
    navFeatures: "Features",
    navEngine: "Engine",
    lead: "Long videos into vertical clips, right on Android.",
    heroBtn: "Download",
    heroCodeBtn: "Check releases",
    featTitle: "What's inside",
    showAll: "Show all 20",
    collapse: "Collapse",
    engineTitle: "Engine & Pro",
    engineLead: "Built to cut, caption, and post straight from your phone.",
    abTitle: "What the engine handles",
    howTitle: "How to install",
    pricingTitle: "Free and Pro",
    pricingText:
      "Free gives 3 AI analyses a day at 360p and 480p with Instant YT Peaks. Pro via @CryptoBot removes limits and unlocks 720p, Karaoke/Neon, and Live Capture: $1.69 weekly, $4.29 monthly, $12.99 lifetime.",
    modelsTitle: "Presets and models",
    modelsText:
      "Six built-in vision models work without keys. Plug in Gemini 2.5 Flash or any OpenAI endpoint, or switch render presets in one tap.",
    codeNote: "// Preset: Hormozi Reel · Media3 GPU",
    dlTitle: "Android 8.0+",
    dlOpt0: "APK v3.0.2",
    dlOpt1: "Pro Bot",
    dlCta0: "Download ClipViral.apk",
    dlCta1: "Open @viralclibot",
    copySha: "Copy SHA-256",
    copiedSha: "Copied",
    features: [
      { icon: "heatmap", title: "YouTube heatmaps", body: "Finds Most Replayed spikes automatically." },
      { icon: "gpu", title: "On-device GPU", body: "Media3 hardware rendering with no cloud queue." },
      { icon: "karaoke", title: "Karaoke captions", body: "Word-by-word yellow pop synced to speech." },
      { icon: "live", title: "Live capture", body: "Clip YouTube Live and .m3u8 streams in real time." },
      { icon: "instant", title: "Instant Cut", body: "Zero re-encode audio pass when speed stays 1.0x." },
      { icon: "sponsor", title: "SponsorBlock skip", body: "Drops sponsor reads before scoring moments." },
      { icon: "score", title: "Viral score", body: "Breaks each clip into hook, retention, shareability." },
      { icon: "vision", title: "Built-in vision AI", body: "DeepSeek 4.1, GLM 5.3, Muse Spark, Top-Tools ready." },
      { icon: "apikey", title: "Own API keys", body: "Connect Gemini 2.5 Flash or any OpenAI endpoint." },
      { icon: "fallback", title: "Auto fallback", body: "Switches AI providers quietly if one hits limits." },
      { icon: "presets", title: "Six creator presets", body: "Hormozi Reel, Anti-Copyright Max, Clean Original." },
      { icon: "styles", title: "Four caption styles", body: "Karaoke Pop, Dark Pill, Bold Outline, Neon Glow." },
      { icon: "grading", title: "Color grading", body: "Vibrant Pop, Cinema Warm, Crisp Cool, Punchy HDR." },
      { icon: "aspect", title: "Four aspect ratios", body: "9:16 Fill, 9:16 Fit, 1:1 Square, and Original." },
      { icon: "hd720", title: "Up to 720p HD", body: "Express 360p, Fast 480p, Balanced 540p, HD 720p." },
      { icon: "studio", title: "Viral Studio", body: "Hooks, captions, and hashtags across six tones." },
      { icon: "share", title: "Share sheet ingest", body: "Send links or files straight from YouTube or Gallery." },
      { icon: "posting", title: "Direct posting", body: "Opens right into TikTok, Reels, Shorts, X, Threads." },
      { icon: "anticopyright", title: "Anti-copyright tools", body: "Mirror, zoom, speed, pitch, border, watermark." },
      { icon: "srt", title: "SRT and manual trim", body: "Attach .srt files or cut custom time ranges." },
    ],
    abilities: [
      { icon: "abPeaks", title: "Peak detection", body: "Combines YouTube replay heatmaps, SponsorBlock skips, and vision frames." },
      { icon: "abGpu", title: "Hardware rendering", body: "Media3 Transformer runs locally on Android GPU at 24 to 30 fps." },
      { icon: "abCopy", title: "Social copywriting", body: "Writes hooks and captions tailored to each platform's character limit." },
      { icon: "abPro", title: "Telegram Pro unlock", body: "Links via @viralclibot with instant USDT, TON, or USDC checkout." },
    ],
    steps: [
      { title: "Download ClipViral.apk", body: "21 MB signed build for Android 8.0 and newer." },
      { title: "Allow unknown apps", body: "Tap the file once and confirm install in Android settings." },
      { title: "Paste any link", body: "Pick a YouTube URL, live stream, or local video and export." },
    ],
  },
  ru: {
    skip: "К содержанию",
    themeLabel: "Тема",
    langLabel: "Язык",
    navFeatures: "Фичи",
    navEngine: "Движок",
    lead: "Длинные видео в вертикальные клипы прямо на Android.",
    heroBtn: "Скачать",
    heroCodeBtn: "Смотреть релизы",
    featTitle: "Что внутри",
    showAll: "Показать все 20",
    collapse: "Свернуть",
    engineTitle: "Движок и Pro",
    engineLead: "Режет, титрует и публикует прямо с телефона.",
    abTitle: "Что берёт на себя движок",
    howTitle: "Как поставить",
    pricingTitle: "Free и Pro",
    pricingText:
      "Free даёт 3 AI-анализа в день в 360p и 480p с картой повторов YouTube. Pro через @CryptoBot снимает лимиты и открывает 720p, Караоке/Неон и захват стримов: $1.69 в неделю, $4.29 в месяц, $12.99 навсегда.",
    modelsTitle: "Пресеты и модели",
    modelsText:
      "Шесть встроенных vision-моделей работают без ключей. Подключай Gemini 2.5 Flash или любой OpenAI-эндпоинт и меняй пресеты рендера в одно касание.",
    codeNote: "// Пресет: Hormozi Reel · Media3 GPU",
    dlTitle: "Android 8.0+",
    dlOpt0: "APK v3.0.2",
    dlOpt1: "Pro-бот",
    dlCta0: "Скачать ClipViral.apk",
    dlCta1: "Открыть @viralclibot",
    copySha: "Копировать SHA-256",
    copiedSha: "Скопировано",
    features: [
      { icon: "heatmap", title: "Карта повторов", body: "Сама находит пики просмотров на YouTube." },
      { icon: "gpu", title: "Рендер на GPU", body: "Аппаратный рендер Media3 без облачных очередей." },
      { icon: "karaoke", title: "Караоке-субтитры", body: "Пословная жёлтая подсветка в такт речи." },
      { icon: "live", title: "Захват стримов", body: "Нарезка YouTube Live и .m3u8 прямо в эфире." },
      { icon: "instant", title: "Мгновенная резка", body: "Без перекодировки звука на обычной скорости." },
      { icon: "sponsor", title: "Пропуск рекламы", body: "SponsorBlock убирает интеграции до анализа." },
      { icon: "score", title: "Оценка виральности", body: "Раскладывает клип на хук, удержание и репосты." },
      { icon: "vision", title: "Встроенный AI", body: "DeepSeek 4.1, GLM 5.3, Muse Spark и Top-Tools." },
      { icon: "apikey", title: "Свои API-ключи", body: "Gemini 2.5 Flash или любой OpenAI-совместимый URL." },
      { icon: "fallback", title: "Авто-фолбэк", body: "Переключает провайдера сам при лимите запросов." },
      { icon: "presets", title: "Шесть пресетов", body: "Hormozi Reel, Anti-Copyright Max и чистый оригинал." },
      { icon: "styles", title: "Четыре стиля титров", body: "Karaoke Pop, Dark Pill, Bold Outline и Neon Glow." },
      { icon: "grading", title: "Цветокоррекция", body: "Vibrant Pop, Cinema Warm, Crisp Cool и Punchy HDR." },
      { icon: "aspect", title: "Четыре формата", body: "9:16 Fill, 9:16 Fit, 1:1 квадрат и оригинал." },
      { icon: "hd720", title: "До 720p HD", body: "Express 360p, Fast 480p, Balanced 540p и HD 720p." },
      { icon: "studio", title: "Вирусная студия", body: "Хуки, описания и хештеги в шести тональностях." },
      { icon: "share", title: "Вход из «Поделиться»", body: "Отправляй ссылки и видео из YouTube или галереи." },
      { icon: "posting", title: "Прямой постинг", body: "Отправка сразу в TikTok, Reels, Shorts, X и Threads." },
      { icon: "anticopyright", title: "Анти-копирайт", body: "Зеркало, зум, скорость, питч, рамка и водяной знак." },
      { icon: "srt", title: "SRT и ручной трим", body: "Импорт своих .srt и точная обрезка по таймкоду." },
    ],
    abilities: [
      { icon: "abPeaks", title: "Поиск пиков", body: "Совмещает карту повторов YouTube, пропуски SponsorBlock и кадры AI." },
      { icon: "abGpu", title: "Аппаратный рендер", body: "Media3 Transformer рендерит локально на GPU Android в 24–30 fps." },
      { icon: "abCopy", title: "Тексты для соцсетей", body: "Пишет хуки и описания под лимиты символов каждой площадки." },
      { icon: "abPro", title: "Pro через Telegram", body: "Привязка через @viralclibot с оплатой в USDT, TON или USDC." },
    ],
    steps: [
      { title: "Скачай ClipViral.apk", body: "Подписанная сборка 21 MB для Android 8.0 и выше." },
      { title: "Разреши установку", body: "Открой файл один раз и подтверди установку в настройках Android." },
      { title: "Вставь любую ссылку", body: "Выбери ролик YouTube, стрим или видео с телефона и экспортируй." },
    ],
  },
};

// --------------------------------------------------------------------------
// 2. State: Theme, Language, Download Option, Mobile Bento Expansion
// --------------------------------------------------------------------------
let currentLang = docEl.getAttribute("lang") === "ru" ? "ru" : "en";
let currentTheme = docEl.getAttribute("data-theme") === "dark" ? "dark" : "light";
let currentDlOpt = 0;
let bentoOpen = false;
let icon3dController = null;
let raysController = null;

// --------------------------------------------------------------------------
// 3. Build 20-Card Goo-Blob Feature Grid (#goo-b)
// --------------------------------------------------------------------------
const bentoGrid = document.getElementById("bentoGrid");
const bentoGooLayer = document.getElementById("bentoGooLayer");
const bentoContentLayer = document.getElementById("bentoContentLayer");
const bentoMoreBtn = document.getElementById("bentoMoreBtn");

function buildBentoGooLayer() {
  if (!bentoGooLayer) return;
  const frag = document.createDocumentFragment();

  // 20 rounded goo rectangles matching the 4x5 cells
  for (let i = 0; i < 20; i += 1) {
    const cell = document.createElement("i");
    cell.className = i >= 4 ? "gc x" : "gc";
    frag.appendChild(cell);
  }

  // 16 desktop vertical bridges (4 row gaps x 4 cols) centered on each column
  for (let r = 0; r < 4; r += 1) {
    for (let c = 0; c < 4; c += 1) {
      const br = document.createElement("i");
      br.className = "br dsk v";
      br.style.left = `calc(${c} * ((100% - 3 * var(--g)) / 4 + var(--g)) + (100% - 3 * var(--g)) / 8 - var(--bw) / 2)`;
      br.style.top = `calc(${r} * (var(--r) + var(--g)) + var(--r) - 4px)`;
      frag.appendChild(br);
    }
  }

  // 15 desktop horizontal bridges (5 rows x 3 col gaps) centered on each row
  for (let r = 0; r < 5; r += 1) {
    for (let c = 0; c < 3; c += 1) {
      const br = document.createElement("i");
      br.className = "br dsk h";
      br.style.left = `calc(${c + 1} * ((100% - 3 * var(--g)) / 4) + ${c} * var(--g) - 4px)`;
      br.style.top = `calc(${r} * (var(--r) + var(--g)) + var(--r) / 2 - var(--bw) / 2)`;
      frag.appendChild(br);
    }
  }

  // 19 mobile vertical connectors
  for (let m = 0; m < 19; m += 1) {
    const br = document.createElement("i");
    br.className = m >= 3 ? "br mob x" : "br mob";
    br.style.top = `calc(${m + 1} * var(--r) + ${m} * var(--g) - 4px)`;
    frag.appendChild(br);
  }

  bentoGooLayer.innerHTML = "";
  bentoGooLayer.appendChild(frag);
}

function renderBentoContent(lang) {
  if (!bentoContentLayer) return;
  const items = COPY[lang].features;
  bentoContentLayer.innerHTML = items
    .map((item, idx) => {
      const extraClass = idx >= 4 ? " x" : "";
      const delayAttr = idx >= 4 ? ` style="--d:${(idx - 4) * 45}ms"` : "";
      return `
        <article class="bc${extraClass}"${delayAttr}>
          <span class="ico-f">${ICONS[item.icon] || ""}</span>
          <div class="bc-t">
            <h3>${item.title}</h3>
            <p>${item.body}</p>
          </div>
        </article>`;
    })
    .join("");
}

buildBentoGooLayer();

// --------------------------------------------------------------------------
// 4. Build 12-Col 4-Tile Engine & Pro Goo Grid (#goo-p)
// --------------------------------------------------------------------------
const engineGooLayer = document.getElementById("engineGooLayer");
const engineContentLayer = document.getElementById("engineContentLayer");

function buildEngineTilesMarkup(lang, isGhost) {
  const dict = COPY[lang];
  const tag = isGhost ? "div" : "article";
  const abList = dict.abilities
    .map(
      (ab) => `
        <li>
          <span class="ico-f">${isGhost ? "" : ICONS[ab.icon] || ""}</span>
          <div><b>${ab.title}</b><span>${ab.body}</span></div>
        </li>`
    )
    .join("");

  const stList = dict.steps
    .map(
      (st, idx) => `
        <li>
          <i>${idx + 1}</i>
          <div><b>${st.title}</b><span>${st.body}</span></div>
        </li>`
    )
    .join("");

  const codeMarkup = `<pre class="code"><span class="c">${dict.codeNote}</span>
<span class="k">val</span> clip = <span class="n">EditPreset</span>.<span class="s">HORMOZI_REEL</span>.copy(
  quality = <span class="n">RenderQuality</span>.<span class="s">HD_720P</span>,
  captions = <span class="n">CaptionStyle</span>.<span class="s">KARAOKE</span>,
  color = <span class="n">ColorPreset</span>.<span class="s">HIGH_CONTRAST</span>,
  mirror = <span class="k">false</span>,
  zoom = <span class="n">1.05f</span>
)</pre>`;

  return `
    <${tag} class="pt pt-a">
      <h3>${dict.abTitle}</h3>
      <ul class="ab">${abList}</ul>
    </${tag}>
    <${tag} class="pt pt-b">
      <h3>${dict.howTitle}</h3>
      <ol class="st">${stList}</ol>
    </${tag}>
    <${tag} class="pt pt-c">
      <span class="ico-f">${isGhost ? "" : ICONS.tilePricing}</span>
      <h3>${dict.pricingTitle}</h3>
      <p>${dict.pricingText}</p>
    </${tag}>
    <${tag} class="pt pt-d">
      <div class="pt-d-t">
        <span class="ico-f">${isGhost ? "" : ICONS.tileModels}</span>
        <h3>${dict.modelsTitle}</h3>
        <p>${dict.modelsText}</p>
      </div>
      ${codeMarkup}
    </${tag}>
    ${isGhost ? '<i class="pn h1"></i><i class="pn h2"></i><i class="pn v1"></i><i class="pn v2"></i><i class="pn v3"></i>' : ""}`;
}

function renderEngineGrid(lang) {
  if (engineGooLayer) {
    engineGooLayer.innerHTML = buildEngineTilesMarkup(lang, true);
  }
  if (engineContentLayer) {
    engineContentLayer.innerHTML = buildEngineTilesMarkup(lang, false);
  }
}

// --------------------------------------------------------------------------
// 5. Language Switcher (EN / RU) & Download Bar Sync
// --------------------------------------------------------------------------
const langToggle = document.getElementById("langToggle");
const langCodeEl = document.getElementById("langCode");
const dlSwitch = document.getElementById("dlSwitch");
const dlActionBtn = document.getElementById("dlActionBtn");
const dlActionLabel = document.getElementById("dlActionLabel");
const dlButtons = Array.from(document.querySelectorAll("[data-dl-opt]"));
const copyShaBtn = document.getElementById("copyShaBtn");
let copyShaTimer = null;

function syncDownloadBar() {
  const dict = COPY[currentLang];
  if (dlSwitch) {
    dlSwitch.style.setProperty("--i", String(currentDlOpt));
  }
  dlButtons.forEach((btn, idx) => {
    const active = idx === currentDlOpt;
    btn.classList.toggle("on", active);
    btn.setAttribute("aria-selected", String(active));
  });
  if (dlActionBtn) {
    dlActionBtn.setAttribute("href", currentDlOpt === 0 ? APK_URL : PRO_BOT_URL);
    if (currentDlOpt === 1) {
      dlActionBtn.setAttribute("target", "_blank");
      dlActionBtn.setAttribute("rel", "noopener noreferrer");
    } else {
      dlActionBtn.removeAttribute("target");
      dlActionBtn.removeAttribute("rel");
    }
  }
  if (dlActionLabel) {
    dlActionLabel.textContent = currentDlOpt === 0 ? dict.dlCta0 : dict.dlCta1;
  }
}

function syncBentoMoreLabel() {
  if (!bentoMoreBtn) return;
  const dict = COPY[currentLang];
  bentoMoreBtn.textContent = bentoOpen ? dict.collapse : dict.showAll;
  bentoMoreBtn.setAttribute("aria-expanded", String(bentoOpen));
}

function applyLanguage(lang, persist = true) {
  currentLang = lang === "ru" ? "ru" : "en";
  docEl.setAttribute("lang", currentLang);
  const dict = COPY[currentLang];

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key && dict[key] !== undefined) {
      el.textContent = dict[key];
    }
  });

  if (langCodeEl) {
    langCodeEl.textContent = currentLang.toUpperCase();
  }
  if (langToggle) {
    langToggle.setAttribute("aria-label", dict.langLabel);
  }
  const themeToggleEl = document.getElementById("themeToggle");
  if (themeToggleEl) {
    themeToggleEl.setAttribute("aria-label", dict.themeLabel);
  }

  renderBentoContent(currentLang);
  renderEngineGrid(currentLang);
  syncBentoMoreLabel();
  syncDownloadBar();

  if (persist) {
    try {
      localStorage.setItem("clipviral-lang", currentLang);
    } catch (_err) {}
  }
}

if (langToggle) {
  langToggle.addEventListener("click", () => {
    applyLanguage(currentLang === "en" ? "ru" : "en", true);
  });
}

dlButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const idx = Number(btn.getAttribute("data-dl-opt"));
    if (!Number.isNaN(idx)) {
      currentDlOpt = idx;
      syncDownloadBar();
    }
  });
});

if (bentoMoreBtn && bentoGrid) {
  bentoMoreBtn.addEventListener("click", () => {
    bentoOpen = !bentoOpen;
    bentoGrid.classList.toggle("open", bentoOpen);
    syncBentoMoreLabel();
  });
}

if (copyShaBtn) {
  copyShaBtn.addEventListener("click", async () => {
    let copied = false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(APK_SHA256);
        copied = true;
      }
    } catch (_err) {
      copied = false;
    }

    if (!copied) {
      try {
        const ta = document.createElement("textarea");
        ta.value = APK_SHA256;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        copied = true;
      } catch (_err) {}
    }

    copyShaBtn.textContent = COPY[currentLang].copiedSha;
    copyShaBtn.classList.add("copied");
    if (copyShaTimer) window.clearTimeout(copyShaTimer);
    copyShaTimer = window.setTimeout(() => {
      copyShaBtn.textContent = COPY[currentLang].copySha;
      copyShaBtn.classList.remove("copied");
    }, 2000);
  });
}

applyLanguage(currentLang, false);

// --------------------------------------------------------------------------
// 6. Theme Switcher (sets BOTH data-theme and data-mode per STYLEGUIDE.md)
// --------------------------------------------------------------------------
const themeToggle = document.getElementById("themeToggle");
const themeColorMeta = document.getElementById("themeColorMeta");

function applyTheme(theme, persist = true) {
  currentTheme = theme === "dark" ? "dark" : "light";
  const isDark = currentTheme === "dark";

  docEl.setAttribute("data-theme", currentTheme);
  docEl.setAttribute("data-mode", currentTheme);

  if (themeColorMeta) {
    themeColorMeta.setAttribute("content", isDark ? "#141414" : "#fbfbfb");
  }

  if (themeToggle) {
    const sun = themeToggle.querySelector(".icon-sun");
    const moon = themeToggle.querySelector(".icon-moon");
    if (sun) sun.toggleAttribute("hidden", !isDark);
    if (moon) moon.toggleAttribute("hidden", isDark);
    themeToggle.setAttribute("aria-pressed", String(isDark));
  }

  if (icon3dController && typeof icon3dController.setTheme === "function") {
    icon3dController.setTheme(currentTheme);
  }
  if (raysController && typeof raysController.setTheme === "function") {
    raysController.setTheme(currentTheme);
  }

  if (persist) {
    try {
      localStorage.setItem("clipviral-theme", currentTheme);
    } catch (_err) {}
  }
}

applyTheme(currentTheme, false);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    applyTheme(currentTheme === "dark" ? "light" : "dark", true);
  });
}

// --------------------------------------------------------------------------
// 7. Scroll Blades (.blur[data-stuck]) & Nav Halo (.nav.stuck)
// --------------------------------------------------------------------------
const mainNav = document.getElementById("mainNav");
const blurTop = document.getElementById("blurTop");
const blurBottom = document.getElementById("blurBottom");

function updateScrollChrome() {
  const stuck = (window.scrollY || window.pageYOffset || 0) > 12;
  if (mainNav) mainNav.classList.toggle("stuck", stuck);
  if (blurTop) {
    if (stuck) blurTop.setAttribute("data-stuck", "");
    else blurTop.removeAttribute("data-stuck");
  }
  if (blurBottom) {
    if (stuck) blurBottom.setAttribute("data-stuck", "");
    else blurBottom.removeAttribute("data-stuck");
  }
}

window.addEventListener("scroll", updateScrollChrome, { passive: true });
updateScrollChrome();

// --------------------------------------------------------------------------
// 8. Scroll Reveal (.rv -> .rv.in via IntersectionObserver + fast-scroll sweep)
// --------------------------------------------------------------------------
const rvNodes = Array.from(document.querySelectorAll(".rv"));
let rvObserver = null;

function sweepReveals() {
  const cutoff = window.innerHeight * 0.94;
  rvNodes.forEach((node) => {
    if (node.classList.contains("in")) return;
    if (node.getBoundingClientRect().top < cutoff) {
      node.classList.add("in");
      if (rvObserver) rvObserver.unobserve(node);
    }
  });
}

if (!prefersReducedMotion && "IntersectionObserver" in window && rvNodes.length > 0) {
  rvObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          rvObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  rvNodes.forEach((node) => rvObserver.observe(node));
  window.addEventListener("scroll", sweepReveals, { passive: true });
  sweepReveals();
} else {
  rvNodes.forEach((node) => node.classList.add("in"));
}

// --------------------------------------------------------------------------
// 9. Staged Goo Nav Entrance (Seal -> Pills grow outward -> Labels unblur)
// --------------------------------------------------------------------------
let navEntrancePlayed = false;

function playNavEntrance() {
  if (navEntrancePlayed || prefersReducedMotion || !mainNav) return;
  navEntrancePlayed = true;

  const seals = Array.from(mainNav.querySelectorAll(".n-seal"));
  const pills = Array.from(mainNav.querySelectorAll(".n-links, .n-dl"));
  const fgIns = Array.from(mainNav.querySelectorAll(".nav-fg .n-in"));

  // Measure target pill widths before collapsing for outward growth
  const measured = pills.map((el) => ({
    el,
    width: el.getBoundingClientRect().width,
  }));

  seals.forEach((el) => {
    el.animate(
      [
        { opacity: 0, transform: "scale(0.2)" },
        { opacity: 1, transform: "scale(1)" },
      ],
      {
        duration: 700,
        easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        fill: "backwards",
      }
    );
  });

  measured.forEach(({ el, width }) => {
    if (width <= 0) return;
    el.style.overflow = "hidden";
    const anim = el.animate(
      [
        { width: "0px", paddingLeft: "0px", paddingRight: "0px", opacity: 0 },
        { width: `${width}px`, paddingLeft: "6px", paddingRight: "6px", opacity: 1 },
      ],
      {
        duration: 1050,
        delay: 320,
        easing: "cubic-bezier(0.34, 1.25, 0.64, 1)",
        fill: "backwards",
      }
    );
    anim.onfinish = () => {
      el.style.overflow = "";
    };
  });

  fgIns.forEach((el) => {
    el.animate(
      [
        { opacity: 0, filter: "blur(8px)" },
        { opacity: 1, filter: "blur(0px)" },
      ],
      {
        duration: 600,
        delay: 620,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "backwards",
      }
    );
  });
}

// --------------------------------------------------------------------------
// 10. Font + Logo Loading Guard (html.fw -> release when fonts & 3D icon ready)
// --------------------------------------------------------------------------
const fwState = { fonts: false, logo: false };
let fwReleased = !docEl.classList.contains("fw");

function releaseFw() {
  if (fwReleased) return;
  fwReleased = true;
  if (window.__clipviralFwTimer) {
    window.clearTimeout(window.__clipviralFwTimer);
    window.__clipviralFwTimer = null;
  }
  docEl.classList.remove("fw");
  playNavEntrance();
  if (icon3dController && typeof icon3dController.playEntrance === "function") {
    icon3dController.playEntrance();
  }
}

function checkFw() {
  if (fwState.fonts && fwState.logo) {
    releaseFw();
  }
}

(document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
  fwState.fonts = true;
  checkFw();
});

// Fallback if inline 4000ms timer removed html.fw while resources were slow
if (!fwReleased && "MutationObserver" in window) {
  const mo = new MutationObserver(() => {
    if (!docEl.classList.contains("fw")) {
      mo.disconnect();
      if (!fwReleased) {
        fwReleased = true;
        playNavEntrance();
      }
    }
  });
  mo.observe(docEl, { attributes: true, attributeFilter: ["class"] });
}

// --------------------------------------------------------------------------
// 11. Mount WebGL Corner Light Rays & Three.js r186 3D Play-Button Icon
// --------------------------------------------------------------------------
const heroSection = document.getElementById("top");
const raysLeftCanvas = document.getElementById("raysLeft");
const raysRightCanvas = document.getElementById("raysRight");
raysController = initHeroRays(heroSection, raysLeftCanvas, raysRightCanvas);
if (raysController) {
  raysController.setTheme(currentTheme);
}

const icon3dStage = document.getElementById("icon3dStage");

async function mountIcon3D() {
  if (!icon3dStage) {
    fwState.logo = true;
    checkFw();
    return;
  }

  // Yield one paint frame before heavy Three.js setup so background & fonts never stall
  await new Promise((resolve) => window.requestAnimationFrame(resolve));

  try {
    const mod = await import("./icon3d.js");
    icon3dController = mod.initClipViralIcon3D(icon3dStage, {
      deferEntrance: false,
      onReady: () => {
        fwState.logo = true;
        checkFw();
      },
    });
    if (icon3dController) {
      icon3dController.setTheme(currentTheme);
    } else {
      const fb = icon3dStage.querySelector("[data-icon3d-fallback]");
      if (fb) fb.hidden = false;
      fwState.logo = true;
      checkFw();
    }
  } catch (_err) {
    const fb = icon3dStage.querySelector("[data-icon3d-fallback]");
    if (fb) fb.hidden = false;
    fwState.logo = true;
    checkFw();
  }
}

mountIcon3D();
