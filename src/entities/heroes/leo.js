/**
 * Leo - The Lion (Stockholm / Solar)
 * Solar Sovereign wielding the Radiant Sunblade
 */
export class LeoHero {
  static id = 'leo';

  static drawBackAccessories(ctx, player, speedRatio, capeFlutter) {
    // Royal Crimson & Gold-Edged Flowing Cape
    ctx.fillStyle = '#991b1b';
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-10, -14);
    ctx.quadraticCurveTo(-26 - speedRatio * 16, 8 + capeFlutter, -22 - speedRatio * 14, 26);
    ctx.lineTo(-6, 18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  static drawHelmet(ctx, player) {
    // Radiant Solar Sunburst Lion Mane + Gold Crown
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(-12, -37, 24, 14);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-9, -39, 18, 6);
    // Crown points
    ctx.fillRect(-7, -42, 3, 4);
    ctx.fillRect(-1, -43, 3, 5);
    ctx.fillRect(5, -42, 3, 4);
    // Feline Gaze
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-5, -26, 4, 2);
    ctx.fillRect(1, -26, 4, 2);
  }

  static drawWeapon(ctx, player) {
    // Radiant Glowing Sunblade
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-2, -3, 6, 4); // Hilt
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(4, -6, 3, 10); // Crossguard
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(7, -3, 22, 5); // Blade
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(8, -1, 20, 2); // Core
  }
}
