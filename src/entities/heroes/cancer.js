/**
 * Cancer - The Crab (Marstrand / Water)
 * Tidal Paladin wielding the Carapace Tower Shield & Harpoon
 */
export class CancerHero {
  static id = 'cancer';

  static drawBackAccessories(ctx, player, speedRatio, capeFlutter) {
    // Dorsal Carapace Shield
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(-16, -14, 6, 26);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-15, -10, 4, 18);
  }

  static drawHelmet(ctx, player) {
    // Oceanic Carapace Helm + Pincer Crests + Pearl Visor
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(-8, -33, 16, 8);
    // Top Pincer Crests
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-11, -38, 5, 7);
    ctx.fillRect(6, -38, 5, 7);
    // Aqua Visor
    ctx.fillStyle = '#7dd3fc';
    ctx.fillRect(-5, -26, 10, 3);
  }

  static drawWeapon(ctx, player) {
    // Oceanic Carapace Tower Shield & Harpoon
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(6, -12, 8, 24); // Shield
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(8, -8, 4, 16);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(2, -2, 22, 3); // Harpoon
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(22, -5, 4, 9);
  }
}
