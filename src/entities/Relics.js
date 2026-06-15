export class RelicManager {
  constructor() {
    this.relicPickups = [];
  }

  spawn(x, y) {
    const types = ['meatball', 'surstromming', 'fika'];
    const rType = types[Math.floor(Math.random() * types.length)];
    this.relicPickups.push({ x, y, type: rType, w: 24, h: 24, vy: -3, life: 450, bob: 0 });
  }

  update() {
    for (let i = this.relicPickups.length - 1; i >= 0; i--) {
      const r = this.relicPickups[i];
      r.life--;
      r.bob += 0.08;
      r.y += Math.sin(r.bob) * 0.4;
      if (r.life <= 0) this.relicPickups.splice(i, 1);
    }
  }

  draw(ctx) {
    for (const r of this.relicPickups) {
      ctx.save();
      ctx.translate(r.x, r.y);
      ctx.font = '20px monospace';
      if (r.type === 'meatball') ctx.fillText('🧆', 0, 0);
      else if (r.type === 'surstromming') ctx.fillText('🐟', 0, 0);
      else if (r.type === 'fika') ctx.fillText('☕', 0, 0);
      ctx.restore();
    }
  }

  clear() {
    this.relicPickups.length = 0;
  }
}
export const relicManager = new RelicManager();
