export function trackEvent(event: string, parameters: Record<string, string | number | boolean | undefined> = {}) {
  if (typeof window === 'undefined' || !window.dataLayer) return;

  const safeParameters = Object.fromEntries(
    Object.entries(parameters).filter(([, value]) => value !== undefined),
  );

  window.dataLayer.push({ event, ...safeParameters });
}
