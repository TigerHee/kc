import { isServer } from "./checkIsServer";

/**
 * Owner: garuda@kupotech.com
 */
const { SENTRY_NAMESPACE }: any = isServer ? {} : window;
// report sentry message
const sentryReport = (funcName: string, err: any) => {
  const sentryNamespace = SENTRY_NAMESPACE || 'SentryLazy';
  try {
    const sentryFunc: any = window[sentryNamespace];
    if (sentryFunc && sentryFunc?.captureEvent) {
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
