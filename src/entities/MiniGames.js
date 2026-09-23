import { sound } from '../engine/Audio.js';
import { particles } from '../engine/Particles.js';
import { checkRectCollision } from '../engine/Physics.js';
import { shopManager } from './Shop.js';

/**
 * Secret Mini-Game: "Smörgåsbord Rush"
 * 30-second rapid falling Swedish feast items (Meatballs, Cinnamon Buns, Star Shards)
 */
export class MiniGameManager {
  constructor() {
    this.isActive = false;
    this.timer = 0;
    this.score = 0;
    this.shardsEarned = 0;
    this.fallingItems = [];
  }

  start(player1, player2, isCoopMode) {
    this.isActive = true;
    this.timer = 30 * 60; // 30 seconds
    this.score = 0;
    this.shardsEarned = 0;
    this.fallingItems.length = 0;
    sound.playSynergy();
  }

  update(player1, player2, isCoopMode) {
    if (!this.isActive) return;

    this.timer--;

    // Spawn falling food and star shards
    if (this.timer % 15 === 0) {
      const types = ['meatball', 'kanelbulle', 'shard', 'gold_shard'];
      const picked = types[Math.floor(Math.random() * types.length)];
      this.fallingItems.push({
        x: 60 + Math.random() * 960,
        y: -20,
        vy: 3.5 + Math.random() * 3,
        type: picked,
        w: 28,
        h: 28
      });
    }

    // Update items & player catch collision
    const targets = [player1];
    if (isCoopMode && player2 && player2.hp > 0) targets.push(player2);

    for (let i = this.fallingItems.length - 1; i >= 0; i--) {
      const item = this.fallingItems[i];
      item.y += item.vy;

      for (const p of targets) {
        if (checkRectCollision(item, p)) {
          sound.playItem();
          if (item.type === 'meatball') {
            this.score += 50;
            p.hp = Math.min(p.maxHp, p.hp + 20);
            particles.createDamageNumber(item.x, item.y, '+50 PTS 🧆', '#4ade80');
          } else if (item.type === 'kanelbulle') {
            this.score += 80;
            p.hp = Math.min(p.maxHp, p.hp + 30);
            particles.createDamageNumber(item.x, item.y, '+80 PTS 🥐', '#fb923c');
          } else if (item.type === 'shard') {
            this.score += 100;
            this.shardsEarned += 2;
            shopManager.addShards(2);
            particles.createDamageNumber(item.x, item.y, '+2 ⭐', '#facc15');
          } else if (item.type === 'gold_shard') {
            this.score += 250;
            this.shardsEarned += 5;
            shopManager.addShards(5);
            particles.createDamageNumber(item.x, item.y, '+5 ⭐ MEGA!', '#facc15');
          }
          particles.createSparks(item.x + 14, item.y + 14, '#facc15', 12);
          this.fallingItems.splice(i, 1);
          break;
        }
      }

      if (item.y > 520) {
        this.fallingItems.splice(i, 1);
      }
    }

    if (this.timer <= 0) {
      this.end();
    }
  }

  end() {
    this.isActive = false;
    sound.playRoar();
  }

  draw(ctx, screenW = 1080, screenH = 620) {
    if (!this.isActive) return;

    ctx.save();
    // Top Mini-game Header
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(screenW / 2 - 200, 20, 400, 50);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.strokeRect(screenW / 2 - 200, 20, 400, 50);

    ctx.fillStyle = '#facc15';
    ctx.font = '900 16px "Orbitron", monospace';
    ctx.textAlign = 'center';
    const sec = Math.ceil(this.timer / 60);
    ctx.fillText(`🍽️ SMÖRGÅSBORD RUSH: ${sec}S`, screenW / 2, 44);
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`SCORE: ${this.score} | SHARDS EARNED: +${this.shardsEarned} ⭐`, screenW / 2, 62);

    // Draw falling food items
    for (const item of this.fallingItems) {
      ctx.font = 'bold 22px monospace';
      ctx.textAlign = 'center';
      const icon = item.type === 'meatball' ? '🧆' : (item.type === 'kanelbulle' ? '🥐' : (item.type === 'gold_shard' ? '🌟' : '⭐'));
      ctx.fillText(icon, item.x + item.w / 2, item.y + item.h / 2);
    }

    ctx.restore();
  }
}

export const miniGameManager = new MiniGameManager();
