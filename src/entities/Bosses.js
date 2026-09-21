import { sound } from '../engine/Audio.js';
import { particles } from '../engine/Particles.js';

/**
 * BossEntity manages the 4 unique multi-phase Swedish boss encounters:
 * 1. Mikanisk Kran-Kraken (Gothenburg)
 * 2. LKAB Malm-Jätte (Kiruna)
 * 3. Kungliga Ång-Gryfon (Stockholm)
 * 4. Valdemar Spöksjörövare (Visby)
 */
export class BossEntity {
  constructor(x, y, name, hp, icon) {
    this.x = x;
    this.y = y;
    this.name = name;
    this.icon = icon || '👾';
    this.hp = hp;
    this.maxHp = hp;
    this.stunTimer = 0;
    this.lastElement = null;
    this.elementTimer = 0;
    this.phase = 1;

    this.animTimer = 0;
    this.attackTimer = 80;
    this.attackState = 'idle'; // 'idle', 'windup', 'special', 'dive'
    this.specialTimer = 0;

    // Detect boss type
    if (this.name.includes('KRAN-KRAKEN') || this.name.includes('KRAKEN')) {
      this.type = 'kraken';
      this.w = 140; this.h = 160;
    } else if (this.name.includes('MALM-JÄTTE') || this.name.includes('JÄTTE')) {
      this.type = 'golem_boss';
      this.w = 130; this.h = 170;
    } else if (this.name.includes('GRYFON') || this.name.includes('GRYPHON')) {
      this.type = 'gryphon';
      this.w = 150; this.h = 140;
    } else {
      this.type = 'pirate_boss';
      this.w = 130; this.h = 160;
    }
  }

  update(enemyProjectiles, onShake) {
    this.animTimer += 0.08;
    if (this.elementTimer > 0) this.elementTimer--;
    if (this.stunTimer > 0) {
      this.stunTimer--;
      return;
    }

    // Phase 2 Enrage Trigger at 50% HP
    if (this.hp <= this.maxHp * 0.5 && this.phase === 1) {
      this.phase = 2;
      sound.playRoar();
      if (onShake) onShake(22);
      particles.createSparks(this.x + this.w/2, this.y + this.h/2, '#ef4444', 40);
    }

    if (this.specialTimer > 0) {
      this.specialTimer--;
      return;
    }

    this.attackTimer--;
    if (this.attackTimer <= 0) {
      this.attackTimer = this.phase === 2 ? 65 : 95;
      this.executeBossAttack(enemyProjectiles, onShake);
    }
  }

  executeBossAttack(enemyProjectiles, onShake) {
    sound.playWave();
    if (onShake) onShake(12);

    if (this.type === 'kraken') {
      // 1. Kraken Attack: 4-way tentacle ion burst + electric laser arc
      const count = this.phase === 2 ? 6 : 4;
      for (let i = 0; i < count; i++) {
        enemyProjectiles.push({
          x: this.x - 20,
          y: this.y + 30 + i * 20,
          vx: -5.5 - Math.random() * 2,
          vy: (i - count/2) * 1.2,
          color: this.phase === 2 ? '#f43f5e' : '#00f0ff',
          damage: 22,
          life: 90
        });
      }
      particles.createSparks(this.x, this.y + 80, '#00f0ff', 20);

    } else if (this.type === 'golem_boss') {
      // 2. Malm-Jätte Attack: Falling Ice Stalactites + Lava Ground Spikes
      if (onShake) onShake(16);
      sound.playHammer();

      // Stalactites falling from sky
      for (let i = 0; i < (this.phase === 2 ? 5 : 3); i++) {
        enemyProjectiles.push({
          x: this.x - 200 - i * 140,
          y: 60,
          vx: 0,
          vy: 8.5 + Math.random() * 3,
          color: '#67e8f9',
          damage: 26,
          life: 80
        });
      }

      // Ground shockwave
      enemyProjectiles.push({
        x: this.x - 20,
        y: 470,
        vx: -7.5,
        vy: 0,
        color: '#ea580c',
        damage: 24,
        life: 75,
        isGroundWave: true
      });

    } else if (this.type === 'gryphon') {
      // 3. Royal Gryphon: Golden Razor Feather Spread Barrage
      sound.playLaser();
      const count = this.phase === 2 ? 7 : 5;
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

    } else if (this.type === 'pirate_boss') {
      // 4. Valdemar Ghost Pirate: Cursed Ghost Cannons + Soul Vortex
      sound.playPoison();
      for (let i = 0; i < (this.phase === 2 ? 4 : 2); i++) {
        enemyProjectiles.push({
          x: this.x - 40,
          y: this.y + 30 + i * 45,
          vx: -7.0 - i * 1.2,
          vy: (Math.random() - 0.5) * 3,
          color: '#a855f7',
          damage: 25,
          life: 85
        });
      }
      particles.createSparks(this.x - 30, this.y + 50, '#a855f7', 30);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    if (this.stunTimer > 0 && Math.floor(this.stunTimer / 4) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    if (this.type === 'kraken') {
      this.drawKraken(ctx);
    } else if (this.type === 'golem_boss') {
      this.drawMalmJatte(ctx);
    } else if (this.type === 'gryphon') {
      this.drawGryphon(ctx);
    } else {
      this.drawValdemar(ctx);
    }

    ctx.restore();
  }

  // 1. Draw Mekanisk Kran-Kraken
  drawKraken(ctx) {
    const tentacleWave = Math.sin(this.animTimer * 2) * 16;
    const eyeGlow = this.phase === 2 ? '#ef4444' : '#00f0ff';

    // 4 Articulated Mechanical Crane Tentacles
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 8;
    for (let i = 0; i < 4; i++) {
      const startY = 40 + i * 28;
      const wave = Math.sin(this.animTimer * 2 + i) * 20;
      ctx.beginPath();
      ctx.moveTo(20, startY);
      ctx.quadraticCurveTo(-60 - i * 15, startY + wave, -110 - i * 10, startY + wave * 0.5);
      ctx.stroke();

      // Hydraulic Claw Tips
      ctx.fillStyle = eyeGlow;
      ctx.fillRect(-116 - i * 10, startY + wave * 0.5 - 6, 12, 12);
    }

    // Heavy Industrial Chassis Body
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(20, 20, 110, 130);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(30, 30, 90, 110);

    // Hazard Stripes
    ctx.fillStyle = '#facc15';
    for (let y = 35; y < 130; y += 20) {
      ctx.fillRect(30, y, 90, 8);
    }

    // Glowing Neon Visor / Eye Array
    ctx.fillStyle = eyeGlow;
    ctx.shadowColor = eyeGlow;
    ctx.shadowBlur = 18;
    ctx.fillRect(40, 55, 70, 18);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(60, 59, 30, 10);
    ctx.shadowBlur = 0;

    // Top Crane Tower & Warning Beacon
    ctx.fillStyle = '#64748b';
    ctx.fillRect(60, -10, 30, 30);
    ctx.fillStyle = eyeGlow;
    ctx.beginPath();
    ctx.arc(75, -12, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Draw LKAB Malm-Jätte
  drawMalmJatte(ctx) {
    const breath = Math.sin(this.animTimer * 1.5) * 4;
    const lavaCol = this.phase === 2 ? '#ef4444' : '#ea580c';

    // Massive Stone Legs
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(10, 110, 45, 60);
    ctx.fillRect(75, 110, 45, 60);
    ctx.fillStyle = lavaCol;
    ctx.fillRect(20, 130, 25, 4);
    ctx.fillRect(85, 130, 25, 4);

    // Volcanic Stone Torso with Glowing Magma Cracks
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 20 - breath, 130, 100);
    ctx.fillStyle = '#334155';
    ctx.fillRect(10, 30 - breath, 110, 80);

    // Magma Cracks & Molten Core
    ctx.fillStyle = lavaCol;
    ctx.shadowColor = lavaCol;
    ctx.shadowBlur = 15;
    ctx.fillRect(30, 50 - breath, 70, 12);
    ctx.fillRect(50, 40 - breath, 30, 40);
    ctx.shadowBlur = 0;

    // Permafrost Ice Shoulder Spikes
    ctx.fillStyle = '#67e8f9';
    ctx.beginPath();
    ctx.moveTo(-15, 20 - breath);
    ctx.lineTo(15, 0 - breath);
    ctx.lineTo(15, 40 - breath);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(145, 20 - breath);
    ctx.lineTo(115, 0 - breath);
    ctx.lineTo(115, 40 - breath);
    ctx.closePath();
    ctx.fill();

    // Head with Glowing Furnace Eyes
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(40, -15 - breath, 50, 35);
    ctx.fillStyle = lavaCol;
    ctx.fillRect(48, -5 - breath, 12, 8);
    ctx.fillRect(70, -5 - breath, 12, 8);

    // Massive Boulder Fists
    ctx.fillStyle = '#475569';
    ctx.fillRect(-25, 60, 32, 45);
    ctx.fillRect(123, 60, 32, 45);
  }

  // 3. Draw Kungliga Ång-Gryfon
  drawGryphon(ctx) {
    const wingFlap = Math.sin(this.animTimer * 4) * 25;
    const steamCol = this.phase === 2 ? '#ef4444' : '#facc15';

    // Clockwork Gold Wings (Flapping)
    ctx.save();
    ctx.translate(60, 40);
    ctx.fillStyle = '#f59e0b';
    ctx.strokeStyle = steamCol;
    ctx.lineWidth = 2;
    // Left Wing
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-80, -50 + wingFlap);
    ctx.lineTo(-60, 30 + wingFlap * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Right Wing
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(80, -50 + wingFlap);
    ctx.lineTo(60, 30 + wingFlap * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Royal Brass Body & Steam Piping
    ctx.fillStyle = '#78350f';
    ctx.fillRect(30, 30, 90, 80);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(40, 40, 70, 60);

    // Steam Boiler Gauge & Crown
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
    ctx.fillRect(55, -24, 8, 8);
    ctx.fillRect(71, -26, 8, 10);
    ctx.fillRect(87, -24, 8, 8);

    // Lion Claws
    ctx.fillStyle = '#b45309';
    ctx.fillRect(35, 110, 25, 25);
    ctx.fillRect(90, 110, 25, 25);
  }

  // 4. Draw Valdemar Spöksjörövare
  drawValdemar(ctx) {
    const floatBob = Math.sin(this.animTimer * 2) * 8;
    const ghostCol = this.phase === 2 ? '#ef4444' : '#a855f7';

    ctx.save();
    ctx.translate(0, floatBob);

    // Ghost Ship Stern Platform
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(20, 120, 90, 30);
    ctx.fillStyle = ghostCol;
    ctx.fillRect(25, 140, 80, 5);

    // Spectral Pirate Captain Body & Coat
    ctx.fillStyle = '#3b0764';
    ctx.fillRect(30, 30, 70, 90);
    ctx.fillStyle = '#581c87';
    ctx.fillRect(40, 40, 50, 70);

    // Glowing Ghost Skull Head & Cyan Eye Sockets
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(45, -10, 40, 40);
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 12;
    ctx.fillRect(52, 2, 8, 8);
    ctx.fillRect(69, 2, 8, 8);
    ctx.shadowBlur = 0;

    // Massive Pirate Tricorn Hat with Skull Badge
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(20, -22, 90, 14);
    ctx.fillRect(35, -34, 60, 14);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(60, -26, 10, 10);

    // Dual Ghost Cannons
    ctx.fillStyle = '#475569';
    ctx.fillRect(-15, 60, 45, 16);
    ctx.fillStyle = ghostCol;
    ctx.fillRect(-22, 57, 10, 22);

    // Spectral Cutlass in other hand
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(100, 30, 30, 5);
    ctx.fillRect(100, 25, 6, 15);

    ctx.restore();
  }
}
