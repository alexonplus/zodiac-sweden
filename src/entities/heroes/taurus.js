/**
 * Taurus - The Bull (Falun / Earth)
 * Juggernaut wielding the Heavy Spiked Bronze Maul
 */
export class TaurusHero {
  static id = 'taurus';

  static drawBackAccessories(ctx, player, speedRatio, capeFlutter) {
    // Heavy Spiked Leather Harness & Copper Shoulders
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-18, -16, 8, 28);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(-16, -12, 4, 20);
    // Studs
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-17, -10, 2, 2);
    ctx.fillRect(-17, -2, 2, 2);
    ctx.fillRect(-17, 6, 2, 2);
  }

  static drawHelmet(ctx, player) {
    // Bronze Bull Minotaur Helm + Outward Horns + Golden Nose Ring
    ctx.fillStyle = '#b45309';
    ctx.fillRect(-9, -34, 18, 8);
    // Heavy Horns
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-16, -38, 7, 7);
    ctx.fillRect(9, -38, 7, 7);
    // Amber Eyes
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-5, -26, 4, 3);
    ctx.fillRect(1, -26, 4, 3);
    // Nose Ring
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-2, -20, 4, 3);
  }

  static drawWeapon(ctx, player) {
    // Spiked Bronze Maul / Hammer
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-2, -5, 20, 4);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(14, -14, 14, 22);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(26, -11, 4, 4); // Spikes
    ctx.fillRect(26, 1, 4, 4);
  }
}
