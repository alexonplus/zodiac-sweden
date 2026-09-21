import { HERO_CONFIGS } from './config/heroes.js';
import { LEVELS } from './config/levels.js';
import { SYNERGIES } from './config/synergies.js';
import { Camera } from './engine/Camera.js';
import { sound } from './engine/Audio.js';
import { particles } from './engine/Particles.js';
import { checkRectCollision } from './engine/Physics.js';
import { relicManager } from './entities/Relics.js';
import { PlayerEntity } from './entities/Player.js';
import { EnemyMob } from './entities/Enemy.js';
import { BossEntity } from './entities/Bosses.js';
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
    this.isCoopMode = false;
    this.p1HeroId = 'aquarius';
    this.p2HeroId = 'aries';
    this.currentLevel = 'goteborg';
    this.levelWidth = 3200;
    this.selectingForPlayer = 1;

    this.score = 0;
    this.combo = 0;
    this.comboTimer = 0;
    this.screenShake = 0;
    this.gameTime = 0;
    this.waveNumber = 1;
    this.spawnedZones = {};

    this.camera = new Camera(W, H, 3200, H);
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
    for (let i = 0; i < 90; i++) {
      this.weatherParticles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        speed: 6 + Math.random() * 8,
        size: 1 + Math.random() * 3
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
    if (code === 'KeyF') this.player1.attack(this.projectiles, this.meleeHits, (s) => this.screenShake = s);
    if (code === 'KeyG') this.player1.castQ(this.projectiles, (s) => this.screenShake = s);
    if (code === 'KeyH') this.player1.castE(this.enemies, (en, el, p, d) => this.applyElementalHit(en, el, p, d), (s) => this.screenShake = s);
    if (code === 'Space') this.player1.castDash();
    if (code === 'KeyT') this.player1.castUlt(this.enemies, (en, el, p, d) => this.applyElementalHit(en, el, p, d), (u) => this.ultEffect = u, (s) => this.screenShake = s, this.levelWidth, H);

    if (this.isCoopMode && this.player2.hp > 0) {
      if (code === 'Numpad1' || code === 'KeyK') this.player2.attack(this.projectiles, this.meleeHits, (s) => this.screenShake = s);
      if (code === 'Numpad2' || code === 'KeyL') this.player2.castQ(this.projectiles, (s) => this.screenShake = s);
      if (code === 'Numpad3' || code === 'KeyO') this.player2.castE(this.enemies, (en, el, p, d) => this.applyElementalHit(en, el, p, d), (s) => this.screenShake = s);
      if (code === 'Numpad0' || code === 'ShiftRight') this.player2.castDash();
      if (code === 'Numpad4' || code === 'KeyP') this.player2.castUlt(this.enemies, (en, el, p, d) => this.applyElementalHit(en, el, p, d), (u) => this.ultEffect = u, (s) => this.screenShake = s, this.levelWidth, H);
    }
  }

  initUI() {
    document.getElementById('btn-mode-solo').addEventListener('click', () => {
      this.isCoopMode = false;
      document.getElementById('screen-title').style.display = 'none';
      document.getElementById('char-select-sub').innerText = 'Solo Campaign (1P Solo). Select your Zodiac hero:';
      populateZodiacGrid(this.p1HeroId, this.p2HeroId, this.isCoopMode, (id) => this.onHeroSelected(id));
      refreshSelectionUI(this.p1HeroId, this.p2HeroId, this.isCoopMode);
      document.getElementById('screen-char-select').style.display = 'flex';
    });

    document.getElementById('btn-mode-coop').addEventListener('click', () => {
      this.isCoopMode = true;
      this.selectingForPlayer = 1;
      document.getElementById('screen-title').style.display = 'none';
      document.getElementById('char-select-sub').innerText = 'Co-Op Mode (2P Arcade). Click cards to choose P1 (Cyan) and P2 (Gold):';
      populateZodiacGrid(this.p1HeroId, this.p2HeroId, this.isCoopMode, (id) => this.onHeroSelected(id));
      refreshSelectionUI(this.p1HeroId, this.p2HeroId, this.isCoopMode);
      document.getElementById('screen-char-select').style.display = 'flex';
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
  }

  onHeroSelected(heroId) {
    if (!this.isCoopMode) {
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
    refreshSelectionUI(this.p1HeroId, this.p2HeroId, this.isCoopMode);
  }

  startLevel(levelId) {
    sound.init();
    this.currentLevel = levelId;
    const lvlData = LEVELS[levelId] || LEVELS['goteborg'];
    this.levelWidth = lvlData.width || 3200;

    this.isPlaying = true;
    this.score = 0;
    this.combo = 0;
    this.waveNumber = 1;
    this.spawnedZones = { 1: true };

    this.enemies.length = 0;
    this.projectiles.length = 0;
    this.meleeHits.length = 0;
    this.enemyProjectiles.length = 0;
    particles.clear();
    relicManager.clear();

    this.camera.setLevelBounds(this.levelWidth, H);
    this.camera.x = 0;

    this.player1.init(this.p1HeroId, this.isCoopMode ? 80 : 120);
    document.getElementById('p1-name').innerText = this.player1.hero.name.toUpperCase();
    document.getElementById('p1-energy-name').innerText = this.player1.hero.energyName;

    if (this.isCoopMode) {
      this.player2.init(this.p2HeroId, 160);
      document.getElementById('p2-hud').style.display = 'flex';
      document.getElementById('p2-controls-guide').style.display = 'block';
      document.getElementById('p2-name').innerText = this.player2.hero.name.toUpperCase();
      document.getElementById('p2-energy-name').innerText = this.player2.hero.energyName;
    } else {
      document.getElementById('p2-hud').style.display = 'none';
      document.getElementById('p2-controls-guide').style.display = 'none';
    }

    hudManager.initPlayerAvatars(this.player1.hero, this.player2.hero, this.isCoopMode);
    document.getElementById('hud-city').innerText = lvlData ? lvlData.name : '🇸🇪 SWEDISH REALM';

    document.querySelectorAll('.screen-overlay').forEach(el => el.style.display = 'none');
    document.getElementById('ui-hud').style.display = 'flex';

    this.spawnZoneWave(1, 0);
  }

  spawnZoneWave(zoneIndex, spawnOriginX) {
    const scale = this.isCoopMode ? 1.4 : 1.0;
    const spawnX = spawnOriginX + 600;

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
        // BOSS ENCOUNTER
        this.camera.lockAt(this.levelWidth - W);
        this.enemies.push(new BossEntity(this.levelWidth - 280, 320, 'MEKANISK KRAN-KRAKEN', 750 * scale, '🐙'));
        this.enemies.push(new EnemyMob(this.levelWidth - 420, 420, 'golem'));
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
      } else if (zoneIndex === 4) {
        this.camera.lockAt(this.levelWidth - W);
        this.enemies.push(new BossEntity(this.levelWidth - 280, 320, 'LKAB MALM-JÄTTE', 850 * scale, '❄️'));
        this.enemies.push(new EnemyMob(this.levelWidth - 420, 420, 'troll'));
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
      } else if (zoneIndex === 4) {
        this.camera.lockAt(this.levelWidth - W);
        this.enemies.push(new BossEntity(this.levelWidth - 280, 320, 'KUNGLIGA ÅNG-GRYFON', 800 * scale, '👑'));
        this.enemies.push(new EnemyMob(this.levelWidth - 420, 420, 'karolin'));
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
      } else if (zoneIndex === 4) {
        this.camera.lockAt(this.levelWidth - W);
        this.enemies.push(new BossEntity(this.levelWidth - 280, 320, 'VALDEMAR SPÖKSJÖRÖVARE', 820 * scale, '⚔️'));
        this.enemies.push(new EnemyMob(this.levelWidth - 420, 420, 'corsair'));
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
    if (this.isCoopMode) {
      if (this.player1.hp <= 0 && this.player2.hp <= 0) this.finishLevel(false);
    } else {
      if (this.player1.hp <= 0) this.finishLevel(false);
    }
  }

  finishLevel(victory) {
    this.isPlaying = false;
    document.getElementById('ui-hud').style.display = 'none';
    const screen = document.getElementById('screen-result');
    const title = document.getElementById('res-title');
    const desc = document.getElementById('res-desc');
    screen.style.display = 'flex';

    if (victory) {
      title.innerHTML = this.isCoopMode ? '🏆 CO-OP VICTORY!' : '🏆 SECTOR LIBERATED!';
      title.style.color = '#facc15';
      desc.innerHTML = `Glorious triumph across <b>${this.currentLevel.toUpperCase()}</b>!<br>Total Star Shards Collected: <b>${this.score} ⭐</b>.<br>Choose your next Swedish province on the tactical map!`;
    } else {
      title.innerHTML = '💥 GUARDIANS FALLEN';
      title.style.color = '#ef4444';
      desc.innerHTML = `Our heroes were defeated in ${this.currentLevel.toUpperCase()}.<br>Regroup and try again!`;
    }
  }

  update() {
    this.gameTime++;

    if (this.isPlaying) {
      const platforms = LEVELS[this.currentLevel] ? LEVELS[this.currentLevel].platforms : [];
      
      this.player1.update(this.keys['KeyA'], this.keys['KeyD'], this.keys['KeyW'], platforms, this.enemies, () => this.checkTeamDefeat(), (s) => this.screenShake = s, (en, el, p, d) => this.applyElementalHit(en, el, p, d), this.levelWidth);
      if (this.isCoopMode && this.player2.hp > 0) {
        this.player2.update(this.keys['ArrowLeft'], this.keys['ArrowRight'], this.keys['ArrowUp'], platforms, this.enemies, () => this.checkTeamDefeat(), (s) => this.screenShake = s, (en, el, p, d) => this.applyElementalHit(en, el, p, d), this.levelWidth);
      }

      // Update Side-Scrolling Camera
      this.camera.update(this.player1, this.player2, this.isCoopMode, this.screenShake);

      // Check Progressive Stage Zones
      const focalX = Math.max(this.player1.x, this.isCoopMode && this.player2.hp > 0 ? this.player2.x : 0);
      hudManager.updateProgress(focalX, this.levelWidth);

      if (focalX > 750 && !this.spawnedZones[2]) {
        this.spawnedZones[2] = true;
        this.spawnZoneWave(2, 750);
      }
      if (focalX > 1550 && !this.spawnedZones[3]) {
        this.spawnedZones[3] = true;
        this.spawnZoneWave(3, 1550);
      }
      if (focalX > 2350 && !this.spawnedZones[4]) {
        this.spawnedZones[4] = true;
        this.spawnZoneWave(4, 2350);
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

      relicManager.update();

      // Projectiles
      for (let i = this.projectiles.length - 1; i >= 0; i--) {
        const p = this.projectiles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        for (let j = this.enemies.length - 1; j >= 0; j--) {
          const en = this.enemies[j];
          if (p.x > en.x && p.x < en.x + en.w && p.y > en.y && p.y < en.y + en.h) {
            // Shield deflection for Viking if hitting from front
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
            owner.ultCharge = Math.min(100, owner.ultCharge + 3);

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
            owner.ultCharge = Math.min(100, owner.ultCharge + 5);

            this.applyElementalHit(en, m.element, m.owner, finalDmg);

            this.combo++;
            this.score += 20 * this.combo;
          }
        }
        if (m.life <= 0) this.meleeHits.splice(i, 1);
      }

      // Enemy Projectiles
      for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
        const ep = this.enemyProjectiles[i];
        ep.x += ep.vx;
        ep.y += ep.vy;
        ep.life--;

        if (this.player1.hp > 0 && ep.x > this.player1.x && ep.x < this.player1.x + this.player1.w && ep.y > this.player1.y && ep.y < this.player1.y + this.player1.h) {
          this.player1.takeDamage(ep.damage, () => this.checkTeamDefeat(), (s) => this.screenShake = s);
          ep.life = 0;
        }
        if (this.isCoopMode && this.player2.hp > 0 && ep.x > this.player2.x && ep.x < this.player2.x + this.player2.w && ep.y > this.player2.y && ep.y < this.player2.y + this.player2.h) {
          this.player2.takeDamage(ep.damage, () => this.checkTeamDefeat(), (s) => this.screenShake = s);
          ep.life = 0;
        }
        if (ep.life <= 0) this.enemyProjectiles.splice(i, 1);
      }

      // Enemies Update (Walking Ground Physics & AI)
      let activeBoss = null;
      let hasBossSpawned = !!this.spawnedZones[4];

      for (let i = this.enemies.length - 1; i >= 0; i--) {
        const en = this.enemies[i];
        if (en instanceof BossEntity) {
          activeBoss = en;
          en.update(this.enemyProjectiles, (s) => this.screenShake = s);
        } else {
          en.update(this.player1, this.player2, this.isCoopMode, this.enemyProjectiles, platforms, (s) => this.screenShake = s);
        }

        if (en.hp <= 0) {
          particles.createSparks(en.x + en.w/2, en.y + en.h/2, '#00f0ff', 20);
          this.score += 100;
          this.player1.ultCharge = Math.min(100, this.player1.ultCharge + 10);
          if (this.isCoopMode) this.player2.ultCharge = Math.min(100, this.player2.ultCharge + 10);

          if (Math.random() < 0.45) relicManager.spawn(en.x, en.y);
          this.enemies.splice(i, 1);
        }
      }

      // Level victory check: Boss defeated in zone 4
      if (hasBossSpawned && !activeBoss && this.enemies.length === 0) {
        this.finishLevel(true);
      }

      particles.update();

      if (this.ultEffect) {
        this.ultEffect.timer--;
        if (this.ultEffect.timer <= 0) this.ultEffect = null;
      }

      hudManager.updateHUD(this.player1, this.player2, this.isCoopMode, this.score, activeBoss);
    }

    // Weather Particles
    for (const w of this.weatherParticles) {
      w.y += w.speed;
      if (w.y > H) {
        w.y = -10;
        w.x = Math.random() * W;
      }
    }
  }

  drawParallaxBackground() {
    const bgImg = this.bgImages[this.currentLevel];
    const parallaxOffset = -(this.camera.x * 0.35) % W;

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
  }

  render() {
    ctx.save();

    // 1. Draw Parallax Background (Screenspace)
    this.drawParallaxBackground();

    // Weather Particles (Screenspace)
    ctx.fillStyle = this.currentLevel === 'kiruna' ? '#ffffff' : (this.currentLevel === 'visby' ? 'rgba(168, 85, 247, 0.4)' : 'rgba(125, 211, 252, 0.4)');
    for (const w of this.weatherParticles) {
      ctx.fillRect(w.x, w.y, w.size, this.currentLevel === 'kiruna' ? w.size : w.size * 4);
    }

    // 2. World Space Transformation (Camera Tracking + Shake)
    const shake = this.camera.getShakeOffset();
    ctx.save();
    ctx.translate(-Math.round(this.camera.x) + shake.sx, -Math.round(this.camera.y) + shake.sy);

    // Platforms & Continuous Ground
    const lvlData = LEVELS[this.currentLevel];
    const platforms = lvlData ? lvlData.platforms : [];

    // Continuous Ground Floor
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.fillRect(0, 490, this.levelWidth, 130);

    ctx.fillStyle = lvlData ? lvlData.color : '#00f0ff';
    for (let x = 0; x < this.levelWidth; x += 40) ctx.fillRect(x, 490, 20, 4);

    // Raised Platforms
    for (let i = 1; i < platforms.length; i++) {
      const p = platforms[i];
      if (this.camera.isVisible(p.x, p.w)) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = lvlData ? lvlData.color : '#38bdf8';
        ctx.lineWidth = 2;
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.strokeRect(p.x, p.y, p.w, p.h);
      }
    }

    relicManager.draw(ctx);

    // Projectiles
    for (const p of this.projectiles) {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      if (p.type === 'binary') {
        ctx.font = 'bold 16px monospace';
        ctx.fillText(p.char, p.x, p.y);
      } else if (p.type === 'wave') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 14, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'crescent') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 12, 0.5, 2.5);
        ctx.lineWidth = 4;
        ctx.strokeStyle = p.color;
        ctx.stroke();
      } else if (p.type === 'dagger') {
        ctx.fillRect(p.x - 8, p.y - 2, 16, 4);
      }
      ctx.shadowBlur = 0;
    }

    for (const m of this.meleeHits) {
      ctx.fillStyle = m.color;
      ctx.globalAlpha = 0.4;
      ctx.fillRect(m.x, m.y, m.w, m.h);
      ctx.globalAlpha = 1.0;
    }

    // Enemy Projectiles & Ground Shockwaves
    for (const ep of this.enemyProjectiles) {
      if (ep.isGroundWave) {
        // Traveling Stone Shockwave Spikes
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.moveTo(ep.x - 12, 490);
        ctx.lineTo(ep.x, 460);
        ctx.lineTo(ep.x + 12, 490);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#d97706';
        ctx.fillRect(ep.x - 4, 464, 8, 26);
      } else {
        ctx.fillStyle = ep.color;
        ctx.shadowColor = ep.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(ep.x, ep.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Draw Enemies & Bosses
    for (const en of this.enemies) en.draw(ctx);

    if (this.isPlaying) {
      this.player1.draw(ctx);
      if (this.isCoopMode) this.player2.draw(ctx);
    }

    particles.draw(ctx);

    ctx.restore(); // Restore world transform

    // 3. Screenspace UI Overlays (Ult effect, etc.)
    if (this.ultEffect) {
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = this.ultEffect.color;
      ctx.font = 'bold 26px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`⚡ ${this.ultEffect.name} ⚡`, W/2, 100);
      ctx.textAlign = 'left';
    }

    ctx.restore();
  }
}

const game = new GameManager();

function mainLoop() {
  game.update();
  game.render();
  requestAnimationFrame(mainLoop);
}
mainLoop();
