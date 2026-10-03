import { sound } from '../../engine/Audio.js';
import { particles } from '../../engine/Particles.js';

/**
 * BaseBoss is the foundational class for all Swedish province bosses.
 * Handles phase transitions, dynamic mobility, player tracking, telegraphed danger zones,
 * rage state, and arena presence.
 */
export class BaseBoss {
  constructor(x, y, name, maxHp, icon, width = 140, height = 160) {
    this.x = x;
    this.y = y;
    this.name = name;
    this.icon = icon || '👾';
    this.maxHp = maxHp;
    this.hp = maxHp;
    this.w = width;
    this.h = height;
    this.phase = 1;
    this.stunTimer = 0;
    this.animTimer = 0;
    this.attackTimer = 70;
    this.isEnraged = false;
    this.lastElement = null;
    this.elementTimer = 0;
    this.telegraphTimer = 0;
    this.telegraphType = null;
    this.telegraphZones = []; // Array of { x, y, w, h, timer, maxTimer, color, type }
    this.frozenTimer = 0;
    this.petrifiedTimer = 0;
    this.burnTimer = 0;
    this.windBlowTimer = 0;
    this.windBlowVx = 0;

    // Dynamic mobility & targeting
    this.vx = 0;
    this.vy = 0;
    this.facing = -1;
    this.isGrounded = false;
    this.targetPlayer = null;
    this.arenaMinX = x - 550;
    this.arenaMaxX = x + 350;
    this.moveTimer = 0;
    this.actionState = 'idle'; // 'idle', 'approach', 'retreat', 'windup', 'special'
  }

  takeDamage(amount, element = null, ownerIndex = null) {
    this.hp -= amount;
    sound.playHit();
    if (this.hp < 0) this.hp = 0;
  }

  applyHit(amount, element = null, ownerIndex = null, isMelee = false, isHeavyEarth = false) {
    let finalDamage = amount;
    if (this.frozenTimer > 0 && (isMelee || isHeavyEarth || element === 'earth' || element === 'fire')) {
      finalDamage = Math.floor(amount * 1.8);
      this.frozenTimer = 0;
      sound.playIceShatter();
      particles.createIceShards(this.x + this.w / 2, this.y + this.h / 2, 25);
      particles.createDamageNumber(this.x + this.w / 2, this.y - 25, `💥 SHATTER! -${finalDamage} ❄️`, '#00f0ff');
    }
    this.takeDamage(finalDamage, element, ownerIndex);
    return { finalDamage };
  }

  findTarget(player1, player2, isCoopMode) {
    if (!player1 && !player2) return null;
    if (!isCoopMode || !player2 || player2.hp <= 0) return player1 && player1.hp > 0 ? player1 : null;
    if (!player1 || player1.hp <= 0) return player2 && player2.hp > 0 ? player2 : null;

    const d1 = Math.abs(player1.x - this.x);
    const d2 = Math.abs(player2.x - this.x);
    return d1 <= d2 ? player1 : player2;
  }

  updateBase(arg1, arg2, arg3, arg4, arg5, arg6) {
    let player1, player2, isCoopMode, enemyProjectiles, platforms, onShake;
    if (Array.isArray(arg1)) {
      // Legacy call: updateBase(enemyProjectiles, onShake)
      enemyProjectiles = arg1;
      onShake = arg2;
      platforms = [];
    } else {
      player1 = arg1;
      player2 = arg2;
      isCoopMode = arg3;
      enemyProjectiles = arg4;
      platforms = arg5 || [];
      onShake = arg6;
    }

    this.animTimer += 0.08;
    if (this.elementTimer > 0) this.elementTimer--;

    // Burning tick
    if (this.burnTimer > 0) {
      this.burnTimer--;
      if (this.burnTimer % 20 === 0) {
        this.hp -= 10;
        particles.createFlame(this.x + this.w / 2, this.y + this.h / 2, 4);
        particles.createDamageNumber(this.x + this.w / 2, this.y - 15, '🔥 -10', '#f97316');
      }
    }

    // Frozen slowdown / stagger
    if (this.frozenTimer > 0) {
      this.frozenTimer--;
      if (this.frozenTimer % 2 === 0) return false;
    }

    if (this.stunTimer > 0) {
      this.stunTimer--;
      return false;
    }

    // Update target player & facing
    this.targetPlayer = this.findTarget(player1, player2, isCoopMode);
    if (this.targetPlayer) {
      this.facing = this.targetPlayer.x < (this.x + this.w / 2) ? -1 : 1;
    }

    // Trigger Phase 2 Enrage at 50% HP
    if (this.hp <= this.maxHp * 0.5 && this.phase === 1) {
      this.phase = 2;
      this.isEnraged = true;
      sound.playRoar();
      if (onShake) onShake(30);
      particles.createSparks(this.x + this.w / 2, this.y + this.h / 2, '#ef4444', 50);
      particles.createFlame(this.x + this.w / 2, this.y + this.h / 2, 30);
      particles.createDamageNumber(this.x + this.w / 2, this.y - 35, '⚡ PHASE 2: BERSERK ENRAGE! ⚡', '#ef4444');
    }

    // Update active telegraphed danger zones
    for (let i = this.telegraphZones.length - 1; i >= 0; i--) {
      const tz = this.telegraphZones[i];
      tz.timer--;
      if (tz.timer <= 0) {
        // Execute the telegraphed strike when timer expires!
        if (tz.onTrigger) tz.onTrigger();
        this.telegraphZones.splice(i, 1);
      }
    }

    if (this.telegraphTimer > 0) {
      this.telegraphTimer--;
    }

    this.attackTimer--;
    return true;
  }

  addTelegraphZone(x, y, w, h, duration, color = '#ef4444', onTrigger = null) {
    this.telegraphZones.push({
      x, y, w, h,
      timer: duration,
      maxTimer: duration,
      color,
      onTrigger
    });
  }

  applyGravityAndPlatforms(platforms = []) {
    this.vy += 0.5;
    if (this.vy > 14) this.vy = 14;

    this.x += this.vx;
    this.y += this.vy;

    // Floor collision (default 490px)
    const floorY = 490 - this.h;
    if (this.y >= floorY) {
      this.y = floorY;
      this.vy = 0;
      this.isGrounded = true;
    } else {
      this.isGrounded = false;
    }

    // Platform collision
    for (const p of platforms) {
      if (this.x + this.w > p.x && this.x < p.x + p.w) {
        if (this.y + this.h >= p.y && this.y + this.h <= p.y + 22 && this.vy >= 0) {
          this.y = p.y - this.h;
          this.vy = 0;
          this.isGrounded = true;
          break;
        }
      }
    }

    // Clamp inside arena bounds
    if (this.x < this.arenaMinX) {
      this.x = this.arenaMinX;
      this.vx = Math.abs(this.vx) * 0.5;
    } else if (this.x + this.w > this.arenaMaxX) {
      this.x = this.arenaMaxX - this.w;
      this.vx = -Math.abs(this.vx) * 0.5;
    }
  }

  drawTelegraph(ctx) {
    ctx.save();

    // 1. Draw Telegraphed Danger Zones (Red warning bands / crosshairs on the floor/air)
    for (const tz of this.telegraphZones) {
      const progress = 1 - (tz.timer / tz.maxTimer);
      ctx.save();
      // Flashing danger fill
      ctx.fillStyle = tz.color;
      ctx.globalAlpha = 0.15 + Math.sin(this.animTimer * 15) * 0.1;
      ctx.fillRect(tz.x, tz.y, tz.w, tz.h);

      // Warning borders
      ctx.strokeStyle = tz.color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.6 + progress * 0.4;
      ctx.strokeRect(tz.x, tz.y, tz.w, tz.h);

      // Fill progress bar inside danger zone
      ctx.fillStyle = tz.color;
      ctx.globalAlpha = 0.45;
      ctx.fillRect(tz.x, tz.y + tz.h - 4, tz.w * progress, 4);

      // Warning Danger Icon
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.globalAlpha = 0.9;
      ctx.fillText('⚠️ DANGER', tz.x + tz.w / 2, tz.y + tz.h / 2 + 4);

      ctx.restore();
    }

    // 2. Boss Charging Aura & Enrage Flame
    if (this.isEnraged) {
      ctx.save();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3 + Math.sin(this.animTimer * 12) * 1.5;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(this.x + this.w / 2, this.y + this.h / 2, this.w * 0.75 + Math.sin(this.animTimer * 8) * 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    } else if (this.telegraphTimer > 0) {
      ctx.save();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2 + Math.sin(this.animTimer * 10) * 1.5;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.arc(this.x + this.w / 2, this.y + this.h / 2, this.w * 0.85, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }
}
