/**
 * SceneryManager renders authentic Swedish architectural landmarks,
 * parallax background depth, animated weather/industrial effects,
 * neon signs, streetlights, and historic details across all 8 sectors.
 */
export class SceneryManager {
  draw(ctx, levelId, levelWidth, camera, gameTime) {
    const groundY = 490;

    if (levelId === 'goteborg' || levelId.startsWith('goteborg')) {
      this.drawGoteborgScenery(ctx, levelWidth, camera, gameTime, groundY);
    } else if (levelId === 'kiruna') {
      this.drawKirunaScenery(ctx, levelWidth, camera, gameTime, groundY);
    } else if (levelId === 'stockholm') {
      this.drawStockholmScenery(ctx, levelWidth, camera, gameTime, groundY);
    } else if (levelId === 'visby') {
      this.drawVisbyScenery(ctx, levelWidth, camera, gameTime, groundY);
    }
  }

  /* ================= 1. GÖTEBORG: CYBER HARBOR, CRANES & SHIPYARDS ================= */
  drawGoteborgScenery(ctx, levelWidth, camera, gameTime, groundY) {
    // 1. Far Parallax Silhouette: Feskekôrka & Stena Line Ferry
    for (let bx = 300; bx < levelWidth; bx += 2400) {
      if (camera.isVisible(bx, 300)) {
        ctx.save();
        ctx.fillStyle = 'rgba(3, 30, 50, 0.45)';
        // Feskekôrka Neo-Gothic Silhouette
        ctx.beginPath();
        ctx.moveTo(bx, groundY - 20);
        ctx.lineTo(bx + 40, groundY - 140);
        ctx.lineTo(bx + 120, groundY - 180);
        ctx.lineTo(bx + 200, groundY - 140);
        ctx.lineTo(bx + 240, groundY - 20);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    // 2. Giant Eriksberg & Lindholmen Shipyard Gantry Cranes
    const cranePositions = [750, 2200, 3600, 5200, 6800, 8400, 9900, 11200];
    for (const cx of cranePositions) {
      if (camera.isVisible(cx - 40, 260)) {
        ctx.save();
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 5;
        // Massive Gantry Truss Legs
        ctx.beginPath();
        ctx.moveTo(cx, groundY);
        ctx.lineTo(cx + 45, 140);
        ctx.lineTo(cx + 175, 140);
        ctx.lineTo(cx + 220, groundY);
        ctx.stroke();

        // Horizontal Boom & Counterweight
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#d97706';
        ctx.strokeRect(cx + 10, 130, 200, 20);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(cx + 10, 130, 35, 20); // Counterweight block

        // Signage
        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('ERIKSBERG 450T', cx + 55, 144);

        // Warning Beacon Light (Flashing Red)
        const beaconGlow = Math.sin(gameTime * 0.12 + cx) > 0 ? '#ef4444' : '#7f1d1d';
        ctx.fillStyle = beaconGlow;
        ctx.shadowColor = beaconGlow;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(cx + 45, 126, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Animated Welder Sparks showering down
        if (Math.sin(gameTime * 0.08 + cx * 0.5) > 0.4) {
          ctx.fillStyle = '#38bdf8';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 8;
          ctx.fillRect(cx + 120 + (Math.random() - 0.5) * 8, 150 + Math.random() * 45, 2, 2);
          ctx.shadowBlur = 0;
        }
        ctx.restore();
      }
    }

    // 3. Stacks of Freight Shipping Containers (Maersk, Stena Line, Volvo)
    const containerStacks = [
      { x: 1350, h: 2, col1: '#0284c7', col2: '#d97706', label: 'MAERSK' },
      { x: 2650, h: 3, col1: '#dc2626', col2: '#059669', label: 'STENA' },
      { x: 4200, h: 2, col1: '#0284c7', col2: '#475569', label: 'VOLVO' },
      { x: 5800, h: 3, col1: '#d97706', col2: '#2563eb', label: 'NORDIC' },
      { x: 7400, h: 2, col1: '#16a34a', col2: '#dc2626', label: 'SKF' },
      { x: 8900, h: 3, col1: '#2563eb', col2: '#d97706', label: 'LOGIX' }
    ];
    for (const c of containerStacks) {
      if (camera.isVisible(c.x, 140)) {
        ctx.save();
        for (let row = 0; row < c.h; row++) {
          const cy = groundY - (row + 1) * 32;
          ctx.fillStyle = row % 2 === 0 ? c.col1 : c.col2;
          ctx.fillRect(c.x, cy, 120, 30);
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(c.x, cy, 120, 30);

          // Corrugated Steel Ribs
          ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
          for (let rx = c.x + 8; rx < c.x + 112; rx += 14) {
            ctx.fillRect(rx, cy + 2, 4, 26);
          }

          // Container Label Stencil
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 8px monospace';
          ctx.fillText(c.label, c.x + 12, cy + 18);
        }
        ctx.restore();
      }
    }

    // 4. Overhead Tram Catenary Power Lines with Sparking Electrical Arcs
    for (let tx = 2900; tx < 4600; tx += 350) {
      if (camera.isVisible(tx, 350)) {
        ctx.save();
        // Steel Pole
        ctx.fillStyle = '#475569';
        ctx.fillRect(tx, groundY - 180, 8, 180);
        ctx.fillRect(tx - 15, groundY - 175, 45, 6);

        // Power Wire
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tx, groundY - 172);
        ctx.lineTo(tx + 350, groundY - 172);
        ctx.stroke();

        // Electrical Spark Arc (Occasional)
        if (Math.sin(gameTime * 0.15 + tx) > 0.92) {
          ctx.fillStyle = '#00f0ff';
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(tx + 175, groundY - 172, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
        ctx.restore();
      }
    }

    // 5. Pier Lampposts with Downward Cyan Light Cones
    for (let lx = 180; lx < levelWidth; lx += 420) {
      if (camera.isVisible(lx, 40)) {
        ctx.save();
        ctx.fillStyle = '#334155';
        ctx.fillRect(lx, groundY - 120, 6, 120);
        ctx.fillRect(lx - 10, groundY - 126, 26, 8);

        // Downward Volumetric Light Cone
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

  /* ================= 2. KIRUNA: ARCTIC TUNDRA, MINES & FALUN COTTAGES ================= */
  drawKirunaScenery(ctx, levelWidth, camera, gameTime, groundY) {
    // 1. Shimmering Aurora Borealis (Norrsken) Ribbons in Far Sky
    ctx.save();
    for (let a = 0; a < 3; a++) {
      const aPhase = gameTime * 0.015 + a * 1.5;
      const grad = ctx.createLinearGradient(0, 40 + a * 30, 0, 180 + a * 30);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      grad.addColorStop(0.5, a === 1 ? 'rgba(168, 85, 247, 0.18)' : 'rgba(34, 197, 94, 0.22)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;

      ctx.beginPath();
      ctx.moveTo(camera.x, 120 + a * 20);
      for (let x = camera.x; x < camera.x + 1050; x += 120) {
        const yOffset = Math.sin(aPhase + x * 0.003) * 35;
        ctx.lineTo(x, 120 + a * 20 + yOffset);
      }
      ctx.lineTo(camera.x + 1050, 240);
      ctx.lineTo(camera.x, 240);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // 2. Traditional Swedish Red Falun Timber Cottages (Röda Stugor)
    const housePositions = [600, 1850, 3100, 4400, 5900, 7300, 8800, 10300];
    for (const hx of housePositions) {
      if (camera.isVisible(hx, 160)) {
        ctx.save();
        // Red Falun Timber Wall Body
        ctx.fillStyle = '#7f1d1d';
        ctx.fillRect(hx, groundY - 110, 140, 110);
        // White Corner Boards & Window Frames
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

        // Cozy Warm Glowing Windows with Cross Mullions
        ctx.fillStyle = '#facc15';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 12;
        ctx.fillRect(hx + 25, groundY - 75, 28, 30);
        ctx.fillRect(hx + 85, groundY - 75, 28, 30);
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#78350f';
        ctx.fillRect(hx + 38, groundY - 75, 2, 30);
        ctx.fillRect(hx + 25, groundY - 60, 28, 2);
        ctx.fillRect(hx + 98, groundY - 75, 2, 30);
        ctx.fillRect(hx + 85, groundY - 60, 28, 2);

        // White Front Door
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(hx + 56, groundY - 50, 26, 50);

        // Chimney with Gentle Smoke Puff
        ctx.fillStyle = '#334155';
        ctx.fillRect(hx + 100, groundY - 180, 14, 25);
        const smokeBob = Math.sin(gameTime * 0.08 + hx) * 4;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(hx + 107, groundY - 192 + smokeBob, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }

    // 3. Thick Snow-Laden Nordic Pine Forests
    for (let px = 240; px < levelWidth; px += 340) {
      if (camera.isVisible(px, 60)) {
        ctx.save();
        ctx.fillStyle = '#451a03';
        ctx.fillRect(px + 22, groundY - 95, 8, 95);
        // 3 Tier Conifer Foliage with Snow Caps
        for (let t = 0; t < 3; t++) {
          ctx.fillStyle = '#064e3b';
          ctx.beginPath();
          ctx.moveTo(px + 26, groundY - 165 + t * 28);
          ctx.lineTo(px - 12 + t * 6, groundY - 115 + t * 28);
          ctx.lineTo(px + 64 - t * 6, groundY - 115 + t * 28);
          ctx.closePath();
          ctx.fill();

          // Snow Caps
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(px + 2 + t * 4, groundY - 142 + t * 28, 40 - t * 8, 6);
        }
        ctx.restore();
      }
    }

    // 4. LKAB Subterranean Mining Headframes with Spinning Cable Wheels
    const mineHeadframes = [1250, 3850, 6750, 9650];
    for (const mx of mineHeadframes) {
      if (camera.isVisible(mx, 120)) {
        ctx.save();
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(mx, groundY - 150, 10, 150);
        ctx.fillRect(mx + 70, groundY - 150, 10, 150);
        ctx.fillStyle = '#475569';
        ctx.fillRect(mx - 10, groundY - 160, 100, 14);

        // Spinning Headframe Cable Wheel
        ctx.save();
        ctx.translate(mx + 40, groundY - 170);
        ctx.rotate(gameTime * 0.05);
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-18, 0); ctx.lineTo(18, 0);
        ctx.moveTo(0, -18); ctx.lineTo(0, 18);
        ctx.stroke();
        ctx.restore();

        // Ore Cart on Rails
        ctx.fillStyle = '#334155';
        ctx.fillRect(mx + 10, groundY - 30, 48, 22);
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(mx + 14, groundY - 34, 40, 6); // Iron Ore Heap
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(mx + 20, groundY - 6, 6, 0, Math.PI * 2);
        ctx.arc(mx + 48, groundY - 6, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }
  }

  /* ================= 3. STOCKHOLM: OLD TOWN, ROYAL ARCHES & FLAGS ================= */
  drawStockholmScenery(ctx, levelWidth, camera, gameTime, groundY) {
    // 1. Medieval Gamla Stan Townhouse Facades (Ochre, Burgundy, Gold)
    const facadeColors = ['#b45309', '#991b1b', '#d97706', '#854d0e', '#7c2d12'];
    for (let bx = 380; bx < levelWidth - 300; bx += 380) {
      if (camera.isVisible(bx, 180)) {
        ctx.save();
        const col = facadeColors[Math.floor(bx / 380) % facadeColors.length];
        ctx.fillStyle = col;
        ctx.fillRect(bx, groundY - 180, 160, 180);

        // Ornate Stepped Gable Terracotta Roof
        ctx.fillStyle = '#451a03';
        ctx.fillRect(bx + 15, groundY - 200, 130, 20);
        ctx.fillRect(bx + 40, groundY - 218, 80, 18);
        ctx.fillRect(bx + 65, groundY - 232, 30, 14);

        // Windows with Amber Leaded Glass
        for (let row = 0; row < 3; row++) {
          for (let colW = 0; colW < 3; colW++) {
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(bx + 20 + colW * 45, groundY - 160 + row * 42, 24, 26);
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(bx + 31 + colW * 45, groundY - 160 + row * 42, 2, 26);
            ctx.fillRect(bx + 20 + colW * 45, groundY - 148 + row * 42, 24, 2);
          }
        }

        // Arched Stone Entrance Doorway
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

    // 2. Billowing Swedish Blue & Gold Flags & Tre Kronor Standards
    for (let fx = 750; fx < levelWidth; fx += 550) {
      if (camera.isVisible(fx, 60)) {
        ctx.save();
        // Flagpole
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(fx, groundY - 160, 4, 160);
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(fx + 2, groundY - 162, 4, 0, Math.PI * 2);
        ctx.fill();

        // Billowing Swedish Flag
        const flutter = Math.sin(gameTime * 0.12 + fx) * 5;
        ctx.fillStyle = '#0284c7'; // Swedish Blue
        ctx.fillRect(fx + 4, groundY - 156 + flutter, 52, 30);
        ctx.fillStyle = '#facc15'; // Swedish Gold Cross
        ctx.fillRect(fx + 4, groundY - 144 + flutter, 52, 6);
        ctx.fillRect(fx + 20, groundY - 156 + flutter, 6, 30);

        ctx.restore();
      }
    }

    // 3. Vintage Wrought-Iron Gas Streetlamps casting Warm Cones
    for (let lx = 200; lx < levelWidth; lx += 450) {
      if (camera.isVisible(lx, 50)) {
        ctx.save();
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(lx, groundY - 130, 6, 130);
        ctx.fillRect(lx - 12, groundY - 136, 30, 8);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(lx - 6, groundY - 146, 18, 12);

        // Warm Amber Radial Glow
        ctx.fillStyle = 'rgba(250, 204, 21, 0.09)';
        ctx.beginPath();
        ctx.moveTo(lx + 3, groundY - 136);
        ctx.lineTo(lx - 50, groundY);
        ctx.lineTo(lx + 56, groundY);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }
  }

  /* ================= 4. VISBY: RINGMUREN BATTLEMENTS & CATHEDRAL RUINS ================= */
  drawVisbyScenery(ctx, levelWidth, camera, gameTime, groundY) {
    // 1. Ancient Gotland Limestone Rauks (Sea Stacks) in the Coastal Surf
    for (let rk = 300; rk < levelWidth; rk += 1600) {
      if (camera.isVisible(rk, 80)) {
        ctx.save();
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(rk + 20, groundY);
        ctx.lineTo(rk + 10, groundY - 90);
        ctx.lineTo(rk + 35, groundY - 150);
        ctx.lineTo(rk + 55, groundY - 140);
        ctx.lineTo(rk + 65, groundY - 80);
        ctx.lineTo(rk + 55, groundY);
        ctx.closePath();
        ctx.fill();
        // Limestone Weathering Strata
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(rk + 14, groundY - 60); ctx.lineTo(rk + 62, groundY - 60);
        ctx.moveTo(rk + 22, groundY - 110); ctx.lineTo(rk + 50, groundY - 110);
        ctx.stroke();
        ctx.restore();
      }
    }

    // 2. Medieval Limestone Ringmuren Fortifications (UNESCO World Heritage)
    for (let rx = 350; rx < levelWidth - 300; rx += 420) {
      if (camera.isVisible(rx, 180)) {
        ctx.save();
        // Stone Curtain Wall
        ctx.fillStyle = '#334155';
        ctx.fillRect(rx, groundY - 150, 160, 150);
        ctx.fillStyle = '#475569';

        // Crenellations (Battlements)
        for (let b = 0; b < 4; b++) {
          ctx.fillRect(rx + b * 42, groundY - 174, 28, 26);
        }

        // Arrow Slits
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(rx + 40, groundY - 100, 6, 26);
        ctx.fillRect(rx + 110, groundY - 100, 6, 26);

        // Overgrown Green Ivy & Lichen
        ctx.fillStyle = '#15803d';
        ctx.fillRect(rx + 20, groundY - 130, 14, 45);
        ctx.fillRect(rx + 85, groundY - 110, 18, 55);

        ctx.restore();
      }
    }

    // 3. Flickering Purple/Cyan Phantom Torches (Eldkorgar)
    for (let tx = 200; tx < levelWidth; tx += 300) {
      if (camera.isVisible(tx, 40)) {
        ctx.save();
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(tx, groundY - 75, 6, 75);
        ctx.fillRect(tx - 6, groundY - 82, 18, 8);

        // Flickering Spectral Flame
        const flameBob = Math.sin(gameTime * 0.2 + tx) * 3;
        ctx.fillStyle = '#c084fc';
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(tx + 3, groundY - 90 + flameBob, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();
      }
    }
  }
}

export const sceneryManager = new SceneryManager();
