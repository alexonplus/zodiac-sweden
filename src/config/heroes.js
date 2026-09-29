import { HERO_AVATARS } from './avatars.js';

export const HERO_CONFIGS = {
  aries: {
    id: 'aries', symbol: '♈', name: 'Aries', title: 'Crimson Ram Knight', element: 'fire', elemLabel: 'FIRE', elemBg: '#ea580c',
    city: 'Kiruna (Lapland)', levelId: 'kiruna', color: '#f97316', energyName: 'RAGE',
    weapon: 'Infernal War Axe & Molten Horns', role: 'Berserker / Melee Breaker', archetype: 'BERSERKER',
    combatStyle: 'Devastating Melee Berserker: Blazing ground fissures, cleaving infernal strikes, and escalating fury',
    lore: 'Forged in the subterranean iron forges of LKAB beneath Kiruna, infused with raw geothermal fury.',
    passive: 'Molten Resurgence: Attack damage and attack speed scale up to +50% as health drops.',
    superpower: 'Subterranean Magma Cataclysm: Erupts 7 titanic pillars of molten magma across the battlefield!',
    ultName: 'SUBTERRANEAN MAGMA CATACLYSM',
    maxHp: 140, speed: 4.4, jumpForce: -12.0,
    stats: { atk: 92, def: 78, spd: 65, rng: 35, syn: 88 },
    skills: {
      q: { name: 'Volcanic Fissure', cost: 25, cd: 45, desc: 'Erupts 4 rising volcanic magma geysers that ignite & launch foes' },
      e: { name: 'Molten Ram Charge', cost: 40, cd: 75, desc: 'Horn ram charge detonating into an explosive volcanic burst' },
      dash: { name: 'Blazing Ram Dash', cd: 30, desc: 'Fiery charge leaving a burning trail' },
      ult: { name: 'Subterranean Magma Cataclysm', desc: 'Superpower: 8 titanic magma geysers incinerate the arena' }
    }
  },
  taurus: {
    id: 'taurus', symbol: '♉', name: 'Taurus', title: 'Copper Minotaur Titan', element: 'earth', elemLabel: 'EARTH', elemBg: '#b45309',
    city: 'Falun (Copper Realm)', levelId: 'kiruna', color: '#d97706', energyName: 'FORCE',
    weapon: 'Heavy Bronze Maul & Copper Plate', role: 'Juggernaut / Heavy Tank', archetype: 'JUGGERNAUT',
    combatStyle: 'Heavy Seismic Juggernaut: Quake-inducing bronze maul blows, boulder throws, and unyielding armor',
    lore: 'Guardian of the Great Copper Mountain of Falun, wearing ancient Nordic runic bronze plates.',
    passive: 'Tectonic Bastion: Immune to knockback; periodically reinforces with Falun bronze plating.',
    superpower: 'Wrath of Falun Mountain: Summons colossal runic bronze monoliths crashing down from above!',
    ultName: 'WRATH OF FALUN MOUNTAIN',
    maxHp: 160, speed: 4.0, jumpForce: -11.2,
    stats: { atk: 88, def: 98, spd: 45, rng: 30, syn: 75 },
    skills: {
      q: { name: 'Tectonic Seismic Quake', cost: 25, cd: 45, desc: 'Erupts 4 jagged stone monoliths, launching sky-high & petrifying foes' },
      e: { name: 'Granite Tremor Smash', cost: 40, cd: 75, desc: 'Whirlwind maul swing launching 4 crushing boulders' },
      dash: { name: 'Tectonic Bull Charge', cd: 35, desc: 'Unstoppable charge plowing through all enemies' },
      ult: { name: 'Wrath of Falun Mountain', desc: 'Superpower: Apocalyptic earthquake crushing all foes in stone' }
    }
  },
  gemini: {
    id: 'gemini', symbol: '♊', name: 'Gemini', title: 'Dual Sky Dancer', element: 'wind', elemLabel: 'WIND', elemBg: '#0284c7',
    city: 'Malmö (Wind Coast)', levelId: 'goteborg', color: '#38bdf8', energyName: 'FLOW',
    weapon: 'Twin Wind Chakrams', role: 'Speed Skirmisher / Aerial Acrobat', archetype: 'SKIRMISHER',
    combatStyle: 'Acrobatic Chakram Skirmisher: Dual boomerangs that return to hands and aerial gliding maneuvers',
    lore: 'Harnesses the supersonic coastal gales of the Öresund strait with twin silver aerial chakrams.',
    passive: 'Zephyr Velocity: Acrobatic gliding double jump leaving razor-sharp wind trails.',
    superpower: 'Twin Astral Mirror Clones: Summons autonomous twin combat clones (Castor & Pollux) that aggressively hunt down, slash, and overwhelm foes!',
    ultName: 'TWIN ASTRAL MIRROR CLONES',
    maxHp: 105, speed: 5.3, jumpForce: -12.4,
    stats: { atk: 84, def: 55, spd: 98, rng: 70, syn: 90 },
    skills: {
      q: { name: 'Cyclone Tornado', cost: 25, cd: 45, desc: 'Summons an animated moving tornado vacuuming and shredding foes' },
      e: { name: 'Supersonic Gale Blast', cost: 40, cd: 75, desc: 'Ferocious hurricane wind blowing all enemies across the battlefield!' },
      dash: { name: 'Öresund Aero Rush', cd: 25, desc: 'Rapid aerial dash slicing through opponents' },
      ult: { name: 'Twin Astral Mirror Clones', desc: 'Superpower: Summons twin combat mirror clones to fight by your side' }
    }
  },
  cancer: {
    id: 'cancer', symbol: '♋', name: 'Cancer', title: 'Tidal Crab Paladin', element: 'water', elemLabel: 'WATER', elemBg: '#0369a1',
    city: 'Marstrand (Archipelago)', levelId: 'goteborg', color: '#0ea5e9', energyName: 'TIDE',
    weapon: 'Carapace Shield & Titanium Harpoon', role: 'Guardian / Defensive Bulwark', archetype: 'BULWARK',
    combatStyle: 'Bulwark Guardian: Titanium harpoon pulls, heavy shield slams, tidal barriers, and counter-attacks',
    lore: 'Clad in crystalline Bohuslän granite and deep Kattegat coral carapace armor from Marstrand fortress.',
    passive: 'Abyssal Shell: Blocks 30% damage from the front and retaliates with needle-sharp water spikes.',
    superpower: 'Great Kattegat Tsunami: A monumental tidal wave sweeping all enemies across the battlefield!',
    ultName: 'GREAT KATTEGAT TSUNAMI',
    maxHp: 130, speed: 4.5, jumpForce: -11.5,
    stats: { atk: 72, def: 94, spd: 60, rng: 65, syn: 82 },
    skills: {
      q: { name: 'Ocean Harpoon Pull', cost: 25, cd: 45, desc: 'Chain harpoon pulling enemies directly into point-blank range' },
      e: { name: 'Glacial Coral Nova', cost: 40, cd: 75, desc: 'Shields, heals +25 HP, and FREEZES all surrounding foes in ice blocks!' },
      dash: { name: 'Carapace Scuttle', cd: 30, desc: 'Armored carapace lunge deflecting incoming projectiles' },
      ult: { name: 'Great Kattegat Tsunami', desc: 'Superpower: Giant Kattegat tsunami sweeps & freezes all enemies solid' }
    }
  },
  leo: {
    id: 'leo', symbol: '♌', name: 'Leo', title: 'Solar Lion Sovereign', element: 'solar', elemLabel: 'SOLAR', elemBg: '#ca8a04',
    city: 'Stockholm (Capital)', levelId: 'stockholm', color: '#facc15', energyName: 'SOLAR',
    weapon: 'Radiant Sunblade of Tre Kronor', role: 'Radiant Knight / Duelist', archetype: 'CHAMPION',
    combatStyle: 'Radiant Solar Sovereign: Sweeping golden plasma waves, blinding lion roars, and orbital sunblades',
    lore: 'Bearer of the Royal Tre Kronor solar crest, channeling the eternal solstice sun over Gamla Stan.',
    passive: 'Coronal Radiance: Burns nearby foes with intense solar radiation, applying persistent fire.',
    superpower: 'Tre Kronor Solstice Judgement: Three titanic solar sunblades strike down in blinding plasma columns!',
    ultName: 'TRE KRONOR SOLSTICE JUDGEMENT',
    maxHp: 120, speed: 5.0, jumpForce: -11.8,
    stats: { atk: 95, def: 75, spd: 78, rng: 50, syn: 94 },
    skills: {
      q: { name: 'Solar Flare Beam', cost: 25, cd: 45, desc: 'Piercing beam of concentrated solar plasma' },
      e: { name: 'Lion’s Crown Nova', cost: 40, cd: 75, desc: 'Royal lion roar releasing a blinding 360-degree plasma blast' },
      dash: { name: 'Solstice Radiant Step', cd: 28, desc: 'Blazing forward flash trailing radiant sunlight' },
      ult: { name: 'Tre Kronor Solstice Judgement', desc: 'Superpower: Three royal sunblades cleanse the battlefield' }
    }
  },
  virgo: {
    id: 'virgo', symbol: '♍', name: 'Virgo', title: 'Ancient Woods Huntress', element: 'nature', elemLabel: 'NATURE', elemBg: '#16a34a',
    city: 'Uppsala (Ancient Woods)', levelId: 'stockholm', color: '#4ade80', energyName: 'FLORA',
    weapon: 'Verdant Longbow of Yggdrasil', role: 'Sniper / Crowd Control', archetype: 'SNIPER',
    combatStyle: 'Verdant Sylvan Sniper: Long-range piercing arrows, entangling briar roots, and healing sacred groves',
    lore: 'Keeper of the sacred pagan groves of Gamla Uppsala, blessed by Yggdrasil saplings.',
    passive: 'Sylvan Briar: Arrows pierce multiple targets and root enemies in place with thorny vines.',
    superpower: 'Wrath of Yggdrasil: Roots of the World Tree burst from below, impaling and crushing all enemies!',
    ultName: 'WRATH OF YGGDRASIL',
    maxHp: 110, speed: 4.8, jumpForce: -11.7,
    stats: { atk: 86, def: 60, spd: 76, rng: 96, syn: 86 },
    skills: {
      q: { name: 'Bramble Root Piercer', cost: 25, cd: 45, desc: 'Piercing thorny arrow rooting enemies in place' },
      e: { name: 'Yggdrasil Grove Bloom', cost: 40, cd: 75, desc: 'Enchanted blooming grove: heals allies and poisons enemies with thorns' },
      dash: { name: 'Forest Phantom Flit', cd: 28, desc: 'Disperses into a swirl of golden birch leaves' },
      ult: { name: 'Wrath of Yggdrasil', desc: 'Superpower: Giant roots of Yggdrasil crush the battlefield' }
    }
  },
  libra: {
    id: 'libra', symbol: '♎', name: 'Libra', title: 'Astral Cosmos Arbiter', element: 'astral', elemLabel: 'ASTRAL', elemBg: '#4f46e5',
    city: 'Lund (Astral Citadel)', levelId: 'goteborg', color: '#818cf8', energyName: 'KARMA',
    weapon: 'Gravity Scales & Astral Wand', role: 'Cosmic Mage / Disruptor', archetype: 'DISRUPTOR',
    combatStyle: 'Cosmic Gravity Arbiter: Binary light & dark spheres, gravitational black holes, and phase shifts',
    lore: 'Cosmic scholar from Lund Observatory who maintains the gravitational balance of northern constellations.',
    passive: 'Cosmic Equilibrium: Alternating skills accelerates cooldowns and amplifies astral damage.',
    superpower: 'Chrono Stasis Equilibrium: Completely freezes time across the cosmos! All enemies and projectiles halt in place while Libra moves freely to strike!',
    ultName: 'CHRONO STASIS: TIME STOP',
    maxHp: 115, speed: 5.0, jumpForce: -12.0,
    stats: { atk: 82, def: 68, spd: 75, rng: 88, syn: 98 },
    skills: {
      q: { name: 'Equilibrium Blast', cost: 25, cd: 45, desc: 'Binary orbiting star that detonates on impact' },
      e: { name: 'Gravity Singularity', cost: 40, cd: 75, desc: 'Miniature black hole pulling all enemies toward its event horizon' },
      dash: { name: 'Astral Warp', cd: 26, desc: 'Instant quantum phase shift through space' },
      ult: { name: 'Chrono Stasis: Time Stop', desc: 'Superpower: Complete time freeze across the entire battlefield' }
    }
  },
  scorpio: {
    id: 'scorpio', symbol: '♏', name: 'Scorpio', title: 'Toxic Shadow Stalker', element: 'poison', elemLabel: 'POISON', elemBg: '#7e22ce',
    city: 'Visby (Gotland Island)', levelId: 'visby', color: '#a855f7', energyName: 'VENOM',
    weapon: 'Dual Venom Daggers & Stinger', role: 'Infiltrator / Toxic Assassin', archetype: 'ASSASSIN',
    combatStyle: 'Toxic Shadow Infiltrator: Rapid dagger flurries, venom needle sprays, and shadow backstabs',
    lore: 'Operates in the foggy cobblestone shadows behind the medieval limestone ramparts of Visby.',
    passive: 'Noxious Sting: Attacks inflict stacking lethal venom that increases team synergy.',
    superpower: 'Cosmic Meteor Shower: Rains down a cataclysmic barrage of flaming celestial meteors across the battlefield, devastating all enemies!',
    ultName: 'COSMIC METEOR SHOWER',
    maxHp: 110, speed: 5.2, jumpForce: -12.2,
    stats: { atk: 94, def: 58, spd: 92, rng: 40, syn: 96 },
    skills: {
      q: { name: 'Venom Needle Volley', cost: 25, cd: 45, desc: 'Fan of 5 toxic needles fired in a lethal arc' },
      e: { name: 'Shadow Stinger Ambush', cost: 40, cd: 75, desc: 'Shadow teleports behind the nearest enemy for a guaranteed critical strike' },
      dash: { name: 'Phantom Shadow Stride', cd: 26, desc: 'Invisible smoke dash leaving a decoy behind' },
      ult: { name: 'Cosmic Meteor Shower', desc: 'Superpower: Cataclysmic flaming meteor shower rains down from the heavens' }
    }
  },
  sagittarius: {
    id: 'sagittarius', symbol: '♐', name: 'Sagittarius', title: 'Sunlit Stellar Ranger', element: 'fire', elemLabel: 'COSMIC', elemBg: '#c2410c',
    city: 'Karlstad (Sunlit Valley)', levelId: 'kiruna', color: '#fb923c', energyName: 'FOCUS',
    weapon: 'Solar Plasma Bow of Värmland', role: 'Long-Range Celestial Archer', archetype: 'RANGER',
    combatStyle: 'Hypersonic Solar Marksman: Hyper-piercing plasma arrows, aerial flips, and meteor barrages',
    lore: 'Born in Värmland sun-dappled forests, wielding a bow forged from captured aurora solar flares.',
    passive: 'Solar Trajectory: Arrows pierce up to 3 targets with escalating damage per pierce.',
    superpower: 'Celestial Phoenix Supernova: A roaring cosmic sun phoenix sweeps across the sky, incinerating all!',
    ultName: 'CELESTIAL PHOENIX SUPERNOVA',
    maxHp: 110, speed: 5.1, jumpForce: -12.2,
    stats: { atk: 90, def: 62, spd: 82, rng: 98, syn: 89 },
    skills: {
      q: { name: 'Stellar Piercer', cost: 25, cd: 45, desc: 'Supersonic plasma arrow cutting through the entire screen' },
      e: { name: 'Meteor Barrage', cost: 40, cd: 75, desc: 'Sky volley calling down 5 flaming celestial meteors' },
      dash: { name: 'Solar Acrobatic Leap', cd: 28, desc: 'Acrobatic backflip detonating a plasma shockwave' },
      ult: { name: 'Celestial Phoenix Supernova', desc: 'Superpower: Flight of the solar phoenix cleanses all' }
    }
  },
  capricorn: {
    id: 'capricorn', symbol: '♑', name: 'Capricorn', title: 'Frost Peak Elder', element: 'ice', elemLabel: 'FROST', elemBg: '#0891b2',
    city: 'Östersund (Frost Peak)', levelId: 'kiruna', color: '#67e8f9', energyName: 'FROST',
    weapon: 'Glacial Great-Axe & Frost Horns', role: 'Cryo Warrior / Area Freeze', archetype: 'WARRIOR',
    combatStyle: 'Glacial Cryo Crusher: Frost axe cleaves, ground ice spikes, and sub-zero freeze bursts',
    lore: 'Highlander of Mount Åreskutan in Jämtland, clad in ancient permafrost ice-horns and wool.',
    passive: 'Permafrost Aura: Slows nearby enemies by 45% and amplifies damage against frozen targets.',
    superpower: 'Absolute Sub-Zero Cataclysm: Enciphers all enemies in solid permafrost and shatters them!',
    ultName: 'ABSOLUTE SUB-ZERO CATACLYSM',
    maxHp: 135, speed: 4.6, jumpForce: -12.5,
    stats: { atk: 85, def: 88, spd: 62, rng: 45, syn: 91 },
    skills: {
      q: { name: 'Glacial Ice Spikes', cost: 25, cd: 45, desc: 'Spreading wave of razor-sharp ice spikes bursting from the floor' },
      e: { name: 'Blizzard Ring', cost: 40, cd: 75, desc: 'Polar blizzard vortex freezing all surrounding enemies' },
      dash: { name: 'Glacier Avalanche Slide', cd: 30, desc: 'Avalanche slide freezing enemies in your path' },
      ult: { name: 'Absolute Sub-Zero Cataclysm', desc: 'Superpower: Absolute zero flash-freezes and shatters enemies' }
    }
  },
  aquarius: {
    id: 'aquarius', symbol: '♒', name: 'Aquarius', title: 'Cyber Wave Hacker', element: 'tech', elemLabel: 'CYBER', elemBg: '#0284c7',
    city: 'Gothenburg (Shipyards)', levelId: 'goteborg', color: '#00f0ff', energyName: 'RAM',
    weapon: 'Ion Plasma Blaster & Companion Drone', role: 'Cyber Gunslinger / Tech Operative', archetype: 'GUNSLINGER',
    combatStyle: 'Cyber Gunslinger: Ion blaster matrix fire, autonomous tactical drone, and EMP shocks',
    lore: 'Pioneered at Eriksberg shipyard drydocks, combining Nordic maritime steel with cyber wave overclocking.',
    passive: 'Overclock Battery: Autonomous companion drone follows and automatically zaps nearby foes with lightning.',
    superpower: 'Quicksand Maelstrom: Erupts a colossal swirling quicksand abyss that traps, submerges, and crushes all enemies!',
    ultName: 'QUICKSAND MAELSTROM',
    maxHp: 100, speed: 4.8, jumpForce: -11.5,
    stats: { atk: 88, def: 66, spd: 80, rng: 85, syn: 99 },
    skills: {
      q: { name: 'Ion Mega-Beam', cost: 25, cd: 45, desc: 'Continuous ion laser beam piercing through enemy ranks' },
      e: { name: 'Overclock EMP Pulse', cost: 40, cd: 75, desc: 'Drone detonates a high-yield EMP shockwave, stunning all targets' },
      dash: { name: 'Cyber Glide Thruster', cd: 28, desc: 'Thruster-boosted cyber glide leaving neon particle trails' },
      ult: { name: 'Quicksand Maelstrom', desc: 'Superpower: Swirling quicksand abyss traps, submerges & crushes all foes' }
    }
  },
  pisces: {
    id: 'pisces', symbol: '♓', name: 'Pisces', title: 'Aurora Dream Siren', element: 'water', elemLabel: 'MYSTIC', elemBg: '#0f766e',
    city: 'Umeå (Aurora River)', levelId: 'goteborg', color: '#2dd4bf', energyName: 'DREAM',
    weapon: 'Mystic Dream Orb & Aurora Veil', role: 'Mystic Enchanter / Aurora Healer', archetype: 'ENCHANTER',
    combatStyle: 'Mystic Aurora Siren: Homing dream orbs, rejuvenating tidal geysers, and northern light shields',
    lore: 'Swims the frozen Ume River beneath dancing Northern Lights, channeling tidal dream magic.',
    passive: 'Dream Mist: Drops healing dream pearls and continuously regenerates team vitality.',
    superpower: 'Northern Lights Celestial Sanctuary: Full party healing, invulnerability shields, and radiant lightning!',
    ultName: 'NORTHERN LIGHTS CELESTIAL SANCTUARY',
    maxHp: 105, speed: 5.0, jumpForce: -12.0,
    stats: { atk: 78, def: 70, spd: 82, rng: 80, syn: 100 },
    skills: {
      q: { name: 'Aurora Dream Wave', cost: 25, cd: 45, desc: 'Tidal dream wave launching enemies into levitating bubbles' },
      e: { name: 'Dream Cascade Spring', cost: 40, cd: 75, desc: 'Rejuvenating geyser healing 40 HP while damaging surrounding foes' },
      dash: { name: 'Aurora Siren Flow', cd: 26, desc: 'Dissolves into an ethereal water wave slipping through foes' },
      ult: { name: 'Northern Lights Celestial Sanctuary', desc: 'Superpower: Celestial sanctuary restores full HP and strikes enemies' }
    }
  }
};
