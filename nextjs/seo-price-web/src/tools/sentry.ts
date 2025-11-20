/**
 * Owner: willen@kupotech.com
 */
// 上报只在线上环境
import * as sentry from "@sentry/nextjs";
import { captureException } from "@sentry/nextjs";

/**
 * 自定义异常
 */

//上报websocket重连5次异常
export function checkWsConnectError() {
  captureException({
    message: `websocket: 重连5次依然失败`,
    level: "error",
    tags: {
      requestError: "websocketError",
    },
    fingerprint: "websocket连接异常",
  });
}


export function reportPriceKlineError(error, state = {}) {
  try {
    // TODO 确认怎么调用configureScope
    // sentry.configureScope((scope) => {
    //   scope.setFingerprint(`币种详情 K 线渲染异常:${window.location.href}`);
    // });
    sentry.captureException({
      message: "币种详情 K 线渲染异常",
      level: "error",
      tags: {
        errorType: "price_kline_error",
      },
      extra: {
        state,
        error,
      },
    });
  } catch (e) {
    console.log(e);
  }
}


export function reportApiError(msg, error, extra = {}) {
  try {
    // 过滤掉：客户端原因导致 & 标记不上报的接口错误
    if (
      error?.name === "TypeError" ||
      error?.name === "AbortError" ||
      error?._no_sentry
    ) {
      return;
    }

    sentry.captureException({
      message: `【API】${
        error?.status ? `【${error?.status}】` : ""
      }ERROR: ${msg}`,
      level: "error",
      tags: {
        errorType: "api_error",
      },
      extra: {
        ...extra,
        error,
      },
    });
  } catch (e) {
    console.log(e);
  }
}
