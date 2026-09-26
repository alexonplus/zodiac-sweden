import { sound } from '../engine/Audio.js';
import { particles } from '../engine/Particles.js';

/**
 * Interactive Moving and Floating Platforms:
 * - Gothenburg: ⛴️ Electric Ferry Barges & Floating Shipping Crates (Horizontally oscillating)
 * - Kiruna: 🛗 LKAB Subterranean Mining Elevators (Vertically oscillating over deep chasms)
 * - Stockholm: ⚙️ Royal Brass Clockwork Gear Lifts (Elliptical & horizontal motion)
 * - Visby: 🛶 Viking Drakkar Wooden Rafts (Bobbing and cruising across sea trenches)
 */
export class MovingPlatformEntity {
  constructor(config) {
    this.startX = config.x;
    this.startY = config.y;
    this.x = config.x;
    this.y = config.y;
    this.w = config.w || 180;
    this.h = config.h || 24;
    this.rangeX = config.rangeX || 0;
    this.rangeY = config.rangeY || 0;
    this.speed = config.speed || 0.02;
    this.phase = config.phase || 0;
    this.type = config.type || 'ferry'; // 'ferry', 'lift', 'gear', 'raft'
    this.color = config.color || '#00f0ff';
    this.timer = this.phase;
    this.vx = 0;
    this.vy = 0;
  }

  update() {
    this.timer += this.speed;
    const prevX = this.x;
    const prevY = this.y;

    if (this.rangeX !== 0) {
      this.x = this.startX + Math.sin(this.timer) * this.rangeX;
    }
    if (this.rangeY !== 0) {
      this.y = this.startY + Math.sin(this.timer) * this.rangeY;
    }

    this.vx = this.x - prevX;
    this.vy = this.y - prevY;

    // Subtle engine/water particles under moving platforms
    if (Math.random() < 0.25) {
      if (this.type === 'ferry' || this.type === 'raft') {
        particles.createSparks(this.x + this.w / 2 + (Math.random() - 0.5) * (this.w * 0.7), this.y + this.h, this.color, 2);
      }
    }
  }

  draw(ctx, camera) {
    if (!camera.isVisible(this.x, this.w)) return;

    ctx.save();
    ctx.translate(this.x, this.y);

    if (this.type === 'ferry') {
      // Gothenburg Blue/Yellow Electric Harbor Ferry Barge
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 4, this.w, this.h);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(4, 8, this.w - 8, this.h - 8);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(0, 0, this.w, 4); // Yellow safety rail
      // Electric Neon Glow
      ctx.fillStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 8;
      ctx.fillRect(8, this.h - 4, this.w - 16, 2);
      ctx.shadowBlur = 0;
      // Stanchions / Bollards
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(6, -6, 6, 8);
      ctx.fillRect(this.w - 12, -6, 6, 8);

    } else if (this.type === 'lift') {
      // Kiruna Arctic Mining Ore Elevator
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, this.w, this.h);
      ctx.fillStyle = '#f97316';
      ctx.fillRect(4, 4, this.w - 8, 4);
      // Steel Grating
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      for (let gx = 8; gx < this.w - 8; gx += 16) {
        ctx.strokeRect(gx, 8, 12, this.h - 10);
      }
      // Suspension Cables
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(12, 0); ctx.lineTo(12, -80);
      ctx.moveTo(this.w - 12, 0); ctx.lineTo(this.w - 12, -80);
      ctx.stroke();

    } else if (this.type === 'gear') {
      // Stockholm Steampunk Brass Clockwork Platform
      ctx.fillStyle = '#78350f';
      ctx.fillRect(0, 0, this.w, this.h);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(6, 4, this.w - 12, this.h - 8);
      // Brass Rivets & Cog Teeth
      ctx.fillStyle = '#facc15';
      for (let cx = 4; cx < this.w; cx += 22) {
        ctx.fillRect(cx, -3, 8, 4);
        ctx.fillRect(cx, this.h - 1, 8, 4);
      }

    } else {
      // Visby Weathered Oak Viking Longboat Raft
      ctx.fillStyle = '#451a03';
      ctx.fillRect(0, 0, this.w, this.h);
      ctx.fillStyle = '#78350f';
      for (let px = 4; px < this.w; px += 26) {
        ctx.fillRect(px, 3, 22, this.h - 6);
      }
      // Rune carving glow
      ctx.fillStyle = '#a855f7';
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 6;
      ctx.fillRect(16, this.h / 2 - 2, this.w - 32, 3);
      ctx.shadowBlur = 0;
    }

    ctx.restore();
  }
}

export class MovingPlatformManager {
  constructor() {
    this.platforms = [];
  }

  populateForLevel(levelData) {
    this.platforms.length = 0;
    if (!levelData || !levelData.movingPlatforms) return;

    for (const cfg of levelData.movingPlatforms) {
      this.platforms.push(new MovingPlatformEntity(cfg));
    }
  }

  update() {
    for (const p of this.platforms) {
      p.update();
    }
  }

  draw(ctx, camera) {
    for (const p of this.platforms) {
      p.draw(ctx, camera);
    }
  }

  clear() {
    this.platforms.length = 0;
  }
}

export const movingPlatformManager = new MovingPlatformManager();
