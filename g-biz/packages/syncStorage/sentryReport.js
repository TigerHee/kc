/**
 * Owner: garuda@kupotech.com
 * sentry 上报
 */
const { SENTRY_NAMESPACE } = window || {};
// report sentry message
const sentryReport = (funcName, err) => {
  const sentryNamespace = SENTRY_NAMESPACE || 'SentryLazy';
  const sentryFunc = window[sentryNamespace];
  try {
    if (sentryFunc && sentryFunc.captureEvent) {
      sentryFunc.captureEvent({
        message: `execute syncStorage function: ${funcName} error`,
        level: 'warning',
        tags: {
          errorType: 'kc_storage_sync',
        },
        fingerprint: `syncStorage error ${err?.toString()}`,
      });
      console.log(
        `execute syncStorage function: ${funcName} error`,
        `syncStorage error ${err?.toString()}`,
      );
    }
  } catch (e) {
    console.log(e);
  }
};
export default sentryReport;
