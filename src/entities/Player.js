import { HERO_CONFIGS } from '../config/heroes.js';
import { getHeroModule } from './heroes/index.js';
import { sound } from '../engine/Audio.js';
import { particles } from '../engine/Particles.js';
import { checkRectCollision } from '../engine/Physics.js';
import { relicManager } from './Relics.js';
import { buffManager } from './Powerups.js';

/**
 * PlayerEntity manages hero physics, animations, combat skills,
 * buff statuses, and delegates character-specific rendering to dedicated hero modules.
 */
export class PlayerEntity {
  constructor(pIndex) {
    this.pIndex = pIndex;
    this.hero = HERO_CONFIGS['aquarius'];
    this.heroModule = getHeroModule('aquarius');
    this.x = 100;
    this.y = 420;
    this.w = 38;
    this.h = 58;
    this.vx = 0;
    this.vy = 0;
    this.facing = 1;
    this.isGrounded = false;
    this.hp = 100;
    this.maxHp = 100;
    this.energy = 100;
    this.maxEnergy = 100;
    this.ultCharge = 25;
    this.dashCooldown = 0;
    this.isDashing = 0;
    this.qCooldown = 0;
    this.eCooldown = 0;
    this.invulnTime = 0;
    this.animTimer = 0;
    this.walkCycle = 0;
    this.attackSwing = 0;
    this.drone = { x: 70, y: 390, bob: 0 };
  }

  /**
   * Initializes or resets the player with a selected hero configuration.
   */
  init(heroId, startX) {
    this.hero = HERO_CONFIGS[heroId] || HERO_CONFIGS['aquarius'];
    this.heroModule = getHeroModule(heroId);
    this.maxHp = this.hero.maxHp;
    this.hp = this.maxHp;
    this.energy = 100;
    this.ultCharge = 25;
    this.x = startX;
    this.y = 420;
    this.vx = 0;
    this.vy = 0;
    this.facing = this.pIndex === 1 ? 1 : -1;
    this.dashCooldown = 0;
    this.isDashing = 0;
    this.qCooldown = 0;
    this.eCooldown = 0;
    this.invulnTime = 0;
    this.attackSwing = 0;
  }

  takeDamage(amount, onDefeat, onShake) {
    // Shield of Odin invulnerability check
    if (buffManager.hasBuff(this.pIndex, 'aegis') || this.invulnTime > 0) {
      sound.playLaser();
      particles.createSparks(this.x + this.w / 2, this.y + this.h / 2, '#38bdf8', 10);
      particles.createDamageNumber(this.x + this.w / 2, this.y - 15, 'BLOCKED! 🛡️', '#38bdf8');
      return;
    }

    this.hp -= amount;
    this.invulnTime = 25;
    sound.playHit();
    if (onShake) onShake(10);
    particles.createDamageNumber(this.x + this.w / 2, this.y - 12, `-${amount}`, '#ef4444');

    if (this.hp <= 0) {
      this.hp = 0;
      sound.playRoar();
      if (onDefeat) onDefeat();
    }
  }

  /**
   * Updates player physics, movement inputs, platform collisions, and relic pickups.
   */
  update(moveLeft, moveRight, jumpKey, platforms, enemies, onDefeat, onShake, onSynergyHit, levelWidth = 6400) {
    this.animTimer += 0.08;

    // Energy regeneration (Super Fika boost if active)
    const energyRegen = buffManager.hasBuff(this.pIndex, 'fika') ? 0.95 : 0.22;
    if (this.energy < this.maxEnergy) this.energy = Math.min(this.maxEnergy, this.energy + energyRegen);

    if (this.dashCooldown > 0) this.dashCooldown--;
    if (this.qCooldown > 0) this.qCooldown--;
    if (this.eCooldown > 0) this.eCooldown--;
    if (this.invulnTime > 0) this.invulnTime--;
    if (this.isDashing > 0) this.isDashing--;
    if (this.attackSwing > 0) this.attackSwing--;

    let moveX = 0;
    if (moveLeft) moveX -= 1;
    if (moveRight) moveX += 1;

    // Speed multiplier (Valkyrie Frost Dash / Fika)
    let speedMult = 1.0;
    if (buffManager.hasBuff(this.pIndex, 'valkyrie')) speedMult = 1.6;
    else if (buffManager.hasBuff(this.pIndex, 'fika')) speedMult = 1.25;

    if (moveX !== 0) {
      this.facing = moveX;
      this.vx = moveX * (this.hero.speed * speedMult);
      this.walkCycle += 0.28;
    } else {
      this.vx *= 0.72;
      if (Math.abs(this.vx) < 0.1) this.vx = 0;
      this.walkCycle = 0;
    }

    if (jumpKey && this.isGrounded) {
      this.vy = this.hero.jumpForce;
      this.isGrounded = false;
      sound.playLaser();
      particles.createSparks(this.x + this.w / 2, this.y + this.h, this.hero.color, 10);
    }

    // Gravity
    this.vy += 0.55;
    if (this.vy > 14) this.vy = 14;

    // Dash speed boost
    if (this.isDashing > 0) {
      this.vx = this.facing * 15 * speedMult;
      this.vy = 0;
      particles.createTrail(this.x, this.y, this.w, this.h, this.hero.color);
    }

    this.x += this.vx;
    this.y += this.vy;

    // Arena horizontal bounds
    if (this.x < 20) this.x = 20;
    if (this.x > levelWidth - this.w - 20) this.x = levelWidth - this.w - 20;

    // Platform collisions
    const groundY = 490;
    let onPlatform = false;
    for (const p of platforms) {
      if (this.x + this.w > p.x && this.x < p.x + p.w) {
        if (this.y + this.h >= p.y && this.y + this.h <= p.y + 16 && this.vy >= 0) {
          this.y = p.y - this.h;
          this.vy = 0;
          this.isGrounded = true;
          onPlatform = true;
          break;
        }
      }
    }
    if (!onPlatform && this.y + this.h < groundY) this.isGrounded = false;

    // Aquarius companion drone follow logic
    if (this.hero.id === 'aquarius') {
      this.drone.bob += 0.09;
      const targetDroneX = this.x - this.facing * 34;
      const targetDroneY = this.y - 15 + Math.sin(this.drone.bob) * 7;
      this.drone.x += (targetDroneX - this.drone.x) * 0.16;
      this.drone.y += (targetDroneY - this.drone.y) * 0.16;
    }

    // Relic & Loot Pickups
    for (let i = relicManager.relicPickups.length - 1; i >= 0; i--) {
      const r = relicManager.relicPickups[i];
      if (checkRectCollision(this, r)) {
        sound.playItem();
        if (r.type === 'heart') {
          this.hp = Math.min(this.maxHp, this.hp + 25);
          particles.createDamageNumber(this.x + this.w / 2, this.y - 12, '+25 HP! ❤️', '#ef4444');
          particles.createSparks(this.x + this.w / 2, this.y + this.h / 2, '#ef4444', 12);
        } else if (r.type === 'energy') {
          this.energy = Math.min(this.maxEnergy, this.energy + 40);
          particles.createDamageNumber(this.x + this.w / 2, this.y - 12, `+40 ${this.hero.energyName}! ⚡`, '#00f0ff');
          particles.createSparks(this.x + this.w / 2, this.y + this.h / 2, '#00f0ff', 12);
        } else if (r.type === 'shard') {
          this.ultCharge = Math.min(100, this.ultCharge + 15);
          particles.createDamageNumber(this.x + this.w / 2, this.y - 12, '+15% ULT! ⭐', '#facc15');
          particles.createSparks(this.x + this.w / 2, this.y + this.h / 2, '#facc15', 14);
        } else if (r.type === 'kanelbulle') {
          this.hp = Math.min(this.maxHp, this.hp + 60);
          this.energy = this.maxEnergy;
          buffManager.applyBuff(this.pIndex, 'fika');
          particles.createDamageNumber(this.x + this.w / 2, this.y - 14, 'KANELBULLE BOOST! 🥐', '#fb923c');
          particles.createSparks(this.x + this.w / 2, this.y + this.h / 2, '#fb923c', 20);
        } else if (r.type === 'meatball') {
          this.hp = Math.min(this.maxHp, this.hp + 35);
          particles.createDamageNumber(this.x + this.w / 2, this.y - 12, '+35 HP! 🧆', '#4ade80');
        } else if (r.type === 'surstromming') {
          if (onShake) onShake(12);
          enemies.forEach(en => {
            en.hp -= 50;
            en.stunTimer = 100;
            particles.createDamageNumber(en.x + en.w / 2, en.y, 'GAS! -50 🐟', '#a855f7');
          });
          particles.createSparks(this.x, this.y, '#a855f7', 30);
        } else if (r.type === 'aegis') {
          buffManager.applyBuff(this.pIndex, 'aegis');
          particles.createDamageNumber(this.x + this.w / 2, this.y - 16, 'ODIN SHIELD! 🛡️', '#38bdf8');
        } else if (r.type === 'mjolnir') {
          buffManager.applyBuff(this.pIndex, 'mjolnir');
          particles.createDamageNumber(this.x + this.w / 2, this.y - 16, "THOR'S LIGHTNING! ⚡", '#facc15');
        } else if (r.type === 'valkyrie') {
          buffManager.applyBuff(this.pIndex, 'valkyrie');
          particles.createDamageNumber(this.x + this.w / 2, this.y - 16, 'VALKYRIE SPEED! 🚀', '#06b6d4');
        } else if (r.type === 'chronos') {
          buffManager.applyBuff(this.pIndex, 'chronos');
          particles.createDamageNumber(this.x + this.w / 2, this.y - 16, 'TIME FREEZE! ⏱️', '#818cf8');
        } else if (r.type === 'fika') {
          buffManager.applyBuff(this.pIndex, 'fika');
          particles.createDamageNumber(this.x + this.w / 2, this.y - 16, 'SWEDISH FIKA! ☕', '#f97316');
        } else if (r.type === 'berserker') {
          buffManager.applyBuff(this.pIndex, 'berserker');
          particles.createDamageNumber(this.x + this.w / 2, this.y - 16, 'BERSERKER RAGE 2.5x! ⚔️', '#dc2626');
        } else if (r.type === 'magnet') {
          relicManager.update(this, null, false, true);
          particles.createDamageNumber(this.x + this.w / 2, this.y - 16, 'STAR MAGNET! 🧲', '#ec4899');
        }

        relicManager.relicPickups.splice(i, 1);
      }
    }
  }

  /**
   * Executes primary attack (projectiles or melee swing).
   */
  attack(projectiles, meleeHits, onShake) {
    if (this.energy < 5) return;
    this.energy -= 5;
    this.attackSwing = 14;

    const damageMult = buffManager.getDamageMultiplier(this.pIndex);
    const hasThorLightning = buffManager.hasBuff(this.pIndex, 'mjolnir');

    const hId = this.hero.id;
    if (hId === 'aquarius' || hId === 'gemini' || hId === 'pisces' || hId === 'libra') {
      sound.playLaser();
      projectiles.push({
        x: this.x + (this.facing > 0 ? this.w + 6 : -6),
        y: this.y + 20,
        vx: this.facing * 12,
        vy: (Math.random() - 0.5) * 0.8,
        type: hId === 'aquarius' ? 'binary' : 'crescent',
        char: Math.random() > 0.5 ? '1' : '0',
        color: this.hero.color,
        element: this.hero.element,
        owner: this.pIndex,
        damage: Math.floor(22 * damageMult),
        life: 60,
        chainLightning: hasThorLightning
      });
    } else if (hId === 'sagittarius') {
      sound.playLaser();
      projectiles.push({
        x: this.x + (this.facing > 0 ? this.w + 8 : -8),
        y: this.y + 18,
        vx: this.facing * 14,
        vy: 0,
        type: 'dagger',
        color: '#fb923c',
        element: 'fire',
        owner: this.pIndex,
        damage: Math.floor(28 * damageMult),
        life: 50,
        chainLightning: hasThorLightning
      });
    } else if (hId === 'virgo') {
      sound.playLaser();
      projectiles.push({
        x: this.x + (this.facing > 0 ? this.w + 8 : -8),
        y: this.y + 18,
        vx: this.facing * 13,
        vy: 0,
        type: 'dagger',
        color: '#4ade80',
        element: 'nature',
        owner: this.pIndex,
        damage: Math.floor(26 * damageMult),
        life: 55,
        chainLightning: hasThorLightning
      });
    } else if (hId === 'scorpio') {
      sound.playPoison();
      projectiles.push({
        x: this.x + (this.facing > 0 ? this.w + 6 : -14),
        y: this.y + 16,
        vx: this.facing * 12,
        vy: 0,
        type: 'dagger',
        color: '#a855f7',
        element: 'poison',
        owner: this.pIndex,
        damage: Math.floor(24 * damageMult),
        life: 55,
        chainLightning: hasThorLightning
      });
    } else {
      // Melee Swing (Aries, Taurus, Leo, Cancer, Capricorn)
      sound.playSword();
      meleeHits.push({
        x: this.x + (this.facing > 0 ? this.w : -36),
        y: this.y + 10,
        w: 38,
        h: 40,
        damage: Math.floor(28 * damageMult),
        color: this.hero.color,
        element: this.hero.element,
        owner: this.pIndex,
        life: 6
      });
      particles.createSparks(this.x + (this.facing > 0 ? this.w + 20 : -20), this.y + 25, this.hero.color, 10);
    }
  }

  castQ(projectiles, onShake) {
    if (this.energy < 25 || this.qCooldown > 0) return;
    this.energy -= 25;
    this.qCooldown = 45;
    sound.playLaser();
    if (onShake) onShake(6);

    const damageMult = buffManager.getDamageMultiplier(this.pIndex);

    projectiles.push({
      x: this.x + (this.facing > 0 ? this.w + 10 : -20),
      y: this.y + 15,
      vx: this.facing * 15,
      vy: 0,
      type: 'skillQ',
      color: this.hero.color,
      element: this.hero.element,
      owner: this.pIndex,
      damage: Math.floor(45 * damageMult),
      life: 55
    });
    particles.createSparks(this.x + this.w / 2, this.y + 20, this.hero.color, 16);
  }

  castE(enemies, onSynergyHit, onShake) {
    if (this.energy < 40 || this.eCooldown > 0) return;
    this.energy -= 40;
    this.eCooldown = 75;
    sound.playWave();
    if (onShake) onShake(12);

    const damageMult = buffManager.getDamageMultiplier(this.pIndex);
    const radius = 170;

    particles.createSparks(this.x + this.w / 2, this.y + this.h / 2, this.hero.color, 35);
    for (const en of enemies) {
      const dist = Math.hypot((en.x + en.w / 2) - (this.x + this.w / 2), (en.y + en.h / 2) - (this.y + this.h / 2));
      if (dist < radius) {
        const dmg = Math.floor(55 * damageMult);
        en.hp -= dmg;
        en.stunTimer = 60;
        sound.playHit();
        particles.createDamageNumber(en.x + en.w / 2, en.y, `AoE -${dmg}!`, this.hero.color);
        if (onSynergyHit) onSynergyHit(en, this.hero.element, this.pIndex, dmg);
      }
    }
  }

  castDash() {
    if (this.energy < 15 || this.dashCooldown > 0) return;
    this.energy -= 15;
    this.dashCooldown = 30;
    this.isDashing = 10;
    this.invulnTime = 12;
    sound.playSword();
  }

  castUlt(enemies, onSynergyHit, onUltEffect, onShake, levelW, screenH) {
    if (this.ultCharge < 100) return;
    this.ultCharge = 0;
    sound.playUlt();
    if (onShake) onShake(24);

    const damageMult = buffManager.getDamageMultiplier(this.pIndex);
    const ultDamage = Math.floor(130 * damageMult);

    if (onUltEffect) {
      onUltEffect({
        name: this.hero.ultName,
        color: this.hero.color,
        timer: 70
      });
    }

    for (const en of enemies) {
      en.hp -= ultDamage;
      en.stunTimer = 110;
      sound.playHit();
      particles.createDamageNumber(en.x + en.w / 2, en.y - 10, `ULT -${ultDamage}!`, this.hero.color);
      if (onSynergyHit) onSynergyHit(en, this.hero.element, this.pIndex, ultDamage);
    }
    particles.createSparks(this.x + this.w / 2, this.y + this.h / 2, this.hero.color, 60);
  }

  draw(ctx) {
    // Draw Active Aura Rings & Shields (Aegis, Mjölnir, Berserker)
    buffManager.drawPlayerAuras(ctx, this);

    ctx.save();
    ctx.translate(this.x, this.y);

    // Flashing when invulnerable
    if (this.invulnTime > 0 && Math.floor(this.invulnTime / 3) % 2 === 0) {
      ctx.globalAlpha = 0.45;
    }

    // Direction flip
    if (this.facing < 0) {
      ctx.scale(-1, 1);
      ctx.translate(-this.w, 0);
    }

    // Delegate rendering to modular hero file
    if (this.heroModule && typeof this.heroModule.draw === 'function') {
      this.heroModule.draw(ctx, this);
    } else {
      // Fallback
      ctx.fillStyle = this.hero.color;
      ctx.fillRect(0, 0, this.w, this.h);
    }

    ctx.restore();
  }
}
