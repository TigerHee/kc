import { NAMESPACE } from "../../config";

// 上报请求非200异常
function reportRequestStatusError(status, url, options = {}, headers = {}) {
  try {
    const sentry = window[NAMESPACE];
    sentry?.captureEvent({
      message: `服务端请求错误: ${options?.method || "GET"} ${status} ${url}`,
      level: "error",
      tags: {
        url: url?.split("?")[0],
        requestError: "statusError",
      },
      extra: {
        responseHeaders: headers,
      },
      fingerprint: [
        options?.method || "GET",
        url?.split("?")[0],
        String(status),
      ],
    });
  } catch (e) {
    console.log(e);
  }
}
export default reportRequestStatusError;
