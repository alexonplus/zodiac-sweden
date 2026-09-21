import { KrakenBoss } from './KrakenBoss.js';
import { JatteBoss } from './JatteBoss.js';
import { GryphonBoss } from './GryphonBoss.js';
import { PirateBoss } from './PirateBoss.js';

export { KrakenBoss, JatteBoss, GryphonBoss, PirateBoss };

/**
 * Creates the appropriate modular boss instance based on name or ID.
 */
export function createBoss(x, y, name, maxHp, icon) {
  const upper = name.toUpperCase();
  if (upper.includes('KRAKEN') || upper.includes('KRAN')) {
    return new KrakenBoss(x, y, maxHp);
  } else if (upper.includes('JÄTTE') || upper.includes('MALM') || upper.includes('JATTE')) {
    return new JatteBoss(x, y, maxHp);
  } else if (upper.includes('GRYFON') || upper.includes('GRYPHON')) {
    return new GryphonBoss(x, y, maxHp);
  } else {
    return new PirateBoss(x, y, maxHp);
  }
}
