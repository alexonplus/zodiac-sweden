import { sound } from '../engine/Audio.js';
import { LEVELS } from '../config/levels.js';
import { HERO_CONFIGS } from '../config/heroes.js';

export const GOTEBORG_SUBLEVELS = [
  {
    id: 'goteborg-1',
    code: '1-1',
    title: 'ERIKSBERG SHIPYARDS & MARINA',
    subtitle: 'Harbor Infiltration & Drydock Cranes',
    district: 'Lilla Bommen & Eriksberg Docks',
    icon: '⚓',
    color: '#00f0ff',
    xPct: 18,
    yPct: 62,
    length: '7,500px (Full Sector)',
    difficulty: 'NORMAL',
    difficultyStars: '★☆☆☆',
    threat: 'Shipyard Syndicate Shock Guards',
    hazard: 'Electric Harbor Water & Canal Drops',
    vehicle: 'None (Docks Foot Infiltration)',
    bossName: 'Shipyard Syndicate Captain (Mini-Boss)',
    shardsReward: 35,
    lore: 'Infiltrate the historic Eriksberg drydocks where cyber-patrols guard the harbor canals across an expansive 7,500px shoreline. Navigate motorized ferry barges across hazardous electric waterways to secure the industrial perimeter.',
    objectives: [
      'Navigate ferry barges across 3 electric harbor canals',
      'Neutralize 24 Syndicate shock troopers across 3 sectors',
      'Defeat the Shipyard Syndicate Captain'
    ]
  },
  {
    id: 'goteborg-2',
    code: '1-2',
    title: 'BLUE TRAMWAY & LINDHOLMEN TECH',
    subtitle: 'Neon Transit & Cyber Science Park',
    district: 'Lindholmen Innovation Hub',
    icon: '⚡',
    color: '#38bdf8',
    xPct: 44,
    yPct: 38,
    length: '8,000px (Full Sector)',
    difficulty: 'CHALLENGING',
    difficultyStars: '★★☆☆',
    threat: 'Cyber-Golems & EMP Shock Troopers',
    hazard: 'High-Voltage Tramway Rails & Steam Vents',
    vehicle: '🛵 Dual Lindholmen Hover-Trikes Available!',
    bossName: 'Cyber-Golem Vanguard (Mini-Boss)',
    shardsReward: 45,
    lore: 'Battle across 8,000px of elevated Gothenburg Blue Tramway catenary beams into the neon-lit Lindholmen Science Park. Commandeer high-tech Hover-Trikes to smash through cyber-golem barricades.',
    objectives: [
      'Ride the Lindholmen Hover-Trike through enemy lines',
      'Disarm high-pressure steam updraft vents across viaducts',
      'Defeat the Cyber-Golem Vanguard & EMP mystics'
    ]
  },
  {
    id: 'goteborg-3',
    code: '1-3',
    title: 'SKANSEN KRONAN & FACTORY RUINS',
    subtitle: 'Hilltop Bastion to Heavy Assembly Lines',
    district: 'Haga Fortifications & Volvo Ruins',
    icon: '🏰',
    color: '#818cf8',
    xPct: 68,
    yPct: 58,
    length: '8,200px (Full Sector)',
    difficulty: 'HARD',
    difficultyStars: '★★★☆',
    threat: 'Steam Juggernauts & Bastion Defenders',
    hazard: 'Granite Bastion Traps & Conveyor Saws',
    vehicle: 'None (Vertical Climbing)',
    bossName: 'Bastion Steam Troll Berserker (Mini-Boss)',
    shardsReward: 55,
    lore: 'Ascend the steep cobblestone hillside toward the granite ramparts of Skansen Kronan fortress, then breach the abandoned Volvo heavy industrial factory across 8,200px of scrap conveyors and steam forges.',
    objectives: [
      'Ascend the Skansen Kronan watchtowers to the Golden Crown',
      'Navigate active industrial scrap conveyors and gear lifts',
      'Neutralize the Bastion Steam Troll Berserker'
    ]
  },
  {
    id: 'goteborg-4',
    code: '1-4',
    title: 'ÄLVSBORGSBRON TO ABYSSAL KRAKEN',
    subtitle: 'Sky Bridge Crossing & Climax Boss Arena',
    district: 'Älvsborgsbron & Outer Harbor Abyss',
    icon: '🐙',
    color: '#ef4444',
    xPct: 86,
    yPct: 30,
    length: '9,000px (Epic Titan Level)',
    difficulty: 'EXTREME (BOSS)',
    difficultyStars: '★★★★',
    threat: 'TITAN BOSS: MEKANISK KRAN-KRAKEN',
    hazard: 'Torrential Storm Waves & Abyssal Trenches',
    vehicle: 'None (True Heroic Duel)',
    bossName: '🐙 MEKANISK KRAN-KRAKEN (1,350 HP)',
    shardsReward: 100,
    lore: 'Traverse the 9,000px towering suspension cables of the Älvsborg Bridge amidst a ferocious storm. Descend into the deep sea arena for the ultimate battle against the Mekanisk Kran-Kraken!',
    objectives: [
      'Cross the suspension bridge towers in heavy storm',
      'Survive the abyssal trench platforming and sky-gondolas',
      'DEFEAT MEKANISK KRAN-KRAKEN & LIBERATE GÖTEBORG!'
    ]
  }
];

class CityMapManager {
  constructor() {
    this.currentCity = 'goteborg';
    this.selectedSubLevelId = 'goteborg-1';
    this.onDeployCallback = null;
    this.onBackCallback = null;
    this.unlockedKey = 'zodiac_goteborg_unlocked_sublevels';
    this.clearedKey = 'zodiac_goteborg_cleared_sublevels';
    this.scoresKey = 'zodiac_goteborg_scores';
    this.unlocked = ['goteborg-1'];
    this.cleared = {};
    this.scores = {};
    this.loadProgress();
  }

  loadProgress() {
    try {
      const u = localStorage.getItem(this.unlockedKey);
      if (u) this.unlocked = JSON.parse(u);
      if (!this.unlocked.includes('goteborg-1')) this.unlocked.push('goteborg-1');

      const c = localStorage.getItem(this.clearedKey);
      if (c) this.cleared = JSON.parse(c);

      const s = localStorage.getItem(this.scoresKey);
      if (s) this.scores = JSON.parse(s);
    } catch {
      this.unlocked = ['goteborg-1'];
      this.cleared = {};
      this.scores = {};
    }
  }

  saveProgress() {
    try {
      localStorage.setItem(this.unlockedKey, JSON.stringify(this.unlocked));
      localStorage.setItem(this.clearedKey, JSON.stringify(this.cleared));
      localStorage.setItem(this.scoresKey, JSON.stringify(this.scores));
    } catch {
      // LocalStorage fallback
    }
  }

  unlockSubLevel(subLevelId) {
    if (!this.unlocked.includes(subLevelId)) {
      this.unlocked.push(subLevelId);
      this.saveProgress();
    }
  }

  unlockAllForTesting() {
    GOTEBORG_SUBLEVELS.forEach(s => this.unlockSubLevel(s.id));
    this.render();
  }

  markCleared(subLevelId, score = 0) {
    this.cleared[subLevelId] = true;
    if (!this.scores[subLevelId] || score > this.scores[subLevelId]) {
      this.scores[subLevelId] = score;
    }

    // Auto unlock next sub-level
    const idx = GOTEBORG_SUBLEVELS.findIndex(s => s.id === subLevelId);
    if (idx !== -1 && idx + 1 < GOTEBORG_SUBLEVELS.length) {
      const nextId = GOTEBORG_SUBLEVELS[idx + 1].id;
      this.unlockSubLevel(nextId);
      this.selectedSubLevelId = nextId;
    }
    this.saveProgress();
  }

  isUnlocked(id) {
    return this.unlocked.includes(id);
  }

  isCleared(id) {
    return !!this.cleared[id];
  }

  getNextSubLevelId(currentId) {
    const idx = GOTEBORG_SUBLEVELS.findIndex(s => s.id === currentId);
    if (idx !== -1 && idx + 1 < GOTEBORG_SUBLEVELS.length) {
      return GOTEBORG_SUBLEVELS[idx + 1].id;
    }
    return null;
  }

  init(onDeploy, onBack, onCharSelect = null) {
    this.onDeployCallback = onDeploy;
    this.onBackCallback = onBack;
    this.onCharSelectCallback = onCharSelect;

    const deployBtn = document.getElementById('btn-deploy-sublevel');
    if (deployBtn) {
      deployBtn.addEventListener('click', () => {
        sound.init();
        sound.playHit();
        if (this.onDeployCallback) {
          this.onDeployCallback(this.selectedSubLevelId);
        }
      });
    }

    const charBtn = document.getElementById('btn-city-to-char');
    if (charBtn) {
      charBtn.addEventListener('click', () => {
        sound.init();
        sound.playSelect();
        if (this.onCharSelectCallback) this.onCharSelectCallback();
      });
    }

    const activeHeroBtn = document.getElementById('btn-goteborg-active-hero');
    if (activeHeroBtn) {
      activeHeroBtn.addEventListener('click', () => {
        sound.init();
        sound.playSelect();
        if (this.onCharSelectCallback) this.onCharSelectCallback();
      });
    }

    const backBtn = document.getElementById('btn-back-to-world-map');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        sound.init();
        sound.playSelect();
        if (this.onBackCallback) this.onBackCallback();
      });
    }

    // Quick Keyboard Navigation
    window.addEventListener('keydown', (e) => {
      const cityScreen = document.getElementById('screen-goteborg-map');
      if (!cityScreen || cityScreen.style.display !== 'flex') return;

      if (e.key >= '1' && e.key <= '4') {
        const idx = parseInt(e.key, 10) - 1;
        if (GOTEBORG_SUBLEVELS[idx]) {
          this.selectSubLevel(GOTEBORG_SUBLEVELS[idx].id);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (this.onDeployCallback) {
          sound.playHit();
          this.onDeployCallback(this.selectedSubLevelId);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (this.onBackCallback) {
          sound.playSelect();
          this.onBackCallback();
        }
      }
    });

    this.render();
  }

  show(targetSubLevelId = null) {
    if (targetSubLevelId && GOTEBORG_SUBLEVELS.some(s => s.id === targetSubLevelId)) {
      this.selectedSubLevelId = targetSubLevelId;
    } else {
      // Find first uncleared or default to 1-1
      const firstUncompleted = GOTEBORG_SUBLEVELS.find(s => !this.isCleared(s.id) && this.isUnlocked(s.id));
      this.selectedSubLevelId = firstUncompleted ? firstUncompleted.id : 'goteborg-1';
    }

    document.querySelectorAll('.screen-overlay').forEach(el => el.style.display = 'none');
    const screen = document.getElementById('screen-goteborg-map');
    if (screen) screen.style.display = 'flex';

    this.render();
  }

  selectSubLevel(id) {
    this.selectedSubLevelId = id;
    sound.init();
    sound.playSelect();
    this.render();
  }

  render() {
    const nodesContainer = document.getElementById('city-map-nodes');
    if (nodesContainer) {
      nodesContainer.innerHTML = '';

      GOTEBORG_SUBLEVELS.forEach((sub, idx) => {
        const unlocked = this.isUnlocked(sub.id);
        const cleared = this.isCleared(sub.id);
        const isSelected = sub.id === this.selectedSubLevelId;

        const node = document.createElement('div');
        node.className = `city-sublevel-node ${isSelected ? 'active' : ''} ${cleared ? 'cleared' : ''} ${!unlocked ? 'locked' : ''}`;
        node.style.left = `${sub.xPct}%`;
        node.style.top = `${sub.yPct}%`;
        node.setAttribute('data-id', sub.id);

        let statusBadge = '';
        if (cleared) {
          statusBadge = '<span class="node-status-badge badge-cleared">CLEARED ★★★</span>';
        } else if (unlocked) {
          statusBadge = `<span class="node-status-badge badge-ready">${sub.code === '1-4' ? 'BOSS' : 'READY'}</span>`;
        } else {
          statusBadge = '<span class="node-status-badge badge-locked">LOCKED 🔒</span>';
        }

        node.innerHTML = `
          <div class="node-pin" style="border-color: ${unlocked ? sub.color : '#475569'}; box-shadow: 0 0 16px ${unlocked ? sub.color : '#000000'};">
            <span class="node-icon">${sub.icon}</span>
            <span class="node-code-tag">${sub.code}</span>
          </div>
          <div class="node-info">
            <div class="node-title">${sub.title}</div>
            ${statusBadge}
          </div>
        `;

        node.addEventListener('click', () => {
          this.selectSubLevel(sub.id);
        });

        node.addEventListener('dblclick', () => {
          this.selectSubLevel(sub.id);
          if (this.onDeployCallback) {
            sound.playHit();
            this.onDeployCallback(this.selectedSubLevelId);
          }
        });

        nodesContainer.appendChild(node);
      });
    }

    this.renderDossier();
    this.updateProgressBadge();
  }

  renderDossier() {
    const sub = GOTEBORG_SUBLEVELS.find(s => s.id === this.selectedSubLevelId) || GOTEBORG_SUBLEVELS[0];
    const dossier = document.getElementById('goteborg-mission-dossier');
    if (!dossier) return;

    const unlocked = this.isUnlocked(sub.id);
    const cleared = this.isCleared(sub.id);
    const score = this.scores[sub.id] || 0;

    let statusPill = '';
    if (cleared) {
      statusPill = `<span class="dossier-pill pill-cleared">✅ LIBERATED (SCORE: ${score})</span>`;
    } else if (unlocked) {
      statusPill = `<span class="dossier-pill pill-unlocked">⚡ READY FOR DEPLOYMENT</span>`;
    } else {
      statusPill = `<span class="dossier-pill pill-locked">🔒 COMPLETE PREVIOUS SECTOR TO UNLOCK</span>`;
    }

    dossier.innerHTML = `
      <div class="dossier-header">
        <div class="dossier-sector-tag" style="color: ${sub.color}; border-color: ${sub.color};">
          SECTOR ${sub.code} • ${sub.district.toUpperCase()}
        </div>
        ${statusPill}
      </div>

      <div class="dossier-title-row">
        <div class="dossier-title" style="color: ${sub.color};">
          <span style="font-size: 20px;">${sub.icon}</span> ${sub.title}
        </div>
        <div class="dossier-sub">${sub.subtitle}</div>
      </div>

      <!-- Tactical Background Environment Preview -->
      <div style="position: relative; width: 100%; height: 95px; border-radius: 6px; overflow: hidden; margin: 8px 0 10px 0; border: 1.5px solid ${sub.color}88; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
        <img src="assets/goteborg_${sub.code.split('-')[1]}.svg" style="width: 100%; height: 100%; object-fit: cover;" alt="${sub.title}" />
        <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 4px 8px; background: linear-gradient(transparent, rgba(15, 23, 42, 0.95)); display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 9px; font-weight: 800; color: ${sub.color}; letter-spacing: 0.5px;">📸 SECTOR BACKDROP: ${sub.district.toUpperCase()}</span>
          <span style="font-size: 8.5px; color: #94a3b8;">16:9 VECTOR ART</span>
        </div>
      </div>

      <div class="dossier-lore">${sub.lore}</div>

      <div class="dossier-grid">
        <div class="dossier-item">
          <span class="d-label">DIFFICULTY:</span>
          <span class="d-val" style="color: #facc15;">${sub.difficulty} ${sub.difficultyStars}</span>
        </div>
        <div class="dossier-item">
          <span class="d-label">SECTOR LENGTH:</span>
          <span class="d-val">${sub.length}</span>
        </div>
        <div class="dossier-item">
          <span class="d-label">PRIMARY THREAT:</span>
          <span class="d-val" style="color: #ef4444;">${sub.threat}</span>
        </div>
        <div class="dossier-item">
          <span class="d-label">ENVIRONMENT HAZARD:</span>
          <span class="d-val" style="color: #38bdf8;">${sub.hazard}</span>
        </div>
        <div class="dossier-item" style="grid-column: 1 / -1;">
          <span class="d-label">TACTICAL VEHICLE:</span>
          <span class="d-val" style="color: #4ade80;">${sub.vehicle}</span>
        </div>
      </div>

      <div class="dossier-objectives-box">
        <div class="d-obj-title">TACTICAL OBJECTIVES:</div>
        <ul class="d-obj-list">
          ${sub.objectives.map(o => `<li>🔹 ${o}</li>`).join('')}
        </ul>
      </div>

      <div class="dossier-rewards-row">
        <span>🏆 LIBERATION REWARD: <b>+${sub.shardsReward} ⭐ STAR SHARDS</b></span>
        <span style="color: #94a3b8; font-size: 10px;">HOTKEY: [${sub.code.split('-')[1]}]</span>
      </div>
    `;

    const deployBtn = document.getElementById('btn-deploy-sublevel');
    if (deployBtn) {
      if (!unlocked) {
        deployBtn.innerHTML = `🔒 SECTOR LOCKED [COMPLETE PREVIOUS]`;
        deployBtn.style.opacity = '0.5';
        deployBtn.style.pointerEvents = 'none';
      } else {
        deployBtn.innerHTML = `⚔️ DEPLOY TO ${sub.code}: ${sub.title.split('&')[0].trim()} [ENTER] ⚔️`;
        deployBtn.style.opacity = '1';
        deployBtn.style.pointerEvents = 'auto';
      }
    }
  }

  updateProgressBadge() {
    const badge = document.getElementById('goteborg-liberation-progress');
    if (badge) {
      const clearedCount = GOTEBORG_SUBLEVELS.filter(s => this.isCleared(s.id)).length;
      const pct = Math.round((clearedCount / GOTEBORG_SUBLEVELS.length) * 100);
      badge.innerHTML = `🇸🇪 GÖTEBORG LIBERATION: <b>${clearedCount} / ${GOTEBORG_SUBLEVELS.length} SUB-LEVELS CLEARED (${pct}%)</b>`;
    }

    const heroLabel = document.getElementById('goteborg-hero-label');
    if (heroLabel && window.currentGameManager) {
      const h = HERO_CONFIGS[window.currentGameManager.p1HeroId];
      if (h) {
        heroLabel.innerText = `${h.symbol} ${h.name.toUpperCase()}`;
        heroLabel.style.color = h.color;
      }
    }
  }
}

export const cityMapManager = new CityMapManager();
