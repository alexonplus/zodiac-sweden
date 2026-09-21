export const LEVELS = {
  goteborg: {
    id: 'goteborg',
    name: '🇸🇪 GÖTEBORG: HARBOR TO ABYSS',
    bg: 'assets/goteborg.jpg',
    color: '#00f0ff',
    weather: 'rain',
    width: 6400,
    bossSpawnX: 5700,
    sectors: [
      { id: 1, name: 'Lilla Bommen Sunset Marina', startX: 0, endX: 1300, sky: '#033c5e', tint: '#0284c7' },
      { id: 2, name: 'Eriksberg Heavy Crane Terminals', startX: 1300, endX: 2600, sky: '#0c2a4d', tint: '#00f0ff' },
      { id: 3, name: 'Lindholmen High-Tech Neon District', startX: 2600, endX: 3900, sky: '#051d38', tint: '#38bdf8' },
      { id: 4, name: 'Skansen Kronan Fortified Ascent', startX: 3900, endX: 5200, sky: '#081726', tint: '#818cf8' },
      { id: 5, name: 'Älvsborgsbron Abyssal Arena', startX: 5200, endX: 6400, sky: '#020b18', tint: '#ef4444' }
    ],
    platforms: [
      // Continuous Ground Floor
      { x: 0, y: 490, w: 6400, h: 130 },

      // Sector 1: Lilla Bommen (0 - 1300)
      { x: 220, y: 380, w: 200, h: 20 },
      { x: 520, y: 310, w: 220, h: 20 },
      { x: 820, y: 370, w: 190, h: 20 },
      { x: 1080, y: 290, w: 170, h: 20 },

      // Sector 2: Eriksberg Heavy Crane (1300 - 2600)
      { x: 1400, y: 360, w: 240, h: 20 },
      { x: 1720, y: 280, w: 250, h: 20 },
      { x: 2040, y: 350, w: 220, h: 20 },
      { x: 2320, y: 270, w: 230, h: 20 },

      // Sector 3: Lindholmen High-Tech (2600 - 3900)
      { x: 2700, y: 340, w: 250, h: 20 },
      { x: 3020, y: 260, w: 240, h: 20 },
      { x: 3340, y: 350, w: 230, h: 20 },
      { x: 3620, y: 280, w: 210, h: 20 },

      // Sector 4: Skansen Kronan (3900 - 5200)
      { x: 4000, y: 360, w: 240, h: 20 },
      { x: 4320, y: 290, w: 260, h: 20 },
      { x: 4640, y: 240, w: 230, h: 20 },
      { x: 4920, y: 350, w: 180, h: 20 },

      // Sector 5: Älvsborgsbron Abyssal Arena (5200 - 6400)
      { x: 5350, y: 370, w: 260, h: 20 },
      { x: 5680, y: 290, w: 280, h: 20 },
      { x: 6020, y: 250, w: 240, h: 20 },
      { x: 6240, y: 360, w: 140, h: 20 }
    ]
  },

  kiruna: {
    id: 'kiruna',
    name: '🇸🇪 KIRUNA: TUNDRA TO CORE',
    bg: 'assets/kiruna.jpg',
    color: '#f97316',
    weather: 'snow',
    width: 6400,
    bossSpawnX: 5700,
    sectors: [
      { id: 1, name: 'Arctic Tundra Blizzard Highway', startX: 0, endX: 1300, sky: '#1e293b', tint: '#94a3b8' },
      { id: 2, name: 'LKAB Mine Shaft Sub-level (-700m)', startX: 1300, endX: 2600, sky: '#331805', tint: '#d97706' },
      { id: 3, name: 'Molten Iron Blast Foundry', startX: 2600, endX: 3900, sky: '#451005', tint: '#ea580c' },
      { id: 4, name: 'Kebnekaise Glacial Ridge', startX: 3900, endX: 5200, sky: '#06283d', tint: '#67e8f9' },
      { id: 5, name: 'Aurora Borealis Sanctuary', startX: 5200, endX: 6400, sky: '#02182b', tint: '#a855f7' }
    ],
    platforms: [
      { x: 0, y: 490, w: 6400, h: 130 },

      // Sector 1: Tundra (0 - 1300)
      { x: 220, y: 390, w: 210, h: 20 },
      { x: 520, y: 320, w: 220, h: 20 },
      { x: 820, y: 260, w: 200, h: 20 },
      { x: 1080, y: 360, w: 180, h: 20 },

      // Sector 2: Mine Shaft (1300 - 2600)
      { x: 1420, y: 340, w: 250, h: 20 },
      { x: 1740, y: 270, w: 230, h: 20 },
      { x: 2060, y: 350, w: 220, h: 20 },
      { x: 2340, y: 280, w: 230, h: 20 },

      // Sector 3: Blast Foundry (2600 - 3900)
      { x: 2720, y: 330, w: 240, h: 20 },
      { x: 3040, y: 260, w: 250, h: 20 },
      { x: 3360, y: 340, w: 220, h: 20 },
      { x: 3640, y: 270, w: 230, h: 20 },

      // Sector 4: Glacial Ridge (3900 - 5200)
      { x: 4020, y: 370, w: 250, h: 20 },
      { x: 4340, y: 290, w: 260, h: 20 },
      { x: 4660, y: 240, w: 230, h: 20 },
      { x: 4940, y: 350, w: 180, h: 20 },

      // Sector 5: Aurora Sanctuary Arena (5200 - 6400)
      { x: 5360, y: 360, w: 260, h: 20 },
      { x: 5680, y: 280, w: 280, h: 20 },
      { x: 6020, y: 240, w: 240, h: 20 },
      { x: 6240, y: 350, w: 140, h: 20 }
    ]
  },

  stockholm: {
    id: 'stockholm',
    name: '🇸🇪 STOCKHOLM: OLD TOWN TO THRONE',
    bg: 'assets/stockholm.jpg',
    color: '#facc15',
    weather: 'sun',
    width: 6400,
    bossSpawnX: 5700,
    sectors: [
      { id: 1, name: 'Skeppsbron Waterfront Bridges', startX: 0, endX: 1300, sky: '#032b43', tint: '#38bdf8' },
      { id: 2, name: 'Medieval Gamla Stan Alleys', startX: 1300, endX: 2600, sky: '#291804', tint: '#f59e0b' },
      { id: 3, name: 'Riddarholmen Clockwork Bell Towers', startX: 2600, endX: 3900, sky: '#3d2506', tint: '#facc15' },
      { id: 4, name: 'Kungsträdgården Royal Gardens', startX: 3900, endX: 5200, sky: '#361502', tint: '#fb923c' },
      { id: 5, name: 'Tre Kronor Imperial Throne Room', startX: 5200, endX: 6400, sky: '#421f05', tint: '#fbbf24' }
    ],
    platforms: [
      { x: 0, y: 490, w: 6400, h: 130 },

      // Sector 1: Skeppsbron (0 - 1300)
      { x: 220, y: 380, w: 220, h: 20 },
      { x: 520, y: 310, w: 230, h: 20 },
      { x: 820, y: 370, w: 210, h: 20 },
      { x: 1080, y: 290, w: 190, h: 20 },

      // Sector 2: Gamla Stan (1300 - 2600)
      { x: 1420, y: 350, w: 240, h: 20 },
      { x: 1740, y: 270, w: 250, h: 20 },
      { x: 2060, y: 360, w: 220, h: 20 },
      { x: 2340, y: 280, w: 230, h: 20 },

      // Sector 3: Riddarholmen (2600 - 3900)
      { x: 2720, y: 330, w: 250, h: 20 },
      { x: 3040, y: 250, w: 240, h: 20 },
      { x: 3360, y: 340, w: 230, h: 20 },
      { x: 3640, y: 270, w: 220, h: 20 },

      // Sector 4: Kungsträdgården (3900 - 5200)
      { x: 4020, y: 360, w: 250, h: 20 },
      { x: 4340, y: 290, w: 270, h: 20 },
      { x: 4660, y: 240, w: 240, h: 20 },
      { x: 4940, y: 350, w: 180, h: 20 },

      // Sector 5: Throne Room Arena (5200 - 6400)
      { x: 5360, y: 360, w: 260, h: 20 },
      { x: 5680, y: 280, w: 280, h: 20 },
      { x: 6020, y: 240, w: 240, h: 20 },
      { x: 6240, y: 350, w: 140, h: 20 }
    ]
  },

  visby: {
    id: 'visby',
    name: '🇸🇪 VISBY: COAST TO PIRATE KEEP',
    bg: 'assets/visby.jpg',
    color: '#a855f7',
    weather: 'storm',
    width: 6400,
    bossSpawnX: 5700,
    sectors: [
      { id: 1, name: 'Baltic Coast Dune Beach & Rauks', startX: 0, endX: 1300, sky: '#18072b', tint: '#a855f7' },
      { id: 2, name: 'Powder Tower Ringmur Fortifications', startX: 1300, endX: 2600, sky: '#24083d', tint: '#c084fc' },
      { id: 3, name: 'S:t Nicolai Cathedral Gothic Ruins', startX: 2600, endX: 3900, sky: '#150624', tint: '#e879f9' },
      { id: 4, name: 'Cursed Smuggler Catacombs', startX: 3900, endX: 5200, sky: '#0a0214', tint: '#818cf8' },
      { id: 5, name: 'Valdemar Ghost Ship Dread Galleon', startX: 5200, endX: 6400, sky: '#0d0217', tint: '#38bdf8' }
    ],
    platforms: [
      { x: 0, y: 490, w: 6400, h: 130 },

      // Sector 1: Beach (0 - 1300)
      { x: 220, y: 390, w: 210, h: 20 },
      { x: 520, y: 320, w: 230, h: 20 },
      { x: 820, y: 270, w: 200, h: 20 },
      { x: 1080, y: 360, w: 190, h: 20 },

      // Sector 2: Ringmur Walls (1300 - 2600)
      { x: 1420, y: 340, w: 240, h: 20 },
      { x: 1740, y: 260, w: 250, h: 20 },
      { x: 2060, y: 350, w: 220, h: 20 },
      { x: 2340, y: 270, w: 240, h: 20 },

      // Sector 3: Cathedral Ruins (2600 - 3900)
      { x: 2720, y: 330, w: 250, h: 20 },
      { x: 3040, y: 250, w: 240, h: 20 },
      { x: 3360, y: 340, w: 230, h: 20 },
      { x: 3640, y: 260, w: 220, h: 20 },

      // Sector 4: Smuggler Catacombs (3900 - 5200)
      { x: 4020, y: 370, w: 250, h: 20 },
      { x: 4340, y: 300, w: 270, h: 20 },
      { x: 4660, y: 240, w: 240, h: 20 },
      { x: 4940, y: 360, w: 180, h: 20 },

      // Sector 5: Dread Galleon Arena (5200 - 6400)
      { x: 5360, y: 370, w: 260, h: 20 },
      { x: 5680, y: 290, w: 280, h: 20 },
      { x: 6020, y: 240, w: 240, h: 20 },
      { x: 6240, y: 360, w: 140, h: 20 }
    ]
  }
};
