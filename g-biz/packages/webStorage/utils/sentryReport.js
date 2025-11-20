/**
 * Owner: garuda@kupotech.com
 */
const { SENTRY_NAMESPACE } = window || {};
// report sentry message
const sentryReport = (funcName, err) => {
  const sentryNamespace = SENTRY_NAMESPACE || 'SentryLazy';
  const sentryFunc = window[sentryNamespace];
  try {
    if (sentryFunc && sentryFunc.captureEvent) {
      sentryFunc.captureEvent({
        message: `execute KcStorage function: ${funcName} error`,
        level: 'warning',
        tags: {
          errorType: 'kc_storage',
        },
        fingerprint: `kcStorage error ${err?.toString()}`,
      });
      console.log(
        `execute KcStorage function: ${funcName} error`,
        `kcStorage error ${err?.toString()}`,
      );
    }
  } catch (e) {
    console.log(e);
  }
};
export default sentryReport;
