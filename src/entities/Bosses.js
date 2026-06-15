import { sound } from '../engine/Audio.js';

export class BossEntity {
  constructor(x, y, name, hp, icon) {
    this.x = x;
    this.y = y;
    this.w = 110;
    this.h = 150;
    this.name = name;
    this.icon = icon || '👾';
    this.hp = hp;
    this.maxHp = hp;
    this.stunTimer = 0;
    this.attackTimer = 110;
    this.lastElement = null;
    this.elementTimer = 0;
    this.phase = 1;
  }

  update(enemyProjectiles, onShake) {
    if (this.elementTimer > 0) this.elementTimer--;
    if (this.stunTimer > 0) {
      this.stunTimer--;
      return;
    }
    if (this.hp <= this.maxHp * 0.5 && this.phase === 1) {
      this.phase = 2;
      sound.playRoar();
      if (onShake) onShake(18);
    }

    this.attackTimer--;
    if (this.attackTimer <= 0) {
      this.attackTimer = this.phase === 2 ? 80 : 120;
      this.attack(enemyProjectiles, onShake);
    }
  }

  attack(enemyProjectiles, onShake) {
    sound.playWave();
    if (onShake) onShake(10);
    const count = this.phase === 2 ? 4 : 2;
    for (let i = -count; i <= count; i++) {
      enemyProjectiles.push({
        x: this.x - 20,
        y: 450,
        vx: -4.5 + i * 0.8,
        vy: -2 - Math.abs(i),
        color: this.phase === 2 ? '#f97316' : '#f43f5e',
        damage: 20,
        life: 85
      });
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = this.phase === 2 ? '#f97316' : '#f43f5e';
    ctx.lineWidth = 4;
    ctx.shadowColor = this.phase === 2 ? '#f97316' : '#f43f5e';
    ctx.shadowBlur = 18;
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.strokeRect(0, 0, this.w, this.h);

    ctx.fillStyle = this.phase === 2 ? '#f97316' : '#f43f5e';
    ctx.beginPath();
    ctx.arc(this.w/2, this.h/2, 28, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.fillRect(0, -20, this.w, 10);
    ctx.fillStyle = this.phase === 2 ? '#f97316' : '#ef4444';
    ctx.fillRect(0, -20, (this.hp / this.maxHp) * this.w, 10);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px monospace';
    ctx.fillText(this.name, 0, -24);
    ctx.restore();
  }
}
