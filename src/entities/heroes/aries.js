/**
 * Aries - The Ram (Kiruna / Fire)
 * Berserker wielding the Infernal War Axe
 */
export class AriesHero {
  static id = 'aries';

  static drawBackAccessories(ctx, player, speedRatio, capeFlutter) {
    // Molten Fire Scarf / Flame Mantle
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(-8, -16);
    ctx.quadraticCurveTo(-24 - speedRatio * 14, -6 + capeFlutter, -28 - speedRatio * 12, 6);
    ctx.lineTo(-8, -2);
    ctx.closePath();
    ctx.fill();
  }

  static drawHelmet(ctx, player) {
    // Molten Crimson Horned Helm + Large Curled Golden Ram Horns
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-8, -34, 16, 9);
    // Curled Ram Horns (Gold)
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-16, -37, 8, 6);
    ctx.fillRect(-18, -31, 5, 7);
    ctx.fillRect(8, -37, 8, 6);
    ctx.fillRect(13, -31, 5, 7);
    // Red Battle Slit Visor
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-6, -26, 12, 4);
    ctx.fillStyle = '#f87171';
    ctx.fillRect(-4, -25, 8, 2);
  }

  static drawWeapon(ctx, player) {
    // Heavy Infernal Double-Headed War Axe
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-2, -6, 22, 4); // Shaft
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(16, -16, 12, 24); // Heavy Blade
    ctx.fillStyle = '#facc15';
    ctx.fillRect(20, -12, 6, 16); // Molten Core
  }
}
