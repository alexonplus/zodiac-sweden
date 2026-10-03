import { BaseBoss } from './BaseBoss.js';
import { sound } from '../../engine/Audio.js';
import { particles } from '../../engine/Particles.js';

/**
 * Kungliga Ång-Gryfon: The Royal Steam & Clockwork Gryphon of Stockholm Palace.
 * Features golden razor feather barrages, steam pressure gusts, high-altitude dive attacks,
 * and crown solar flare overloads.
 */
export class GryphonBoss extends BaseBoss {
  constructor(x, y, maxHp = 950) {
    super(x, y, 'KUNGLIGA ÅNG-GRYFON', maxHp, '👑', 150, 145);
    this.type = 'gryphon';
    this.baseY = y - 40; // Flies in the air
    this.attackPattern = 0;
    this.isDiving = false;
  }

  update(arg1, arg2, arg3, arg4, arg5, arg6) {
    if (!this.updateBase(arg1, arg2, arg3, arg4, arg5, arg6)) return;

    let enemyProjectiles, onShake;
    if (Array.isArray(arg1)) {
      enemyProjectiles = arg1;
      onShake = arg2;
    } else {
      enemyProjectiles = arg4;
      onShake = arg6;
    }

    // Aerial Flight Swoop
    if (!this.isDiving) {
      this.y = this.baseY + Math.sin(this.animTimer * 3.0) * 25;

      if (this.targetPlayer) {
        const dist = Math.abs(this.targetPlayer.x - (this.x + this.w / 2));
        const spd = this.phase === 2 ? 3.5 : 2.2;
        if (dist > 320) {
          this.vx = this.facing * spd;
        } else if (dist < 150) {
          this.vx = -this.facing * spd;
        } else {
          this.vx *= 0.94;
        }
      }
    }

    this.x += this.vx;
    if (this.x < this.arenaMinX) this.x = this.arenaMinX;
    if (this.x + this.w > this.arenaMaxX) this.x = this.arenaMaxX - this.w;

    if (this.attackTimer <= 0) {
      this.attackTimer = this.phase === 2 ? 50 : 75;
      this.executeAttack(enemyProjectiles, onShake);
    }
  }

  executeAttack(enemyProjectiles, onShake) {
    this.attackPattern = (this.attackPattern + 1) % 3;
    this.telegraphTimer = 22;

    if (this.attackPattern === 0) {
      // Attack 1: Targeted 5-7 Razor Golden Feather Fan
      sound.playLaser();
      if (onShake) onShake(10);
      particles.createSparks(this.x + (this.facing > 0 ? this.w : 0), this.y + 40, '#facc15', 30);

      const count = this.phase === 2 ? 7 : 5;
      for (let i = 0; i < count; i++) {
        const angle = -0.45 + (i / (count - 1)) * 0.9;
        enemyProjectiles.push({
          x: this.x + (this.facing > 0 ? this.w + 10 : -10),
          y: this.y + 40,
          vx: this.facing * Math.cos(angle) * (this.phase === 2 ? 9.5 : 8.0),
          vy: Math.sin(angle) * 8.0,
          color: '#fbbf24',
          damage: 22,
          life: 80
        });
      }
    } else if (this.attackPattern === 1) {
      // Attack 2: High-Pressure Steam Jet Ground Blast
      sound.playWave();
      if (onShake) onShake(16);
      particles.createWindGale(this.x + this.w / 2, this.y + this.h, this.facing, 10);

      enemyProjectiles.push({
        x: this.x + (this.facing > 0 ? this.w : -20),
        y: 470,
        vx: this.facing * (this.phase === 2 ? 9.0 : 7.5),
        vy: 0,
        color: '#fde047',
        damage: 26,
        life: 80,
        isGroundWave: true
      });
    } else {
      // Attack 3: Supersonic Aerial Dive Bomb Strike!
      sound.playUlt();
      const diveTargetX = this.targetPlayer ? this.targetPlayer.x : this.x + this.facing * 250;
      this.addTelegraphZone(diveTargetX - 40, 200, 80, 280, 24, '#fbbf24', () => {
        sound.playHammer();
        if (onShake) onShake(20);
        this.isDiving = true;
        this.vx = this.facing * 9.0;
        this.vy = 8.0;

        setTimeout(() => {
          this.vy = -6.0;
          setTimeout(() => {
            this.isDiving = false;
            this.vx = 0;
            this.vy = 0;
          }, 350);
        }, 300);

        particles.createFlame(diveTargetX, 460, 25);
        particles.createSparks(diveTargetX, 460, '#facc15', 30);
      });
    }
  }

  draw(ctx) {
    this.drawTelegraph(ctx);

    ctx.save();
    ctx.translate(this.x, this.y);

    if (this.stunTimer > 0 && Math.floor(this.stunTimer / 4) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    const wingFlap = Math.sin(this.animTimer * 4.5) * 28;
    const steamCol = this.phase === 2 ? '#ef4444' : '#facc15';

    // Clockwork Gold Wings (Flapping)
    ctx.save();
    ctx.translate(60, 40);
    ctx.fillStyle = '#f59e0b';
    ctx.strokeStyle = steamCol;
    ctx.lineWidth = 2.5;

    // Left Wing
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-85, -55 + wingFlap);
    ctx.lineTo(-65, 30 + wingFlap * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right Wing
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(85, -55 + wingFlap);
    ctx.lineTo(65, 30 + wingFlap * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Royal Brass Body & Steam Piping
    ctx.fillStyle = '#78350f';
    ctx.fillRect(30, 30, 90, 80);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(40, 40, 70, 60);

    // Steam Boiler Gauge & Core
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(75, 70, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = steamCol;
    ctx.beginPath();
    ctx.arc(75, 70, 10, 0, Math.PI * 2);
    ctx.fill();

    // Eagle Gryphon Beak Head & Crown
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(45, -5, 60, 35);
    ctx.fillStyle = '#b45309'; // Beak
    ctx.beginPath();
    ctx.moveTo(45, 10);
    ctx.lineTo(20, 20);
    ctx.lineTo(45, 25);
    ctx.closePath();
    ctx.fill();

    // Crown
    ctx.fillStyle = '#facc15';
    ctx.fillRect(50, -18, 50, 14);
    ctx.fillRect(55, -25, 8, 9);
    ctx.fillRect(71, -28, 8, 12);
    ctx.fillRect(87, -25, 8, 9);

    // Lion Claws
    ctx.fillStyle = '#b45309';
    ctx.fillRect(35, 110, 25, 25);
    ctx.fillRect(90, 110, 25, 25);

    ctx.restore();
  }
}
