export const LEVELS = {
  goteborg: {
    id: 'goteborg',
    name: '🇸🇪 GÖTEBORG DOCKS & SHIPYARD',
    bg: 'assets/goteborg.jpg',
    color: '#00f0ff',
    weather: 'rain',
    width: 3200,
    bossSpawnX: 2550,
    platforms: [
      // Continuous Ground
      { x: 0, y: 490, w: 3200, h: 130 },
      // Zone 1: Harbor Port (0 - 800)
      { x: 220, y: 380, w: 180, h: 20 },
      { x: 480, y: 310, w: 200, h: 20 },
      { x: 740, y: 390, w: 160, h: 20 },
      // Zone 2: Container Cranes (800 - 1600)
      { x: 1020, y: 340, w: 220, h: 20 },
      { x: 1320, y: 270, w: 240, h: 20 },
      { x: 1620, y: 360, w: 190, h: 20 },
      // Zone 3: Eriksberg Drydock (1600 - 2400)
      { x: 1900, y: 310, w: 230, h: 20 },
      { x: 2180, y: 250, w: 210, h: 20 },
      // Zone 4: Kraken Arena (2400 - 3200)
      { x: 2480, y: 370, w: 220, h: 20 },
      { x: 2780, y: 310, w: 240, h: 20 },
      { x: 3040, y: 370, w: 140, h: 20 }
    ]
  },
  kiruna: {
    id: 'kiruna',
    name: '🇸🇪 KIRUNA LAPLAND MINES',
    bg: 'assets/kiruna.jpg',
    color: '#f97316',
    weather: 'snow',
    width: 3200,
    bossSpawnX: 2550,
    platforms: [
      { x: 0, y: 490, w: 3200, h: 130 },
      // Zone 1: Sub-zero Tundra (0 - 800)
      { x: 200, y: 390, w: 190, h: 20 },
      { x: 450, y: 330, w: 200, h: 20 },
      { x: 720, y: 270, w: 180, h: 20 },
      // Zone 2: LKAB Mine Elevators (800 - 1600)
      { x: 980, y: 360, w: 220, h: 20 },
      { x: 1260, y: 290, w: 210, h: 20 },
      { x: 1540, y: 350, w: 200, h: 20 },
      // Zone 3: Smelting Furnace (1600 - 2400)
      { x: 1820, y: 310, w: 230, h: 20 },
      { x: 2120, y: 260, w: 220, h: 20 },
      // Zone 4: Malm-Jätte Arena (2400 - 3200)
      { x: 2450, y: 370, w: 230, h: 20 },
      { x: 2750, y: 300, w: 240, h: 20 },
      { x: 3020, y: 360, w: 160, h: 20 }
    ]
  },
  stockholm: {
    id: 'stockholm',
    name: '🇸🇪 STOCKHOLM GAMLA STAN',
    bg: 'assets/stockholm.jpg',
    color: '#facc15',
    weather: 'sun',
    width: 3200,
    bossSpawnX: 2550,
    platforms: [
      { x: 0, y: 490, w: 3200, h: 130 },
      // Zone 1: Skeppsbron Waterfront (0 - 800)
      { x: 210, y: 380, w: 200, h: 20 },
      { x: 480, y: 310, w: 220, h: 20 },
      { x: 760, y: 370, w: 190, h: 20 },
      // Zone 2: Medieval Cobblestone Alleys (800 - 1600)
      { x: 1040, y: 330, w: 230, h: 20 },
      { x: 1340, y: 260, w: 220, h: 20 },
      { x: 1620, y: 350, w: 200, h: 20 },
      // Zone 3: Stortorget Square (1600 - 2400)
      { x: 1880, y: 300, w: 240, h: 20 },
      { x: 2180, y: 250, w: 210, h: 20 },
      // Zone 4: Royal Palace Courtyard (2400 - 3200)
      { x: 2470, y: 360, w: 220, h: 20 },
      { x: 2760, y: 300, w: 250, h: 20 },
      { x: 3040, y: 360, w: 140, h: 20 }
    ]
  },
  visby: {
    id: 'visby',
    name: '🇸🇪 VISBY RINGMUR WALLS',
    bg: 'assets/visby.jpg',
    color: '#a855f7',
    weather: 'storm',
    width: 3200,
    bossSpawnX: 2550,
    platforms: [
      { x: 0, y: 490, w: 3200, h: 130 },
      // Zone 1: Baltic Coast Beach (0 - 800)
      { x: 220, y: 390, w: 190, h: 20 },
      { x: 490, y: 330, w: 210, h: 20 },
      { x: 770, y: 280, w: 180, h: 20 },
      // Zone 2: Powder Tower Battlements (800 - 1600)
      { x: 1030, y: 350, w: 220, h: 20 },
      { x: 1310, y: 270, w: 230, h: 20 },
      { x: 1600, y: 360, w: 190, h: 20 },
      // Zone 3: St. Karin Church Ruins (1600 - 2400)
      { x: 1870, y: 300, w: 240, h: 20 },
      { x: 2170, y: 240, w: 220, h: 20 },
      // Zone 4: Pirate Fortress Keep (2400 - 3200)
      { x: 2460, y: 370, w: 230, h: 20 },
      { x: 2760, y: 310, w: 240, h: 20 },
      { x: 3040, y: 370, w: 140, h: 20 }
    ]
  }
};
