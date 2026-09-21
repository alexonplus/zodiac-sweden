import { sound } from '../engine/Audio.js';
import { particles } from '../engine/Particles.js';

/**
 * Powerups & Buffs Manager for Zodiac Sweden.
 * Handles active duration timers, particle halos, and trigger effects:
 * - 🛡️ Aegis (Shield of Odin - Invulnerable + Barrier)
 * - ⚡ Mjölnir (Thor Chain Lightning on basic hits)
 * - 🚀 Valkyrie Frost Dash (Speed + Damaging Ice Trail)
 * - ⏱️ Chronos (Time Freeze on enemies)
 * - ☕ Swedish Fika (Super Energy Regen + Speed)
 * - ⚔️ Berserker Rune (2.5x Damage Multiplier)
 * - 🧲 Star Magnet (Screen-wide loot attraction)
 */
export class BuffManager {
  constructor() {
    this.activeBuffs = {
      p1: {},
      p2: {}
    };
    this.timeFreezeTimer = 0;
  }

  applyBuff(playerIndex, buffType) {
    const pKey = playerIndex === 1 ? 'p1' : 'p2';
    sound.playSynergy();

    if (buffType === 'aegis') {
      this.activeBuffs[pKey]['aegis'] = 480; // 8 seconds
    } else if (buffType === 'mjolnir') {
      this.activeBuffs[pKey]['mjolnir'] = 600; // 10 seconds
    } else if (buffType === 'valkyrie') {
      this.activeBuffs[pKey]['valkyrie'] = 600; // 10 seconds
    } else if (buffType === 'chronos') {
      this.timeFreezeTimer = 360; // 6 seconds
    } else if (buffType === 'fika') {
      this.activeBuffs[pKey]['fika'] = 720; // 12 seconds
    } else if (buffType === 'berserker') {
      this.activeBuffs[pKey]['berserker'] = 600; // 10 seconds
    }
  }

  hasBuff(playerIndex, buffType) {
    const pKey = playerIndex === 1 ? 'p1' : 'p2';
    return (this.activeBuffs[pKey][buffType] || 0) > 0;
  }

  getDamageMultiplier(playerIndex) {
    let mult = 1.0;
    if (this.hasBuff(playerIndex, 'berserker')) mult *= 2.5;
    return mult;
  }

  update(player1, player2) {
    // Tick down player buffs
    for (const pKey of ['p1', 'p2']) {
      for (const buff in this.activeBuffs[pKey]) {
        if (this.activeBuffs[pKey][buff] > 0) {
          this.activeBuffs[pKey][buff]--;

          // Particle halos while active
          const player = pKey === 'p1' ? player1 : player2;
          if (player && player.hp > 0) {
            if (buff === 'aegis' && Math.random() < 0.3) {
              particles.createSparks(player.x + player.w / 2, player.y + player.h / 2, '#38bdf8', 2);
            } else if (buff === 'mjolnir' && Math.random() < 0.3) {
              particles.createSparks(player.x + player.w / 2, player.y + player.h / 2, '#facc15', 2);
            } else if (buff === 'berserker' && Math.random() < 0.3) {
              particles.createSparks(player.x + player.w / 2, player.y + player.h / 2, '#ef4444', 2);
            } else if (buff === 'fika' && Math.random() < 0.3) {
              particles.createSparks(player.x + player.w / 2, player.y, '#fb923c', 2);
            }
          }
        }
      }
    }

    // Tick down global time freeze
    if (this.timeFreezeTimer > 0) {
      this.timeFreezeTimer--;
    }
  }

  drawPlayerAuras(ctx, player) {
    if (!player || player.hp <= 0) return;
    const pIndex = player.pIndex;

    // Aegis Radiant Blue Protective Shield Dome
    if (this.hasBuff(pIndex, 'aegis')) {
      ctx.save();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(player.x + player.w / 2, player.y + player.h / 2, player.w * 0.9, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Berserker Red Fire Ring
    if (this.hasBuff(pIndex, 'berserker')) {
      ctx.save();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(player.x + player.w / 2, player.y + player.h / 2, player.w * 0.8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Thor Yellow Lightning Ring
    if (this.hasBuff(pIndex, 'mjolnir')) {
      ctx.save();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 12;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(player.x + player.w / 2, player.y + player.h / 2, player.w * 0.85, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  clear() {
    this.activeBuffs = { p1: {}, p2: {} };
    this.timeFreezeTimer = 0;
  }
}

export const buffManager = new BuffManager();
