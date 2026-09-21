import { checkRectCollision } from '../engine/Physics.js';
import { sound } from '../engine/Audio.js';
import { particles } from '../engine/Particles.js';

/**
 * EnemyMob represents fully animated ground-walking enemies
 * with specialized AI, telegraphs, and unique Swedish folklore/cyber mechanics.
 */
export class EnemyMob {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.vx = 0;
    this.vy = 0;
    this.facing = -1;
    this.isGrounded = false;
    this.stunTimer = 0;
    this.elementTimer = 0;
    this.lastElement = null;
    this.lastOwner = null;

    this.animTimer = Math.random() * 100;
    this.walkCycle = Math.random() * 10;
    this.state = 'walk'; // 'walk', 'windup', 'attack', 'dash', 'backstep', 'aim'
    this.actionTimer = 0;
    this.cooldown = 40 + Math.floor(Math.random() * 50);

    this.initTypeAttributes(type);
  }

  initTypeAttributes(type) {
    if (type === 'viking') {
      this.w = 38; this.h = 58;
      this.hp = 110; this.maxHp = 110;
      this.dmg = 18; this.speed = 2.1;
      this.isShielding = true;
    } else if (type === 'golem') {
      this.w = 46; this.h = 64;
      this.hp = 170; this.maxHp = 170;
      this.dmg = 24; this.speed = 1.5;
      this.drillSpin = 0;
    } else if (type === 'karolin') {
      this.w = 36; this.h = 58;
      this.hp = 85; this.maxHp = 85;
      this.dmg = 20; this.speed = 2.0;
      this.laserAim = false;
    } else if (type === 'corsair') {
      this.w = 36; this.h = 56;
      this.hp = 95; this.maxHp = 95;
      this.dmg = 16; this.speed = 2.5;
      this.isPhased = false;
      this.flurryCount = 0;
    } else if (type === 'troll') {
      this.w = 52; this.h = 68;
      this.hp = 200; this.maxHp = 200;
      this.dmg = 28; this.speed = 1.3;
    } else if (type === 'skogsra') {
      this.w = 34; this.h = 56;
      this.hp = 90; this.maxHp = 90;
      this.dmg = 15; this.speed = 1.9;
    } else {
      // Fallback
      this.w = 36; this.h = 58;
      this.hp = 90; this.maxHp = 90;
      this.dmg = 16; this.speed = 2.0;
    }
  }

  getNearestPlayer(p1, p2, isCoopMode) {
    if (!isCoopMode || !p2 || p2.hp <= 0) return p1;
    if (p1.hp <= 0) return p2;
    const d1 = Math.abs(p1.x - this.x);
    const d2 = Math.abs(p2.x - this.x);
    return d1 < d2 ? p1 : p2;
  }

  update(p1, p2, isCoopMode, enemyProjectiles, platforms = [], onShake) {
    this.animTimer += 0.08;
    if (this.elementTimer > 0) this.elementTimer--;
    if (this.stunTimer > 0) {
      this.stunTimer--;
      this.vx = 0;
      this.applyPhysics(platforms);
      return;
    }

    const target = this.getNearestPlayer(p1, p2, isCoopMode);
    const distToTarget = target ? Math.abs(target.x - this.x) : 9999;
    const dirToTarget = target ? Math.sign(target.x - this.x) : -1;

    if (this.cooldown > 0) this.cooldown--;
    if (this.actionTimer > 0) this.actionTimer--;

    // ================= SPECIFIC ENEMY COMBAT AI =================
    if (this.type === 'viking') {
      this.updateVikingAI(target, distToTarget, dirToTarget, onShake);
    } else if (this.type === 'golem') {
      this.updateGolemAI(target, distToTarget, dirToTarget, onShake);
    } else if (this.type === 'karolin') {
      this.updateKarolinAI(target, distToTarget, dirToTarget, enemyProjectiles);
    } else if (this.type === 'corsair') {
      this.updateCorsairAI(target, distToTarget, dirToTarget);
    } else if (this.type === 'troll') {
      this.updateTrollAI(target, distToTarget, dirToTarget, enemyProjectiles, onShake);
    } else if (this.type === 'skogsra') {
      this.updateSkogsraAI(target, distToTarget, dirToTarget, enemyProjectiles);
    }

    // Apply movement physics and ground collision
    this.applyPhysics(platforms);

    // Collision damage with player during melee contact
    if (this.state === 'attack' || (this.state === 'dash' && this.type === 'golem')) {
      if (checkRectCollision(this, target)) {
        target.takeDamage(this.dmg, null, onShake);
      }
    } else if (checkRectCollision(this, target) && this.cooldown <= 0) {
      target.takeDamage(10, null, onShake);
      this.cooldown = 30;
    }
  }

  applyPhysics(platforms) {
    this.x += this.vx;
    this.y += this.vy;

    // Gravity
    this.vy += 0.55;
    if (this.vy > 14) this.vy = 14;

    const groundY = 490;
    let onPlatform = false;

    // Floor collision
    if (this.y + this.h >= groundY) {
      this.y = groundY - this.h;
      this.vy = 0;
      this.isGrounded = true;
      onPlatform = true;
    }

    // Platforms
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

    if (!onPlatform) this.isGrounded = false;
  }

  // 1. Viking Raider AI: Guard advance, leap cleave
  updateVikingAI(target, dist, dir, onShake) {
    if (this.state === 'walk') {
      this.facing = dir || -1;
      this.vx = this.facing * this.speed;
      this.walkCycle += 0.22;
      this.isShielding = true;

      if (dist < 75 && this.cooldown <= 0 && this.isGrounded) {
        this.state = 'windup';
        this.actionTimer = 22;
        this.vx = 0;
      }
    } else if (this.state === 'windup') {
      this.vx = 0;
      if (this.actionTimer <= 0) {
        this.state = 'attack';
        this.actionTimer = 18;
        this.vy = -7.5; // Leap chop
        this.vx = this.facing * 5.5;
        this.isShielding = false;
        sound.playHammer();
      }
    } else if (this.state === 'attack') {
      if (this.actionTimer <= 0) {
        this.state = 'walk';
        this.cooldown = 70;
        this.isShielding = true;
      }
    }
  }

  // 2. Automaton Golem AI: Pneumatic Drill Charge & Scalding Steam
  updateGolemAI(target, dist, dir, onShake) {
    this.drillSpin += 0.3;
    if (this.state === 'walk') {
      this.facing = dir || -1;
      this.vx = this.facing * this.speed;
      this.walkCycle += 0.16;

      if (dist < 220 && this.cooldown <= 0) {
        this.state = 'windup';
        this.actionTimer = 30; // Steam buildup
        this.vx = 0;
      }
    } else if (this.state === 'windup') {
      this.vx = 0;
      this.drillSpin += 0.6;
      if (this.actionTimer <= 0) {
        this.state = 'dash';
        this.actionTimer = 35; // Charge forward
        this.vx = this.facing * 6.5;
        sound.playLaser();
        if (onShake) onShake(6);
      }
    } else if (this.state === 'dash') {
      this.drillSpin += 0.8;
      particles.createTrail(this.x, this.y, this.w, this.h, '#f59e0b');
      if (this.actionTimer <= 0) {
        this.state = 'walk';
        this.cooldown = 120;
        this.vx = 0;
        // Steam Vent Explosion
        particles.createSparks(this.x + this.w/2, this.y + this.h/2, '#e2e8f0', 25);
        sound.playWave();
      }
    }
  }

  // 3. Caroliner Sniper AI: Aimed Musket Laser & Tactical Backstep
  updateKarolinAI(target, dist, dir, enemyProjectiles) {
    if (this.state === 'walk') {
      this.facing = dir || -1;
      // Maintain distance around 240px
      if (dist < 100) {
        // Too close, backstep away
        this.state = 'backstep';
        this.actionTimer = 16;
        this.vx = -this.facing * 5.0;
        this.vy = -4.0;
      } else if (dist > 280) {
        this.vx = this.facing * this.speed;
        this.walkCycle += 0.2;
      } else {
        // In sweet spot, enter aim mode
        this.vx = 0;
        if (this.cooldown <= 0) {
          this.state = 'aim';
          this.actionTimer = 45;
          this.laserAim = true;
        }
      }
    } else if (this.state === 'aim') {
      this.vx = 0;
      this.facing = dir || -1;
      if (this.actionTimer <= 0) {
        this.laserAim = false;
        this.state = 'walk';
        this.cooldown = 100;
        sound.playLaser();
        // Fire armor-piercing musket bullet
        enemyProjectiles.push({
          x: this.x + (this.facing > 0 ? this.w + 10 : -10),
          y: this.y + 20,
          vx: this.facing * 14,
          vy: 0,
          color: '#fbbf24',
          damage: this.dmg,
          life: 70
        });
        particles.createSparks(this.x + (this.facing > 0 ? this.w + 10 : -10), this.y + 20, '#fbbf24', 8);
      }
    } else if (this.state === 'backstep') {
      if (this.actionTimer <= 0) {
        this.state = 'walk';
        this.cooldown = 40;
      }
    }
  }

  // 4. Ghost Corsair AI: Shadow phase dash behind player, cutlass flurry
  updateCorsairAI(target, dist, dir) {
    if (this.state === 'walk') {
      this.facing = dir || -1;
      this.vx = this.facing * this.speed;
      this.walkCycle += 0.24;
      this.isPhased = false;

      if (dist < 160 && this.cooldown <= 0) {
        this.state = 'dash';
        this.actionTimer = 20;
        this.isPhased = true;
        this.vx = this.facing * 10;
        sound.playLaser();
      }
    } else if (this.state === 'dash') {
      particles.createTrail(this.x, this.y, this.w, this.h, '#38bdf8');
      if (this.actionTimer <= 0) {
        this.isPhased = false;
        this.state = 'attack';
        this.actionTimer = 22;
        this.vx = 0;
        this.facing = -this.facing; // Turn to hit from back
        sound.playHit();
      }
    } else if (this.state === 'attack') {
      if (this.actionTimer <= 0) {
        this.state = 'walk';
        this.cooldown = 110;
      }
    }
  }

  // 5. Stone Troll AI: Ground-Shaking Spike Wave Shockwave
  updateTrollAI(target, dist, dir, enemyProjectiles, onShake) {
    if (this.state === 'walk') {
      this.facing = dir || -1;
      this.vx = this.facing * this.speed;
      this.walkCycle += 0.14;

      if (dist < 180 && this.cooldown <= 0 && this.isGrounded) {
        this.state = 'windup';
        this.actionTimer = 40; // High overhead raise
        this.vx = 0;
      }
    } else if (this.state === 'windup') {
      this.vx = 0;
      if (this.actionTimer <= 0) {
        this.state = 'attack';
        this.actionTimer = 24;
        sound.playHammer();
        if (onShake) onShake(14);
        particles.createSparks(this.x + (this.facing > 0 ? this.w + 10 : -10), this.y + this.h, '#78350f', 30);

        // Spawn traveling ground rock spike shockwave projectile
        enemyProjectiles.push({
          x: this.x + (this.facing > 0 ? this.w + 10 : -10),
          y: 470,
          vx: this.facing * 7.0,
          vy: 0,
          color: '#d97706',
          damage: this.dmg,
          life: 65,
          isGroundWave: true
        });
      }
    } else if (this.state === 'attack') {
      if (this.actionTimer <= 0) {
        this.state = 'walk';
        this.cooldown = 130;
      }
    }
  }

  // 6. Skogsrå Enchantress AI: Root Briar Spores
  updateSkogsraAI(target, dist, dir, enemyProjectiles) {
    if (this.state === 'walk') {
      this.facing = dir || -1;
      this.vx = this.facing * this.speed;
      this.walkCycle += 0.2;

      if (dist < 320 && this.cooldown <= 0) {
        this.state = 'windup';
        this.actionTimer = 35;
        this.vx = 0;
      }
    } else if (this.state === 'windup') {
      this.vx = 0;
      particles.createSparks(this.x + this.w/2, this.y + 10, '#4ade80', 2);
      if (this.actionTimer <= 0) {
        this.state = 'walk';
        this.cooldown = 140;
        sound.playWave();
        // Fire tracking briar spore projectile
        enemyProjectiles.push({
          x: this.x + (this.facing > 0 ? this.w + 6 : -6),
          y: this.y + 15,
          vx: this.facing * 4.5,
          vy: (target.y - this.y) * 0.02,
          color: '#22c55e',
          damage: this.dmg,
          life: 90
        });
      }
    }
  }

  // ================= 16/32-BIT PROCEDURAL ANIMATED ENEMY RENDERING =================
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.w/2, this.y + this.h/2);
    if (this.facing < 0) ctx.scale(-1, 1);

    if (this.isPhased) ctx.globalAlpha = 0.45;
    if (this.stunTimer > 0 && Math.floor(this.stunTimer / 4) % 2 === 0) ctx.globalAlpha = 0.6;

    const isMoving = Math.abs(this.vx) > 0.1;
    const walkSine = Math.sin(this.walkCycle);
    const legOffset = isMoving ? walkSine * 8 : 0;

    // Aim Laser Line for Karolin
    if (this.laserAim) {
      ctx.save();
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.75)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(18, -6);
      ctx.lineTo(350, -6);
      ctx.stroke();
      ctx.restore();
    }

    // Specific enemy rendering routines
    if (this.type === 'viking') {
      this.drawViking(ctx, legOffset);
    } else if (this.type === 'golem') {
      this.drawGolem(ctx, legOffset);
    } else if (this.type === 'karolin') {
      this.drawKarolin(ctx, legOffset);
    } else if (this.type === 'corsair') {
      this.drawCorsair(ctx, legOffset);
    } else if (this.type === 'troll') {
      this.drawTroll(ctx, legOffset);
    } else if (this.type === 'skogsra') {
      this.drawSkogsra(ctx, legOffset);
    }

    // Health Bar
    if (this.hp < this.maxHp) {
      ctx.save();
      ctx.scale(this.facing < 0 ? -1 : 1, 1);
      const hpPct = Math.max(0, this.hp / this.maxHp);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-18, -this.h/2 - 12, 36, 5);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-17, -this.h/2 - 11, 34 * hpPct, 3);
      ctx.restore();
    }

    ctx.restore();
  }

  // 1. Draw Viking Raider
  drawViking(ctx, legOffset) {
    // Legs & Fur Boots
    ctx.fillStyle = '#334155';
    ctx.fillRect(-8 - legOffset, 8, 6, 16);
    ctx.fillRect(2 + legOffset, 8, 6, 16);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-9 - legOffset, 18, 8, 6);
    ctx.fillRect(1 + legOffset, 18, 8, 6);

    // Torso & Chainmail
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-10, -14, 20, 22);
    ctx.fillStyle = '#475569';
    ctx.fillRect(-8, -12, 16, 18);

    // Head, Spectacle Helmet & Red Beard
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-6, -26, 12, 10);
    ctx.fillStyle = '#b91c1c'; // Red Beard
    ctx.fillRect(-6, -18, 12, 8);
    ctx.fillStyle = '#94a3b8'; // Iron Helm
    ctx.fillRect(-8, -32, 16, 8);
    ctx.fillStyle = '#e2e8f0'; // Eyebrow Spectacle Guard
    ctx.fillRect(-6, -26, 12, 3);

    // Round Painted Viking Wooden Shield
    if (this.isShielding) {
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(8, -2, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(8, -2, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Bearded Battleaxe
    const axeAngle = this.state === 'windup' ? -1.5 : (this.state === 'attack' ? 0.8 : -0.2);
    ctx.save();
    ctx.translate(this.isShielding ? -4 : 6, -4);
    ctx.rotate(axeAngle);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(0, -16, 4, 26);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(2, -18, 12, 14);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(4, -14, 8, 8);
    ctx.restore();
  }

  // 2. Draw Heavy LKAB Steam Automaton
  drawGolem(ctx, legOffset) {
    // Heavy Mechanical Piston Legs
    ctx.fillStyle = '#334155';
    ctx.fillRect(-12 - legOffset, 10, 10, 18);
    ctx.fillRect(2 + legOffset, 10, 10, 18);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-13 - legOffset, 22, 12, 6);
    ctx.fillRect(1 + legOffset, 22, 12, 6);

    // Heavy Boiler Torso with Hazard Stripes
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-15, -16, 30, 26);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(-12, -14, 24, 22);

    // Hazard Stripes
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-12, 2, 24, 4);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-8, 2, 6, 4);
    ctx.fillRect(2, 2, 6, 4);

    // Glowing Furnace Core in Chest
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(0, -4, 5, 0, Math.PI * 2);
    ctx.fill();

    // Head / Monocular Golem Visor
    ctx.fillStyle = '#92400e';
    ctx.fillRect(-9, -30, 18, 12);
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(-4, -25, 8, 4);

    // Rotating Pneumatic Drill Arm
    ctx.save();
    ctx.translate(14, -2);
    ctx.rotate(this.drillSpin);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-2, -6, 14, 12);
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(12, -8);
    ctx.lineTo(24, 0);
    ctx.lineTo(12, 8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // 3. Draw Caroliner Musketeer
  drawKarolin(ctx, legOffset) {
    // Tall Riding Boots & White Breeches
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-8 - legOffset, 6, 6, 12);
    ctx.fillRect(2 + legOffset, 6, 6, 12);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-8 - legOffset, 16, 7, 10);
    ctx.fillRect(2 + legOffset, 16, 7, 10);

    // Swedish Royal Blue Longcoat with Yellow Facings
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-10, -16, 20, 22);
    ctx.fillStyle = '#facc15'; // Yellow Cuffs & Trim
    ctx.fillRect(-10, -6, 4, 12);
    ctx.fillRect(6, -6, 4, 12);

    // Head & Tricorn Hat with Yellow Cockade
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-6, -26, 12, 10);
    ctx.fillStyle = '#0f172a'; // Tricorn
    ctx.beginPath();
    ctx.moveTo(-14, -26);
    ctx.lineTo(14, -26);
    ctx.lineTo(0, -36);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#facc15'; // Cockade
    ctx.fillRect(-2, -30, 4, 4);

    // Flintlock Musket with Bayonet
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-4, -8, 28, 4); // Wood stock
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(24, -9, 8, 2); // Steel Barrel
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(32, -9, 8, 1.5); // Bayonet Blade
  }

  // 4. Draw Ghost Corsair
  drawCorsair(ctx, legOffset) {
    // Tattered Ethereal Robes & Mist
    ctx.fillStyle = '#082f49';
    ctx.fillRect(-8 - legOffset, 6, 6, 16);
    ctx.fillRect(2 + legOffset, 6, 6, 16);

    ctx.fillStyle = '#0c4a6e';
    ctx.fillRect(-10, -14, 20, 20);

    // Ghost Skull Visage & Cyan Eye Sockets
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(-6, -26, 12, 10);
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(-4, -23, 3, 3);
    ctx.fillRect(1, -23, 3, 3);

    // Tattered Pirate Tricorn Hat
    ctx.fillStyle = '#082f49';
    ctx.fillRect(-12, -32, 24, 6);
    ctx.fillRect(-8, -36, 16, 6);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-2, -32, 4, 2);

    // Spectral Cyan Cutlass
    const swing = this.state === 'attack' ? Math.sin(this.animTimer * 10) * 0.8 : -0.3;
    ctx.save();
    ctx.translate(8, -4);
    ctx.rotate(swing);
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(0, -3, 20, 3);
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(0, -1, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 5. Draw Nordic Stone Troll
  drawTroll(ctx, legOffset) {
    // Hulking Granite Legs
    ctx.fillStyle = '#475569';
    ctx.fillRect(-14 - legOffset, 12, 12, 18);
    ctx.fillRect(2 + legOffset, 12, 12, 18);

    // Moss-covered Granite Torso
    ctx.fillStyle = '#334155';
    ctx.fillRect(-18, -18, 36, 30);
    ctx.fillStyle = '#166534'; // Runic Moss
    ctx.fillRect(-14, -14, 10, 12);
    ctx.fillRect(4, -8, 12, 10);

    // Hunchbacked Head & Protruding Fangs
    ctx.fillStyle = '#475569';
    ctx.fillRect(-10, -32, 20, 14);
    ctx.fillStyle = '#facc15'; // Glowing Amber Eyes
    ctx.fillRect(-6, -26, 4, 3);
    ctx.fillRect(2, -26, 4, 3);
    ctx.fillStyle = '#ffffff'; // Fangs
    ctx.fillRect(-5, -20, 2, 4);
    ctx.fillRect(3, -20, 2, 4);

    // Spiked Tree Trunk Club
    const clubAngle = this.state === 'windup' ? -1.8 : (this.state === 'attack' ? 0.6 : -0.4);
    ctx.save();
    ctx.translate(12, -6);
    ctx.rotate(clubAngle);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-2, -26, 8, 36); // Trunk
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(6, -22, 4, 4); // Iron Spikes
    ctx.fillRect(6, -12, 4, 4);
    ctx.fillRect(-6, -18, 4, 4);
    ctx.restore();
  }

  // 6. Draw Skogsrå Enchantress
  drawSkogsra(ctx, legOffset) {
    // Flowing Autumn Leaves Robe
    ctx.fillStyle = '#14532d';
    ctx.fillRect(-8 - legOffset, 8, 6, 16);
    ctx.fillRect(2 + legOffset, 8, 6, 16);
    ctx.fillStyle = '#15803d';
    ctx.fillRect(-9, -14, 18, 22);

    // Head, Pale Visage & Antler Crown
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-5, -24, 10, 10);
    ctx.fillStyle = '#86efac';
    ctx.fillRect(-3, -21, 2, 2);
    ctx.fillRect(1, -21, 2, 2);

    // Birch Antler Branches
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-4, -24);
    ctx.lineTo(-10, -34);
    ctx.lineTo(-6, -38);
    ctx.moveTo(4, -24);
    ctx.lineTo(10, -34);
    ctx.lineTo(6, -38);
    ctx.stroke();

    // Wooden Staff with Amber Gem
    ctx.fillStyle = '#78350f';
    ctx.fillRect(8, -26, 3, 34);
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(9.5, -28, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}
