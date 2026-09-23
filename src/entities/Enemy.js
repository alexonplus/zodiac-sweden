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
    if (this.cooldown > 0) this.cooldown--;
    if (this.actionTimer > 0) this.actionTimer--;

    if (this.stunTimer > 0) {
      this.stunTimer--;
      this.vx = 0;
      this.applyPhysics(platforms);
      return;
    }

    const target = this.getNearestPlayer(p1, p2, isCoopMode);
    if (!target || target.hp <= 0) {
      this.vx = 0;
      this.applyPhysics(platforms);
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

    this.applyPhysics(platforms);

    // Contact damage during melee attack states
    if (this.state === 'attack' || this.state === 'dash') {
      const pDist = Math.hypot((target.x + target.w/2) - (this.x + this.w/2), (target.y + target.h/2) - (this.y + this.h/2));
      if (pDist < 45 && target.invulnTime === 0) {
        target.takeDamage(this.dmg, null, onShake);
      }
    }
  }

  applyPhysics(platforms) {
    this.vy += 0.55;
    if (this.vy > 14) this.vy = 14;

    this.x += this.vx;
    this.y += this.vy;

    const groundY = 490;
    if (this.y + this.h >= groundY) {
      this.y = groundY - this.h;
      this.vy = 0;
      this.isGrounded = true;
      return;
    }

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

    if (!onPlatform) this.isGrounded = false;
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
    ctx.translate(this.x + this.w/2, this.y + this.h/2);
    if (this.facing < 0) ctx.scale(-1, 1);

    if (this.stunTimer > 0 && Math.floor(this.stunTimer / 4) % 2 === 0) {
      ctx.globalAlpha = 0.5;
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

    // Health Bar
    if (this.hp < this.maxHp) {
      const hpPct = Math.max(0, this.hp / this.maxHp);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(this.x, this.y - 12, this.w, 4);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(this.x, this.y - 12, this.w * hpPct, 4);
    }
  }

  // 1. Viking Berserker
  drawViking(ctx, legOffset) {
    // Cape & Fur Pelt
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-14, -14, 8, 26);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(-12, -18, 16, 6);

    // Legs & Boots
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-8 - legOffset, 8, 6, 18);
    ctx.fillRect(2 + legOffset, 8, 6, 18);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-8 - legOffset, 20, 8, 7);
    ctx.fillRect(2 + legOffset, 20, 8, 7);

    // Torso Chainmail & Belt
    ctx.fillStyle = '#334155';
    ctx.fillRect(-10, -14, 20, 24);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(-10, 4, 20, 4); // Belt

    // Head & Horned Helmet
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-6, -26, 12, 12);
    ctx.fillStyle = '#64748b'; // Iron Helm
    ctx.fillRect(-8, -32, 16, 8);
    ctx.fillStyle = '#f8fafc'; // Horns
    ctx.fillRect(-12, -36, 4, 8);
    ctx.fillRect(8, -36, 4, 8);

    // Braided Yellow Beard
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-4, -18, 8, 10);
    ctx.fillRect(-2, -8, 4, 6);

    // Round Shield
    if (this.isShielding) {
      ctx.fillStyle = '#1e3a8a';
      ctx.beginPath();
      ctx.arc(10, 0, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(10, 0, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Heavy Bearded War Axe
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-16, -10, 4, 24);
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(-22, -16, 12, 10);
  }

  // 2. LKAB Ore Mining Automaton Golem
  drawGolem(ctx, legOffset) {
    // Heavy Riveted Steam Legs
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-12 - legOffset, 10, 10, 20);
    ctx.fillRect(4 + legOffset, 10, 10, 20);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(-12 - legOffset, 22, 10, 8);
    ctx.fillRect(4 + legOffset, 22, 10, 8);

    // Boiler Torso with Glowing Furnace Core
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-16, -18, 32, 30);
    ctx.fillStyle = '#334155';
    ctx.fillRect(-14, -16, 28, 26);
    ctx.fillStyle = '#ea580c';
    ctx.shadowColor = '#ea580c';
    ctx.shadowBlur = 10;
    ctx.fillRect(-6, -8, 12, 12);
    ctx.shadowBlur = 0;

    // Steam Chimney Exhaust
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-10, -32, 6, 14);
    ctx.fillRect(4, -32, 6, 14);

    // Heavy Diamond Coring Drill (Right Arm)
    ctx.save();
    ctx.translate(14, 4);
    ctx.rotate(this.drillSpin);
    ctx.fillStyle = '#475569';
    ctx.fillRect(0, -6, 8, 12);
    ctx.fillStyle = '#06b6d4'; // Cyan Diamond Bit
    ctx.beginPath();
    ctx.moveTo(8, -8);
    ctx.lineTo(24, 0);
    ctx.lineTo(8, 8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // 3. Royal Caroliner Musketeer
  drawKarolin(ctx, legOffset) {
    // Blue & Yellow Royal Coat
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-10, -14, 20, 24);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-10, -14, 20, 4); // Epaulettes
    ctx.fillRect(-4, -10, 8, 16); // Yellow Vest

    // Legs & White Gaiters
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-8 - legOffset, 10, 6, 18);
    ctx.fillRect(2 + legOffset, 10, 6, 18);
    ctx.fillStyle = '#f8fafc'; // Gaiters
    ctx.fillRect(-8 - legOffset, 16, 6, 8);
    ctx.fillRect(2 + legOffset, 16, 6, 8);

    // Head & Tricorne Hat with Cockade
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-6, -26, 12, 12);
    ctx.fillStyle = '#0f172a'; // Tricorne
    ctx.fillRect(-12, -32, 24, 6);
    ctx.fillRect(-8, -38, 16, 6);
    ctx.fillStyle = '#38bdf8'; // Cockade
    ctx.fillRect(6, -34, 4, 4);

    // Flintlock Musket with Razor Bayonet
    ctx.fillStyle = '#78350f';
    ctx.fillRect(4, -4, 26, 4);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(24, -6, 8, 8); // Lock
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(30, -5, 14, 2); // Bayonet

    // Laser Sight when aiming
    if (this.laserAim) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(32, -4);
      ctx.lineTo(300, -4);
      ctx.stroke();
    }
  }

  // 4. Visby Ghost Corsair
  drawCorsair(ctx, legOffset) {
    const floatBob = Math.sin(this.animTimer * 3) * 3;

    // Translucent Ethereal Ghost Coat
    ctx.fillStyle = '#3b0764';
    ctx.globalAlpha = 0.85;
    ctx.fillRect(-10, -14 + floatBob, 20, 26);

    // Ghost Skull & Cyan Eye Glow
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(-6, -26 + floatBob, 12, 12);
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.fillRect(-2, -22 + floatBob, 3, 3);
    ctx.fillRect(3, -22 + floatBob, 3, 3);
    ctx.shadowBlur = 0;

    // Pirate Tricorn Hat
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-12, -32 + floatBob, 24, 6);
    ctx.fillRect(-8, -38 + floatBob, 16, 6);

    // Ethereal Ghost Cutlass
    ctx.fillStyle = '#a855f7';
    ctx.shadowColor = '#a855f7';
    ctx.shadowBlur = 12;
    ctx.fillRect(8, -6 + floatBob, 18, 4);
    ctx.fillRect(22, -10 + floatBob, 6, 12);
    ctx.shadowBlur = 0;
  }

  // 5. Mountain Forest Troll
  drawTroll(ctx, legOffset) {
    // Hulking Mossy Stone Body
    ctx.fillStyle = '#3f6212';
    ctx.fillRect(-18, -16, 36, 32);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-14, -12, 28, 24);

    // Heavy Stone Legs
    ctx.fillStyle = '#334155';
    ctx.fillRect(-14 - legOffset, 14, 12, 18);
    ctx.fillRect(2 + legOffset, 14, 12, 18);

    // Big Troll Nose & Amber Eyes
    ctx.fillStyle = '#4d7c0f';
    ctx.fillRect(-10, -28, 20, 14);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-2, -24, 4, 4); // Glowing Eye
    ctx.fillStyle = '#65a30d';
    ctx.fillRect(-6, -20, 12, 8); // Huge Nose

    // Birch Trunk Club with Spikes
    ctx.fillStyle = '#fef08a'; // Birch Bark
    ctx.fillRect(12, -24, 10, 36);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(14, 12, 6, 12); // Handle
  }

  // 6. Skogsrå Forest Mystic Dryad
  drawSkogsra(ctx, legOffset) {
    // Flowing Willow Dress
    ctx.fillStyle = '#15803d';
    ctx.fillRect(-10, -14, 20, 28);
    ctx.fillStyle = '#86efac';
    ctx.fillRect(-8, -10, 16, 18);

    // Fox Tail
    const tailWave = Math.sin(this.animTimer * 2.5) * 5;
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(-8, 6);
    ctx.quadraticCurveTo(-22 + tailWave, -4, -14, -20);
    ctx.lineTo(-6, -12);
    ctx.closePath();
    ctx.fill();

    // Antler Crown Head
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-6, -26, 12, 12);
    ctx.fillStyle = '#ca8a04'; // Antlers
    ctx.fillRect(-12, -34, 4, 10);
    ctx.fillRect(8, -34, 4, 10);
    ctx.fillRect(-16, -38, 6, 4);
    ctx.fillRect(10, -38, 6, 4);

    // Emerald Glowing Eyes
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(-2, -22, 3, 3);
    ctx.fillRect(3, -22, 3, 3);
  }
}
