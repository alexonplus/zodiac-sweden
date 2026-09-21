import { KrakenBoss, JatteBoss, GryphonBoss, PirateBoss, createBoss } from './bosses/index.js';
import { BaseBoss } from './bosses/BaseBoss.js';

export { BaseBoss, KrakenBoss, JatteBoss, GryphonBoss, PirateBoss, createBoss };

/**
 * Backwards-compatible BossEntity alias that uses modular Boss subclasses internally.
 */
export class BossEntity {
  constructor(x, y, name, hp, icon) {
    return createBoss(x, y, name, hp, icon);
  }
}
