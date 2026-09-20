/**
 * Pisces - The Fish (Umeå / Mystic Water)
 * Aurora Dream Siren wielding Mystic Dream Water Orbs
 */
export class PiscesHero {
  static id = 'pisces';

  static drawBackAccessories(ctx, player, speedRatio, capeFlutter) {
    // Ethereal Flowing Sea Veil
    ctx.fillStyle = 'rgba(45, 212, 191, 0.6)';
    ctx.beginPath();
    ctx.moveTo(-8, -14);
    ctx.quadraticCurveTo(-26 - speedRatio * 14, 8 + capeFlutter, -18, 26);
    ctx.lineTo(-4, 16);
    ctx.closePath();
    ctx.fill();
  }

  static drawHelmet(ctx, player) {
    // Aurora Dream Siren + Turquoise Fin Ears + Sea Pearls
    ctx.fillStyle = '#0f766e';
    ctx.fillRect(-8, -33, 16, 8);
    // Koi Fin Ears
    ctx.fillStyle = '#2dd4bf';
    ctx.fillRect(-13, -37, 5, 8);
    ctx.fillRect(8, -37, 5, 8);
    // Ethereal Sea-Foam Eyes
    ctx.fillStyle = '#ccfbf1';
    ctx.fillRect(-5, -26, 4, 2);
    ctx.fillRect(1, -26, 4, 2);
  }

  static drawWeapon(ctx, player) {
    // Mystic Dream Orbs
    const orbBob = Math.sin(player.animTimer * 4) * 3;
    ctx.fillStyle = '#2dd4bf';
    ctx.beginPath();
    ctx.arc(12, -4 + orbBob, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ccfbf1';
    ctx.beginPath();
    ctx.arc(18, 4 - orbBob, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}
