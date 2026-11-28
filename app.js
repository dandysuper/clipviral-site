/* ==========================================================================
   ClipViral 5.0 site
   Bilingual EN/RU, dark-first theme, and a working copy of the app's tape:
   drag the clip window and it snaps to the nearest found moment.
   ========================================================================== */

const APK_URL = "https://github.com/dandysuper/clipviral-site/releases/latest/download/ClipViral.apk";
const PRO_BOT_URL = "https://t.me/viralclibot";
const APK_SHA256 = "c75f0d7bd4bf74ccb1ccae78e5fd8dc4b54e2d8c7fa60c6d91d07dee0fa6bb4b";

const docEl = document.documentElement;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// --------------------------------------------------------------------------
// 1. Copy (EN + RU)
// --------------------------------------------------------------------------

// The scanned video from the app's own mockup content (design/DIRECTION.md).
const VIDEO_SEC = 2 * 3600 + 14 * 60 + 6;
const CLIPS = [
  { inS: 872, outS: 908, score: 91 },
  { inS: 2467, outS: 2509, score: 88 },
  { inS: 3738, outS: 3784, score: 76 },
  { inS: 1675, outS: 1711, score: 71 },
  { inS: 6482, outS: 6504, score: 64 },
  { inS: 3490, outS: 3519, score: 58 },
];

const COPY = {
  en: {
    skip: "Skip to content",
    themeLabel: "Theme",
    langLabel: "Language",
    navFeatures: "Features",
    navEngine: "Engine",
    navDownload: "Download",
    kicker: "Android 8.0+ · free to try",
    lead: "Long videos into vertical clips, right on Android.",
    heroSub:
      "Paste a link. ClipViral reads where the audience replayed, finds the moments worth posting, and cuts them into reels with captions on your phone.",
    heroBtn: "Download APK",
    heroCodeBtn: "Check releases",
    benchLabel: "Scanned video",
    benchVideo: "Building in public, year three: 41k subscribers and £0 MRR",
    benchFound: "6 clips found",
    tapeHint: "Drag the window. It snaps to the nearest moment, like it does in the app.",
    pickTop: "PICK OF SIX",
    pickRank: (n) => `NO. ${n} OF SIX`,
    clips: [
      { title: "Your first 100 users come from DMs, not ads", hook: "ads didn’t get me here" },
      { title: "He deleted the app twice before he paid", hook: "I installed it, I deleted it, I installed it again" },
      { title: "The pricing mistake nobody talks about", hook: "we charged per seat and lost every team" },
      { title: "The cold email that got a 40% reply rate", hook: "three lines, no link, one question" },
      { title: "Don't quit your job yet", hook: "keep the salary until the product pays rent" },
      { title: "Why he stopped reading comments", hook: "the loudest ten people aren’t your users" },
    ],
    featTitle: "What's inside",
    showAll: "Show all 20",
    collapse: "Collapse",
    engineTitle: "Engine & Pro",
    engineLead: "Built to cut, caption, and post straight from your phone.",
    abTitle: "What the engine handles",
    howTitle: "How to install",
    pricingTitle: "ClipViral Pro",
    pricingText:
      "Connect via @viralclibot and unlock full access with @CryptoBot (USDT, TON, USDC): unlimited AI clips, 720p, Karaoke and Neon captions, and Live Capture.",
    rates: [
      { name: "Weekly", price: "$1.69" },
      { name: "Monthly", price: "$4.29" },
      { name: "Lifetime", price: "$12.99", best: true },
    ],
    modelsTitle: "Presets and models",
    modelsText:
      "Six built-in vision models work without keys. Plug in Gemini 2.5 Flash or any OpenAI endpoint, or switch render presets in one tap.",
    codeNote: "// Preset: Hormozi Reel · Media3 GPU",
    dlTitle: "Android 8.0+",
    dlLead: "One signed APK. It updates itself when a new build ships.",
    dlOpt0: "APK v5.0.1",
    dlOpt1: "Pro Bot",
    dlCta0: "Download ClipViral.apk",
    dlCta1: "Open @viralclibot",
    specVersion: "Version",
    specSize: "Size",
    copySha: "Copy",
    copiedSha: "Copied",
    newsTitle: "What's new in 5.0",
    news: [
      { title: "A new look", body: "Warm-black bench, one amber lamp, and the video drawn as a tape with the found moments lit on it." },
      { title: "A new icon", body: "An amber tape window replaces the old neon play button." },
      { title: "Scan, rebuilt", body: "Scan for clips, Peaks only, a draggable clip tape that snaps to peaks, a new clip detail and library." },
      { title: "5.0.1 fix", body: "The bottom bar no longer sits in the middle of the screen and hides the page." },
    ],
    features: [
      { title: "YouTube heatmaps", body: "Finds Most Replayed spikes automatically." },
      { title: "On-device GPU", body: "Media3 hardware rendering with no cloud queue." },
      { title: "Karaoke captions", body: "Word-by-word pop synced to speech." },
      { title: "Live capture", body: "Clip YouTube Live and .m3u8 streams in real time." },
      { title: "Instant Cut", body: "Zero re-encode audio pass when speed stays 1.0x." },
      { title: "SponsorBlock skip", body: "Drops sponsor reads before scoring moments." },
      { title: "Viral score", body: "Breaks each clip into hook, retention, shareability." },
      { title: "Built-in vision AI", body: "DeepSeek 4.1, GLM 5.3, Muse Spark, Top-Tools ready." },
      { title: "Own API keys", body: "Connect Gemini 2.5 Flash or any OpenAI endpoint." },
      { title: "Auto fallback", body: "Switches AI providers quietly if one hits limits." },
      { title: "Six creator presets", body: "Hormozi Reel, Anti-Copyright Max, Clean Original." },
      { title: "Four caption styles", body: "Karaoke Pop, Dark Pill, Bold Outline, Neon Glow." },
      { title: "Color grading", body: "Vibrant Pop, Cinema Warm, Crisp Cool, Punchy HDR." },
      { title: "Four aspect ratios", body: "9:16 Fill, 9:16 Fit, 1:1 Square, and Original." },
      { title: "Up to 720p HD", body: "Express 360p, Fast 480p, Balanced 540p, HD 720p." },
      { title: "Viral Studio", body: "Hooks, captions, and hashtags across six tones." },
      { title: "Share sheet ingest", body: "Send links or files straight from YouTube or Gallery." },
      { title: "Direct posting", body: "Opens right into TikTok, Reels, Shorts, X, Threads." },
      { title: "Anti-copyright tools", body: "Mirror, zoom, speed, pitch, border, watermark." },
      { title: "SRT and manual trim", body: "Attach .srt files or cut custom time ranges." },
    ],
    abilities: [
      { title: "Peak detection", body: "Combines YouTube replay heatmaps, SponsorBlock skips, and vision frames." },
      { title: "Hardware rendering", body: "Media3 Transformer runs locally on Android GPU at 24 to 30 fps." },
      { title: "Social copywriting", body: "Writes hooks and captions tailored to each platform's character limit." },
      { title: "Telegram Pro unlock", body: "Links via @viralclibot with instant USDT, TON, or USDC checkout." },
    ],
    steps: [
      { title: "Download ClipViral.apk", body: "3.9 MB signed release build for Android 8.0 and newer." },
      { title: "Allow unknown apps", body: "Tap the file once and confirm install in Android settings." },
      { title: "Paste any link", body: "Pick a YouTube URL, live stream, or local video and scan it." },
    ],
  },
  ru: {
    skip: "К содержанию",
    themeLabel: "Тема",
    langLabel: "Язык",
    navFeatures: "Фичи",
    navEngine: "Движок",
    navDownload: "Скачать",
    kicker: "Android 8.0+ · можно попробовать бесплатно",
    lead: "Длинные видео в вертикальные клипы прямо на Android.",
    heroSub:
      "Вставь ссылку. ClipViral смотрит, где зрители пересматривали, находит моменты для постинга и режет их в рилсы с субтитрами прямо на телефоне.",
    heroBtn: "Скачать APK",
    heroCodeBtn: "Смотреть релизы",
    benchLabel: "Проанализированное видео",
    benchVideo: "Строю в открытую, год третий: 41 тыс. подписчиков и £0 MRR",
    benchFound: "найдено 6 клипов",
    tapeHint: "Потяни окно. Оно встанет на ближайший момент, как в приложении.",
    pickTop: "ЛУЧШИЙ ИЗ ШЕСТИ",
    pickRank: (n) => `№ ${n} ИЗ ШЕСТИ`,
    clips: [
      { title: "Первые 100 пользователей приходят из личек, а не из рекламы", hook: "реклама меня сюда не привела" },
      { title: "Он дважды удалил приложение, прежде чем заплатить", hook: "установил, удалил, установил снова" },
      { title: "Ошибка в цене, о которой никто не говорит", hook: "брали за каждое место и потеряли все команды" },
      { title: "Холодное письмо с 40% ответов", hook: "три строки, без ссылки, один вопрос" },
      { title: "Не увольняйся пока", hook: "держись за зарплату, пока продукт не платит аренду" },
      { title: "Почему он перестал читать комментарии", hook: "десять самых громких — не твои пользователи" },
    ],
    featTitle: "Что внутри",
    showAll: "Показать все 20",
    collapse: "Свернуть",
    engineTitle: "Движок и Pro",
    engineLead: "Режет, титрует и публикует прямо с телефона.",
    abTitle: "Что берёт на себя движок",
    howTitle: "Как поставить",
    pricingTitle: "ClipViral Pro",
    pricingText:
      "Подключи @viralclibot и открой полный доступ через @CryptoBot (USDT, TON, USDC): безлимитные AI-клипы, 720p, Караоке и Неон, захват стримов.",
    rates: [
      { name: "Неделя", price: "$1.69" },
      { name: "Месяц", price: "$4.29" },
      { name: "Навсегда", price: "$12.99", best: true },
    ],
    modelsTitle: "Пресеты и модели",
    modelsText:
      "Шесть встроенных vision-моделей работают без ключей. Подключай Gemini 2.5 Flash или любой OpenAI-эндпоинт и меняй пресеты рендера в одно касание.",
    codeNote: "// Пресет: Hormozi Reel · Media3 GPU",
    dlTitle: "Android 8.0+",
    dlLead: "Один подписанный APK. Сам обновляется, когда выходит новая сборка.",
    dlOpt0: "APK v5.0.1",
    dlOpt1: "Pro-бот",
    dlCta0: "Скачать ClipViral.apk",
    dlCta1: "Открыть @viralclibot",
    specVersion: "Версия",
    specSize: "Размер",
    copySha: "Копировать",
    copiedSha: "Скопировано",
    newsTitle: "Что нового в 5.0",
    news: [
      { title: "Новый вид", body: "Тёплый чёрный монтажный стол, одна янтарная лампа и видео в виде плёнки с подсвеченными моментами." },
      { title: "Новая иконка", body: "Янтарное окно плёнки вместо старой неоновой кнопки Play." },
      { title: "Новый экран сканирования", body: "«Найти клипы», «Только пики», плёнка с окном, которое встаёт на пики, новые карточка клипа и библиотека." },
      { title: "Исправление 5.0.1", body: "Нижняя панель больше не висит посреди экрана и не закрывает страницу." },
    ],
    features: [
      { title: "Карта повторов", body: "Сама находит пики просмотров на YouTube." },
      { title: "Рендер на GPU", body: "Аппаратный рендер Media3 без облачных очередей." },
      { title: "Караоке-субтитры", body: "Пословная подсветка в такт речи." },
      { title: "Захват стримов", body: "Нарезка YouTube Live и .m3u8 прямо в эфире." },
      { title: "Мгновенная резка", body: "Без перекодировки звука на обычной скорости." },
      { title: "Пропуск рекламы", body: "SponsorBlock убирает интеграции до анализа." },
      { title: "Оценка виральности", body: "Раскладывает клип на хук, удержание и репосты." },
      { title: "Встроенный AI", body: "DeepSeek 4.1, GLM 5.3, Muse Spark и Top-Tools." },
      { title: "Свои API-ключи", body: "Gemini 2.5 Flash или любой OpenAI-совместимый URL." },
      { title: "Авто-фолбэк", body: "Переключает провайдера сам при лимите запросов." },
      { title: "Шесть пресетов", body: "Hormozi Reel, Anti-Copyright Max и чистый оригинал." },
      { title: "Четыре стиля титров", body: "Karaoke Pop, Dark Pill, Bold Outline и Neon Glow." },
      { title: "Цветокоррекция", body: "Vibrant Pop, Cinema Warm, Crisp Cool и Punchy HDR." },
      { title: "Четыре формата", body: "9:16 Fill, 9:16 Fit, 1:1 квадрат и оригинал." },
      { title: "До 720p HD", body: "Express 360p, Fast 480p, Balanced 540p и HD 720p." },
      { title: "Вирусная студия", body: "Хуки, описания и хештеги в шести тональностях." },
      { title: "Вход из «Поделиться»", body: "Отправляй ссылки и видео из YouTube или галереи." },
      { title: "Прямой постинг", body: "Отправка сразу в TikTok, Reels, Shorts, X и Threads." },
      { title: "Анти-копирайт", body: "Зеркало, зум, скорость, питч, рамка и водяной знак." },
      { title: "SRT и ручной трим", body: "Импорт своих .srt и точная обрезка по таймкоду." },
    ],
    abilities: [
      { title: "Поиск пиков", body: "Совмещает карту повторов YouTube, пропуски SponsorBlock и кадры AI." },
      { title: "Аппаратный рендер", body: "Media3 Transformer рендерит локально на GPU Android в 24–30 fps." },
      { title: "Тексты для соцсетей", body: "Пишет хуки и описания под лимиты символов каждой площадки." },
      { title: "Pro через Telegram", body: "Привязка через @viralclibot с оплатой в USDT, TON или USDC." },
    ],
    steps: [
      { title: "Скачай ClipViral.apk", body: "Подписанная релизная сборка 3.9 MB для Android 8.0 и выше." },
      { title: "Разреши установку", body: "Открой файл один раз и подтверди установку в настройках Android." },
      { title: "Вставь любую ссылку", body: "Выбери ролик YouTube, стрим или видео с телефона и запусти скан." },
    ],
  },
};

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const pad2 = (n) => String(n).padStart(2, "0");

function fmtTime(sec) {
  const s = Math.round(sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return h > 0 ? `${h}:${pad2(m)}:${pad2(r)}` : `${m}:${pad2(r)}`;
}

let lang = docEl.getAttribute("lang") === "ru" ? "ru" : "en";
let theme = docEl.getAttribute("data-theme") === "light" ? "light" : "dark";
let dlOpt = 0;
let featOpen = false;
let selected = 0;

// --------------------------------------------------------------------------
// 2. Static lists
// --------------------------------------------------------------------------

function numberedRows(items, cls = "") {
  return items
    .map(
      (it, i) => `
      <li${cls && i >= 8 ? ` class="${cls}"` : ""}>
        <span class="idx">${pad2(i + 1)}</span>
        <h3>${esc(it.title)}</h3>
        <p>${esc(it.body)}</p>
      </li>`
    )
    .join("");
}

function plainRows(items, numbered) {
  return items
    .map(
      (it, i) => `
      <li>
        <span class="idx">${numbered ? i + 1 : pad2(i + 1)}</span>
        <b>${esc(it.title)}</b>
        <span>${esc(it.body)}</span>
      </li>`
    )
    .join("");
}

function renderLists() {
  const d = COPY[lang];
  document.getElementById("featList").innerHTML = numberedRows(d.features, "x");
  document.getElementById("abList").innerHTML = plainRows(d.abilities, false);
  document.getElementById("stepList").innerHTML = plainRows(d.steps, true);
  document.getElementById("newsList").innerHTML = plainRows(d.news, false);
  document.getElementById("rateRows").innerHTML = d.rates
    .map((r) => `<tr${r.best ? ' class="best"' : ""}><td>${esc(r.name)}</td><td>${r.price}</td></tr>`)
    .join("");
  document.getElementById("codeBlock").innerHTML = `<span class="c">${esc(d.codeNote)}</span>
<span class="k">val</span> clip = <span class="n">EditPreset</span>.<span class="s">HORMOZI_REEL</span>.copy(
  quality = <span class="n">RenderQuality</span>.<span class="s">HD_720P</span>,
  captions = <span class="n">CaptionStyle</span>.<span class="s">KARAOKE</span>,
  color = <span class="n">ColorPreset</span>.<span class="s">HIGH_CONTRAST</span>,
  mirror = <span class="k">false</span>,
  zoom = <span class="n">1.05f</span>
)`;
}

// --------------------------------------------------------------------------
// 3. The tape: trace, tabs, clip window, pick and ledger
// --------------------------------------------------------------------------

const tape = document.getElementById("tape");
const traceSvg = document.getElementById("trace");
const tabsEl = document.getElementById("tabs");
const win = document.getElementById("win");
const ledger = document.getElementById("clipLedger");
const SVG_NS = "http://www.w3.org/2000/svg";

// Replay heat along the video: low noise plus a bump at each found moment,
// as tall as its score. Seeded so the drawing is the same on every visit.
function buildHeat(samples) {
  let seed = 20261128;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
  const heat = [];
  let drift = 0.18;
  for (let i = 0; i < samples; i += 1) {
    drift += (rnd() - 0.5) * 0.06;
    drift = Math.min(0.34, Math.max(0.08, drift));
    heat.push(drift + rnd() * 0.07);
  }
  CLIPS.forEach((c) => {
    const centre = ((c.inS + c.outS) / 2 / VIDEO_SEC) * (samples - 1);
    const height = 0.35 + (c.score / 100) * 0.6;
    const spread = samples * 0.012;
    for (let i = 0; i < samples; i += 1) {
      const d = (i - centre) / spread;
      heat[i] = Math.max(heat[i], heat[i] * 0.4 + height * Math.exp(-d * d));
    }
  });
  return heat;
}

function drawTrace() {
  const W = 1000;
  const H = 100;
  const heat = buildHeat(360);
  const step = W / (heat.length - 1);
  const pts = heat.map((v, i) => `${(i * step).toFixed(1)},${(H - Math.min(0.98, v) * H).toFixed(1)}`);
  const line = `M${pts.join("L")}`;
  const area = `${line}L${W},${H}L0,${H}Z`;

  traceSvg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  traceSvg.innerHTML = `
    <defs><clipPath id="litClip"><rect id="litRect" x="0" y="0" width="0" height="${H}"/></clipPath></defs>
    <path class="fill" d="${area}"/>
    <path class="lit" d="${area}" clip-path="url(#litClip)"/>
    <path class="line" d="${line}"/>`;

  tabsEl.innerHTML = CLIPS.map((c) => {
    const left = ((c.inS + c.outS) / 2 / VIDEO_SEC) * 100;
    return `<span class="tab" style="left:${left.toFixed(3)}%"></span>`;
  }).join("");
}

// The window is as wide as the clip really is, with a floor so it stays a
// thing you can grab on a two-hour strip.
function placeWindow(index, animate) {
  const c = CLIPS[index];
  const tapeW = tape.clientWidth || 1;
  const minW = 18;
  const realW = ((c.outS - c.inS) / VIDEO_SEC) * tapeW;
  const w = Math.max(minW, realW);
  const centre = ((c.inS + c.outS) / 2 / VIDEO_SEC) * tapeW;
  const left = Math.min(tapeW - w, Math.max(0, centre - w / 2));

  win.classList.toggle("springing", Boolean(animate) && !reducedMotion);
  win.style.width = `${w}px`;
  win.style.left = `${left}px`;
  setLit(left, w);
  win.setAttribute("aria-valuenow", String(c.inS));
  win.setAttribute("aria-valuetext", `${fmtTime(c.inS)} to ${fmtTime(c.outS)}`);
}

function setLit(leftPx, widthPx) {
  const rect = document.getElementById("litRect");
  const tapeW = tape.clientWidth || 1;
  if (!rect) return;
  rect.setAttribute("x", String((leftPx / tapeW) * 1000));
  rect.setAttribute("width", String((widthPx / tapeW) * 1000));
}

function renderPick() {
  const d = COPY[lang];
  const c = CLIPS[selected];
  const text = d.clips[selected];
  document.getElementById("pickScore").textContent = String(c.score);
  document.getElementById("pickOf").textContent = selected === 0 ? d.pickTop : d.pickRank(selected + 1);
  document.getElementById("pickTitle").textContent = text.title;
  document.getElementById("pickIn").textContent = fmtTime(c.inS);
  document.getElementById("pickOut").textContent = fmtTime(c.outS);
  document.getElementById("pickDur").textContent = fmtTime(c.outS - c.inS);
  document.getElementById("pickHook").textContent = `“${text.hook}”`;
}

function renderLedger() {
  const d = COPY[lang];
  ledger.innerHTML = CLIPS.map((c, i) => {
    const band = i === 0 ? "top" : c.score >= 75 ? "hi" : "";
    return `
      <li>
        <button type="button" data-clip="${i}" aria-current="${i === selected}">
          <span class="idx">${i + 1}</span>
          <span class="mid">
            <span class="ttl-row">${esc(d.clips[i].title)}</span>
            <span class="dat sm">${fmtTime(c.inS)}–${fmtTime(c.outS)} · ${fmtTime(c.outS - c.inS)}</span>
          </span>
          <span class="score ${band}">${c.score}</span>
        </button>
      </li>`;
  }).join("");
}

function select(index, animate) {
  selected = (index + CLIPS.length) % CLIPS.length;
  placeWindow(selected, animate);
  renderPick();
  ledger.querySelectorAll("[data-clip]").forEach((b) => {
    b.setAttribute("aria-current", String(Number(b.dataset.clip) === selected));
  });
}

ledger.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-clip]");
  if (btn) select(Number(btn.dataset.clip), true);
});

// Drag 1:1, then snap to the nearest found moment on release.
let drag = null;

win.addEventListener("pointerdown", (e) => {
  drag = { x: e.clientX, left: win.offsetLeft, w: win.offsetWidth };
  win.classList.remove("springing");
  win.setPointerCapture(e.pointerId);
  e.preventDefault();
});

win.addEventListener("pointermove", (e) => {
  if (!drag) return;
  const tapeW = tape.clientWidth;
  const left = Math.min(tapeW - drag.w, Math.max(0, drag.left + e.clientX - drag.x));
  win.style.left = `${left}px`;
  setLit(left, drag.w);
});

function endDrag() {
  if (!drag) return;
  const tapeW = tape.clientWidth || 1;
  const centreSec = ((win.offsetLeft + drag.w / 2) / tapeW) * VIDEO_SEC;
  drag = null;
  let best = 0;
  let bestDist = Infinity;
  CLIPS.forEach((c, i) => {
    const dist = Math.abs((c.inS + c.outS) / 2 - centreSec);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  });
  select(best, true);
  if (navigator.vibrate) navigator.vibrate(8);
}

win.addEventListener("pointerup", endDrag);
win.addEventListener("pointercancel", endDrag);

// Keyboard: arrows step through the moments in tape order.
const tapeOrder = CLIPS.map((c, i) => i).sort((a, b) => CLIPS[a].inS - CLIPS[b].inS);
win.addEventListener("keydown", (e) => {
  if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
  e.preventDefault();
  const pos = tapeOrder.indexOf(selected);
  const next = e.key === "ArrowRight" ? Math.min(tapeOrder.length - 1, pos + 1) : Math.max(0, pos - 1);
  select(tapeOrder[next], true);
});

window.addEventListener("resize", () => placeWindow(selected, false));

// --------------------------------------------------------------------------
// 4. Language
// --------------------------------------------------------------------------

const langToggle = document.getElementById("langToggle");
const featList = document.getElementById("featList");
const featMore = document.getElementById("featMore");
const dlButtons = Array.from(document.querySelectorAll("[data-dl-opt]"));
const dlActionBtn = document.getElementById("dlActionBtn");
const dlActionLabel = document.getElementById("dlActionLabel");

function syncDownload() {
  const d = COPY[lang];
  dlButtons.forEach((b, i) => {
    b.classList.toggle("on", i === dlOpt);
    b.setAttribute("aria-selected", String(i === dlOpt));
  });
  dlActionBtn.href = dlOpt === 0 ? APK_URL : PRO_BOT_URL;
  if (dlOpt === 1) {
    dlActionBtn.target = "_blank";
    dlActionBtn.rel = "noopener noreferrer";
  } else {
    dlActionBtn.removeAttribute("target");
    dlActionBtn.removeAttribute("rel");
  }
  dlActionLabel.textContent = dlOpt === 0 ? d.dlCta0 : d.dlCta1;
}

function syncFeatMore() {
  featMore.textContent = featOpen ? COPY[lang].collapse : COPY[lang].showAll;
  featMore.setAttribute("aria-expanded", String(featOpen));
  featList.classList.toggle("open", featOpen);
}

function applyLanguage(next, persist) {
  lang = next === "ru" ? "ru" : "en";
  docEl.setAttribute("lang", lang);
  const d = COPY[lang];
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const v = d[el.getAttribute("data-i18n")];
    if (typeof v === "string") el.textContent = v;
  });
  document.getElementById("langCode").textContent = lang.toUpperCase();
  langToggle.setAttribute("aria-label", d.langLabel);
  document.getElementById("themeToggle").setAttribute("aria-label", d.themeLabel);
  renderLists();
  renderLedger();
  renderPick();
  syncFeatMore();
  syncDownload();
  if (persist) {
    try { localStorage.setItem("clipviral-lang", lang); } catch (_e) {}
  }
}

langToggle.addEventListener("click", () => applyLanguage(lang === "en" ? "ru" : "en", true));
featMore.addEventListener("click", () => {
  featOpen = !featOpen;
  syncFeatMore();
});
dlButtons.forEach((b) =>
  b.addEventListener("click", () => {
    dlOpt = Number(b.dataset.dlOpt) || 0;
    syncDownload();
  })
);

// --------------------------------------------------------------------------
// 5. Theme
// --------------------------------------------------------------------------

const themeToggle = document.getElementById("themeToggle");
const themeColorMeta = document.getElementById("themeColorMeta");

function applyTheme(next, persist) {
  theme = next === "light" ? "light" : "dark";
  docEl.setAttribute("data-theme", theme);
  themeColorMeta.setAttribute("content", theme === "dark" ? "#131110" : "#F2EBE0");
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  if (persist) {
    try { localStorage.setItem("clipviral-theme", theme); } catch (_e) {}
  }
}

themeToggle.addEventListener("click", () => applyTheme(theme === "dark" ? "light" : "dark", true));

// --------------------------------------------------------------------------
// 6. SHA-256, top bar rule
// --------------------------------------------------------------------------

const shaText = document.getElementById("shaText");
const copyShaBtn = document.getElementById("copyShaBtn");
shaText.textContent = APK_SHA256;
let shaTimer = null;

copyShaBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(APK_SHA256);
  } catch (_e) {
    const range = document.createRange();
    range.selectNodeContents(shaText);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
  copyShaBtn.textContent = COPY[lang].copiedSha;
  clearTimeout(shaTimer);
  shaTimer = setTimeout(() => {
    copyShaBtn.textContent = COPY[lang].copySha;
  }, 2000);
});

const bar = document.getElementById("bar");
const syncBar = () => bar.classList.toggle("stuck", window.scrollY > 8);
window.addEventListener("scroll", syncBar, { passive: true });

// --------------------------------------------------------------------------
// 7. Start
// --------------------------------------------------------------------------

drawTrace();
applyTheme(theme, false);
applyLanguage(lang, false);
select(0, false);
syncBar();
