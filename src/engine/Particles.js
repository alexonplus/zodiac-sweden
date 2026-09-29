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

  createIceShards(x, y, count = 18) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 2 + Math.random() * 7;
      this.particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd - 2,
        rot: Math.random() * Math.PI,
        vrot: (Math.random() - 0.5) * 0.4,
        size: 4 + Math.random() * 7,
        color: Math.random() < 0.6 ? '#cffafe' : '#38bdf8',
        life: 25 + Math.random() * 20,
        maxLife: 45,
        type: 'iceShard'
      });
    }
  }

  createWindGale(x, y, facing = 1, count = 12) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 30,
        y: y + (Math.random() - 0.5) * 50,
        vx: facing * (8 + Math.random() * 12),
        vy: (Math.random() - 0.5) * 4,
        length: 20 + Math.random() * 35,
        color: Math.random() < 0.5 ? '#e0f2fe' : '#38bdf8',
        life: 15 + Math.random() * 15,
        maxLife: 30,
        type: 'windStreak'
      });
    }
  }

  createEarthDebris(x, y, count = 14) {
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.5;
      const spd = 3 + Math.random() * 8;
      this.particles.push({
        x: x + (Math.random() - 0.5) * 24,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        rot: Math.random() * Math.PI,
        vrot: (Math.random() - 0.5) * 0.3,
        size: 4 + Math.random() * 6,
        color: Math.random() < 0.5 ? '#78350f' : (Math.random() < 0.5 ? '#b45309' : '#d97706'),
        life: 30 + Math.random() * 20,
        maxLife: 50,
        type: 'rockDebris'
      });
    }
  }

  createFlame(x, y, count = 8) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 16,
        vx: (Math.random() - 0.5) * 2.5,
        vy: -2 - Math.random() * 4,
        radius: 4 + Math.random() * 5,
        color: Math.random() < 0.4 ? '#facc15' : (Math.random() < 0.7 ? '#f97316' : '#ea580c'),
        life: 20 + Math.random() * 15,
        maxLife: 35,
        type: 'flame'
      });
    }
  }

  createLeaves(x, y, count = 10) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 30,
        y: y + (Math.random() - 0.5) * 30,
        vx: (Math.random() - 0.5) * 4,
        vy: -1 - Math.random() * 3,
        rot: Math.random() * Math.PI,
        vrot: (Math.random() - 0.5) * 0.2,
        color: Math.random() < 0.5 ? '#22c55e' : '#86efac',
        life: 25 + Math.random() * 20,
        maxLife: 45,
        type: 'leaf'
      });
    }
  }

  createSand(x, y, count = 12) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 1.5 + Math.random() * 4.5;
      this.particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 10,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd - 1.2,
        radius: 1.5 + Math.random() * 2.5,
        color: Math.random() < 0.4 ? '#f59e0b' : (Math.random() < 0.7 ? '#d97706' : '#38bdf8'),
        life: 20 + Math.random() * 25,
        maxLife: 45,
        type: 'sand'
      });
    }
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
      if (pt.rot !== undefined && pt.vrot) pt.rot += pt.vrot;

      if (pt.type === 'iceShard' || pt.type === 'rockDebris') {
        pt.vy = (pt.vy || 0) + 0.25; // Gravity
      } else if (pt.type === 'flame') {
        pt.radius = Math.max(1, (pt.radius || 4) * 0.94);
      } else if (pt.type === 'windStreak') {
        pt.length = (pt.length || 20) * 0.96;
      }

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
      const alpha = pt.maxLife ? Math.max(0.1, pt.life / pt.maxLife) : 1.0;
      ctx.save();

      if (pt.type === 'spark') {
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x, pt.y, 3, 3);
      } else if (pt.type === 'trail') {
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(pt.x, pt.y, pt.w, pt.h);
      } else if (pt.type === 'iceShard') {
        ctx.globalAlpha = alpha;
        ctx.translate(pt.x, pt.y);
        ctx.rotate(pt.rot || 0);
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        const s = pt.size || 5;
        ctx.moveTo(0, -s);
        ctx.lineTo(s * 0.7, s * 0.7);
        ctx.lineTo(-s * 0.7, s * 0.7);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      } else if (pt.type === 'windStreak') {
        ctx.globalAlpha = alpha * 0.75;
        ctx.strokeStyle = pt.color;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(pt.x, pt.y);
        ctx.lineTo(pt.x + (pt.vx > 0 ? pt.length : -pt.length), pt.y + pt.vy * 2);
        ctx.stroke();
      } else if (pt.type === 'rockDebris') {
        ctx.globalAlpha = alpha;
        ctx.translate(pt.x, pt.y);
        ctx.rotate(pt.rot || 0);
        ctx.fillStyle = pt.color;
        const s = pt.size || 5;
        ctx.fillRect(-s / 2, -s / 2, s, s);
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 1;
        ctx.strokeRect(-s / 2, -s / 2, s, s);
      } else if (pt.type === 'flame') {
        ctx.globalAlpha = alpha;
        ctx.fillStyle = pt.color;
        ctx.shadowColor = pt.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.radius || 3, 0, Math.PI * 2);
        ctx.fill();
      } else if (pt.type === 'leaf') {
        ctx.globalAlpha = alpha;
        ctx.translate(pt.x, pt.y);
        ctx.rotate(pt.rot || 0);
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, 4, 2, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (pt.type === 'sand') {
        ctx.globalAlpha = alpha * 0.9;
        ctx.fillStyle = pt.color;
        ctx.shadowColor = pt.color;
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.radius || 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
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
