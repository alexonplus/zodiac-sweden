import { HERO_CONFIGS } from '../config/heroes.js';
import { sound } from '../engine/Audio.js';
import { particles } from '../engine/Particles.js';
import { checkRectCollision } from '../engine/Physics.js';
import { relicManager } from './Relics.js';

/**
 * PlayerEntity manages hero physics, animations, combat skills,
 * and procedural 16-bit pixel rendering for all 12 Zodiac signs.
 */
export class PlayerEntity {
  constructor(pIndex) {
    this.pIndex = pIndex;
    this.hero = HERO_CONFIGS['aquarius'];
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
  update(moveLeft, moveRight, jumpKey, platforms, enemies, onDefeat, onShake, onSynergyHit, W) {
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
      this.walkCycle += 0.25;
    } else {
      this.vx *= 0.75;
      if (Math.abs(this.vx) < 0.1) this.vx = 0;
      this.walkCycle = 0;
    }

    if (jumpKey && this.isGrounded) {
      this.vy = this.hero.jumpForce;
      this.isGrounded = false;
      sound.playLaser();
      particles.createSparks(this.x + this.w/2, this.y + this.h, this.hero.color, 8);
    }

    // Gravity
    this.vy += 0.55;
    if (this.vy > 14) this.vy = 14;

    // Dash dash speed boost
    if (this.isDashing > 0) {
      this.vx = this.facing * 13;
      this.vy = 0;
      particles.createTrail(this.x, this.y, this.w, this.h, this.hero.color);
    }

    this.x += this.vx;
    this.y += this.vy;

    // Arena horizontal bounds
    if (this.x < 20) this.x = 20;
    if (this.x > W - this.w - 20) this.x = W - this.w - 20;

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
        w: 52,
        h: 74,
        color: this.hero.color,
        element: this.hero.element,
        owner: this.pIndex,
        damage: 34,
        life: 9
      });
      particles.createSparks(this.x + (this.facing > 0 ? this.w + 20 : -20), this.y + 28, this.hero.color, 14);
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
  castUlt(enemies, onSynergyHit, onUltEffect, onShake, W, H) {
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
    particles.createSparks(W/2, H/2, this.hero.color, 70);
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
   * Procedurally renders the 16-bit pixel art sprite for all 12 Zodiac signs.
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

    const hId = this.hero.id;
    const bobY = Math.sin(this.animTimer) * 2;
    const legOffset = Math.sin(this.walkCycle) * 7;

    // 1. Aquarius Cyber Drone
    if (hId === 'aquarius') {
      ctx.save();
      ctx.translate(this.drone.x, this.drone.y);
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-3, -2, 6, 4);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 8);
      ctx.lineTo(this.facing * 30, 45);
      ctx.stroke();
      ctx.restore();
    }

    ctx.save();
    ctx.translate(this.x + this.w/2, this.y + this.h/2 + bobY);
    if (this.facing < 0) ctx.scale(-1, 1);

    if (this.invulnTime > 0 && Math.floor(this.invulnTime / 4) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    // Player indicator tag
    ctx.fillStyle = this.pIndex === 1 ? '#00f0ff' : '#facc15';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`P${this.pIndex}`, 0, -38);
    ctx.textAlign = 'left';

    // 2. Back accessories / Cloaks / Scarves
    if (hId === 'leo') {
      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      ctx.moveTo(-10, -10);
      ctx.lineTo(-24 - Math.abs(this.vx)*1.5, 18);
      ctx.lineTo(-6, 20);
      ctx.fill();
    } else if (hId === 'gemini') {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-8, -18);
      ctx.quadraticCurveTo(-22, -10 + Math.sin(this.animTimer*2)*6, -30, -5);
      ctx.stroke();
    } else if (hId === 'taurus') {
      ctx.fillStyle = '#d97706';
      ctx.fillRect(-18, -14, 8, 26);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-16, -10, 4, 18);
    } else if (hId === 'sagittarius') {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-16, -20, 6, 22);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-15, -24, 4, 6);
    } else if (hId === 'scorpio') {
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-6, 8);
      ctx.quadraticCurveTo(-20, -10, -12, -26);
      ctx.lineTo(-4, -28);
      ctx.stroke();
      ctx.fillStyle = '#ec4899';
      ctx.fillRect(-4, -30, 5, 5);
    }

    // 3. Legs & Boots (Animated Stride)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-10 - (this.isGrounded ? legOffset : -3), 6, 8, 20);
    ctx.fillRect(2 + (this.isGrounded ? legOffset : -3), 6, 8, 20);
    ctx.fillStyle = this.hero.color;
    ctx.fillRect(-10 - (this.isGrounded ? legOffset : -3), 20, 9, 6);
    ctx.fillRect(2 + (this.isGrounded ? legOffset : -3), 20, 9, 6);

    // 4. Torso & Rune Armor
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-13, -18, 26, 26);
    ctx.fillStyle = this.hero.color;
    ctx.fillRect(-10, -15, 20, 20);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(this.hero.symbol, -5, -1);

    // 5. Head & Face
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-7, -27, 14, 10);

    // 6. Distinct Zodiac Headgear / Helmets
    if (hId === 'aquarius') {
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-8, -31, 16, 6);
      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(-6, -25, 12, 4);
    } else if (hId === 'aries') {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-8, -32, 16, 8);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-15, -34, 7, 5);
      ctx.fillRect(-17, -29, 4, 6);
      ctx.fillRect(8, -34, 7, 5);
      ctx.fillRect(13, -29, 4, 6);
    } else if (hId === 'taurus') {
      ctx.fillStyle = '#b45309';
      ctx.fillRect(-8, -32, 16, 7);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-14, -36, 6, 6);
      ctx.fillRect(8, -36, 6, 6);
    } else if (hId === 'leo') {
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(-10, -32, 20, 6);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-8, -35, 16, 5);
      ctx.fillRect(-7, -38, 4, 4);
      ctx.fillRect(-1, -39, 4, 5);
      ctx.fillRect(5, -38, 4, 4);
    } else if (hId === 'cancer') {
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-8, -31, 16, 6);
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(-4, -36, 8, 6);
    } else if (hId === 'virgo') {
      ctx.fillStyle = '#15803d';
      ctx.fillRect(-8, -31, 16, 6);
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(-4, -34, 8, 4);
    } else if (hId === 'libra') {
      ctx.fillStyle = '#4338ca';
      ctx.fillRect(-8, -31, 16, 6);
      ctx.fillStyle = '#818cf8';
      ctx.fillRect(-6, -26, 12, 4);
    } else if (hId === 'scorpio') {
      ctx.fillStyle = '#581c87';
      ctx.fillRect(-9, -32, 18, 9);
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(-5, -25, 4, 3);
      ctx.fillRect(1, -25, 4, 3);
    } else if (hId === 'sagittarius') {
      ctx.fillStyle = '#c2410c';
      ctx.fillRect(-8, -31, 16, 6);
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(-14, -33, 6, 4);
    } else if (hId === 'capricorn') {
      ctx.fillStyle = '#0e7490';
      ctx.fillRect(-8, -31, 16, 6);
      ctx.fillStyle = '#67e8f9';
      ctx.fillRect(-13, -37, 5, 8);
      ctx.fillRect(8, -37, 5, 8);
    } else if (hId === 'pisces') {
      ctx.fillStyle = '#0f766e';
      ctx.fillRect(-8, -31, 16, 6);
      ctx.fillStyle = '#2dd4bf';
      ctx.fillRect(-2, -37, 5, 8);
    } else {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-8, -30, 16, 6);
    }

    // 7. Weapon Rendering & Attack Motion
    const swingAngle = this.attackSwing > 0 ? (this.attackSwing / 14) * Math.PI * 0.8 : 0;
    ctx.save();
    ctx.translate(10, -4);
    ctx.rotate(swingAngle);

    if (hId === 'aries') {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(0, -2, 18, 4);
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(16, -10, 14, 20);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(20, -7, 6, 14);
    } else if (hId === 'leo') {
      ctx.fillStyle = '#facc15';
      ctx.fillRect(0, -2, 6, 4);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(6, -3, 24, 6);
      ctx.fillStyle = '#fff';
      ctx.fillRect(8, -1, 20, 2);
    } else if (hId === 'cancer') {
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(0, -2, 26, 4);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(24, -8, 4, 16);
      ctx.fillRect(28, -6, 6, 2);
      ctx.fillRect(28, 4, 6, 2);
    } else if (hId === 'sagittarius') {
      ctx.strokeStyle = '#fb923c';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(10, 0, 14, -Math.PI/2, Math.PI/2);
      ctx.stroke();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(10, -14);
      ctx.lineTo(10, 14);
      ctx.stroke();
    } else if (hId === 'scorpio') {
      ctx.fillStyle = '#a855f7';
      ctx.fillRect(0, -2, 6, 4);
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(6, -2, 14, 4);
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(18, -1, 4, 2);
    } else if (hId === 'gemini') {
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(0, -2, 18, 4);
    } else {
      ctx.fillStyle = this.hero.color;
      ctx.fillRect(0, -3, 14, 6);
    }

    ctx.restore();

    // 8. Attack Swing Arc Trail
    if (this.attackSwing > 0) {
      ctx.strokeStyle = this.hero.color;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(8, 0, 28, -Math.PI/3, Math.PI/3);
      ctx.stroke();
    }

    ctx.restore();
  }
}
