import reportRequestStatusError from "./report/reportRequestStatusError";
import reportRequestBizError from "./report/reportRequestBizError";
import { NO_REPORT_STATUS } from "../config";

// function checkStatus(response, url, options = {}) {
//   const status = response?.status;
//   let _isError = true;
//   if ((status >= 200 && status < 300) || NO_REPORT_STATUS.includes(status)) {
//     _isError = false;
//   }

//   _isError && reportRequestStatusError(status, url, options);
//   return _isError;
// }

// function parseJSON(response) {
//   const s = response?.clone();
//   return s.json();
// }

async function checkError(response, url, options = {}) {
  try {
    const status = response?.status;
    if ((status < 200 || status >= 300) && !NO_REPORT_STATUS.includes(status)) {
      const headers = {};

      // get all headers
      try {
        for (let [key, value] of response.headers.entries()) {
          headers[key] = value;
        }
      } catch (e) {}

      reportRequestStatusError(status, url, options, headers);
    }

    // checkStatus(response, url, options);
    // if (_status) {
    //   return;
    // }
    // const json = await parseJSON(response);
    // 有 success，并且为 false，才上报。防止不是我们的请求被上报上去了。
    // if (json?.success === false && `${json?.code}` !== "401") {
    //   reportRequestBizError(json?.code, url, options, json);
    // }
  } catch (e) {
    console.log(e);
  }
}

function newFetch() {
  const originalFetch = window.fetch;
  async function ModifiedFetch(...args) {
    args = Array.prototype.slice.call(args);
    const response = await originalFetch.apply(window, args);
    const url = args[0];
    const options = args[1];
    checkError(response, url, options);
    return response;
  }
  window.fetch = ModifiedFetch;
}
export default newFetch;
