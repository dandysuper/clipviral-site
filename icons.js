/**
 * 26 Bespoke 3D-styled glossy dimensional SVG icons for ClipViral AI.
 * Each artwork uses unique gradient IDs, soft inner specular domes, and layered
 * depth faces so it reads as a miniature 3D icon resting at -9deg inside .ico-f.
 */

function svg(body) {
  return `<svg class="ico" viewBox="0 0 48 48" fill="none" aria-hidden="true">${body}</svg>`;
}

export const ICONS = {
  // 0. YouTube heatmaps — indigo-to-cyan glossy mountain wave + coral peak orb
  heatmap: svg(`
    <defs>
      <linearGradient id="ic0a" x1="6" y1="10" x2="42" y2="42" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#38BDF8"/><stop offset="0.55" stop-color="#2563EB"/><stop offset="1" stop-color="#4338CA"/>
      </linearGradient>
      <linearGradient id="ic0b" x1="10" y1="12" x2="26" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#FFF" stop-opacity="0.55"/><stop offset="1" stop-color="#FFF" stop-opacity="0"/>
      </linearGradient>
      <radialGradient id="ic0c" cx="0.35" cy="0.3" r="0.7">
        <stop offset="0" stop-color="#FDE047"/><stop offset="0.45" stop-color="#FB7185"/><stop offset="1" stop-color="#E11D48"/>
      </radialGradient>
    </defs>
    <rect x="6" y="10" width="36" height="30" rx="10" fill="url(#ic0a)"/>
    <path d="M6 31C12 31 15 17 21 17C26 17 28 28 33 28C37 28 39 22 42 21V30C42 35.523 37.523 40 32 40H16C10.477 40 6 35.523 6 30V31Z" fill="#0F172A" fill-opacity="0.32"/>
    <path d="M9 30C14 30 16.5 17 21.5 17C26 17 28.5 27.5 33 27.5C36.5 27.5 38 22.5 40 21.5" stroke="#BAE6FD" stroke-width="3.2" stroke-linecap="round"/>
    <rect x="8" y="12" width="32" height="10" rx="5" fill="url(#ic0b)"/>
    <circle cx="21.5" cy="17" r="6.2" fill="url(#ic0c)"/>
    <circle cx="19.8" cy="15.2" r="2" fill="#FFF" fill-opacity="0.7"/>
  `),

  // 1. On-device GPU — emerald/teal 3D silicon processor with glowing core
  gpu: svg(`
    <defs>
      <linearGradient id="ic1a" x1="10" y1="10" x2="38" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#34D399"/><stop offset="0.55" stop-color="#059669"/><stop offset="1" stop-color="#065F46"/>
      </linearGradient>
      <linearGradient id="ic1b" x1="16" y1="16" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#A7F3D0"/><stop offset="1" stop-color="#10B981"/>
      </linearGradient>
    </defs>
    <g stroke="#FBBF24" stroke-width="3" stroke-linecap="round">
      <path d="M17 6V10M24 6V10M31 6V10M17 38V42M24 38V42M31 38V42M6 17H10M6 24H10M6 31H10M38 17H42M38 24H42M38 31H42"/>
    </g>
    <rect x="10" y="10" width="28" height="28" rx="8.5" fill="url(#ic1a)"/>
    <rect x="16" y="16" width="16" height="16" rx="4.5" fill="#064E3B"/>
    <rect x="18" y="18" width="12" height="12" rx="3" fill="url(#ic1b)"/>
    <path d="M14 12.5H34" stroke="#FFF" stroke-opacity="0.45" stroke-width="2" stroke-linecap="round"/>
  `),

  // 2. Karaoke captions — glossy golden-amber speech bubble with highlight word
  karaoke: svg(`
    <defs>
      <linearGradient id="ic2a" x1="7" y1="8" x2="41" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#FEF08A"/><stop offset="0.48" stop-color="#FACC15"/><stop offset="1" stop-color="#EA580C"/>
      </linearGradient>
    </defs>
    <path d="M14 9H34C38.418 9 42 12.582 42 17V27C42 31.418 38.418 35 34 35H24L15 41V35H14C9.582 35 6 31.418 6 27V17C6 12.582 9.582 9 14 9Z" fill="url(#ic2a)"/>
    <rect x="11" y="16" width="10" height="4.5" rx="2.2" fill="#FFF"/>
    <rect x="23" y="16" width="14" height="4.5" rx="2.2" fill="#1E1B4B" fill-opacity="0.72"/>
    <rect x="11" y="23.5" width="17" height="4.5" rx="2.2" fill="#1E1B4B" fill-opacity="0.52"/>
    <ellipse cx="18" cy="12.5" rx="9" ry="2.2" fill="#FFF" fill-opacity="0.5"/>
  `),

  // 3. Live capture — glossy crimson radar orb + glowing concentric waves
  live: svg(`
    <defs>
      <radialGradient id="ic3a" cx="0.35" cy="0.3" r="0.75">
        <stop offset="0" stop-color="#FDA4AF"/><stop offset="0.45" stop-color="#F43F5E"/><stop offset="1" stop-color="#9F1239"/>
      </radialGradient>
    </defs>
    <path d="M11 15C7.5 19.5 7.5 28.5 11 33M37 15C40.5 19.5 40.5 28.5 37 33" stroke="#FB7185" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M15.5 18.5C13.5 21.5 13.5 26.5 15.5 29.5M32.5 18.5C34.5 21.5 34.5 26.5 32.5 29.5" stroke="#FDA4AF" stroke-width="3" stroke-linecap="round"/>
    <circle cx="24" cy="24" r="9.5" fill="url(#ic3a)"/>
    <circle cx="21.2" cy="21" r="3" fill="#FFF" fill-opacity="0.65"/>
  `),

  // 4. Instant Cut — blazing amber lightning slicing glossy cobalt film frame
  instant: svg(`
    <defs>
      <linearGradient id="ic4a" x1="8" y1="8" x2="36" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#60A5FA"/><stop offset="1" stop-color="#1D4ED8"/>
      </linearGradient>
      <linearGradient id="ic4b" x1="20" y1="6" x2="34" y2="42" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#FEF08A"/><stop offset="0.5" stop-color="#F59E0B"/><stop offset="1" stop-color="#EA580C"/>
      </linearGradient>
    </defs>
    <rect x="7" y="11" width="30" height="26" rx="8" fill="url(#ic4a)"/>
    <path d="M27.5 6L15.5 24.5H24.5L20.5 42L35.5 20.5H26L27.5 6Z" fill="url(#ic4b)"/>
    <path d="M26 9.5L18.5 22.5H23.5" stroke="#FFF" stroke-opacity="0.6" stroke-width="1.8" stroke-linecap="round"/>
  `),

  // 5. SponsorBlock skip — glossy emerald shield with metallic fast-forward
  sponsor: svg(`
    <defs>
      <linearGradient id="ic5a" x1="10" y1="6" x2="38" y2="42" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#4ADE80"/><stop offset="0.55" stop-color="#16A34A"/><stop offset="1" stop-color="#14532D"/>
      </linearGradient>
    </defs>
    <path d="M24 6L39 11.8V23.4C39 32.8 32.6 39.2 24 42.5C15.4 39.2 9 32.8 9 23.4V11.8L24 6Z" fill="url(#ic5a)"/>
    <path d="M16 19.5L23.5 24L16 28.5V19.5ZM24.5 19.5L32 24L24.5 28.5V19.5Z" fill="#FFF"/>
    <path d="M14 13.5L24 9.5L34 13.5" stroke="#FFF" stroke-opacity="0.45" stroke-width="2" stroke-linecap="round"/>
  `),

  // 6. Viral score — sculpted molten flame gem
  score: svg(`
    <defs>
      <linearGradient id="ic6a" x1="24" y1="6" x2="24" y2="42" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#FDE047"/><stop offset="0.42" stop-color="#F97316"/><stop offset="1" stop-color="#E11D48"/>
      </linearGradient>
      <linearGradient id="ic6b" x1="24" y1="20" x2="24" y2="39" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#FEF9C3"/><stop offset="1" stop-color="#FB923C"/>
      </linearGradient>
    </defs>
    <path d="M25.5 6C26 13.5 36 16.5 36 27C36 35.2 30.8 41.5 24 41.5C16.8 41.5 12 35.5 12 28C12 22.4 15.2 18.2 18.2 15.6C18.2 19.2 20 20.6 20.8 20.8C20.2 14.8 22.8 9.2 25.5 6Z" fill="url(#ic6a)"/>
    <path d="M24.2 21.5C27.5 24.5 29.5 27.6 29.5 31.4C29.5 35.2 27 38 23.8 38C20.6 38 18.5 35.4 18.5 32.2C18.5 28.8 21.2 25 24.2 21.5Z" fill="url(#ic6b)"/>
  `),

  // 7. Built-in vision AI — faceted violet-to-cyan neural diamond prism
  vision: svg(`
    <defs>
      <linearGradient id="ic7a" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#E879F9"/><stop offset="0.5" stop-color="#7C3AED"/><stop offset="1" stop-color="#06B6D4"/>
      </linearGradient>
      <radialGradient id="ic7b" cx="0.35" cy="0.35" r="0.65">
        <stop offset="0" stop-color="#ECFEFF"/><stop offset="0.5" stop-color="#22D3EE"/><stop offset="1" stop-color="#1D4ED8"/>
      </radialGradient>
    </defs>
    <path d="M6 24C10.5 14.5 17 10.5 24 10.5C31 10.5 37.5 14.5 42 24C37.5 33.5 31 37.5 24 37.5C17 37.5 10.5 33.5 6 24Z" fill="url(#ic7a)"/>
    <circle cx="24" cy="24" r="8.2" fill="url(#ic7b)"/>
    <circle cx="24" cy="24" r="3.4" fill="#0F172A"/>
    <circle cx="21.5" cy="21" r="2" fill="#FFF" fill-opacity="0.85"/>
  `),

  // 8. Own API keys — sculpted golden jewel key
  apikey: svg(`
    <defs>
      <linearGradient id="ic8a" x1="8" y1="10" x2="40" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#FEF08A"/><stop offset="0.48" stop-color="#F59E0B"/><stop offset="1" stop-color="#B45309"/>
      </linearGradient>
    </defs>
    <path d="M17.5 11C11.7 11 7 15.7 7 21.5C7 27.3 11.7 32 17.5 32C21.8 32 25.5 29.4 27.1 25.7H32V30.5H37.5V25.7H41V17.5H27.1C25.5 13.7 21.8 11 17.5 11ZM17.5 25C15.5 25 14 23.4 14 21.5C14 19.6 15.5 18 17.5 18C19.4 18 21 19.6 21 21.5C21 23.4 19.4 25 17.5 25Z" fill="url(#ic8a)"/>
    <path d="M12.5 15.2C14.5 13.6 18 13.2 21 14.6" stroke="#FFF" stroke-opacity="0.6" stroke-width="2" stroke-linecap="round"/>
  `),

  // 9. Auto fallback — glossy twin cyan/royal orbital arrows
  fallback: svg(`
    <defs>
      <linearGradient id="ic9a" x1="8" y1="8" x2="40" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#67E8F9"/><stop offset="1" stop-color="#2563EB"/>
      </linearGradient>
      <linearGradient id="ic9b" x1="40" y1="40" x2="8" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#818CF8"/><stop offset="1" stop-color="#06B6D4"/>
      </linearGradient>
    </defs>
    <path d="M12 20C14 13.8 19.6 10 26 10.6C30.8 11.1 34.8 14.1 36.8 18.2" stroke="url(#ic9a)" stroke-width="5.2" stroke-linecap="round"/>
    <path d="M38 11.5L38.2 19.8L30 18.5" fill="#38BDF8"/>
    <path d="M36 28C34 34.2 28.4 38 22 37.4C17.2 36.9 13.2 33.9 11.2 29.8" stroke="url(#ic9b)" stroke-width="5.2" stroke-linecap="round"/>
    <path d="M10 36.5L9.8 28.2L18 29.5" fill="#818CF8"/>
  `),

  // 10. Six creator presets — glossy amethyst magic wand + golden spark star
  presets: svg(`
    <defs>
      <linearGradient id="ic10a" x1="10" y1="38" x2="36" y2="12" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#4C1D95"/><stop offset="0.55" stop-color="#9333EA"/><stop offset="1" stop-color="#E879F9"/>
      </linearGradient>
      <linearGradient id="ic10b" x1="28" y1="6" x2="42" y2="20" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#FEF08A"/><stop offset="1" stop-color="#F59E0B"/>
      </linearGradient>
    </defs>
    <rect x="6" y="21" width="32" height="7" rx="3.5" transform="rotate(-45 22 24.5)" fill="url(#ic10a)"/>
    <path d="M33 6L35.4 11.6L41 14L35.4 16.4L33 22L30.6 16.4L25 14L30.6 11.6L33 6Z" fill="url(#ic10b)"/>
    <circle cx="15" cy="13" r="2.8" fill="#38BDF8"/>
    <circle cx="37" cy="31" r="2.4" fill="#F472B6"/>
  `),

  // 11. Four caption styles — glossy 3D azure-to-indigo typography block
  styles: svg(`
    <defs>
      <linearGradient id="ic11a" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#38BDF8"/><stop offset="0.5" stop-color="#6366F1"/><stop offset="1" stop-color="#A855F7"/>
      </linearGradient>
    </defs>
    <rect x="7" y="8" width="34" height="32" rx="10" fill="url(#ic11a)"/>
    <path d="M16.2 31L21.5 16H26.5L31.8 31H27.4L26.3 27.6H21.7L20.6 31H16.2ZM22.7 24.2H25.3L24 19.9L22.7 24.2Z" fill="#FFF"/>
    <path d="M12 11.5H36" stroke="#FFF" stroke-opacity="0.4" stroke-width="2" stroke-linecap="round"/>
  `),

  // 12. Color grading — glossy overlapping CMY/RGB prism spheres
  grading: svg(`
    <defs>
      <radialGradient id="ic12a" cx="0.35" cy="0.3" r="0.7"><stop offset="0" stop-color="#FDA4AF"/><stop offset="1" stop-color="#E11D48"/></radialGradient>
      <radialGradient id="ic12b" cx="0.35" cy="0.3" r="0.7"><stop offset="0" stop-color="#7DD3FC"/><stop offset="1" stop-color="#0284C7"/></radialGradient>
      <radialGradient id="ic12c" cx="0.35" cy="0.3" r="0.7"><stop offset="0" stop-color="#FEF08A"/><stop offset="1" stop-color="#EA580C"/></radialGradient>
    </defs>
    <circle cx="24" cy="16" r="10" fill="url(#ic12a)"/>
    <circle cx="16.5" cy="29" r="10" fill="url(#ic12b)" fill-opacity="0.92"/>
    <circle cx="31.5" cy="29" r="10" fill="url(#ic12c)" fill-opacity="0.9"/>
    <circle cx="22" cy="13.5" r="2.5" fill="#FFF" fill-opacity="0.55"/>
  `),

  // 13. Four aspect ratios — glossy 3D vertical 9:16 frame + cyan crop brackets
  aspect: svg(`
    <defs>
      <linearGradient id="ic13a" x1="12" y1="6" x2="36" y2="42" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#60A5FA"/><stop offset="0.5" stop-color="#2563EB"/><stop offset="1" stop-color="#1E3A8A"/>
      </linearGradient>
    </defs>
    <rect x="13" y="6" width="22" height="36" rx="7" fill="url(#ic13a)"/>
    <rect x="16.5" y="10" width="15" height="28" rx="4" fill="#0F172A" fill-opacity="0.35"/>
    <path d="M9 17V12H14M39 17V12H34M9 31V36H14M39 31V36H34" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M21.5 19.5L28 24L21.5 28.5V19.5Z" fill="#FFF"/>
  `),

  // 14. Up to 720p HD — glossy 3D sapphire-teal HD crystal tile
  hd720: svg(`
    <defs>
      <linearGradient id="ic14a" x1="6" y1="10" x2="42" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#22D3EE"/><stop offset="0.5" stop-color="#0284C7"/><stop offset="1" stop-color="#1D4ED8"/>
      </linearGradient>
    </defs>
    <rect x="6" y="11" width="36" height="26" rx="9" fill="url(#ic14a)"/>
    <path d="M13 18.5H16.2V22.5H20V18.5H23.2V29.5H20V25.3H16.2V29.5H13V18.5ZM26 18.5H30.5C33.8 18.5 35.8 20.6 35.8 24C35.8 27.4 33.8 29.5 30.5 29.5H26V18.5ZM29.2 21.2V26.8H30.3C31.8 26.8 32.6 25.7 32.6 24C32.6 22.3 31.8 21.2 30.3 21.2H29.2Z" fill="#FFF"/>
    <path d="M12 14H36" stroke="#FFF" stroke-opacity="0.4" stroke-width="2" stroke-linecap="round"/>
  `),

  // 15. Viral Studio — glossy magenta-to-orchid copy card with spark
  studio: svg(`
    <defs>
      <linearGradient id="ic15a" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#F472B6"/><stop offset="0.55" stop-color="#DB2777"/><stop offset="1" stop-color="#7E22CE"/>
      </linearGradient>
    </defs>
    <rect x="8" y="9" width="30" height="32" rx="9" fill="url(#ic15a)"/>
    <rect x="14" y="18" width="16" height="3.6" rx="1.8" fill="#FFF"/>
    <rect x="14" y="24.5" width="18" height="3.6" rx="1.8" fill="#FFF" fill-opacity="0.72"/>
    <rect x="14" y="31" width="11" height="3.6" rx="1.8" fill="#FFF" fill-opacity="0.5"/>
    <path d="M35 6L37 10.5L41.5 12.5L37 14.5L35 19L33 14.5L28.5 12.5L33 10.5L35 6Z" fill="#FEF08A"/>
  `),

  // 16. Share sheet ingest — glossy sky-to-mint floating share tray + upward arrow
  share: svg(`
    <defs>
      <linearGradient id="ic16a" x1="8" y1="22" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#34D399"/><stop offset="1" stop-color="#0284C7"/>
      </linearGradient>
      <linearGradient id="ic16b" x1="24" y1="6" x2="24" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#BAE6FD"/><stop offset="1" stop-color="#2563EB"/>
      </linearGradient>
    </defs>
    <rect x="7" y="23" width="34" height="17" rx="8" fill="url(#ic16a)"/>
    <path d="M24 7L34 17H28V29H20V17H14L24 7Z" fill="url(#ic16b)"/>
    <path d="M12 26.5H36" stroke="#FFF" stroke-opacity="0.35" stroke-width="2" stroke-linecap="round"/>
  `),

  // 17. Direct posting — glossy coral-to-violet launch rocket
  posting: svg(`
    <defs>
      <linearGradient id="ic17a" x1="12" y1="36" x2="38" y2="8" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#7C3AED"/><stop offset="0.55" stop-color="#F43F5E"/><stop offset="1" stop-color="#FB923C"/>
      </linearGradient>
    </defs>
    <path d="M14 34L8 40L16 39L14 34Z" fill="#38BDF8"/>
    <path d="M39 9C31 9 23 13 18 19L12 20L15 26L22 33L28 36L29 30C35 25 39 17 39 9Z" fill="url(#ic17a)"/>
    <circle cx="29" cy="19" r="3.8" fill="#E0F2FE"/>
    <circle cx="28" cy="18" r="1.4" fill="#FFF"/>
  `),

  // 18. Anti-copyright tools — glossy cyan & orchid mirrored twin glass panes
  anticopyright: svg(`
    <defs>
      <linearGradient id="ic18a" x1="6" y1="10" x2="22" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#67E8F9"/><stop offset="1" stop-color="#0284C7"/>
      </linearGradient>
      <linearGradient id="ic18b" x1="26" y1="10" x2="42" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#F0ABFC"/><stop offset="1" stop-color="#7C3AED"/>
      </linearGradient>
    </defs>
    <path d="M7 14C7 10.7 9.7 8 13 8H20.5V40H13C9.7 40 7 37.3 7 34V14Z" fill="url(#ic18a)"/>
    <path d="M27.5 8H35C38.3 8 41 10.7 41 14V34C41 37.3 38.3 40 35 40H27.5V8Z" fill="url(#ic18b)"/>
    <rect x="22.8" y="6" width="2.4" height="36" rx="1.2" fill="#FFF" fill-opacity="0.85"/>
  `),

  // 19. SRT and manual trim — glossy warm amber trim brackets on cyan track
  srt: svg(`
    <defs>
      <linearGradient id="ic19a" x1="6" y1="14" x2="42" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#38BDF8"/><stop offset="1" stop-color="#2563EB"/>
      </linearGradient>
      <linearGradient id="ic19b" x1="8" y1="10" x2="18" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#FDE047"/><stop offset="1" stop-color="#F97316"/>
      </linearGradient>
    </defs>
    <rect x="11" y="15" width="26" height="18" rx="4" fill="url(#ic19a)"/>
    <rect x="16" y="21" width="16" height="3" rx="1.5" fill="#FFF"/>
    <rect x="19" y="26" width="10" height="3" rx="1.5" fill="#FFF" fill-opacity="0.7"/>
    <rect x="6" y="10" width="7.5" height="28" rx="3.75" fill="url(#ic19b)"/>
    <rect x="34.5" y="10" width="7.5" height="28" rx="3.75" fill="url(#ic19b)"/>
  `),

  // Engine Abilities & Tiles
  abPeaks: svg(`
    <defs>
      <linearGradient id="ic20a" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#38BDF8"/><stop offset="1" stop-color="#4F46E5"/>
      </linearGradient>
    </defs>
    <circle cx="24" cy="24" r="17" fill="url(#ic20a)"/>
    <path d="M12 28L18.5 18L24.5 25L30.5 14.5L36 22" stroke="#FFF" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="30.5" cy="14.5" r="3.5" fill="#FDE047"/>
  `),

  abGpu: svg(`
    <defs>
      <linearGradient id="ic21a" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#34D399"/><stop offset="1" stop-color="#0284C7"/>
      </linearGradient>
    </defs>
    <rect x="8" y="8" width="32" height="32" rx="10" fill="url(#ic21a)"/>
    <path d="M21 16.5L32 24L21 31.5V16.5Z" fill="#FFF"/>
    <path d="M13 12H35" stroke="#FFF" stroke-opacity="0.4" stroke-width="2" stroke-linecap="round"/>
  `),

  abCopy: svg(`
    <defs>
      <linearGradient id="ic22a" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#FB7185"/><stop offset="1" stop-color="#9333EA"/>
      </linearGradient>
    </defs>
    <rect x="7" y="10" width="34" height="28" rx="9" fill="url(#ic22a)"/>
    <rect x="13" y="18" width="16" height="3.6" rx="1.8" fill="#FFF"/>
    <rect x="13" y="25" width="22" height="3.6" rx="1.8" fill="#FFF" fill-opacity="0.72"/>
  `),

  abPro: svg(`
    <defs>
      <linearGradient id="ic23a" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#38BDF8"/><stop offset="0.55" stop-color="#2563EB"/><stop offset="1" stop-color="#1E40AF"/>
      </linearGradient>
    </defs>
    <circle cx="24" cy="24" r="17" fill="url(#ic23a)"/>
    <path d="M33.5 15.5L13.5 23.2L19.8 25.6L29.6 18.8L22.4 26.8L22.2 32.5L26.2 28.6L30.8 31.8L33.5 15.5Z" fill="#FFF"/>
  `),

  tilePricing: svg(`
    <defs>
      <linearGradient id="ic24a" x1="10" y1="8" x2="38" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#FDE047"/><stop offset="0.45" stop-color="#F472B6"/><stop offset="1" stop-color="#7C3AED"/>
      </linearGradient>
    </defs>
    <path d="M14 10H34L42 20L24 40L6 20L14 10Z" fill="url(#ic24a)"/>
    <path d="M14 10L18 20L24 40L30 20L34 10" stroke="#FFF" stroke-opacity="0.55" stroke-width="2" stroke-linejoin="round"/>
    <path d="M6 20H42" stroke="#FFF" stroke-opacity="0.5" stroke-width="2"/>
  `),

  tileModels: svg(`
    <defs>
      <linearGradient id="ic25a" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#67E8F9"/><stop offset="0.5" stop-color="#3B82F6"/><stop offset="1" stop-color="#6D28D9"/>
      </linearGradient>
    </defs>
    <path d="M24 7L40 15.5V32.5L24 41L8 32.5V15.5L24 7Z" fill="url(#ic25a)"/>
    <path d="M24 7L40 15.5L24 24L8 15.5L24 7Z" fill="#FFF" fill-opacity="0.28"/>
    <path d="M24 24V41" stroke="#FFF" stroke-opacity="0.45" stroke-width="2"/>
  `),
};
