/**
 * Sagittarius - The Archer (Karlstad / Cosmic Fire)
 * Sunlit Stellar Ranger wielding the Plasma Composite Bow
 */
export class SagittariusHero {
  static id = 'sagittarius';

  static drawBackAccessories(ctx, player, speedRatio, capeFlutter) {
    // Solar Quiver with Golden Arrows
    ctx.fillStyle = '#431407';
    ctx.fillRect(-16, -24, 7, 24);
    ctx.fillStyle = '#fb923c';
    ctx.fillRect(-14, -28, 4, 6);
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(-13, -31, 2, 4);
  }

  static drawHelmet(ctx, player) {
    // Solar Ranger Circlet + Cyan Tactical Monocle HUD
    ctx.fillStyle = '#c2410c';
    ctx.fillRect(-8, -33, 16, 8);
    // Feather Plume
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-12, -37, 5, 6);
    // Cyan Targeter HUD Monocle
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-5, -26, 3, 2);
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(1, -27, 5, 4);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(3, -26, 2, 2);
  }

  static drawWeapon(ctx, player) {
    // Plasma Composite Bow
    ctx.strokeStyle = '#fb923c';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(10, 0, 15, -Math.PI/2, Math.PI/2);
    ctx.stroke();
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(10, -15);
    ctx.lineTo(10, 15);
    ctx.stroke();
  }
}
