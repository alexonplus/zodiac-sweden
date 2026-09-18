/**
 * Zodiac Sweden - 12 Constellations
 * Vector Arcade Character Avatars for all 12 Zodiac Heroes
 */

export const HERO_AVATARS = {
  aries: {
    id: 'aries',
    title: 'Crimson Ram Knight',
    weapon: 'Infernal War Axe & Shield',
    svg: (size = 64) => `
      <svg viewBox="0 0 100 100" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg-aries" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ea580c" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#7c2d12" stop-opacity="0.95"/>
          </radialGradient>
          <linearGradient id="horn-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="50%" stop-color="#f59e0b"/>
            <stop offset="100%" stop-color="#b45309"/>
          </linearGradient>
          <linearGradient id="helm-crimson" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#dc2626"/>
            <stop offset="100%" stop-color="#7f1d1d"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="url(#bg-aries)" stroke="#f97316" stroke-width="2.5"/>
        <path d="M 28 38 C 15 25, 10 45, 16 56 C 20 62, 28 60, 29 52 C 30 44, 22 42, 24 36 Z" fill="url(#horn-gold)" stroke="#78350f" stroke-width="1.5"/>
        <path d="M 72 38 C 85 25, 90 45, 84 56 C 80 62, 72 60, 71 52 C 70 44, 78 42, 76 36 Z" fill="url(#horn-gold)" stroke="#78350f" stroke-width="1.5"/>
        <line x1="18" y1="36" x2="25" y2="40" stroke="#78350f" stroke-width="1.2"/>
        <line x1="16" y1="46" x2="24" y2="48" stroke="#78350f" stroke-width="1.2"/>
        <line x1="82" y1="36" x2="75" y2="40" stroke="#78350f" stroke-width="1.2"/>
        <line x1="84" y1="46" x2="76" y2="48" stroke="#78350f" stroke-width="1.2"/>
        <path d="M 32 30 L 68 30 L 74 60 L 50 82 L 26 60 Z" fill="url(#helm-crimson)" stroke="#fca5a5" stroke-width="1.5"/>
        <path d="M 50 12 L 56 28 L 50 26 L 44 28 Z" fill="#f97316" stroke="#fef08a" stroke-width="1"/>
        <circle cx="50" cy="20" r="3" fill="#fef08a"/>
        <path d="M 36 46 L 64 46 L 56 52 L 53 68 L 47 68 L 44 52 Z" fill="#0f172a" stroke="#ea580c" stroke-width="1.5"/>
        <rect x="40" y="47" width="8" height="3" rx="1.5" fill="#fef08a"/>
        <rect x="52" y="47" width="8" height="3" rx="1.5" fill="#fef08a"/>
        <polygon points="46,72 54,72 50,78" fill="#f97316"/>
        <text x="50" y="38" font-size="10" font-weight="900" fill="#fef08a" text-anchor="middle" font-family="sans-serif">♈</text>
      </svg>
    `
  },

  taurus: {
    id: 'taurus',
    title: 'Copper Minotaur Titan',
    weapon: 'Heavy Bronze Maul',
    svg: (size = 64) => `
      <svg viewBox="0 0 100 100" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg-taurus" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#b45309" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#451a03" stop-opacity="0.95"/>
          </radialGradient>
          <linearGradient id="bronze-bull" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f59e0b"/>
            <stop offset="60%" stop-color="#92400e"/>
            <stop offset="100%" stop-color="#78350f"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="url(#bg-taurus)" stroke="#d97706" stroke-width="2.5"/>
        <path d="M 30 42 C 14 36, 6 22, 10 12 C 14 24, 26 30, 36 34 Z" fill="#e2e8f0" stroke="#78350f" stroke-width="1.5"/>
        <path d="M 70 42 C 86 36, 94 22, 90 12 C 86 24, 74 30, 64 34 Z" fill="#e2e8f0" stroke="#78350f" stroke-width="1.5"/>
        <path d="M 28 28 L 72 28 L 76 64 L 50 84 L 24 64 Z" fill="url(#bronze-bull)" stroke="#fbbf24" stroke-width="1.5"/>
        <polygon points="40,24 60,24 50,38" fill="#78350f" stroke="#fbbf24" stroke-width="1"/>
        <text x="50" y="34" font-size="9" font-weight="900" fill="#fde68a" text-anchor="middle">♉</text>
        <polygon points="34,46 44,48 36,52" fill="#fbbf24"/>
        <polygon points="66,46 56,48 64,52" fill="#fbbf24"/>
        <circle cx="39" cy="48" r="1.5" fill="#fff"/>
        <circle cx="61" cy="48" r="1.5" fill="#fff"/>
        <rect x="42" y="58" width="16" height="12" rx="4" fill="#451a03" stroke="#92400e" stroke-width="1"/>
        <ellipse cx="46" cy="63" rx="2" ry="3" fill="#000"/>
        <ellipse cx="54" cy="63" rx="2" ry="3" fill="#000"/>
        <circle cx="50" cy="72" r="7" fill="none" stroke="#fbbf24" stroke-width="2.5"/>
      </svg>
    `
  },

  gemini: {
    id: 'gemini',
    title: 'Dual Sky Dancer',
    weapon: 'Twin Wind Chakrams',
    svg: (size = 64) => `
      <svg viewBox="0 0 100 100" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg-gemini" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#0284c7" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#082f49" stop-opacity="0.95"/>
          </radialGradient>
          <linearGradient id="split-face" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#0284c7"/>
            <stop offset="49%" stop-color="#38bdf8"/>
            <stop offset="51%" stop-color="#c084fc"/>
            <stop offset="100%" stop-color="#9333ea"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="url(#bg-gemini)" stroke="#38bdf8" stroke-width="2.5"/>
        <path d="M 28 32 C 12 18, 14 42, 26 48 Z" fill="#38bdf8" stroke="#0284c7" stroke-width="1.2"/>
        <path d="M 72 32 C 88 18, 86 42, 74 48 Z" fill="#c084fc" stroke="#9333ea" stroke-width="1.2"/>
        <path d="M 30 24 Q 50 18 70 24 Q 74 60 50 82 Q 26 60 30 24 Z" fill="url(#split-face)" stroke="#e0e7ff" stroke-width="1.5"/>
        <line x1="50" y1="20" x2="50" y2="82" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="3 2"/>
        <path d="M 35 44 Q 42 42 45 46 Q 40 50 35 44 Z" fill="#ffffff"/>
        <path d="M 65 44 Q 58 42 55 46 Q 60 50 65 44 Z" fill="#ffffff"/>
        <circle cx="50" cy="28" r="5" fill="#0f172a" stroke="#fff" stroke-width="1"/>
        <text x="50" y="32" font-size="7" font-weight="900" fill="#fff" text-anchor="middle">♊</text>
        <polygon points="46,74 54,74 50,80" fill="#ffffff"/>
      </svg>
    `
  },

  cancer: {
    id: 'cancer',
    title: 'Tidal Crab Paladin',
    weapon: 'Carapace Shield & Harpoon',
    svg: (size = 64) => `
      <svg viewBox="0 0 100 100" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg-cancer" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#0369a1" stop-opacity="0.85"/>
            <stop offset="100%" stop-color="#082f49" stop-opacity="0.95"/>
          </radialGradient>
          <linearGradient id="chitin" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0284c7"/>
            <stop offset="50%" stop-color="#0369a1"/>
            <stop offset="100%" stop-color="#075985"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="url(#bg-cancer)" stroke="#0ea5e9" stroke-width="2.5"/>
        <path d="M 28 32 C 16 20, 10 32, 20 42 C 26 38, 26 34, 28 32 Z" fill="#38bdf8" stroke="#0369a1" stroke-width="1.2"/>
        <path d="M 72 32 C 84 20, 90 32, 80 42 C 74 38, 74 34, 72 32 Z" fill="#38bdf8" stroke="#0369a1" stroke-width="1.2"/>
        <path d="M 26 36 Q 50 16 74 36 Q 78 64 50 82 Q 22 64 26 36 Z" fill="url(#chitin)" stroke="#7dd3fc" stroke-width="1.5"/>
        <circle cx="50" cy="30" r="6" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="50" y="33.5" font-size="7" font-weight="900" fill="#0369a1" text-anchor="middle">♋</text>
        <path d="M 34 46 Q 50 42 66 46 Q 62 58 50 62 Q 38 58 34 46 Z" fill="#0c4a6e" stroke="#38bdf8" stroke-width="1.2"/>
        <rect x="38" y="49" width="9" height="3" rx="1.5" fill="#38bdf8"/>
        <rect x="53" y="49" width="9" height="3" rx="1.5" fill="#38bdf8"/>
        <circle cx="32" cy="62" r="2.5" fill="#7dd3fc" opacity="0.8"/>
        <circle cx="68" cy="62" r="2.5" fill="#7dd3fc" opacity="0.8"/>
      </svg>
    `
  },

  leo: {
    id: 'leo',
    title: 'Solar Lion Sovereign',
    weapon: 'Radiant Sunblade',
    svg: (size = 64) => `
      <svg viewBox="0 0 100 100" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg-leo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ca8a04" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#713f12" stop-opacity="0.95"/>
          </radialGradient>
          <linearGradient id="mane-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="40%" stop-color="#facc15"/>
            <stop offset="100%" stop-color="#b45309"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="url(#bg-leo)" stroke="#facc15" stroke-width="2.5"/>
        <path d="M 50 8 L 56 22 L 68 12 L 66 26 L 80 22 L 74 34 L 88 38 L 78 48 L 86 58 L 74 64 L 76 76 L 62 74 L 58 86 L 50 78 L 42 86 L 38 74 L 24 76 L 26 64 L 14 58 L 22 48 L 12 38 L 26 34 L 20 22 L 34 26 L 32 12 L 44 22 Z" fill="url(#mane-gold)" stroke="#78350f" stroke-width="1.2"/>
        <polygon points="34,32 66,32 70,58 50,78 30,58" fill="#ca8a04" stroke="#fef08a" stroke-width="1.5"/>
        <polygon points="42,20 50,14 58,20 50,26" fill="#fef08a" stroke="#b45309" stroke-width="1"/>
        <text x="50" y="36" font-size="9" font-weight="900" fill="#451a03" text-anchor="middle">♌</text>
        <polygon points="36,44 46,46 38,50" fill="#fef08a"/>
        <polygon points="64,44 54,46 62,50" fill="#fef08a"/>
        <line x1="41" y1="44" x2="41" y2="49" stroke="#000" stroke-width="1.5"/>
        <line x1="59" y1="44" x2="59" y2="49" stroke="#000" stroke-width="1.5"/>
        <polygon points="46,56 54,56 50,62" fill="#78350f"/>
      </svg>
    `
  },

  virgo: {
    id: 'virgo',
    title: 'Ancient Woods Huntress',
    weapon: 'Verdant Longbow',
    svg: (size = 64) => `
      <svg viewBox="0 0 100 100" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg-virgo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#16a34a" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#064e3b" stop-opacity="0.95"/>
          </radialGradient>
          <linearGradient id="flora-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#86efac"/>
            <stop offset="50%" stop-color="#22c55e"/>
            <stop offset="100%" stop-color="#15803d"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="url(#bg-virgo)" stroke="#4ade80" stroke-width="2.5"/>
        <path d="M 24 30 C 20 18, 36 22, 34 32 Z" fill="#86efac" stroke="#15803d" stroke-width="1"/>
        <path d="M 76 30 C 80 18, 64 22, 66 32 Z" fill="#86efac" stroke="#15803d" stroke-width="1"/>
        <path d="M 32 20 C 34 10, 48 16, 44 24 Z" fill="#4ade80" stroke="#15803d" stroke-width="1"/>
        <path d="M 68 20 C 66 10, 52 16, 56 24 Z" fill="#4ade80" stroke="#15803d" stroke-width="1"/>
        <path d="M 32 28 Q 50 18 68 28 Q 72 62 50 82 Q 28 62 32 28 Z" fill="url(#flora-grad)" stroke="#bbf7d0" stroke-width="1.5"/>
        <polygon points="50,18 55,26 50,34 45,26" fill="#bbf7d0" stroke="#15803d" stroke-width="1"/>
        <text x="50" y="29" font-size="7" font-weight="900" fill="#064e3b" text-anchor="middle">♍</text>
        <path d="M 34 44 Q 43 40 46 45 Q 40 50 34 44 Z" fill="#ffffff"/>
        <path d="M 66 44 Q 57 40 54 45 Q 60 50 66 44 Z" fill="#ffffff"/>
        <circle cx="41" cy="45" r="2" fill="#15803d"/>
        <circle cx="59" cy="45" r="2" fill="#15803d"/>
        <path d="M 50 68 C 44 74, 50 80, 50 80 C 50 80, 56 74, 50 68 Z" fill="#bbf7d0"/>
      </svg>
    `
  },

  libra: {
    id: 'libra',
    title: 'Astral Cosmos Arbiter',
    weapon: 'Gravity Scales & Wand',
    svg: (size = 64) => `
      <svg viewBox="0 0 100 100" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg-libra" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#4f46e5" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#1e1b4b" stop-opacity="0.95"/>
          </radialGradient>
          <linearGradient id="astral-hood" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#818cf8"/>
            <stop offset="50%" stop-color="#4338ca"/>
            <stop offset="100%" stop-color="#312e81"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="url(#bg-libra)" stroke="#818cf8" stroke-width="2.5"/>
        <line x1="28" y1="20" x2="72" y2="20" stroke="#c7d2fe" stroke-width="2"/>
        <circle cx="50" cy="20" r="3.5" fill="#facc15"/>
        <polygon points="28,20 22,30 34,30" fill="none" stroke="#c7d2fe" stroke-width="1.2"/>
        <polygon points="72,20 66,30 78,30" fill="none" stroke="#c7d2fe" stroke-width="1.2"/>
        <path d="M 30 30 Q 50 18 70 30 Q 76 64 50 82 Q 24 64 30 30 Z" fill="url(#astral-hood)" stroke="#c7d2fe" stroke-width="1.5"/>
        <circle cx="38" cy="36" r="1.5" fill="#fff"/>
        <circle cx="62" cy="36" r="1.5" fill="#fff"/>
        <circle cx="50" cy="72" r="1.5" fill="#fff"/>
        <circle cx="50" cy="32" r="6" fill="#312e81" stroke="#a5b4fc" stroke-width="1.5"/>
        <text x="50" y="35.5" font-size="7" font-weight="900" fill="#facc15" text-anchor="middle">♎</text>
        <rect x="32" y="44" width="36" height="12" rx="4" fill="#1e1b4b" stroke="#818cf8" stroke-width="1.2"/>
        <path d="M 36 50 L 44 50" stroke="#facc15" stroke-width="2"/>
        <path d="M 56 50 L 64 50" stroke="#facc15" stroke-width="2"/>
      </svg>
    `
  },

  scorpio: {
    id: 'scorpio',
    title: 'Toxic Shadow Stalker',
    weapon: 'Dual Venom Daggers',
    svg: (size = 64) => `
      <svg viewBox="0 0 100 100" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg-scorpio" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#7e22ce" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#3b0764" stop-opacity="0.95"/>
          </radialGradient>
          <linearGradient id="poison-chitin" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#a855f7"/>
            <stop offset="50%" stop-color="#6b21a8"/>
            <stop offset="100%" stop-color="#3b0764"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="url(#bg-scorpio)" stroke="#a855f7" stroke-width="2.5"/>
        <path d="M 50 26 C 50 10, 68 6, 64 2 C 54 8, 44 14, 46 26 Z" fill="#d8b4fe" stroke="#581c87" stroke-width="1.2"/>
        <polygon points="64,2 69,5 64,8" fill="#22c55e"/>
        <path d="M 28 32 Q 50 20 72 32 Q 78 62 50 84 Q 22 62 28 32 Z" fill="url(#poison-chitin)" stroke="#e9d5ff" stroke-width="1.5"/>
        <polygon points="50,22 56,29 50,36 44,29" fill="#3b0764" stroke="#a855f7" stroke-width="1"/>
        <text x="50" y="32" font-size="7" font-weight="900" fill="#4ade80" text-anchor="middle">♏</text>
        <polygon points="34,44 46,48 36,52" fill="#4ade80"/>
        <polygon points="66,44 54,48 64,52" fill="#4ade80"/>
        <polygon points="42,58 58,58 50,72" fill="#1e1b4b" stroke="#a855f7" stroke-width="1.2"/>
        <circle cx="50" cy="64" r="2" fill="#4ade80"/>
      </svg>
    `
  },

  sagittarius: {
    id: 'sagittarius',
    title: 'Sunlit Stellar Ranger',
    weapon: 'Solar Plasma Bow',
    svg: (size = 64) => `
      <svg viewBox="0 0 100 100" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg-sagittarius" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#c2410c" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#431407" stop-opacity="0.95"/>
          </radialGradient>
          <linearGradient id="solar-helm" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fb923c"/>
            <stop offset="50%" stop-color="#ea580c"/>
            <stop offset="100%" stop-color="#9a3412"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="url(#bg-sagittarius)" stroke="#fb923c" stroke-width="2.5"/>
        <path d="M 50 10 L 58 26 L 50 22 L 42 26 Z" fill="#fed7aa" stroke="#c2410c" stroke-width="1.2"/>
        <line x1="50" y1="8" x2="50" y2="24" stroke="#c2410c" stroke-width="1.5"/>
        <path d="M 30 30 L 70 30 L 74 62 L 50 82 L 26 62 Z" fill="url(#solar-helm)" stroke="#ffedd5" stroke-width="1.5"/>
        <circle cx="50" cy="30" r="6" fill="#431407" stroke="#fdba74" stroke-width="1.2"/>
        <text x="50" y="33.5" font-size="7" font-weight="900" fill="#fb923c" text-anchor="middle">♐</text>
        <polygon points="34,44 44,46 36,50" fill="#fef08a"/>
        <circle cx="60" cy="47" r="7" fill="#082f49" stroke="#00f0ff" stroke-width="1.5"/>
        <line x1="53" y1="47" x2="67" y2="47" stroke="#00f0ff" stroke-width="1"/>
        <line x1="60" y1="40" x2="60" y2="54" stroke="#00f0ff" stroke-width="1"/>
        <circle cx="60" cy="47" r="2.5" fill="#ef4444"/>
        <polygon points="44,66 56,66 50,74" fill="#7c2d12" stroke="#fdba74" stroke-width="1"/>
      </svg>
    `
  },

  capricorn: {
    id: 'capricorn',
    title: 'Frost Peak Elder',
    weapon: 'Glacial Great-Axe',
    svg: (size = 64) => `
      <svg viewBox="0 0 100 100" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg-capricorn" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#0891b2" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#164e63" stop-opacity="0.95"/>
          </radialGradient>
          <linearGradient id="ice-horn" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="50%" stop-color="#67e8f9"/>
            <stop offset="100%" stop-color="#0e7490"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="url(#bg-capricorn)" stroke="#67e8f9" stroke-width="2.5"/>
        <path d="M 32 36 L 16 16 L 24 28 L 12 8 L 26 22 L 34 32 Z" fill="url(#ice-horn)" stroke="#cffafe" stroke-width="1.2"/>
        <path d="M 68 36 L 84 16 L 76 28 L 88 8 L 74 22 L 66 32 Z" fill="url(#ice-horn)" stroke="#cffafe" stroke-width="1.2"/>
        <path d="M 30 28 L 70 28 L 74 60 L 50 82 L 26 60 Z" fill="#0e7490" stroke="#a5f3fc" stroke-width="1.5"/>
        <polygon points="50,18 56,26 50,34 44,26" fill="#164e63" stroke="#67e8f9" stroke-width="1.2"/>
        <text x="50" y="29.5" font-size="7" font-weight="900" fill="#a5f3fc" text-anchor="middle">♑</text>
        <rect x="36" y="44" width="10" height="4" rx="2" fill="#ffffff"/>
        <rect x="54" y="44" width="10" height="4" rx="2" fill="#ffffff"/>
        <path d="M 36 62 L 50 80 L 64 62 L 58 60 L 50 68 L 42 60 Z" fill="#cffafe" stroke="#0891b2" stroke-width="1.2"/>
      </svg>
    `
  },

  aquarius: {
    id: 'aquarius',
    title: 'Cyber Wave Hacker',
    weapon: 'Ion Plasma Blaster & Conduit',
    svg: (size = 64) => `
      <svg viewBox="0 0 100 100" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg-aquarius" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#0284c7" stop-opacity="0.85"/>
            <stop offset="100%" stop-color="#0c4a6e" stop-opacity="0.95"/>
          </radialGradient>
          <linearGradient id="cyber-frame" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#38bdf8"/>
            <stop offset="50%" stop-color="#0284c7"/>
            <stop offset="100%" stop-color="#0369a1"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="url(#bg-aquarius)" stroke="#00f0ff" stroke-width="2.5"/>
        <rect x="18" y="38" width="6" height="18" rx="3" fill="#00f0ff" stroke="#0369a1" stroke-width="1"/>
        <rect x="76" y="38" width="6" height="18" rx="3" fill="#00f0ff" stroke="#0369a1" stroke-width="1"/>
        <path d="M 28 26 L 72 26 L 76 60 L 50 82 L 24 60 Z" fill="url(#cyber-frame)" stroke="#00f0ff" stroke-width="1.5"/>
        <rect x="42" y="16" width="16" height="10" rx="3" fill="#082f49" stroke="#00f0ff" stroke-width="1.2"/>
        <text x="50" y="24" font-size="8" font-weight="900" fill="#00f0ff" text-anchor="middle">♒</text>
        <path d="M 30 42 L 70 42 L 66 54 L 52 54 L 50 50 L 48 54 L 34 54 Z" fill="#0f172a" stroke="#00f0ff" stroke-width="1.5"/>
        <line x1="33" y1="46" x2="67" y2="46" stroke="#00f0ff" stroke-width="1.2"/>
        <line x1="36" y1="50" x2="64" y2="50" stroke="#38bdf8" stroke-width="1"/>
        <polyline points="28,64 36,64 40,70" fill="none" stroke="#00f0ff" stroke-width="1.2"/>
        <polyline points="72,64 64,64 60,70" fill="none" stroke="#00f0ff" stroke-width="1.2"/>
      </svg>
    `
  },

  pisces: {
    id: 'pisces',
    title: 'Aurora Dream Siren',
    weapon: 'Mystic Dream Orb & Veil',
    svg: (size = 64) => `
      <svg viewBox="0 0 100 100" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg-pisces" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#0f766e" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#134e4a" stop-opacity="0.95"/>
          </radialGradient>
          <linearGradient id="koi-fin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#5eead4"/>
            <stop offset="50%" stop-color="#14b8a6"/>
            <stop offset="100%" stop-color="#0f766e"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="url(#bg-pisces)" stroke="#2dd4bf" stroke-width="2.5"/>
        <path d="M 28 36 C 10 24, 8 46, 24 54 Z" fill="url(#koi-fin)" stroke="#ccfbf1" stroke-width="1.2"/>
        <path d="M 72 36 C 90 24, 92 46, 76 54 Z" fill="url(#koi-fin)" stroke="#ccfbf1" stroke-width="1.2"/>
        <path d="M 30 26 Q 50 16 70 26 Q 74 60 50 82 Q 26 60 30 26 Z" fill="#115e59" stroke="#99f6e4" stroke-width="1.5"/>
        <circle cx="50" cy="26" r="6" fill="#ccfbf1" stroke="#14b8a6" stroke-width="1.5"/>
        <text x="50" y="29.5" font-size="7" font-weight="900" fill="#042f2e" text-anchor="middle">♓</text>
        <path d="M 34 44 Q 42 40 45 45 Q 40 50 34 44 Z" fill="#ffffff"/>
        <path d="M 66 44 Q 58 40 55 45 Q 60 50 66 44 Z" fill="#ffffff"/>
        <circle cx="40" cy="45" r="2" fill="#0f766e"/>
        <circle cx="60" cy="45" r="2" fill="#0f766e"/>
        <path d="M 40 60 Q 50 66 60 60" fill="none" stroke="#5eead4" stroke-width="1.5" stroke-dasharray="2 2"/>
        <circle cx="50" cy="72" r="2.5" fill="#ccfbf1"/>
      </svg>
    `
  }
};

/**
 * Returns formatted SVG string for any hero by ID and desired dimension
 */
export function getHeroAvatarSvg(heroId, size = 64) {
  const avatar = HERO_AVATARS[heroId];
  if (avatar && avatar.svg) {
    return avatar.svg(size);
  }
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}"><circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#fff"/><text x="50" y="58" font-size="28" fill="#fff" text-anchor="middle">⭐</text></svg>`;
}
