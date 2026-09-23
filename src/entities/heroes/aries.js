/**
 * Aries - The Ram (Kiruna / Fire)
 * Berserker wielding the Infernal War Axe & Molten Ram Horns
 */
export class AriesHero {
  static id = 'aries';

  static drawBackAccessories(ctx, player, speedRatio, capeFlutter) {
    // Flowing Molten Fire Mantle / Flame Cloak
    ctx.fillStyle = '#ea580c';
    ctx.shadowColor = '#ea580c';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(-8, -16);
    ctx.quadraticCurveTo(-26 - speedRatio * 16, -6 + capeFlutter, -32 - speedRatio * 14, 8);
    ctx.lineTo(-8, -2);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  static drawHelmet(ctx, player) {
    // Molten Crimson Horned Helm + Large Curled Golden Ram Horns
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-8, -34, 16, 9);

    // Curled Golden Ram Horns
    ctx.fillStyle = '#facc15';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 8;
    ctx.fillRect(-17, -38, 9, 7);
    ctx.fillRect(-19, -31, 6, 8);
    ctx.fillRect(8, -38, 9, 7);
    ctx.fillRect(13, -31, 6, 8);
    ctx.shadowBlur = 0;

    // Fiery Eye Visor
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-6, -26, 12, 4);
    ctx.fillStyle = '#f87171';
    ctx.fillRect(-4, -25, 8, 2.5);
  }

  static drawWeapon(ctx, player) {
    // Heavy Infernal Double-Headed War Axe with Glowing Molten Edge
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-2, -6, 24, 4); // Shaft
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(16, -18, 14, 28); // Heavy Blade
    ctx.fillStyle = '#facc15';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 10;
    ctx.fillRect(20, -14, 7, 20); // Molten Core
    ctx.shadowBlur = 0;
  }
}
