/*
 * @owner: chrise@kupotech.com
 */

export const sentryCaptureEventInfo = (params) => {
  const sentryNamespace = window.SENTRY_NAMESPACE || 'SentryLazy';
  try {
    if (window[sentryNamespace]) {
      window[sentryNamespace].captureEvent({
        level: 'info',
        ...params,
      });
    }
  } catch (e) {
    console.log(e);
  }
};
