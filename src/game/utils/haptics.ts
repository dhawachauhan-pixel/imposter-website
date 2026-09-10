/**
 * Haptic Vibration Feedback Helper
 * Enhances tactile feedback on mobile devices during pass-the-phone turns.
 * Fails silently with zero errors if unsupported.
 */

export type HapticType = 'light' | 'medium' | 'heavy' | 'selection';

export function triggerHapticFeedback(pattern: number | number[] = 35): boolean {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator && typeof navigator.vibrate === 'function') {
    try {
      return navigator.vibrate(pattern);
    } catch {
      return false;
    }
  }
  return false;
}

export function triggerHaptic(type: HapticType = 'light'): boolean {
  switch (type) {
    case 'selection':
      return triggerHapticFeedback(18);
    case 'light':
      return triggerHapticFeedback(25);
    case 'medium':
      return triggerHapticFeedback(45);
    case 'heavy':
      return triggerHapticFeedback([60, 40, 60]);
    default:
      return triggerHapticFeedback(25);
  }
}
