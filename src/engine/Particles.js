export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.damageNumbers = [];
    this.lightnings = [];
  }

  createSparks(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 1 + Math.random() * 5;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        color: color || '#00f0ff',
        life: 15 + Math.random() * 20,
        type: 'spark'
      });
    }
  }

  createTrail(x, y, w, h, color) {
    this.particles.push({
      x: x + (Math.random() - 0.5) * 4,
      y: y + (Math.random() - 0.5) * 4,
      w, h,
      color: color || '#00f0ff',
      life: 10,
      type: 'trail'
    });
  }

  createDamageNumber(x, y, text, color) {
    this.damageNumbers.push({
      x: x + (Math.random() - 0.5) * 10,
      y: y - 10,
      text,
      color: color || '#facc15',
      life: 45,
      vy: -1.2
    });
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.x += pt.vx || 0;
      pt.y += pt.vy || 0;
      pt.life--;
      if (pt.life <= 0) this.particles.splice(i, 1);
    }
    for (let i = this.damageNumbers.length - 1; i >= 0; i--) {
      const dn = this.damageNumbers[i];
      dn.y += dn.vy;
      dn.life--;
      if (dn.life <= 0) this.damageNumbers.splice(i, 1);
    }
    for (let i = this.lightnings.length - 1; i >= 0; i--) {
      this.lightnings[i].life--;
      if (this.lightnings[i].life <= 0) this.lightnings.splice(i, 1);
    }
  }

  draw(ctx) {
    for (const pt of this.particles) {
      if (pt.type === 'spark') {
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x, pt.y, 3, 3);
      } else if (pt.type === 'trail') {
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(pt.x, pt.y, pt.w, pt.h);
        ctx.globalAlpha = 1.0;
      }
    }

    for (const dn of this.damageNumbers) {
      ctx.fillStyle = dn.color;
      ctx.font = 'bold 13px monospace';
      ctx.fillText(dn.text, dn.x, dn.y);
    }
  }

  clear() {
    this.particles.length = 0;
    this.damageNumbers.length = 0;
    this.lightnings.length = 0;
  }
}
export const particles = new ParticleSystem();
