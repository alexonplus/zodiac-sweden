/**
 * Relic and Loot Drop Manager for Zodiac Sweden
 * Manages floating drops: Hearts, Energy Cells, Star Shards, Cinnamon Buns, Meatballs,
 * Surströmming, and Legendary Powerup Buffs (Aegis, Mjölnir, Chronos, Valkyrie, Fika, Berserker, Magnet).
 */
export class RelicManager {
  constructor() {
    this.relicPickups = [];
  }

  /**
   * Spawns random or specific loot from defeated enemies or smashed crates
   */
  spawn(x, y, forcedType = null) {
    let type = forcedType;
    if (!type) {
      const rand = Math.random();
      if (rand < 0.28) type = 'heart';         // 28% Healing Heart
      else if (rand < 0.50) type = 'energy';   // 22% Energy Cell
      else if (rand < 0.68) type = 'shard';    // 18% Star Shard
      else if (rand < 0.78) type = 'kanelbulle'; // 10% Cinnamon Bun
      else if (rand < 0.86) type = 'meatball'; // 8% Köttbullar
      else if (rand < 0.90) type = 'fika';     // 4% Swedish Fika
      else if (rand < 0.94) type = 'mjolnir';  // 4% Thor Lightning
      else if (rand < 0.97) type = 'aegis';    // 3% Shield of Odin
      else if (rand < 0.99) type = 'berserker';// 2% Berserker Rune
      else type = 'magnet';                    // 1% Star Magnet
    }

    this.relicPickups.push({
      x: x + (Math.random() - 0.5) * 20,
      y: y - 10,
      vx: (Math.random() - 0.5) * 3,
      vy: -4.5 - Math.random() * 2,
      type: type,
      w: 26,
      h: 26,
      life: 650,
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
    if (type === 'aegis') return '#38bdf8';
    if (type === 'mjolnir') return '#facc15';
    if (type === 'valkyrie') return '#06b6d4';
    if (type === 'chronos') return '#818cf8';
    if (type === 'fika') return '#f97316';
    if (type === 'berserker') return '#dc2626';
    if (type === 'magnet') return '#ec4899';
    return '#ffffff';
  }

  update(player1, player2, isCoopMode, isMagnetActive = false) {
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

      // Magnetic attraction towards nearby active player (or screen-wide if magnet active)
      const targets = [player1];
      if (isCoopMode && player2 && player2.hp > 0) targets.push(player2);

      const pullDistance = isMagnetActive ? 1200 : 130;

      for (const p of targets) {
        if (!p || p.hp <= 0) continue;
        const dx = (p.x + p.w / 2) - (r.x + r.w / 2);
        const dy = (p.y + p.h / 2) - (r.y + r.h / 2);
        const dist = Math.hypot(dx, dy);

        if (dist < pullDistance && dist > 1) {
          const speed = isMagnetActive ? 14 : (1 - dist / pullDistance) * 5.5;
          r.x += (dx / dist) * speed;
          r.y += (dy / dist) * speed;
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
      ctx.shadowBlur = 14;
      ctx.strokeStyle = r.color;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Item Graphic / Emoji Icon
      ctx.font = 'bold 18px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const icons = {
        heart: '❤️',
        energy: '⚡',
        shard: '⭐',
        kanelbulle: '🥐',
        meatball: '🧆',
        surstromming: '🐟',
        aegis: '🛡️',
        mjolnir: '⚡',
        valkyrie: '🚀',
        chronos: '⏱️',
        fika: '☕',
        berserker: '⚔️',
        magnet: '🧲'
      };

      ctx.shadowColor = r.color;
      ctx.shadowBlur = 10;
      ctx.fillText(icons[r.type] || '⭐', 0, 0);

      ctx.restore();
    }
  }

  clear() {
    this.relicPickups.length = 0;
  }
}

export const relicManager = new RelicManager();
