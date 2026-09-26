import { HERO_CONFIGS } from './config/heroes.js';
import { LEVELS } from './config/levels.js';
import { SYNERGIES } from './config/synergies.js';
import { Camera } from './engine/Camera.js';
import { sound } from './engine/Audio.js';
import { particles } from './engine/Particles.js';
import { checkRectCollision } from './engine/Physics.js';
import { relicManager } from './entities/Relics.js';
import { destructibleManager } from './entities/Destructibles.js';
import { buffManager } from './entities/Powerups.js';
import { sceneryManager } from './entities/Scenery.js';
import { vehicleManager } from './entities/Vehicles.js';
import { movingPlatformManager } from './entities/MovingPlatforms.js';
import { synergyUltManager } from './entities/SynergyUlt.js';
import { miniGameManager } from './entities/MiniGames.js';
import { shopManager } from './entities/Shop.js';
import { populateShopUI } from './ui/ShopUI.js';
import { PlayerEntity } from './entities/Player.js';
import { EnemyMob } from './entities/Enemy.js';
import { BossEntity, createBoss, BaseBoss } from './entities/Bosses.js';
import { hudManager } from './ui/hud.js';
import { populateZodiacGrid, refreshSelectionUI } from './ui/screens.js';

/* ================= CANVAS SETUP ================= */
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

/* ================= GAME STATE ================= */
export class GameManager {
  constructor() {
    this.isPlaying = false;
    this.gameMode = 'campaign'; // 'campaign', 'bossrush', 'pvp'
    this.isCoopMode = false;
    this.p1HeroId = 'aquarius';
    this.p2HeroId = 'aries';
    this.currentLevel = 'goteborg';
    this.levelWidth = 8000;
    this.selectingForPlayer = 1;

    this.score = 0;
    this.combo = 0;
    this.comboTimer = 0;
    this.screenShake = 0;
    this.gameTime = 0;
    this.waveNumber = 1;
    this.spawnedZones = {};
    this.bossRushIndex = 0;

    this.camera = new Camera(W, H, 8000, H);
    this.player1 = new PlayerEntity(1);
    this.player2 = new PlayerEntity(2);

    this.enemies = [];
    this.projectiles = [];
    this.meleeHits = [];
    this.enemyProjectiles = [];
    this.ultEffect = null;

    this.keys = {};
    this.bgImages = {};
    this.weatherParticles = [];

    this.init();
  }

  init() {
    this.loadBackgrounds();
    this.initWeather();
    this.initInput();
    this.initUI();
  }

  loadBackgrounds() {
    Object.keys(LEVELS).forEach(lvlId => {
      const img = new Image();
      img.src = LEVELS[lvlId].bg;
      this.bgImages[lvlId] = img;
    });
  }

  initWeather() {
    for (let i = 0; i < 110; i++) {
      this.weatherParticles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        speed: 4 + Math.random() * 7,
        size: 1.5 + Math.random() * 3,
        drift: (Math.random() - 0.5) * 1.5
      });
    }
  }

  initInput() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
      if (this.isPlaying) this.handleGameKeys(e.code);
    });
    window.addEventListener('keyup', (e) => this.keys[e.code] = false);
  }

  handleGameKeys(code) {
    // 1. P1 Controls
    if (code === 'KeyF') this.player1.attack(this.projectiles, this.meleeHits, (s) => this.screenShake = s);
    if (code === 'KeyG') this.player1.castQ(this.projectiles, (s) => this.screenShake = s);
    if (code === 'KeyH') this.player1.castE(this.enemies, (en, el, p, d) => this.applyElementalHit(en, el, p, d), (s) => this.screenShake = s);
    if (code === 'Space') this.player1.castDash();
    if (code === 'KeyT') this.handleUltCast(1);

    // 2. P2 Controls
    if ((this.isCoopMode || this.gameMode === 'pvp') && this.player2.hp > 0) {
      if (code === 'Numpad1' || code === 'KeyK') this.player2.attack(this.projectiles, this.meleeHits, (s) => this.screenShake = s);
      if (code === 'Numpad2' || code === 'KeyL') this.player2.castQ(this.projectiles, (s) => this.screenShake = s);
      if (code === 'Numpad3' || code === 'KeyO') this.player2.castE(this.enemies, (en, el, p, d) => this.applyElementalHit(en, el, p, d), (s) => this.screenShake = s);
      if (code === 'Numpad0' || code === 'ShiftRight') this.player2.castDash();
      if (code === 'Numpad4' || code === 'KeyP') this.handleUltCast(2);
    }
  }

  handleUltCast(casterIndex) {
    // Check if both players have 100% Ult in Co-op -> Trigger "ZODIAC ECLIPSE"
    if (this.isCoopMode && this.player1.hp > 0 && this.player2.hp > 0 && this.player1.ultCharge >= 100 && this.player2.ultCharge >= 100) {
      synergyUltManager.triggerEclipse(this.player1, this.player2, this.enemies, (s) => this.screenShake = s, W, H);
      return;
    }

    const caster = casterIndex === 1 ? this.player1 : this.player2;
    caster.castUlt(this.enemies, (en, el, p, d) => this.applyElementalHit(en, el, p, d), (u) => this.ultEffect = u, (s) => this.screenShake = s, this.levelWidth, H);
  }

  initUI() {
    // Solo Campaign Mode
    document.getElementById('btn-mode-solo').addEventListener('click', () => {
      this.gameMode = 'campaign';
      this.isCoopMode = false;
      document.getElementById('screen-title').style.display = 'none';
      document.getElementById('char-select-sub').innerText = 'Solo Campaign (1P Solo). Select your Zodiac hero:';
      populateZodiacGrid(this.p1HeroId, this.p2HeroId, this.isCoopMode, (id) => this.onHeroSelected(id));
      refreshSelectionUI(this.p1HeroId, this.p2HeroId, this.isCoopMode);
      document.getElementById('screen-char-select').style.display = 'flex';
    });

    // 2P Co-Op Arcade Mode
    document.getElementById('btn-mode-coop').addEventListener('click', () => {
      this.gameMode = 'campaign';
      this.isCoopMode = true;
      this.selectingForPlayer = 1;
      document.getElementById('screen-title').style.display = 'none';
      document.getElementById('char-select-sub').innerText = 'Co-Op Mode (2P Arcade). Click cards to choose P1 (Cyan) and P2 (Gold):';
      populateZodiacGrid(this.p1HeroId, this.p2HeroId, this.isCoopMode, (id) => this.onHeroSelected(id));
      refreshSelectionUI(this.p1HeroId, this.p2HeroId, this.isCoopMode);
      document.getElementById('screen-char-select').style.display = 'flex';
    });

    // 1v1 PvP Duel Mode
    document.getElementById('btn-mode-pvp').addEventListener('click', () => {
      this.gameMode = 'pvp';
      this.isCoopMode = false;
      this.selectingForPlayer = 1;
      document.getElementById('screen-title').style.display = 'none';
      document.getElementById('char-select-sub').innerText = '⚔️ 1 vs 1 PvP Arena! Select P1 (Cyan) and P2 (Gold):';
      populateZodiacGrid(this.p1HeroId, this.p2HeroId, true, (id) => this.onHeroSelected(id));
      refreshSelectionUI(this.p1HeroId, this.p2HeroId, true);
      document.getElementById('screen-char-select').style.display = 'flex';
    });

    // Boss Rush Mode
    document.getElementById('btn-mode-bossrush').addEventListener('click', () => {
      this.gameMode = 'bossrush';
      this.isCoopMode = false;
      this.bossRushIndex = 0;
      document.getElementById('screen-title').style.display = 'none';
      document.getElementById('char-select-sub').innerText = '🏆 BOSS RUSH GAUNTLET: Defeat all 4 Swedish bosses!';
      populateZodiacGrid(this.p1HeroId, this.p2HeroId, this.isCoopMode, (id) => this.onHeroSelected(id));
      refreshSelectionUI(this.p1HeroId, this.p2HeroId, this.isCoopMode);
      document.getElementById('screen-char-select').style.display = 'flex';
    });

    // Open Fika Café Shop
    document.getElementById('btn-open-shop').addEventListener('click', () => {
      document.getElementById('screen-title').style.display = 'none';
      populateShopUI();
      document.getElementById('screen-shop').style.display = 'flex';
    });
    document.getElementById('btn-close-shop').addEventListener('click', () => {
      document.getElementById('screen-shop').style.display = 'none';
      document.getElementById('screen-title').style.display = 'flex';
    });

    document.getElementById('btn-goto-map').addEventListener('click', () => {
      document.getElementById('screen-title').style.display = 'none';
      document.getElementById('screen-map').style.display = 'flex';
    });
    document.getElementById('btn-back-from-char').addEventListener('click', () => {
      document.getElementById('screen-char-select').style.display = 'none';
      document.getElementById('screen-title').style.display = 'flex';
    });
    document.getElementById('btn-back-from-map').addEventListener('click', () => {
      document.getElementById('screen-map').style.display = 'none';
      document.getElementById('screen-title').style.display = 'flex';
    });

    document.getElementById('btn-confirm-char').addEventListener('click', () => {
      this.currentLevel = HERO_CONFIGS[this.p1HeroId].levelId;
      this.startLevel(this.currentLevel);
    });

    document.querySelectorAll('.map-node').forEach(node => {
      node.addEventListener('click', () => {
        this.currentLevel = node.getAttribute('data-level');
        this.startLevel(this.currentLevel);
      });
    });
    document.getElementById('btn-start-level').addEventListener('click', () => {
      this.startLevel(this.currentLevel);
    });

    document.getElementById('btn-res-next').addEventListener('click', () => {
      document.getElementById('screen-result').style.display = 'none';
      document.getElementById('screen-map').style.display = 'flex';
    });
    document.getElementById('btn-res-replay').addEventListener('click', () => {
      this.startLevel(this.currentLevel);
    });

    const sndBtn = document.getElementById('btn-sound-toggle');
    if (sndBtn) {
      sndBtn.addEventListener('click', () => {
        const isMuted = sound.toggleMute();
        sndBtn.innerText = isMuted ? '🔇' : '🔊';
      });
    }
  }

  onHeroSelected(heroId) {
    if (!this.isCoopMode && this.gameMode !== 'pvp') {
      this.p1HeroId = heroId;
      this.currentLevel = HERO_CONFIGS[heroId].levelId;
    } else {
      if (this.selectingForPlayer === 1) {
        this.p1HeroId = heroId;
        this.selectingForPlayer = 2;
      } else {
        this.p2HeroId = heroId;
        this.selectingForPlayer = 1;
      }
    }
    refreshSelectionUI(this.p1HeroId, this.p2HeroId, this.isCoopMode || this.gameMode === 'pvp');
  }

  startLevel(levelId) {
    sound.init();
    this.currentLevel = levelId;
    const lvlData = LEVELS[levelId] || LEVELS['goteborg'];
    this.levelWidth = this.gameMode === 'pvp' ? 1080 : (lvlData.width || 12000);

    this.isPlaying = true;
    this.score = 0;
    this.combo = 0;
    this.waveNumber = 1;
    this.spawnedZones = { 1: true };
    this.checkpointReached = false;

    this.enemies.length = 0;
    this.projectiles.length = 0;
    this.meleeHits.length = 0;
    this.enemyProjectiles.length = 0;
    particles.clear();
    relicManager.clear();
    buffManager.clear();
    movingPlatformManager.populateForLevel(lvlData);
    destructibleManager.populateForLevel(levelId, this.levelWidth, lvlData ? lvlData.platforms : []);
    vehicleManager.populateForLevel(levelId, this.levelWidth);

    this.camera.setLevelBounds(this.levelWidth, H);
    this.camera.x = 0;

    this.player1.init(this.p1HeroId, this.isCoopMode ? 80 : 120);
    document.getElementById('p1-name').innerText = this.player1.hero.name.toUpperCase();
    document.getElementById('p1-energy-name').innerText = this.player1.hero.energyName;

    if (this.isCoopMode || this.gameMode === 'pvp') {
      this.player2.init(this.p2HeroId, this.gameMode === 'pvp' ? 880 : 160);
      document.getElementById('p2-hud').style.display = 'flex';
      document.getElementById('p2-controls-guide').style.display = 'block';
      document.getElementById('p2-name').innerText = this.player2.hero.name.toUpperCase();
      document.getElementById('p2-energy-name').innerText = this.player2.hero.energyName;
    } else {
      document.getElementById('p2-hud').style.display = 'none';
      document.getElementById('p2-controls-guide').style.display = 'none';
    }

    hudManager.initPlayerAvatars(this.player1.hero, this.player2.hero, this.isCoopMode || this.gameMode === 'pvp');
    document.getElementById('hud-city').innerText = lvlData ? lvlData.name : '🇸🇪 SWEDISH REALM';

    document.querySelectorAll('.screen-overlay').forEach(el => el.style.display = 'none');
    document.getElementById('ui-hud').style.display = 'flex';

    // Start Procedural Retro BGM
    sound.playMusic(this.gameMode === 'bossrush' ? 'boss' : this.currentLevel);

    if (this.gameMode === 'bossrush') {
      this.spawnBossRushStage();
    } else if (this.gameMode !== 'pvp') {
      this.spawnZoneWave(1, 0);
    }
  }

  spawnBossRushStage() {
    const bossList = [
      { name: 'MEKANISK KRAN-KRAKEN', hp: 950, icon: '🐙' },
      { name: 'LKAB MALM-JÄTTE', hp: 1050, icon: '❄️' },
      { name: 'KUNGLIGA ÅNG-GRYFON', hp: 1000, icon: '👑' },
      { name: 'VALDEMAR SPÖKSJÖRÖVARE', hp: 1020, icon: '⚔️' }
    ];
    const b = bossList[this.bossRushIndex % bossList.length];
    this.enemies.push(createBoss(W - 250, 310, b.name, b.hp, b.icon));
    sound.playRoar();
  }

  spawnZoneWave(zoneIndex, spawnOriginX) {
    const scale = this.isCoopMode ? 1.4 : 1.0;
    const spawnX = spawnOriginX + 650;

    if (this.currentLevel === 'goteborg') {
      if (zoneIndex === 1) {
        this.enemies.push(new EnemyMob(spawnX + 100, 420, 'viking'));
        this.enemies.push(new EnemyMob(spawnX + 260, 420, 'karolin'));
        if (this.isCoopMode) this.enemies.push(new EnemyMob(spawnX + 180, 420, 'viking'));
      } else if (zoneIndex === 2) {
        this.enemies.push(new EnemyMob(spawnX + 60, 420, 'golem'));
        this.enemies.push(new EnemyMob(spawnX + 180, 420, 'viking'));
        this.enemies.push(new EnemyMob(spawnX + 300, 420, 'karolin'));
      } else if (zoneIndex === 3) {
        this.enemies.push(new EnemyMob(spawnX + 60, 420, 'golem'));
        this.enemies.push(new EnemyMob(spawnX + 180, 420, 'viking'));
        this.enemies.push(new EnemyMob(spawnX + 280, 420, 'karolin'));
        this.enemies.push(new EnemyMob(spawnX + 380, 420, 'troll'));
      } else if (zoneIndex === 4) {
        this.enemies.push(new EnemyMob(spawnX + 60, 420, 'golem'));
        this.enemies.push(new EnemyMob(spawnX + 180, 420, 'skogsra'));
        this.enemies.push(new EnemyMob(spawnX + 300, 420, 'karolin'));
        this.enemies.push(new EnemyMob(spawnX + 420, 420, 'troll'));
      } else if (zoneIndex === 5) {
        this.enemies.push(new EnemyMob(spawnX + 80, 420, 'viking'));
        this.enemies.push(new EnemyMob(spawnX + 220, 420, 'golem'));
        this.enemies.push(new EnemyMob(spawnX + 360, 420, 'skogsra'));
      } else if (zoneIndex === 6) {
        this.enemies.push(new EnemyMob(spawnX + 60, 420, 'golem'));
        this.enemies.push(new EnemyMob(spawnX + 180, 420, 'viking'));
        this.enemies.push(new EnemyMob(spawnX + 300, 420, 'karolin'));
        this.enemies.push(new EnemyMob(spawnX + 420, 420, 'troll'));
      } else if (zoneIndex === 7) {
        this.enemies.push(new EnemyMob(spawnX + 80, 420, 'golem'));
        this.enemies.push(new EnemyMob(spawnX + 200, 420, 'skogsra'));
        this.enemies.push(new EnemyMob(spawnX + 340, 420, 'karolin'));
        this.enemies.push(new EnemyMob(spawnX + 480, 420, 'viking'));
      } else if (zoneIndex === 8) {
        this.camera.lockAt(this.levelWidth - W);
        this.enemies.push(createBoss(this.levelWidth - 280, 310, 'MEKANISK KRAN-KRAKEN', 1250 * scale, '🐙'));
        this.enemies.push(new EnemyMob(this.levelWidth - 460, 420, 'golem'));
        this.enemies.push(new EnemyMob(this.levelWidth - 560, 420, 'karolin'));
        this.enemies.push(new EnemyMob(this.levelWidth - 660, 420, 'troll'));
        hudManager.showBossWarning('MEKANISK KRAN-KRAKEN');
        sound.playMusic('boss');
        sound.playUlt();
      }
    } else if (this.currentLevel === 'kiruna') {
      if (zoneIndex === 1) {
        this.enemies.push(new EnemyMob(spawnX + 80, 420, 'golem'));
        this.enemies.push(new EnemyMob(spawnX + 220, 420, 'troll'));
      } else if (zoneIndex === 2) {
        this.enemies.push(new EnemyMob(spawnX + 80, 420, 'troll'));
        this.enemies.push(new EnemyMob(spawnX + 200, 420, 'skogsra'));
        this.enemies.push(new EnemyMob(spawnX + 320, 420, 'golem'));
      } else if (zoneIndex === 3) {
        this.enemies.push(new EnemyMob(spawnX + 60, 420, 'troll'));
        this.enemies.push(new EnemyMob(spawnX + 180, 420, 'skogsra'));
        this.enemies.push(new EnemyMob(spawnX + 300, 420, 'troll'));
        this.enemies.push(new EnemyMob(spawnX + 400, 420, 'golem'));
      } else if (zoneIndex === 4) {
        this.enemies.push(new EnemyMob(spawnX + 60, 420, 'troll'));
        this.enemies.push(new EnemyMob(spawnX + 180, 420, 'golem'));
        this.enemies.push(new EnemyMob(spawnX + 300, 420, 'skogsra'));
      } else if (zoneIndex === 5) {
        this.enemies.push(new EnemyMob(spawnX + 80, 420, 'golem'));
        this.enemies.push(new EnemyMob(spawnX + 220, 420, 'troll'));
        this.enemies.push(new EnemyMob(spawnX + 360, 420, 'golem'));
      } else if (zoneIndex === 6) {
        this.enemies.push(new EnemyMob(spawnX + 80, 420, 'troll'));
        this.enemies.push(new EnemyMob(spawnX + 200, 420, 'skogsra'));
        this.enemies.push(new EnemyMob(spawnX + 340, 420, 'golem'));
      } else if (zoneIndex === 7) {
        this.enemies.push(new EnemyMob(spawnX + 80, 420, 'golem'));
        this.enemies.push(new EnemyMob(spawnX + 220, 420, 'troll'));
        this.enemies.push(new EnemyMob(spawnX + 360, 420, 'skogsra'));
      } else if (zoneIndex === 8) {
        this.camera.lockAt(this.levelWidth - W);
        this.enemies.push(createBoss(this.levelWidth - 280, 310, 'LKAB MALM-JÄTTE', 1350 * scale, '❄️'));
        this.enemies.push(new EnemyMob(this.levelWidth - 460, 420, 'troll'));
        this.enemies.push(new EnemyMob(this.levelWidth - 560, 420, 'golem'));
        this.enemies.push(new EnemyMob(this.levelWidth - 660, 420, 'skogsra'));
        hudManager.showBossWarning('LKAB MALM-JÄTTE');
        sound.playMusic('boss');
        sound.playUlt();
      }
    } else if (this.currentLevel === 'stockholm') {
      if (zoneIndex === 1) {
        this.enemies.push(new EnemyMob(spawnX + 80, 420, 'karolin'));
        this.enemies.push(new EnemyMob(spawnX + 220, 420, 'viking'));
      } else if (zoneIndex === 2) {
        this.enemies.push(new EnemyMob(spawnX + 80, 420, 'karolin'));
        this.enemies.push(new EnemyMob(spawnX + 180, 420, 'skogsra'));
        this.enemies.push(new EnemyMob(spawnX + 300, 420, 'golem'));
      } else if (zoneIndex === 3) {
        this.enemies.push(new EnemyMob(spawnX + 80, 420, 'karolin'));
        this.enemies.push(new EnemyMob(spawnX + 200, 420, 'troll'));
        this.enemies.push(new EnemyMob(spawnX + 320, 420, 'viking'));
        this.enemies.push(new EnemyMob(spawnX + 420, 420, 'karolin'));
      } else if (zoneIndex === 4) {
        this.enemies.push(new EnemyMob(spawnX + 80, 420, 'karolin'));
        this.enemies.push(new EnemyMob(spawnX + 200, 420, 'skogsra'));
        this.enemies.push(new EnemyMob(spawnX + 340, 420, 'golem'));
      } else if (zoneIndex === 5) {
        this.enemies.push(new EnemyMob(spawnX + 80, 420, 'karolin'));
        this.enemies.push(new EnemyMob(spawnX + 220, 420, 'viking'));
        this.enemies.push(new EnemyMob(spawnX + 360, 420, 'troll'));
      } else if (zoneIndex === 6) {
        this.enemies.push(new EnemyMob(spawnX + 80, 420, 'karolin'));
        this.enemies.push(new EnemyMob(spawnX + 200, 420, 'skogsra'));
        this.enemies.push(new EnemyMob(spawnX + 340, 420, 'golem'));
      } else if (zoneIndex === 7) {
        this.enemies.push(new EnemyMob(spawnX + 80, 420, 'karolin'));
        this.enemies.push(new EnemyMob(spawnX + 220, 420, 'viking'));
        this.enemies.push(new EnemyMob(spawnX + 360, 420, 'troll'));
      } else if (zoneIndex === 8) {
        this.camera.lockAt(this.levelWidth - W);
        this.enemies.push(createBoss(this.levelWidth - 280, 310, 'KUNGLIGA ÅNG-GRYFON', 1300 * scale, '👑'));
        this.enemies.push(new EnemyMob(this.levelWidth - 460, 420, 'karolin'));
        this.enemies.push(new EnemyMob(this.levelWidth - 560, 420, 'skogsra'));
        this.enemies.push(new EnemyMob(this.levelWidth - 660, 420, 'golem'));
        hudManager.showBossWarning('KUNGLIGA ÅNG-GRYFON');
        sound.playMusic('boss');
        sound.playUlt();
      }
    } else if (this.currentLevel === 'visby') {
      if (zoneIndex === 1) {
        this.enemies.push(new EnemyMob(spawnX + 80, 420, 'corsair'));
        this.enemies.push(new EnemyMob(spawnX + 220, 420, 'viking'));
      } else if (zoneIndex === 2) {
        this.enemies.push(new EnemyMob(spawnX + 80, 420, 'corsair'));
        this.enemies.push(new EnemyMob(spawnX + 200, 420, 'skogsra'));
        this.enemies.push(new EnemyMob(spawnX + 320, 420, 'corsair'));
      } else if (zoneIndex === 3) {
        this.enemies.push(new EnemyMob(spawnX + 80, 420, 'corsair'));
        this.enemies.push(new EnemyMob(spawnX + 200, 420, 'troll'));
        this.enemies.push(new EnemyMob(spawnX + 320, 420, 'skogsra'));
        this.enemies.push(new EnemyMob(spawnX + 420, 420, 'corsair'));
      } else if (zoneIndex === 4) {
        this.enemies.push(new EnemyMob(spawnX + 80, 420, 'corsair'));
        this.enemies.push(new EnemyMob(spawnX + 200, 420, 'troll'));
        this.enemies.push(new EnemyMob(spawnX + 340, 420, 'viking'));
      } else if (zoneIndex === 5) {
        this.enemies.push(new EnemyMob(spawnX + 80, 420, 'corsair'));
        this.enemies.push(new EnemyMob(spawnX + 220, 420, 'corsair'));
        this.enemies.push(new EnemyMob(spawnX + 360, 420, 'skogsra'));
      } else if (zoneIndex === 6) {
        this.enemies.push(new EnemyMob(spawnX + 80, 420, 'corsair'));
        this.enemies.push(new EnemyMob(spawnX + 200, 420, 'troll'));
        this.enemies.push(new EnemyMob(spawnX + 340, 420, 'viking'));
      } else if (zoneIndex === 7) {
        this.enemies.push(new EnemyMob(spawnX + 80, 420, 'corsair'));
        this.enemies.push(new EnemyMob(spawnX + 220, 420, 'corsair'));
        this.enemies.push(new EnemyMob(spawnX + 360, 420, 'troll'));
      } else if (zoneIndex === 8) {
        this.camera.lockAt(this.levelWidth - W);
        this.enemies.push(createBoss(this.levelWidth - 280, 310, 'VALDEMAR SPÖKSJÖRÖVARE', 1320 * scale, '⚔️'));
        this.enemies.push(new EnemyMob(this.levelWidth - 460, 420, 'corsair'));
        this.enemies.push(new EnemyMob(this.levelWidth - 560, 420, 'troll'));
        this.enemies.push(new EnemyMob(this.levelWidth - 660, 420, 'viking'));
        hudManager.showBossWarning('VALDEMAR SPÖKSJÖRÖVARE');
        sound.playMusic('boss');
        sound.playUlt();
      }
    }
  }

  applyElementalHit(enemy, element, ownerIndex, damage) {
    if (!this.isCoopMode) return;

    if (!enemy.lastElement) {
      enemy.lastElement = element;
      enemy.lastOwner = ownerIndex;
      enemy.elementTimer = 180;
      return;
    }

    if (enemy.lastOwner !== ownerIndex && enemy.elementTimer > 0) {
      const pair = [enemy.lastElement, element].sort().join('+');
      const syn = SYNERGIES[pair] || SYNERGIES['default'];

      enemy.hp -= syn.damage;
      sound.playSynergy();
      this.screenShake = 16;
      particles.createDamageNumber(enemy.x + enemy.w/2, enemy.y - 20, `SYNERGY! -${syn.damage}`, syn.color);
      particles.createSparks(enemy.x + enemy.w/2, enemy.y + enemy.h/2, syn.color, 40);
      hudManager.showSynergy(syn.name);

      enemy.lastElement = null;
    } else {
      enemy.lastElement = element;
      enemy.lastOwner = ownerIndex;
      enemy.elementTimer = 180;
    }
  }

  checkTeamDefeat() {
    if (this.gameMode === 'pvp') {
      if (this.player1.hp <= 0 || this.player2.hp <= 0) {
        this.finishLevel(true);
      }
      return;
    }

    if (this.isCoopMode) {
      if (this.player1.hp <= 0 && this.player2.hp <= 0) this.finishLevel(false);
    } else {
      if (this.player1.hp <= 0) this.finishLevel(false);
    }
  }

  finishLevel(victory) {
    this.isPlaying = false;
    sound.stopMusic();
    document.getElementById('ui-hud').style.display = 'none';
    const screen = document.getElementById('screen-result');
    const title = document.getElementById('res-title');
    const desc = document.getElementById('res-desc');
    screen.style.display = 'flex';

    if (this.gameMode === 'pvp') {
      const winner = this.player1.hp > 0 ? 'P1 ' + this.player1.hero.name.toUpperCase() : 'P2 ' + this.player2.hero.name.toUpperCase();
      title.innerHTML = `🏆 ${winner} VICTORIOUS!`;
      title.style.color = '#facc15';
      desc.innerHTML = `Glorious PvP combat on the Swedish arena!`;
      return;
    }

    if (victory) {
      sound.playSynergy();
      const earnedShards = Math.floor(this.score / 20) + 15;
      shopManager.addShards(earnedShards);

      title.innerHTML = this.isCoopMode ? '🏆 CO-OP VICTORY!' : '🏆 PROVINCE LIBERATED!';
      title.style.color = '#facc15';
      desc.innerHTML = `Glorious triumph across <b>${this.currentLevel.toUpperCase()}</b>!<br>Total Star Shards Collected: <b>+${earnedShards} ⭐</b> (Bank: ${shopManager.starShards} ⭐).<br>Visit the Fika Café to upgrade your combat skills!`;
    } else {
      title.innerHTML = '💥 GUARDIANS FALLEN';
      title.style.color = '#ef4444';
      desc.innerHTML = `Our heroes were defeated in ${this.currentLevel.toUpperCase()}.<br>Regroup and try again!`;
    }
  }

  update() {
    this.gameTime++;

    if (this.isPlaying) {
      const lvlData = LEVELS[this.currentLevel];
      const platforms = lvlData ? lvlData.platforms : [];
      
      // 1. Update Moving Platforms / Ferry Barges
      movingPlatformManager.update();

      this.player1.update(this.keys['KeyA'], this.keys['KeyD'], this.keys['KeyW'], platforms, this.enemies, () => this.checkTeamDefeat(), (s) => this.screenShake = s, (en, el, p, d) => this.applyElementalHit(en, el, p, d), this.levelWidth, movingPlatformManager.platforms);
      if ((this.isCoopMode || this.gameMode === 'pvp') && this.player2.hp > 0) {
        this.player2.update(this.keys['ArrowLeft'], this.keys['ArrowRight'], this.keys['ArrowUp'], platforms, this.enemies, () => this.checkTeamDefeat(), (s) => this.screenShake = s, (en, el, p, d) => this.applyElementalHit(en, el, p, d), this.levelWidth, movingPlatformManager.platforms);
      }

      // Update Side-Scrolling Camera
      this.camera.update(this.player1, this.player2, this.isCoopMode, this.screenShake);

      // Check Progressive Stage Zones (8 Sectors across 12,000px: 0, 1500, 3000, 4500, 6000, 7500, 9000, 10500)
      if (this.gameMode === 'campaign') {
        const focalX = Math.max(this.player1.x, this.isCoopMode && this.player2.hp > 0 ? this.player2.x : 0);
        hudManager.updateProgress(focalX, this.levelWidth);

        if (focalX > 1500 && !this.spawnedZones[2]) {
          this.spawnedZones[2] = true;
          this.spawnZoneWave(2, 1500);
        }
        if (focalX > 3000 && !this.spawnedZones[3]) {
          this.spawnedZones[3] = true;
          this.spawnZoneWave(3, 3000);
        }
        if (focalX > 4500 && !this.spawnedZones[4]) {
          this.spawnedZones[4] = true;
          this.spawnZoneWave(4, 4500);
          if (!this.checkpointReached) {
            this.checkpointReached = true;
            hudManager.showCheckpoint('SECTOR 4 CHECKPOINT ☕');
            sound.playSynergy();
          }
        }
        if (focalX > 6000 && !this.spawnedZones[5]) {
          this.spawnedZones[5] = true;
          this.spawnZoneWave(5, 6000);
        }
        if (focalX > 7500 && !this.spawnedZones[6]) {
          this.spawnedZones[6] = true;
          this.spawnZoneWave(6, 7500);
        }
        if (focalX > 9000 && !this.spawnedZones[7]) {
          this.spawnedZones[7] = true;
          this.spawnZoneWave(7, 9000);
        }
        if (focalX > 10500 && !this.spawnedZones[8]) {
          this.spawnedZones[8] = true;
          this.spawnZoneWave(8, 10500);
        }
      }

      if (this.screenShake > 0) this.screenShake *= 0.88;
      if (this.screenShake < 0.2) this.screenShake = 0;

      if (this.comboTimer > 0) {
        this.comboTimer--;
        if (this.comboTimer === 0) {
          this.combo = 0;
          document.getElementById('combo-banner').classList.remove('active');
        }
      }

      // Update Buffs, Relics, Vehicles, Mini-games, Synergy Ult
      buffManager.update(this.player1, this.player2);
      relicManager.update(this.player1, this.player2, this.isCoopMode);
      destructibleManager.update(this.enemies, (s) => this.screenShake = s);
      vehicleManager.update(this.player1, this.player2, this.enemies, (s) => this.screenShake = s);
      synergyUltManager.update();
      miniGameManager.update(this.player1, this.player2, this.isCoopMode);

      // Projectiles
      for (let i = this.projectiles.length - 1; i >= 0; i--) {
        const p = this.projectiles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        // PvP Mode: Check damage against other player
        if (this.gameMode === 'pvp') {
          const opponent = p.owner === 1 ? this.player2 : this.player1;
          if (opponent.hp > 0 && p.x > opponent.x && p.x < opponent.x + opponent.w && p.y > opponent.y && p.y < opponent.y + opponent.h) {
            opponent.takeDamage(p.damage, () => this.checkTeamDefeat(), (s) => this.screenShake = s);
            p.life = 0;
            this.projectiles.splice(i, 1);
            continue;
          }
        }

        // Check Destructible Props Hit
        for (const prop of destructibleManager.props) {
          if (p.x > prop.x && p.x < prop.x + prop.w && p.y > prop.y && p.y < prop.y + prop.h) {
            destructibleManager.hitProp(prop, p.damage, (s) => this.screenShake = s, this.enemies);
            p.life = 0;
            break;
          }
        }
        if (p.life <= 0) {
          this.projectiles.splice(i, 1);
          continue;
        }

        // Check Enemy Hits
        for (let j = this.enemies.length - 1; j >= 0; j--) {
          const en = this.enemies[j];
          if (p.x > en.x && p.x < en.x + en.w && p.y > en.y && p.y < en.y + en.h) {
            let finalDmg = p.damage;
            if (en.type === 'viking' && en.isShielding && Math.sign(p.vx) !== en.facing) {
              finalDmg = Math.floor(p.damage * 0.25);
              particles.createSparks(p.x, p.y, '#facc15', 10);
              sound.playHit();
            }

            en.hp -= finalDmg;
            sound.playHit();
            particles.createSparks(p.x, p.y, p.color, 6);
            particles.createDamageNumber(en.x + en.w/2, en.y, `-${finalDmg}`);
            
            const owner = p.owner === 1 ? this.player1 : this.player2;
            owner.ultCharge = Math.min(100, owner.ultCharge + 3 * shopManager.getUltMultiplier());

            // Chain Lightning Effect from Mjölnir Powerup
            if (p.chainLightning) {
              sound.playLaser();
              for (const other of this.enemies) {
                if (other !== en) {
                  const dist = Math.hypot((other.x + other.w / 2) - p.x, (other.y + other.h / 2) - p.y);
                  if (dist < 180) {
                    other.hp -= 20;
                    particles.createSparks(other.x + other.w / 2, other.y + other.h / 2, '#facc15', 12);
                    particles.createDamageNumber(other.x + other.w / 2, other.y, '⚡ CHAIN -20', '#facc15');
                  }
                }
              }
            }

            this.applyElementalHit(en, p.element, p.owner, finalDmg);

            this.combo++;
            this.comboTimer = 100;
            this.score += 15 * this.combo;
            document.getElementById('combo-count').innerText = this.combo;
            document.getElementById('combo-banner').classList.add('active');

            p.life = 0;
            break;
          }
        }
        if (p.life <= 0) this.projectiles.splice(i, 1);
      }

      // Melee Hits
      for (let i = this.meleeHits.length - 1; i >= 0; i--) {
        const m = this.meleeHits[i];
        m.life--;

        // PvP Mode: Check melee hit on other player
        if (this.gameMode === 'pvp') {
          const opponent = m.owner === 1 ? this.player2 : this.player1;
          if (opponent.hp > 0 && checkRectCollision(m, opponent)) {
            opponent.takeDamage(m.damage, () => this.checkTeamDefeat(), (s) => this.screenShake = s);
          }
        }

        // Check Destructible Props Hit
        for (const prop of destructibleManager.props) {
          if (checkRectCollision(m, prop)) {
            destructibleManager.hitProp(prop, m.damage, (s) => this.screenShake = s, this.enemies);
          }
        }

        // Check Enemy Hits
        for (let j = this.enemies.length - 1; j >= 0; j--) {
          const en = this.enemies[j];
          if (checkRectCollision(m, en)) {
            let finalDmg = m.damage;
            if (en.type === 'viking' && en.isShielding && Math.sign(this.player1.facing) !== en.facing) {
              finalDmg = Math.floor(m.damage * 0.3);
              particles.createSparks(en.x + en.w/2, en.y + en.h/2, '#facc15', 12);
            }

            en.hp -= finalDmg;
            sound.playHit();
            particles.createDamageNumber(en.x + en.w/2, en.y, `CRIT! -${finalDmg}`, m.color);
            
            const owner = m.owner === 1 ? this.player1 : this.player2;
            owner.ultCharge = Math.min(100, owner.ultCharge + 5 * shopManager.getUltMultiplier());

            this.applyElementalHit(en, m.element, m.owner, finalDmg);

            this.combo++;
            this.score += 20 * this.combo;
          }
        }
        if (m.life <= 0) this.meleeHits.splice(i, 1);
      }

      // Enemy Projectiles & Ground Waves
      for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
        const ep = this.enemyProjectiles[i];
        ep.x += ep.vx;
        ep.y += ep.vy;
        ep.life--;

        if (this.player1.hp > 0 && ep.x > this.player1.x && ep.x < this.player1.x + this.player1.w && ep.y > this.player1.y && ep.y < this.player1.y + this.player1.h) {
          this.player1.takeDamage(ep.damage, () => this.checkTeamDefeat(), (s) => this.screenShake = s);
          ep.life = 0;
        }
        if ((this.isCoopMode || this.gameMode === 'pvp') && this.player2.hp > 0 && ep.x > this.player2.x && ep.x < this.player2.x + this.player2.w && ep.y > this.player2.y && ep.y < this.player2.y + this.player2.h) {
          this.player2.takeDamage(ep.damage, () => this.checkTeamDefeat(), (s) => this.screenShake = s);
          ep.life = 0;
        }
        if (ep.life <= 0) this.enemyProjectiles.splice(i, 1);
      }

      // Enemies Update
      let activeBoss = null;
      let hasBossSpawned = !!this.spawnedZones[8] || this.gameMode === 'bossrush';
      const isFrozen = buffManager.timeFreezeTimer > 0;

      for (let i = this.enemies.length - 1; i >= 0; i--) {
        const en = this.enemies[i];
        if (en instanceof BaseBoss || en.isEnraged !== undefined) {
          activeBoss = en;
          en.update(this.enemyProjectiles, (s) => this.screenShake = s);
        } else {
          if (!isFrozen || this.gameTime % 3 === 0) {
            en.update(this.player1, this.player2, this.isCoopMode, this.enemyProjectiles, platforms, (s) => this.screenShake = s, movingPlatformManager.platforms);
          }
        }

        if (en.hp <= 0) {
          particles.createSparks(en.x + en.w/2, en.y + en.h/2, '#00f0ff', 20);
          this.score += 100;
          this.player1.ultCharge = Math.min(100, this.player1.ultCharge + 10 * shopManager.getUltMultiplier());
          if (this.isCoopMode) this.player2.ultCharge = Math.min(100, this.player2.ultCharge + 10 * shopManager.getUltMultiplier());

          // 75% Drop chance for Loot or Powerups
          if (Math.random() < 0.75) {
            relicManager.spawn(en.x, en.y);
          }
          this.enemies.splice(i, 1);
        }
      }

      // Boss Rush progression check
      if (this.gameMode === 'bossrush' && !activeBoss && this.enemies.length === 0) {
        this.bossRushIndex++;
        if (this.bossRushIndex >= 4) {
          this.finishLevel(true);
        } else {
          this.spawnBossRushStage();
        }
      } else if (hasBossSpawned && !activeBoss && this.enemies.length === 0 && this.gameMode === 'campaign') {
        this.finishLevel(true);
      }

      particles.update();

      if (this.ultEffect) {
        this.ultEffect.timer--;
        if (this.ultEffect.timer <= 0) this.ultEffect = null;
      }

      hudManager.updateHUD(this.player1, this.player2, this.isCoopMode || this.gameMode === 'pvp', this.score, activeBoss);
    }

    // Weather & Atmospheric Particles
    for (const w of this.weatherParticles) {
      w.y += w.speed;
      w.x += w.drift;
      if (w.y > H) {
        w.y = -10;
        w.x = Math.random() * W;
      }
      if (w.x > W) w.x = 0;
      if (w.x < 0) w.x = W;
    }
  }

  drawParallaxBackground() {
    const lvlData = LEVELS[this.currentLevel];
    const bgImg = this.bgImages[this.currentLevel];
    const parallaxOffset = -(this.camera.x * 0.35) % W;

    // 1. Far Base Image / Sky
    if (bgImg && bgImg.complete && bgImg.naturalWidth !== 0) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(bgImg, parallaxOffset, 0, W, H);
      ctx.drawImage(bgImg, parallaxOffset + W, 0, W, H);
      if (parallaxOffset > 0) ctx.drawImage(bgImg, parallaxOffset - W, 0, W, H);
    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#020617');
      grad.addColorStop(1, '#0c1a2e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }

    // 2. Animated Aurora Borealis Effect for Kiruna
    if (this.currentLevel === 'kiruna') {
      ctx.save();
      const wave = Math.sin(this.gameTime * 0.02) * 40;
      const grad = ctx.createLinearGradient(0, 0, W, 250);
      grad.addColorStop(0, 'rgba(6, 182, 212, 0.0)');
      grad.addColorStop(0.4, 'rgba(34, 197, 94, 0.22)');
      grad.addColorStop(0.7, 'rgba(168, 85, 247, 0.18)');
      grad.addColorStop(1, 'rgba(6, 182, 212, 0.0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, 80 + wave);
      ctx.bezierCurveTo(W * 0.3, 30 - wave, W * 0.7, 140 + wave, W, 70 - wave);
      ctx.lineTo(W, 0);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // 3. Dynamic Sector Mood Tinting & Atmosphere
    const sectorIndex = Math.min(5, Math.floor(this.camera.x / 1350));
    const currentSector = lvlData && lvlData.sectors ? lvlData.sectors[sectorIndex] : null;

    if (currentSector) {
      ctx.save();
      ctx.fillStyle = currentSector.tint;
      ctx.globalAlpha = 0.09;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }
  }

  render() {
    ctx.save();

    // 1. Draw Parallax Background (Screenspace)
    this.drawParallaxBackground();

    // Weather Particles
    for (const w of this.weatherParticles) {
      if (this.currentLevel === 'kiruna') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fillRect(w.x, w.y, w.size, w.size);
      } else if (this.currentLevel === 'visby') {
        ctx.fillStyle = 'rgba(192, 132, 252, 0.45)';
        ctx.beginPath();
        ctx.arc(w.x, w.y, w.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.currentLevel === 'stockholm') {
        ctx.fillStyle = 'rgba(251, 191, 36, 0.6)';
        ctx.fillRect(w.x, w.y, w.size * 1.5, w.size);
      } else {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.55)';
        ctx.fillRect(w.x, w.y, 1.5, w.size * 5);
      }
    }

    // 2. World Space Transformation (Camera Tracking + Shake)
    const shake = this.camera.getShakeOffset();
    ctx.save();
    ctx.translate(-Math.round(this.camera.x) + shake.sx, -Math.round(this.camera.y) + shake.sy);

    const lvlData = LEVELS[this.currentLevel];
    const platforms = lvlData ? lvlData.platforms : [];
    const hzType = lvlData ? lvlData.hazardType : 'water';

    // A. Draw Hazardous Pit Depths (Below 490px across the whole world)
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 490, this.levelWidth, 130);

    if (hzType === 'water') {
      // Gothenburg Electric Harbor Water Canal
      const grad = ctx.createLinearGradient(0, 490, 0, 620);
      grad.addColorStop(0, 'rgba(2, 132, 199, 0.85)');
      grad.addColorStop(0.5, 'rgba(3, 42, 77, 0.95)');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 490, this.levelWidth, 130);

      // Animated Water Wave Surface
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      for (let x = 0; x < this.levelWidth; x += 20) {
        const wy = 496 + Math.sin(this.gameTime * 0.08 + x * 0.03) * 4;
        if (x === 0) ctx.moveTo(x, wy);
        else ctx.lineTo(x, wy);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

    } else if (hzType === 'ice_abyss') {
      // Kiruna Sub-Zero LKAB Mine Chasm (-700m)
      const grad = ctx.createLinearGradient(0, 490, 0, 620);
      grad.addColorStop(0, 'rgba(6, 182, 212, 0.75)');
      grad.addColorStop(0.4, 'rgba(15, 23, 42, 0.95)');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 490, this.levelWidth, 130);

      // Freezing Frost Spikes at Pit Bottom
      ctx.fillStyle = '#67e8f9';
      for (let x = 0; x < this.levelWidth; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 620);
        ctx.lineTo(x + 20, 560 + Math.sin(x + this.gameTime * 0.03) * 8);
        ctx.lineTo(x + 40, 620);
        ctx.fill();
      }

    } else if (hzType === 'clockwork') {
      // Stockholm Royal Moat & Clockwork Gear Pit
      const grad = ctx.createLinearGradient(0, 490, 0, 620);
      grad.addColorStop(0, 'rgba(245, 158, 11, 0.75)');
      grad.addColorStop(0.5, 'rgba(69, 26, 3, 0.95)');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 490, this.levelWidth, 130);

      // Rotating Brass Gear Silhouettes in the Pits
      ctx.fillStyle = '#b45309';
      for (let x = 100; x < this.levelWidth; x += 300) {
        ctx.save();
        ctx.translate(x, 560);
        ctx.rotate(this.gameTime * 0.02);
        ctx.fillRect(-22, -22, 44, 44);
        ctx.fillRect(-30, -8, 60, 16);
        ctx.fillRect(-8, -30, 16, 60);
        ctx.restore();
      }

    } else {
      // Visby Baltic Sea Surf & Sharp Timber Spikes
      const grad = ctx.createLinearGradient(0, 490, 0, 620);
      grad.addColorStop(0, 'rgba(168, 85, 247, 0.75)');
      grad.addColorStop(0.5, 'rgba(30, 12, 56, 0.95)');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 490, this.levelWidth, 130);

      // Timber Defensive Spikes
      ctx.fillStyle = '#78350f';
      for (let x = 0; x < this.levelWidth; x += 36) {
        ctx.beginPath();
        ctx.moveTo(x, 620);
        ctx.lineTo(x + 18, 550);
        ctx.lineTo(x + 36, 620);
        ctx.fill();
      }
    }

    // B. Draw Solid Segmented Platforms
    for (const p of platforms) {
      if (!this.camera.isVisible(p.x, p.w)) continue;

      if (p.y === 490) {
        // Ground Dock Platform
        ctx.fillStyle = '#090d16';
        ctx.fillRect(p.x, p.y, p.w, p.h);

        // Neon Border Top
        ctx.fillStyle = lvlData ? lvlData.color : '#00f0ff';
        ctx.shadowColor = lvlData ? lvlData.color : '#00f0ff';
        ctx.shadowBlur = 8;
        ctx.fillRect(p.x, p.y, p.w, 4);
        ctx.shadowBlur = 0;

        // Road Grid Pattern & Cyber Lines
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        for (let gx = p.x; gx < p.x + p.w; gx += 60) {
          ctx.fillRect(gx, p.y + 4, 28, 2);
          ctx.fillRect(gx + 10, p.y + 30, 20, 2);
        }

        // Yellow Hazard Stripes at Left and Right Platform Edges
        ctx.fillStyle = '#facc15';
        ctx.fillRect(p.x, p.y, 14, 6);
        ctx.fillRect(p.x + p.w - 14, p.y, 14, 6);

      } else {
        // Raised Platform
        ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.strokeStyle = lvlData ? lvlData.color : '#38bdf8';
        ctx.lineWidth = 2;
        ctx.strokeRect(p.x, p.y, p.w, p.h);
        ctx.fillStyle = lvlData ? lvlData.color : '#38bdf8';
        ctx.fillRect(p.x, p.y, p.w, 3);
      }
    }

    // C. Sector Transition Gateway Arches with Province Holograms (8 Sectors across 12,000px)
    if (this.gameMode === 'campaign') {
      for (let s = 1; s <= 7; s++) {
        const archX = s * 1500;
        if (this.camera.isVisible(archX, 80)) {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
          ctx.fillRect(archX - 12, 170, 24, 320);
          ctx.strokeStyle = s === 3 ? '#22c55e' : (lvlData ? lvlData.color : '#38bdf8');
          ctx.lineWidth = 2.5;
          ctx.shadowColor = s === 3 ? '#22c55e' : (lvlData ? lvlData.color : '#38bdf8');
          ctx.shadowBlur = 10;
          ctx.strokeRect(archX - 12, 170, 24, 320);
          ctx.shadowBlur = 0;

          // Hologram Banner
          ctx.fillStyle = s === 3 ? '#22c55e' : '#facc15';
          ctx.font = '900 12px "Orbitron", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(s === 3 ? '🚩 CHECKPOINT' : `SECTOR ${s+1}`, archX, 200);
          ctx.textAlign = 'left';
        }
      }
    }

    // Swedish Architectural Landmarks, Houses, Neon Signs & Streetlamps
    sceneryManager.draw(ctx, this.currentLevel, this.levelWidth, this.camera, this.gameTime);

    // Draw Moving Platforms & Ferry Barges
    movingPlatformManager.draw(ctx, this.camera);

    // Draw Destructibles (Crates, Barrels, Chests)
    destructibleManager.draw(ctx, this.camera);

    // Draw Vehicles & Mounts (Snowmobile, Tram, Chariot, Drakkar)
    vehicleManager.draw(ctx, this.camera);

    // Draw Relics & Loot Drops
    relicManager.draw(ctx);

    // Projectiles
    for (const p of this.projectiles) {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      if (p.type === 'binary') {
        ctx.font = 'bold 16px monospace';
        ctx.fillText(p.char, p.x, p.y);
      } else if (p.type === 'dagger') {
        ctx.fillRect(p.x, p.y, 16, 4);
      } else if (p.type === 'skillQ') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 14, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(p.x, p.y, 14, 6);
      }
      ctx.shadowBlur = 0;
    }

    // Enemy Projectiles & Ground Shockwaves
    for (const ep of this.enemyProjectiles) {
      ctx.fillStyle = ep.color;
      ctx.shadowColor = ep.color;
      ctx.shadowBlur = 12;
      if (ep.isGroundWave) {
        ctx.fillRect(ep.x, ep.y, 26, 20);
      } else {
        ctx.beginPath();
        ctx.arc(ep.x, ep.y, 9, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }

    // Draw Enemies & Bosses
    for (const en of this.enemies) {
      if (this.camera.isVisible(en.x, en.w)) {
        en.draw(ctx);
      }
    }

    // Draw Players
    if (this.player1.hp > 0) this.player1.draw(ctx);
    if ((this.isCoopMode || this.gameMode === 'pvp') && this.player2.hp > 0) this.player2.draw(ctx);

    // Particles in World Space
    particles.draw(ctx);

    ctx.restore();

    // 3. Screenspace Overlay (Ult Banner, Synergy Eclipse, Mini-game)
    if (this.ultEffect) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fillRect(0, H/2 - 55, W, 110);
      ctx.fillStyle = this.ultEffect.color;
      ctx.shadowColor = this.ultEffect.color;
      ctx.shadowBlur = 24;
      ctx.font = '900 30px "Orbitron", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`⚡ ${this.ultEffect.name} ⚡`, W/2, H/2 + 10);
      ctx.shadowBlur = 0;
    }

    // Co-op Zodiac Eclipse Overlay
    synergyUltManager.draw(ctx, W, H);

    // Mini-game Overlay
    miniGameManager.draw(ctx, W, H);

    ctx.restore();
  }

  loop() {
    this.update();
    this.render();
    requestAnimationFrame(() => this.loop());
  }
}

// Instantiate and start game loop
window.addEventListener('DOMContentLoaded', () => {
  const game = new GameManager();
  game.loop();

  // Unlock AudioContext on first user interaction anywhere
  const unlockAudio = () => {
    sound.init();
    if (game.isPlaying && !sound.currentTrack) {
      sound.playMusic(game.gameMode === 'bossrush' ? 'boss' : game.currentLevel);
    }
  };
  window.addEventListener('click', unlockAudio);
  window.addEventListener('keydown', unlockAudio);
  window.addEventListener('touchstart', unlockAudio);
});
