/**
 * Libra - The Scales (Lund / Astral)
 * Astral Cosmos Arbiter wielding the Cosmic Gravity Staff
 */
export class LibraHero {
  static id = 'libra';

  static drawBackAccessories(ctx, player, speedRatio, capeFlutter) {
    // Cosmic Starlight Mantle
    ctx.fillStyle = '#312e81';
    ctx.strokeStyle = '#818cf8';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-8, -16);
    ctx.quadraticCurveTo(-24 - speedRatio * 12, 6 + capeFlutter, -18, 24);
    ctx.lineTo(-4, 16);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  static drawHelmet(ctx, player) {
    // Astral Cowl + Floating Scale Crest + Starry Blindfold
    ctx.fillStyle = '#4338ca';
    ctx.fillRect(-8, -34, 16, 9);
    // Mini Scale Horns
    ctx.fillStyle = '#c7d2fe';
    ctx.fillRect(-11, -38, 4, 6);
    ctx.fillRect(7, -38, 4, 6);
    // Star Blindfold
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(-6, -26, 12, 4);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-4, -25, 3, 2);
    ctx.fillRect(1, -25, 3, 2);
  }

  static drawWeapon(ctx, player) {
    // Gravity Staff & Orbiting Astral Orbs
    ctx.fillStyle = '#4f46e5';
    ctx.fillRect(-2, -4, 24, 3);
    ctx.fillStyle = '#818cf8';
    ctx.fillRect(20, -7, 6, 9);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(22, -5, 3, 5);
  }
}
