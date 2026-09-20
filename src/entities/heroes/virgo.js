/**
 * Virgo - The Maiden (Uppsala / Nature)
 * Ancient Woods Huntress wielding the Verdant Longbow
 */
export class VirgoHero {
  static id = 'virgo';

  static drawBackAccessories(ctx, player, speedRatio, capeFlutter) {
    // Forest Leaf Mantle
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.moveTo(-8, -14);
    ctx.quadraticCurveTo(-22 - speedRatio * 12, 4 + capeFlutter, -16, 22);
    ctx.lineTo(-5, 14);
    ctx.closePath();
    ctx.fill();
  }

  static drawHelmet(ctx, player) {
    // Forest Elven Hood + Ivy Laurel Tiara + Jade Gem
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(-8, -34, 16, 9);
    // Laurel Leaves
    ctx.fillStyle = '#86efac';
    ctx.fillRect(-10, -36, 4, 4);
    ctx.fillRect(6, -36, 4, 4);
    // Jade Crystal Eyes
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(-5, -26, 4, 2);
    ctx.fillRect(1, -26, 4, 2);
  }

  static drawWeapon(ctx, player) {
    // Verdant Longbow & Arrow
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(8, 0, 14, -Math.PI/2, Math.PI/2);
    ctx.stroke();
    ctx.strokeStyle = '#86efac';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(8, -14);
    ctx.lineTo(8, 14);
    ctx.stroke();
    // Notched Arrow
    ctx.fillStyle = '#facc15';
    ctx.fillRect(2, -1, 16, 2);
  }
}
