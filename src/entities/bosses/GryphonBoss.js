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
  }

  update(enemyProjectiles, onShake) {
    if (!this.updateBase(enemyProjectiles, onShake)) return;

    if (this.attackTimer <= 0) {
      this.attackTimer = this.phase === 2 ? 55 : 85;
      this.executeAttack(enemyProjectiles, onShake);
    }
  }

  executeAttack(enemyProjectiles, onShake) {
    sound.playLaser();
    if (onShake) onShake(12);
    this.telegraphTimer = 25;

    if (this.phase === 1) {
      // 5-Way Razor Feather Spread
      const count = 5;
      for (let i = 0; i < count; i++) {
        const angle = -0.4 + (i / (count - 1)) * 0.8;
        enemyProjectiles.push({
          x: this.x - 30,
          y: this.y + 40,
          vx: Math.cos(Math.PI - angle) * 8.5,
          vy: Math.sin(angle) * 8.5,
          color: '#facc15',
          damage: 20,
          life: 75
        });
      }
      particles.createSparks(this.x - 20, this.y + 40, '#facc15', 25);
    } else {
      // Phase 2: Royal Overdrive! 9-Way Feather Fan + Homing Golden Clockwork Gears
      sound.playUlt();
      const count = 9;
      for (let i = 0; i < count; i++) {
        const angle = -0.6 + (i / (count - 1)) * 1.2;
        enemyProjectiles.push({
          x: this.x - 30,
          y: this.y + 35,
          vx: Math.cos(Math.PI - angle) * 9.5,
          vy: Math.sin(angle) * 9.5,
          color: '#fbbf24',
          damage: 25,
          life: 80
        });
      }

      // Fast Steam Jet Across the Ground
      enemyProjectiles.push({
        x: this.x - 40,
        y: 470,
        vx: -8.5,
        vy: 0,
        color: '#fde047',
        damage: 28,
        life: 75,
        isGroundWave: true
      });

      particles.createSparks(this.x - 20, this.y + 40, '#fbbf24', 40);
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
