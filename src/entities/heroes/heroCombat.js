import { sound } from '../../engine/Audio.js';
import { particles } from '../../engine/Particles.js';
import { buffManager } from '../Powerups.js';
import { shopManager } from '../Shop.js';
import { elementalManager } from '../ElementalEffects.js';

/**
 * HERO COMBAT & SUPERPOWERS ENGINE
 * Implements unique combat styles, distinct primary attacks, passive mechanics,
 * special skills (Q, E, Dash), and devastating Superpowers (Ultimates)
 * for all 12 Zodiac Heroes.
 */
export const HERO_COMBAT = {
  // ==========================================
  // 1. ARIES (♈ KIRUNA / FIRE BERSERKER)
  // Combat Style: Heavy Cleaving Axe & Molten Ground Fissures
  // Superpower: Subterranean Magma Cataclysm
  // ==========================================
  aries: {
    attack(p, projectiles, meleeHits, onShake) {
      sound.playSword();
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();
      // Berserker fury bonus: deals up to +50% extra damage as HP drops
      const furyMult = 1 + (1 - p.hp / p.maxHp) * 0.5;
      const dmg = Math.floor(34 * dmgMult * furyMult);

      // Heavy wide cleave hitbox
      meleeHits.push({
        x: p.x + (p.facing > 0 ? p.w : -48),
        y: p.y - 6,
        w: 52,
        h: 56,
        damage: dmg,
        color: '#f97316',
        element: 'fire',
        owner: p.pIndex,
        life: 8
      });

      // Fiery axe cleave arc particles
      particles.createSparks(p.x + (p.facing > 0 ? p.w + 24 : -24), p.y + 20, '#ea580c', 14);
      particles.createSparks(p.x + (p.facing > 0 ? p.w + 30 : -30), p.y + 24, '#facc15', 8);

      // Chance to release a short creeping flame wave
      if (Math.random() < 0.45) {
        projectiles.push({
          x: p.x + (p.facing > 0 ? p.w + 10 : -10),
          y: p.y + 36,
          vx: p.facing * 9,
          vy: 0,
          type: 'wave',
          color: '#f97316',
          element: 'fire',
          owner: p.pIndex,
          damage: Math.floor(18 * dmgMult),
          life: 25
        });
      }
    },

    castQ(p, projectiles, onShake) {
      sound.playFireBurst();
      if (onShake) onShake(12);
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();
      const dmg = Math.floor(54 * dmgMult);

      // Flame Fissure: 4 rising volcanic magma geysers tearing along the ground
      elementalManager.spawnMagmaGeysers(p.x, p.y + p.h, p.facing, 4, 60, dmg, p.pIndex);
      particles.createFlame(p.x + p.w / 2, p.y + p.h - 10, 15);
    },

    castE(p, enemies, onSynergyHit, onShake) {
      sound.playRoar();
      if (onShake) onShake(14);
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();

      // Ram Charge Tackle: sudden forward thrust + volcanic eruption
      p.vx = p.facing * 18;
      p.invulnTime = 16;
      particles.createTrail(p.x, p.y, p.w, p.h, '#ea580c');

      const radius = 180;
      for (const en of enemies) {
        const dist = Math.hypot((en.x + en.w / 2) - (p.x + p.w / 2), (en.y + en.h / 2) - (p.y + p.h / 2));
        if (dist < radius) {
          const dmg = Math.floor(65 * dmgMult);
          en.hp -= dmg;
          en.stunTimer = 70;
          en.vy = -7; // Knocks enemies up into the air
          en.vx = p.facing * 8;
          particles.createDamageNumber(en.x + en.w / 2, en.y, `ERUPTION! -${dmg} 🌋`, '#ea580c');
          particles.createSparks(en.x + en.w / 2, en.y + en.h / 2, '#f97316', 20);
          if (onSynergyHit) onSynergyHit(en, 'fire', p.pIndex, dmg);
        }
      }
    },

    castDash(p) {
      p.isDashing = 12;
      p.invulnTime = 16;
      sound.playLaser();
      // Molten wake
      particles.createSparks(p.x, p.y + 35, '#ea580c', 16);
    },

    castUlt(p, enemies, onSynergyHit, onUltEffect, onShake, levelW, screenH, projectiles) {
      sound.playUlt();
      sound.playRoar();
      sound.playFireBurst();
      if (onShake) onShake(28);

      if (onUltEffect) {
        onUltEffect({
          name: 'SUBTERRANEAN MAGMA CATACLYSM',
          color: '#ea580c',
          timer: 85
        });
      }

      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();
      const ultDamage = Math.floor(160 * dmgMult);

      // Erupts 8 titanic magma geysers across the arena
      elementalManager.spawnMagmaGeysers(p.x - 300, p.y + p.h, 1, 8, 85, ultDamage, p.pIndex);

      for (const en of enemies) {
        en.hp -= ultDamage;
        en.burnTimer = 180;
        en.stunTimer = 120;
        en.vy = -12;
        particles.createDamageNumber(en.x + en.w / 2, en.y - 12, `CATACLYSM! -${ultDamage} 🌋`, '#ea580c');
        particles.createFlame(en.x + en.w / 2, en.y + en.h / 2, 20);
        if (onSynergyHit) onSynergyHit(en, 'fire', p.pIndex, ultDamage);
      }
    },

    updatePassive(p, enemies, particles, sound, gameTime) {
      // Passive: Molten Resurgence - leaves fiery embers when running, emits heat pulse
      if (p.isGrounded && Math.abs(p.vx) > 0.5 && gameTime % 12 === 0) {
        particles.createSparks(p.x + p.w / 2 - p.facing * 10, p.y + p.h - 4, '#ea580c', 2);
      }
    }
  },

  // ==========================================
  // 2. TAURUS (♉ FALUN / COPPER JUGGERNAUT)
  // Combat Style: Heavy Bronze Maul & Runic Boulder Smashes
  // Superpower: Wrath of Falun Mountain
  // ==========================================
  taurus: {
    attack(p, projectiles, meleeHits, onShake) {
      sound.playHammer();
      if (onShake) onShake(6);
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();
      const dmg = Math.floor(38 * dmgMult);

      // Enormous hammer smash with ground crater
      meleeHits.push({
        x: p.x + (p.facing > 0 ? p.w : -54),
        y: p.y + 4,
        w: 58,
        h: 52,
        damage: dmg,
        color: '#d97706',
        element: 'earth',
        owner: p.pIndex,
        life: 9
      });

      particles.createSparks(p.x + (p.facing > 0 ? p.w + 20 : -20), p.y + 36, '#b45309', 18);
      particles.createSparks(p.x + (p.facing > 0 ? p.w + 20 : -20), p.y + 36, '#facc15', 8);
    },

    castQ(p, projectiles, onShake) {
      sound.playEarthQuake();
      if (onShake) onShake(16);
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();
      const dmg = Math.floor(65 * dmgMult);

      // Tectonic Seismic Quake: 4 colossal stone monoliths burst out of the ground, launch & petrify!
      elementalManager.spawnEarthPillars(p.x, p.y + p.h, p.facing, 4, 65, dmg, p.pIndex);
      particles.createEarthDebris(p.x + p.w / 2, p.y + p.h, 24);
    },

    castE(p, enemies, onSynergyHit, onShake, projectiles) {
      sound.playHammer();
      if (onShake) onShake(15);
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();

      // 360° Maul Whirl: throws 4 heavy boulders in all directions
      const angles = [-0.6, -0.2, 0.2, 0.6];
      for (const a of angles) {
        projectiles.push({
          x: p.x + p.w / 2,
          y: p.y + 20,
          vx: p.facing * Math.cos(a) * 11,
          vy: Math.sin(a) * 8 - 4,
          type: 'boulder',
          color: '#d97706',
          element: 'earth',
          owner: p.pIndex,
          damage: Math.floor(52 * dmgMult),
          life: 50
        });
      }

      const radius = 175;
      for (const en of enemies) {
        const dist = Math.hypot((en.x + en.w / 2) - (p.x + p.w / 2), (en.y + en.h / 2) - (p.y + p.h / 2));
        if (dist < radius) {
          const dmg = Math.floor(60 * dmgMult);
          en.hp -= dmg;
          en.stunTimer = 80;
          en.vx = Math.sign(en.x - p.x) * 10;
          particles.createDamageNumber(en.x + en.w / 2, en.y, `SMASH! -${dmg} 🪨`, '#d97706');
          if (onSynergyHit) onSynergyHit(en, 'earth', p.pIndex, dmg);
        }
      }
      particles.createSparks(p.x + p.w / 2, p.y + 25, '#d97706', 35);
    },

    castDash(p) {
      // Tectonic Bull Charge
      p.isDashing = 14;
      p.invulnTime = 18;
      sound.playHammer();
      particles.createTrail(p.x, p.y, p.w, p.h, '#d97706');
    },

    castUlt(p, enemies, onSynergyHit, onUltEffect, onShake) {
      sound.playUlt();
      sound.playEarthQuake();
      if (onShake) onShake(32);

      if (onUltEffect) {
        onUltEffect({
          name: 'WRATH OF FALUN MOUNTAIN',
          color: '#d97706',
          timer: 85
        });
      }

      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();
      const ultDamage = Math.floor(165 * dmgMult);

      // Apocalyptic earthquake: 7 stone monoliths burst across arena floor
      elementalManager.spawnEarthPillars(p.x - 320, p.y + p.h, 1, 7, 95, ultDamage, p.pIndex);

      for (const en of enemies) {
        en.hp -= ultDamage;
        en.petrifiedTimer = 130;
        en.stunTimer = 140;
        en.vy = -14;
        particles.createDamageNumber(en.x + en.w / 2, en.y - 14, `FALUN MONOLITH! -${ultDamage} ⛰️`, '#d97706');
        particles.createEarthDebris(en.x + en.w / 2, en.y + en.h / 2, 20);
        if (onSynergyHit) onSynergyHit(en, 'earth', p.pIndex, ultDamage);
      }
      particles.createSparks(p.x + p.w / 2, p.y + p.h / 2, '#d97706', 60);
    },

    updatePassive(p, enemies, particles, sound, gameTime) {
      // Passive: Tectonic Bastion - immune to pushback, gives bronze shield buff periodically
      if (gameTime % 240 === 0 && !p.hasTaurusPlating) {
        p.hasTaurusPlating = true;
        particles.createSparks(p.x + p.w / 2, p.y + 20, '#d97706', 10);
      }
    }
  },

  // ==========================================
  // 3. GEMINI (♊ MALMÖ / WIND SKIRMISHER)
  // Combat Style: Twin Boomerang Chakrams & Aerial Wind Shears
  // Superpower: Supersonic Tempest Cataclysm
  // ==========================================
  gemini: {
    attack(p, projectiles, meleeHits, onShake) {
      sound.playLaser();
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();
      const dmg = Math.floor(22 * dmgMult);

      // Throws dual spinning returning chakrams
      projectiles.push({
        x: p.x + (p.facing > 0 ? p.w + 4 : -12),
        y: p.y + 16,
        vx: p.facing * 13,
        vy: -0.5,
        type: 'chakram',
        color: '#38bdf8',
        element: 'wind',
        owner: p.pIndex,
        damage: dmg,
        life: 55,
        isBoomerang: true,
        startX: p.x,
        facing: p.facing
      });

      projectiles.push({
        x: p.x + (p.facing > 0 ? p.w + 4 : -12),
        y: p.y + 26,
        vx: p.facing * 11,
        vy: 0.5,
        type: 'chakram',
        color: '#7dd3fc',
        element: 'wind',
        owner: p.pIndex,
        damage: dmg,
        life: 55,
        isBoomerang: true,
        startX: p.x,
        facing: p.facing
      });

      particles.createSparks(p.x + (p.facing > 0 ? p.w + 8 : -8), p.y + 20, '#38bdf8', 8);
    },

    castQ(p, projectiles, onShake) {
      sound.playWindGale();
      if (onShake) onShake(10);
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();
      const dmg = Math.floor(52 * dmgMult);

      // Cyclone Tornado: moving swirling vortex that vacuums enemies, spins them, and shreds
      elementalManager.spawnTornado(p.x + p.facing * 35, p.y + p.h, p.facing, dmg, 130, p.pIndex);
      particles.createWindGale(p.x + p.w / 2, p.y + 20, p.facing, 16);
    },

    castE(p, enemies, onSynergyHit, onShake) {
      sound.playWindGale();
      if (onShake) onShake(14);
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();

      // Supersonic Gale Blast: ferocious hurricane wind that BLOWS ALL ENEMIES AWAY!
      p.x += p.facing * 100;
      p.invulnTime = 18;
      particles.createWindGale(p.x, p.y + 20, p.facing, 24);

      for (const en of enemies) {
        const dx = (en.x + en.w / 2) - p.x;
        // All enemies in facing direction within 360px
        if (Math.sign(dx) === p.facing && Math.abs(dx) < 360 && Math.abs(en.y - p.y) < 140) {
          const dmg = Math.floor(62 * dmgMult);
          en.hp -= dmg;
          // ВЕТРОМ СДУВАЕТ ЧЕРЕЗ ВЕСЬ ЭКРАН!
          en.windBlowTimer = 55;
          en.windBlowVx = p.facing * 20;
          en.vy = -7;
          en.stunTimer = 65;
          particles.createDamageNumber(en.x + en.w / 2, en.y, `GALE FORCE! -${dmg} 🌪️`, '#38bdf8');
          particles.createWindGale(en.x + en.w / 2, en.y + en.h / 2, p.facing, 14);
          if (onSynergyHit) onSynergyHit(en, 'wind', p.pIndex, dmg);
        }
      }
    },

    castDash(p) {
      // Öresund Gale Rush: high-velocity double dash
      p.isDashing = 13;
      p.invulnTime = 16;
      sound.playLaser();
      particles.createSparks(p.x, p.y + 20, '#38bdf8', 14);
    },

    castUlt(p, enemies, onSynergyHit, onUltEffect, onShake, levelW, screenH, projectiles) {
      sound.playUlt();
      sound.playWindGale();
      if (onShake) onShake(28);

      if (onUltEffect) {
        onUltEffect({
          name: 'SUPERSONIC TEMPEST CATACLYSM',
          color: '#38bdf8',
          timer: 85
        });
      }

      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();
      const ultDamage = Math.floor(155 * dmgMult);

      // Twin colossal tornadoes sweeping from left and right
      elementalManager.spawnTornado(p.x - 220, p.y + p.h, 1, ultDamage, 150, p.pIndex, true);
      elementalManager.spawnTornado(p.x + 220, p.y + p.h, -1, ultDamage, 150, p.pIndex, true);

      for (const en of enemies) {
        en.hp -= ultDamage;
        en.windBlowTimer = 75;
        en.windBlowVx = (Math.random() > 0.5 ? 1 : -1) * 18;
        en.vy = -14;
        en.stunTimer = 130;
        particles.createDamageNumber(en.x + en.w / 2, en.y - 12, `TEMPEST! -${ultDamage} 🌪️`, '#38bdf8');
        particles.createWindGale(en.x + en.w / 2, en.y + en.h / 2, p.facing, 18);
        if (onSynergyHit) onSynergyHit(en, 'wind', p.pIndex, ultDamage);
      }
      particles.createSparks(p.x + p.w / 2, p.y + p.h / 2, '#7dd3fc', 60);
    },

    updatePassive(p, enemies, particles, sound, gameTime) {
      // Passive: Zephyr Velocity - mid-air acrobatic glide
      if (!p.isGrounded && Math.abs(p.vx) > 1 && gameTime % 8 === 0) {
        particles.createSparks(p.x + p.w / 2, p.y + p.h - 5, '#38bdf8', 2);
      }
    }
  },

  // ==========================================
  // 4. CANCER (♋ MARSTRAND / WATER BULWARK)
  // Combat Style: Granite Carapace Shield & Titanium Harpoon
  // Superpower: Great Kattegat Tsunami
  // ==========================================
  cancer: {
    attack(p, projectiles, meleeHits, onShake) {
      sound.playSword();
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();
      const dmg = Math.floor(30 * dmgMult);

      // Shield bash + thrusting harpoon pierce
      meleeHits.push({
        x: p.x + (p.facing > 0 ? p.w : -46),
        y: p.y + 8,
        w: 50,
        h: 44,
        damage: dmg,
        color: '#0ea5e9',
        element: 'water',
        owner: p.pIndex,
        life: 8
      });

      // Water splash particles
      particles.createSparks(p.x + (p.facing > 0 ? p.w + 20 : -20), p.y + 24, '#0ea5e9', 15);
      particles.createSparks(p.x + (p.facing > 0 ? p.w + 20 : -20), p.y + 24, '#e0f2fe', 8);
    },

    castQ(p, projectiles, onShake) {
      sound.playWave();
      if (onShake) onShake(8);
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();

      // Ocean Harpoon Pull: chained titanium harpoon that impales & drags
      projectiles.push({
        x: p.x + (p.facing > 0 ? p.w + 10 : -24),
        y: p.y + 20,
        vx: p.facing * 16,
        vy: 0,
        type: 'harpoon',
        color: '#0ea5e9',
        element: 'water',
        owner: p.pIndex,
        damage: Math.floor(48 * dmgMult),
        life: 45,
        isPullHarpoon: true
      });
      particles.createSparks(p.x + p.w / 2, p.y + 20, '#0ea5e9', 18);
    },

    castE(p, enemies, onSynergyHit, onShake) {
      sound.playFreeze();
      sound.playWave();
      if (onShake) onShake(14);
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();

      // Tidal Coral Fortress & Frost Nova: shields Cancer and FREEZES all surrounding enemies solid!
      p.invulnTime = 50;
      p.hp = Math.min(p.maxHp, p.hp + 25);
      particles.createDamageNumber(p.x + p.w / 2, p.y - 14, '+25 HP! 🐚', '#38bdf8');

      const radius = 200;
      for (const en of enemies) {
        const dist = Math.hypot((en.x + en.w / 2) - (p.x + p.w / 2), (en.y + en.h / 2) - (p.y + p.h / 2));
        if (dist < radius) {
          const dmg = Math.floor(58 * dmgMult);
          en.hp -= dmg;
          // FREEZE SOLID IN AN ICE BLOCK!
          en.frozenTimer = 120;
          en.stunTimer = 120;
          particles.createIceShards(en.x + en.w / 2, en.y + en.h / 2, 22);
          particles.createDamageNumber(en.x + en.w / 2, en.y, `FROST NOVA! -${dmg} ❄️`, '#00f0ff');
          if (onSynergyHit) onSynergyHit(en, 'water', p.pIndex, dmg);
        }
      }
      particles.createSparks(p.x + p.w / 2, p.y + p.h / 2, '#0ea5e9', 40);
    },

    castDash(p) {
      // Carapace Scuttle Rush
      p.isDashing = 12;
      p.invulnTime = 18;
      sound.playWave();
      particles.createTrail(p.x, p.y, p.w, p.h, '#0ea5e9');
    },

    castUlt(p, enemies, onSynergyHit, onUltEffect, onShake, levelW, screenH, projectiles) {
      sound.playUlt();
      sound.playWave();
      sound.playFreeze();
      if (onShake) onShake(30);

      if (onUltEffect) {
        onUltEffect({
          name: 'GREAT KATTEGAT TSUNAMI',
          color: '#0ea5e9',
          timer: 85
        });
      }

      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();
      const ultDamage = Math.floor(165 * dmgMult);

      // Towering Great Kattegat Tsunami that surges across the entire screen!
      elementalManager.spawnTsunami(p.x - p.facing * 100, p.y + p.h, p.facing, ultDamage, 150, p.pIndex, true);

      for (const en of enemies) {
        en.hp -= ultDamage;
        en.frozenTimer = 140; // Glacial frost encasement
        en.stunTimer = 140;
        en.vx = p.facing * 20;
        particles.createDamageNumber(en.x + en.w / 2, en.y - 12, `TSUNAMI FREEZE! -${ultDamage} 🌊 ❄️`, '#0ea5e9');
        particles.createIceShards(en.x + en.w / 2, en.y + en.h / 2, 25);
        if (onSynergyHit) onSynergyHit(en, 'water', p.pIndex, ultDamage);
      }
      particles.createSparks(p.x + p.w / 2, p.y + p.h / 2, '#38bdf8', 60);
    },

    updatePassive(p, enemies, particles, sound, gameTime) {
      // Passive: Abyssal Shell - retaliates with water needles
      if (p.invulnTime > 0 && gameTime % 10 === 0) {
        particles.createSparks(p.x + p.w / 2, p.y + 20, '#0ea5e9', 4);
      }
    }
  },

  // ==========================================
  // 5. LEO (♌ STOCKHOLM / SOLAR CHAMPION)
  // Combat Style: Radiant Sunblade Slashes & Solar Plasma Beams
  // Superpower: Tre Kronor Solstice Judgement
  // ==========================================
  leo: {
    attack(p, projectiles, meleeHits, onShake) {
      sound.playSword();
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();
      const dmg = Math.floor(32 * dmgMult);

      // Radiant golden solar blade slash
      meleeHits.push({
        x: p.x + (p.facing > 0 ? p.w : -46),
        y: p.y - 2,
        w: 50,
        h: 48,
        damage: dmg,
        color: '#facc15',
        element: 'solar',
        owner: p.pIndex,
        life: 7
      });

      // Crescent solar blade projectile
      projectiles.push({
        x: p.x + (p.facing > 0 ? p.w + 6 : -14),
        y: p.y + 18,
        vx: p.facing * 12,
        vy: 0,
        type: 'orb',
        color: '#facc15',
        element: 'solar',
        owner: p.pIndex,
        damage: Math.floor(20 * dmgMult),
        life: 35
      });

      particles.createSparks(p.x + (p.facing > 0 ? p.w + 20 : -20), p.y + 20, '#facc15', 14);
      particles.createSparks(p.x + (p.facing > 0 ? p.w + 24 : -24), p.y + 20, '#ea580c', 8);
    },

    castQ(p, projectiles, onShake) {
      sound.playLaser();
      if (onShake) onShake(12);
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();
      const dmg = Math.floor(65 * dmgMult);

      // Solar Corona Beam: descending heavenly column of blinding solar plasma
      elementalManager.spawnSolarBeam(p.x + p.facing * 130, p.y + p.h, 75, dmg, 65, p.pIndex);
      particles.createFlame(p.x + p.facing * 130, p.y + 10, 16);
    },

    castE(p, enemies, onSynergyHit, onShake) {
      sound.playRoar();
      if (onShake) onShake(14);
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();

      // Lion's Crown Nova: blinding solar roar stunning and burning all around
      const radius = 190;
      for (const en of enemies) {
        const dist = Math.hypot((en.x + en.w / 2) - (p.x + p.w / 2), (en.y + en.h / 2) - (p.y + p.h / 2));
        if (dist < radius) {
          const dmg = Math.floor(62 * dmgMult);
          en.hp -= dmg;
          en.stunTimer = 85; // Blinds and stuns
          particles.createDamageNumber(en.x + en.w / 2, en.y, `SOLAR NOVA! -${dmg} ☀️`, '#facc15');
          if (onSynergyHit) onSynergyHit(en, 'solar', p.pIndex, dmg);
        }
      }
      particles.createSparks(p.x + p.w / 2, p.y + p.h / 2, '#facc15', 45);
      particles.createSparks(p.x + p.w / 2, p.y + p.h / 2, '#ca8a04', 30);
    },

    castDash(p) {
      // Solstice Step: blinding golden dash
      p.isDashing = 11;
      p.invulnTime = 15;
      sound.playLaser();
      particles.createTrail(p.x, p.y, p.w, p.h, '#facc15');
    },

    castUlt(p, enemies, onSynergyHit, onUltEffect, onShake) {
      sound.playUlt();
      sound.playRoar();
      if (onShake) onShake(30);

      if (onUltEffect) {
        onUltEffect({
          name: 'TRE KRONOR SOLSTICE JUDGEMENT',
          color: '#facc15',
          timer: 85
        });
      }

      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();
      const ultDamage = Math.floor(165 * dmgMult);

      // 3 Royal Solstice Solar Columns descending from the sky
      elementalManager.spawnSolarBeam(p.x - 140, p.y + p.h, 80, ultDamage, 80, p.pIndex);
      elementalManager.spawnSolarBeam(p.x, p.y + p.h, 95, ultDamage, 85, p.pIndex);
      elementalManager.spawnSolarBeam(p.x + 140, p.y + p.h, 80, ultDamage, 80, p.pIndex);

      for (const en of enemies) {
        en.hp -= ultDamage;
        en.burnTimer = 180;
        en.stunTimer = 130;
        particles.createDamageNumber(en.x + en.w / 2, en.y - 12, `TRE KRONOR! -${ultDamage} 👑 🔥`, '#facc15');
        particles.createFlame(en.x + en.w / 2, en.y + en.h / 2, 25);
        if (onSynergyHit) onSynergyHit(en, 'solar', p.pIndex, ultDamage);
      }
      particles.createSparks(p.x + p.w / 2, p.y + p.h / 2, '#fef08a', 70);
    },

    updatePassive(p, enemies, particles, sound, gameTime) {
      // Passive: Coronal Radiance - burns adjacent enemies
      if (gameTime % 25 === 0) {
        for (const en of enemies) {
          const dist = Math.hypot((en.x + en.w / 2) - (p.x + p.w / 2), (en.y + en.h / 2) - (p.y + p.h / 2));
          if (dist < 80) {
            en.hp -= 4;
            particles.createSparks(en.x + en.w / 2, en.y + 10, '#facc15', 2);
          }
        }
      }
    }
  },

  // ==========================================
  // 6. VIRGO (♍ UPPSALA / NATURE SNIPER)
  // Combat Style: Verdant Longbow of Yggdrasil & Thorny Roots
  // Superpower: Wrath of Yggdrasil
  // ==========================================
  virgo: {
    attack(p, projectiles, meleeHits, onShake) {
      sound.playLaser();
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();
      const dmg = Math.floor(28 * dmgMult);

      // Fires high-velocity verdant enchanted arrow
      projectiles.push({
        x: p.x + (p.facing > 0 ? p.w + 6 : -14),
        y: p.y + 18,
        vx: p.facing * 15,
        vy: 0,
        type: 'arrow',
        color: '#4ade80',
        element: 'nature',
        owner: p.pIndex,
        damage: dmg,
        life: 55,
        pierce: 2
      });

      particles.createSparks(p.x + (p.facing > 0 ? p.w + 10 : -10), p.y + 18, '#4ade80', 10);
    },

    castQ(p, projectiles, onShake) {
      sound.playWave();
      if (onShake) onShake(8);
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();
      const dmg = Math.floor(48 * dmgMult);

      // Yggdrasil Brambles: sprouts creeping thorny roots from the ground, ROOTING enemies in place
      elementalManager.spawnBriarPatch(p.x + p.facing * 110, p.y + p.h, dmg, 180, p.pIndex);
      particles.createLeaves(p.x + p.facing * 110, p.y + p.h - 10, 18);
    },

    castE(p, enemies, onSynergyHit, onShake) {
      sound.playItem();
      if (onShake) onShake(10);
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();

      // Yggdrasil Grove Bloom: sprouts flower grove healing players and poisoning enemies
      p.hp = Math.min(p.maxHp, p.hp + 25);
      particles.createDamageNumber(p.x + p.w / 2, p.y - 14, '+25 HP! 🌸', '#4ade80');

      const radius = 180;
      for (const en of enemies) {
        const dist = Math.hypot((en.x + en.w / 2) - (p.x + p.w / 2), (en.y + en.h / 2) - (p.y + p.h / 2));
        if (dist < radius) {
          const dmg = Math.floor(50 * dmgMult);
          en.hp -= dmg;
          en.stunTimer = 80;
          particles.createDamageNumber(en.x + en.w / 2, en.y, `GROVE THORNS! -${dmg} 🌿`, '#4ade80');
          if (onSynergyHit) onSynergyHit(en, 'nature', p.pIndex, dmg);
        }
      }
      particles.createSparks(p.x + p.w / 2, p.y + p.h / 2, '#4ade80', 35);
    },

    castDash(p) {
      // Forest Phantom Flit: dissolves into golden birch leaves
      p.isDashing = 11;
      p.invulnTime = 16;
      sound.playLaser();
      particles.createSparks(p.x, p.y + 20, '#4ade80', 16);
    },

    castUlt(p, enemies, onSynergyHit, onUltEffect, onShake) {
      sound.playUlt();
      sound.playWave();
      if (onShake) onShake(28);

      if (onUltEffect) {
        onUltEffect({
          name: 'WRATH OF YGGDRASIL',
          color: '#4ade80',
          timer: 85
        });
      }

      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();
      const ultDamage = Math.floor(155 * dmgMult);

      // Ancient world tree briar patches across the entire floor
      elementalManager.spawnBriarPatch(p.x - 180, p.y + p.h, ultDamage, 200, p.pIndex);
      elementalManager.spawnBriarPatch(p.x, p.y + p.h, ultDamage, 200, p.pIndex);
      elementalManager.spawnBriarPatch(p.x + 180, p.y + p.h, ultDamage, 200, p.pIndex);

      for (const en of enemies) {
        en.hp -= ultDamage;
        en.rootedTimer = 160;
        en.stunTimer = 140;
        particles.createDamageNumber(en.x + en.w / 2, en.y - 12, `YGGDRASIL ROOTS! -${ultDamage} 🌿`, '#4ade80');
        particles.createLeaves(en.x + en.w / 2, en.y + en.h / 2, 25);
        if (onSynergyHit) onSynergyHit(en, 'nature', p.pIndex, ultDamage);
      }
      particles.createSparks(p.x + p.w / 2, p.y + p.h / 2, '#86efac', 60);
    },

    updatePassive(p, enemies, particles, sound, gameTime) {
      // Passive: Sylvan Briar - occasional leaf flutter
      if (gameTime % 20 === 0) {
        particles.createSparks(p.x + p.w / 2, p.y + p.h - 5, '#4ade80', 1);
      }
    }
  },

  // ==========================================
  // 7. LIBRA (♎ LUND / ASTRAL DISRUPTOR)
  // Combat Style: Gravity Scales & Orbiting Astral Orbs
  // Superpower: Lund Supernova Equilibrium
  // ==========================================
  libra: {
    attack(p, projectiles, meleeHits, onShake) {
      sound.playLaser();
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();
      const dmg = Math.floor(25 * dmgMult);

      // Fires dual orbiting light and shadow astral orbs
      projectiles.push({
        x: p.x + (p.facing > 0 ? p.w + 6 : -14),
        y: p.y + 14,
        vx: p.facing * 12,
        vy: -1.2,
        type: 'orb',
        color: '#818cf8',
        element: 'astral',
        owner: p.pIndex,
        damage: dmg,
        life: 50
      });

      projectiles.push({
        x: p.x + (p.facing > 0 ? p.w + 6 : -14),
        y: p.y + 26,
        vx: p.facing * 12,
        vy: 1.2,
        type: 'orb',
        color: '#c084fc',
        element: 'astral',
        owner: p.pIndex,
        damage: dmg,
        life: 50
      });

      particles.createSparks(p.x + (p.facing > 0 ? p.w + 10 : -10), p.y + 20, '#818cf8', 10);
    },

    castQ(p, projectiles, onShake) {
      sound.playWave();
      if (onShake) onShake(12);
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();
      const dmg = Math.floor(68 * dmgMult);

      // Gravitational Singularity: cosmic black hole that sucks in all enemies and detonates
      elementalManager.spawnSingularity(p.x + p.facing * 160, p.y + 10, dmg, 95, p.pIndex);
      particles.createSparks(p.x + p.facing * 160, p.y + 10, '#c084fc', 25);
    },

    castE(p, enemies, onSynergyHit, onShake) {
      sound.playWave();
      if (onShake) onShake(14);
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();

      // Cosmic Gravity Singularity: pulls all enemies on screen towards a cosmic well
      const targetX = p.x + p.facing * 140;
      const targetY = p.y;
      for (const en of enemies) {
        const dx = targetX - (en.x + en.w / 2);
        const dy = targetY - (en.y + en.h / 2);
        const dist = Math.hypot(dx, dy);
        if (dist < 260) {
          en.vx = Math.sign(dx) * 8;
          en.vy = -4;
          const dmg = Math.floor(54 * dmgMult);
          en.hp -= dmg;
          en.stunTimer = 80;
          particles.createDamageNumber(en.x + en.w / 2, en.y, `GRAVITY WELL! -${dmg} 🌌`, '#818cf8');
          if (onSynergyHit) onSynergyHit(en, 'astral', p.pIndex, dmg);
        }
      }
      particles.createSparks(targetX, targetY, '#818cf8', 45);
      particles.createSparks(targetX, targetY, '#4f46e5', 30);
    },

    castDash(p) {
      // Astral Warp: instantaneous quantum teleport
      p.x += p.facing * 90;
      p.isDashing = 8;
      p.invulnTime = 16;
      sound.playLaser();
      particles.createSparks(p.x, p.y + 20, '#818cf8', 20);
    },

    castUlt(p, enemies, onSynergyHit, onUltEffect, onShake) {
      sound.playUlt();
      if (onShake) onShake(30);

      if (onUltEffect) {
        onUltEffect({
          name: 'LUND SUPERNOVA EQUILIBRIUM',
          color: '#818cf8',
          timer: 85
        });
      }

      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();
      const ultDamage = Math.floor(165 * dmgMult);

      // Twin singularities collapsing in a stellar supernova
      elementalManager.spawnSingularity(p.x - 120, p.y, ultDamage, 80, p.pIndex);
      elementalManager.spawnSingularity(p.x + 120, p.y, ultDamage, 80, p.pIndex);

      for (const en of enemies) {
        en.hp -= ultDamage;
        en.stunTimer = 140;
        en.vy = -12;
        particles.createDamageNumber(en.x + en.w / 2, en.y - 12, `SUPERNOVA! -${ultDamage} 🌌 ⚖️`, '#818cf8');
        particles.createSparks(en.x + en.w / 2, en.y + en.h / 2, '#c7d2fe', 40);
        if (onSynergyHit) onSynergyHit(en, 'astral', p.pIndex, ultDamage);
      }
      particles.createSparks(p.x + p.w / 2, p.y + p.h / 2, '#c7d2fe', 60);
    },

    updatePassive(p, enemies, particles, sound, gameTime) {
      // Passive: Cosmic Equilibrium - sparkles around scales
      if (gameTime % 25 === 0) {
        particles.createSparks(p.x + p.w / 2, p.y + 10, '#818cf8', 2);
      }
    }
  },

  // ==========================================
  // 8. SCORPIO (♏ VISBY / POISON ASSASSIN)
  // Combat Style: Dual Visby Venom Daggers & Shadow Ambush
  // Superpower: Gothic Plague Miasma
  // ==========================================
  scorpio: {
    attack(p, projectiles, meleeHits, onShake) {
      sound.playPoison();
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();
      const dmg = Math.floor(26 * dmgMult);

      // Ultra-fast dual poison daggers
      meleeHits.push({
        x: p.x + (p.facing > 0 ? p.w : -40),
        y: p.y + 4,
        w: 42,
        h: 44,
        damage: dmg,
        color: '#a855f7',
        element: 'poison',
        owner: p.pIndex,
        life: 6
      });

      // Toxic stinger dart
      projectiles.push({
        x: p.x + (p.facing > 0 ? p.w + 6 : -14),
        y: p.y + 18,
        vx: p.facing * 14,
        vy: 0,
        type: 'dagger',
        color: '#a855f7',
        element: 'poison',
        owner: p.pIndex,
        damage: Math.floor(18 * dmgMult),
        life: 45
      });

      particles.createSparks(p.x + (p.facing > 0 ? p.w + 14 : -14), p.y + 20, '#a855f7', 12);
    },

    castQ(p, projectiles, onShake) {
      sound.playPoison();
      if (onShake) onShake(6);
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();

      // Venom Needle Fan: throws 5 toxic darts in an arc
      for (let i = -2; i <= 2; i++) {
        projectiles.push({
          x: p.x + (p.facing > 0 ? p.w + 8 : -16),
          y: p.y + 20 + i * 6,
          vx: p.facing * 13,
          vy: i * 2,
          type: 'dagger',
          color: '#a855f7',
          element: 'poison',
          owner: p.pIndex,
          damage: Math.floor(34 * dmgMult),
          life: 50
        });
      }
      particles.createSparks(p.x + p.w / 2, p.y + 20, '#a855f7', 20);
    },

    castE(p, enemies, onSynergyHit, onShake) {
      sound.playPoison();
      if (onShake) onShake(12);
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();

      // Shadow Stinger Ambush: teleports directly behind the nearest enemy
      let nearestEn = null;
      let minDist = 9999;
      for (const en of enemies) {
        const d = Math.hypot((en.x + en.w / 2) - (p.x + p.w / 2), (en.y + en.h / 2) - (p.y + p.h / 2));
        if (d < minDist) {
          minDist = d;
          nearestEn = en;
        }
      }

      if (nearestEn && minDist < 350) {
        particles.createSparks(p.x, p.y, '#7e22ce', 20);
        p.x = nearestEn.x + (nearestEn.facing > 0 ? -40 : nearestEn.w + 10);
        p.facing = nearestEn.facing > 0 ? 1 : -1;
        p.invulnTime = 20;

        const dmg = Math.floor(75 * dmgMult);
        nearestEn.hp -= dmg;
        nearestEn.stunTimer = 90;
        particles.createDamageNumber(nearestEn.x + nearestEn.w / 2, nearestEn.y, `BACKSTAB! -${dmg} 🦂`, '#a855f7');
        particles.createSparks(nearestEn.x + nearestEn.w / 2, nearestEn.y + nearestEn.h / 2, '#a855f7', 30);
        if (onSynergyHit) onSynergyHit(nearestEn, 'poison', p.pIndex, dmg);
      } else {
        // Fallback short smoke warp
        p.x += p.facing * 100;
        p.invulnTime = 16;
        particles.createSparks(p.x, p.y, '#a855f7', 20);
      }
    },

    castDash(p) {
      // Phantom Shadow Stride: leaves exploding smoke decoy
      p.isDashing = 11;
      p.invulnTime = 16;
      sound.playPoison();
      particles.createTrail(p.x, p.y, p.w, p.h, '#7e22ce');
    },

    castUlt(p, enemies, onSynergyHit, onUltEffect, onShake) {
      sound.playUlt();
      sound.playPoison();
      if (onShake) onShake(26);

      if (onUltEffect) {
        onUltEffect({
          name: 'GOTHIC PLAGUE MIASMA',
          color: '#a855f7',
          timer: 85
        });
      }

      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();
      const ultDamage = Math.floor(148 * dmgMult);

      for (const en of enemies) {
        en.hp -= ultDamage;
        en.stunTimer = 130;
        particles.createDamageNumber(en.x + en.w / 2, en.y - 12, `PLAGUE! -${ultDamage} ☠️`, '#a855f7');
        particles.createSparks(en.x + en.w / 2, en.y + en.h / 2, '#a855f7', 35);
        if (onSynergyHit) onSynergyHit(en, 'poison', p.pIndex, ultDamage);
      }
      particles.createSparks(p.x + p.w / 2, p.y + p.h / 2, '#c084fc', 60);
    },

    updatePassive(p, enemies, particles, sound, gameTime) {
      // Passive: Noxious Sting - purple smoke aura
      if (gameTime % 22 === 0) {
        particles.createSparks(p.x + p.w / 2, p.y + p.h - 8, '#a855f7', 1);
      }
    }
  },

  // ==========================================
  // 9. SAGITTARIUS (♐ KARLSTAD / SOLAR RANGER)
  // Combat Style: Solar Plasma Bow & Meteor Rain
  // Superpower: Celestial Phoenix Supernova
  // ==========================================
  sagittarius: {
    attack(p, projectiles, meleeHits, onShake) {
      sound.playLaser();
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();
      const dmg = Math.floor(30 * dmgMult);

      // Fires high-speed penetrating solar plasma arrow
      projectiles.push({
        x: p.x + (p.facing > 0 ? p.w + 8 : -16),
        y: p.y + 18,
        vx: p.facing * 16,
        vy: 0,
        type: 'arrow',
        color: '#fb923c',
        element: 'fire',
        owner: p.pIndex,
        damage: dmg,
        life: 55,
        pierce: 3
      });

      particles.createSparks(p.x + (p.facing > 0 ? p.w + 12 : -12), p.y + 18, '#fb923c', 10);
    },

    castQ(p, projectiles, onShake) {
      sound.playLaser();
      if (onShake) onShake(10);
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();

      // Stellar Piercer: super-charged hyper-velocity laser arrow
      projectiles.push({
        x: p.x + (p.facing > 0 ? p.w + 12 : -20),
        y: p.y + 18,
        vx: p.facing * 20,
        vy: 0,
        type: 'beam',
        color: '#ea580c',
        element: 'fire',
        owner: p.pIndex,
        damage: Math.floor(55 * dmgMult),
        life: 50,
        pierce: 99
      });
      particles.createSparks(p.x + p.w / 2, p.y + 20, '#fb923c', 25);
    },

    castE(p, enemies, onSynergyHit, onShake, projectiles) {
      sound.playRoar();
      if (onShake) onShake(14);
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();

      // Meteor Barrage: fires skyward, raining down 5 meteors
      for (let i = 0; i < 5; i++) {
        projectiles.push({
          x: p.x + p.facing * (60 + i * 50),
          y: 60,
          vx: p.facing * 3,
          vy: 13,
          type: 'meteor',
          color: '#ea580c',
          element: 'fire',
          owner: p.pIndex,
          damage: Math.floor(52 * dmgMult),
          life: 40
        });
      }
      particles.createSparks(p.x + p.w / 2, p.y + 10, '#fb923c', 30);
    },

    castDash(p) {
      // Solar Leap: acrobatic flip
      p.isDashing = 12;
      p.invulnTime = 16;
      p.vy = -6; // Little hop
      sound.playLaser();
      particles.createTrail(p.x, p.y, p.w, p.h, '#fb923c');
    },

    castUlt(p, enemies, onSynergyHit, onUltEffect, onShake) {
      sound.playUlt();
      sound.playRoar();
      if (onShake) onShake(28);

      if (onUltEffect) {
        onUltEffect({
          name: 'CELESTIAL PHOENIX SUPERNOVA',
          color: '#fb923c',
          timer: 85
        });
      }

      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();
      const ultDamage = Math.floor(155 * dmgMult);

      for (const en of enemies) {
        en.hp -= ultDamage;
        en.stunTimer = 130;
        particles.createDamageNumber(en.x + en.w / 2, en.y - 12, `SOLAR PHOENIX! -${ultDamage} 🔥`, '#fb923c');
        particles.createSparks(en.x + en.w / 2, en.y + en.h / 2, '#ea580c', 35);
        if (onSynergyHit) onSynergyHit(en, 'fire', p.pIndex, ultDamage);
      }
      particles.createSparks(p.x + p.w / 2, p.y + p.h / 2, '#fde047', 60);
    },

    updatePassive(p, enemies, particles, sound, gameTime) {
      // Passive: Solar Trajectory - solar sparks around bow
      if (gameTime % 20 === 0) {
        particles.createSparks(p.x + (p.facing > 0 ? p.w + 10 : -10), p.y + 18, '#fb923c', 2);
      }
    }
  },

  // ==========================================
  // 10. CAPRICORN (♑ ÖSTERSUND / CRYO WARRIOR)
  // Combat Style: Glacial Great-Axe & Freezing Ice Spikes
  // Superpower: Absolute Sub-Zero Cataclysm
  // ==========================================
  capricorn: {
    attack(p, projectiles, meleeHits, onShake) {
      sound.playSword();
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();
      const dmg = Math.floor(32 * dmgMult);

      // Heavy frost axe cleave
      meleeHits.push({
        x: p.x + (p.facing > 0 ? p.w : -46),
        y: p.y - 2,
        w: 50,
        h: 50,
        damage: dmg,
        color: '#67e8f9',
        element: 'ice',
        owner: p.pIndex,
        life: 8
      });

      // Frost shard projectile
      projectiles.push({
        x: p.x + (p.facing > 0 ? p.w + 8 : -16),
        y: p.y + 20,
        vx: p.facing * 11,
        vy: 0,
        type: 'iceSpike',
        color: '#67e8f9',
        element: 'ice',
        owner: p.pIndex,
        damage: Math.floor(18 * dmgMult),
        life: 35
      });

      particles.createSparks(p.x + (p.facing > 0 ? p.w + 20 : -20), p.y + 20, '#67e8f9', 14);
    },

    castQ(p, projectiles, onShake) {
      sound.playFreeze();
      sound.playEarthQuake();
      if (onShake) onShake(14);
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();
      const dmg = Math.floor(60 * dmgMult);

      // Glacial Permafrost Spikes: row of ice monoliths bursting from the floor
      elementalManager.spawnEarthPillars(p.x, p.y + p.h, p.facing, 4, 60, dmg, p.pIndex);
      particles.createIceShards(p.x + p.w / 2, p.y + p.h - 10, 24);
    },

    castE(p, enemies, onSynergyHit, onShake) {
      sound.playFreeze();
      sound.playWave();
      if (onShake) onShake(14);
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();

      // Blizzard Ring: freezing vortex around Capricorn that freezes nearby foes solid in ice blocks
      const radius = 190;
      for (const en of enemies) {
        const dist = Math.hypot((en.x + en.w / 2) - (p.x + p.w / 2), (en.y + en.h / 2) - (p.y + p.h / 2));
        if (dist < radius) {
          const dmg = Math.floor(58 * dmgMult);
          const hitRes = en.applyHit ? en.applyHit(dmg, 'ice', p.pIndex, false, false) : null;
          if (!hitRes) en.hp -= dmg;
          en.frozenTimer = 110;
          en.stunTimer = 110;
          particles.createIceShards(en.x + en.w / 2, en.y + en.h / 2, 20);
          particles.createDamageNumber(en.x + en.w / 2, en.y, `BLIZZARD FREEZE! -${dmg} ❄️`, '#67e8f9');
          if (onSynergyHit) onSynergyHit(en, 'ice', p.pIndex, dmg);
        }
      }
      particles.createSparks(p.x + p.w / 2, p.y + p.h / 2, '#67e8f9', 40);
      particles.createIceShards(p.x + p.w / 2, p.y + p.h / 2, 25);
    },

    castDash(p) {
      // Glacier Avalanche Slide
      p.isDashing = 13;
      p.invulnTime = 16;
      sound.playWave();
      particles.createTrail(p.x, p.y, p.w, p.h, '#67e8f9');
    },

    castUlt(p, enemies, onSynergyHit, onUltEffect, onShake) {
      sound.playUlt();
      sound.playFreeze();
      sound.playIceShatter();
      if (onShake) onShake(30);

      if (onUltEffect) {
        onUltEffect({
          name: 'ABSOLUTE SUB-ZERO CATACLYSM',
          color: '#67e8f9',
          timer: 85
        });
      }

      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();
      const ultDamage = Math.floor(165 * dmgMult);

      // Polar permafrost waves & freezing all enemies solid in crystalline ice blocks
      elementalManager.spawnTsunami(p.x - p.facing * 80, p.y + p.h, p.facing, ultDamage, 130, p.pIndex, true);

      for (const en of enemies) {
        en.hp -= ultDamage;
        // FREEZE SOLID IN ICE BLOCKS!
        en.frozenTimer = 150;
        en.stunTimer = 150;
        particles.createDamageNumber(en.x + en.w / 2, en.y - 14, `ABSOLUTE ZERO! -${ultDamage} 🧊 ❄️`, '#67e8f9');
        particles.createIceShards(en.x + en.w / 2, en.y + en.h / 2, 35);
        if (onSynergyHit) onSynergyHit(en, 'ice', p.pIndex, ultDamage);
      }
      particles.createSparks(p.x + p.w / 2, p.y + p.h / 2, '#ecfeff', 65);
    },

    updatePassive(p, enemies, particles, sound, gameTime) {
      // Passive: Permafrost Aura - chills adjacent enemies
      if (gameTime % 30 === 0) {
        for (const en of enemies) {
          const dist = Math.hypot((en.x + en.w / 2) - (p.x + p.w / 2), (en.y + en.h / 2) - (p.y + p.h / 2));
          if (dist < 100) {
            en.stunTimer = Math.max(en.stunTimer, 20); // Slowdown
            particles.createSparks(en.x + en.w / 2, en.y + 15, '#67e8f9', 2);
          }
        }
      }
    }
  },

  // ==========================================
  // 11. AQUARIUS (♒ GOTHENBURG / CYBER HACKER)
  // Combat Style: Ion Plasma Blaster & Tactical Drone
  // Superpower: Eriksberg Orbital Ion Cannon
  // ==========================================
  aquarius: {
    attack(p, projectiles, meleeHits, onShake) {
      sound.playLaser();
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();
      const dmg = Math.floor(24 * dmgMult);

      // Binary matrix blaster projectile
      projectiles.push({
        x: p.x + (p.facing > 0 ? p.w + 6 : -14),
        y: p.y + 18,
        vx: p.facing * 13,
        vy: (Math.random() - 0.5) * 0.6,
        type: 'binary',
        char: Math.random() > 0.5 ? '1' : '0',
        color: '#00f0ff',
        element: 'tech',
        owner: p.pIndex,
        damage: dmg,
        life: 55
      });

      particles.createSparks(p.x + (p.facing > 0 ? p.w + 10 : -10), p.y + 18, '#00f0ff', 8);
    },

    castQ(p, projectiles, onShake) {
      sound.playWindGale();
      sound.playFreeze();
      if (onShake) onShake(10);
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();

      // Cryo Gale Jet: blasts a freezing hurricane gale that FREEZES AND BLOWS ENEMIES BACK!
      projectiles.push({
        x: p.x + (p.facing > 0 ? p.w + 10 : -24),
        y: p.y + 18,
        vx: p.facing * 16,
        vy: 0,
        type: 'beam',
        color: '#00f0ff',
        element: 'tech',
        owner: p.pIndex,
        damage: Math.floor(52 * dmgMult),
        life: 50,
        isFreeze: true,
        isGaleBlast: true
      });
      particles.createWindGale(p.x + p.w / 2, p.y + 20, p.facing, 14);
      particles.createIceShards(p.x + p.w / 2, p.y + 20, 12);
    },

    castE(p, enemies, onSynergyHit, onShake) {
      sound.playLaser();
      if (onShake) onShake(14);
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();

      // Overclock EMP Shockwave from drone
      const radius = 200;
      for (const en of enemies) {
        const dist = Math.hypot((en.x + en.w / 2) - p.drone.x, (en.y + en.h / 2) - p.drone.y);
        if (dist < radius) {
          const dmg = Math.floor(56 * dmgMult);
          en.hp -= dmg;
          en.stunTimer = 90; // Stunned by EMP
          particles.createDamageNumber(en.x + en.w / 2, en.y, `EMP OVERCLOCK! -${dmg} ⚡`, '#00f0ff');
          if (onSynergyHit) onSynergyHit(en, 'tech', p.pIndex, dmg);
        }
      }
      particles.createSparks(p.drone.x, p.drone.y, '#00f0ff', 40);
      particles.createSparks(p.drone.x, p.drone.y, '#38bdf8', 30);
    },

    castDash(p) {
      // Cyber Glide Thruster
      p.isDashing = 12;
      p.invulnTime = 16;
      sound.playLaser();
      particles.createTrail(p.x, p.y, p.w, p.h, '#00f0ff');
    },

    castUlt(p, enemies, onSynergyHit, onUltEffect, onShake) {
      sound.playUlt();
      sound.playLaser();
      if (onShake) onShake(28);

      if (onUltEffect) {
        onUltEffect({
          name: 'ERIKSBERG ORBITAL ION CANNON',
          color: '#00f0ff',
          timer: 85
        });
      }

      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();
      const ultDamage = Math.floor(155 * dmgMult);

      for (const en of enemies) {
        en.hp -= ultDamage;
        en.stunTimer = 135;
        particles.createDamageNumber(en.x + en.w / 2, en.y - 12, `ORBITAL CANNON! -${ultDamage} 🛰️`, '#00f0ff');
        particles.createSparks(en.x + en.w / 2, en.y + en.h / 2, '#00f0ff', 35);
        if (onSynergyHit) onSynergyHit(en, 'tech', p.pIndex, ultDamage);
      }
      particles.createSparks(p.x + p.w / 2, p.y + p.h / 2, '#a5f3fc', 60);
    },

    updatePassive(p, enemies, particles, sound, gameTime) {
      // Companion Drone auto-zaps closest enemy every 45 ticks
      if (gameTime % 45 === 0 && enemies.length > 0) {
        let closest = null;
        let cDist = 280;
        for (const en of enemies) {
          const d = Math.hypot((en.x + en.w / 2) - p.drone.x, (en.y + en.h / 2) - p.drone.y);
          if (d < cDist) {
            cDist = d;
            closest = en;
          }
        }
        if (closest) {
          closest.hp -= 12;
          particles.createSparks(closest.x + closest.w / 2, closest.y + 15, '#00f0ff', 6);
          particles.createDamageNumber(closest.x + closest.w / 2, closest.y - 6, 'DRONE -12 🤖', '#00f0ff');
        }
      }
    }
  },

  // ==========================================
  // 12. PISCES (♓ UMEÅ / AURORA ENCHANTER)
  // Combat Style: Homing Dream Water Bubbles & Aurora Veil
  // Superpower: Northern Lights Celestial Sanctuary
  // ==========================================
  pisces: {
    attack(p, projectiles, meleeHits, onShake) {
      sound.playWave();
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();
      const dmg = Math.floor(24 * dmgMult);

      // Fires homing iridescent dream bubble
      projectiles.push({
        x: p.x + (p.facing > 0 ? p.w + 6 : -14),
        y: p.y + 18,
        vx: p.facing * 10,
        vy: (Math.random() - 0.5) * 1.5,
        type: 'bubble',
        color: '#2dd4bf',
        element: 'water',
        owner: p.pIndex,
        damage: dmg,
        life: 60,
        isHoming: true
      });

      particles.createSparks(p.x + (p.facing > 0 ? p.w + 10 : -10), p.y + 18, '#2dd4bf', 10);
    },

    castQ(p, projectiles, onShake) {
      sound.playWave();
      if (onShake) onShake(8);
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();

      // Abyssal Dream Bubble: fires homing iridescent bubbles that TRAP ENEMIES IN FLOATING SPHERES!
      for (let i = 0; i < 3; i++) {
        projectiles.push({
          x: p.x + (p.facing > 0 ? p.w + 10 + i * 20 : -20 - i * 20),
          y: p.y + 20,
          vx: p.facing * (9 + i * 1.5),
          vy: -1,
          type: 'bubble',
          color: '#2dd4bf',
          element: 'water',
          owner: p.pIndex,
          damage: Math.floor(48 * dmgMult),
          life: 55,
          isBubbleTrap: true
        });
      }
      particles.createSparks(p.x + p.w / 2, p.y + 20, '#2dd4bf', 20);
    },

    castE(p, enemies, onSynergyHit, onShake) {
      sound.playItem();
      if (onShake) onShake(10);
      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();

      // Dream Cascade: healing fountain restoring 40 HP
      p.hp = Math.min(p.maxHp, p.hp + 40);
      particles.createDamageNumber(p.x + p.w / 2, p.y - 14, '+40 HP! 💖', '#2dd4bf');

      const radius = 180;
      for (const en of enemies) {
        const dist = Math.hypot((en.x + en.w / 2) - (p.x + p.w / 2), (en.y + en.h / 2) - (p.y + p.h / 2));
        if (dist < radius) {
          const dmg = Math.floor(48 * dmgMult);
          en.hp -= dmg;
          en.stunTimer = 75;
          particles.createDamageNumber(en.x + en.w / 2, en.y, `DREAM FOUNTAIN! -${dmg} 🌊`, '#2dd4bf');
          if (onSynergyHit) onSynergyHit(en, 'water', p.pIndex, dmg);
        }
      }
      particles.createSparks(p.x + p.w / 2, p.y + p.h / 2, '#2dd4bf', 45);
      particles.createSparks(p.x + p.w / 2, p.y + p.h / 2, '#99f6e4', 30);
    },

    castDash(p) {
      // Aurora Siren Flow
      p.isDashing = 12;
      p.invulnTime = 16;
      sound.playWave();
      particles.createTrail(p.x, p.y, p.w, p.h, '#2dd4bf');
    },

    castUlt(p, enemies, onSynergyHit, onUltEffect, onShake) {
      sound.playUlt();
      sound.playWave();
      if (onShake) onShake(26);

      if (onUltEffect) {
        onUltEffect({
          name: 'NORTHERN LIGHTS CELESTIAL SANCTUARY',
          color: '#2dd4bf',
          timer: 85
        });
      }

      // Massive team heal
      p.hp = p.maxHp;
      particles.createDamageNumber(p.x + p.w / 2, p.y - 14, 'FULL HP REGEN! 🌟', '#2dd4bf');

      const dmgMult = buffManager.getDamageMultiplier(p.pIndex) * shopManager.getDamageMultiplier();
      const ultDamage = Math.floor(145 * dmgMult);

      for (const en of enemies) {
        en.hp -= ultDamage;
        en.stunTimer = 135;
        particles.createDamageNumber(en.x + en.w / 2, en.y - 12, `SANCTUARY! -${ultDamage} 🌌`, '#2dd4bf');
        particles.createSparks(en.x + en.w / 2, en.y + en.h / 2, '#2dd4bf', 35);
        if (onSynergyHit) onSynergyHit(en, 'water', p.pIndex, ultDamage);
      }
      particles.createSparks(p.x + p.w / 2, p.y + p.h / 2, '#99f6e4', 65);
    },

    updatePassive(p, enemies, particles, sound, gameTime) {
      // Passive: Dream Mist - leaves healing pearls and gentle self regen
      if (gameTime % 90 === 0 && p.hp < p.maxHp) {
        p.hp = Math.min(p.maxHp, p.hp + 2);
        particles.createSparks(p.x + p.w / 2, p.y + 10, '#2dd4bf', 2);
      }
    }
  }
};

export function getHeroCombat(heroId) {
  return HERO_COMBAT[heroId] || HERO_COMBAT['aquarius'];
}
