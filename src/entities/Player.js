import { HERO_CONFIGS } from '../config/heroes.js';
import { getHeroModule } from './heroes/index.js';
import { sound } from '../engine/Audio.js';
import { particles } from '../engine/Particles.js';
import { checkRectCollision } from '../engine/Physics.js';
import { relicManager } from './Relics.js';

/**
 * PlayerEntity manages hero physics, animations, combat skills,
 * and delegates character-specific rendering to dedicated hero modules.
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

  /**
   * Updates player physics, movement inputs, platform collisions, and relic pickups.
   */
  update(moveLeft, moveRight, jumpKey, platforms, enemies, onDefeat, onShake, onSynergyHit, levelWidth = 3200) {
    this.animTimer += 0.08;
    if (this.energy < this.maxEnergy) this.energy = Math.min(this.maxEnergy, this.energy + 0.22);
    if (this.dashCooldown > 0) this.dashCooldown--;
    if (this.qCooldown > 0) this.qCooldown--;
    if (this.eCooldown > 0) this.eCooldown--;
    if (this.invulnTime > 0) this.invulnTime--;
    if (this.isDashing > 0) this.isDashing--;
    if (this.attackSwing > 0) this.attackSwing--;

    let moveX = 0;
    if (moveLeft) moveX -= 1;
    if (moveRight) moveX += 1;

    if (moveX !== 0) {
      this.facing = moveX;
      this.vx = moveX * this.hero.speed;
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
      particles.createSparks(this.x + this.w/2, this.y + this.h, this.hero.color, 10);
    }

    // Gravity
    this.vy += 0.55;
    if (this.vy > 14) this.vy = 14;

    // Dash speed boost
    if (this.isDashing > 0) {
      this.vx = this.facing * 14;
      this.vy = 0;
      particles.createTrail(this.x, this.y, this.w, this.h, this.hero.color);
    }

    this.x += this.vx;
    this.y += this.vy;

    // Arena horizontal bounds (Extended to full level width)
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

    // Relic Pickups
    for (let i = relicManager.relicPickups.length - 1; i >= 0; i--) {
      const r = relicManager.relicPickups[i];
      if (checkRectCollision(this, r)) {
        sound.playItem();
        if (r.type === 'meatball') {
          this.hp = Math.min(this.maxHp, this.hp + 35);
          particles.createDamageNumber(this.x + this.w/2, this.y - 10, '+35 HP! 🧆', '#4ade80');
        } else if (r.type === 'surstromming') {
          if (onShake) onShake(10);
          enemies.forEach(en => {
            en.hp -= 40;
            en.stunTimer = 100;
            particles.createDamageNumber(en.x + en.w/2, en.y, 'GAS! -40 🐟', '#a855f7');
          });
          particles.createSparks(this.x, this.y, '#a855f7', 30);
        } else if (r.type === 'fika') {
          this.energy = this.maxEnergy;
          this.ultCharge = Math.min(100, this.ultCharge + 25);
          particles.createDamageNumber(this.x + this.w/2, this.y - 10, 'FIKA BOOST! ☕', '#38bdf8');
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
        damage: 22,
        life: 60
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
        damage: 28,
        life: 50
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
        damage: 26,
        life: 55
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
        damage: 24,
        life: 55
      });
    } else {
      sound.playHammer();
      if (onShake) onShake(4);
      meleeHits.push({
        x: this.x + (this.facing > 0 ? this.w : -48),
        y: this.y - 12,
        w: 56,
        h: 74,
        color: this.hero.color,
        element: this.hero.element,
        owner: this.pIndex,
        damage: 34,
        life: 9
      });
      particles.createSparks(this.x + (this.facing > 0 ? this.w + 20 : -20), this.y + 28, this.hero.color, 16);
    }
  }

  /**
   * Casts Skill 1 (Q) - Triple elemental wave.
   */
  castQ(projectiles, onShake) {
    if (this.qCooldown > 0 || this.energy < this.hero.skills.q.cost) return;
    this.qCooldown = this.hero.skills.q.cd;
    this.energy -= this.hero.skills.q.cost;
    sound.playWave();
    if (onShake) onShake(6);

    for (let i = -1; i <= 1; i++) {
      projectiles.push({
        x: this.x + (this.facing > 0 ? this.w + 15 : -15),
        y: this.y + 15 + i * 10,
        vx: this.facing * 9,
        vy: i * 1.5,
        type: 'wave',
        color: this.hero.color,
        element: this.hero.element,
        owner: this.pIndex,
        damage: 38,
        life: 80
      });
    }
  }

  /**
   * Casts Skill 2 (E) - Elemental nova & stun.
   */
  castE(enemies, onSynergyHit, onShake) {
    if (this.eCooldown > 0 || this.energy < this.hero.skills.e.cost) return;
    this.eCooldown = this.hero.skills.e.cd;
    this.energy -= this.hero.skills.e.cost;
    sound.playLaser();
    if (onShake) onShake(10);

    enemies.forEach(en => {
      en.stunTimer = 140;
      en.hp -= 30;
      if (onSynergyHit) onSynergyHit(en, this.hero.element, this.pIndex, 30);
      particles.createDamageNumber(en.x + en.w/2, en.y, `SPECIAL! -30`, this.hero.color);
    });
    particles.createSparks(this.x + this.w/2, this.y + this.h/2, this.hero.color, 35);
  }

  /**
   * Casts Dash (Space / Right-Shift) for invulnerability and speed burst.
   */
  castDash() {
    if (this.dashCooldown > 0) return;
    this.dashCooldown = this.hero.skills.dash.cd;
    this.isDashing = 10;
    this.invulnTime = 16;
    sound.playLaser();
  }

  /**
   * Casts Ultimate (T / P) - Screen-wide celestial burst.
   */
  castUlt(enemies, onSynergyHit, onUltEffect, onShake, levelWidth = 3200, H = 620) {
    if (this.ultCharge < 100) return;
    this.ultCharge = 0;
    sound.playUlt();
    if (onShake) onShake(24);

    if (onUltEffect) {
      onUltEffect({
        timer: 160,
        name: `${this.hero.name.toUpperCase()} CELESTIAL BURST`,
        color: this.hero.color
      });
    }

    enemies.forEach(en => {
      en.hp -= 140;
      en.stunTimer = 180;
      if (onSynergyHit) onSynergyHit(en, this.hero.element, this.pIndex, 140);
      particles.createDamageNumber(en.x + en.w/2, en.y, `ZODIAC BURST! -140`, this.hero.color);
    });
    particles.createSparks(this.x, H/2, this.hero.color, 70);
  }

  /**
   * Handles incoming damage, invulnerability frames, and defeat checks.
   */
  takeDamage(dmg, onDefeat, onShake) {
    if (this.invulnTime > 0 || this.isDashing > 0) return;
    this.hp -= dmg;
    this.invulnTime = 35;
    sound.playHit();
    if (onShake) onShake(8);
    particles.createDamageNumber(this.x + this.w/2, this.y, `-${dmg}`, '#ef4444');
    if (this.hp <= 0) {
      this.hp = 0;
      if (onDefeat) onDefeat();
    }
  }

  /**
   * Renders the player sprite delegating to modular hero classes.
   */
  draw(ctx) {
    if (this.hp <= 0) {
      ctx.save();
      ctx.translate(this.x + this.w/2, this.y + this.h/2);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = 'bold 24px monospace';
      ctx.fillText('👻', -12, 0);
      ctx.restore();
      return;
    }

    const hCol = this.hero.color;
    const isMoving = Math.abs(this.vx) > 0.2;
    const bobY = this.isGrounded && !isMoving ? Math.sin(this.animTimer) * 2.2 : 0;
    const walkSine = Math.sin(this.walkCycle);
    const legOffset = isMoving ? walkSine * 9 : 0;
    const tiltAngle = (this.vx / (this.hero.speed || 4)) * 0.12;
    const speedRatio = Math.abs(this.vx) / (this.hero.speed || 4);
    const capeFlutter = Math.sin(this.animTimer * 2.5) * (4 + speedRatio * 8);

    // Aquarius Drone
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

    ctx.save();
    ctx.translate(this.x + this.w/2, this.y + this.h/2 + bobY);
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
    ctx.fillText(`P${this.pIndex}`, 0, -40);
    ctx.textAlign = 'left';

    // 1. Back accessories (Cape / Tail / Wings) from dedicated Hero Module
    if (this.heroModule && this.heroModule.drawBackAccessories) {
      this.heroModule.drawBackAccessories(ctx, this, speedRatio, capeFlutter);
    }

    // 2. Articulated Legs & Boots
    const legFrontX = this.isGrounded ? legOffset : 4;
    const legBackX = this.isGrounded ? -legOffset : -6;
    const legFrontY = this.isGrounded ? 0 : -3;
    const legBackY = this.isGrounded ? 0 : 4;

    // Back Leg
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-8 + legBackX, 6 + legBackY, 7, 18);
    ctx.fillStyle = hCol;
    ctx.fillRect(-8 + legBackX, 18 + legBackY, 8, 8);
    ctx.fillStyle = '#020617';
    ctx.fillRect(-8 + legBackX, 24 + legBackY, 9, 3);

    // Front Leg
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(1 + legFrontX, 6 + legFrontY, 7, 18);
    ctx.fillStyle = hCol;
    ctx.fillRect(1 + legFrontX, 18 + legFrontY, 8, 8);
    ctx.fillStyle = '#020617';
    ctx.fillRect(1 + legFrontX, 24 + legFrontY, 9, 3);

    // 3. Torso & Rune Armor
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-12, -18, 24, 26);
    ctx.fillStyle = hCol;
    ctx.fillRect(-10, -16, 20, 22);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-7, -13, 14, 16);

    // Glowing Zodiac Sigil
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.hero.symbol, 0, 0);
    ctx.textAlign = 'left';

    // Belt
    ctx.fillStyle = '#334155';
    ctx.fillRect(-11, 4, 22, 4);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-3, 3, 6, 6);

    // 4. Head, Face & Custom Helmet from dedicated Hero Module
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-6, -28, 12, 11);
    if (this.heroModule && this.heroModule.drawHelmet) {
      this.heroModule.drawHelmet(ctx, this);
    }

    // 5. Weapon & Attack Motion from dedicated Hero Module
    const swingPhase = this.attackSwing > 0 ? (this.attackSwing / 14) : 0;
    const swingAngle = swingPhase > 0 ? (Math.sin(swingPhase * Math.PI) * -1.3) : (isMoving ? Math.sin(this.walkCycle) * 0.2 : 0);

    ctx.save();
    ctx.translate(10, -2);
    ctx.rotate(swingAngle);
    if (this.heroModule && this.heroModule.drawWeapon) {
      this.heroModule.drawWeapon(ctx, this);
    }
    ctx.restore();

    // 6. Attack Arc Trail & Flash
    if (this.attackSwing > 0) {
      ctx.save();
      ctx.strokeStyle = hCol;
      ctx.lineWidth = 4;
      ctx.shadowColor = hCol;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(10, -2, 32, -Math.PI * 0.45, Math.PI * 0.45);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }
}
