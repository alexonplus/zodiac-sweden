import { checkRectCollision } from '../engine/Physics.js';

export class EnemyMob {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.stunTimer = 0;
    this.time = Math.random() * 100;
    this.lastElement = null;
    this.elementTimer = 0;

    if (type === 'seagull') {
      this.w = 28; this.h = 20; this.hp = 35; this.maxHp = 35; this.dmg = 10;
    } else if (type === 'drone') {
      this.w = 34; this.h = 30; this.hp = 50; this.maxHp = 50; this.dmg = 14; this.shootTimer = 70;
    } else if (type === 'troll') {
      this.w = 44; this.h = 62; this.hp = 110; this.maxHp = 110; this.dmg = 20;
    } else if (type === 'guard') {
      this.w = 36; this.h = 58; this.hp = 90; this.maxHp = 90; this.dmg = 16;
    } else if (type === 'pirate') {
      this.w = 36; this.h = 56; this.hp = 95; this.maxHp = 95; this.dmg = 18;
    } else if (type === 'nacken') {
      this.w = 38; this.h = 58; this.hp = 85; this.maxHp = 85; this.dmg = 12; this.songTimer = 80;
    }
  }

  getNearestPlayer(p1, p2, isCoopMode) {
    if (!isCoopMode || p2.hp <= 0) return p1;
    if (p1.hp <= 0) return p2;
    const d1 = Math.abs(p1.x - this.x);
    const d2 = Math.abs(p2.x - this.x);
    return d1 < d2 ? p1 : p2;
  }

  update(p1, p2, isCoopMode, enemyProjectiles) {
    if (this.elementTimer > 0) this.elementTimer--;
    if (this.stunTimer > 0) {
      this.stunTimer--;
      return;
    }
    this.time += 0.08;
    const target = this.getNearestPlayer(p1, p2, isCoopMode);

    if (this.type === 'seagull') {
      this.vy = Math.sin(this.time) * 2;
      this.vx = Math.sign(target.x - this.x) * 2.8;
      this.x += this.vx;
      this.y += this.vy;
      if (checkRectCollision(this, target)) target.takeDamage(this.dmg);
    } else if (this.type === 'drone') {
      this.x += Math.sin(this.time * 0.5) * 2;
      this.y += Math.cos(this.time * 0.5) * 1.5;
      this.shootTimer--;
      if (this.shootTimer <= 0) {
        this.shootTimer = 90;
        enemyProjectiles.push({
          x: this.x,
          y: this.y + 10,
          vx: Math.sign(target.x - this.x) * 4.5,
          vy: 1,
          color: '#ef4444',
          damage: this.dmg,
          life: 80
        });
      }
    } else {
      this.vx = Math.sign(target.x - this.x) * 1.8;
      this.x += this.vx;
      if (checkRectCollision(this, target)) target.takeDamage(this.dmg);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.w/2, this.y + this.h/2);

    if (this.type === 'seagull') {
      ctx.fillStyle = this.stunTimer > 0 ? '#facc15' : '#f87171';
      ctx.beginPath();
      ctx.ellipse(0, 0, 14, 6, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'drone') {
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.strokeRect(-16, -12, 32, 24);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'troll') {
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-20, -28, 40, 56);
      ctx.fillStyle = '#f97316';
      ctx.fillRect(-15, -34, 8, 8);
      ctx.fillRect(7, -34, 8, 8);
    } else if (this.type === 'guard') {
      ctx.fillStyle = '#475569';
      ctx.fillRect(-16, -26, 32, 52);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-10, -20, 20, 6);
    } else if (this.type === 'pirate') {
      ctx.fillStyle = '#334155';
      ctx.fillRect(-16, -26, 32, 52);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-14, -32, 28, 8);
    } else if (this.type === 'nacken') {
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(-16, -26, 32, 52);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('🎻', -6, -2);
    }

    ctx.restore();
  }
}
