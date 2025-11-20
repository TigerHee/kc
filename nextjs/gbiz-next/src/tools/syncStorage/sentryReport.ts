/**
 * Owner: garuda@kupotech.com
 * sentry 上报
 */
import * as Sentry from '@sentry/nextjs';

const sentryReport = (funcName: string, err: any) => {
  try {
    Sentry.captureEvent?.({
      message: `execute syncStorage function: ${funcName} error`,
      level: 'warning',
      tags: {
        errorType: 'kc_storage_sync',
      },
      fingerprint: [`syncStorage error ${err?.toString()}`],
    });
    console.log(
      `execute syncStorage function: ${funcName} error`,
      `syncStorage error ${err?.toString()}`,
    );
  } catch (e) {
    console.log(e);
  }
};
export default sentryReport;
