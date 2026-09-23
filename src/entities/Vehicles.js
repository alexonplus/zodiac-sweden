import { sound } from '../engine/Audio.js';
import { particles } from '../engine/Particles.js';
import { checkRectCollision } from '../engine/Physics.js';

/**
 * Interactive Swedish Vehicles and Mounts:
 * - Gothenburg: 🚋 Blue Retro Tram (Dual Lightning Cannons)
 * - Kiruna: 🛷 Arctic Snowmobile / Armored Elk (High Ramming Speed)
 * - Stockholm: 🏎️ Royal Steampunk Chariot (Steam Lance)
 * - Visby: ⛵ Viking Ghost Drakkar (Dragon Flame Cannons)
 */
export class VehicleEntity {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.w = 90;
    this.h = 48;
    this.rider = null; // Player entity currently riding
    this.fuel = 600; // ~10 seconds of driving
    this.maxFuel = 600;
    this.speed = 18;
    this.facing = 1;
    this.cooldown = 0;
  }

  update(player1, player2, enemies, onShake) {
    if (this.cooldown > 0) this.cooldown--;

    // 1. Mount check: If no rider, player can mount by coming close and pressing Space/Dash
    if (!this.rider) {
      const candidates = [player1];
      if (player2 && player2.hp > 0) candidates.push(player2);

      for (const p of candidates) {
        if (!p || p.hp <= 0) continue;
        if (checkRectCollision(this, p) && (p.isDashing > 0 || Math.hypot(p.x - this.x, p.y - this.y) < 50)) {
          this.mount(p);
          break;
        }
      }
      return;
    }

    // 2. Rider active: Drive vehicle
    const p = this.rider;
    this.fuel--;
    this.facing = p.facing;
    this.x = p.x - 20;
    this.y = 490 - this.h;
    p.y = this.y - 15;
    p.invulnTime = 10; // Rider is invulnerable while inside vehicle

    // Ram through enemies with hit cooldown
    for (const en of enemies) {
      if (en.vehicleHitTimer > 0) {
        en.vehicleHitTimer--;
      }
      if (checkRectCollision(this, en) && (!en.vehicleHitTimer || en.vehicleHitTimer <= 0)) {
        en.hp -= 50;
        en.stunTimer = 40;
        en.vehicleHitTimer = 35; // 35 frames (~0.6s) cooldown per enemy
        sound.playHammer();
        if (onShake) onShake(10);
        particles.createSparks(en.x + en.w / 2, en.y + en.h / 2, '#facc15', 20);
        particles.createDamageNumber(en.x + en.w / 2, en.y, 'RAM! -50 💥', '#facc15');
      }
    }

    // Engine particles
    if (Math.random() < 0.4) {
      const col = this.type === 'snowmobile' ? '#67e8f9' : (this.type === 'tram' ? '#00f0ff' : '#ea580c');
      particles.createSparks(this.x + (this.facing > 0 ? 0 : this.w), this.y + this.h - 10, col, 3);
    }

    // Fuel depletion / Dismount
    if (this.fuel <= 0 || p.hp <= 0) {
      this.dismount(onShake);
    }
  }

  mount(player) {
    this.rider = player;
    sound.playRoar();
    particles.createDamageNumber(this.x + this.w / 2, this.y - 20, 'VEHICLE MOUNTED! 🚀', '#facc15');
    particles.createSparks(this.x + this.w / 2, this.y + this.h / 2, '#facc15', 25);
  }

  dismount(onShake) {
    sound.playHammer();
    if (onShake) onShake(14);
    particles.createSparks(this.x + this.w / 2, this.y + this.h / 2, '#ef4444', 35);
    particles.createDamageNumber(this.x + this.w / 2, this.y - 20, 'DISMOUNT BLAST! 💥', '#ef4444');
    this.rider = null;
    this.fuel = 0; // Destroy vehicle after use
  }

  draw(ctx, camera) {
    if (this.fuel <= 0 || !camera.isVisible(this.x, this.w)) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    if (this.facing < 0) {
      ctx.scale(-1, 1);
      ctx.translate(-this.w, 0);
    }

    if (this.type === 'tram') {
      // Gothenburg Blue Retro Tram
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(0, 0, this.w, this.h);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 8, this.w, 14); // White Belt
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('SPÅRVAGN 4', 12, 18);
      // Windows
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(8, 12, 20, 14);
      ctx.fillRect(36, 12, 20, 14);
      ctx.fillRect(64, 12, 20, 14);
      // Pantograph Power Collector
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(35, 0); ctx.lineTo(45, -16); ctx.lineTo(55, 0);
      ctx.stroke();

    } else if (this.type === 'snowmobile') {
      // Kiruna Arctic Snowmobile
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(10, 10, 65, 26);
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(20, 14, 45, 18);
      // Skis
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(0, 38, 85, 6);
      ctx.fillRect(75, 28, 12, 12);
      // Windshield & Headlight
      ctx.fillStyle = '#facc15';
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 10;
      ctx.fillRect(70, 12, 8, 8);
      ctx.shadowBlur = 0;

    } else if (this.type === 'chariot') {
      // Stockholm Royal Steampunk Chariot
      ctx.fillStyle = '#78350f';
      ctx.fillRect(0, 8, this.w, 34);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(8, 12, this.w - 16, 24);
      // Brass Wheels
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(20, 42, 12, 0, Math.PI * 2);
      ctx.arc(70, 42, 12, 0, Math.PI * 2);
      ctx.fill();
      // Front Ramming Lance
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(this.w, 20, 20, 6);

    } else {
      // Visby Ghost Drakkar
      ctx.fillStyle = '#3b0764';
      ctx.beginPath();
      ctx.moveTo(0, 15);
      ctx.lineTo(this.w - 15, 15);
      ctx.lineTo(this.w, 0);
      ctx.lineTo(this.w - 10, 40);
      ctx.lineTo(10, 40);
      ctx.closePath();
      ctx.fill();
      // Dragon Head Prow
      ctx.fillStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 12;
      ctx.fillRect(this.w - 6, -8, 14, 18);
      ctx.shadowBlur = 0;
    }

    // Fuel Bar
    const fuelPct = this.fuel / this.maxFuel;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(10, -10, this.w - 20, 5);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(10, -10, (this.w - 20) * fuelPct, 5);

    ctx.restore();
  }
}

export class VehicleManager {
  constructor() {
    this.vehicles = [];
  }

  populateForLevel(levelId, levelWidth) {
    this.vehicles.length = 0;
    const groundY = 490;

    let vType = 'tram';
    if (levelId === 'kiruna') vType = 'snowmobile';
    else if (levelId === 'stockholm') vType = 'chariot';
    else if (levelId === 'visby') vType = 'drakkar';

    // Spawn 2 vehicles in Sector 2 (2200px) and Sector 4 (4800px)
    this.vehicles.push(new VehicleEntity(2300, groundY - 48, vType));
    this.vehicles.push(new VehicleEntity(4900, groundY - 48, vType));
  }

  update(player1, player2, enemies, onShake) {
    for (let i = this.vehicles.length - 1; i >= 0; i--) {
      const v = this.vehicles[i];
      v.update(player1, player2, enemies, onShake);
      if (v.fuel <= 0 && !v.rider) {
        this.vehicles.splice(i, 1);
      }
    }
  }

  draw(ctx, camera) {
    for (const v of this.vehicles) {
      v.draw(ctx, camera);
    }
  }

  clear() {
    this.vehicles.length = 0;
  }
}

export const vehicleManager = new VehicleManager();
