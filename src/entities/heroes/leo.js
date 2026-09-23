/**
 * Leo - The Lion (Stockholm / Sun)
 * Solar Paladin wielding the Radiant Sunblade & Golden Lion Mane
 */
export class LeoHero {
  static id = 'leo';

  static drawBackAccessories(ctx, player, speedRatio, capeFlutter) {
    // Golden Sunfire Cape & Lion Mane
    ctx.fillStyle = '#f59e0b';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(-8, -18);
    ctx.quadraticCurveTo(-26 - speedRatio * 16, -6 + capeFlutter, -32 - speedRatio * 14, 8);
    ctx.lineTo(-8, -2);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  static drawHelmet(ctx, player) {
    // Royal Solar Crown & Golden Mane
    ctx.fillStyle = '#b45309';
    ctx.fillRect(-10, -36, 20, 10);
    // Golden Crown Points
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-8, -42, 4, 8);
    ctx.fillRect(-2, -44, 4, 10);
    ctx.fillRect(4, -42, 4, 8);
    // Solar Gaze Eyes
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-5, -26, 4, 2.5);
    ctx.fillRect(1, -26, 4, 2.5);
  }

  static drawWeapon(ctx, player) {
    // Radiant Glowing Sunblade
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-2, -4, 6, 4); // Hilt
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(4, -7, 3, 11); // Crossguard
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 12;
    ctx.fillRect(7, -4, 24, 6); // Blade
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(9, -2, 20, 2); // Core
    ctx.shadowBlur = 0;
  }
}
