const fs = require('fs');
const path = require('path');

// 1. Copy the 4 generated artifacts to assets folder
const artifactDir = 'C:\\Users\\invad\\.gemini\\antigravity\\brain\\6a7b993e-69c8-43d8-8596-171ed35b5c8f';
const assetsDir = 'C:\\ZodiacSweden\\assets';

const filesToCopy = [
  { prefix: 'goteborg_skansen', target: 'goteborg_s5.jpg' },
  { prefix: 'kiruna_icehotel', target: 'kiruna_s5.jpg' },
  { prefix: 'stockholm_gamlastan', target: 'stockholm_s3.jpg' },
  { prefix: 'visby_ringmur', target: 'visby_s3.jpg' }
];

const filesInArtifact = fs.readdirSync(artifactDir);
for (const copyTask of filesToCopy) {
  const match = filesInArtifact.find(f => f.startsWith(copyTask.prefix) && f.endsWith('.jpg'));
  if (match) {
    fs.copyFileSync(path.join(artifactDir, match), path.join(assetsDir, copyTask.target));
    console.log(`Copied ${match} to ${copyTask.target}`);
  }
}

// 2. Update levels.js to include bgImage for all sectors
let levelsCode = fs.readFileSync('src/config/levels.js', 'utf8');
const provinces = ['goteborg', 'kiruna', 'stockholm', 'visby'];
for (const p of provinces) {
  for (let i = 1; i <= 8; i++) {
    const search = `id: ${i}, name: '`;
    const replace = `id: ${i}, bgImage: 'assets/${p}_s${i}.jpg', name: '`;
    levelsCode = levelsCode.replace(search, replace);
  }
}
fs.writeFileSync('src/config/levels.js', levelsCode);

// 3. Update main.js to load and render these images
let mainCode = fs.readFileSync('src/main.js', 'utf8');

// Update startLevel to load images
const startLevelInject = `
    // Load sector specific background images
    if (lvlData && lvlData.sectors) {
      lvlData.sectors.forEach(s => {
        if (s.bgImage) {
          const img = new Image();
          img.src = s.bgImage;
          s.img = img;
        }
      });
    }
`;
mainCode = mainCode.replace('this.weatherParticles = [];', 'this.weatherParticles = [];' + startLevelInject);

// Update drawParallaxBackground
const newDrawParallax = `  drawParallaxBackground() {
    const lvlData = LEVELS[this.currentLevel];
    const parallaxOffset = -(this.camera.x * 0.35) % W;

    const rawSector = this.camera.x / 1500;
    const sectorIndex = Math.min(7, Math.max(0, Math.floor(rawSector)));
    const sectorBlend = rawSector - Math.floor(rawSector);
    const nextSectorIndex = Math.min(7, sectorIndex + 1);
    const sectors = lvlData && lvlData.sectors ? lvlData.sectors : null;
    const curSec = sectors ? sectors[sectorIndex] : null;
    const nxtSec = sectors ? sectors[nextSectorIndex] : curSec;

    const blendAlpha = sectorBlend > 0.75 ? (sectorBlend - 0.75) * 4 : 0;

    // Fallback gradient
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#020617');
    grad.addColorStop(1, '#0c1a2e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.imageSmoothingEnabled = true;

    // Draw current sector image
    if (curSec && curSec.img && curSec.img.complete && curSec.img.naturalWidth !== 0) {
      ctx.globalAlpha = 1;
      ctx.drawImage(curSec.img, parallaxOffset, 0, W, H);
      ctx.drawImage(curSec.img, parallaxOffset + W, 0, W, H);
      if (parallaxOffset > 0) ctx.drawImage(curSec.img, parallaxOffset - W, 0, W, H);
    }

    // Blend next sector image
    if (blendAlpha > 0 && nxtSec && nxtSec.img && nxtSec.img.complete && nxtSec.img.naturalWidth !== 0 && curSec !== nxtSec) {
      ctx.globalAlpha = blendAlpha;
      ctx.drawImage(nxtSec.img, parallaxOffset, 0, W, H);
      ctx.drawImage(nxtSec.img, parallaxOffset + W, 0, W, H);
      if (parallaxOffset > 0) ctx.drawImage(nxtSec.img, parallaxOffset - W, 0, W, H);
    }

    ctx.globalAlpha = 1;
    
    // Minimal atmosphere tint
    if (curSec) {
      ctx.save();
      ctx.fillStyle = curSec.tint;
      ctx.globalAlpha = 0.05;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }
  }

  // Old primitives removed`;

// Use regex to replace from drawParallaxBackground() to the end of _drawGhostShipSilhouette
const bgStart = mainCode.indexOf('  drawParallaxBackground() {');
const bgEnd = mainCode.indexOf('  render() {');
if (bgStart !== -1 && bgEnd !== -1) {
  mainCode = mainCode.substring(0, bgStart) + newDrawParallax + '\\n\\n' + mainCode.substring(bgEnd);
}

fs.writeFileSync('src/main.js', mainCode);
console.log('Game code updated successfully!');
