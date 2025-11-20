import { NAMESPACE } from "../../config";

// 上报code=200 success=false异常
function reportRequestBizError(code = "-", url, options = {}, json = {}) {
  // try {
  //   const sentry = window[NAMESPACE];
  //   sentry?.captureEvent({
  //     message: `请求成功但code异常: ${url}`,
  //     level: "info",
  //     tags: {
  //       url: url?.split("?")[0],
  //       requestError: "bizError",
  //     },
  //     extra: {
  //       response: json,
  //       request: options,
  //     },
  //     fingerprint: [options?.method, code, url?.split("?")[0]],
  //   });
  // } catch (e) {
  //   console.log(e);
  // }
}
export default reportRequestBizError;
