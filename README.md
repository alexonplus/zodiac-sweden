# 🇸🇪 ZODIAC SWEDEN: 12 CONSTELLATIONS

> A retro 16-bit arcade brawler featuring **all 12 Zodiac signs** battling across iconic Swedish cities (Gothenburg, Kiruna, Stockholm, Visby).

![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?logo=javascript&logoColor=black)
![HTML5 Canvas](https://img.shields.io/badge/HTML5-Canvas%2060FPS-E34F26?logo=html5&logoColor=white)
![Web Audio API](https://img.shields.io/badge/Audio-Web%20Audio%20API-blue)
![Architecture](https://img.shields.io/badge/Architecture-Clean%20ES6%20Modules-brightgreen)

---

## 🌟 Game Highlights

* **12 Playable Zodiac Guardians**: Each hero features custom procedural 16-bit pixel art, distinct weapons, headgear/horns, animated walk cycles, dynamic attack motion arcs, and unique skills.
* **1P Solo Campaign & 2P Local Co-Op Arcade**: Full single-keyboard co-op support with shared screen brawling.
* **Elemental Synergies**: Trigger devastating resonance combos by combining elements (*Scalding Steam*, *Ion Overload*, *Golden Supernova*, *Toxic Deflagration*, *Thermal Rift*, *Tectonic Bloom*, *Electro-Surge*).
* **Epic Swedish Bosses**: Multi-phase encounters with rage states (*Mekanisk Kran-Kraken*, *LKAB Malm-Jätte*, *Kungliga Ång-Gryfon*, *Valdemar Spöksjörövare*).
* **Authentic Swedish Lore**: Pixel art backgrounds, authentic weather particles (Lapland snow, Gotland storms), and relic drops (*Köttbullar*, *Surströmming*, *Fika*).
* **Procedural Sound Engine**: 100% zero-dependency retro audio synthesis via the Web Audio API.

---

## 🎮 Controls

| Action | Player 1 (P1 - WASD) | Player 2 (P2 - Arrows / Numpad) |
| :--- | :--- | :--- |
| **Movement** | `W` (Jump) / `A` (Left) / `D` (Right) | `↑` (Jump) / `←` (Left) / `→` (Right) |
| **Basic Attack** | `F` | `1` / `K` |
| **Skill 1 (Q)** | `G` | `2` / `L` |
| **Skill 2 (E)** | `H` | `3` / `O` |
| **Dash (Invulnerability)** | `Space` | `0` / `Right Shift` |
| **Ultimate Burst** | `T` | `4` / `P` |

---

## 🏛️ Modular Project Structure

```text
├── index.html                   # Semantic HTML entry point
├── assets/                      # 16-bit pixel art backgrounds
│   ├── goteborg.jpg
│   ├── kiruna.jpg
│   ├── stockholm.jpg
│   └── visby.jpg
├── css/
│   ├── style.css                # Canvas container & base layout
│   ├── hud.css                  # HUD, Health/RAM/ULT bars & Boss overlay
│   └── screens.css              # Menus, 12 Zodiac select grid & map
└── src/
    ├── main.js                  # Game loop, state manager & input dispatcher
    ├── config/
    │   ├── heroes.js            # Stats & attributes for all 12 Zodiac signs
    │   ├── levels.js            # Platform geometry, weather & city themes
    │   └── synergies.js         # Elemental combo lookup table
    ├── engine/
    │   ├── Audio.js             # Web Audio API procedural sound synthesizer
    │   ├── Physics.js           # 2D collision detection & platform logic
    │   └── Particles.js         # Sparks, motion trails & damage numbers
    ├── entities/
    │   ├── Player.js            # 12 unique character renderers & skills
    │   ├── Enemy.js             # AI mobs (Drones, Seagulls, Trolls, Näcken)
    │   ├── Bosses.js            # Epic bosses with Enraged Phase 2 states
    │   └── Relics.js            # Swedish relic pickups
    └── ui/
        ├── hud.js               # In-game HUD & Boss HP updates
        └── screens.js           # Character selection & menu screen logic
```

---

## 🚀 Running Locally

No bundlers or npm packages required:

```bash
# Clone the repository
git clone https://github.com/alexonplus/zodiac-sweden.git

# Serve with any static web server (e.g. Python)
cd zodiac-sweden
python -m http.server 8000
```
Open **`http://localhost:8000`** in your browser.

---

## 📄 License
MIT License. Created by [alexonplus](https://github.com/alexonplus).
