/**
 * Screen Wake Lock API Manager
 * Prevents mobile display from sleeping during pass-the-phone gameplay.
 * Gracefully degrades if unsupported or permission denied.
 */

class WakeLockManager {
  private sentinel: WakeLockSentinel | null = null;

  isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'wakeLock' in navigator;
  }

  async request(): Promise<boolean> {
    if (!this.isSupported()) {
      return false; // Unsupported in this browser environment
    }

    try {
      if (!this.sentinel || this.sentinel.released) {
        this.sentinel = await navigator.wakeLock.request('screen');
        this.sentinel.addEventListener('release', () => {
          this.sentinel = null;
        });
      }
      return true;
    } catch {
      // Graceful fallback (e.g. low battery, background tab)
      return false;
    }
  }

  async release(): Promise<void> {
    if (this.sentinel && !this.sentinel.released) {
      try {
        await this.sentinel.release();
      } catch {
        // Ignore release errors
      } finally {
        this.sentinel = null;
      }
    }
  }

  get isActive(): boolean {
    return Boolean(this.sentinel && !this.sentinel.released);
  }
}

export const wakeLock = new WakeLockManager();
