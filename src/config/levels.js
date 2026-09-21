export const LEVELS = {
  goteborg: {
    id: 'goteborg',
    name: '🇸🇪 GÖTEBORG: COAST TO ABYSS',
    bg: 'assets/goteborg.jpg',
    color: '#00f0ff',
    weather: 'rain',
    width: 4800,
    bossSpawnX: 4150,
    sectors: [
      { id: 1, name: 'Harbor Sunset Pier', startX: 0, endX: 1200, sky: '#033c5e', tint: '#0284c7' },
      { id: 2, name: 'Eriksberg Crane Cargo Terminal', startX: 1200, endX: 2400, sky: '#0c2a4d', tint: '#00f0ff' },
      { id: 3, name: 'Submarine Heavy Drydock', startX: 2400, endX: 3600, sky: '#051d38', tint: '#38bdf8' },
      { id: 4, name: 'Sunken Abyssal Kraken Rig', startX: 3600, endX: 4800, sky: '#020b18', tint: '#ef4444' }
    ],
    platforms: [
      // Continuous Ground
      { x: 0, y: 490, w: 4800, h: 130 },

      // Sector 1: Harbor Sunset Pier (0 - 1200)
      { x: 220, y: 380, w: 190, h: 20 },
      { x: 500, y: 310, w: 210, h: 20 },
      { x: 780, y: 370, w: 180, h: 20 },
      { x: 1020, y: 290, w: 160, h: 20 },

      // Sector 2: Crane Cargo Yards (1200 - 2400)
      { x: 1300, y: 360, w: 230, h: 20 },
      { x: 1600, y: 280, w: 240, h: 20 },
      { x: 1920, y: 350, w: 200, h: 20 },
      { x: 2180, y: 270, w: 220, h: 20 },

      // Sector 3: Submarine Drydock (2400 - 3600)
      { x: 2500, y: 340, w: 240, h: 20 },
      { x: 2820, y: 260, w: 230, h: 20 },
      { x: 3120, y: 350, w: 220, h: 20 },
      { x: 3400, y: 280, w: 200, h: 20 },

      // Sector 4: Sunken Kraken Abyssal Rig (3600 - 4800)
      { x: 3720, y: 370, w: 230, h: 20 },
      { x: 4020, y: 300, w: 250, h: 20 },
      { x: 4340, y: 250, w: 220, h: 20 },
      { x: 4620, y: 360, w: 160, h: 20 }
    ]
  },

  kiruna: {
    id: 'kiruna',
    name: '🇸🇪 KIRUNA: TUNDRA TO CORE',
    bg: 'assets/kiruna.jpg',
    color: '#f97316',
    weather: 'snow',
    width: 4800,
    bossSpawnX: 4150,
    sectors: [
      { id: 1, name: 'Arctic Tundra Pass', startX: 0, endX: 1200, sky: '#1e293b', tint: '#94a3b8' },
      { id: 2, name: 'LKAB Mine Elevator Shafts', startX: 1200, endX: 2400, sky: '#331805', tint: '#d97706' },
      { id: 3, name: 'Molten Iron Smelting Foundry', startX: 2400, endX: 3600, sky: '#451005', tint: '#ea580c' },
      { id: 4, name: 'Permafrost Aurora Peak', startX: 3600, endX: 4800, sky: '#06283d', tint: '#67e8f9' }
    ],
    platforms: [
      { x: 0, y: 490, w: 4800, h: 130 },

      // Sector 1: Tundra (0 - 1200)
      { x: 200, y: 390, w: 200, h: 20 },
      { x: 480, y: 320, w: 210, h: 20 },
      { x: 760, y: 260, w: 190, h: 20 },
      { x: 1040, y: 360, w: 170, h: 20 },

      // Sector 2: Mine Elevators (1200 - 2400)
      { x: 1320, y: 340, w: 240, h: 20 },
      { x: 1620, y: 270, w: 220, h: 20 },
      { x: 1940, y: 350, w: 210, h: 20 },
      { x: 2200, y: 280, w: 220, h: 20 },

      // Sector 3: Smelting Foundry (2400 - 3600)
      { x: 2520, y: 330, w: 230, h: 20 },
      { x: 2820, y: 260, w: 240, h: 20 },
      { x: 3120, y: 340, w: 210, h: 20 },
      { x: 3420, y: 270, w: 220, h: 20 },

      // Sector 4: Malm-Jätte Arena (3600 - 4800)
      { x: 3740, y: 370, w: 240, h: 20 },
      { x: 4040, y: 290, w: 250, h: 20 },
      { x: 4360, y: 240, w: 220, h: 20 },
      { x: 4620, y: 350, w: 160, h: 20 }
    ]
  },

  stockholm: {
    id: 'stockholm',
    name: '🇸🇪 STOCKHOLM: OLD TOWN TO THRONE',
    bg: 'assets/stockholm.jpg',
    color: '#facc15',
    weather: 'sun',
    width: 4800,
    bossSpawnX: 4150,
    sectors: [
      { id: 1, name: 'Skeppsbron Waterfront Bridges', startX: 0, endX: 1200, sky: '#032b43', tint: '#38bdf8' },
      { id: 2, name: 'Medieval Gamla Stan Alleys', startX: 1200, endX: 2400, sky: '#291804', tint: '#f59e0b' },
      { id: 3, name: 'Stortorget Royal Courtyard', startX: 2400, endX: 3600, sky: '#3d2506', tint: '#facc15' },
      { id: 4, name: 'Golden Throne Steam Chamber', startX: 3600, endX: 4800, sky: '#421f05', tint: '#fbbf24' }
    ],
    platforms: [
      { x: 0, y: 490, w: 4800, h: 130 },

      // Sector 1: Skeppsbron (0 - 1200)
      { x: 220, y: 380, w: 210, h: 20 },
      { x: 500, y: 310, w: 220, h: 20 },
      { x: 780, y: 370, w: 200, h: 20 },
      { x: 1040, y: 290, w: 180, h: 20 },

      // Sector 2: Gamla Stan Alleys (1200 - 2400)
      { x: 1320, y: 350, w: 230, h: 20 },
      { x: 1620, y: 270, w: 240, h: 20 },
      { x: 1920, y: 360, w: 200, h: 20 },
      { x: 2200, y: 280, w: 220, h: 20 },

      // Sector 3: Stortorget (2400 - 3600)
      { x: 2500, y: 330, w: 240, h: 20 },
      { x: 2800, y: 250, w: 230, h: 20 },
      { x: 3100, y: 340, w: 220, h: 20 },
      { x: 3400, y: 270, w: 210, h: 20 },

      // Sector 4: Royal Palace Chamber (3600 - 4800)
      { x: 3720, y: 360, w: 240, h: 20 },
      { x: 4020, y: 290, w: 260, h: 20 },
      { x: 4340, y: 240, w: 230, h: 20 },
      { x: 4620, y: 350, w: 160, h: 20 }
    ]
  },

  visby: {
    id: 'visby',
    name: '🇸🇪 VISBY: COAST TO PIRATE KEEP',
    bg: 'assets/visby.jpg',
    color: '#a855f7',
    weather: 'storm',
    width: 4800,
    bossSpawnX: 4150,
    sectors: [
      { id: 1, name: 'Baltic Sea Dune Beach', startX: 0, endX: 1200, sky: '#18072b', tint: '#a855f7' },
      { id: 2, name: 'Powder Tower Ringmur Walls', startX: 1200, endX: 2400, sky: '#24083d', tint: '#c084fc' },
      { id: 3, name: 'St. Karin Church Cathedral Ruins', startX: 2400, endX: 3600, sky: '#150624', tint: '#e879f9' },
      { id: 4, name: 'Valdemar Cursed Pirate Keep', startX: 3600, endX: 4800, sky: '#0d0217', tint: '#38bdf8' }
    ],
    platforms: [
      { x: 0, y: 490, w: 4800, h: 130 },

      // Sector 1: Beach (0 - 1200)
      { x: 220, y: 390, w: 200, h: 20 },
      { x: 500, y: 320, w: 220, h: 20 },
      { x: 780, y: 270, w: 190, h: 20 },
      { x: 1040, y: 360, w: 180, h: 20 },

      // Sector 2: Ringmur Walls (1200 - 2400)
      { x: 1320, y: 340, w: 230, h: 20 },
      { x: 1620, y: 260, w: 240, h: 20 },
      { x: 1920, y: 350, w: 210, h: 20 },
      { x: 2200, y: 270, w: 230, h: 20 },

      // Sector 3: Cathedral Ruins (2400 - 3600)
      { x: 2500, y: 330, w: 240, h: 20 },
      { x: 2800, y: 250, w: 230, h: 20 },
      { x: 3100, y: 340, w: 220, h: 20 },
      { x: 3400, y: 260, w: 210, h: 20 },

      // Sector 4: Pirate Keep (3600 - 4800)
      { x: 3720, y: 370, w: 240, h: 20 },
      { x: 4020, y: 300, w: 260, h: 20 },
      { x: 4340, y: 240, w: 230, h: 20 },
      { x: 4620, y: 360, w: 160, h: 20 }
    ]
  }
};
