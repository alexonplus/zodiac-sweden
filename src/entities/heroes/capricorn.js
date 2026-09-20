/**
 * Capricorn - The Sea-Goat (Östersund / Frost)
 * Frost Peak Elder wielding the Glacial Great-Axe
 */
export class CapricornHero {
  static id = 'capricorn';

  static drawBackAccessories(ctx, player, speedRatio, capeFlutter) {
    // Frost Mountain Fur Mantle
    ctx.fillStyle = '#0e7490';
    ctx.fillRect(-18, -14, 8, 22);
    ctx.fillStyle = '#cffafe';
    ctx.fillRect(-20, -16, 10, 6);
  }

  static drawHelmet(ctx, player) {
    // Frost Armor + Jagged Crystalline Ice Horns + Blizzard Trim
    ctx.fillStyle = '#0e7490';
    ctx.fillRect(-8, -34, 16, 9);
    // Ice Horns
    ctx.fillStyle = '#67e8f9';
    ctx.fillRect(-14, -40, 6, 9);
    ctx.fillRect(8, -40, 6, 9);
    // White Ice Eyes
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-5, -26, 4, 2);
    ctx.fillRect(1, -26, 4, 2);
  }

  static drawWeapon(ctx, player) {
    // Glacial Halberd / Great-Axe
    ctx.fillStyle = '#164e63';
    ctx.fillRect(-2, -5, 24, 4);
    ctx.fillStyle = '#67e8f9';
    ctx.fillRect(18, -14, 12, 22);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(20, -10, 6, 14);
  }
}
