/**
 * Aquarius - The Water-Bearer (Gothenburg / Cyber)
 * Cyber Wave Hacker wielding the Ion Plasma Blaster Cannon & Cyber Drone
 */
export class AquariusHero {
  static id = 'aquarius';

  static drawBackAccessories(ctx, player, speedRatio, capeFlutter) {
    // Cyber Battery Reactor Pack & Holographic Cables
    ctx.fillStyle = '#082f49';
    ctx.fillRect(-18, -16, 9, 24);
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.fillRect(-15, -12, 3, 16);
    ctx.shadowBlur = 0;

    // Glowing Cyan Cyber Scarf Streamer
    ctx.fillStyle = 'rgba(0, 240, 255, 0.7)';
    ctx.beginPath();
    ctx.moveTo(-8, -18);
    ctx.quadraticCurveTo(-22 - speedRatio * 16, -10 + capeFlutter, -26 - speedRatio * 14, 2);
    ctx.lineTo(-8, -10);
    ctx.closePath();
    ctx.fill();
  }

  static drawHelmet(ctx, player) {
    // Neon Cyber Goggles + Circuit Trace Headband
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-8, -34, 16, 9);
    // Hologram Visor Glasses
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-7, -27, 14, 5);
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.fillRect(-6, -26, 12, 2.5);
    ctx.shadowBlur = 0;
  }

  static drawWeapon(ctx, player) {
    // Ion Plasma Blaster Cannon with Energy Coils
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, -6, 20, 8);
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.fillRect(4, -4, 11, 4);
    ctx.fillRect(20, -5, 4, 6); // Muzzle
    ctx.shadowBlur = 0;
  }
}
