export const HERO_CONFIGS = {
  aries: {
    id: 'aries', symbol: '♈', name: 'Aries', element: 'fire', elemLabel: 'FIRE', elemBg: '#ea580c',
    city: 'Kiruna (Lapland)', levelId: 'kiruna', color: '#f97316', energyName: 'RAGE',
    maxHp: 140, speed: 4.4, jumpForce: -12.0,
    skills: { q: { cost: 25, cd: 110 }, e: { cost: 30, cd: 140 }, dash: { cd: 40 } }
  },
  taurus: {
    id: 'taurus', symbol: '♉', name: 'Taurus', element: 'earth', elemLabel: 'EARTH', elemBg: '#b45309',
    city: 'Falun (Copper Realm)', levelId: 'kiruna', color: '#d97706', energyName: 'FORCE',
    maxHp: 160, speed: 4.0, jumpForce: -11.2,
    skills: { q: { cost: 20, cd: 110 }, e: { cost: 25, cd: 130 }, dash: { cd: 45 } }
  },
  gemini: {
    id: 'gemini', symbol: '♊', name: 'Gemini', element: 'wind', elemLabel: 'WIND', elemBg: '#0284c7',
    city: 'Malmö (Wind Coast)', levelId: 'goteborg', color: '#38bdf8', energyName: 'FLOW',
    maxHp: 105, speed: 5.3, jumpForce: -12.4,
    skills: { q: { cost: 20, cd: 90 }, e: { cost: 25, cd: 120 }, dash: { cd: 30 } }
  },
  cancer: {
    id: 'cancer', symbol: '♋', name: 'Cancer', element: 'water', elemLabel: 'WATER', elemBg: '#0369a1',
    city: 'Marstrand (Archipelago)', levelId: 'goteborg', color: '#0ea5e9', energyName: 'TIDE',
    maxHp: 130, speed: 4.5, jumpForce: -11.5,
    skills: { q: { cost: 20, cd: 100 }, e: { cost: 30, cd: 140 }, dash: { cd: 40 } }
  },
  leo: {
    id: 'leo', symbol: '♌', name: 'Leo', element: 'solar', elemLabel: 'SOLAR', elemBg: '#ca8a04',
    city: 'Stockholm (Capital)', levelId: 'stockholm', color: '#facc15', energyName: 'SOLAR',
    maxHp: 120, speed: 5.0, jumpForce: -11.8,
    skills: { q: { cost: 20, cd: 100 }, e: { cost: 25, cd: 140 }, dash: { cd: 40 } }
  },
  virgo: {
    id: 'virgo', symbol: '♍', name: 'Virgo', element: 'nature', elemLabel: 'NATURE', elemBg: '#16a34a',
    city: 'Uppsala (Ancient Woods)', levelId: 'stockholm', color: '#4ade80', energyName: 'FLORA',
    maxHp: 110, speed: 4.8, jumpForce: -11.7,
    skills: { q: { cost: 20, cd: 100 }, e: { cost: 25, cd: 130 }, dash: { cd: 40 } }
  },
  libra: {
    id: 'libra', symbol: '♎', name: 'Libra', element: 'astral', elemLabel: 'ASTRAL', elemBg: '#4f46e5',
    city: 'Lund (Astral Citadel)', levelId: 'goteborg', color: '#818cf8', energyName: 'KARMA',
    maxHp: 115, speed: 5.0, jumpForce: -12.0,
    skills: { q: { cost: 20, cd: 95 }, e: { cost: 25, cd: 130 }, dash: { cd: 35 } }
  },
  scorpio: {
    id: 'scorpio', symbol: '♏', name: 'Scorpio', element: 'poison', elemLabel: 'POISON', elemBg: '#7e22ce',
    city: 'Visby (Gotland Island)', levelId: 'visby', color: '#a855f7', energyName: 'VENOM',
    maxHp: 110, speed: 5.2, jumpForce: -12.2,
    skills: { q: { cost: 20, cd: 100 }, e: { cost: 25, cd: 130 }, dash: { cd: 35 } }
  },
  sagittarius: {
    id: 'sagittarius', symbol: '♐', name: 'Sagittarius', element: 'fire', elemLabel: 'COSMIC', elemBg: '#c2410c',
    city: 'Karlstad (Sunlit Valley)', levelId: 'kiruna', color: '#fb923c', energyName: 'FOCUS',
    maxHp: 110, speed: 5.1, jumpForce: -12.2,
    skills: { q: { cost: 20, cd: 90 }, e: { cost: 25, cd: 120 }, dash: { cd: 35 } }
  },
  capricorn: {
    id: 'capricorn', symbol: '♑', name: 'Capricorn', element: 'ice', elemLabel: 'FROST', elemBg: '#0891b2',
    city: 'Östersund (Frost Peak)', levelId: 'kiruna', color: '#67e8f9', energyName: 'FROST',
    maxHp: 135, speed: 4.6, jumpForce: -12.5,
    skills: { q: { cost: 25, cd: 100 }, e: { cost: 25, cd: 140 }, dash: { cd: 40 } }
  },
  aquarius: {
    id: 'aquarius', symbol: '♒', name: 'Aquarius', element: 'tech', elemLabel: 'CYBER', elemBg: '#0284c7',
    city: 'Gothenburg (Shipyards)', levelId: 'goteborg', color: '#00f0ff', energyName: 'RAM',
    maxHp: 100, speed: 4.8, jumpForce: -11.5,
    skills: { q: { cost: 25, cd: 120 }, e: { cost: 20, cd: 150 }, dash: { cd: 45 } }
  },
  pisces: {
    id: 'pisces', symbol: '♓', name: 'Pisces', element: 'water', elemLabel: 'MYSTIC', elemBg: '#0f766e',
    city: 'Umeå (Aurora River)', levelId: 'goteborg', color: '#2dd4bf', energyName: 'DREAM',
    maxHp: 105, speed: 5.0, jumpForce: -12.0,
    skills: { q: { cost: 20, cd: 95 }, e: { cost: 25, cd: 130 }, dash: { cd: 35 } }
  }
};
