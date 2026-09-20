/**
 * Camera System for Side-Scrolling Beat 'Em Up Gameplay
 * Features smooth lerp tracking, look-ahead offsets, parallax calculations, and screen shake.
 */
export class Camera {
  constructor(viewportWidth = 1080, viewportHeight = 620, levelWidth = 3200, levelHeight = 620) {
    this.vw = viewportWidth;
    this.vh = viewportHeight;
    this.levelWidth = levelWidth;
    this.levelHeight = levelHeight;
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.shake = 0;
    this.isLocked = false;
  }

  setLevelBounds(width, height = 620) {
    this.levelWidth = width;
    this.levelHeight = height;
    this.x = 0;
    this.isLocked = false;
  }

  lockAt(x) {
    this.isLocked = true;
    this.targetX = x;
  }

  unlock() {
    this.isLocked = false;
  }

  update(p1, p2, isCoopMode, screenShake = 0) {
    this.shake = screenShake;

    if (this.isLocked) {
      this.x += (this.targetX - this.x) * 0.1;
      return;
    }

    // Determine target tracking position
    let focalX = p1.x;
    let lookAhead = p1.facing * 90;

    if (isCoopMode && p2 && p2.hp > 0) {
      focalX = (p1.x + p2.x) / 2;
      lookAhead = 0;
    }

    // Calculate ideal camera target centered around focal point
    let desiredX = focalX + lookAhead - this.vw / 2;

    // Clamp within level boundaries
    const maxX = Math.max(0, this.levelWidth - this.vw);
    desiredX = Math.max(0, Math.min(maxX, desiredX));

    // Smooth lerp transition
    this.x += (desiredX - this.x) * 0.08;
    this.y = 0; // Vertical lock for side-scroller standard
  }

  getShakeOffset() {
    if (this.shake <= 0) return { sx: 0, sy: 0 };
    const sx = (Math.random() - 0.5) * this.shake * 1.8;
    const sy = (Math.random() - 0.5) * this.shake * 1.8;
    return { sx, sy };
  }

  /**
   * Returns parallax offset for background layers
   * @param {number} speedFactor - 0.1 for far sky/mountains, 0.4 for city skyline, 1.0 for main foreground
   */
  getParallaxOffset(speedFactor) {
    return this.x * (1 - speedFactor);
  }

  /**
   * Converts world coordinates to screen viewport coordinates
   */
  toScreenX(worldX) {
    return worldX - this.x;
  }

  /**
   * Returns true if object bounding box is visible within current camera viewport
   */
  isVisible(worldX, worldW = 60, margin = 100) {
    return worldX + worldW >= this.x - margin && worldX <= this.x + this.vw + margin;
  }
}
