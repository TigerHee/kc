/*
 * @owner: chrise@kupotech.com
 */
import * as Sentry from "@sentry/nextjs";

export const sentryCaptureEventInfo = (params) => {
  try {
    Sentry.captureEvent?.({
      level: "info",
      ...params,
    });
  } catch (e) {
    console.log(e);
  }
};
