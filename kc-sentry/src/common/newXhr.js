import reportRequestStatusError from "./report/reportRequestStatusError";
import reportRequestBizError from "./report/reportRequestBizError";
import { NO_REPORT_STATUS } from "../config";

// function checkStatus(status, url, options = {}) {
//   let _isError = true;
//   if ((status >= 200 && status < 300) || NO_REPORT_STATUS.includes(status)) {
//     _isError = false;
//   }
//   _isError && reportRequestStatusError(status, url, options);
//   return _isError;
// }

function checkError(xhr, options = {}) {
  try {
    const status = xhr?.status;
    const url = xhr?.responseURL;

    if ((status < 200 || status >= 300) && !NO_REPORT_STATUS.includes(status)) {
      const headersObj = {};

      // get all headers
      try {
        const headers = xhr.getAllResponseHeaders();
        if (typeof headers === "string") {
          headers.split("\r\n").forEach((header) => {
            if (header) {
              const [key, value] = header.split(": ");
              headersObj[key] = value;
            }
          });
        }
      } catch (e) {}

      reportRequestStatusError(status, url, options, headersObj);
    }

    // const url = xhr?.responseURL;

    // console.log("xhr", xhr);

    // const _status = checkStatus(xhr?.status, url, options);
    // if (_status) {
    //   return;
    // }
    // const json = JSON.parse(xhr?.response);

    // // 有 success，并且为 false，才上报。防止不是我们的请求被上报上去了。
    // if (json?.success === false && `${json?.code}` !== "401") {
    //   reportRequestBizError(json?.code, url, options, json);
    // }
  } catch (e) {
    console.log(e);
  }
}

function newXhr() {
  const OriginalXMLHttpRequest = XMLHttpRequest;
  function ModifiedXMLHttpRequest() {
    const xhr = new OriginalXMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState === 4) {
        checkError(xhr, xhr?.__sentry_xhr__);
      }
    });
    return xhr;
  }
  ModifiedXMLHttpRequest.prototype = OriginalXMLHttpRequest.prototype;
  window.XMLHttpRequest = ModifiedXMLHttpRequest;
}

export default newXhr;
