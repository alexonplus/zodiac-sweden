/**
 * Scorpio - The Scorpion (Visby / Poison)
 * Toxic Shadow Stalker wielding Dual Venom Daggers & Articulated Stinger
 */
export class ScorpioHero {
  static id = 'scorpio';

  static drawBackAccessories(ctx, player, speedRatio, capeFlutter) {
    // Articulated 5-Segment Scorpion Stinger Tail
    const tailWhip = Math.sin(player.animTimer * 2.5) * 5;
    ctx.strokeStyle = '#7e22ce';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-8, 6);
    ctx.quadraticCurveTo(-26 + tailWhip, -10, -18, -32);
    ctx.lineTo(-4, -36);
    ctx.stroke();

    // Glowing Poison Stinger Barb
    ctx.fillStyle = '#22c55e';
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(-4, -36);
    ctx.lineTo(4, -39);
    ctx.lineTo(-2, -32);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // Shadow Assassin Scarf
    ctx.fillStyle = 'rgba(88, 28, 135, 0.8)';
    ctx.beginPath();
    ctx.moveTo(-6, -18);
    ctx.quadraticCurveTo(-20 - speedRatio * 12, -8 + capeFlutter, -24 - speedRatio * 10, 4);
    ctx.lineTo(-6, -10);
    ctx.closePath();
    ctx.fill();
  }

  static drawHelmet(ctx, player) {
    // Obsidian Assassin Cowl + Venom Visor
    ctx.fillStyle = '#581c87';
    ctx.fillRect(-9, -35, 18, 11);

    // Glowing Toxic Green Gaze
    ctx.fillStyle = '#22c55e';
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 8;
    ctx.fillRect(-5, -26, 4, 2.5);
    ctx.fillRect(1, -26, 4, 2.5);
    ctx.shadowBlur = 0;

    // Triangular Filter Mask
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(-4, -22, 8, 4);
  }

  static drawWeapon(ctx, player) {
    // Dual Venom Daggers with Glowing Poison Tips
    ctx.fillStyle = '#581c87';
    ctx.fillRect(-2, -5, 6, 4);
    ctx.fillStyle = '#c084fc';
    ctx.fillRect(4, -5, 15, 4);
    ctx.fillStyle = '#22c55e';
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 10;
    ctx.fillRect(17, -4, 5, 2.5); // Poison Tip
    ctx.shadowBlur = 0;
  }
}
