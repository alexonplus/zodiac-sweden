/**
 * Relic and Loot Drop Manager for Zodiac Sweden
 * Manages floating drops: Hearts, Energy Cells, Star Shards, Cinnamon Buns, Meatballs, Surströmming
 */
export class RelicManager {
  constructor() {
    this.relicPickups = [];
  }

  /**
   * Spawns random or specific loot from defeated enemies
   */
  spawn(x, y, forcedType = null) {
    let type = forcedType;
    if (!type) {
      const rand = Math.random();
      if (rand < 0.38) type = 'heart';         // 38% Healing Heart
      else if (rand < 0.65) type = 'energy';   // 27% Energy Cell
      else if (rand < 0.85) type = 'shard';    // 20% Star Shard
      else if (rand < 0.94) type = 'kanelbulle'; // 9% Cinnamon Bun
      else if (rand < 0.98) type = 'meatball'; // 4% Köttbullar
      else type = 'surstromming';              // 2% Surströmming
    }

    this.relicPickups.push({
      x: x + (Math.random() - 0.5) * 20,
      y: y - 10,
      vx: (Math.random() - 0.5) * 3,
      vy: -4.5 - Math.random() * 2,
      type: type,
      w: 24,
      h: 24,
      life: 600,
      bob: Math.random() * 10,
      color: this.getColorForType(type)
    });
  }

  getColorForType(type) {
    if (type === 'heart') return '#ef4444';
    if (type === 'energy') return '#00f0ff';
    if (type === 'shard') return '#facc15';
    if (type === 'kanelbulle') return '#fb923c';
    if (type === 'meatball') return '#4ade80';
    if (type === 'surstromming') return '#a855f7';
    return '#ffffff';
  }

  update(player1, player2, isCoopMode) {
    const groundY = 480;

    for (let i = this.relicPickups.length - 1; i >= 0; i--) {
      const r = this.relicPickups[i];
      r.life--;
      r.bob += 0.08;

      // Gravity & Ground Landing
      r.x += r.vx;
      r.y += r.vy;
      r.vx *= 0.94;
      if (r.y < groundY) {
        r.vy += 0.35;
      } else {
        r.y = groundY;
        r.vy = 0;
      }

      // Magnetic attraction towards nearby active player (within 110px)
      const targets = [player1];
      if (isCoopMode && player2 && player2.hp > 0) targets.push(player2);

      for (const p of targets) {
        if (!p || p.hp <= 0) continue;
        const dx = (p.x + p.w / 2) - (r.x + r.w / 2);
        const dy = (p.y + p.h / 2) - (r.y + r.h / 2);
        const dist = Math.hypot(dx, dy);

        if (dist < 120 && dist > 1) {
          const pullSpeed = (1 - dist / 120) * 4.5;
          r.x += (dx / dist) * pullSpeed;
          r.y += (dy / dist) * pullSpeed;
        }
      }

      if (r.life <= 0) this.relicPickups.splice(i, 1);
    }
  }

  draw(ctx) {
    for (const r of this.relicPickups) {
      ctx.save();
      const floatY = r.y + Math.sin(r.bob) * 4;
      ctx.translate(r.x + r.w / 2, floatY + r.h / 2);

      // Flashing when about to despawn
      if (r.life < 100 && Math.floor(r.life / 5) % 2 === 0) {
        ctx.globalAlpha = 0.4;
      }

      // Glowing Aura Ring
      ctx.save();
      ctx.shadowColor = r.color;
      ctx.shadowBlur = 12;
      ctx.strokeStyle = r.color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Item Graphic / Icon
      ctx.font = 'bold 18px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (r.type === 'heart') {
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 10;
        ctx.fillText('❤️', 0, 0);
      } else if (r.type === 'energy') {
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 10;
        ctx.fillText('⚡', 0, 0);
      } else if (r.type === 'shard') {
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 10;
        ctx.fillText('⭐', 0, 0);
      } else if (r.type === 'kanelbulle') {
        ctx.shadowColor = '#fb923c';
        ctx.shadowBlur = 10;
        ctx.fillText('🥐', 0, 0);
      } else if (r.type === 'meatball') {
        ctx.shadowColor = '#4ade80';
        ctx.shadowBlur = 10;
        ctx.fillText('🧆', 0, 0);
      } else if (r.type === 'surstromming') {
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 10;
        ctx.fillText('🐟', 0, 0);
      }

      ctx.restore();
    }
  }

  clear() {
    this.relicPickups.length = 0;
  }
}

export const relicManager = new RelicManager();
