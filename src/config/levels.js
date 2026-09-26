export const LEVELS = {
  goteborg: {
    id: 'goteborg',
    name: '🇸🇪 GÖTEBORG: HARBOR TO ABYSS (12,000PX)',
    bg: 'assets/goteborg.jpg',
    color: '#00f0ff',
    weather: 'rain',
    width: 12000,
    bossSpawnX: 11200,
    hazardType: 'water',
    hazardName: 'Electric Harbor Water',
    checkpointX: 6000,
    sectors: [
      { id: 1, name: 'Lilla Bommen Sunset Marina', startX: 0, endX: 1500, sky: '#033c5e', tint: '#0284c7' },
      { id: 2, name: 'Eriksberg Heavy Crane Terminals', startX: 1500, endX: 3000, sky: '#0c2a4d', tint: '#00f0ff' },
      { id: 3, name: 'Gothenburg Blue Tramway Junction', startX: 3000, endX: 4500, sky: '#082544', tint: '#38bdf8' },
      { id: 4, name: 'Lindholmen High-Tech Neon Port (Checkpoint 🚩)', startX: 4500, endX: 6000, sky: '#051d38', tint: '#818cf8' },
      { id: 5, name: 'Skansen Kronan Fortified Ascent', startX: 6000, endX: 7500, sky: '#081726', tint: '#6366f1' },
      { id: 6, name: 'Volvo Industrial Factory Ruins', startX: 7500, endX: 9000, sky: '#0a1a2f', tint: '#06b6d4' },
      { id: 7, name: 'Älvsborgsbron High Suspension Towers', startX: 9000, endX: 10500, sky: '#061324', tint: '#3b82f6' },
      { id: 8, name: 'Mekanisk Deep Sea Abyssal Arena', startX: 10500, endX: 12000, sky: '#020b18', tint: '#ef4444' }
    ],
    movingPlatforms: [
      // Ferry barge across Sector 2 Harbor Canal Pit (2050 - 2350)
      { x: 2050, y: 490, w: 170, h: 22, rangeX: 130, rangeY: 0, speed: 0.024, type: 'ferry', color: '#00f0ff' },
      // High-tech Crane Lift across Sector 4 Neon Canal (5100 - 5500)
      { x: 5200, y: 410, w: 160, h: 22, rangeX: 160, rangeY: 30, speed: 0.022, type: 'ferry', color: '#818cf8' },
      // Industrial Cargo Ferry across Sector 6 Volvo Canal (8150 - 8550)
      { x: 8250, y: 490, w: 180, h: 22, rangeX: 150, rangeY: 0, speed: 0.026, type: 'ferry', color: '#06b6d4' },
      // Suspension Bridge Sky-Gondola in Sector 7 (9850 - 10250)
      { x: 9950, y: 360, w: 150, h: 22, rangeX: 140, rangeY: 40, speed: 0.025, type: 'ferry', color: '#3b82f6' }
    ],
    platforms: [
      // Ground Docks with Hazardous Harbor Canal Pits
      { x: 0, y: 490, w: 2050, h: 130 },      // Dock 1: Sector 1 & start of Sector 2 (Pit: 2050 - 2350)
      { x: 2350, y: 490, w: 2750, h: 130 },   // Dock 2: Sectors 2, 3 & start of 4 (Pit: 5100 - 5500)
      { x: 5500, y: 490, w: 2650, h: 130 },   // Dock 3: Checkpoint, Sector 5 & start of 6 (Pit: 8150 - 8550)
      { x: 8550, y: 490, w: 1300, h: 130 },   // Dock 4: Sector 6 & start of 7 (Pit: 9850 - 10250)
      { x: 10250, y: 490, w: 1750, h: 130 },  // Dock 5: Sector 7 Bridge End & Sector 8 Boss Arena (10500 - 12000)

      // Sector 1: Lilla Bommen (0 - 1500)
      { x: 280, y: 380, w: 200, h: 20 },
      { x: 620, y: 310, w: 220, h: 20 },
      { x: 960, y: 370, w: 190, h: 20 },
      { x: 1280, y: 290, w: 180, h: 20 },

      // Sector 2: Eriksberg Cranes & Pit 1 (1500 - 3000)
      { x: 1650, y: 360, w: 240, h: 20 },
      { x: 1950, y: 280, w: 200, h: 20 }, // Stepping stone above pit 1
      { x: 2450, y: 350, w: 220, h: 20 },
      { x: 2780, y: 270, w: 230, h: 20 },

      // Sector 3: Blue Tramway Junction (3000 - 4500)
      { x: 3150, y: 340, w: 250, h: 20 },
      { x: 3480, y: 260, w: 240, h: 20 },
      { x: 3820, y: 350, w: 230, h: 20 },
      { x: 4150, y: 280, w: 220, h: 20 },

      // Sector 4: Lindholmen High-Tech & Pit 2 (4500 - 6000)
      { x: 4550, y: 360, w: 240, h: 20 },
      { x: 4900, y: 290, w: 220, h: 20 },
      { x: 5350, y: 260, w: 210, h: 20 }, // High platform over pit 2
      { x: 5680, y: 350, w: 230, h: 20 },

      // Sector 5: Skansen Kronan Fortified Ascent (6000 - 7500)
      { x: 6150, y: 360, w: 250, h: 20 },
      { x: 6480, y: 280, w: 260, h: 20 },
      { x: 6820, y: 240, w: 240, h: 20 },
      { x: 7150, y: 350, w: 220, h: 20 },

      // Sector 6: Volvo Industrial Ruins & Pit 3 (7500 - 9000)
      { x: 7600, y: 360, w: 240, h: 20 },
      { x: 7950, y: 290, w: 220, h: 20 },
      { x: 8400, y: 260, w: 210, h: 20 }, // Over pit 3
      { x: 8750, y: 340, w: 230, h: 20 },

      // Sector 7: Älvsborg Suspension Towers & Pit 4 (9000 - 10500)
      { x: 9150, y: 350, w: 250, h: 20 },
      { x: 9500, y: 270, w: 260, h: 20 },
      { x: 10050, y: 250, w: 230, h: 20 }, // Sky beam over pit 4
      { x: 10380, y: 340, w: 220, h: 20 },

      // Sector 8: Mekanisk Kraken Arena (10500 - 12000)
      { x: 10750, y: 370, w: 260, h: 20 },
      { x: 11100, y: 290, w: 280, h: 20 },
      { x: 11480, y: 240, w: 250, h: 20 },
      { x: 11780, y: 360, w: 180, h: 20 }
    ]
  },

  kiruna: {
    id: 'kiruna',
    name: '🇸🇪 KIRUNA: TUNDRA TO CORE (12,000PX)',
    bg: 'assets/kiruna.jpg',
    color: '#f97316',
    weather: 'snow',
    width: 12000,
    bossSpawnX: 11200,
    hazardType: 'ice_abyss',
    hazardName: 'Sub-Zero LKAB Mine Chasm',
    checkpointX: 6000,
    sectors: [
      { id: 1, name: 'Arctic Blizzard Highway', startX: 0, endX: 1500, sky: '#1e293b', tint: '#94a3b8' },
      { id: 2, name: 'Snowmobile Elk Trail', startX: 1500, endX: 3000, sky: '#172554', tint: '#60a5fa' },
      { id: 3, name: 'LKAB Mine Shaft Sub-level (-300m)', startX: 3000, endX: 4500, sky: '#331805', tint: '#d97706' },
      { id: 4, name: 'Molten Iron Blast Foundry (Checkpoint 🚩)', startX: 4500, endX: 6000, sky: '#451005', tint: '#ea580c' },
      { id: 5, name: 'Ice Hotel Crystal Ruins', startX: 6000, endX: 7500, sky: '#06283d', tint: '#67e8f9' },
      { id: 6, name: 'Kebnekaise Permafrost Ridge', startX: 7500, endX: 9000, sky: '#041d2f', tint: '#38bdf8' },
      { id: 7, name: 'Aurora Borealis Sanctuary Peaks', startX: 9000, endX: 10500, sky: '#1a0d33', tint: '#a855f7' },
      { id: 8, name: 'Malm-Jätte Crystal Core Arena', startX: 10500, endX: 12000, sky: '#02182b', tint: '#f97316' }
    ],
    movingPlatforms: [
      // Mining Ore Elevator across Sector 2 Chasm (2100 - 2400)
      { x: 2150, y: 490, w: 160, h: 22, rangeX: 120, rangeY: 0, speed: 0.025, type: 'lift', color: '#f97316' },
      // Molten Foundry Blast Crane in Sector 4 (5150 - 5550)
      { x: 5250, y: 440, w: 170, h: 22, rangeX: 150, rangeY: 35, speed: 0.022, type: 'lift', color: '#ea580c' },
      // Kebnekaise Glacial Cable Car in Sector 6 (8100 - 8500)
      { x: 8200, y: 420, w: 160, h: 22, rangeX: 140, rangeY: 40, speed: 0.024, type: 'lift', color: '#67e8f9' },
      // Aurora Sky Lift in Sector 7 (9800 - 10200)
      { x: 9900, y: 380, w: 150, h: 22, rangeX: 140, rangeY: 30, speed: 0.026, type: 'lift', color: '#a855f7' }
    ],
    platforms: [
      // Segmented Permafrost Ground with Deep Mining Chasms
      { x: 0, y: 490, w: 2100, h: 130 },      // Ground 1: Sector 1 & start of 2 (Chasm: 2100 - 2400)
      { x: 2400, y: 490, w: 2750, h: 130 },   // Ground 2: Sector 2, 3 & start of 4 (Chasm: 5150 - 5550)
      { x: 5550, y: 490, w: 2550, h: 130 },   // Ground 3: Checkpoint, Sector 5 & start of 6 (Chasm: 8100 - 8500)
      { x: 8500, y: 490, w: 1300, h: 130 },   // Ground 4: Sector 6 & start of 7 (Chasm: 9800 - 10200)
      { x: 10200, y: 490, w: 1800, h: 130 },  // Ground 5: Sector 7 & Sector 8 Boss Arena (10500 - 12000)

      // Sector 1: Tundra (0 - 1500)
      { x: 280, y: 390, w: 210, h: 20 },
      { x: 620, y: 320, w: 220, h: 20 },
      { x: 960, y: 260, w: 200, h: 20 },
      { x: 1280, y: 360, w: 190, h: 20 },

      // Sector 2: Snowmobile & Chasm 1 (1500 - 3000)
      { x: 1650, y: 350, w: 240, h: 20 },
      { x: 1980, y: 270, w: 210, h: 20 },
      { x: 2500, y: 350, w: 220, h: 20 },
      { x: 2820, y: 280, w: 230, h: 20 },

      // Sector 3: Mine Shaft -300m (3000 - 4500)
      { x: 3150, y: 330, w: 240, h: 20 },
      { x: 3480, y: 260, w: 250, h: 20 },
      { x: 3820, y: 340, w: 220, h: 20 },
      { x: 4150, y: 270, w: 230, h: 20 },

      // Sector 4: Blast Foundry & Chasm 2 (4500 - 6000)
      { x: 4550, y: 340, w: 250, h: 20 },
      { x: 4900, y: 260, w: 240, h: 20 },
      { x: 5380, y: 290, w: 220, h: 20 },
      { x: 5720, y: 360, w: 220, h: 20 },

      // Sector 5: Ice Hotel Crystal Ruins (6000 - 7500)
      { x: 6150, y: 370, w: 250, h: 20 },
      { x: 6480, y: 290, w: 270, h: 20 },
      { x: 6820, y: 240, w: 240, h: 20 },
      { x: 7150, y: 350, w: 200, h: 20 },

      // Sector 6: Kebnekaise Glacial Ridge & Chasm 3 (7500 - 9000)
      { x: 7600, y: 370, w: 250, h: 20 },
      { x: 7950, y: 290, w: 230, h: 20 },
      { x: 8350, y: 260, w: 220, h: 20 },
      { x: 8720, y: 350, w: 230, h: 20 },

      // Sector 7: Aurora Sanctuary & Chasm 4 (9000 - 10500)
      { x: 9150, y: 360, w: 260, h: 20 },
      { x: 9500, y: 280, w: 270, h: 20 },
      { x: 10000, y: 250, w: 230, h: 20 },
      { x: 10350, y: 350, w: 210, h: 20 },

      // Sector 8: Malm-Jätte Arena (10500 - 12000)
      { x: 10750, y: 360, w: 260, h: 20 },
      { x: 11100, y: 280, w: 280, h: 20 },
      { x: 11480, y: 240, w: 240, h: 20 },
      { x: 11780, y: 350, w: 170, h: 20 }
    ]
  },

  stockholm: {
    id: 'stockholm',
    name: '🇸🇪 STOCKHOLM: OLD TOWN TO THRONE (12,000PX)',
    bg: 'assets/stockholm.jpg',
    color: '#facc15',
    weather: 'sun',
    width: 12000,
    bossSpawnX: 11200,
    hazardType: 'clockwork',
    hazardName: 'Royal Palace Moat & Cogs',
    checkpointX: 6000,
    sectors: [
      { id: 1, name: 'Skeppsbron Waterfront Bridges', startX: 0, endX: 1500, sky: '#032b43', tint: '#38bdf8' },
      { id: 2, name: 'Royal Steampunk Chariot Run', startX: 1500, endX: 3000, sky: '#2d1804', tint: '#fb923c' },
      { id: 3, name: 'Medieval Gamla Stan Alleys', startX: 3000, endX: 4500, sky: '#291804', tint: '#f59e0b' },
      { id: 4, name: 'Riddarholmen Clockwork Towers (Checkpoint 🚩)', startX: 4500, endX: 6000, sky: '#3d2506', tint: '#facc15' },
      { id: 5, name: 'Kungsträdgården Royal Gardens', startX: 6000, endX: 7500, sky: '#361502', tint: '#fb923c' },
      { id: 6, name: 'Stockholm Metro Cyber Underground', startX: 7500, endX: 9000, sky: '#18181b', tint: '#a1a1aa' },
      { id: 7, name: 'Imperial Grand Arsenal Bridge', startX: 9000, endX: 10500, sky: '#3b1c04', tint: '#f59e0b' },
      { id: 8, name: 'Tre Kronor Imperial Throne Room', startX: 10500, endX: 12000, sky: '#421f05', tint: '#fbbf24' }
    ],
    movingPlatforms: [
      // Brass Clockwork Lift in Sector 2 (2050 - 2380)
      { x: 2100, y: 490, w: 160, h: 22, rangeX: 130, rangeY: 0, speed: 0.024, type: 'gear', color: '#facc15' },
      // Riddarholmen Cog Elevators in Sector 4 (5100 - 5500)
      { x: 5200, y: 430, w: 170, h: 22, rangeX: 140, rangeY: 35, speed: 0.022, type: 'gear', color: '#fbbf24' },
      // Metro Magnetic Rail Lift in Sector 6 (8150 - 8550)
      { x: 8250, y: 490, w: 180, h: 22, rangeX: 150, rangeY: 0, speed: 0.026, type: 'gear', color: '#f59e0b' },
      // Imperial Golden Throne Gondola in Sector 7 (9850 - 10250)
      { x: 9950, y: 370, w: 150, h: 22, rangeX: 140, rangeY: 30, speed: 0.025, type: 'gear', color: '#facc15' }
    ],
    platforms: [
      // Segmented Royal Stone Causeways with Royal Canal Pits
      { x: 0, y: 490, w: 2050, h: 130 },      // Causeway 1: Sector 1 & start of 2 (Pit: 2050 - 2380)
      { x: 2380, y: 490, w: 2720, h: 130 },   // Causeway 2: Sector 2, 3 & start of 4 (Pit: 5100 - 5500)
      { x: 5500, y: 490, w: 2650, h: 130 },   // Causeway 3: Checkpoint, Sector 5 & start of 6 (Pit: 8150 - 8550)
      { x: 8550, y: 490, w: 1300, h: 130 },   // Causeway 4: Sector 6 & start of 7 (Pit: 9850 - 10250)
      { x: 10250, y: 490, w: 1750, h: 130 },  // Causeway 5: Sector 7 & Sector 8 Throne Room Arena (10500 - 12000)

      // Sector 1: Skeppsbron (0 - 1500)
      { x: 280, y: 380, w: 220, h: 20 },
      { x: 620, y: 310, w: 230, h: 20 },
      { x: 960, y: 370, w: 210, h: 20 },
      { x: 1280, y: 290, w: 190, h: 20 },

      // Sector 2: Chariot & Pit 1 (1500 - 3000)
      { x: 1650, y: 350, w: 240, h: 20 },
      { x: 1980, y: 270, w: 220, h: 20 },
      { x: 2480, y: 360, w: 220, h: 20 },
      { x: 2820, y: 280, w: 230, h: 20 },

      // Sector 3: Gamla Stan (3000 - 4500)
      { x: 3150, y: 330, w: 250, h: 20 },
      { x: 3480, y: 250, w: 240, h: 20 },
      { x: 3820, y: 340, w: 230, h: 20 },
      { x: 4150, y: 270, w: 220, h: 20 },

      // Sector 4: Riddarholmen & Pit 2 (4500 - 6000)
      { x: 4550, y: 350, w: 240, h: 20 },
      { x: 4900, y: 270, w: 260, h: 20 },
      { x: 5350, y: 290, w: 220, h: 20 },
      { x: 5700, y: 360, w: 210, h: 20 },

      // Sector 5: Kungsträdgården (6000 - 7500)
      { x: 6150, y: 360, w: 250, h: 20 },
      { x: 6480, y: 290, w: 270, h: 20 },
      { x: 6820, y: 240, w: 240, h: 20 },
      { x: 7150, y: 350, w: 200, h: 20 },

      // Sector 6: Metro Underground & Pit 3 (7500 - 9000)
      { x: 7600, y: 360, w: 250, h: 20 },
      { x: 7950, y: 280, w: 230, h: 20 },
      { x: 8400, y: 260, w: 220, h: 20 },
      { x: 8750, y: 350, w: 220, h: 20 },

      // Sector 7: Imperial Arsenal & Pit 4 (9000 - 10500)
      { x: 9150, y: 360, w: 260, h: 20 },
      { x: 9500, y: 280, w: 270, h: 20 },
      { x: 10050, y: 250, w: 230, h: 20 },
      { x: 10380, y: 350, w: 210, h: 20 },

      // Sector 8: Throne Room Arena (10500 - 12000)
      { x: 10750, y: 360, w: 260, h: 20 },
      { x: 11100, y: 280, w: 280, h: 20 },
      { x: 11480, y: 240, w: 240, h: 20 },
      { x: 11780, y: 350, w: 170, h: 20 }
    ]
  },

  visby: {
    id: 'visby',
    name: '🇸🇪 VISBY: COAST TO PIRATE KEEP (12,000PX)',
    bg: 'assets/visby.jpg',
    color: '#a855f7',
    weather: 'storm',
    width: 12000,
    bossSpawnX: 11200,
    hazardType: 'sea_spikes',
    hazardName: 'Baltic Sea Spiked Trench',
    checkpointX: 6000,
    sectors: [
      { id: 1, name: 'Baltic Coast Dune Beach & Rauks', startX: 0, endX: 1500, sky: '#18072b', tint: '#a855f7' },
      { id: 2, name: 'Viking Drakkar Coastal Assault', startX: 1500, endX: 3000, sky: '#1e0c38', tint: '#7c3aed' },
      { id: 3, name: 'Powder Tower Ringmur Fortifications', startX: 3000, endX: 4500, sky: '#24083d', tint: '#c084fc' },
      { id: 4, name: 'S:t Nicolai Cathedral Ruins (Checkpoint 🚩)', startX: 4500, endX: 6000, sky: '#150624', tint: '#e879f9' },
      { id: 5, name: 'Cursed Smuggler Catacombs', startX: 6000, endX: 7500, sky: '#0a0214', tint: '#818cf8' },
      { id: 6, name: 'Cliffside Coastal Battery & Rauks', startX: 7500, endX: 9000, sky: '#120521', tint: '#9333ea' },
      { id: 7, name: 'Ghost Galleon Mooring Docks', startX: 9000, endX: 10500, sky: '#0b0216', tint: '#6366f1' },
      { id: 8, name: 'Valdemar Ghost Ship Dread Galleon', startX: 10500, endX: 12000, sky: '#0d0217', tint: '#38bdf8' }
    ],
    movingPlatforms: [
      // Viking Drakkar Raft in Sector 2 (2050 - 2380)
      { x: 2100, y: 490, w: 170, h: 22, rangeX: 130, rangeY: 0, speed: 0.025, type: 'raft', color: '#a855f7' },
      // Catacomb Smuggler Raft in Sector 4 (5100 - 5500)
      { x: 5200, y: 440, w: 170, h: 22, rangeX: 140, rangeY: 30, speed: 0.022, type: 'raft', color: '#c084fc' },
      // Cliffside Rauk Rope Gondola in Sector 6 (8150 - 8550)
      { x: 8250, y: 490, w: 180, h: 22, rangeX: 150, rangeY: 0, speed: 0.026, type: 'raft', color: '#7c3aed' },
      // Ghost Ship Mooring Plank in Sector 7 (9850 - 10250)
      { x: 9950, y: 370, w: 150, h: 22, rangeX: 140, rangeY: 30, speed: 0.025, type: 'raft', color: '#38bdf8' }
    ],
    platforms: [
      // Segmented Viking Coastal Sand & Stone Cliffs with Spiked Trenches
      { x: 0, y: 490, w: 2050, h: 130 },      // Coast 1: Sector 1 & start of 2 (Trench: 2050 - 2380)
      { x: 2380, y: 490, w: 2720, h: 130 },   // Coast 2: Sector 2, 3 & start of 4 (Trench: 5100 - 5500)
      { x: 5500, y: 490, w: 2650, h: 130 },   // Coast 3: Checkpoint, Sector 5 & start of 6 (Trench: 8150 - 8550)
      { x: 8550, y: 490, w: 1300, h: 130 },   // Coast 4: Sector 6 & start of 7 (Trench: 9850 - 10250)
      { x: 10250, y: 490, w: 1750, h: 130 },  // Coast 5: Sector 7 & Sector 8 Dread Galleon Arena (10500 - 12000)

      // Sector 1: Beach (0 - 1500)
      { x: 280, y: 390, w: 210, h: 20 },
      { x: 620, y: 320, w: 230, h: 20 },
      { x: 960, y: 270, w: 200, h: 20 },
      { x: 1280, y: 360, w: 190, h: 20 },

      // Sector 2: Drakkar & Trench 1 (1500 - 3000)
      { x: 1650, y: 340, w: 240, h: 20 },
      { x: 1980, y: 260, w: 220, h: 20 },
      { x: 2480, y: 350, w: 220, h: 20 },
      { x: 2820, y: 270, w: 240, h: 20 },

      // Sector 3: Ringmur Walls (3000 - 4500)
      { x: 3150, y: 330, w: 250, h: 20 },
      { x: 3480, y: 250, w: 240, h: 20 },
      { x: 3820, y: 340, w: 230, h: 20 },
      { x: 4150, y: 260, w: 220, h: 20 },

      // Sector 4: Cathedral Ruins & Trench 2 (4500 - 6000)
      { x: 4550, y: 350, w: 250, h: 20 },
      { x: 4900, y: 280, w: 240, h: 20 },
      { x: 5350, y: 290, w: 220, h: 20 },
      { x: 5700, y: 360, w: 210, h: 20 },

      // Sector 5: Smuggler Catacombs (6000 - 7500)
      { x: 6150, y: 370, w: 250, h: 20 },
      { x: 6480, y: 300, w: 270, h: 20 },
      { x: 6820, y: 240, w: 240, h: 20 },
      { x: 7150, y: 360, w: 200, h: 20 },

      // Sector 6: Cliffside Rauks & Trench 3 (7500 - 9000)
      { x: 7600, y: 370, w: 250, h: 20 },
      { x: 7950, y: 290, w: 230, h: 20 },
      { x: 8400, y: 260, w: 220, h: 20 },
      { x: 8750, y: 350, w: 220, h: 20 },

      // Sector 7: Mooring Docks & Trench 4 (9000 - 10500)
      { x: 9150, y: 370, w: 260, h: 20 },
      { x: 9500, y: 290, w: 280, h: 20 },
      { x: 10050, y: 250, w: 230, h: 20 },
      { x: 10380, y: 360, w: 200, h: 20 },

      // Sector 8: Dread Galleon Arena (10500 - 12000)
      { x: 10750, y: 370, w: 260, h: 20 },
      { x: 11100, y: 290, w: 280, h: 20 },
      { x: 11480, y: 240, w: 240, h: 20 },
      { x: 11780, y: 360, w: 170, h: 20 }
    ]
  }
};
