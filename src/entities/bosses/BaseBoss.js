import { sound } from '../../engine/Audio.js';
import { particles } from '../../engine/Particles.js';

/**
 * BaseBoss is the foundational class for all Swedish province bosses.
 * Handles phase transitions, stun, rage state, health tracking, and attack intervals.
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
    this.attackTimer = 80;
    this.isEnraged = false;
    this.lastElement = null;
    this.elementTimer = 0;
    this.telegraphTimer = 0;
    this.telegraphType = null;
  }

  takeDamage(amount, element = null, ownerIndex = null) {
    this.hp -= amount;
    sound.playHit();
    if (this.hp < 0) this.hp = 0;
  }

  updateBase(enemyProjectiles, onShake) {
    this.animTimer += 0.08;
    if (this.elementTimer > 0) this.elementTimer--;
    if (this.stunTimer > 0) {
      this.stunTimer--;
      return false; // Skip attack execution if stunned
    }

    // Trigger Phase 2 Enrage at 50% HP
    if (this.hp <= this.maxHp * 0.5 && this.phase === 1) {
      this.phase = 2;
      this.isEnraged = true;
      sound.playRoar();
      if (onShake) onShake(25);
      particles.createSparks(this.x + this.w / 2, this.y + this.h / 2, '#ef4444', 45);
      particles.createDamageNumber(this.x + this.w / 2, this.y - 30, '⚡ PHASE 2: ENRAGED! ⚡', '#ef4444');
    }

    if (this.telegraphTimer > 0) {
      this.telegraphTimer--;
    }

    this.attackTimer--;
    return true; // Boss is active
  }

  drawTelegraph(ctx) {
    if (this.telegraphTimer > 0) {
      ctx.save();
      ctx.strokeStyle = this.phase === 2 ? '#ef4444' : '#facc15';
      ctx.lineWidth = 2 + Math.sin(this.animTimer * 10) * 1.5;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.arc(this.x + this.w / 2, this.y + this.h / 2, this.w * 0.85, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }
}
