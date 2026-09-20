/**
 * Aquarius - The Water-Bearer (Gothenburg / Cyber)
 * Cyber Wave Hacker wielding the Ion Plasma Blaster Cannon
 */
export class AquariusHero {
  static id = 'aquarius';

  static drawBackAccessories(ctx, player, speedRatio, capeFlutter) {
    // Cyber Battery Pack & Conduit Cables
    ctx.fillStyle = '#082f49';
    ctx.fillRect(-16, -16, 7, 24);
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(-14, -12, 3, 16);
  }

  static drawHelmet(ctx, player) {
    // Neon Cyber Goggles + Circuit Trace Headband
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-8, -33, 16, 8);
    // Hologram Visor Glasses
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-7, -27, 14, 5);
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(-6, -26, 12, 2);
  }

  static drawWeapon(ctx, player) {
    // Ion Plasma Blaster Cannon
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, -5, 18, 7);
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(4, -3, 10, 3);
    ctx.fillRect(18, -4, 4, 5); // Muzzle
  }
}
