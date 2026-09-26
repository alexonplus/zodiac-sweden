/**
 * Zodiac Sweden - 12 Constellations
 * Unique High-Fidelity Vector Arcade Character Avatars for all 12 Zodiac Heroes
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
            <stop offset="0%" stop-color="#ea580c"/>
            <stop offset="60%" stop-color="#9a3412"/>
            <stop offset="100%" stop-color="#431407"/>
          </radialGradient>
          <linearGradient id="horn-gold-l" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="40%" stop-color="#f59e0b"/>
            <stop offset="80%" stop-color="#b45309"/>
            <stop offset="100%" stop-color="#78350f"/>
          </linearGradient>
          <linearGradient id="helm-red" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ef4444"/>
            <stop offset="50%" stop-color="#b91c1c"/>
            <stop offset="100%" stop-color="#450a0a"/>
          </linearGradient>
          <filter id="glow-aries" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>
        <!-- Outer Frame & Constellation Canvas -->
        <circle cx="50" cy="50" r="47" fill="url(#bg-aries)" stroke="#f97316" stroke-width="2.5"/>
        <circle cx="50" cy="50" r="44" fill="none" stroke="#fdba74" stroke-width="0.75" stroke-dasharray="2 3" opacity="0.4"/>
        <!-- Star Constellation Lines (Aries) -->
        <g stroke="#fed7aa" stroke-width="0.8" opacity="0.35" fill="none">
          <line x1="22" y1="26" x2="38" y2="20"/>
          <line x1="38" y1="20" x2="68" y2="22"/>
          <line x1="68" y1="22" x2="80" y2="30"/>
          <circle cx="22" cy="26" r="1.5" fill="#fef08a"/>
          <circle cx="38" cy="20" r="2" fill="#fff"/>
          <circle cx="68" cy="22" r="1.8" fill="#fef08a"/>
          <circle cx="80" cy="30" r="1.5" fill="#fff"/>
        </g>
        <!-- Majestic Curled Horns Left & Right -->
        <path d="M 28 42 C 10 24, 6 48, 14 62 C 20 70, 30 66, 32 56 C 34 46, 24 44, 25 36 C 26 28, 32 32, 34 38 Z" fill="url(#horn-gold-l)" stroke="#78350f" stroke-width="1.2"/>
        <path d="M 72 42 C 90 24, 94 48, 86 62 C 80 70, 70 66, 68 56 C 66 46, 76 44, 75 36 C 74 28, 68 32, 66 38 Z" fill="url(#horn-gold-l)" stroke="#78350f" stroke-width="1.2"/>
        <!-- Horn Ridges -->
        <line x1="15" y1="46" x2="24" y2="48" stroke="#78350f" stroke-width="1.2" opacity="0.8"/>
        <line x1="16" y1="56" x2="25" y2="55" stroke="#78350f" stroke-width="1.2" opacity="0.8"/>
        <line x1="85" y1="46" x2="76" y2="48" stroke="#78350f" stroke-width="1.2" opacity="0.8"/>
        <line x1="84" y1="56" x2="75" y2="55" stroke="#78350f" stroke-width="1.2" opacity="0.8"/>
        <!-- War Helm Silhouette -->
        <path d="M 30 30 L 70 30 L 75 58 L 50 84 L 25 58 Z" fill="url(#helm-red)" stroke="#fca5a5" stroke-width="1.5"/>
        <!-- Forehead Crest & Sigil Plate -->
        <polygon points="50,14 58,32 50,28 42,32" fill="#f59e0b" stroke="#fef08a" stroke-width="1"/>
        <circle cx="50" cy="23" r="3.5" fill="#fef08a" filter="url(#glow-aries)"/>
        <text x="50" y="38" font-size="10" font-weight="900" fill="#fde047" text-anchor="middle" font-family="monospace">♈</text>
        <!-- T-Visor & Fiery Eyes -->
        <path d="M 34 46 L 66 46 L 57 52 L 53 72 L 47 72 L 43 52 Z" fill="#0f172a" stroke="#ea580c" stroke-width="1.2"/>
        <rect x="38" y="47" width="9" height="3" rx="1" fill="#fef08a" filter="url(#glow-aries)"/>
        <rect x="53" y="47" width="9" height="3" rx="1" fill="#fef08a" filter="url(#glow-aries)"/>
        <!-- Beveled Chin Guard -->
        <polygon points="46,74 54,74 50,81" fill="#f97316" stroke="#ea580c" stroke-width="0.8"/>
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
            <stop offset="0%" stop-color="#b45309"/>
            <stop offset="60%" stop-color="#78350f"/>
            <stop offset="100%" stop-color="#291203"/>
          </radialGradient>
          <linearGradient id="bronze-plate" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fde68a"/>
            <stop offset="30%" stop-color="#d97706"/>
            <stop offset="70%" stop-color="#92400e"/>
            <stop offset="100%" stop-color="#451a03"/>
          </linearGradient>
          <linearGradient id="horn-taurus" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f8fafc"/>
            <stop offset="50%" stop-color="#cbd5e1"/>
            <stop offset="100%" stop-color="#475569"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="47" fill="url(#bg-taurus)" stroke="#d97706" stroke-width="2.5"/>
        <circle cx="50" cy="50" r="44" fill="none" stroke="#fde68a" stroke-width="0.75" stroke-dasharray="2 3" opacity="0.3"/>
        <!-- Taurus Constellation -->
        <g stroke="#fde68a" stroke-width="0.8" opacity="0.35" fill="none">
          <circle cx="28" cy="22" r="1.6" fill="#fde68a"/>
          <circle cx="48" cy="18" r="2.2" fill="#fff"/>
          <circle cx="70" cy="24" r="1.6" fill="#fde68a"/>
          <line x1="28" y1="22" x2="48" y2="18"/>
          <line x1="48" y1="18" x2="70" y2="24"/>
        </g>
        <!-- Massive Curved Bull Horns -->
        <path d="M 32 44 C 12 38, 2 20, 8 8 C 14 22, 28 32, 38 36 Z" fill="url(#horn-taurus)" stroke="#78350f" stroke-width="1.5"/>
        <path d="M 68 44 C 88 38, 98 20, 92 8 C 86 22, 72 32, 62 36 Z" fill="url(#horn-taurus)" stroke="#78350f" stroke-width="1.5"/>
        <!-- Heavy Bronze Faceplate -->
        <path d="M 26 28 L 74 28 L 78 64 L 50 86 L 22 64 Z" fill="url(#bronze-plate)" stroke="#fbbf24" stroke-width="1.8"/>
        <!-- Brow Rivets -->
        <circle cx="32" cy="32" r="1.5" fill="#fde68a"/>
        <circle cx="68" cy="32" r="1.5" fill="#fde68a"/>
        <!-- Forehead Sigil Plate -->
        <polygon points="40,22 60,22 50,38" fill="#451a03" stroke="#f59e0b" stroke-width="1.2"/>
        <text x="50" y="34" font-size="9" font-weight="900" fill="#fde68a" text-anchor="middle" font-family="monospace">♉</text>
        <!-- Glowing Amber Slit Eyes -->
        <polygon points="32,46 44,48 35,53" fill="#f59e0b"/>
        <polygon points="68,46 56,48 65,53" fill="#f59e0b"/>
        <circle cx="38" cy="48" r="1.5" fill="#fff"/>
        <circle cx="62" cy="48" r="1.5" fill="#fff"/>
        <!-- Snout & Heavy Copper Nose Ring -->
        <rect x="40" y="58" width="20" height="14" rx="5" fill="#291203" stroke="#92400e" stroke-width="1.2"/>
        <ellipse cx="45" cy="64" rx="2" ry="3" fill="#000"/>
        <ellipse cx="55" cy="64" rx="2" ry="3" fill="#000"/>
        <circle cx="50" cy="74" r="8" fill="none" stroke="#f59e0b" stroke-width="2.5"/>
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
            <stop offset="0%" stop-color="#0284c7"/>
            <stop offset="60%" stop-color="#0369a1"/>
            <stop offset="100%" stop-color="#082f49"/>
          </radialGradient>
          <linearGradient id="split-mask" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#0284c7"/>
            <stop offset="49%" stop-color="#38bdf8"/>
            <stop offset="50%" stop-color="#e0e7ff"/>
            <stop offset="51%" stop-color="#c084fc"/>
            <stop offset="100%" stop-color="#7e22ce"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="47" fill="url(#bg-gemini)" stroke="#38bdf8" stroke-width="2.5"/>
        <circle cx="50" cy="50" r="44" fill="none" stroke="#bae6fd" stroke-width="0.75" stroke-dasharray="2 3" opacity="0.35"/>
        <!-- Wind Chakram Aura Wings -->
        <path d="M 26 34 C 8 20, 10 48, 24 54 Z" fill="none" stroke="#38bdf8" stroke-width="2"/>
        <path d="M 74 34 C 92 20, 90 48, 76 54 Z" fill="none" stroke="#c084fc" stroke-width="2"/>
        <!-- Dual Faceplate Mask -->
        <path d="M 30 24 Q 50 16 70 24 Q 76 62 50 84 Q 24 62 30 24 Z" fill="url(#split-mask)" stroke="#f8fafc" stroke-width="1.8"/>
        <!-- Split Axis Line -->
        <line x1="50" y1="18" x2="50" y2="84" stroke="#ffffff" stroke-width="1.8" stroke-dasharray="4 2"/>
        <!-- Dual Eyes: Left Cyan, Right Purple -->
        <path d="M 34 44 Q 42 41 46 45 Q 40 50 34 44 Z" fill="#e0f2fe"/>
        <circle cx="41" cy="45" r="2.2" fill="#0284c7"/>
        <path d="M 66 44 Q 58 41 54 45 Q 60 50 66 44 Z" fill="#fae8ff"/>
        <circle cx="59" cy="45" r="2.2" fill="#9333ea"/>
        <!-- Diadem Crown & Gemini Glyph -->
        <circle cx="50" cy="27" r="6" fill="#0f172a" stroke="#fff" stroke-width="1.2"/>
        <text x="50" y="31.5" font-size="8" font-weight="900" fill="#fff" text-anchor="middle" font-family="monospace">♊</text>
        <!-- Aerodynamic Chin Shards -->
        <polygon points="46,76 54,76 50,83" fill="#ffffff"/>
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
            <stop offset="0%" stop-color="#0369a1"/>
            <stop offset="60%" stop-color="#075985"/>
            <stop offset="100%" stop-color="#082f49"/>
          </radialGradient>
          <linearGradient id="chitin-helm" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#38bdf8"/>
            <stop offset="40%" stop-color="#0284c7"/>
            <stop offset="80%" stop-color="#0369a1"/>
            <stop offset="100%" stop-color="#082f49"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="47" fill="url(#bg-cancer)" stroke="#0ea5e9" stroke-width="2.5"/>
        <circle cx="50" cy="50" r="44" fill="none" stroke="#7dd3fc" stroke-width="0.75" stroke-dasharray="2 3" opacity="0.35"/>
        <!-- Crustacean Pincers / Antenna Crest -->
        <path d="M 28 34 C 14 20, 8 36, 18 46 C 24 42, 26 38, 28 34 Z" fill="#38bdf8" stroke="#0284c7" stroke-width="1.2"/>
        <path d="M 72 34 C 86 20, 92 36, 82 46 C 76 42, 74 38, 72 34 Z" fill="#38bdf8" stroke="#0284c7" stroke-width="1.2"/>
        <!-- Heavy Carapace Helmet -->
        <path d="M 26 34 Q 50 14 74 34 Q 80 66 50 84 Q 20 66 26 34 Z" fill="url(#chitin-helm)" stroke="#bae6fd" stroke-width="1.8"/>
        <!-- Marstrand Fortress Pearl Sigil -->
        <circle cx="50" cy="28" r="7" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="50" y="32" font-size="8" font-weight="900" fill="#0369a1" text-anchor="middle" font-family="monospace">♋</text>
        <!-- Bioluminescent Deep-Water Visor -->
        <path d="M 32 46 Q 50 42 68 46 Q 64 58 50 63 Q 36 58 32 46 Z" fill="#082f49" stroke="#38bdf8" stroke-width="1.2"/>
        <rect x="36" y="49" width="10" height="3.5" rx="1.5" fill="#38bdf8"/>
        <rect x="54" y="49" width="10" height="3.5" rx="1.5" fill="#38bdf8"/>
        <!-- Side Coral Barnacles -->
        <circle cx="30" cy="62" r="2.5" fill="#7dd3fc"/>
        <circle cx="70" cy="62" r="2.5" fill="#7dd3fc"/>
        <circle cx="50" cy="74" r="3" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1"/>
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
            <stop offset="0%" stop-color="#ca8a04"/>
            <stop offset="60%" stop-color="#854d0e"/>
            <stop offset="100%" stop-color="#451a03"/>
          </radialGradient>
          <linearGradient id="mane-sun" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="30%" stop-color="#facc15"/>
            <stop offset="70%" stop-color="#ea580c"/>
            <stop offset="100%" stop-color="#78350f"/>
          </linearGradient>
          <linearGradient id="gold-crown" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#fffbeb"/>
            <stop offset="50%" stop-color="#fde047"/>
            <stop offset="100%" stop-color="#ca8a04"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="47" fill="url(#bg-leo)" stroke="#facc15" stroke-width="2.5"/>
        <circle cx="50" cy="50" r="44" fill="none" stroke="#fef08a" stroke-width="0.75" stroke-dasharray="2 3" opacity="0.4"/>
        <!-- Radiant Sun Mane Rays -->
        <path d="M 50 6 L 56 20 L 68 10 L 66 24 L 80 20 L 74 32 L 88 36 L 78 46 L 88 56 L 76 62 L 80 74 L 66 72 L 62 84 L 50 78 L 38 84 L 34 72 L 20 74 L 24 62 L 12 56 L 22 46 L 12 36 L 26 32 L 20 20 L 34 24 L 32 10 L 44 20 Z" fill="url(#mane-sun)" stroke="#78350f" stroke-width="1.2"/>
        <!-- Golden Mask & Face Cuirass -->
        <polygon points="32,32 68,32 72,58 50,82 28,58" fill="#eab308" stroke="#fef08a" stroke-width="1.8"/>
        <!-- Royal Tre Kronor 3-Peak Solar Crown -->
        <path d="M 36 24 L 42 12 L 46 22 L 50 8 L 54 22 L 58 12 L 64 24 Z" fill="url(#gold-crown)" stroke="#b45309" stroke-width="1.2"/>
        <!-- Ruby Inset -->
        <circle cx="50" cy="18" r="2.5" fill="#dc2626"/>
        <text x="50" y="38" font-size="9" font-weight="900" fill="#451a03" text-anchor="middle" font-family="monospace">♌</text>
        <!-- Piercing Golden Feline Eyes -->
        <polygon points="34,44 46,46 37,51" fill="#fef08a"/>
        <polygon points="66,44 54,46 63,51" fill="#fef08a"/>
        <line x1="40" y1="44" x2="40" y2="50" stroke="#000" stroke-width="1.8"/>
        <line x1="60" y1="44" x2="60" y2="50" stroke="#000" stroke-width="1.8"/>
        <!-- Golden Snout & Whisker Plate -->
        <polygon points="46,58 54,58 50,64" fill="#78350f"/>
        <line x1="42" y1="62" x2="34" y2="64" stroke="#ca8a04" stroke-width="1"/>
        <line x1="58" y1="62" x2="66" y2="64" stroke="#ca8a04" stroke-width="1"/>
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
            <stop offset="0%" stop-color="#16a34a"/>
            <stop offset="60%" stop-color="#15803d"/>
            <stop offset="100%" stop-color="#064e3b"/>
          </radialGradient>
          <linearGradient id="flora-leaf" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#bbf7d0"/>
            <stop offset="50%" stop-color="#4ade80"/>
            <stop offset="100%" stop-color="#16a34a"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="47" fill="url(#bg-virgo)" stroke="#4ade80" stroke-width="2.5"/>
        <circle cx="50" cy="50" r="44" fill="none" stroke="#bbf7d0" stroke-width="0.75" stroke-dasharray="2 3" opacity="0.35"/>
        <!-- Sylvan Antler Leaf Tiara -->
        <path d="M 22 28 C 18 16, 36 20, 32 30 Z" fill="#86efac" stroke="#15803d" stroke-width="1"/>
        <path d="M 78 28 C 82 16, 64 20, 68 30 Z" fill="#86efac" stroke="#15803d" stroke-width="1"/>
        <path d="M 32 18 C 34 8, 48 14, 42 22 Z" fill="#4ade80" stroke="#15803d" stroke-width="1"/>
        <path d="M 68 18 C 66 8, 52 14, 58 22 Z" fill="#4ade80" stroke="#15803d" stroke-width="1"/>
        <!-- Huntress Cowl & Face -->
        <path d="M 30 26 Q 50 16 70 26 Q 74 62 50 84 Q 26 62 30 26 Z" fill="url(#flora-leaf)" stroke="#dcfce7" stroke-width="1.8"/>
        <!-- Emerald Forest Diadem -->
        <polygon points="50,16 56,25 50,34 44,25" fill="#fef08a" stroke="#15803d" stroke-width="1"/>
        <text x="50" y="28" font-size="8" font-weight="900" fill="#064e3b" text-anchor="middle" font-family="monospace">♍</text>
        <!-- Sharp Huntress Eyes -->
        <path d="M 35 44 Q 44 40 47 45 Q 40 50 35 44 Z" fill="#ffffff"/>
        <circle cx="42" cy="45" r="2.2" fill="#15803d"/>
        <path d="M 65 44 Q 56 40 53 45 Q 60 50 65 44 Z" fill="#ffffff"/>
        <circle cx="58" cy="45" r="2.2" fill="#15803d"/>
        <!-- Leaf Brooch on Collar -->
        <path d="M 50 68 C 42 74, 50 82, 50 82 C 50 82, 58 74, 50 68 Z" fill="#86efac" stroke="#15803d" stroke-width="1"/>
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
            <stop offset="0%" stop-color="#4f46e5"/>
            <stop offset="60%" stop-color="#3730a3"/>
            <stop offset="100%" stop-color="#1e1b4b"/>
          </radialGradient>
          <linearGradient id="astral-hood-g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#a5b4fc"/>
            <stop offset="50%" stop-color="#6366f1"/>
            <stop offset="100%" stop-color="#312e81"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="47" fill="url(#bg-libra)" stroke="#818cf8" stroke-width="2.5"/>
        <circle cx="50" cy="50" r="44" fill="none" stroke="#c7d2fe" stroke-width="0.75" stroke-dasharray="2 3" opacity="0.35"/>
        <!-- Golden Equilibrium Beam & Hanging Pans -->
        <line x1="24" y1="18" x2="76" y2="18" stroke="#facc15" stroke-width="2.5"/>
        <circle cx="50" cy="18" r="4" fill="#fef08a"/>
        <polygon points="24,18 16,30 32,30" fill="none" stroke="#fde047" stroke-width="1.2"/>
        <polygon points="76,18 68,30 84,30" fill="none" stroke="#fde047" stroke-width="1.2"/>
        <!-- Cosmic Starry Hood -->
        <path d="M 28 28 Q 50 16 72 28 Q 78 64 50 84 Q 22 64 28 28 Z" fill="url(#astral-hood-g)" stroke="#e0e7ff" stroke-width="1.8"/>
        <!-- Orbiting Star Pearls -->
        <circle cx="36" cy="34" r="1.5" fill="#fff"/>
        <circle cx="64" cy="34" r="1.5" fill="#fff"/>
        <circle cx="50" cy="74" r="1.5" fill="#fff"/>
        <!-- Forehead Cosmic Eye & Libra Sigil -->
        <circle cx="50" cy="30" r="6.5" fill="#1e1b4b" stroke="#facc15" stroke-width="1.5"/>
        <text x="50" y="34" font-size="8" font-weight="900" fill="#facc15" text-anchor="middle" font-family="monospace">♎</text>
        <!-- Golden Cosmic Blindfold of Impartial Justice -->
        <rect x="30" y="44" width="40" height="11" rx="4" fill="#1e1b4b" stroke="#818cf8" stroke-width="1.5"/>
        <path d="M 34 49.5 L 44 49.5" stroke="#facc15" stroke-width="2"/>
        <path d="M 56 49.5 L 66 49.5" stroke="#facc15" stroke-width="2"/>
        <circle cx="50" cy="49.5" r="2" fill="#fff"/>
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
            <stop offset="0%" stop-color="#7e22ce"/>
            <stop offset="60%" stop-color="#581c87"/>
            <stop offset="100%" stop-color="#2e1065"/>
          </radialGradient>
          <linearGradient id="chitin-purple" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#c084fc"/>
            <stop offset="50%" stop-color="#7e22ce"/>
            <stop offset="100%" stop-color="#3b0764"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="47" fill="url(#bg-scorpio)" stroke="#a855f7" stroke-width="2.5"/>
        <circle cx="50" cy="50" r="44" fill="none" stroke="#e9d5ff" stroke-width="0.75" stroke-dasharray="2 3" opacity="0.35"/>
        <!-- Segmented Scorpion Tail & Stinger Overhead -->
        <path d="M 50 26 C 50 8, 70 4, 66 2 C 54 8, 44 14, 46 26 Z" fill="#d8b4fe" stroke="#3b0764" stroke-width="1.5"/>
        <polygon points="66,2 72,5 66,9" fill="#22c55e" stroke="#15803d" stroke-width="1"/>
        <circle cx="70" cy="6" r="1.5" fill="#86efac"/>
        <!-- Assassin Mask & Faceted Hood -->
        <path d="M 28 32 Q 50 18 72 32 Q 78 64 50 84 Q 22 64 28 32 Z" fill="url(#chitin-purple)" stroke="#f3e8ff" stroke-width="1.8"/>
        <!-- Forehead Sigil Plate -->
        <polygon points="50,22 56,29 50,36 44,29" fill="#2e1065" stroke="#a855f7" stroke-width="1.2"/>
        <text x="50" y="32" font-size="8" font-weight="900" fill="#4ade80" text-anchor="middle" font-family="monospace">♏</text>
        <!-- Piercing Neon-Green Spider Eyes -->
        <polygon points="32,44 46,48 35,53" fill="#22c55e"/>
        <polygon points="68,44 54,48 65,53" fill="#22c55e"/>
        <circle cx="39" cy="48" r="1.5" fill="#dcfce7"/>
        <circle cx="61" cy="48" r="1.5" fill="#dcfce7"/>
        <!-- Toxic Respirator / Rebreather Grate -->
        <polygon points="40,58 60,58 50,74" fill="#1e1b4b" stroke="#a855f7" stroke-width="1.2"/>
        <circle cx="50" cy="65" r="2.5" fill="#22c55e"/>
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
            <stop offset="0%" stop-color="#c2410c"/>
            <stop offset="60%" stop-color="#9a3412"/>
            <stop offset="100%" stop-color="#431407"/>
          </radialGradient>
          <linearGradient id="solar-hood" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fed7aa"/>
            <stop offset="40%" stop-color="#fb923c"/>
            <stop offset="80%" stop-color="#c2410c"/>
            <stop offset="100%" stop-color="#7c2d12"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="47" fill="url(#bg-sagittarius)" stroke="#fb923c" stroke-width="2.5"/>
        <circle cx="50" cy="50" r="44" fill="none" stroke="#fed7aa" stroke-width="0.75" stroke-dasharray="2 3" opacity="0.35"/>
        <!-- Blazing Phoenix Feather Crest -->
        <path d="M 50 8 L 60 26 L 50 20 L 40 26 Z" fill="#fde047" stroke="#c2410c" stroke-width="1.2"/>
        <line x1="50" y1="6" x2="50" y2="22" stroke="#ea580c" stroke-width="1.8"/>
        <!-- Ranger Hood / Helm -->
        <path d="M 28 30 L 72 30 L 76 62 L 50 84 L 24 62 Z" fill="url(#solar-hood)" stroke="#ffedd5" stroke-width="1.8"/>
        <!-- Forehead Sigil Medallion -->
        <circle cx="50" cy="30" r="7" fill="#431407" stroke="#fdba74" stroke-width="1.5"/>
        <text x="50" y="34" font-size="8" font-weight="900" fill="#fb923c" text-anchor="middle" font-family="monospace">♐</text>
        <!-- Archer Eye Left & Holographic Scope Right -->
        <polygon points="34,45 44,47 36,51" fill="#fef08a"/>
        <!-- Cyber-Solar Monocle Targeter -->
        <circle cx="60" cy="48" r="8" fill="#082f49" stroke="#00f0ff" stroke-width="1.8"/>
        <line x1="52" y1="48" x2="68" y2="48" stroke="#00f0ff" stroke-width="1"/>
        <line x1="60" y1="40" x2="60" y2="56" stroke="#00f0ff" stroke-width="1"/>
        <circle cx="60" cy="48" r="2.5" fill="#ef4444"/>
        <!-- Beveled Neck Collar -->
        <polygon points="42,68 58,68 50,76" fill="#7c2d12" stroke="#fdba74" stroke-width="1.2"/>
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
            <stop offset="0%" stop-color="#0891b2"/>
            <stop offset="60%" stop-color="#0e7490"/>
            <stop offset="100%" stop-color="#164e63"/>
          </radialGradient>
          <linearGradient id="ice-horns-c" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="40%" stop-color="#a5f3fc"/>
            <stop offset="80%" stop-color="#0891b2"/>
            <stop offset="100%" stop-color="#155e75"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="47" fill="url(#bg-capricorn)" stroke="#67e8f9" stroke-width="2.5"/>
        <circle cx="50" cy="50" r="44" fill="none" stroke="#cffafe" stroke-width="0.75" stroke-dasharray="2 3" opacity="0.35"/>
        <!-- Massive Ribbed Ice Mountain Horns -->
        <path d="M 32 38 L 14 14 L 24 28 L 8 6 L 26 20 L 36 32 Z" fill="url(#ice-horns-c)" stroke="#cffafe" stroke-width="1.5"/>
        <path d="M 68 38 L 86 14 L 76 28 L 92 6 L 74 20 L 64 32 Z" fill="url(#ice-horns-c)" stroke="#cffafe" stroke-width="1.5"/>
        <!-- Norse Cryo Helmet -->
        <path d="M 28 28 L 72 28 L 76 60 L 50 84 L 24 60 Z" fill="#0e7490" stroke="#a5f3fc" stroke-width="1.8"/>
        <!-- Runic Brow Plate -->
        <polygon points="50,16 58,26 50,34 42,26" fill="#164e63" stroke="#67e8f9" stroke-width="1.5"/>
        <text x="50" y="28" font-size="8" font-weight="900" fill="#a5f3fc" text-anchor="middle" font-family="monospace">♑</text>
        <!-- Frosted Gaze Eyes -->
        <rect x="34" y="44" width="11" height="4" rx="2" fill="#ffffff"/>
        <rect x="55" y="44" width="11" height="4" rx="2" fill="#ffffff"/>
        <!-- Braided Snow Beard / Icicle Gorget -->
        <path d="M 34 62 L 50 82 L 66 62 L 58 60 L 50 70 L 42 60 Z" fill="#cffafe" stroke="#0891b2" stroke-width="1.5"/>
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
            <stop offset="0%" stop-color="#0284c7"/>
            <stop offset="60%" stop-color="#0369a1"/>
            <stop offset="100%" stop-color="#082f49"/>
          </radialGradient>
          <linearGradient id="cyber-visor-g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#38bdf8"/>
            <stop offset="50%" stop-color="#0284c7"/>
            <stop offset="100%" stop-color="#075985"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="47" fill="url(#bg-aquarius)" stroke="#00f0ff" stroke-width="2.5"/>
        <circle cx="50" cy="50" r="44" fill="none" stroke="#38bdf8" stroke-width="0.75" stroke-dasharray="2 3" opacity="0.35"/>
        <!-- Headset Antenna & Cyber Nodes -->
        <rect x="16" y="36" width="7" height="20" rx="3.5" fill="#00f0ff" stroke="#0369a1" stroke-width="1.2"/>
        <rect x="77" y="36" width="7" height="20" rx="3.5" fill="#00f0ff" stroke="#0369a1" stroke-width="1.2"/>
        <!-- Cyber Combat Helmet -->
        <path d="M 26 26 L 74 26 L 78 60 L 50 84 L 22 60 Z" fill="url(#cyber-visor-g)" stroke="#00f0ff" stroke-width="1.8"/>
        <!-- RAM Core Forehead Module -->
        <rect x="40" y="16" width="20" height="11" rx="3" fill="#082f49" stroke="#00f0ff" stroke-width="1.5"/>
        <text x="50" y="24" font-size="9" font-weight="900" fill="#00f0ff" text-anchor="middle" font-family="monospace">♒</text>
        <!-- Wide Hologram Visor with Audio/Wave Traces -->
        <path d="M 28 40 L 72 40 L 68 54 L 52 54 L 50 50 L 48 54 L 32 54 Z" fill="#0f172a" stroke="#00f0ff" stroke-width="1.8"/>
        <!-- Waveform lines inside visor -->
        <line x1="32" y1="45" x2="68" y2="45" stroke="#00f0ff" stroke-width="1.5"/>
        <polyline points="34,49 42,49 45,43 48,51 52,46 56,49 66,49" fill="none" stroke="#38bdf8" stroke-width="1.2"/>
        <!-- Jaw Circuit Lines -->
        <polyline points="28,64 36,64 42,72" fill="none" stroke="#00f0ff" stroke-width="1.5"/>
        <polyline points="72,64 64,64 58,72" fill="none" stroke="#00f0ff" stroke-width="1.5"/>
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
            <stop offset="0%" stop-color="#0f766e"/>
            <stop offset="60%" stop-color="#115e59"/>
            <stop offset="100%" stop-color="#042f2e"/>
          </radialGradient>
          <linearGradient id="aurora-fin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#99f6e4"/>
            <stop offset="50%" stop-color="#2dd4bf"/>
            <stop offset="100%" stop-color="#0f766e"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="47" fill="url(#bg-pisces)" stroke="#2dd4bf" stroke-width="2.5"/>
        <circle cx="50" cy="50" r="44" fill="none" stroke="#99f6e4" stroke-width="0.75" stroke-dasharray="2 3" opacity="0.35"/>
        <!-- Iridescent Koi Fin Ears -->
        <path d="M 28 36 C 8 22, 6 48, 24 56 Z" fill="url(#aurora-fin)" stroke="#ccfbf1" stroke-width="1.5"/>
        <path d="M 72 36 C 92 22, 94 48, 76 56 Z" fill="url(#aurora-fin)" stroke="#ccfbf1" stroke-width="1.5"/>
        <!-- Siren Veil & Headdress -->
        <path d="M 28 26 Q 50 14 72 26 Q 76 62 50 84 Q 24 62 28 26 Z" fill="#134e4a" stroke="#5eead4" stroke-width="1.8"/>
        <!-- Mystic Sea Pearl & Pisces Glyph -->
        <circle cx="50" cy="26" r="7" fill="#ccfbf1" stroke="#14b8a6" stroke-width="1.5"/>
        <text x="50" y="30" font-size="8" font-weight="900" fill="#042f2e" text-anchor="middle" font-family="monospace">♓</text>
        <!-- Luminous Ocean Eyes -->
        <path d="M 34 44 Q 42 40 46 45 Q 40 50 34 44 Z" fill="#ffffff"/>
        <circle cx="41" cy="45" r="2.2" fill="#0d9488"/>
        <path d="M 66 44 Q 58 40 54 45 Q 60 50 66 44 Z" fill="#ffffff"/>
        <circle cx="59" cy="45" r="2.2" fill="#0d9488"/>
        <!-- Shimmering Dream Veil Pattern -->
        <path d="M 38 60 Q 50 67 62 60" fill="none" stroke="#5eead4" stroke-width="1.8" stroke-dasharray="3 2"/>
        <circle cx="50" cy="72" r="3" fill="#ccfbf1" stroke="#2dd4bf" stroke-width="1"/>
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
