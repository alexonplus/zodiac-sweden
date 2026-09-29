import { checkRectCollision } from '../engine/Physics.js';
import { sound } from '../engine/Audio.js';
import { particles } from '../engine/Particles.js';

/**
 * EnemyMob represents fully animated ground-walking enemies
 * with deep pixel-art detailing, custom accessories, and specialized AI.
 * Types:
 * - viking: Nordic Berserker Raider with horned helm & heavy shield
 * - golem: LKAB Heavy Iron Ore Automaton with spinning coring drill & steam vents
 * - karolin: Royal Swedish Musketeer with bayoneted flintlock & laser aim
 * - corsair: Visby Ghost Pirate with translucent coat & glowing ethereal cutlass
 * - troll: Moss-Covered Mountain Forest Troll with boulder fists & birch club
 * - skogsra: Enchanted Forest Mystic with antler crown & nature storm aura
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

    // Elemental Status Effects & Physics
    this.frozenTimer = 0;
    this.petrifiedTimer = 0;
    this.burnTimer = 0;
    this.rootedTimer = 0;
    this.bubbleTimer = 0;
    this.windBlowTimer = 0;
    this.windBlowVx = 0;
    this.quicksandTimer = 0;
    this.sinkDepth = 0;

    this.initTypeAttributes(type);
  }

  applyHit(damage, element = null, ownerIndex = 1, isMelee = false, isHeavyEarth = false) {
    let finalDamage = damage;
    let didShatter = false;

    // 1. ICE SHATTER MECHANIC:
    // If enemy is frozen in an ice block and struck by melee, earth, or fire:
    if (this.frozenTimer > 0 && (isMelee || isHeavyEarth || element === 'earth' || element === 'fire')) {
      finalDamage = Math.floor(damage * 2.5);
      this.frozenTimer = 0;
      this.stunTimer = 25;
      didShatter = true;
      sound.playIceShatter();
      particles.createIceShards(this.x + this.w / 2, this.y + this.h / 2, 26);
      particles.createDamageNumber(this.x + this.w / 2, this.y - 24, `💥 ICE SHATTER! -${finalDamage} ❄️`, '#00f0ff');
    }

    // 2. EARTH CRUSH MECHANIC:
    // If enemy is petrified and struck by earth or heavy weapon:
    if (this.petrifiedTimer > 0 && (isHeavyEarth || element === 'earth' || isMelee)) {
      finalDamage = Math.floor(damage * 2.0);
      sound.playEarthQuake();
      particles.createEarthDebris(this.x + this.w / 2, this.y + this.h / 2, 18);
      particles.createDamageNumber(this.x + this.w / 2, this.y - 20, `🪨 CRUSH! -${finalDamage}`, '#d97706');
    }

    this.hp -= finalDamage;
    return { finalDamage, didShatter };
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

  update(p1, p2, isCoopMode, enemyProjectiles, platforms = [], onShake, movingPlatforms = []) {
    this.animTimer += 0.08;
    if (this.elementTimer > 0) this.elementTimer--;
    if (this.cooldown > 0) this.cooldown--;
    if (this.actionTimer > 0) this.actionTimer--;

    // 1. BURNING STATUS (Fire / Magma / Solar)
    if (this.burnTimer > 0) {
      this.burnTimer--;
      if (this.burnTimer % 20 === 0) {
        const bDmg = 7;
        this.hp -= bDmg;
        particles.createFlame(this.x + this.w / 2, this.y + this.h / 2, 4);
        particles.createDamageNumber(this.x + this.w / 2, this.y - 12, `🔥 -${bDmg}`, '#f97316');
      }
    }

    // 2. FROZEN STATUS (Water / Frost / Ice)
    // Completely immobilized in solid crystalline ice block
    if (this.frozenTimer > 0) {
      this.frozenTimer--;
      this.vx = 0;
      if (Math.random() < 0.25) {
        particles.createSparks(this.x + Math.random() * this.w, this.y + Math.random() * this.h, '#cffafe', 1);
      }
      this.applyPhysics(platforms, movingPlatforms, onShake);
      return;
    }

    // 3. PETRIFIED STATUS (Earth / Stone / Granite)
    // Turned into solid stone; immune to displacement but vulnerable to crush
    if (this.petrifiedTimer > 0) {
      this.petrifiedTimer--;
      this.vx = 0;
      if (Math.random() < 0.2) {
        particles.createEarthDebris(this.x + Math.random() * this.w, this.y + this.h, 1);
      }
      this.applyPhysics(platforms, movingPlatforms, onShake);
      return;
    }

    // 4. ROOTED STATUS (Nature / Yggdrasil Briars)
    // Entangled by creeping thorny roots to the ground
    if (this.rootedTimer > 0) {
      this.rootedTimer--;
      this.vx = 0;
      if (this.rootedTimer % 30 === 0) {
        this.hp -= 5;
        particles.createLeaves(this.x + this.w / 2, this.y + this.h - 10, 2);
        particles.createDamageNumber(this.x + this.w / 2, this.y - 10, '🌿 -5', '#4ade80');
      }
      this.applyPhysics(platforms, movingPlatforms, onShake);
      return;
    }

    // 5. BUBBLE TRAP STATUS (Pisces Dream Bubble)
    // Drifts helplessly upwards into the air
    if (this.bubbleTimer > 0) {
      this.bubbleTimer--;
      this.vx *= 0.85;
      this.vy = -1.5;
      this.x += this.vx;
      this.y += this.vy;
      if (this.bubbleTimer <= 0) {
        sound.playWave();
        particles.createSparks(this.x + this.w / 2, this.y + this.h / 2, '#2dd4bf', 15);
      }
      return;
    }

    // 6. WIND BLOW STATUS (Wind / Tornado / Gale Blast)
    // Blown away across the battlefield!
    if (this.windBlowTimer > 0) {
      this.windBlowTimer--;
      this.vx = this.windBlowVx;
      this.windBlowVx *= 0.93;
      if (Math.random() < 0.4) {
        particles.createWindGale(this.x + this.w / 2, this.y + this.h / 2, Math.sign(this.vx), 1);
      }
      this.applyPhysics(platforms, movingPlatforms, onShake);
      return;
    }

    // 7. QUICKSAND SUBMERSION (Aquarius Superpower)
    if (this.quicksandTimer > 0) {
      this.quicksandTimer--;
      if (Math.random() < 0.35) {
        particles.createSand(this.x + Math.random() * this.w, this.y + this.h, 2);
      }
    } else if (this.sinkDepth > 0) {
      this.sinkDepth = Math.max(0, this.sinkDepth - 1.2);
    }

    if (this.stunTimer > 0) {
      this.stunTimer--;
      this.vx = 0;
      this.applyPhysics(platforms, movingPlatforms, onShake);
      return;
    }

    const target = this.getNearestPlayer(p1, p2, isCoopMode);
    if (!target || target.hp <= 0) {
      this.vx = 0;
      this.applyPhysics(platforms, movingPlatforms, onShake);
      return;
    }

    const dist = Math.abs(target.x - this.x);
    const dir = target.x > this.x ? 1 : -1;

    // AI branch by type
    if (this.type === 'viking') {
      this.updateVikingAI(target, dist, dir, onShake);
    } else if (this.type === 'golem') {
      this.updateGolemAI(target, dist, dir, onShake);
    } else if (this.type === 'karolin') {
      this.updateKarolinAI(target, dist, dir, enemyProjectiles);
    } else if (this.type === 'corsair') {
      this.updateCorsairAI(target, dist, dir, onShake);
    } else if (this.type === 'troll') {
      this.updateTrollAI(target, dist, dir, onShake);
    } else if (this.type === 'skogsra') {
      this.updateSkogsraAI(target, dist, dir, enemyProjectiles);
    }

    this.applyPhysics(platforms, movingPlatforms, onShake);

    // Contact damage during melee attack states
    if (this.state === 'attack' || this.state === 'dash') {
      const pDist = Math.hypot((target.x + target.w/2) - (this.x + this.w/2), (target.y + target.h/2) - (this.y + this.h/2));
      if (pDist < 45 && target.invulnTime === 0) {
        target.takeDamage(this.dmg, null, onShake);
      }
    }
  }

  applyPhysics(platforms, movingPlatforms = [], onShake) {
    this.vy += 0.55;
    if (this.vy > 14) this.vy = 14;

    this.x += this.vx;
    this.y += this.vy;

    let onPlatform = false;

    // Check Solid Level Platforms
    for (const p of platforms) {
      if (this.x + this.w > p.x && this.x < p.x + p.w) {
        if (this.y + this.h >= p.y && this.y + this.h <= p.y + 18 && this.vy >= 0) {
          this.y = p.y - this.h;
          this.vy = 0;
          this.isGrounded = true;
          onPlatform = true;
          break;
        }
      }
    }

    // Check Moving Platforms
    if (!onPlatform && movingPlatforms && movingPlatforms.length > 0) {
      for (const mp of movingPlatforms) {
        if (this.x + this.w > mp.x && this.x < mp.x + mp.w) {
          if (this.y + this.h >= mp.y && this.y + this.h <= mp.y + 20 && this.vy >= 0) {
            this.y = mp.y - this.h;
            this.vy = 0;
            this.x += mp.vx;
            this.isGrounded = true;
            onPlatform = true;
            break;
          }
        }
      }
    }

    if (!onPlatform) {
      this.isGrounded = false;
    }

    // Pit Hazard / Fall Instant Elimination
    if (this.y > 580 && this.hp > 0) {
      this.hp = 0;
      sound.playHammer();
      if (onShake) onShake(12);
      particles.createDamageNumber(this.x + this.w / 2, 530, '💀 PIT KNOCKOUT! +300 ⭐', '#facc15');
      particles.createSparks(this.x + this.w / 2, 540, '#00f0ff', 30);
    }
  }

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
        this.vy = -7.5;
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

  updateGolemAI(target, dist, dir, onShake) {
    this.drillSpin += 0.35;
    if (this.state === 'walk') {
      this.facing = dir || -1;
      this.vx = this.facing * this.speed;
      this.walkCycle += 0.16;

      if (dist < 220 && this.cooldown <= 0) {
        this.state = 'windup';
        this.actionTimer = 30;
        this.vx = 0;
      }
    } else if (this.state === 'windup') {
      this.vx = 0;
      this.drillSpin += 0.7;
      if (this.actionTimer <= 0) {
        this.state = 'dash';
        this.actionTimer = 35;
        this.vx = this.facing * 6.5;
        sound.playLaser();
        if (onShake) onShake(6);
      }
    } else if (this.state === 'dash') {
      this.drillSpin += 0.9;
      particles.createTrail(this.x, this.y, this.w, this.h, '#f59e0b');
      if (this.actionTimer <= 0) {
        this.state = 'walk';
        this.cooldown = 120;
        this.vx = 0;
        particles.createSparks(this.x + this.w/2, this.y + this.h/2, '#e2e8f0', 25);
        sound.playWave();
      }
    }
  }

  updateKarolinAI(target, dist, dir, enemyProjectiles) {
    if (this.state === 'walk') {
      this.facing = dir || -1;
      if (dist < 100) {
        this.state = 'backstep';
        this.actionTimer = 16;
        this.vx = -this.facing * 5.0;
        this.vy = -4.0;
      } else if (dist > 280) {
        this.vx = this.facing * this.speed;
        this.walkCycle += 0.2;
      } else {
        this.vx = 0;
        if (this.cooldown <= 0) {
          this.state = 'aim';
          this.actionTimer = 45;
          this.laserAim = true;
        }
      }
    } else if (this.state === 'backstep') {
      if (this.actionTimer <= 0) this.state = 'walk';
    } else if (this.state === 'aim') {
      this.vx = 0;
      this.facing = dir;
      if (this.actionTimer <= 0) {
        this.laserAim = false;
        sound.playLaser();
        enemyProjectiles.push({
          x: this.x + (this.facing > 0 ? this.w + 10 : -10),
          y: this.y + 20,
          vx: this.facing * 12,
          vy: 0,
          color: '#38bdf8',
          damage: this.dmg,
          life: 70
        });
        particles.createSparks(this.x + (this.facing > 0 ? this.w + 12 : -12), this.y + 20, '#facc15', 10);
        this.state = 'walk';
        this.cooldown = 110;
      }
    }
  }

  updateCorsairAI(target, dist, dir, onShake) {
    if (this.state === 'walk') {
      this.facing = dir || -1;
      this.vx = this.facing * this.speed;
      this.walkCycle += 0.25;

      if (dist < 160 && this.cooldown <= 0) {
        this.state = 'dash';
        this.actionTimer = 18;
        this.vx = this.facing * 8.5;
        this.isPhased = true;
        sound.playSword();
      }
    } else if (this.state === 'dash') {
      particles.createTrail(this.x, this.y, this.w, this.h, '#c084fc');
      if (this.actionTimer <= 0) {
        this.state = 'attack';
        this.actionTimer = 20;
        this.vx = 0;
        this.isPhased = false;
        sound.playPoison();
      }
    } else if (this.state === 'attack') {
      if (this.actionTimer <= 0) {
        this.state = 'walk';
        this.cooldown = 80;
      }
    }
  }

  updateTrollAI(target, dist, dir, onShake) {
    if (this.state === 'walk') {
      this.facing = dir || -1;
      this.vx = this.facing * this.speed;
      this.walkCycle += 0.14;

      if (dist < 80 && this.cooldown <= 0) {
        this.state = 'windup';
        this.actionTimer = 28;
        this.vx = 0;
      }
    } else if (this.state === 'windup') {
      this.vx = 0;
      if (this.actionTimer <= 0) {
        this.state = 'attack';
        this.actionTimer = 20;
        this.vx = 0;
        sound.playHammer();
        if (onShake) onShake(14);
        particles.createSparks(this.x + (this.facing > 0 ? this.w + 10 : -10), this.y + this.h, '#ca8a04', 30);
      }
    } else if (this.state === 'attack') {
      if (this.actionTimer <= 0) {
        this.state = 'walk';
        this.cooldown = 90;
      }
    }
  }

  updateSkogsraAI(target, dist, dir, enemyProjectiles) {
    if (this.state === 'walk') {
      this.facing = dir || -1;
      if (dist < 140) {
        this.vx = -this.facing * (this.speed * 1.2);
      } else if (dist > 300) {
        this.vx = this.facing * this.speed;
      } else {
        this.vx = 0;
        if (this.cooldown <= 0) {
          this.state = 'cast';
          this.actionTimer = 35;
          sound.playWave();
        }
      }
      this.walkCycle += 0.2;
    } else if (this.state === 'cast') {
      this.vx = 0;
      particles.createSparks(this.x + this.w/2, this.y + 10, '#4ade80', 2);
      if (this.actionTimer <= 0) {
        sound.playPoison();
        for (let i = -1; i <= 1; i++) {
          enemyProjectiles.push({
            x: this.x + this.w/2,
            y: this.y + 15,
            vx: this.facing * 7.5,
            vy: i * 2.2,
            color: '#4ade80',
            damage: 16,
            life: 80
          });
        }
        this.state = 'walk';
        this.cooldown = 110;
      }
    }
  }

  /* ================= DETAILED PIXEL-ART DRAWING ================= */

  draw(ctx) {
    ctx.save();
    const sinkY = this.sinkDepth || 0;
    // Submerge downward into the quicksand
    ctx.translate(this.x + this.w/2, this.y + this.h/2 + sinkY);
    if (this.facing < 0) ctx.scale(-1, 1);

    if (this.stunTimer > 0 && Math.floor(this.stunTimer / 4) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    if (sinkY > 3) {
      // Physically clip away the lower body submerged into the sand!
      ctx.beginPath();
      const cutoffY = (this.h / 2) - sinkY;
      ctx.rect(-this.w * 2, -this.h * 2, this.w * 4, cutoffY + this.h * 2 + 1);
      ctx.clip();
    }

    const isMoving = Math.abs(this.vx) > 0.2;
    const legOffset = isMoving ? Math.sin(this.walkCycle) * 8 : 0;

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

    ctx.restore();

    // Health Bar (sinks downward with the enemy into the earth)
    if (sinkY < this.h * 0.95) {
      const barY = this.y + sinkY;
      if (this.isMiniBoss) {
        const hpPct = Math.max(0, this.hp / this.maxHp);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(this.x - 12, barY - 24, this.w + 24, 18);
        ctx.fillStyle = '#facc15';
        ctx.font = '900 8px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(this.name || 'MINI-BOSS', this.x + this.w/2, barY - 13);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(this.x - 10, barY - 11, this.w + 20, 5);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(this.x - 10, barY - 11, (this.w + 20) * hpPct, 5);
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x - 10, barY - 11, this.w + 20, 5);
      } else if (this.hp < this.maxHp) {
        const hpPct = Math.max(0, this.hp / this.maxHp);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(this.x, barY - 12, this.w, 4);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(this.x, barY - 12, this.w * hpPct, 4);
      }
    }

    // Elemental Status Visual Overlays in World Space
    if (this.frozenTimer > 0) {
      this.drawIceBlock(ctx);
    } else if (this.petrifiedTimer > 0) {
      this.drawPetrifiedStone(ctx);
    }

    if (this.burnTimer > 0) {
      this.drawFlames(ctx);
    }
    if (this.rootedTimer > 0) {
      this.drawRootedVines(ctx);
    }
    if (this.windBlowTimer > 0) {
      this.drawWindSwirls(ctx);
    }
    if (this.bubbleTimer > 0) {
      this.drawBubble(ctx);
    }
    if (this.quicksandTimer > 0) {
      this.drawQuicksandSink(ctx);
    }
  }

  /* --- Elemental Visual Overlays --- */

  drawQuicksandSink(ctx) {
    ctx.save();
    const cx = this.x + this.w / 2;
    const sinkY = this.sinkDepth || 0;
    const groundY = this.y + this.h;
    const t = performance.now() * 0.005;

    // Soft translucent earth depression ring (no opaque black blotch!)
    const sandGrad = ctx.createRadialGradient(cx, groundY, 2, cx, groundY, this.w + 14);
    sandGrad.addColorStop(0, 'rgba(120, 53, 15, 0.32)');
    sandGrad.addColorStop(0.5, 'rgba(180, 83, 9, 0.2)');
    sandGrad.addColorStop(1, 'rgba(217, 119, 6, 0)');

    ctx.fillStyle = sandGrad;
    ctx.beginPath();
    ctx.ellipse(cx, groundY, this.w * 0.85 + 8, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sinking earth/sand swirl ripples around submerged body
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      const a = t * 4 + i * (Math.PI / 1.5);
      const rx = (this.w * 0.75) * (1 - i * 0.2);
      const ry = 6 * (1 - i * 0.2);
      ctx.ellipse(cx, groundY - i * 2, rx, ry, a * 0.15, 0, Math.PI * 2);
    }
    ctx.stroke();

    // Earth debris clods and dust pebbles
    if (sinkY > this.h * 0.25) {
      ctx.fillStyle = 'rgba(217, 119, 6, 0.6)';
      for (let b = 0; b < 3; b++) {
        const bx = cx + Math.sin(t * 3 + b * 2) * (this.w * 0.4);
        const by = groundY - 4 - ((t * 12 + b * 8) % 12);
        ctx.beginPath();
        ctx.arc(bx, by, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 4;
      if (sinkY >= this.h * 0.9) {
        ctx.fillText('🪨 SWALLOWED UNDERGROUND...', cx, groundY - 14);
      } else {
        ctx.fillText('🪨 SINKING IN EARTH...', cx, this.y + sinkY - 14);
      }
    }

    ctx.restore();
  }

  drawIceBlock(ctx) {
    ctx.save();
    const bx = this.x - 7;
    const by = this.y - 10;
    const bw = this.w + 14;
    const bh = this.h + 14;

    // Translucent Glacier Gradient
    const iceGrad = ctx.createLinearGradient(bx, by, bx + bw, by + bh);
    iceGrad.addColorStop(0, 'rgba(224, 242, 254, 0.55)');
    iceGrad.addColorStop(0.4, 'rgba(56, 189, 248, 0.45)');
    iceGrad.addColorStop(1, 'rgba(2, 132, 199, 0.7)');

    ctx.fillStyle = iceGrad;
    ctx.strokeStyle = '#cffafe';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 12;

    // Crystalline faceted block
    ctx.beginPath();
    ctx.moveTo(bx + 4, by);
    ctx.lineTo(bx + bw / 2, by - 6); // Sharp ice spike peak
    ctx.lineTo(bx + bw - 4, by);
    ctx.lineTo(bx + bw, by + 8);
    ctx.lineTo(bx + bw, by + bh);
    ctx.lineTo(bx, by + bh);
    ctx.lineTo(bx, by + 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Internal crystalline fracture cracks
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(bx + 8, by + 12);
    ctx.lineTo(bx + bw * 0.45, by + bh * 0.4);
    ctx.lineTo(bx + bw * 0.35, by + bh * 0.75);
    ctx.moveTo(bx + bw * 0.45, by + bh * 0.4);
    ctx.lineTo(bx + bw * 0.8, by + bh * 0.35);
    ctx.stroke();

    // Frost Glint
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(bx + 8, by + 6, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Status Tag
    ctx.fillStyle = '#cffafe';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('❄️ FROZEN', this.x + this.w / 2, by - 12);

    ctx.restore();
  }

  drawPetrifiedStone(ctx) {
    ctx.save();
    const bx = this.x - 4;
    const by = this.y - 4;
    const bw = this.w + 8;
    const bh = this.h + 8;

    // Granite Stone Overlay
    ctx.fillStyle = 'rgba(120, 113, 108, 0.75)';
    ctx.strokeStyle = '#44403c';
    ctx.lineWidth = 2;
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeRect(bx, by, bw, bh);

    // Stone Fissures
    ctx.strokeStyle = '#292524';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(bx + 6, by + 8);
    ctx.lineTo(bx + bw * 0.6, by + bh * 0.5);
    ctx.lineTo(bx + bw * 0.4, by + bh * 0.85);
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🪨 STONE', this.x + this.w / 2, by - 8);

    ctx.restore();
  }

  drawFlames(ctx) {
    ctx.save();
    const t = performance.now() * 0.015;
    const count = 5;
    for (let i = 0; i < count; i++) {
      const fx = this.x + (i / (count - 1)) * this.w;
      const wave = Math.sin(t + i * 1.5) * 4;
      const fHeight = 16 + Math.cos(t * 1.2 + i) * 6;

      ctx.fillStyle = i % 2 === 0 ? '#ea580c' : '#facc15';
      ctx.beginPath();
      ctx.moveTo(fx - 4, this.y + this.h);
      ctx.quadraticCurveTo(fx + wave, this.y + this.h - fHeight, fx, this.y + this.h - fHeight - 6);
      ctx.quadraticCurveTo(fx - wave, this.y + this.h - fHeight * 0.5, fx + 4, this.y + this.h);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  drawRootedVines(ctx) {
    ctx.save();
    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(this.x - 4, this.y + this.h);
    ctx.quadraticCurveTo(this.x + this.w * 0.5, this.y + this.h - 14, this.x + this.w + 4, this.y + this.h);
    ctx.moveTo(this.x - 2, this.y + this.h - 6);
    ctx.quadraticCurveTo(this.x + this.w * 0.3, this.y + this.h - 22, this.x + this.w * 0.8, this.y + this.h - 10);
    ctx.stroke();

    ctx.fillStyle = '#86efac';
    ctx.beginPath();
    ctx.arc(this.x + 4, this.y + this.h - 10, 2.5, 0, Math.PI * 2);
    ctx.arc(this.x + this.w - 6, this.y + this.h - 8, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawWindSwirls(ctx) {
    ctx.save();
    const t = performance.now() * 0.02;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      const angle = t + (i * Math.PI * 2) / 3;
      const rx = this.x + this.w / 2 + Math.cos(angle) * (this.w * 0.7);
      const ry = this.y + this.h / 2 + Math.sin(angle) * (this.h * 0.4);
      ctx.beginPath();
      ctx.arc(rx, ry, 6, 0, Math.PI * 1.5);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawBubble(ctx) {
    ctx.save();
    const cx = this.x + this.w / 2;
    const cy = this.y + this.h / 2;
    const radius = Math.max(this.w, this.h) * 0.68;

    const bubGrad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, 4, cx, cy, radius);
    bubGrad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
    bubGrad.addColorStop(0.6, 'rgba(45, 212, 191, 0.35)');
    bubGrad.addColorStop(1, 'rgba(2, 132, 199, 0.55)');

    ctx.fillStyle = bubGrad;
    ctx.strokeStyle = '#2dd4bf';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Highlight sheen
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx - radius * 0.4, cy - radius * 0.4, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 1. Viking Berserker Raider
  drawViking(ctx, legOffset) {
    const t = this.animTimer || 0;
    const isBlink = Math.floor(t * 1.5) % 18 === 0;
    const hairSway = Math.sin(t * 3.5) * 2;
    const beardSway = Math.sin(t * 3) * 1.5;

    // Cape & Fur Pelt with animated fur tufts
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-15, -14, 9, 28);
    // Fur Shoulder Mantle - Organic curved mantle
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.ellipse(0, -15, 11, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#d97706'; // Fur edge
    ctx.beginPath();
    ctx.ellipse(0, -13, 12, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs & Armored Cross-Gartered Boots - Organic curves
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(-9 - legOffset, 7);
    ctx.quadraticCurveTo(-11 - legOffset, 14, -8 - legOffset, 22);
    ctx.lineTo(-2 - legOffset, 22);
    ctx.quadraticCurveTo(-3 - legOffset, 14, -3 - legOffset, 7);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(1 + legOffset, 7);
    ctx.quadraticCurveTo(0 + legOffset, 14, 2 + legOffset, 22);
    ctx.lineTo(8 + legOffset, 22);
    ctx.quadraticCurveTo(9 + legOffset, 14, 7 + legOffset, 7);
    ctx.closePath();
    ctx.fill();

    // Heavy Boots - Curved sabaton
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.arc(-5 - legOffset, 24, 4, 0, Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(5 + legOffset, 24, 4, 0, Math.PI);
    ctx.fill();

    // Torso Chainmail & Tunic - Natural athletic silhouette
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(-11, -14);
    ctx.quadraticCurveTo(-12, -5, -8, 4);
    ctx.lineTo(8, 4);
    ctx.quadraticCurveTo(12, -5, 11, -14);
    ctx.quadraticCurveTo(0, -12, -11, -14);
    ctx.closePath();
    ctx.fill();

    // Heavy Leather War Belt with Bronze Buckle - Curved
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.moveTo(-9, 3);
    ctx.quadraticCurveTo(0, 5, 9, 3);
    ctx.lineTo(9, 7);
    ctx.quadraticCurveTo(0, 9, -9, 7);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.ellipse(0, 5, 4, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Flowing Blonde Warrior Hair in Back
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.moveTo(-7, -24);
    ctx.quadraticCurveTo(-14 + hairSway, -18, -16 + hairSway, -6);
    ctx.lineTo(-11 + hairSway, -5);
    ctx.quadraticCurveTo(-9 + hairSway, -14, -4, -18);
    ctx.closePath();
    ctx.fill();

    // Head & Weathered Nordic Face - Contoured human head silhouette
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.moveTo(-6, -28);
    ctx.quadraticCurveTo(0, -32, 6, -28);
    ctx.quadraticCurveTo(6.5, -23, 4.5, -18.5);
    ctx.quadraticCurveTo(0, -17, -4.5, -18.5);
    ctx.quadraticCurveTo(-6.5, -23, -6, -28);
    ctx.closePath();
    ctx.fill();

    // Fierce Blue Eyes & Furrowed Brow
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-5, -25.5);
    ctx.lineTo(-1, -26.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(5, -25.5);
    ctx.lineTo(1, -26.5);
    ctx.stroke();

    if (isBlink) {
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(-2.5, -24, 2, 0.2, Math.PI - 0.2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(2.5, -24, 2, 0.2, Math.PI - 0.2);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(-2.5, -24, 2.4, 1.7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(2.5, -24, 2.4, 1.7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Steel Blue Eyes
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(-2.5, -24, 1.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(2.5, -24, 1.3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Norse Nose Bridge
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.ellipse(0, -22, 1.5, 1, 0, 0, Math.PI * 2);
    ctx.fill();

    // Open Battle Roar / Mouth
    ctx.fillStyle = '#450a0a';
    ctx.beginPath();
    ctx.ellipse(0, -19.5, 2, 1.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Thick Golden Braided Beard with Iron Ring - Curved braid
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.moveTo(-5, -19);
    ctx.lineTo(5, -19);
    ctx.lineTo(3 + beardSway, -9);
    ctx.lineTo(0 + beardSway, -5);
    ctx.lineTo(-3 + beardSway, -9);
    ctx.closePath();
    ctx.fill();

    // Iron Ring on Beard
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(0 + beardSway, -7, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Authentic Spectacle Viking Helmet with Nasal Guard - Curved iron dome
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(0, -28, 7, Math.PI, 0);
    ctx.fill();

    // Eyebrow Spectacle Guard - Curved
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(-3, -27, 3, 0, Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(3, -27, 3, 0, Math.PI);
    ctx.fill();

    // Swept Horns - Curved
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(-6, -29);
    ctx.quadraticCurveTo(-14, -32, -16, -38);
    ctx.quadraticCurveTo(-13, -40, -10, -34);
    ctx.quadraticCurveTo(-8, -31, -5, -29);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(6, -29);
    ctx.quadraticCurveTo(14, -32, 16, -38);
    ctx.quadraticCurveTo(13, -40, 10, -34);
    ctx.quadraticCurveTo(8, -31, 5, -29);
    ctx.closePath();
    ctx.fill();

    // Round Wood Plank Shield
    if (this.isShielding) {
      ctx.save();
      ctx.translate(11, 0);
      // Outer Rim
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      ctx.fill();
      // Blue Wood Planks
      ctx.fillStyle = '#1e3a8a';
      ctx.beginPath();
      ctx.arc(0, 0, 13, 0, Math.PI * 2);
      ctx.fill();
      // Plank Separators
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-12, -5, 24, 1);
      ctx.fillRect(-12, 5, 24, 1);
      // Steel Center Boss
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-1, -1, 2, 2);
      ctx.restore();
    }

    // Heavy Bearded War Axe with Runic Engravings
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-17, -12, 4, 26);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-24, -18, 14, 12);
    ctx.fillStyle = '#cbd5e1'; // Axe edge
    ctx.fillRect(-25, -19, 3, 14);
    // Rune on Axe
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-21, -15, 2, 6);
  }

  // 2. LKAB Ore Mining Automaton Golem
  drawGolem(ctx, legOffset) {
    const t = this.animTimer || 0;

    // Heavy Hydraulic Steam Legs with Brass Pistons - Curved mechanical anatomy
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(-14 - legOffset, 10);
    ctx.quadraticCurveTo(-16 - legOffset, 18, -13 - legOffset, 24);
    ctx.lineTo(-3 - legOffset, 24);
    ctx.quadraticCurveTo(-2 - legOffset, 17, -3 - legOffset, 10);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(3 + legOffset, 10);
    ctx.quadraticCurveTo(2 + legOffset, 17, 3 + legOffset, 24);
    ctx.lineTo(13 + legOffset, 24);
    ctx.quadraticCurveTo(15 + legOffset, 17, 13 + legOffset, 10);
    ctx.closePath();
    ctx.fill();

    // Brass Piston Shaft - Rounded cylinders
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.ellipse(-8 - legOffset, 16, 2.5, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(8 + legOffset, 16, 2.5, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Curved Iron Tread Sabatons / Feet
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(-8 - legOffset, 25, 6, 0, Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(8 + legOffset, 25, 6, 0, Math.PI);
    ctx.fill();

    // Heavy Boiler Torso with Riveted Iron Plates - Curving cylindrical pressure hull
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(-16, -18);
    ctx.quadraticCurveTo(-18, -4, -14, 12);
    ctx.quadraticCurveTo(0, 15, 14, 12);
    ctx.quadraticCurveTo(18, -4, 16, -18);
    ctx.quadraticCurveTo(0, -21, -16, -18);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(-14, -16);
    ctx.quadraticCurveTo(-16, -4, -12, 10);
    ctx.quadraticCurveTo(0, 13, 12, 10);
    ctx.quadraticCurveTo(16, -4, 14, -16);
    ctx.quadraticCurveTo(0, -19, -14, -16);
    ctx.closePath();
    ctx.fill();

    // Brass Rivets on Curving Edges
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(-13, -14, 1.4, 0, Math.PI * 2);
    ctx.arc(13, -14, 1.4, 0, Math.PI * 2);
    ctx.arc(-11, 7, 1.4, 0, Math.PI * 2);
    ctx.arc(11, 7, 1.4, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Furnace Boiler Grate with Animated Embers - Oval porthole firebox
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.ellipse(0, -2, 9, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Fire glow
    ctx.fillStyle = '#ea580c';
    ctx.shadowColor = '#f97316';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.ellipse(0, -2, 7, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(Math.sin(t * 10) * 2, -2, 4, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Curving Iron Grate Bars
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-7, -4);
    ctx.lineTo(7, -4);
    ctx.moveTo(-8, -1);
    ctx.lineTo(8, -1);
    ctx.moveTo(-7, 2);
    ctx.lineTo(7, 2);
    ctx.stroke();

    // Pressure Gauge with Needle
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(9, -12, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#ef4444'; // Needle
    ctx.fillRect(8.5, -15, 1, 3.5);

    // Rotating Mechanical Eye Sensor / Optics - Spherical dome turret
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(0, -22, 8, Math.PI, 0);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(0, -22, 8, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Optical Target Lens
    const eyeScan = Math.sin(t * 3) * 2.5;
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(eyeScan, -23, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(eyeScan - 1, -24, 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Twin Exhaust Chimneys with Steam Puffs - Curved tapered stacks
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(-13, -24);
    ctx.lineTo(-12, -35);
    ctx.lineTo(-6, -35);
    ctx.lineTo(-7, -24);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(7, -24);
    ctx.lineTo(6, -35);
    ctx.lineTo(12, -35);
    ctx.lineTo(13, -24);
    ctx.closePath();
    ctx.fill();

    // Billowy Steam clouds
    const puffY = -38 - (t * 8 % 10);
    ctx.fillStyle = 'rgba(241, 245, 249, 0.45)';
    ctx.beginPath();
    ctx.arc(-9, puffY, 3.5, 0, Math.PI * 2);
    ctx.arc(-7, puffY - 3, 2.5, 0, Math.PI * 2);
    ctx.arc(9, puffY - 2, 3.5, 0, Math.PI * 2);
    ctx.arc(11, puffY - 5, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Heavy Diamond Coring Drill (Right Arm)
    ctx.save();
    ctx.translate(14, 4);
    ctx.rotate(this.drillSpin);
    // Industrial Gear Hub
    ctx.fillStyle = '#475569';
    ctx.fillRect(0, -7, 8, 14);
    // Cyan Diamond Drill Bit with Helical Flutes
    ctx.fillStyle = '#06b6d4';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(8, -9);
    ctx.lineTo(26, 0);
    ctx.lineTo(8, 9);
    ctx.closePath();
    ctx.fill();
    // Spiral Cutting Edge
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(10, -5);
    ctx.lineTo(18, 0);
    ctx.lineTo(10, 5);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  // 3. Royal Caroliner Musketeer
  drawKarolin(ctx, legOffset) {
    const t = this.animTimer || 0;
    const isBlink = Math.floor(t * 1.5) % 17 === 0;
    const ribbonSway = Math.sin(t * 4) * 2;

    // Legs with White Gaiters and Leather Shoes - Contoured muscular limbs
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(-8 - legOffset, 10);
    ctx.quadraticCurveTo(-10 - legOffset, 16, -8 - legOffset, 22);
    ctx.lineTo(-2 - legOffset, 22);
    ctx.quadraticCurveTo(-2 - legOffset, 16, -2 - legOffset, 10);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(2 + legOffset, 10);
    ctx.quadraticCurveTo(1 + legOffset, 16, 2 + legOffset, 22);
    ctx.lineTo(8 + legOffset, 22);
    ctx.quadraticCurveTo(9 + legOffset, 16, 8 + legOffset, 10);
    ctx.closePath();
    ctx.fill();

    // White Canvas Gaiters - Curved wraps
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(-9 - legOffset, 15);
    ctx.quadraticCurveTo(-10 - legOffset, 19, -8 - legOffset, 23);
    ctx.lineTo(-1 - legOffset, 23);
    ctx.quadraticCurveTo(-2 - legOffset, 19, -2 - legOffset, 15);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(1 + legOffset, 15);
    ctx.quadraticCurveTo(1 + legOffset, 19, 2 + legOffset, 23);
    ctx.lineTo(9 + legOffset, 23);
    ctx.quadraticCurveTo(9 + legOffset, 19, 8 + legOffset, 15);
    ctx.closePath();
    ctx.fill();

    // Curved Gaiter Buttons
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-2 - legOffset, 17, 0.9, 0, Math.PI * 2);
    ctx.arc(-2 - legOffset, 20, 0.9, 0, Math.PI * 2);
    ctx.arc(8 + legOffset, 17, 0.9, 0, Math.PI * 2);
    ctx.arc(8 + legOffset, 20, 0.9, 0, Math.PI * 2);
    ctx.fill();

    // Black Leather Shoes with Brass Buckles - Curved soles
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.ellipse(-5 - legOffset, 24, 4.5, 2.5, 0, 0, Math.PI * 2);
    ctx.ellipse(5 + legOffset, 24, 4.5, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.ellipse(-5 - legOffset, 23, 2, 1.2, 0, 0, Math.PI * 2);
    ctx.ellipse(5 + legOffset, 23, 2, 1.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Authentic Royal Blue Caroliner Uniform Coat - Natural athletic silhouette
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.moveTo(-11, -14);
    ctx.quadraticCurveTo(-12, -4, -8, 7);
    ctx.quadraticCurveTo(-9, 11, -8, 14);
    ctx.lineTo(8, 14);
    ctx.quadraticCurveTo(9, 11, 8, 7);
    ctx.quadraticCurveTo(12, -4, 11, -14);
    ctx.quadraticCurveTo(0, -12, -11, -14);
    ctx.closePath();
    ctx.fill();

    // Golden-Yellow Lapels & Epaulettes - Curved arches
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.ellipse(-11, -14, 4.5, 2.5, -0.3, 0, Math.PI * 2);
    ctx.ellipse(11, -14, 4.5, 2.5, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Yellow Waistcoat - Curved V-front
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.moveTo(-4, -10);
    ctx.lineTo(-4, 6);
    ctx.lineTo(0, 8);
    ctx.lineTo(4, 6);
    ctx.lineTo(4, -10);
    ctx.closePath();
    ctx.fill();

    // Rows of Brass Buttons down uniform
    ctx.fillStyle = '#fef08a';
    for (let b = -8; b <= 4; b += 3) {
      ctx.beginPath();
      ctx.arc(-2, b, 1, 0, Math.PI * 2);
      ctx.arc(2, b, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // White Buff Crossbelt (Cartridge Sash) - Graceful diagonal arc
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(-10, -13);
    ctx.quadraticCurveTo(0, -3, 9, 8);
    ctx.stroke();

    // Powdered White Peruke Wig Ponytail in Back with Black Ribbon
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(-6, -24);
    ctx.quadraticCurveTo(-14 + ribbonSway, -20, -16 + ribbonSway, -10);
    ctx.lineTo(-12 + ribbonSway, -9);
    ctx.quadraticCurveTo(-8 + ribbonSway, -16, -4, -18);
    ctx.closePath();
    ctx.fill();

    // Black Silk Bow Ribbon
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(-8, -21, 2.5, 1.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Detailed Face (Fair Scandinavian Complexion) - Contoured head & jawline
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.moveTo(-6, -28);
    ctx.quadraticCurveTo(0, -31, 6, -28);
    ctx.quadraticCurveTo(6.5, -23, 4.5, -18.5);
    ctx.quadraticCurveTo(0, -17, -4.5, -18.5);
    ctx.quadraticCurveTo(-6.5, -23, -6, -28);
    ctx.closePath();
    ctx.fill();

    // Rosy Cheeks
    ctx.fillStyle = 'rgba(244, 63, 94, 0.25)';
    ctx.beginPath();
    ctx.ellipse(-4, -22, 1.5, 1, 0, 0, Math.PI * 2);
    ctx.ellipse(4, -22, 1.5, 1, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes & Stern Caroliner Gaze
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(-5, -26);
    ctx.lineTo(-1.5, -25.5);
    ctx.moveTo(5, -26);
    ctx.lineTo(1.5, -25.5);
    ctx.stroke();

    if (isBlink) {
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(-3, -24, 1.8, 0.2, Math.PI - 0.2);
      ctx.arc(3, -24, 1.8, 0.2, Math.PI - 0.2);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(-3, -24, 2.2, 1.6, 0, 0, Math.PI * 2);
      ctx.ellipse(3, -24, 2.2, 1.6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Steel Blue Eyes with Pupil Spark
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(-3, -24, 1.2, 0, Math.PI * 2);
      ctx.arc(3, -24, 1.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-3.5, -24.4, 0.6, 0, Math.PI * 2);
      ctx.arc(2.5, -24.4, 0.6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Straight Scandinavian Nose
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.ellipse(0, -22, 1.2, 1.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Distinguished Upturned Caroliner Karp Mustache
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.moveTo(-4, -20);
    ctx.quadraticCurveTo(-2, -19, 0, -20);
    ctx.quadraticCurveTo(2, -19, 4, -20);
    ctx.lineTo(5, -21); // Upturned tip
    ctx.lineTo(3, -20);
    ctx.lineTo(0, -20.5);
    ctx.lineTo(-3, -20);
    ctx.lineTo(-5, -21);
    ctx.closePath();
    ctx.fill();

    // Authentic Tricorn Hat (Trekantig Hatt) with Swedish Cockade - Sweeping curves
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(-14, -29);
    ctx.quadraticCurveTo(0, -34, 14, -29);
    ctx.quadraticCurveTo(12, -38, 0, -40);
    ctx.quadraticCurveTo(-12, -38, -14, -29);
    ctx.closePath();
    ctx.fill();

    // Gold Wire Braid Edge - Curved trim
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(-14, -29);
    ctx.quadraticCurveTo(0, -34, 14, -29);
    ctx.stroke();

    // Swedish Royal Blue & Yellow Cockade on Side
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.arc(6, -33, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(6, -33, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Flintlock Musket with Razor Bayonet
    ctx.fillStyle = '#78350f';
    ctx.fillRect(4, -4, 28, 4); // Stock
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(26, -6, 8, 8); // Lock & Hammer
    ctx.fillStyle = '#475569';
    ctx.fillRect(32, -3, 6, 2); // Steel Barrel
    // Gleaming Bayonet
    ctx.fillStyle = '#e2e8f0';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 6;
    ctx.fillRect(36, -5, 14, 2);
    ctx.shadowBlur = 0;

    // Laser Sight when aiming
    if (this.laserAim) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(38, -4);
      ctx.lineTo(320, -4);
      ctx.stroke();
    }
  }

  // 4. Visby Ghost Corsair
  drawCorsair(ctx, legOffset) {
    const t = this.animTimer || 0;
    const floatBob = Math.sin(t * 3) * 3;
    const mistSway = Math.sin(t * 4) * 2;

    // Translucent Ethereal Ghost Coat - Flowing undulating spectral robes
    ctx.fillStyle = '#3b0764';
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.moveTo(-11, -14 + floatBob);
    ctx.quadraticCurveTo(-14 + mistSway, 0 + floatBob, -13 + mistSway * 1.5, 12 + floatBob);
    ctx.quadraticCurveTo(-6 + mistSway, 15 + floatBob, 0, 11 + floatBob);
    ctx.quadraticCurveTo(6 + mistSway, 15 + floatBob, 13 - mistSway * 1.5, 12 + floatBob);
    ctx.quadraticCurveTo(14 - mistSway, 0 + floatBob, 11, -14 + floatBob);
    ctx.closePath();
    ctx.fill();

    // Tattered Spectral Hem - Wisp filaments
    ctx.fillStyle = '#6b21a8';
    ctx.beginPath();
    ctx.moveTo(-13 + mistSway * 1.5, 12 + floatBob);
    ctx.quadraticCurveTo(-9, 18 + floatBob, -5, 12 + floatBob);
    ctx.quadraticCurveTo(0, 19 + floatBob, 5, 12 + floatBob);
    ctx.quadraticCurveTo(9, 18 + floatBob, 13 - mistSway * 1.5, 12 + floatBob);
    ctx.closePath();
    ctx.fill();

    // Ghost Skull Face - Contoured human skull anatomy
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(-6, -28 + floatBob);
    ctx.quadraticCurveTo(0, -32 + floatBob, 6, -28 + floatBob);
    ctx.quadraticCurveTo(6.5, -23 + floatBob, 4.5, -18.5 + floatBob);
    ctx.quadraticCurveTo(0, -17 + floatBob, -4.5, -18.5 + floatBob);
    ctx.quadraticCurveTo(-6.5, -23 + floatBob, -6, -28 + floatBob);
    ctx.closePath();
    ctx.fill();

    // Sunken Cheekbone Shadows & Jaw
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.ellipse(-4, -20 + floatBob, 1.8, 1.2, -0.2, 0, Math.PI * 2);
    ctx.ellipse(4, -20 + floatBob, 1.8, 1.2, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Teeth Row
    ctx.fillStyle = '#475569';
    for (let x = -3; x <= 3; x += 2) {
      ctx.fillRect(x - 0.5, -18 + floatBob, 1, 1.8);
    }

    // Buccaneer Eyepatch over Left Eye - Curved patch & strap
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(-3.5, -24 + floatBob, 2.5, 2.8, -0.15, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-6, -26 + floatBob);
    ctx.lineTo(5, -22 + floatBob);
    ctx.stroke();

    // Floating Spectral Cyan Eye Glow in Right Socket
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(3.5, -24 + floatBob, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(3.2, -24.4 + floatBob, 0.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Gold Buccaneer Earring
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(6, -21 + floatBob, 2.2, 0, Math.PI * 2);
    ctx.stroke();

    // Wispy Ghostly Hair / Dreadlocks swaying
    ctx.fillStyle = '#c084fc';
    ctx.beginPath();
    ctx.moveTo(-6, -24 + floatBob);
    ctx.quadraticCurveTo(-14 + mistSway, -18 + floatBob, -16 + mistSway, -6 + floatBob);
    ctx.lineTo(-12 + mistSway, -5 + floatBob);
    ctx.quadraticCurveTo(-8 + mistSway, -14 + floatBob, -4, -18 + floatBob);
    ctx.closePath();
    ctx.fill();

    // Pirate Captain Tricorn Hat with Frayed Ghost Feather - Curved bicorn/tricorn
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(-14, -29 + floatBob);
    ctx.quadraticCurveTo(0, -35 + floatBob, 14, -29 + floatBob);
    ctx.quadraticCurveTo(12, -39 + floatBob, 0, -41 + floatBob);
    ctx.quadraticCurveTo(-12, -39 + floatBob, -14, -29 + floatBob);
    ctx.closePath();
    ctx.fill();

    // Silver Skull Badge on Hat
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.arc(0, -34 + floatBob, 2, 0, Math.PI * 2);
    ctx.fill();

    // Ghostly Feather - Elegant curled quill
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.moveTo(3, -37 + floatBob);
    ctx.quadraticCurveTo(10 + mistSway, -46 + floatBob, 16 + mistSway, -42 + floatBob);
    ctx.quadraticCurveTo(10 + mistSway * 0.5, -39 + floatBob, 5, -36 + floatBob);
    ctx.closePath();
    ctx.fill();

    // Ethereal Ghost Cutlass with Radiating Purple/Cyan Flames
    ctx.fillStyle = '#a855f7';
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(8, -4 + floatBob);
    ctx.quadraticCurveTo(18, -6 + floatBob, 26, -12 + floatBob);
    ctx.quadraticCurveTo(20, -2 + floatBob, 8, -1 + floatBob);
    ctx.closePath();
    ctx.fill();

    // Cyan glowing saber edge
    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.moveTo(22, -9 + floatBob);
    ctx.quadraticCurveTo(26, -13 + floatBob, 28, -14 + floatBob);
    ctx.quadraticCurveTo(24, -6 + floatBob, 20, -5 + floatBob);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // 5. Mountain Forest Troll
  drawTroll(ctx, legOffset) {
    const t = this.animTimer || 0;
    const isBlink = Math.floor(t * 1.5) % 19 === 0;
    const mossSway = Math.sin(t * 2.5) * 1.5;

    // Heavy Curved Stone Legs
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(-15 - legOffset, 12);
    ctx.quadraticCurveTo(-18 - legOffset, 20, -14 - legOffset, 27);
    ctx.lineTo(-2 - legOffset, 27);
    ctx.quadraticCurveTo(-3 - legOffset, 19, -3 - legOffset, 12);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(3 + legOffset, 12);
    ctx.quadraticCurveTo(2 + legOffset, 19, 3 + legOffset, 27);
    ctx.lineTo(15 + legOffset, 27);
    ctx.quadraticCurveTo(18 + legOffset, 20, 14 + legOffset, 12);
    ctx.closePath();
    ctx.fill();

    // Big Knuckled Stone Toes - Curved
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(-8 - legOffset, 27, 6, 0, Math.PI);
    ctx.arc(8 + legOffset, 27, 6, 0, Math.PI);
    ctx.fill();

    // Hulking Mossy Stone Body - Organic hunchback boulder silhouette
    ctx.fillStyle = '#3f6212';
    ctx.beginPath();
    ctx.moveTo(-19, -15);
    ctx.quadraticCurveTo(-22, 0, -16, 15);
    ctx.quadraticCurveTo(0, 18, 16, 15);
    ctx.quadraticCurveTo(22, 0, 19, -15);
    ctx.quadraticCurveTo(0, -20, -19, -15);
    ctx.closePath();
    ctx.fill();

    // Craggy Stone Core
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wild Shaggy Moss Hair & Beard with Birch Twigs and Toadstools
    ctx.fillStyle = '#365314';
    ctx.beginPath();
    ctx.moveTo(-12, -26);
    ctx.quadraticCurveTo(-22 + mossSway, -16, -20 + mossSway, 0);
    ctx.lineTo(-14 + mossSway, 2);
    ctx.quadraticCurveTo(-12 + mossSway, -10, -8, -18);
    ctx.closePath();
    ctx.fill();

    // Red Forest Toadstool Mushroom in Troll's Hair!
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(-16 + mossSway, -18, 3.5, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(-15 + mossSway, -19, 0.8, 0, Math.PI * 2);
    ctx.fill();

    // Big Craggy Troll Head - Contoured organic monster silhouette
    ctx.fillStyle = '#4d7c0f';
    ctx.beginPath();
    ctx.moveTo(-11, -28);
    ctx.quadraticCurveTo(0, -32, 11, -28);
    ctx.quadraticCurveTo(13, -20, 9, -14);
    ctx.quadraticCurveTo(0, -12, -9, -14);
    ctx.quadraticCurveTo(-13, -20, -11, -28);
    ctx.closePath();
    ctx.fill();

    // Heavy Bushy Moss Eyebrows - Arched
    ctx.fillStyle = '#365314';
    ctx.beginPath();
    ctx.ellipse(-5, -25.5, 4, 1.8, -0.2, 0, Math.PI * 2);
    ctx.ellipse(5, -25.5, 4, 1.8, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Squinting Amber Eyes with Blinking
    if (isBlink) {
      ctx.strokeStyle = '#14532d';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(-6, -24);
      ctx.lineTo(-2, -24);
      ctx.moveTo(2, -24);
      ctx.lineTo(6, -24);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#facc15';
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.ellipse(-4, -24, 2.8, 1.8, 0, 0, Math.PI * 2);
      ctx.ellipse(4, -24, 2.8, 1.8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Slit pupils
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.ellipse(-4, -24, 1, 1.6, 0, 0, Math.PI * 2);
      ctx.ellipse(4, -24, 1, 1.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Huge Crooked Bulbous Troll Nose with Wart - Rounded pear shape
    ctx.fillStyle = '#65a30d';
    ctx.beginPath();
    ctx.ellipse(0, -19, 4.5, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#4d7c0f';
    ctx.beginPath();
    ctx.arc(-2, -17, 1.2, 0, Math.PI * 2);
    ctx.arc(2, -17, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Nose Wart
    ctx.fillStyle = '#365314';
    ctx.beginPath();
    ctx.arc(2.5, -20, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Big Floppy Troll Ear with Stone Ring - Contoured ear
    ctx.fillStyle = '#4d7c0f';
    ctx.beginPath();
    ctx.ellipse(-13, -22, 2.5, 4.5, -0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(-13, -19, 2.5, 0, Math.PI * 2);
    ctx.stroke();

    // Yellow Fangs / Tusks protruding from Lower Jaw - Curved
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(-5, -16);
    ctx.lineTo(-4, -20);
    ctx.lineTo(-2.5, -16);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(2.5, -16);
    ctx.lineTo(4, -20);
    ctx.lineTo(5, -16);
    ctx.closePath();
    ctx.fill();

    // Birch Trunk Club with Spikes & Wood Rings - Contoured log
    ctx.fillStyle = '#fef9c3'; // White Birch Bark
    ctx.beginPath();
    ctx.moveTo(13, 12);
    ctx.quadraticCurveTo(15, -6, 14, -24);
    ctx.quadraticCurveTo(19, -26, 24, -24);
    ctx.quadraticCurveTo(23, -6, 21, 12);
    ctx.closePath();
    ctx.fill();

    // Wrapped Leather Handle - Curved
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.ellipse(17, 18, 4, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Heavy Rusty Iron Spikes - Curved cone spikes
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.moveTo(23, -20); ctx.lineTo(28, -21); ctx.lineTo(23, -18); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(22, -8); ctx.lineTo(27, -9); ctx.lineTo(22, -6); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(21, 4); ctx.lineTo(26, 3); ctx.lineTo(21, 6); ctx.closePath(); ctx.fill();
  }

  // 6. Skogsrå Forest Mystic Dryad
  drawSkogsra(ctx, legOffset) {
    const t = this.animTimer || 0;
    const isBlink = Math.floor(t * 1.5) % 17 === 0;
    const hairWave = Math.sin(t * 3.5) * 3;
    const tailWave = Math.sin(t * 3) * 5;

    // Gorgeous Long Autumn Forest Hair (flowing past knees)
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.moveTo(-6, -26);
    ctx.quadraticCurveTo(-18 + hairWave, -18, -22 + hairWave * 1.3, 0);
    ctx.lineTo(-17 + hairWave * 1.3, 6);
    ctx.quadraticCurveTo(-11 + hairWave, -12, -4, -18);
    ctx.closePath();
    ctx.fill();

    // Leaves & Berries in Hair - Delicate circles
    ctx.fillStyle = '#ef4444'; // Red Rowan Berries
    ctx.beginPath();
    ctx.arc(-17 + hairWave * 0.8, -14, 1.8, 0, Math.PI * 2);
    ctx.arc(-19 + hairWave * 1.1, -4, 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#4ade80'; // Leaves
    ctx.beginPath();
    ctx.ellipse(-14 + hairWave * 0.6, -20, 2, 1.3, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Characteristic Swedish Folklore Fox Tail (Rävsvans) - Lush fluffy brush
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(-7, 6);
    ctx.quadraticCurveTo(-26 + tailWave, -2, -18 + tailWave * 1.2, -18);
    ctx.quadraticCurveTo(-14 + tailWave, -12, -7, -4);
    ctx.closePath();
    ctx.fill();

    // Bushy White Fox Tail Tip
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(-18 + tailWave * 1.2, -13);
    ctx.quadraticCurveTo(-20 + tailWave * 1.2, -19, -16 + tailWave * 1.2, -21);
    ctx.quadraticCurveTo(-12 + tailWave * 1.2, -17, -13 + tailWave * 1.2, -11);
    ctx.closePath();
    ctx.fill();

    // Woven Birch Bark Corset & Flowing Emerald Willow Dress - Natural feminine silhouette
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.moveTo(-9, -14);
    ctx.quadraticCurveTo(-11, -3, -6, 6);
    ctx.quadraticCurveTo(-12, 12, -10, 16);
    ctx.quadraticCurveTo(0, 19, 10, 16);
    ctx.quadraticCurveTo(12, 12, 6, 6);
    ctx.quadraticCurveTo(11, -3, 9, -14);
    ctx.quadraticCurveTo(0, -12, -9, -14);
    ctx.closePath();
    ctx.fill();

    // Birch Bark Corset - Curved midsection
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(0, -4, 6.5, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Delicate Fair Enchantress Face - Contoured heart-shaped face
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.moveTo(-6, -28);
    ctx.quadraticCurveTo(0, -31, 6, -28);
    ctx.quadraticCurveTo(6.5, -23, 4, -18.5);
    ctx.quadraticCurveTo(0, -16.5, -4, -18.5);
    ctx.quadraticCurveTo(-6.5, -23, -6, -28);
    ctx.closePath();
    ctx.fill();

    // Pointed Curved Elven Ears
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.moveTo(-6, -25);
    ctx.lineTo(-9, -27);
    ctx.lineTo(-6, -23);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(6, -25);
    ctx.lineTo(9, -27);
    ctx.lineTo(6, -23);
    ctx.closePath();
    ctx.fill();

    // Blushing Rosy Cheeks
    ctx.fillStyle = 'rgba(244, 63, 94, 0.4)';
    ctx.beginPath();
    ctx.ellipse(-4, -22, 1.8, 1.2, 0, 0, Math.PI * 2);
    ctx.ellipse(4, -22, 1.8, 1.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Mystical Emerald Eyes - Almond shape
    if (isBlink) {
      ctx.strokeStyle = '#14532d';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(-3, -24, 1.8, 0.2, Math.PI - 0.2);
      ctx.arc(3, -24, 1.8, 0.2, Math.PI - 0.2);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(-3, -24, 2.4, 1.6, 0, 0, Math.PI * 2);
      ctx.ellipse(3, -24, 2.4, 1.6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Emerald Irises
      ctx.fillStyle = '#22c55e';
      ctx.shadowColor = '#4ade80';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(-3, -24, 1.3, 0, Math.PI * 2);
      ctx.arc(3, -24, 1.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Specular highlight
      ctx.fillStyle = '#dcfce7';
      ctx.beginPath();
      ctx.arc(-3.5, -24.4, 0.6, 0, Math.PI * 2);
      ctx.arc(2.5, -24.4, 0.6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Delicate Curved Lips
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.ellipse(0, -19.5, 1.5, 0.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Golden Antler Crown with Hanging Amber Beads - Curved branching antlers
    ctx.fillStyle = '#ca8a04';
    ctx.beginPath();
    ctx.moveTo(-5, -29);
    ctx.quadraticCurveTo(-10, -34, -14, -38);
    ctx.quadraticCurveTo(-11, -35, -8, -32);
    ctx.lineTo(-4, -28);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(5, -29);
    ctx.quadraticCurveTo(10, -34, 14, -38);
    ctx.quadraticCurveTo(11, -35, 8, -32);
    ctx.lineTo(4, -28);
    ctx.closePath();
    ctx.fill();

    // Amber Beads - Shimmering teardrops
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(-9, -29, 1.4, 0, Math.PI * 2);
    ctx.arc(9, -29, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
}
