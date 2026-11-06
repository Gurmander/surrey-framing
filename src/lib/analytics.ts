/**
 * Client-side analytics helper (SRS FR-37, FR-41, FR-76). Sends a GA4 event only
 * if the visitor has accepted analytics cookies (gtag is loaded after consent);
 * otherwise it does nothing. Never pass personal data as event parameters.
 */
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type AnalyticsEvent =
  | 'quote_submitted'
  | 'builder_enquiry'
  | 'job_application'
  | 'call_click'
  | 'email_click'
  | 'whatsapp_click';

export function track(event: AnalyticsEvent, params: Record<string, string> = {}): void {
  window.gtag?.('event', event, params);
}

/**
 * Send an event, then run `next` (e.g. a redirect) once GA4 has sent it, or right
 * away if analytics is off. A short timeout makes sure `next` always runs.
 */
export function trackThen(
  event: AnalyticsEvent,
  params: Record<string, string>,
  next: () => void,
): void {
  if (!window.gtag) {
    next();
    return;
  }
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    next();
  };
  window.gtag('event', event, { ...params, event_callback: finish });
  window.setTimeout(finish, 800);
}
