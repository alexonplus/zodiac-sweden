import { shopManager } from '../entities/Shop.js';

/**
 * Renders and handles interactions in the Fika Café Shop screen.
 */
export function populateShopUI() {
  const container = document.getElementById('shop-items-container');
  const shardsDisplay = document.getElementById('shop-shards-display');
  if (!container || !shardsDisplay) return;

  shardsDisplay.innerText = shopManager.starShards;
  container.innerHTML = '';

  for (const key in shopManager.catalog) {
    const item = shopManager.catalog[key];
    const currentLvl = shopManager.upgrades[key] || 0;
    const isMax = currentLvl >= item.max;
    const canAfford = shopManager.starShards >= item.cost && !isMax;

    const card = document.createElement('div');
    card.style.background = 'rgba(15, 23, 42, 0.9)';
    card.style.border = `1px solid ${isMax ? '#475569' : (canAfford ? '#fb923c' : '#334155')}`;
    card.style.borderRadius = '10px';
    card.style.padding = '12px';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.justifyContent = 'space-between';
    card.style.gap = '8px';

    card.innerHTML = `
      <div>
        <div style="font-size: 24px; margin-bottom: 4px;">${item.icon}</div>
        <div style="font-size: 13px; font-weight: 900; color: #fed7aa;">${item.name}</div>
        <div style="font-size: 11px; color: #94a3b8; margin: 4px 0;">${item.desc}</div>
        <div style="font-size: 11px; color: #facc15; font-weight: bold;">Level: ${currentLvl} / ${item.max}</div>
      </div>
      <button class="btn-buy" style="
        background: ${isMax ? '#334155' : (canAfford ? 'linear-gradient(135deg, #ea580c, #f97316)' : '#1e293b')};
        color: ${isMax ? '#64748b' : (canAfford ? '#ffffff' : '#64748b')};
        border: none;
        padding: 6px 10px;
        border-radius: 6px;
        font-weight: 900;
        font-size: 11px;
        cursor: ${canAfford ? 'pointer' : 'not-allowed'};
      ">${isMax ? 'MAXED OUT' : `BUY: ${item.cost} ⭐`}</button>
    `;

    const buyBtn = card.querySelector('.btn-buy');
    if (canAfford) {
      buyBtn.addEventListener('click', () => {
        if (shopManager.buyUpgrade(key)) {
          populateShopUI();
        }
      });
    }

    container.appendChild(card);
  }
}
