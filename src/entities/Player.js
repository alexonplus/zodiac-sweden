import { HERO_CONFIGS } from '../config/heroes.js';
import { getHeroModule } from './heroes/index.js';
import { getHeroCombat } from './heroes/heroCombat.js';
import { sound } from '../engine/Audio.js';
import { particles } from '../engine/Particles.js';
import { checkRectCollision } from '../engine/Physics.js';
import { relicManager } from './Relics.js';
import { buffManager } from './Powerups.js';
import { shopManager } from './Shop.js';

/**
 * PlayerEntity manages hero physics, animations, combat skills,
 * buff statuses, and layered character sprite rendering delegating
 * to dedicated hero modules and hero combat systems.
 */
export class PlayerEntity {
  constructor(pIndex) {
    this.pIndex = pIndex;
    this.hero = HERO_CONFIGS['aquarius'];
    this.heroModule = getHeroModule('aquarius');
    this.heroCombat = getHeroCombat('aquarius');
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
    this.clones = [];
    this.lastSafeX = 100;
    this.lastSafeY = 420;
    this.isRiding = false;
  }

  /**
   * Initializes or resets the player with a selected hero configuration.
   */
  init(heroId, startX) {
    this.hero = HERO_CONFIGS[heroId] || HERO_CONFIGS['aquarius'];
    this.heroModule = getHeroModule(heroId);
    this.heroCombat = getHeroCombat(heroId);
    this.clones = [];
    this.maxHp = this.hero.maxHp + shopManager.getBonusHp();
    this.hp = this.maxHp;
    this.energy = 100;
    this.ultCharge = 25;
    this.x = startX;
    this.y = 420;
    this.lastSafeX = startX;
    this.lastSafeY = 420;
    this.isRiding = false;
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
    if (buffManager.hasBuff(this.pIndex, 'aegis') || this.invulnTime > 0 || this.isDashing > 0) {
      sound.playLaser();
      particles.createSparks(this.x + this.w / 2, this.y + this.h / 2, '#38bdf8', 10);
      particles.createDamageNumber(this.x + this.w / 2, this.y - 15, 'BLOCKED! 🛡️', '#38bdf8');
      return;
    }

    // Apply Viking Ring-Mail damage resistance
    const reducedDmg = Math.max(1, Math.floor(amount * (1 - shopManager.getDamageReduction())));

    this.hp -= reducedDmg;
    this.invulnTime = 30;
    sound.playHit();
    if (onShake) onShake(10);
    particles.createDamageNumber(this.x + this.w / 2, this.y - 12, `-${reducedDmg}`, '#ef4444');

    if (this.hp <= 0) {
      this.hp = 0;
      sound.playRoar();
      if (onDefeat) onDefeat();
    }
  }

  /**
   * Updates player physics, movement inputs, platform collisions, and relic pickups.
   */
  update(moveLeft, moveRight, jumpKey, platforms, enemies, onDefeat, onShake, onSynergyHit, levelWidth = 12000, movingPlatforms = []) {
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

    // Speed multiplier (Valkyrie Frost Dash / Fika / Shop Upgrade)
    let speedMult = shopManager.getSpeedMultiplier();
    if (buffManager.hasBuff(this.pIndex, 'valkyrie')) speedMult *= 1.6;
    else if (buffManager.hasBuff(this.pIndex, 'fika')) speedMult *= 1.25;

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

    // Platform & Moving Platform collisions
    let onPlatform = false;

    // 1. Check Solid Level Platforms
    for (const p of platforms) {
      if (this.x + this.w > p.x && this.x < p.x + p.w) {
        if (this.y + this.h >= p.y && this.y + this.h <= p.y + 18 && this.vy >= 0) {
          this.y = p.y - this.h;
          this.vy = 0;
          this.isGrounded = true;
          onPlatform = true;
          this.lastSafeX = this.x;
          this.lastSafeY = this.y;
          break;
        }
      }
    }

    // 2. Check Moving Platforms / Ferry Barges
    if (movingPlatforms && movingPlatforms.length > 0) {
      for (const mp of movingPlatforms) {
        if (this.x + this.w > mp.x && this.x < mp.x + mp.w) {
          if (this.y + this.h >= mp.y && this.y + this.h <= mp.y + 20 && this.vy >= 0) {
            this.y = mp.y - this.h;
            this.vy = 0;
            this.x += mp.vx;
            this.isGrounded = true;
            onPlatform = true;
            this.lastSafeX = this.x;
            this.lastSafeY = this.y;
            break;
          }
        }
      }
    }

    if (!onPlatform) {
      this.isGrounded = false;
    }

    // 3. Pit Hazard / Bottomless Abyss Fall
    if (this.y > 580) {
      sound.playHammer();
      if (onShake) onShake(18);
      this.hp -= 40;
      particles.createDamageNumber(this.x + this.w / 2, 530, '⚠️ PIT HAZARD! -40 HP 🌊', '#ef4444');
      particles.createSparks(this.x + this.w / 2, 540, '#ef4444', 30);

      if (this.hp <= 0) {
        this.hp = 0;
        sound.playRoar();
        if (onDefeat) onDefeat();
      } else {
        // Safe ledge recovery with invulnerability
        this.x = this.lastSafeX;
        this.y = this.lastSafeY;
        this.vx = 0;
        this.vy = -3;
        this.invulnTime = 90; // 1.5s invulnerability
        this.isGrounded = true;
      }
    }

    // Aquarius companion drone follow logic
    if (this.hero.id === 'aquarius') {
      this.drone.bob += 0.09;
      const targetDroneX = this.x - this.facing * 34;
      const targetDroneY = this.y - 15 + Math.sin(this.drone.bob) * 7;
      this.drone.x += (targetDroneX - this.drone.x) * 0.16;
      this.drone.y += (targetDroneY - this.drone.y) * 0.16;
    }

    // Gemini Twin Mirror Clones (Castor & Pollux) Combat AI
    if (this.clones && this.clones.length > 0) {
      for (let i = this.clones.length - 1; i >= 0; i--) {
        const c = this.clones[i];
        c.life--;
        c.attackCooldown = Math.max(0, c.attackCooldown - 1);
        c.animTimer = (c.animTimer || 0) + 0.2;

        // Autonomous combat targeting
        let nearestEn = null;
        let minDist = 550;
        for (const en of enemies) {
          if (!en || en.hp <= 0) continue;
          const d = Math.hypot((en.x + en.w / 2) - c.x, (en.y + en.h / 2) - c.y);
          if (d < minDist) {
            minDist = d;
            nearestEn = en;
          }
        }

        if (nearestEn) {
          // Pursue and flank target
          const targetX = nearestEn.x + (c.offsetSide > 0 ? nearestEn.w + 25 : -50);
          const targetY = nearestEn.y + nearestEn.h - 44;
          c.facing = targetX > c.x ? 1 : -1;
          c.x += (targetX - c.x) * 0.15;
          c.y += (targetY - c.y) * 0.15;

          // Aggressive chakram strike
          if (minDist < 90 && c.attackCooldown <= 0) {
            c.attackCooldown = 18;
            sound.playLaser();
            const dmg = 28;
            nearestEn.hp -= dmg;
            particles.createDamageNumber(nearestEn.x + nearestEn.w / 2, nearestEn.y - 12, `♊ ${c.name}! -${dmg}`, '#38bdf8');
            particles.createSparks(nearestEn.x + nearestEn.w / 2, nearestEn.y + nearestEn.h / 2, '#38bdf8', 14);
            particles.createWindGale(c.x, c.y + 15, c.facing, 8);
          }
        } else {
          // Patrol beside player
          const targetX = this.x + (c.offsetSide > 0 ? 65 : -65) + Math.sin(c.animTimer) * 18;
          const targetY = this.y + Math.cos(c.animTimer) * 8;
          c.x += (targetX - c.x) * 0.12;
          c.y += (targetY - c.y) * 0.12;
          c.facing = this.facing;
        }

        // Motion trail
        if (Math.random() < 0.35) {
          particles.createSparks(c.x, c.y + 20, '#38bdf8', 1);
        }

        if (c.life <= 0) {
          sound.playWindGale();
          particles.createWindGale(c.x, c.y + 15, c.facing, 14);
          particles.createSparks(c.x, c.y + 20, '#7dd3fc', 18);
          this.clones.splice(i, 1);
        }
      }
    }

    // Hero Unique Passive Mechanics
    if (this.heroCombat && this.heroCombat.updatePassive) {
      this.heroCombat.updatePassive(this, enemies, particles, sound, Math.floor(this.animTimer * 10));
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
   * Executes hero-specific primary attack (combos, projectiles, boomerangs, or heavy cleaves).
   */
  attack(projectiles, meleeHits, onShake) {
    if (this.energy < 5) return;
    this.energy -= 5;
    this.attackSwing = 14;

    if (this.heroCombat && this.heroCombat.attack) {
      this.heroCombat.attack(this, projectiles, meleeHits, onShake);
    } else {
      // Fallback
      sound.playSword();
      meleeHits.push({
        x: this.x + (this.facing > 0 ? this.w : -36),
        y: this.y + 10,
        w: 38,
        h: 40,
        damage: 28,
        color: this.hero.color,
        element: this.hero.element,
        owner: this.pIndex,
        life: 6
      });
    }
  }

  /**
   * Casts hero-specific Skill 1 [Q].
   */
  castQ(projectiles, onShake) {
    const cost = (this.hero.skills && this.hero.skills.q && this.hero.skills.q.cost) || 25;
    const cd = (this.hero.skills && this.hero.skills.q && this.hero.skills.q.cd) || 45;
    if (this.energy < cost || this.qCooldown > 0) return;
    this.energy -= cost;
    this.qCooldown = cd;

    if (this.heroCombat && this.heroCombat.castQ) {
      this.heroCombat.castQ(this, projectiles, onShake);
    }
  }

  /**
   * Casts hero-specific Skill 2 [E].
   */
  castE(enemies, onSynergyHit, onShake, projectiles) {
    const cost = (this.hero.skills && this.hero.skills.e && this.hero.skills.e.cost) || 40;
    const cd = (this.hero.skills && this.hero.skills.e && this.hero.skills.e.cd) || 75;
    if (this.energy < cost || this.eCooldown > 0) return;
    this.energy -= cost;
    this.eCooldown = cd;

    if (this.heroCombat && this.heroCombat.castE) {
      this.heroCombat.castE(this, enemies, onSynergyHit, onShake, projectiles || []);
    }
  }

  /**
   * Casts hero-specific Dash maneuver.
   */
  castDash() {
    const cd = (this.hero.skills && this.hero.skills.dash && this.hero.skills.dash.cd) || 30;
    if (this.energy < 15 || this.dashCooldown > 0) return;
    this.energy -= 15;
    this.dashCooldown = cd;

    if (this.heroCombat && this.heroCombat.castDash) {
      this.heroCombat.castDash(this);
    } else {
      this.isDashing = 10;
      this.invulnTime = 14;
      sound.playLaser();
    }
  }

  /**
   * Unleashes hero-specific Superpower / Ultimate.
   */
  castUlt(enemies, onSynergyHit, onUltEffect, onShake, levelW, screenH, projectiles) {
    if (this.ultCharge < 100) return;
    this.ultCharge = 0;

    if (this.heroCombat && this.heroCombat.castUlt) {
      this.heroCombat.castUlt(this, enemies, onSynergyHit, onUltEffect, onShake, levelW, screenH, projectiles);
    } else {
      sound.playUlt();
      if (onShake) onShake(24);
      if (onUltEffect) {
        onUltEffect({
          name: this.hero.ultName || 'ZODIAC SUPERPOWER',
          color: this.hero.color,
          timer: 70
        });
      }
      for (const en of enemies) {
        en.hp -= 130;
        en.stunTimer = 110;
        sound.playHit();
        particles.createDamageNumber(en.x + en.w / 2, en.y - 10, 'ULT -130!', this.hero.color);
        if (onSynergyHit) onSynergyHit(en, this.hero.element, this.pIndex, 130);
      }
      particles.createSparks(this.x + this.w / 2, this.y + this.h / 2, this.hero.color, 60);
    }
  }

  /**
   * Complete layered character renderer with modular accessories, helmet, weapons,
   * animated legs, torso armor, glowing sigil, and buff auras.
   */
  draw(ctx) {
    if (this.hp <= 0) {
      ctx.save();
      ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = 'bold 24px monospace';
      ctx.fillText('👻', -12, 0);
      ctx.restore();
      return;
    }

    // Draw Active Aura Rings & Shields (Aegis, Mjölnir, Berserker)
    buffManager.drawPlayerAuras(ctx, this);

    const hCol = this.hero.color;
    const isMoving = Math.abs(this.vx) > 0.2;
    const bobY = this.isGrounded && !isMoving ? Math.sin(this.animTimer) * 2.2 : 0;
    const walkSine = Math.sin(this.walkCycle);
    const legOffset = isMoving ? walkSine * 9 : 0;
    const tiltAngle = (this.vx / (this.hero.speed || 4)) * 0.12;
    const speedRatio = Math.abs(this.vx) / (this.hero.speed || 4);
    const capeFlutter = Math.sin(this.animTimer * 2.5) * (4 + speedRatio * 8);

    // Aquarius Cyber Drone Follower
    if (this.hero.id === 'aquarius') {
      ctx.save();
      ctx.translate(this.drone.x, this.drone.y);
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#082f49';
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-4, -1.5, 8, 3);
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-10, -4);
      ctx.lineTo(10, -4);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(0, 6);
      ctx.lineTo(this.facing * 24, 38);
      ctx.stroke();
      ctx.restore();
    }

    // Ground Drop Shadow
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(this.x + this.w / 2, this.y + this.h - 1, 17, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(this.x + this.w / 2, this.y + this.h / 2 + bobY);
    if (this.facing < 0) ctx.scale(-1, 1);
    ctx.rotate(tiltAngle);

    // Invulnerability Flashing
    if (this.invulnTime > 0 && Math.floor(this.invulnTime / 4) % 2 === 0) {
      ctx.globalAlpha = 0.45;
    }

    // Player Tag (P1 / P2)
    ctx.fillStyle = this.pIndex === 1 ? '#00f0ff' : '#facc15';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`P${this.pIndex}`, 0, -42);
    ctx.textAlign = 'left';

    // 0. Elemental Aura & Ground Pulse from dedicated Hero Module
    if (this.heroModule && this.heroModule.drawAura) {
      this.heroModule.drawAura(ctx, this);
    }

    // 1. Back accessories (Cape / Tail / Wings) from dedicated Hero Module
    if (this.heroModule && this.heroModule.drawBackAccessories) {
      this.heroModule.drawBackAccessories(ctx, this, speedRatio, capeFlutter);
    }

    // Dynamic breathing and running parameters
    const animT = this.animTimer || 0;
    const breathe = Math.sin(animT * 3) * 0.7;

    // 2. Articulated Anatomical Legs & Armored Greaves
    const legFrontX = this.isGrounded ? legOffset : 4;
    const legBackX = this.isGrounded ? -legOffset : -6;
    const legFrontY = this.isGrounded ? 0 : -3;
    const legBackY = this.isGrounded ? 0 : 4;

    // --- Back Leg ---
    // Upper Thigh (Cuisse) - Organic curved muscle contour
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(-9 + legBackX, 5 + legBackY);
    ctx.quadraticCurveTo(-11 + legBackX, 9 + legBackY, -9 + legBackX, 14 + legBackY);
    ctx.lineTo(-2 + legBackX, 14 + legBackY);
    ctx.quadraticCurveTo(-3 + legBackX, 9 + legBackY, -4 + legBackX, 5 + legBackY);
    ctx.closePath();
    ctx.fill();

    // Armored Knee Cop (Poleyn) - Rounded joint
    ctx.fillStyle = hCol;
    ctx.beginPath();
    ctx.ellipse(-5.5 + legBackX, 14 + legBackY, 4.5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(-6.5 + legBackX, 13 + legBackY, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Lower Leg Greave - Contoured calf muscle
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(-9 + legBackX, 15 + legBackY);
    ctx.quadraticCurveTo(-11 + legBackX, 19 + legBackY, -8 + legBackX, 23 + legBackY);
    ctx.lineTo(-2 + legBackX, 23 + legBackY);
    ctx.quadraticCurveTo(-2 + legBackX, 18 + legBackY, -3 + legBackX, 15 + legBackY);
    ctx.closePath();
    ctx.fill();

    // Plated ridge highlight
    ctx.strokeStyle = hCol;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-5.5 + legBackX, 16 + legBackY);
    ctx.quadraticCurveTo(-6.5 + legBackX, 19 + legBackY, -5 + legBackX, 22 + legBackY);
    ctx.stroke();

    // Sculpted Armored Boot / Sabaton - Natural arch, rounded heel, upturned toe
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.moveTo(-8 + legBackX, 23 + legBackY);
    ctx.lineTo(-2 + legBackX, 23 + legBackY);
    ctx.quadraticCurveTo(0 + legBackX, 25 + legBackY, 1.5 + legBackX, 26 + legBackY);
    ctx.quadraticCurveTo(2.5 + legBackX, 27 + legBackY, 2 + legBackX, 28 + legBackY);
    ctx.quadraticCurveTo(-4 + legBackX, 28.5 + legBackY, -9 + legBackX, 28 + legBackY);
    ctx.quadraticCurveTo(-10 + legBackX, 26 + legBackY, -8 + legBackX, 23 + legBackY);
    ctx.closePath();
    ctx.fill();

    // Metal Toe Cap & Sole Tread
    ctx.fillStyle = hCol;
    ctx.beginPath();
    ctx.arc(0.8 + legBackX, 26.5 + legBackY, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-9 + legBackX, 28 + legBackY);
    ctx.lineTo(2 + legBackX, 28 + legBackY);
    ctx.stroke();

    // --- Off-Hand Arm (in background or defensive guard) ---
    const offSwingAngle = isMoving ? -Math.sin(this.walkCycle) * 0.45 : Math.sin(animT * 2) * 0.1;
    ctx.save();
    ctx.translate(-4, -6 + breathe);
    ctx.rotate(offSwingAngle);

    // Contoured upper arm (deltoid to elbow)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(-0.5, 4, 2.5, 4.5, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Vambrace & Gauntlet (curved forearm)
    ctx.fillStyle = hCol;
    ctx.beginPath();
    ctx.moveTo(-3.5, 6);
    ctx.quadraticCurveTo(-4.5, 9, -3, 12);
    ctx.lineTo(1.5, 12);
    ctx.quadraticCurveTo(2, 9, 1, 6);
    ctx.closePath();
    ctx.fill();

    // Natural curved fist
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.ellipse(-0.8, 13, 2.4, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-1.5, 13, 1, 1.5);
    ctx.fillRect(0, 13, 1, 1.5);

    // Dedicated Hero Off-Hand Item (Shield, Drone, Off-blade, Catalyst, Spirits)
    if (this.heroModule && this.heroModule.drawOffHand) {
      this.heroModule.drawOffHand(ctx, this);
    }
    ctx.restore();

    // --- Front Leg ---
    // Upper Thigh (Cuisse) - Organic curved muscle contour
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(1 + legFrontX, 5 + legFrontY);
    ctx.quadraticCurveTo(0 + legFrontX, 9 + legFrontY, 1 + legFrontX, 14 + legFrontY);
    ctx.lineTo(8 + legFrontX, 14 + legFrontY);
    ctx.quadraticCurveTo(10 + legFrontX, 9 + legFrontY, 8 + legFrontX, 5 + legFrontY);
    ctx.closePath();
    ctx.fill();

    // Armored Knee Cop (Poleyn) - Rounded joint
    ctx.fillStyle = hCol;
    ctx.beginPath();
    ctx.ellipse(4.5 + legFrontX, 14 + legFrontY, 4.5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(3.5 + legFrontX, 13 + legFrontY, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Lower Leg Greave - Contoured calf muscle
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(1 + legFrontX, 15 + legFrontY);
    ctx.quadraticCurveTo(0 + legFrontX, 18 + legFrontY, 1.5 + legFrontX, 23 + legFrontY);
    ctx.lineTo(7.5 + legFrontX, 23 + legFrontY);
    ctx.quadraticCurveTo(9.5 + legFrontX, 19 + legFrontY, 8 + legFrontX, 15 + legFrontY);
    ctx.closePath();
    ctx.fill();

    // Plated ridge highlight
    ctx.strokeStyle = hCol;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(4.5 + legFrontX, 16 + legFrontY);
    ctx.quadraticCurveTo(5.5 + legFrontX, 19 + legFrontY, 4 + legFrontX, 22 + legFrontY);
    ctx.stroke();

    // Sculpted Armored Boot / Sabaton
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.moveTo(1 + legFrontX, 23 + legFrontY);
    ctx.lineTo(7 + legFrontX, 23 + legFrontY);
    ctx.quadraticCurveTo(9 + legFrontX, 25 + legFrontY, 11 + legFrontX, 26 + legFrontY);
    ctx.quadraticCurveTo(12 + legFrontX, 27 + legFrontY, 11 + legFrontX, 28 + legFrontY);
    ctx.quadraticCurveTo(5 + legFrontX, 28.5 + legFrontY, 0 + legFrontX, 28 + legFrontY);
    ctx.quadraticCurveTo(-1 + legFrontX, 26 + legFrontY, 1 + legFrontX, 23 + legFrontY);
    ctx.closePath();
    ctx.fill();

    // Metal Toe Cap & Sole Tread
    ctx.fillStyle = hCol;
    ctx.beginPath();
    ctx.arc(10 + legFrontX, 26.5 + legFrontY, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0 + legFrontX, 28 + legFrontY);
    ctx.lineTo(11 + legFrontX, 28 + legFrontY);
    ctx.stroke();

    // 3. Torso & Rune Armor (with natural athletic waist taper & curved chest volume)
    ctx.save();
    ctx.translate(0, breathe);
    if (this.heroModule && this.heroModule.drawTorso) {
      this.heroModule.drawTorso(ctx, this);
    } else {
      // Natural athletic torso silhouette (broad shoulders tapering to waist)
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(-11, -17);
      ctx.quadraticCurveTo(-12, -8, -8, 2);
      ctx.quadraticCurveTo(-9, 5, -8, 8);
      ctx.lineTo(8, 8);
      ctx.quadraticCurveTo(9, 5, 8, 2);
      ctx.quadraticCurveTo(12, -8, 11, -17);
      ctx.quadraticCurveTo(0, -15, -11, -17);
      ctx.closePath();
      ctx.fill();

      // Cuirass / Breastplate with curved chest volume
      ctx.fillStyle = hCol;
      ctx.beginPath();
      ctx.moveTo(-10, -15);
      ctx.quadraticCurveTo(-11, -7, -7, 0);
      ctx.lineTo(7, 0);
      ctx.quadraticCurveTo(11, -7, 10, -15);
      ctx.quadraticCurveTo(0, -13, -10, -15);
      ctx.closePath();
      ctx.fill();

      // Chest Specular Arc (natural convex volume)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.beginPath();
      ctx.ellipse(0, -9, 6, 4, 0, 0, Math.PI);
      ctx.fill();

      // Inner armor plate
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.ellipse(0, -8, 5, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Glowing Zodiac Sigil
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = hCol;
      ctx.shadowBlur = 6;
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(this.hero.symbol, 0, -5);
      ctx.shadowBlur = 0;
      ctx.textAlign = 'left';

      // Curved Belt with rounded buckle
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(-9, 2);
      ctx.quadraticCurveTo(0, 4, 9, 2);
      ctx.lineTo(9, 7);
      ctx.quadraticCurveTo(0, 9, -9, 7);
      ctx.closePath();
      ctx.fill();

      // Rounded Bronze Belt Buckle
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.ellipse(0, 5, 3.5, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Shoulders & Pauldrons (Rounded anatomical epaulets)
    if (this.heroModule && this.heroModule.drawShoulders) {
      this.heroModule.drawShoulders(ctx, this);
    } else {
      ctx.fillStyle = hCol;
      ctx.beginPath();
      ctx.ellipse(-11, -13, 5, 4, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(11, -13, 5, 4, 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 5. Head, Facial Features, Hair & Headwear (Contoured human head silhouette)
    if (this.heroModule && this.heroModule.drawHead) {
      this.heroModule.drawHead(ctx, this);
    } else {
      // Natural contoured human head silhouette
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.moveTo(-6, -28);
      ctx.quadraticCurveTo(0, -32, 6, -28);
      ctx.quadraticCurveTo(6.5, -23, 5, -19);
      ctx.quadraticCurveTo(0, -17, -5, -19);
      ctx.quadraticCurveTo(-6.5, -23, -6, -28);
      ctx.closePath();
      ctx.fill();

      // Neck blending to shoulders
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.moveTo(-3, -19);
      ctx.lineTo(3, -19);
      ctx.lineTo(4, -15);
      ctx.lineTo(-4, -15);
      ctx.closePath();
      ctx.fill();

      if (this.heroModule && this.heroModule.drawHelmet) {
        this.heroModule.drawHelmet(ctx, this);
      }
    }
    ctx.restore(); // Restore breathing offset

    // 6. Articulated Weapon Arm Motion (Natural arm curves)
    const swingPhase = this.attackSwing > 0 ? (this.attackSwing / 14) : 0;
    const swingAngle = swingPhase > 0 ? (Math.sin(swingPhase * Math.PI) * -1.3) : (isMoving ? Math.sin(this.walkCycle) * 0.35 : 0);

    // Arm holding weapon
    ctx.save();
    ctx.translate(3, -6 + breathe);
    ctx.rotate(swingAngle * 0.6);

    // Contoured upper arm (deltoid/bicep)
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(2.5, 4, 2.8, 5, -0.1, 0, Math.PI * 2);
    ctx.fill();

    // Vambrace & Gauntlet (curved forearm)
    ctx.fillStyle = hCol;
    ctx.beginPath();
    ctx.moveTo(0, 6);
    ctx.quadraticCurveTo(-1, 9, 0.5, 12);
    ctx.lineTo(5.5, 12);
    ctx.quadraticCurveTo(6.5, 9, 5, 6);
    ctx.closePath();
    ctx.fill();

    // Hand: curved organic gripping hand
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.ellipse(3, 13, 2.5, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(2, 13, 1, 1.5);
    ctx.fillRect(4, 13, 1, 1.5);
    ctx.restore();

    // Weapon
    ctx.save();
    ctx.translate(10, -2 + breathe);
    ctx.rotate(swingAngle);
    if (this.heroModule && this.heroModule.drawWeapon) {
      this.heroModule.drawWeapon(ctx, this);
    }
    ctx.restore();

    // 7. Attack Arc Trail & Flash
    if (this.attackSwing > 0) {
      ctx.save();
      ctx.strokeStyle = hCol;
      ctx.lineWidth = 4.5;
      ctx.shadowColor = hCol;
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(10, -2, 34, -Math.PI * 0.45, Math.PI * 0.45);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();

    // Draw Gemini Twin Astral Clones (Castor & Pollux)
    if (this.clones && this.clones.length > 0) {
      for (const c of this.clones) {
        ctx.save();
        ctx.translate(c.x + this.w / 2, c.y + this.h / 2);
        ctx.globalAlpha = 0.85;
        if (c.facing < 0) ctx.scale(-1, 1);

        // Wind aura blur
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 15;

        // Ethereal clone body
        ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, 15, 24, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Twin Silver Chakrams
        const rot = performance.now() * 0.012;
        ctx.strokeStyle = '#e0f2fe';
        ctx.lineWidth = 2.5;
        // Left Chakram
        ctx.beginPath();
        ctx.arc(-18, 2, 9, rot, rot + Math.PI * 1.5);
        ctx.stroke();
        // Right Chakram
        ctx.beginPath();
        ctx.arc(18, 2, 9, -rot, -rot + Math.PI * 1.5);
        ctx.stroke();

        // Clone name overhead
        ctx.fillStyle = '#bae6fd';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`♊ ${c.name}`, 0, -30);

        ctx.restore();
      }
    }
  }
}
