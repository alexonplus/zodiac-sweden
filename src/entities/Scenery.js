/**
 * SceneryManager renders Swedish architectural landmarks, neon signs,
 * streetlights, flags, and environmental details across all 5 sectors.
 */
export class SceneryManager {
  draw(ctx, levelId, levelWidth, camera, gameTime) {
    const groundY = 490;

    if (levelId === 'goteborg') {
      this.drawGoteborgScenery(ctx, levelWidth, camera, gameTime, groundY);
    } else if (levelId === 'kiruna') {
      this.drawKirunaScenery(ctx, levelWidth, camera, gameTime, groundY);
    } else if (levelId === 'stockholm') {
      this.drawStockholmScenery(ctx, levelWidth, camera, gameTime, groundY);
    } else if (levelId === 'visby') {
      this.drawVisbyScenery(ctx, levelWidth, camera, gameTime, groundY);
    }
  }

  /* ================= 1. GÖTEBORG: CYBER HARBOR & CRANES ================= */
  drawGoteborgScenery(ctx, levelWidth, camera, gameTime, groundY) {
    // 1. Massive Eriksberg Harbor Cranes in Background
    const cranePositions = [800, 2100, 3400, 4700];
    for (const cx of cranePositions) {
      if (camera.isVisible(cx, 180)) {
        ctx.save();
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 4;
        // Gantry Legs
        ctx.beginPath();
        ctx.moveTo(cx, groundY);
        ctx.lineTo(cx + 40, 160);
        ctx.lineTo(cx + 140, 160);
        ctx.lineTo(cx + 180, groundY);
        ctx.stroke();

        // Crossbeams
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#d97706';
        ctx.strokeRect(cx + 20, 150, 160, 20);
        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('ERIKSBERG MEK.', cx + 35, 164);

        // Warning Beacon Light
        const beaconGlow = Math.sin(gameTime * 0.1) > 0 ? '#ef4444' : '#7f1d1d';
        ctx.fillStyle = beaconGlow;
        ctx.beginPath();
        ctx.arc(cx + 40, 145, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // 2. Cyber Neon Signs on Buildings
    const neonSigns = [
      { x: 450, text: 'NEON GÖTEBORG', col: '#00f0ff' },
      { x: 1650, text: 'LINDHOLMEN TECH 2045', col: '#38bdf8' },
      { x: 2850, text: 'VOLVO CYBERNETIX', col: '#facc15' },
      { x: 4150, text: 'SKF KULLAGER AB', col: '#4ade80' }
    ];
    for (const sign of neonSigns) {
      if (camera.isVisible(sign.x, 140)) {
        ctx.save();
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(sign.x - 10, 220, 160, 28);
        ctx.strokeStyle = sign.col;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = sign.col;
        ctx.shadowBlur = 10;
        ctx.strokeRect(sign.x - 10, 220, 160, 28);
        ctx.fillStyle = sign.col;
        ctx.font = 'bold 11px "Orbitron", monospace';
        ctx.fillText(sign.text, sign.x, 238);
        ctx.restore();
      }
    }

    // 3. Pier Lampposts with Downward Light Cones
    for (let lx = 200; lx < levelWidth; lx += 450) {
      if (camera.isVisible(lx, 40)) {
        ctx.save();
        ctx.fillStyle = '#334155';
        ctx.fillRect(lx, groundY - 120, 6, 120);
        ctx.fillRect(lx - 12, groundY - 126, 30, 8);
        // Cyan Light Cone
        ctx.fillStyle = 'rgba(0, 240, 255, 0.08)';
        ctx.beginPath();
        ctx.moveTo(lx + 3, groundY - 118);
        ctx.lineTo(lx - 45, groundY);
        ctx.lineTo(lx + 51, groundY);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }
  }

  /* ================= 2. KIRUNA: ARCTIC MINES & FALUN COTTAGES ================= */
  drawKirunaScenery(ctx, levelWidth, camera, gameTime, groundY) {
    // 1. Traditional Swedish Red Falun Cottages (Röda Stugor)
    const housePositions = [600, 1850, 3100, 4400];
    for (const hx of housePositions) {
      if (camera.isVisible(hx, 160)) {
        ctx.save();
        // Red Falun Timber Body
        ctx.fillStyle = '#7f1d1d';
        ctx.fillRect(hx, groundY - 110, 140, 110);
        // White Corner Boards & Trims
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(hx, groundY - 110, 6, 110);
        ctx.fillRect(hx + 134, groundY - 110, 6, 110);

        // Snow-Covered Gable Roof
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(hx - 15, groundY - 105);
        ctx.lineTo(hx + 70, groundY - 165);
        ctx.lineTo(hx + 155, groundY - 105);
        ctx.closePath();
        ctx.fill();

        // Cozy Glowing Windows
        ctx.fillStyle = '#facc15';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 12;
        ctx.fillRect(hx + 25, groundY - 75, 28, 30);
        ctx.fillRect(hx + 85, groundY - 75, 28, 30);
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#78350f'; // Window Cross Bars
        ctx.fillRect(hx + 38, groundY - 75, 2, 30);
        ctx.fillRect(hx + 25, groundY - 60, 28, 2);
        ctx.fillRect(hx + 98, groundY - 75, 2, 30);
        ctx.fillRect(hx + 85, groundY - 60, 28, 2);

        // White Front Door
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(hx + 56, groundY - 50, 26, 50);
        ctx.restore();
      }
    }

    // 2. Snow-Covered Pine Trees
    for (let px = 300; px < levelWidth; px += 380) {
      if (camera.isVisible(px, 60)) {
        ctx.save();
        ctx.fillStyle = '#451a03';
        ctx.fillRect(px + 22, groundY - 90, 8, 90);
        // 3 Tier Pine Foliage with Snow
        for (let t = 0; t < 3; t++) {
          ctx.fillStyle = '#064e3b';
          ctx.beginPath();
          ctx.moveTo(px + 26, groundY - 160 + t * 28);
          ctx.lineTo(px - 10 + t * 6, groundY - 110 + t * 28);
          ctx.lineTo(px + 62 - t * 6, groundY - 110 + t * 28);
          ctx.closePath();
          ctx.fill();

          // Snow Caps
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(px + 4 + t * 4, groundY - 138 + t * 28, 36 - t * 8, 6);
        }
        ctx.restore();
      }
    }

    // 3. Mining Headframe & Ore Carts
    const minePositions = [1250, 2550, 3850, 5150];
    for (const mx of minePositions) {
      if (camera.isVisible(mx, 120)) {
        ctx.save();
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(mx, groundY - 140, 10, 140);
        ctx.fillRect(mx + 70, groundY - 140, 10, 140);
        ctx.fillStyle = '#475569';
        ctx.fillRect(mx - 10, groundY - 150, 100, 15);
        ctx.fillStyle = '#f97316';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('LKAB -700M', mx + 10, groundY - 138);
        ctx.restore();
      }
    }
  }

  /* ================= 3. STOCKHOLM: GAMLA STAN & ROYAL PALACE ================= */
  drawStockholmScenery(ctx, levelWidth, camera, gameTime, groundY) {
    // 1. Medieval Gamla Stan Townhouse Facades (Ochre, Burgundy, Gold)
    const facadeColors = ['#b45309', '#991b1b', '#d97706', '#854d0e', '#7c2d12'];
    for (let bx = 400; bx < levelWidth - 400; bx += 360) {
      if (camera.isVisible(bx, 180)) {
        ctx.save();
        const col = facadeColors[Math.floor(bx / 360) % facadeColors.length];
        ctx.fillStyle = col;
        ctx.fillRect(bx, groundY - 170, 160, 170);

        // Stepped Gable Roof
        ctx.fillStyle = '#451a03';
        ctx.fillRect(bx + 20, groundY - 190, 120, 20);
        ctx.fillRect(bx + 45, groundY - 208, 70, 18);
        ctx.fillRect(bx + 65, groundY - 222, 30, 14);

        // Windows with Amber Lighting
        for (let row = 0; row < 3; row++) {
          for (let colW = 0; colW < 3; colW++) {
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(bx + 20 + colW * 45, groundY - 150 + row * 40, 24, 26);
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(bx + 31 + colW * 45, groundY - 150 + row * 40, 2, 26);
            ctx.fillRect(bx + 20 + colW * 45, groundY - 138 + row * 40, 24, 2);
          }
        }

        // Arched Entrance Doorway
        ctx.fillStyle = '#1e1b4b';
        ctx.beginPath();
        ctx.arc(bx + 80, groundY - 45, 18, Math.PI, 0);
        ctx.lineTo(bx + 98, groundY);
        ctx.lineTo(bx + 62, groundY);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    // 2. Billowing Swedish Flags & Tre Kronor Royal Standards
    for (let fx = 750; fx < levelWidth; fx += 550) {
      if (camera.isVisible(fx, 60)) {
        ctx.save();
        // Flagpole
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(fx, groundY - 150, 4, 150);
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(fx + 2, groundY - 152, 4, 0, Math.PI * 2);
        ctx.fill();

        // Billowing Swedish Flag (Blue & Yellow Cross)
        const flutter = Math.sin(gameTime * 0.1 + fx) * 4;
        ctx.fillStyle = '#0284c7'; // Swedish Blue
        ctx.fillRect(fx + 4, groundY - 146 + flutter, 48, 28);
        ctx.fillStyle = '#facc15'; // Swedish Gold Cross
        ctx.fillRect(fx + 4, groundY - 134 + flutter, 48, 5);
        ctx.fillRect(fx + 18, groundY - 146 + flutter, 6, 28);
        ctx.restore();
      }
    }
  }

  /* ================= 4. VISBY: RINGMUREN BATTLEMENTS & CATHEDRAL RUINS ================= */
  drawVisbyScenery(ctx, levelWidth, camera, gameTime, groundY) {
    // 1. Medieval Limestone Ringmuren Fortifications
    for (let rx = 350; rx < levelWidth - 300; rx += 420) {
      if (camera.isVisible(rx, 180)) {
        ctx.save();
        // Stone Wall
        ctx.fillStyle = '#334155';
        ctx.fillRect(rx, groundY - 140, 160, 140);
        ctx.fillStyle = '#475569';
        // Crenellations (Battlements)
        for (let b = 0; b < 4; b++) {
          ctx.fillRect(rx + b * 42, groundY - 162, 28, 24);
        }

        // Arrow Slits
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(rx + 40, groundY - 90, 6, 24);
        ctx.fillRect(rx + 110, groundY - 90, 6, 24);

        // Overgrown Green Moss & Ivy
        ctx.fillStyle = '#15803d';
        ctx.fillRect(rx + 20, groundY - 120, 12, 40);
        ctx.fillRect(rx + 85, groundY - 100, 16, 50);
        ctx.restore();
      }
    }

    // 2. Glowing Purple/Cyan Phantom Torches (Eldkorgar)
    for (let tx = 200; tx < levelWidth; tx += 300) {
      if (camera.isVisible(tx, 40)) {
        ctx.save();
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(tx, groundY - 70, 6, 70);
        ctx.fillRect(tx - 6, groundY - 76, 18, 8);

        // Flickering Spectral Flame
        const flameBob = Math.sin(gameTime * 0.2 + tx) * 3;
        ctx.fillStyle = '#c084fc';
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(tx + 3, groundY - 84 + flameBob, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }
}

export const sceneryManager = new SceneryManager();
