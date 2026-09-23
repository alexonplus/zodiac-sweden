export const LEVELS = {
  goteborg: {
    id: 'goteborg',
    name: '🇸🇪 GÖTEBORG: HARBOR TO ABYSS',
    bg: 'assets/goteborg.jpg',
    color: '#00f0ff',
    weather: 'rain',
    width: 8000,
    bossSpawnX: 7300,
    sectors: [
      { id: 1, name: 'Lilla Bommen Sunset Marina', startX: 0, endX: 1350, sky: '#033c5e', tint: '#0284c7' },
      { id: 2, name: 'Eriksberg Heavy Crane Terminals', startX: 1350, endX: 2700, sky: '#0c2a4d', tint: '#00f0ff' },
      { id: 3, name: 'Gothenburg Blue Tramway Junction', startX: 2700, endX: 4050, sky: '#082544', tint: '#38bdf8' },
      { id: 4, name: 'Lindholmen High-Tech Neon Port', startX: 4050, endX: 5400, sky: '#051d38', tint: '#818cf8' },
      { id: 5, name: 'Skansen Kronan Fortified Ascent', startX: 5400, endX: 6750, sky: '#081726', tint: '#6366f1' },
      { id: 6, name: 'Älvsborgsbron Abyssal Arena', startX: 6750, endX: 8000, sky: '#020b18', tint: '#ef4444' }
    ],
    platforms: [
      // Continuous Ground Floor across 8000px
      { x: 0, y: 490, w: 8000, h: 130 },

      // Sector 1: Lilla Bommen (0 - 1350)
      { x: 220, y: 380, w: 200, h: 20 },
      { x: 520, y: 310, w: 220, h: 20 },
      { x: 820, y: 370, w: 190, h: 20 },
      { x: 1080, y: 290, w: 170, h: 20 },

      // Sector 2: Eriksberg Heavy Cranes (1350 - 2700)
      { x: 1450, y: 360, w: 240, h: 20 },
      { x: 1780, y: 280, w: 250, h: 20 },
      { x: 2100, y: 350, w: 220, h: 20 },
      { x: 2420, y: 270, w: 230, h: 20 },

      // Sector 3: Blue Tramway Junction (2700 - 4050)
      { x: 2800, y: 340, w: 250, h: 20 },
      { x: 3120, y: 260, w: 240, h: 20 },
      { x: 3450, y: 350, w: 230, h: 20 },
      { x: 3780, y: 280, w: 210, h: 20 },

      // Sector 4: Lindholmen High-Tech (4050 - 5400)
      { x: 4150, y: 360, w: 240, h: 20 },
      { x: 4480, y: 290, w: 260, h: 20 },
      { x: 4800, y: 240, w: 230, h: 20 },
      { x: 5120, y: 350, w: 180, h: 20 },

      // Sector 5: Skansen Kronan Ascent (5400 - 6750)
      { x: 5500, y: 360, w: 250, h: 20 },
      { x: 5820, y: 280, w: 270, h: 20 },
      { x: 6150, y: 240, w: 240, h: 20 },
      { x: 6480, y: 350, w: 190, h: 20 },

      // Sector 6: Älvsborgsbron Abyssal Arena (6750 - 8000)
      { x: 6900, y: 370, w: 260, h: 20 },
      { x: 7250, y: 290, w: 280, h: 20 },
      { x: 7600, y: 240, w: 240, h: 20 },
      { x: 7820, y: 360, w: 140, h: 20 }
    ]
  },

  kiruna: {
    id: 'kiruna',
    name: '🇸🇪 KIRUNA: TUNDRA TO CORE',
    bg: 'assets/kiruna.jpg',
    color: '#f97316',
    weather: 'snow',
    width: 8000,
    bossSpawnX: 7300,
    sectors: [
      { id: 1, name: 'Arctic Tundra Blizzard Highway', startX: 0, endX: 1350, sky: '#1e293b', tint: '#94a3b8' },
      { id: 2, name: 'Snowmobile Elk Trail', startX: 1350, endX: 2700, sky: '#172554', tint: '#60a5fa' },
      { id: 3, name: 'LKAB Mine Shaft Sub-level (-700m)', startX: 2700, endX: 4050, sky: '#331805', tint: '#d97706' },
      { id: 4, name: 'Molten Iron Blast Foundry', startX: 4050, endX: 5400, sky: '#451005', tint: '#ea580c' },
      { id: 5, name: 'Kebnekaise Glacial Ridge', startX: 5400, endX: 6750, sky: '#06283d', tint: '#67e8f9' },
      { id: 6, name: 'Aurora Borealis Sanctuary Arena', startX: 6750, endX: 8000, sky: '#02182b', tint: '#a855f7' }
    ],
    platforms: [
      { x: 0, y: 490, w: 8000, h: 130 },

      // Sector 1: Tundra (0 - 1350)
      { x: 220, y: 390, w: 210, h: 20 },
      { x: 520, y: 320, w: 220, h: 20 },
      { x: 820, y: 260, w: 200, h: 20 },
      { x: 1080, y: 360, w: 180, h: 20 },

      // Sector 2: Snowmobile Trail (1350 - 2700)
      { x: 1450, y: 350, w: 240, h: 20 },
      { x: 1780, y: 270, w: 230, h: 20 },
      { x: 2100, y: 350, w: 220, h: 20 },
      { x: 2420, y: 280, w: 230, h: 20 },

      // Sector 3: Mine Shaft (2700 - 4050)
      { x: 2800, y: 330, w: 240, h: 20 },
      { x: 3120, y: 260, w: 250, h: 20 },
      { x: 3450, y: 340, w: 220, h: 20 },
      { x: 3780, y: 270, w: 230, h: 20 },

      // Sector 4: Blast Foundry (4050 - 5400)
      { x: 4150, y: 340, w: 250, h: 20 },
      { x: 4480, y: 260, w: 240, h: 20 },
      { x: 4800, y: 330, w: 230, h: 20 },
      { x: 5120, y: 260, w: 210, h: 20 },

      // Sector 5: Glacial Ridge (5400 - 6750)
      { x: 5500, y: 370, w: 250, h: 20 },
      { x: 5820, y: 290, w: 270, h: 20 },
      { x: 6150, y: 240, w: 240, h: 20 },
      { x: 6480, y: 350, w: 180, h: 20 },

      // Sector 6: Aurora Sanctuary (6750 - 8000)
      { x: 6900, y: 360, w: 260, h: 20 },
      { x: 7250, y: 280, w: 280, h: 20 },
      { x: 7600, y: 240, w: 240, h: 20 },
      { x: 7820, y: 350, w: 140, h: 20 }
    ]
  },

  stockholm: {
    id: 'stockholm',
    name: '🇸🇪 STOCKHOLM: OLD TOWN TO THRONE',
    bg: 'assets/stockholm.jpg',
    color: '#facc15',
    weather: 'sun',
    width: 8000,
    bossSpawnX: 7300,
    sectors: [
      { id: 1, name: 'Skeppsbron Waterfront Bridges', startX: 0, endX: 1350, sky: '#032b43', tint: '#38bdf8' },
      { id: 2, name: 'Royal Steampunk Chariot Run', startX: 1350, endX: 2700, sky: '#2d1804', tint: '#fb923c' },
      { id: 3, name: 'Medieval Gamla Stan Alleys', startX: 2700, endX: 4050, sky: '#291804', tint: '#f59e0b' },
      { id: 4, name: 'Riddarholmen Clockwork Towers', startX: 4050, endX: 5400, sky: '#3d2506', tint: '#facc15' },
      { id: 5, name: 'Kungsträdgården Royal Gardens', startX: 5400, endX: 6750, sky: '#361502', tint: '#fb923c' },
      { id: 6, name: 'Tre Kronor Imperial Throne Room', startX: 6750, endX: 8000, sky: '#421f05', tint: '#fbbf24' }
    ],
    platforms: [
      { x: 0, y: 490, w: 8000, h: 130 },

      // Sector 1: Skeppsbron (0 - 1350)
      { x: 220, y: 380, w: 220, h: 20 },
      { x: 520, y: 310, w: 230, h: 20 },
      { x: 820, y: 370, w: 210, h: 20 },
      { x: 1080, y: 290, w: 190, h: 20 },

      // Sector 2: Chariot Run (1350 - 2700)
      { x: 1450, y: 350, w: 240, h: 20 },
      { x: 1780, y: 270, w: 250, h: 20 },
      { x: 2100, y: 360, w: 220, h: 20 },
      { x: 2420, y: 280, w: 230, h: 20 },

      // Sector 3: Gamla Stan (2700 - 4050)
      { x: 2800, y: 330, w: 250, h: 20 },
      { x: 3120, y: 250, w: 240, h: 20 },
      { x: 3450, y: 340, w: 230, h: 20 },
      { x: 3780, y: 270, w: 220, h: 20 },

      // Sector 4: Riddarholmen (4050 - 5400)
      { x: 4150, y: 350, w: 240, h: 20 },
      { x: 4480, y: 270, w: 260, h: 20 },
      { x: 4800, y: 330, w: 230, h: 20 },
      { x: 5120, y: 260, w: 220, h: 20 },

      // Sector 5: Kungsträdgården (5400 - 6750)
      { x: 5500, y: 360, w: 250, h: 20 },
      { x: 5820, y: 290, w: 270, h: 20 },
      { x: 6150, y: 240, w: 240, h: 20 },
      { x: 6480, y: 350, w: 180, h: 20 },

      // Sector 6: Throne Room Arena (6750 - 8000)
      { x: 6900, y: 360, w: 260, h: 20 },
      { x: 7250, y: 280, w: 280, h: 20 },
      { x: 7600, y: 240, w: 240, h: 20 },
      { x: 7820, y: 350, w: 140, h: 20 }
    ]
  },

  visby: {
    id: 'visby',
    name: '🇸🇪 VISBY: COAST TO PIRATE KEEP',
    bg: 'assets/visby.jpg',
    color: '#a855f7',
    weather: 'storm',
    width: 8000,
    bossSpawnX: 7300,
    sectors: [
      { id: 1, name: 'Baltic Coast Dune Beach & Rauks', startX: 0, endX: 1350, sky: '#18072b', tint: '#a855f7' },
      { id: 2, name: 'Viking Drakkar Coastal Assault', startX: 1350, endX: 2700, sky: '#1e0c38', tint: '#7c3aed' },
      { id: 3, name: 'Powder Tower Ringmur Fortifications', startX: 2700, endX: 4050, sky: '#24083d', tint: '#c084fc' },
      { id: 4, name: 'S:t Nicolai Cathedral Gothic Ruins', startX: 4050, endX: 5400, sky: '#150624', tint: '#e879f9' },
      { id: 5, name: 'Cursed Smuggler Catacombs', startX: 5400, endX: 6750, sky: '#0a0214', tint: '#818cf8' },
      { id: 6, name: 'Valdemar Ghost Ship Dread Galleon', startX: 6750, endX: 8000, sky: '#0d0217', tint: '#38bdf8' }
    ],
    platforms: [
      { x: 0, y: 490, w: 8000, h: 130 },

      // Sector 1: Beach (0 - 1350)
      { x: 220, y: 390, w: 210, h: 20 },
      { x: 520, y: 320, w: 230, h: 20 },
      { x: 820, y: 270, w: 200, h: 20 },
      { x: 1080, y: 360, w: 190, h: 20 },

      // Sector 2: Drakkar Assault (1350 - 2700)
      { x: 1450, y: 340, w: 240, h: 20 },
      { x: 1780, y: 260, w: 250, h: 20 },
      { x: 2100, y: 350, w: 220, h: 20 },
      { x: 2420, y: 270, w: 240, h: 20 },

      // Sector 3: Ringmur Walls (2700 - 4050)
      { x: 2800, y: 330, w: 250, h: 20 },
      { x: 3120, y: 250, w: 240, h: 20 },
      { x: 3450, y: 340, w: 230, h: 20 },
      { x: 3780, y: 260, w: 220, h: 20 },

      // Sector 4: Cathedral Ruins (4050 - 5400)
      { x: 4150, y: 350, w: 250, h: 20 },
      { x: 4480, y: 280, w: 240, h: 20 },
      { x: 4800, y: 340, w: 230, h: 20 },
      { x: 5120, y: 270, w: 220, h: 20 },

      // Sector 5: Smuggler Catacombs (5400 - 6750)
      { x: 5500, y: 370, w: 250, h: 20 },
      { x: 5820, y: 300, w: 270, h: 20 },
      { x: 6150, y: 240, w: 240, h: 20 },
      { x: 6480, y: 360, w: 180, h: 20 },

      // Sector 6: Dread Galleon Arena (6750 - 8000)
      { x: 6900, y: 370, w: 260, h: 20 },
      { x: 7250, y: 290, w: 280, h: 20 },
      { x: 7600, y: 240, w: 240, h: 20 },
      { x: 7820, y: 360, w: 140, h: 20 }
    ]
  }
};
