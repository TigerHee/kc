export function getBridge() {
  return typeof window !== 'undefined' && window.parent?.bridge;
}

export function isTMA() {
  const bridge = getBridge();

  if (!bridge) {
    return false;
  }

  return !!bridge.isTMA;
}
