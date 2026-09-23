import { getHeroAvatarSvg } from '../config/avatars.js';

export class HudManager {
  initPlayerAvatars(p1Hero, p2Hero, isCoopMode) {
    const p1Av = document.getElementById('p1-avatar');
    if (p1Av && p1Hero) {
      p1Av.innerHTML = getHeroAvatarSvg(p1Hero.id, 44);
      p1Av.style.borderColor = p1Hero.color;
      p1Av.style.boxShadow = `0 0 16px ${p1Hero.color}`;
    }

    const p2Av = document.getElementById('p2-avatar');
    if (p2Av && p2Hero && isCoopMode) {
      p2Av.innerHTML = getHeroAvatarSvg(p2Hero.id, 44);
      p2Av.style.borderColor = p2Hero.color;
      p2Av.style.boxShadow = `0 0 16px ${p2Hero.color}`;
    }
  }

  updateProgress(currentX, totalWidth = 3200) {
    const trackWidth = Math.max(1, totalWidth - 1080);
    const pct = Math.min(100, Math.max(0, (currentX / trackWidth) * 100));
    const fill = document.getElementById('stage-progress-fill');
    const marker = document.getElementById('stage-progress-marker');
    if (fill) fill.style.width = `${pct}%`;
    if (marker) marker.style.left = `${pct}%`;
  }

  updateHUD(p1, p2, isCoopMode, score, activeBoss) {
    const p1HpPct = Math.max(0, (p1.hp / p1.maxHp) * 100);
    document.getElementById('p1-hp-bar').style.width = `${p1HpPct}%`;
    document.getElementById('p1-hp-text').innerText = `${Math.ceil(p1.hp)}/${p1.maxHp}`;
    document.getElementById('p1-energy-bar').style.width = `${(p1.energy / p1.maxEnergy) * 100}%`;
    document.getElementById('p1-energy-text').innerText = `${Math.ceil(p1.energy)}`;
    document.getElementById('p1-ult-bar').style.width = `${p1.ultCharge}%`;
    document.getElementById('p1-ult-text').innerText = `${Math.floor(p1.ultCharge)}%`;

    if (isCoopMode) {
      const p2HpPct = Math.max(0, (p2.hp / p2.maxHp) * 100);
      document.getElementById('p2-hp-bar').style.width = `${p2HpPct}%`;
      document.getElementById('p2-hp-text').innerText = `${Math.ceil(p2.hp)}/${p2.maxHp}`;
      document.getElementById('p2-energy-bar').style.width = `${(p2.energy / p2.maxEnergy) * 100}%`;
      document.getElementById('p2-energy-text').innerText = `${Math.ceil(p2.energy)}`;
      document.getElementById('p2-ult-bar').style.width = `${p2.ultCharge}%`;
      document.getElementById('p2-ult-text').innerText = `${Math.floor(p2.ultCharge)}%`;
    }

    document.getElementById('score-val').innerText = score;

    const bossHud = document.getElementById('boss-hud-container');
    if (activeBoss && activeBoss.hp > 0) {
      bossHud.style.display = 'block';
      document.getElementById('boss-hud-name').innerText = activeBoss.name;
      document.getElementById('boss-hud-icon').innerText = activeBoss.icon;
      const bPct = Math.max(0, (activeBoss.hp / activeBoss.maxHp) * 100);
      document.getElementById('boss-hp-bar').style.width = `${bPct}%`;
      document.getElementById('boss-hp-current').innerText = Math.ceil(activeBoss.hp);
      document.getElementById('boss-hp-max').innerText = activeBoss.maxHp;
      const phaseBadge = document.getElementById('boss-hud-phase');
      if (activeBoss.phase === 2) {
        phaseBadge.innerText = '🔥 ENRAGED PHASE 2';
        phaseBadge.classList.add('phase2');
        document.getElementById('boss-hp-bar').classList.add('phase2');
      } else {
        phaseBadge.innerText = 'PHASE 1';
        phaseBadge.classList.remove('phase2');
        document.getElementById('boss-hp-bar').classList.remove('phase2');
      }
    } else {
      bossHud.style.display = 'none';
    }
  }

  showSynergy(text) {
    const pop = document.getElementById('synergy-popup');
    if (pop) {
      pop.innerText = `⚡ ${text} ⚡`;
      pop.classList.add('show');
      setTimeout(() => pop.classList.remove('show'), 2200);
    }
  }

  showBossWarning(bossName) {
    const pop = document.getElementById('synergy-popup');
    if (pop) {
      pop.innerHTML = `⚠️ BOSS ARENA! ⚠️<br><span style="font-size:16px;color:#ef4444;text-shadow:0 0 10px #ef4444;">${bossName}</span>`;
      pop.classList.add('show');
      setTimeout(() => pop.classList.remove('show'), 3500);
    }
  }
}
export const hudManager = new HudManager();

