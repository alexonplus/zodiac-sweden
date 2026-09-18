import { HERO_AVATARS } from './avatars.js';

export const HERO_CONFIGS = {
  aries: {
    id: 'aries', symbol: '♈', name: 'Aries', title: 'Crimson Ram Knight', element: 'fire', elemLabel: 'FIRE', elemBg: '#ea580c',
    city: 'Kiruna (Lapland)', levelId: 'kiruna', color: '#f97316', energyName: 'RAGE',
    weapon: 'Infernal War Axe', role: 'Berserker / Melee Breaker',
    maxHp: 140, speed: 4.4, jumpForce: -12.0,
    skills: { q: { name: 'Flame Shockwave', cost: 25, cd: 110 }, e: { name: 'Magma Eruption', cost: 30, cd: 140 }, dash: { cd: 40 } }
  },
  taurus: {
    id: 'taurus', symbol: '♉', name: 'Taurus', title: 'Copper Minotaur Titan', element: 'earth', elemLabel: 'EARTH', elemBg: '#b45309',
    city: 'Falun (Copper Realm)', levelId: 'kiruna', color: '#d97706', energyName: 'FORCE',
    weapon: 'Heavy Bronze Maul', role: 'Juggernaut / Heavy Tank',
    maxHp: 160, speed: 4.0, jumpForce: -11.2,
    skills: { q: { name: 'Seismic Stomp', cost: 20, cd: 110 }, e: { name: 'Boulder Strike', cost: 25, cd: 130 }, dash: { cd: 45 } }
  },
  gemini: {
    id: 'gemini', symbol: '♊', name: 'Gemini', title: 'Dual Sky Dancer', element: 'wind', elemLabel: 'WIND', elemBg: '#0284c7',
    city: 'Malmö (Wind Coast)', levelId: 'goteborg', color: '#38bdf8', energyName: 'FLOW',
    weapon: 'Twin Wind Chakrams', role: 'Speed Skirmisher / Aerial',
    maxHp: 105, speed: 5.3, jumpForce: -12.4,
    skills: { q: { name: 'Cyclone Slice', cost: 20, cd: 90 }, e: { name: 'Gale Vortex', cost: 25, cd: 120 }, dash: { cd: 30 } }
  },
  cancer: {
    id: 'cancer', symbol: '♋', name: 'Cancer', title: 'Tidal Crab Paladin', element: 'water', elemLabel: 'WATER', elemBg: '#0369a1',
    city: 'Marstrand (Archipelago)', levelId: 'goteborg', color: '#0ea5e9', energyName: 'TIDE',
    weapon: 'Carapace Shield & Harpoon', role: 'Guardian / Defensive Bulwark',
    maxHp: 130, speed: 4.5, jumpForce: -11.5,
    skills: { q: { name: 'Ocean Surge', cost: 20, cd: 100 }, e: { name: 'Tidal Fortress', cost: 30, cd: 140 }, dash: { cd: 40 } }
  },
  leo: {
    id: 'leo', symbol: '♌', name: 'Leo', title: 'Solar Lion Sovereign', element: 'solar', elemLabel: 'SOLAR', elemBg: '#ca8a04',
    city: 'Stockholm (Capital)', levelId: 'stockholm', color: '#facc15', energyName: 'SOLAR',
    weapon: 'Radiant Sunblade', role: 'Radiant Knight / Duelist',
    maxHp: 120, speed: 5.0, jumpForce: -11.8,
    skills: { q: { name: 'Solar Flare', cost: 20, cd: 100 }, e: { name: 'Crown Nova', cost: 25, cd: 140 }, dash: { cd: 40 } }
  },
  virgo: {
    id: 'virgo', symbol: '♍', name: 'Virgo', title: 'Ancient Woods Huntress', element: 'nature', elemLabel: 'NATURE', elemBg: '#16a34a',
    city: 'Uppsala (Ancient Woods)', levelId: 'stockholm', color: '#4ade80', energyName: 'FLORA',
    weapon: 'Verdant Longbow', role: 'Sniper / Crowd Control',
    maxHp: 110, speed: 4.8, jumpForce: -11.7,
    skills: { q: { name: 'Bramble Arrow', cost: 20, cd: 100 }, e: { name: 'Root Entangle', cost: 25, cd: 130 }, dash: { cd: 40 } }
  },
  libra: {
    id: 'libra', symbol: '♎', name: 'Libra', title: 'Astral Cosmos Arbiter', element: 'astral', elemLabel: 'ASTRAL', elemBg: '#4f46e5',
    city: 'Lund (Astral Citadel)', levelId: 'goteborg', color: '#818cf8', energyName: 'KARMA',
    weapon: 'Gravity Scales & Wand', role: 'Mage / Disrupter',
    maxHp: 115, speed: 5.0, jumpForce: -12.0,
    skills: { q: { name: 'Equilibrium Blast', cost: 20, cd: 95 }, e: { name: 'Astral Warp', cost: 25, cd: 130 }, dash: { cd: 35 } }
  },
  scorpio: {
    id: 'scorpio', symbol: '♏', name: 'Scorpio', title: 'Toxic Shadow Stalker', element: 'poison', elemLabel: 'POISON', elemBg: '#7e22ce',
    city: 'Visby (Gotland Island)', levelId: 'visby', color: '#a855f7', energyName: 'VENOM',
    weapon: 'Dual Venom Daggers', role: 'Infiltrator / Poison DPS',
    maxHp: 110, speed: 5.2, jumpForce: -12.2,
    skills: { q: { name: 'Venom Needle', cost: 20, cd: 100 }, e: { name: 'Shadow Sting', cost: 25, cd: 130 }, dash: { cd: 35 } }
  },
  sagittarius: {
    id: 'sagittarius', symbol: '♐', name: 'Sagittarius', title: 'Sunlit Stellar Ranger', element: 'fire', elemLabel: 'COSMIC', elemBg: '#c2410c',
    city: 'Karlstad (Sunlit Valley)', levelId: 'kiruna', color: '#fb923c', energyName: 'FOCUS',
    weapon: 'Solar Plasma Bow', role: 'Ranger / Long Range DPS',
    maxHp: 110, speed: 5.1, jumpForce: -12.2,
    skills: { q: { name: 'Cosmic Piercer', cost: 20, cd: 90 }, e: { name: 'Meteor Barrage', cost: 25, cd: 120 }, dash: { cd: 35 } }
  },
  capricorn: {
    id: 'capricorn', symbol: '♑', name: 'Capricorn', title: 'Frost Peak Elder', element: 'ice', elemLabel: 'FROST', elemBg: '#0891b2',
    city: 'Östersund (Frost Peak)', levelId: 'kiruna', color: '#67e8f9', energyName: 'FROST',
    weapon: 'Glacial Great-Axe', role: 'Cryo Warrior / Area Freeze',
    maxHp: 135, speed: 4.6, jumpForce: -12.5,
    skills: { q: { name: 'Glacial Spike', cost: 25, cd: 100 }, e: { name: 'Blizzard Ring', cost: 25, cd: 140 }, dash: { cd: 40 } }
  },
  aquarius: {
    id: 'aquarius', symbol: '♒', name: 'Aquarius', title: 'Cyber Wave Hacker', element: 'tech', elemLabel: 'CYBER', elemBg: '#0284c7',
    city: 'Gothenburg (Shipyards)', levelId: 'goteborg', color: '#00f0ff', energyName: 'RAM',
    weapon: 'Ion Plasma Blaster & Conduit', role: 'Cyber Gunslinger / Tech Support',
    maxHp: 100, speed: 4.8, jumpForce: -11.5,
    skills: { q: { name: 'Ion Beam', cost: 25, cd: 120 }, e: { name: 'Overclock Pulse', cost: 20, cd: 150 }, dash: { cd: 45 } }
  },
  pisces: {
    id: 'pisces', symbol: '♓', name: 'Pisces', title: 'Aurora Dream Siren', element: 'water', elemLabel: 'MYSTIC', elemBg: '#0f766e',
    city: 'Umeå (Aurora River)', levelId: 'goteborg', color: '#2dd4bf', energyName: 'DREAM',
    weapon: 'Mystic Dream Orb & Veil', role: 'Mystic Enchanter / Healer',
    maxHp: 105, speed: 5.0, jumpForce: -12.0,
    skills: { q: { name: 'Aurora Wave', cost: 20, cd: 95 }, e: { name: 'Dream Cascade', cost: 25, cd: 130 }, dash: { cd: 35 } }
  }
};
