/**
 * Virgo - The Maiden (Uppsala / Nature)
 * Ancient Woods Huntress wielding the Verdant Longbow & Sylvan Foliage
 */
export class VirgoHero {
  static id = 'virgo';

  static drawAura(ctx, player) {
    const t = player.animTimer || 0;
    ctx.save();
    // Flora Bloom Ring
    ctx.strokeStyle = 'rgba(74, 222, 128, 0.45)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(0, 26, 20 + Math.sin(t * 2) * 3, 5, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Floating Emerald Leaf Petals
    for (let i = 0; i < 3; i++) {
      const angle = t * 2.5 + (i * Math.PI * 2) / 3;
      const rx = Math.cos(angle) * 17;
      const ry = 10 + Math.sin(angle) * 10;
      ctx.fillStyle = '#86efac';
      ctx.fillRect(rx - 1, ry - 1, 2.5, 2.5);
    }
    ctx.restore();
  }

  static drawBackAccessories(ctx, player, speedRatio, capeFlutter) {
    // Living Leaf-Woven Sylvan Ranger Cloak
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.moveTo(-7, -16);
    ctx.quadraticCurveTo(-24 - speedRatio * 16, -6 + capeFlutter, -30 - speedRatio * 14, 10);
    ctx.lineTo(-20 - speedRatio * 10, 14);
    ctx.quadraticCurveTo(-14 - speedRatio * 8, 2 + capeFlutter, -7, -4);
    ctx.closePath();
    ctx.fill();

    // Leaf Edges
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(-22 - speedRatio * 10, 6, 4, 4);
    ctx.fillRect(-18 - speedRatio * 8, 10, 4, 4);
  }

  static drawShoulders(ctx, player) {
    // Curled Leaf & Vine Pauldrons - Organic leaf shape
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.ellipse(-13, -15, 6.5, 4.5, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(13, -15, 6.5, 4.5, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Leaf Vein Highlights
    ctx.fillStyle = '#86efac';
    ctx.beginPath();
    ctx.ellipse(-13, -16, 4, 1.5, -0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(13, -16, 4, 1.5, 0.25, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawTorso(ctx, player) {
    // Forest-Green Leather Brigandine - Natural athletic silhouette
    ctx.fillStyle = '#064e3b';
    ctx.beginPath();
    ctx.moveTo(-11, -17);
    ctx.quadraticCurveTo(-12, -8, -8, 2);
    ctx.quadraticCurveTo(-9, 5, -8, 8);
    ctx.lineTo(8, 8);
    ctx.quadraticCurveTo(9, 5, 8, 2);
    ctx.quadraticCurveTo(12, -8, 11, -17);
    ctx.quadraticCurveTo(0, -15, -11, -17);
    ctx.closePath();
    ctx.fill();

    // Curved Sylvan Breastplate
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.moveTo(-10, -15);
    ctx.quadraticCurveTo(-11, -7, -7, 0);
    ctx.lineTo(7, 0);
    ctx.quadraticCurveTo(11, -7, 10, -15);
    ctx.quadraticCurveTo(0, -13, -10, -15);
    ctx.closePath();
    ctx.fill();

    // Inner plate
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.ellipse(0, -6, 6, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Flora Brooch & Virgo Sigil
    ctx.fillStyle = '#4ade80';
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, -4, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('♍', 0, -1);
    ctx.textAlign = 'left';

    // Woven Vine Belt - Curved
    ctx.fillStyle = '#14532d';
    ctx.beginPath();
    ctx.moveTo(-9, 2);
    ctx.quadraticCurveTo(0, 4, 9, 2);
    ctx.lineTo(9, 7);
    ctx.quadraticCurveTo(0, 9, -9, 7);
    ctx.closePath();
    ctx.fill();

    // Blossom Buckle
    ctx.fillStyle = '#86efac';
    ctx.beginPath();
    ctx.ellipse(0, 5, 3.8, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawHead(ctx, player) {
    const t = player.animTimer || 0;
    const isBlink = Math.floor(t * 1.5) % 17 === 0;
    const hairSway = Math.sin(t * 3.5) * 3;

    // 1. Long Cascading Emerald Hair (Flowing past shoulders)
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.moveTo(-6, -26);
    ctx.quadraticCurveTo(-16 + hairSway, -18, -20 + hairSway * 1.3, -4);
    ctx.lineTo(-15 + hairSway * 1.3, 0);
    ctx.quadraticCurveTo(-11 + hairSway, -14, -4, -18);
    ctx.closePath();
    ctx.fill();

    // Flowers / Yellow Buttercups in Hair
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(-14 + hairSway * 0.8, -13, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-16 + hairSway * 1.1, -5, 2, 0, Math.PI * 2);
    ctx.fill();

    // 2. Neck
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.moveTo(-3, -19);
    ctx.lineTo(3, -19);
    ctx.lineTo(4, -15);
    ctx.lineTo(-4, -15);
    ctx.closePath();
    ctx.fill();

    // 3. Face (Fair Sylvan Complexion) - Contoured human head silhouette
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(-6, -28);
    ctx.quadraticCurveTo(0, -32, 6, -28);
    ctx.quadraticCurveTo(6.5, -23, 4.5, -18.5);
    ctx.quadraticCurveTo(0, -17, -4.5, -18.5);
    ctx.quadraticCurveTo(-6.5, -23, -6, -28);
    ctx.closePath();
    ctx.fill();

    // Cheeks Blush & Woodland Elf Shading
    ctx.fillStyle = 'rgba(244, 63, 94, 0.35)';
    ctx.beginPath();
    ctx.ellipse(-4, -22.5, 2, 1.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(4, -22.5, 2, 1.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4. Sharp Huntress Eyes with Long Eyelashes - Almond shaped
    if (isBlink) {
      ctx.strokeStyle = '#064e3b';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(-2.5, -24, 2, 0.2, Math.PI - 0.2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(2.5, -24, 2, 0.2, Math.PI - 0.2);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(-2.5, -24, 2.4, 1.7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(2.5, -24, 2.4, 1.7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Emerald Pupil
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(-2.5, -24, 1.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(2.5, -24, 1.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#86efac';
      ctx.beginPath();
      ctx.arc(-2.8, -24.4, 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(2.2, -24.4, 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Eyelash Rim
      ctx.strokeStyle = '#064e3b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(-2.5, -24.5, 2.4, Math.PI, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(2.5, -24.5, 2.4, Math.PI, 0);
      ctx.stroke();
    }

    // Lips & Cupid's Bow
    ctx.fillStyle = '#fb7185';
    ctx.beginPath();
    ctx.arc(0, -20, 1.8, 0, Math.PI);
    ctx.fill();

    // Pearl Earring Drops
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(-7, -23, 1.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(7, -23, 1.3, 0, Math.PI * 2);
    ctx.fill();

    // 5. Emerald Side Bangs Framing Face - Natural curves
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.moveTo(-6, -30);
    ctx.quadraticCurveTo(-4, -23, -2, -27);
    ctx.quadraticCurveTo(2, -23, 6, -30);
    ctx.quadraticCurveTo(0, -33, -6, -30);
    ctx.closePath();
    ctx.fill();

    // 6. Delicate Golden Antler Circlet - Curved
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(-6.5, -31);
    ctx.quadraticCurveTo(0, -33, 6.5, -31);
    ctx.lineTo(6.5, -29);
    ctx.quadraticCurveTo(0, -31, -6.5, -29);
    ctx.closePath();
    ctx.fill();

    // Delicate Antlers - Curved
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.moveTo(-6, -31);
    ctx.quadraticCurveTo(-9, -35, -7, -39);
    ctx.lineTo(-5, -31);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(6, -31);
    ctx.quadraticCurveTo(9, -35, 7, -39);
    ctx.lineTo(5, -31);
    ctx.closePath();
    ctx.fill();
  }

  static drawOffHand(ctx, player) {
    const t = player.animTimer || 0;
    // Sylvan Briar Ward Shield & Floating Forest Wisp Spirit
    ctx.save();
    ctx.translate(-2, 11);

    // Living Bark Buckler
    ctx.fillStyle = '#27272a';
    ctx.beginPath();
    ctx.arc(0, 0, 8.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fill();

    // Blooming Lingonberry Flower Core
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(-2, -2, 4, 4);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-1, -1, 2, 2);

    // Orbiting Forest Wisp
    const wispAngle = t * 3.5;
    const wx = Math.cos(wispAngle) * 12;
    const wy = Math.sin(wispAngle) * 10 - 4;
    ctx.fillStyle = '#86efac';
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(wx, wy, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(wx, wy, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  static drawWeapon(ctx, player) {
    // Intricately Curved Verdant Recurve Bow strung with Glowing Vine
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(10, -2, 16, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#15803d';
    ctx.stroke();

    // Bowstring
    ctx.beginPath();
    ctx.moveTo(15, -14);
    ctx.lineTo(15, 10);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#86efac';
    ctx.stroke();

    // Nocked Thorn Arrow
    ctx.fillStyle = '#fde047';
    ctx.fillRect(4, -3, 18, 2);
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(20, -4, 4, 4); // Arrowhead
  }
}
