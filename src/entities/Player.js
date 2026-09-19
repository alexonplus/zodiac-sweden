import { HERO_CONFIGS } from '../config/heroes.js';
import { sound } from '../engine/Audio.js';
import { particles } from '../engine/Particles.js';
import { checkRectCollision } from '../engine/Physics.js';
import { relicManager } from './Relics.js';

/**
 * PlayerEntity manages hero physics, animations, combat skills,
 * and high-definition procedural 16/32-bit animated arcade rendering for all 12 Zodiac signs.
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

    // Dash dash speed boost
    if (this.isDashing > 0) {
      this.vx = this.facing * 14;
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
   * Procedurally renders the advanced 16/32-bit animated arcade sprite for all 12 Zodiac heroes.
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
    const hCol = this.hero.color;
    const isMoving = Math.abs(this.vx) > 0.2;
    const bobY = this.isGrounded && !isMoving ? Math.sin(this.animTimer) * 2.2 : 0;
    const walkSine = Math.sin(this.walkCycle);
    const legOffset = isMoving ? walkSine * 9 : 0;
    const tiltAngle = (this.vx / this.hero.speed) * 0.12;

    // 1. Aquarius Cyber Drone Companion
    if (hId === 'aquarius') {
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
      // Glowing Core & Rotor
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-4, -1.5, 8, 3);
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-10, -4);
      ctx.lineTo(10, -4);
      ctx.stroke();
      // Tether beam to player
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

    // ================= 2. LAYER: BACK ACCESSORIES / CLOAKS / SCARVES / TAILS =================
    const speedRatio = Math.abs(this.vx) / (this.hero.speed || 4);
    const capeFlutter = Math.sin(this.animTimer * 2.5) * (4 + speedRatio * 8);

    if (hId === 'leo') {
      // Royal Crimson & Gold-Edged Flowing Cape
      ctx.fillStyle = '#991b1b';
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-10, -14);
      ctx.quadraticCurveTo(-26 - speedRatio * 16, 8 + capeFlutter, -22 - speedRatio * 14, 26);
      ctx.lineTo(-6, 18);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (hId === 'aries') {
      // Molten Fire Scarf / Flame Mantle
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.moveTo(-8, -16);
      ctx.quadraticCurveTo(-24 - speedRatio * 14, -6 + capeFlutter, -28 - speedRatio * 12, 6);
      ctx.lineTo(-8, -2);
      ctx.closePath();
      ctx.fill();
    } else if (hId === 'gemini') {
      // Dual Fluttering Wind Ribbons (Cyan & Violet)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-6, -18);
      ctx.quadraticCurveTo(-20, -12 + capeFlutter, -32 - speedRatio * 10, -8);
      ctx.stroke();

      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-6, -12);
      ctx.quadraticCurveTo(-22, -6 - capeFlutter, -30 - speedRatio * 10, 2);
      ctx.stroke();
    } else if (hId === 'taurus') {
      // Heavy Spiked Leather Harness & Copper Shoulders
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-18, -16, 8, 28);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(-16, -12, 4, 20);
      // Studs
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-17, -10, 2, 2);
      ctx.fillRect(-17, -2, 2, 2);
      ctx.fillRect(-17, 6, 2, 2);
    } else if (hId === 'scorpio') {
      // Articulated 5-Segment Scorpion Stinger Tail
      const tailWhip = Math.sin(this.animTimer * 2) * 4;
      ctx.strokeStyle = '#7e22ce';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(-8, 6);
      ctx.quadraticCurveTo(-24 + tailWhip, -10, -16, -30);
      ctx.lineTo(-4, -34);
      ctx.stroke();

      // Glowing Poison Stinger
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.moveTo(-4, -34);
      ctx.lineTo(2, -37);
      ctx.lineTo(-2, -30);
      ctx.closePath();
      ctx.fill();
    } else if (hId === 'sagittarius') {
      // Solar Quiver with Golden Arrows
      ctx.fillStyle = '#431407';
      ctx.fillRect(-16, -24, 7, 24);
      ctx.fillStyle = '#fb923c';
      ctx.fillRect(-14, -28, 4, 6);
      ctx.fillStyle = '#fde68a';
      ctx.fillRect(-13, -31, 2, 4);
    } else if (hId === 'virgo') {
      // Forest Leaf Mantle
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.moveTo(-8, -14);
      ctx.quadraticCurveTo(-22 - speedRatio * 12, 4 + capeFlutter, -16, 22);
      ctx.lineTo(-5, 14);
      ctx.closePath();
      ctx.fill();
    } else if (hId === 'libra') {
      // Cosmic Starlight Mantle
      ctx.fillStyle = '#312e81';
      ctx.strokeStyle = '#818cf8';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-8, -16);
      ctx.quadraticCurveTo(-24 - speedRatio * 12, 6 + capeFlutter, -18, 24);
      ctx.lineTo(-4, 16);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (hId === 'capricorn') {
      // Frost Mountain Fur Mantle
      ctx.fillStyle = '#0e7490';
      ctx.fillRect(-18, -14, 8, 22);
      ctx.fillStyle = '#cffafe';
      ctx.fillRect(-20, -16, 10, 6);
    } else if (hId === 'pisces') {
      // Ethereal Flowing Sea Veil
      ctx.fillStyle = 'rgba(45, 212, 191, 0.6)';
      ctx.beginPath();
      ctx.moveTo(-8, -14);
      ctx.quadraticCurveTo(-26 - speedRatio * 14, 8 + capeFlutter, -18, 26);
      ctx.lineTo(-4, 16);
      ctx.closePath();
      ctx.fill();
    }

    // ================= 3. LAYER: ARTICULATED LEGS & BOOTS =================
    const legFrontX = this.isGrounded ? legOffset : 4;
    const legBackX = this.isGrounded ? -legOffset : -6;
    const legFrontY = this.isGrounded ? 0 : -3;
    const legBackY = this.isGrounded ? 0 : 4;

    // Back Leg
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-8 + legBackX, 6 + legBackY, 7, 18);
    ctx.fillStyle = hCol;
    ctx.fillRect(-8 + legBackX, 18 + legBackY, 8, 8);
    // Boot sole
    ctx.fillStyle = '#020617';
    ctx.fillRect(-8 + legBackX, 24 + legBackY, 9, 3);

    // Front Leg
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(1 + legFrontX, 6 + legFrontY, 7, 18);
    ctx.fillStyle = hCol;
    ctx.fillRect(1 + legFrontX, 18 + legFrontY, 8, 8);
    // Boot sole
    ctx.fillStyle = '#020617';
    ctx.fillRect(1 + legFrontX, 24 + legFrontY, 9, 3);

    // ================= 4. LAYER: TORSO & ELEMENTAL RUNE ARMOR =================
    // Body base
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-12, -18, 24, 26);

    // Armored Cuirass with Hero Color
    ctx.fillStyle = hCol;
    ctx.fillRect(-10, -16, 20, 22);

    // Breastplate inner shade
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-7, -13, 14, 16);

    // Glowing Zodiac Constellation Sigil on Chest
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.hero.symbol, 0, 0);
    ctx.textAlign = 'left';

    // Belt & Buckle
    ctx.fillStyle = '#334155';
    ctx.fillRect(-11, 4, 22, 4);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-3, 3, 6, 6);

    // ================= 5. LAYER: HEAD, FACE & CUSTOM ZODIAC HELMETS =================
    // Head / Face base
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-6, -28, 12, 11);

    // Distinct Helmets & Headpieces
    if (hId === 'aries') {
      // Molten Crimson Horned Helm + Large Curled Golden Ram Horns
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-8, -34, 16, 9);
      // Curled Ram Horns (Gold)
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-16, -37, 8, 6);
      ctx.fillRect(-18, -31, 5, 7);
      ctx.fillRect(8, -37, 8, 6);
      ctx.fillRect(13, -31, 5, 7);
      // Red Battle Slit Visor
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-6, -26, 12, 4);
      ctx.fillStyle = '#f87171';
      ctx.fillRect(-4, -25, 8, 2);
    } else if (hId === 'taurus') {
      // Bronze Bull Minotaur Helm + Outward Horns + Golden Nose Ring
      ctx.fillStyle = '#b45309';
      ctx.fillRect(-9, -34, 18, 8);
      // Heavy Horns
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(-16, -38, 7, 7);
      ctx.fillRect(9, -38, 7, 7);
      // Amber Eyes
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-5, -26, 4, 3);
      ctx.fillRect(1, -26, 4, 3);
      // Nose Ring
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-2, -20, 4, 3);
    } else if (hId === 'gemini') {
      // Dual Cyan / Magenta Split Faceplate + Aerodynamic Wing Antennas
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-8, -33, 8, 8);
      ctx.fillStyle = '#9333ea';
      ctx.fillRect(0, -33, 8, 8);
      // Wing Antennas
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-13, -37, 5, 8);
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(8, -37, 5, 8);
      // Dual Eyes
      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(-5, -26, 3, 2);
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(2, -26, 3, 2);
    } else if (hId === 'cancer') {
      // Oceanic Carapace Helm + Pincer Crests + Pearl Visor
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(-8, -33, 16, 8);
      // Top Pincer Crests
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-11, -38, 5, 7);
      ctx.fillRect(6, -38, 5, 7);
      // Aqua Visor
      ctx.fillStyle = '#7dd3fc';
      ctx.fillRect(-5, -26, 10, 3);
    } else if (hId === 'leo') {
      // Radiant Solar Sunburst Lion Mane + Gold Crown
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(-12, -37, 24, 14);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-9, -39, 18, 6);
      // Crown points
      ctx.fillRect(-7, -42, 3, 4);
      ctx.fillRect(-1, -43, 3, 5);
      ctx.fillRect(5, -42, 3, 4);
      // Feline Gaze
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(-5, -26, 4, 2);
      ctx.fillRect(1, -26, 4, 2);
    } else if (hId === 'virgo') {
      // Forest Elven Hood + Ivy Laurel Tiara + Jade Gem
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(-8, -34, 16, 9);
      // Laurel Leaves
      ctx.fillStyle = '#86efac';
      ctx.fillRect(-10, -36, 4, 4);
      ctx.fillRect(6, -36, 4, 4);
      // Jade Crystal Eyes
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(-5, -26, 4, 2);
      ctx.fillRect(1, -26, 4, 2);
    } else if (hId === 'libra') {
      // Astral Cowl + Floating Scale Crest + Starry Blindfold
      ctx.fillStyle = '#4338ca';
      ctx.fillRect(-8, -34, 16, 9);
      // Mini Scale Horns
      ctx.fillStyle = '#c7d2fe';
      ctx.fillRect(-11, -38, 4, 6);
      ctx.fillRect(7, -38, 4, 6);
      // Star Blindfold
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-6, -26, 12, 4);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-4, -25, 3, 2);
      ctx.fillRect(1, -25, 3, 2);
    } else if (hId === 'scorpio') {
      // Obsidian Assassin Cowl + Venom Visor
      ctx.fillStyle = '#581c87';
      ctx.fillRect(-9, -34, 18, 10);
      // Toxic Green Gaze
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(-5, -26, 4, 2);
      ctx.fillRect(1, -26, 4, 2);
      // Triangular Filter Mask
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-3, -22, 6, 4);
    } else if (hId === 'sagittarius') {
      // Solar Ranger Circlet + Cyan Tactical Monocle HUD
      ctx.fillStyle = '#c2410c';
      ctx.fillRect(-8, -33, 16, 8);
      // Feather Plume
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(-12, -37, 5, 6);
      // Cyan Targeter HUD Monocle
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(-5, -26, 3, 2);
      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(1, -27, 5, 4);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(3, -26, 2, 2);
    } else if (hId === 'capricorn') {
      // Frost Armor + Jagged Crystalline Ice Horns + Blizzard Trim
      ctx.fillStyle = '#0e7490';
      ctx.fillRect(-8, -34, 16, 9);
      // Ice Horns
      ctx.fillStyle = '#67e8f9';
      ctx.fillRect(-14, -40, 6, 9);
      ctx.fillRect(8, -40, 6, 9);
      // White Ice Eyes
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-5, -26, 4, 2);
      ctx.fillRect(1, -26, 4, 2);
    } else if (hId === 'aquarius') {
      // Neon Cyber Goggles + Circuit Trace Headband
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-8, -33, 16, 8);
      // Hologram Visor Glasses
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-7, -27, 14, 5);
      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(-6, -26, 12, 2);
    } else if (hId === 'pisces') {
      // Aurora Dream Siren + Turquoise Fin Ears + Sea Pearls
      ctx.fillStyle = '#0f766e';
      ctx.fillRect(-8, -33, 16, 8);
      // Koi Fin Ears
      ctx.fillStyle = '#2dd4bf';
      ctx.fillRect(-13, -37, 5, 8);
      ctx.fillRect(8, -37, 5, 8);
      // Ethereal Sea-Foam Eyes
      ctx.fillStyle = '#ccfbf1';
      ctx.fillRect(-5, -26, 4, 2);
      ctx.fillRect(1, -26, 4, 2);
    }

    // ================= 6. LAYER: ANIMATED WEAPONS & ATTACK MOTIONS =================
    const swingPhase = this.attackSwing > 0 ? (this.attackSwing / 14) : 0;
    const swingAngle = swingPhase > 0 ? (Math.sin(swingPhase * Math.PI) * -1.3) : (isMoving ? Math.sin(this.walkCycle) * 0.2 : 0);

    ctx.save();
    ctx.translate(10, -2);
    ctx.rotate(swingAngle);

    if (hId === 'aries') {
      // Heavy Infernal Double-Headed War Axe
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-2, -6, 22, 4); // Shaft
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(16, -16, 12, 24); // Heavy Blade
      ctx.fillStyle = '#facc15';
      ctx.fillRect(20, -12, 6, 16); // Molten Core
    } else if (hId === 'taurus') {
      // Spiked Bronze Maul / Hammer
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-2, -5, 20, 4);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(14, -14, 14, 22);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(26, -11, 4, 4); // Spikes
      ctx.fillRect(26, 1, 4, 4);
    } else if (hId === 'gemini') {
      // Dual Spinning Wind Chakrams
      const chakramSpin = this.animTimer * 6;
      ctx.save();
      ctx.translate(12, 0);
      ctx.rotate(chakramSpin);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(-2, -2, 4, 4);
      ctx.restore();
    } else if (hId === 'cancer') {
      // Oceanic Carapace Tower Shield & Harpoon
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(6, -12, 8, 24); // Shield
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(8, -8, 4, 16);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(2, -2, 22, 3); // Harpoon
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(22, -5, 4, 9);
    } else if (hId === 'leo') {
      // Radiant Glowing Sunblade
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-2, -3, 6, 4); // Hilt
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(4, -6, 3, 10); // Crossguard
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(7, -3, 22, 5); // Blade
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(8, -1, 20, 2); // Core
    } else if (hId === 'virgo') {
      // Verdant Longbow & Arrow
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(8, 0, 14, -Math.PI/2, Math.PI/2);
      ctx.stroke();
      ctx.strokeStyle = '#86efac';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(8, -14);
      ctx.lineTo(8, 14);
      ctx.stroke();
      // Notched Arrow
      ctx.fillStyle = '#facc15';
      ctx.fillRect(2, -1, 16, 2);
    } else if (hId === 'libra') {
      // Gravity Staff & Orbiting Astral Orbs
      ctx.fillStyle = '#4f46e5';
      ctx.fillRect(-2, -4, 24, 3);
      ctx.fillStyle = '#818cf8';
      ctx.fillRect(20, -7, 6, 9);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(22, -5, 3, 5);
    } else if (hId === 'scorpio') {
      // Dual Venom Daggers
      ctx.fillStyle = '#581c87';
      ctx.fillRect(-2, -4, 6, 3);
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(4, -4, 14, 3);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(16, -3, 4, 2); // Poison Tip
    } else if (hId === 'sagittarius') {
      // Plasma Composite Bow
      ctx.strokeStyle = '#fb923c';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(10, 0, 15, -Math.PI/2, Math.PI/2);
      ctx.stroke();
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(10, -15);
      ctx.lineTo(10, 15);
      ctx.stroke();
    } else if (hId === 'capricorn') {
      // Glacial Halberd / Great-Axe
      ctx.fillStyle = '#164e63';
      ctx.fillRect(-2, -5, 24, 4);
      ctx.fillStyle = '#67e8f9';
      ctx.fillRect(18, -14, 12, 22);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(20, -10, 6, 14);
    } else if (hId === 'aquarius') {
      // Ion Plasma Blaster Cannon
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, -5, 18, 7);
      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(4, -3, 10, 3);
      ctx.fillRect(18, -4, 4, 5); // Muzzle
    } else if (hId === 'pisces') {
      // Mystic Dream Orbs
      const orbBob = Math.sin(this.animTimer * 4) * 3;
      ctx.fillStyle = '#2dd4bf';
      ctx.beginPath();
      ctx.arc(12, -4 + orbBob, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ccfbf1';
      ctx.beginPath();
      ctx.arc(18, 4 - orbBob, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // ================= 7. LAYER: ATTACK ARC TRAIL & FLASH =================
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
